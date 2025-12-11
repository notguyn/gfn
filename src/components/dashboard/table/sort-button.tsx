import { Button } from "@/components/ui/button";
import type { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";

interface SortButtonProps<TData> {
	column: Column<TData, unknown>;
	name: string;
}

export default function SortButton<TData>({
	column,
	name,
}: SortButtonProps<TData>) {
	return (
		<Button
			variant="ghost"
			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
		>
			{name}
			{column.getIsSorted() === "asc" && (
				<ArrowUpIcon className="ml-2 h-4 w-4" />
			)}
			{column.getIsSorted() === "desc" && (
				<ArrowDownIcon className="ml-2 h-4 w-4" />
			)}
			{!column.getIsSorted() && <ChevronsUpDownIcon className="ml-2 h-4 w-4" />}
		</Button>
	);
}
