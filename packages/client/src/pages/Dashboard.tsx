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

const data = [
	{
		userId: "b3f271ef-e73b-4c12-ad85-665c3686017a",

		transactionTime: "2024-04-26T10:23:54.222Z",
		merchantIconUrl: "http://localhost:3000/static/mi-aws.png",
		merchantName: "Amazon Web Services",
		amount: "-420.73",
		currency: "USD",
		status: "PENDING",
	},
	{
		userId: "f757b26e-444b-45d0-b5a7-e8944a36d70a",

		transactionTime: "2024-04-09T07:49:28.393Z",
		merchantIconUrl: "http://localhost:3000/static/mi-sharenow.png",
		merchantName: "Share Now",
		amount: "-203.63",
		currency: "EUR",
		status: "PENDING",
	},
	{
		userId: "f757b26e-444b-45d0-b5a7-e8944a36d70a",

		transactionTime: "2024-04-06T22:53:11.500Z",
		merchantIconUrl: "http://localhost:3000/static/mi-github.png",
		merchantName: "Github",
		amount: "-393.72",
		currency: "USD",
		status: "PENDING",
	},
	{
		userId: "b3f271ef-e73b-4c12-ad85-665c3686017a",

		transactionTime: "2024-04-04T18:51:02.774Z",
		merchantIconUrl: "http://localhost:3000/static/mi-figma.png",
		merchantName: "Figma",
		amount: "-144.03",
		currency: "USD",
		status: "PENDING",
	},
	{
		userId: "b3f271ef-e73b-4c12-ad85-665c3686017a",

		transactionTime: "2024-03-24T09:09:34.433Z",
		merchantIconUrl: "http://localhost:3000/static/mi-lieferando.png",
		merchantName: "Lieferando",
		amount: "-410.28",
		currency: "EUR",
		status: "PENDING",
	},
	{
		userId: "f757b26e-444b-45d0-b5a7-e8944a36d70a",

		transactionTime: "2024-03-10T08:36:27.367Z",
		merchantIconUrl: "http://localhost:3000/static/mi-github.png",
		merchantName: "Github",
		amount: "-656.91",
		currency: "USD",
		status: "PENDING",
	},
	{
		userId: "b3f271ef-e73b-4c12-ad85-665c3686017a",

		transactionTime: "2024-03-03T17:49:13.941Z",
		merchantIconUrl: "http://localhost:3000/static/mi-zendesk.png",
		merchantName: "ZenDesk",
		amount: "-581.61",
		currency: "EUR",
		status: "PENDING",
	},
	{
		userId: "b3f271ef-e73b-4c12-ad85-665c3686017a",

		transactionTime: "2024-01-21T14:39:42.505Z",
		merchantIconUrl: "http://localhost:3000/static/mi-lieferando.png",
		merchantName: "Lieferando",
		amount: "-636.52",
		currency: "USD",
		status: "SUBMITTED",
	},
	{
		userId: "f757b26e-444b-45d0-b5a7-e8944a36d70a",

		transactionTime: "2023-10-31T15:08:39.934Z",
		merchantIconUrl: "http://localhost:3000/static/mi-slack.png",
		merchantName: "Slack",
		amount: "-717.91",
		currency: "EUR",
		status: "SUBMITTED",
	},
];
function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value]);

	return (
		<input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}
function Filter({ column }: { column: Column<any, unknown> }) {
	const columnFilterValue = column.getFilterValue();
	const { filterVariant } = column.columnDef.meta ?? {};

	return filterVariant === "range" ? (
		<div>
			<div className="flex space-x-2">
				{/* See faceted column filters example for min max values functionality */}
				<DebouncedInput
					type="number"
					value={(columnFilterValue as [number, number])?.[0] ?? ""}
					onChange={(value) =>
						column.setFilterValue((old: [number, number]) => [value, old?.[1]])
					}
					placeholder={`Min`}
					className="w-24 border shadow rounded"
				/>
				<DebouncedInput
					type="number"
					value={(columnFilterValue as [number, number])?.[1] ?? ""}
					onChange={(value) =>
						column.setFilterValue((old: [number, number]) => [old?.[0], value])
					}
					placeholder={`Max`}
					className="w-24 border shadow rounded"
				/>
			</div>
			<div className="h-1" />
		</div>
	) : filterVariant === "select" ? (
		<select
			onChange={(e) => column.setFilterValue(e.target.value)}
			value={columnFilterValue?.toString()}
		>
			{/* See faceted column filters example for dynamic select options */}
			<option value="">All</option>
			<option value="complicated">complicated</option>
			<option value="relationship">relationship</option>
			<option value="single">single</option>
		</select>
	) : (
		<DebouncedInput
			className="w-36 border shadow rounded"
			onChange={(value) => column.setFilterValue(value)}
			placeholder={`Search...`}
			type="text"
			value={(columnFilterValue ?? "") as string}
		/>
		// See faceted column filters example for datalist search suggestions
	);
}

const Dashboard = () => {
	const navigate = useNavigate();
	const { token, setToken } = useToken();
	const [smeId, setSmeId] = useState("");
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const columns = useMemo<ColumnDef<Person, any>[]>(
		() => [
			{
				accessorKey: "merchantName",
				header: "Name",
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "merchantIconUrl",
				header: () => <span>merchantIconUrl</span>,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "status",
				header: () => <span>status</span>,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: "transactionTime",
				header: () => "Date",
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "amount",
				header: () => <span>amount</span>,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "currency",
				header: () => <span>currency</span>,
				cell: (info) => info.getValue(),
			},
		],
		[],
	);
	const table = useReactTable({
		data,
		columns,
		filterFns: {},
		state: {
			columnFilters,
		},
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(), //client side filtering
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		debugTable: true,
		debugHeaders: true,
		debugColumns: false,
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
				console.log("res", res);
				setSmeId(res.data.id);
				return res;
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
					`http://localhost:3000/transactions?userId=${smeId}&status=PENDING`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					},
				);

				console.log("res", res);
				return res;
			} catch (error) {
				console.log(error);
			}
		};
		fetchTransactionsFromSme();
	}, []);
	return (
		<Layout handleLogout={handleLogout}>
			<h2>Dashboard</h2>
			<table>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								console.log(header);
								return (
									<th key={header.id} colSpan={header.colSpan}>
										{header.isPlaceholder ? null : (
											<>
												<div
												// {...{
												// 	className: header.column.getCanSort()
												// 		? "cursor-pointer select-none"
												// 		: "",
												// 	onClick: header.column.getToggleSortingHandler(),
												// }}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{/* {{
														asc: " 🔼",
														desc: " 🔽",
													}[header.column.getIsSorted() as string] ?? null} */}
												</div>
												{header.column.id === "status" &&
												header.column.getCanFilter() ? (
													<div>
														<Filter column={header.column} />
													</div>
												) : null}
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
		</Layout>
	);
};

export default Dashboard;
