import {
    Box,
    CircularProgress,
    Drawer,
    IconButton,
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
import { FormatDate } from '../utils/formatDate';

interface ITransactionsData {
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
    const [hoveredCell, setHoveredCell] = useState(false);
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const { isFetchError, setIsFetchError } = useContext(ErrorContext);
    const [headerColumn, setHeaderColumn] = useState();
    const [loading, setLoading] = useState(true);
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const toggleDrawer = (newOpen: boolean) => () => {
        setIsDrawerOpen(newOpen);
    };

    const columns = useMemo<MRT_ColumnDef<ITransactionsData, any>[]>(
        () => [
            {
                id: 'name',
                accessorKey: 'merchantName',
                header: 'Name',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableColumnFilterModes: false,
                enableGlobalFilter: false,
                enableSorting: false,
                enableHiding: false,
                enableColumnActions: false,
            },
            {
                id: 'merchant',
                accessorKey: 'merchantIconUrl',
                header: 'Merchant',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableGlobalFilter: false,
                enableSorting: false,
                enableHiding: false,
                enableColumnActions: false,
            },
            {
                id: 'status',
                accessorKey: 'status',
                header: 'Status',
                enableColumnFilter: true,
                enableFilterMatchHighlighting: true,
                enableGlobalFilter: true,
                enableSorting: false,
                enableHiding: false,
                enableColumnActions: false,
            },

            {
                id: 'date',
                accessorKey: 'transactionTime',
                header: 'Date',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableGlobalFilter: false,
                enableSorting: false,
                enableHiding: false,
                enableColumnActions: false,
            },
            {
                id: 'amount',
                accessorFn: (row) => `${row.amount} ${row.currency}`,
                header: 'Amount',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableGlobalFilter: false,
                enableSorting: false,
                enableHiding: false,
                enableColumnActions: false,
            },
        ],
        []
    );
    const table = useMaterialReactTable({
        columns,
        data: transactionsData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        enableStickyFooter: false,
        enableBottomToolbar: false,
        enableTopToolbar: true,
        renderRowActions: ({ row }) => {
            return (
                <Box>
                    <Box onClick={() => console.log(row.original)}>HEYYYY</Box>
                </Box>
            );
        },

        // enableRowSelection: true,
        // muiTableBodyRowProps: ({ row, staticRowIndex, table }) => ({
        // 	onClick: (event) => {
        // 		getMRT_RowSelectionHandler({ row, staticRowIndex, table })(event), sx;
        // 		:
        // 		cursor: "pointer";
        // 		,
        // 	},
        // }),
        muiTableBodyRowProps: ({ row }) => ({
            onClick: (event) => {
                // console.log('event.target.name', event.target);
                console.info(event, row.id);
            },
            sx: {
                cursor: 'pointer', //you might want to change the cursor too when adding an onClick
            },
        }),
        // enableFilters: true,
        initialState: { showGlobalFilter: true },
        // renderToolbarInternalActions: ({ table }) => (
        //     <>
        //         <MRT_GlobalFilterTextField table={table} />
        //     </>
        // ),
    });
    const handleLogout = () => {
        navigate('/login');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('sme-name');
    };
    // console.log('rowSelection', rowSelection);

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

    const handleOnClickRow = (
        e: React.MouseEvent<HTMLButtonElement>,
        rowId: string
    ) => {
        console.log('e', e);
        console.log('rowId', rowId);
    };

    return (
        <Layout handleLogout={handleLogout}>
            {/* <Box display="flex" width="100%">
                <Typography variant="h5">Dashboard</Typography>
            </Box> */}
            {/* <button type="button" onClick={() => setIsDrawerOpen(true)}>
                toggle drawer
            </button>
            <Drawer open={isDrawerOpen} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer> */}
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
