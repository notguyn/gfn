"use client";

import {
	type ColumnDef,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useRole } from "@/providers/role-provider";
import { PlusIcon, Settings2Icon } from "lucide-react";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data: initialData,
}: DataTableProps<TData, TValue>) {
	const router = useRouter();
	const { role } = useRole();
	const searchParams = useSearchParams();
	const currentPage = Number(searchParams.get("page")) || 1;

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [globalFilter, setGlobalFilter] = useState("");
	const [data, setData] = useState(initialData);

	// Effect to handle sorting
	useEffect(() => {
		if (sorting.length) {
			const sortedData = [...initialData].sort((a, b) => {
				for (const sort of sorting) {
					const column = columns.find(
						(col) => "accessorKey" in col && col.accessorKey === sort.id,
					);
					if (column && "accessorKey" in column) {
						const aValue = a[column.accessorKey as keyof TData];
						const bValue = b[column.accessorKey as keyof TData];
						if (aValue < bValue) return sort.desc ? 1 : -1;
						if (aValue > bValue) return sort.desc ? -1 : 1;
					}
				}
				return 0;
			});
			setData(sortedData);
		} else {
			setData(initialData);
		}
	}, [sorting, initialData, columns]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			globalFilter,
			pagination: {
				pageIndex: currentPage - 1,
				pageSize: 5,
			},
		},
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: "includesString",
	});

	const filteredRows = table.getFilteredRowModel().rows;
	const pageSize = 5;
	const totalPages = Math.ceil(filteredRows.length / pageSize);
	const paginatedRows = filteredRows.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const goToPage = (page: number) => {
		router.push(`/dashboard/soldiers?page=${page}`);
	};

	return (
		<div>
			<div className="flex items-center py-4">
				<Input
					placeholder="Search..."
					value={globalFilter ?? ""}
					onChange={(e) => {
						setGlobalFilter(e.target.value);
						goToPage(1);
					}}
					className="max-w-sm"
				/>
				<div className="flex items-center space-x-2 ml-auto">
					{role === "commander" && (
						<Link href="/dashboard/soldiers/add">
							<Button className="ml-auto">
								Add soldier
								<PlusIcon className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								View
								<Settings2Icon className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{paginatedRows.length ? (
							paginatedRows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<Pagination className="mt-4">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href={`/dashboard/soldiers?page=${currentPage - 1}`}
							onClick={(e) => {
								e.preventDefault();
								if (currentPage > 1) goToPage(currentPage - 1);
							}}
							className={
								currentPage <= 1 ? "pointer-events-none opacity-50" : ""
							}
						/>
					</PaginationItem>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map(
						(pageNumber) => (
							<PaginationItem key={`page-${pageNumber}`}>
								<PaginationLink
									href={`/dashboard/soldiers?page=${pageNumber}`}
									isActive={currentPage === pageNumber}
									onClick={(e) => {
										e.preventDefault();
										goToPage(pageNumber);
									}}
								>
									{pageNumber}
								</PaginationLink>
							</PaginationItem>
						),
					)}
					<PaginationItem>
						<PaginationNext
							href={`/dashboard/soldiers?page=${currentPage + 1}`}
							onClick={(e) => {
								e.preventDefault();
								if (currentPage < totalPages) goToPage(currentPage + 1);
							}}
							className={
								currentPage >= totalPages
									? "pointer-events-none opacity-50"
									: ""
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
