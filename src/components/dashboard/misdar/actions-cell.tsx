"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { deleteInspection } from "@/lib/inspection-actions";
import { MoreHorizontal, Trash2Icon } from "lucide-react";

export default function ActionsCell({ inspection }: any) {
	const { toast } = useToast();

	const handleDelete = async () => {
		try {
			const response = await deleteInspection(inspection._id);
			if (response.success) {
				toast({
					title: "Inspection deleted!",
					description: "The inspection has been deleted successfully.",
				});
			} else {
				toast({
					variant: "destructive",
					title: "Deletion failed!",
					description: response.data,
				});
			}
		} catch (error: any) {
			toast({
				variant: "destructive",
				title: "Deletion failed!",
				description: error?.message,
			});
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<DropdownMenuItem
							className="text-red-600 cursor-pointer"
							onSelect={(e) => e.preventDefault()}
						>
							<Trash2Icon className="mr-2 h-4 w-4" />
							Delete Inspection
						</DropdownMenuItem>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Inspection?</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete this inspection? This action
								cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDelete}
								className="bg-red-600 hover:bg-red-700"
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
