import { Box, CircularProgress, Drawer, Typography } from '@mui/material';

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
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Filter } from '../components/dashboard-components';
import ErrorContext from '../context/context';
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
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const toggleDrawer = (newOpen: boolean) => () => {
        setIsDrawerOpen(newOpen);
    };

    const columns = useMemo<MRT_ColumnDef<ITransactionsData, any>[]>(
        () => [
            {
                accessorKey: 'merchantName',
                header: 'Name',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableColumnFilterModes: false,
                enableGlobalFilter: false,
            },
            {
                accessorKey: 'merchantIconUrl',
                header: 'Merchant',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableGlobalFilter: false,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                enableColumnFilter: true,
                enableFilterMatchHighlighting: true,
                enableGlobalFilter: true,
            },

            {
                accessorKey: 'transactionTime',
                header: 'Date',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableGlobalFilter: false,
            },
            {
                id: 'amount',
                accessorFn: (row) => `${row.amount} ${row.currency}`,
                header: 'Amount',
                enableColumnFilter: false,
                enableFilterMatchHighlighting: false,
                enableGlobalFilter: false,
            },
        ],
        []
    );
    const table = useMaterialReactTable({
        columns,
        data: transactionsData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
                setIsFetchError(Boolean(error.response.data.message));
                setLoading(false);
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
            <Box display="flex" width="100%">
                <Typography variant="h5">Dashboard</Typography>
            </Box>
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
                    <MaterialReactTable table={table} />;
                </>
            )}
        </Layout>
    );
};

export default Dashboard;
