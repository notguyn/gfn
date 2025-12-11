"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { IInspection } from "@/types/Inspection";
import type { ISoldier } from "@/types/Soldier";
import type { ColumnDef } from "@tanstack/react-table";
import SortButton from "../table/sort-button";
import ActionsCell from "./actions-cell";

export const columns: ColumnDef<IInspection>[] = [
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
		id: "soldierName",
		header: "Soldier",
		cell: ({ row }) => {
			const soldier = row.original.soldierId as unknown as ISoldier;
			return soldier?.name || "Unknown";
		},
	},
	{
		accessorKey: "date",
		header: ({ column }) => <SortButton column={column} name="Date" />,
		cell: ({ row }) => {
			const date = new Date(row.original.date);
			return date.toLocaleDateString("en-IL");
		},
		enableSorting: true,
	},
	{
		accessorKey: "type",
		header: "Type",
	},
	{
		accessorKey: "passed",
		header: "Passed",
		cell: ({ row }) => {
			const passed = row.original.passed;
			return (
				<Badge variant={passed ? "default" : "destructive"}>
					{passed ? "Pass" : "Fail"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "notes",
		header: "Notes",
	},
	{
		id: "actions",
		cell: ({ row }) => <ActionsCell inspection={row.original} />,
	},
];
