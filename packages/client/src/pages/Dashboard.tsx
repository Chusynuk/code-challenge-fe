import CircularProgress from "@mui/material/CircularProgress";
import {
	type Column,
	type ColumnDef,
	type ColumnFiltersState,
	RowData,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import useToken from "../hooks/useToken";
import { FormatDate } from "../utils/formatDate";

interface ITransactionsData {
	merchantName: string;
	merchantIconUrl: string;
	status: string;
	transactionTime: string;
	amount: string;
	currency: string;
}
const DebouncedInput = ({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
	const [inputValue, setInputValue] = useState(initialValue);

	useEffect(() => {
		setInputValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(inputValue);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [inputValue]);

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setInputValue(event.target.value);

	return <input {...props} value={inputValue} onChange={handleOnChange} />;
};
const Filter = ({ column }: { column: Column<any, unknown> }) => {
	const columnFilterValue = column.getFilterValue();

	return (
		<DebouncedInput
			onChange={(value) => column.setFilterValue(value)}
			placeholder={"Search status..."}
			type="text"
			value={(columnFilterValue ?? "") as string}
		/>
	);
};

const Dashboard = () => {
	const navigate = useNavigate();
	const { token, setToken } = useToken();
	const [smeId, setSmeId] = useState("");
	const [transactionsData, settransactionsData] = useState([]);

	const [loading, setLoading] = useState(true);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const columns = useMemo<ColumnDef<ITransactionsData, any>[]>(
		() => [
			{
				accessorKey: "merchantName",
				header: "Name",
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "merchantIconUrl",
				header: "merchantIconUrl",
				cell: (info) => (
					<img alt="icon" width="20px" height="20px" src={info.getValue()} />
				),
			},
			{
				accessorKey: "status",
				header: "status",
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: "transactionTime",
				header: "Date",
				cell: (info) => FormatDate(info.getValue()),
			},
			{
				id: "amount",
				accessorFn: (row) => `${row.amount} ${row.currency}`,
				header: "amount",
				cell: (info) => info.getValue(),
			},
		],
		[],
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
		navigate("/login");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("email");
	};

	useEffect(() => {
		const fetchSme = async () => {
			try {
				const res = await axios.get("http://localhost:3000/sme-data", {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});
				sessionStorage.setItem("sme-name", res.data.legalName);

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
							"Content-Type": "application/json",
						},
					},
				);
				settransactionsData(res.data.data);

				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		fetchTransactionsFromSme();
	}, []);
	return (
		<Layout handleLogout={handleLogout}>
			<h2>Dashboard</h2>
			{loading ? (
				<CircularProgress />
			) : (
				<table>
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<th key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder ? null : (
												<>
													{header.column.id === "status" &&
													header.column.getCanFilter() ? (
														<div>
															<Filter column={header.column} />
														</div>
													) : null}
													<div>
														{flexRender(
															header.column.columnDef.header,
															header.getContext(),
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
											<td key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
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
