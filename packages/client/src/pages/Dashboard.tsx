import { Box, Drawer, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
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
    const { isFetchError, setIsFetchError } = useContext(ErrorContext);
    const [loading, setLoading] = useState(true);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const toggleDrawer = (newOpen: boolean) => () => {
        setIsDrawerOpen(newOpen);
    };

    const columns = useMemo<ColumnDef<ITransactionsData, any>[]>(
        () => [
            {
                accessorKey: 'merchantName',
                header: () => <Typography>Name</Typography>,
                cell: (info) => info.getValue(),
                size: 150,
            },
            {
                accessorKey: 'merchantIconUrl',
                header: () => <Typography>Merchant</Typography>,
                cell: (info) => (
                    <img
                        alt="icon"
                        width="20px"
                        height="20px"
                        src={info.getValue()}
                    />
                ),
                size: 150,
            },
            {
                accessorKey: 'status',
                header: () => <Typography>Status</Typography>,
                cell: (info) => info.getValue(),
                size: 150,
            },

            {
                accessorKey: 'transactionTime',
                header: () => <Typography>Date</Typography>,
                cell: (info) => FormatDate(info.getValue()),
                size: 150,
            },
            {
                id: 'amount',
                accessorFn: (row) => `${row.amount} ${row.currency}`,
                header: () => <Typography>Amount</Typography>,
                cell: (info) => info.getValue(),
                size: 150,
            },
        ],
        []
    );
    const table = useReactTable({
        data: transactionsData,
        columns,
        filterFns: {},
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
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

    console.log('isFetchError', isFetchError);
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
                <table
                    style={{
                        width: '100%',
                        border: '2px solid black',
                        borderRadius: '5px',
                        backgroundColor: '#d3d3d3',
                        // boxShadow: '10px -4px 5px 0px rgba(0,0,0,0.75)',
                    }}
                >
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{ width: '120px' }}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <>
                                                    {header.column.id ===
                                                    'status' ? (
                                                        <Filter
                                                            column={
                                                                header.column
                                                            }
                                                        />
                                                    ) : null}
                                                    <div>
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <td
                                                key={cell.id}
                                                style={{
                                                    textAlign: 'center',
                                                    backgroundColor: hoveredCell
                                                        ? 'red'
                                                        : 'transparent',
                                                }}
                                            >
                                                <Typography variant="button">
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext()
                                                    )}
                                                </Typography>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </Layout>
    );
};

export default Dashboard;
