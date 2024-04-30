import {
    Box,
    CircularProgress,
    Drawer,
    TableHead,
    Typography,
} from '@mui/material';

import axios from 'axios';
import {
    type MRT_ColumnDef,
    type MRT_RowSelectionState,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Sidebar } from '../components/dashboard-components/Sidebar';
import { ErrorContext } from '../context/context';
import useToken from '../hooks/useToken';
import { FormatDate } from '../utils/DateFormatter';

interface ITransactionsData {
    id: string;
    merchantName: string;
    merchantIconUrl: string;
    status: string;
    transactionTime: string;
    amount: string;
    currency: string;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const { token, setToken } = useToken();
    const [smeId, setSmeId] = useState('');
    const [transactionsData, setTransactionsData] = useState([]);
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [rowArraySelected, setRowArraySelected] = useState(null);
    const [fetchedUsers, setFetchedUsers] = useState();

    const { setHasError, setErrorMessage } = useContext(ErrorContext);

    const [loading, setLoading] = useState(true);

    const columns = useMemo<MRT_ColumnDef<ITransactionsData, any>[]>(
        () => [
            {
                id: '0',
                accessorKey: 'merchantName',
                header: 'Name',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableColumnFilterModes: false,
                enableGlobalFilter: false,
                enableSorting: false,
                enableColumnActions: false,
            },
            {
                id: '1',
                accessorKey: 'merchantIconUrl',
                header: 'Merchant',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableGlobalFilter: false,
                enableSorting: false,
                enableColumnActions: false,
                Cell: ({ cell }) => {
                    return (
                        <img
                            alt="icon"
                            width="25px"
                            height="25px"
                            src={cell.getValue()}
                        />
                    );
                },
            },
            {
                id: '2',
                accessorKey: 'status',
                header: 'Status',
                enableColumnFilter: true,
                enableFilterMatchHighlighting: true,
                enableGlobalFilter: true,
                enableSorting: false,
                filterVariant: 'select',
                filterSelectOptions: ['PENDING', 'REJECTED', 'COMPLETED'],
            },

            {
                id: '3',
                accessorKey: 'transactionTime',
                header: 'Date',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableGlobalFilter: false,
                enableSorting: false,
                enableColumnActions: false,
                Cell: ({ cell }) => (
                    <Typography>{FormatDate(cell.getValue())}</Typography>
                ),
            },
            {
                id: '4',
                accessorFn: (row) => `${row.amount} ${row.currency}`,
                header: 'Amount',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableGlobalFilter: false,
                enableSorting: false,
                enableColumnActions: false,
            },
        ],
        []
    );
    const table = useMaterialReactTable({
        columns,
        data: transactionsData,
        enableStickyFooter: false,
        enableBottomToolbar: false,
        enableTopToolbar: true,
        enableRowSelection: false,
        enableMultiRowSelection: false,

        muiTableBodyRowProps: ({ staticRowIndex }) => ({
            onClick: () => {
                setRowArraySelected(staticRowIndex);
            },

            sx: {
                cursor: 'pointer',
                backgroundColor:
                    rowArraySelected === staticRowIndex ? 'lightgray' : 'white',
            },
        }),
    });

    const handleLogout = () => {
        navigate('/login');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('sme-name');
    };

    useEffect(() => {
        const fetchSme = async () => {
            try {
                const res = await axios.get('http://localhost:3000/sme-data', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                sessionStorage.setItem('sme-name', res.data.legalName);

                setSmeId(res.data.id);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                    setHasError(Boolean(error));
                    setLoading(false);
                }
            }
        };
        fetchSme();
    }, [token, setErrorMessage, setHasError]);

    useEffect(() => {
        const fetchTransactionsFromSme = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3000/transactions?userId=${smeId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                setTransactionsData(res.data.data);
                setLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                    setHasError(Boolean(error));
                    setLoading(false);
                }
            }
        };
        fetchTransactionsFromSme();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:3000/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setFetchedUsers(res.data);
                setLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                    setHasError(Boolean(error));
                    setLoading(false);
                }
            }
        };
        fetchUsers();
    }, [setErrorMessage, setHasError, token]);

    const selectedTransation = transactionsData[rowArraySelected];
    const user = selectedTransation
        ? fetchedUsers.find((user) => user.id === selectedTransation.userId)
        : null;

    return (
        <Layout handleLogout={handleLogout}>
            <Drawer
                anchor="right"
                open={rowArraySelected !== null}
                onClose={() => setRowArraySelected(null)}
            >
                {rowArraySelected !== null && (
                    <Sidebar
                        user={user.name}
                        transactionData={transactionsData[rowArraySelected]}
                    />
                )}
            </Drawer>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <TableHead>
                        <Typography variant="h5">Dashboard</Typography>
                    </TableHead>
                    <Box width="fill-available">
                        <MaterialReactTable table={table} />
                    </Box>
                    ;
                </>
            )}
        </Layout>
    );
};

export default Dashboard;
