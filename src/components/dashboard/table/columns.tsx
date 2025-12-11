"use client";

import ActionsCell from "@/components/dashboard/table/actions-cell";
import { Checkbox } from "@/components/ui/checkbox";
import type { ISoldier } from "@/types/Soldier";
import type { ColumnDef } from "@tanstack/react-table";
import SortButton from "./sort-button";

export const columns: ColumnDef<ISoldier>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "sid",
		header: "Soldier ID",
	},
	{
		accessorKey: "name",
		header: ({ column }) => <SortButton column={column} name="Name" />,
		enableSorting: true,
	},
	{
		accessorKey: "rank",
		header: ({ column }) => <SortButton column={column} name="Rank" />,
		enableSorting: true,
	},
	{
		accessorKey: "joinDate",
		header: ({ column }) => <SortButton column={column} name="Join Date" />,
		cell: ({ row }) => {
			const date = new Date(row.original.joinDate);
			return date.toLocaleDateString("en-IL");
		},
		enableSorting: true,
	},
	{
		id: "actions",
		cell: ({ row }) => <ActionsCell soldier={row.original} />,
	},
];
