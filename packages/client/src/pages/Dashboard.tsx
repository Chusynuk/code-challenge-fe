import {
    Box,
    CircularProgress,
    Drawer,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';

import TableHead from '@mui/material/TableHead';
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import {
    type MRT_ColumnDef,
    MRT_FilterTextField,
    MRT_FilterTextFieldProps,
    MRT_GlobalFilterTextField,
    type MRT_RowSelectionState,
    MaterialReactTable,
    getMRT_RowSelectionHandler,
    useMaterialReactTable,
} from 'material-react-table';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Filter } from '../components/dashboard-components';
import { ErrorContext } from '../context/context';
import useToken from '../hooks/useToken';
import { FormatDate } from '../utils/DateFormatter';
import { Sidebar } from '../components/dashboard-components/Sidebar';

interface ITransactionsData {
    id: string;
    merchantName: string;
    merchantIconUrl: string;
    status: string;
    transactionTime: string;
    amount: string;
    currency: string;
}

enum TransactionState {
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
    REVERSED = 'REVERSED',
}

const Dashboard = () => {
    const navigate = useNavigate();
    const { token, setToken } = useToken();
    const [smeId, setSmeId] = useState('');
    const [transactionsData, setTransactionsData] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string>('');
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [rowArraySelected, setRowArraySelected] = useState(null);
    const [fetchedUsers, setFetchedUsers] = useState();

    const { isFetchError, setIsFetchError } = useContext(ErrorContext);

    const [loading, setLoading] = useState(true);
    const toggleDrawer = (newOpen: boolean) => () => {
        setIsDrawerOpen(newOpen);
    };
    console.log(selectedRowId);
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
                // enableHiding: false,
                // enableColumnActions: false,
                // Cell: ({ cell, row }) => {
                //     console.log('row', row);
                // },
            },
            {
                id: '1',
                accessorKey: 'merchantIconUrl',
                header: 'Merchant',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableGlobalFilter: false,
                enableSorting: false,
                // enableHiding: false,
                // enableColumnActions: false,
                Cell: ({ cell, row }) => {
                    return (
                        <img
                            width="25px"
                            height="25px"
                            src={cell.getValue()}
                        ></img>
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
                // enableHiding: false,
                // enableColumnActions: false,

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
                Cell: ({ cell }) => (
                    <Typography>{FormatDate(cell.getValue())}</Typography>
                ),
                // enableHiding: false,
                // enableColumnActions: false,
            },
            {
                id: '4',
                accessorFn: (row) => `${row.amount} ${row.currency}`,
                header: 'Amount',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableGlobalFilter: false,
                enableSorting: false,
                // enableHiding: false,
                // enableColumnActions: false,
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

        muiTableBodyRowProps: ({ row, staticRowIndex, table }) => ({
            onClick: () => {
                setRowArraySelected(staticRowIndex);
            },

            sx: {
                cursor: 'pointer',
                backgroundColor:
                    rowArraySelected === staticRowIndex ? 'red' : 'white',
            },
        }),

        // initialState: { showGlobalFilter: true },
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
                console.log(error);
            }
        };
        fetchSme();
    }, []);

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
                    setIsFetchError(Boolean(error));
                    setLoading(false);
                }
            }
        };
        fetchTransactionsFromSme();
    }, []);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('res', res);
                setFetchedUsers(res.data);

                setLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                    setIsFetchError(Boolean(error));
                    setLoading(false);
                }
            }
        };
        fetchUsers();
    }, []);
    console.log('fetchedUsers', fetchedUsers);
    // const handleOnClickRow = (
    //     e: React.MouseEvent<HTMLButtonElement>,
    //     rowId: string
    // ) => {
    //     console.log('e', e);
    //     console.log('rowId', rowId);
    // };

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
                    <Typography variant="h5">Dashboard</Typography>
                    <MaterialReactTable
                        // enablePagination={false}

                        table={table}
                    />
                    ;
                </>
            )}
        </Layout>
    );
};

export default Dashboard;
