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
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { deleteSoldier, updateSoldier } from "@/lib/action";
import { useRole } from "@/providers/role-provider";
import { SoldierZodSchema } from "@/types/Soldier";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

export default function ActionsCell({ soldier }: any) {
	const { toast } = useToast();
	const { role } = useRole();

	const form = useForm({
		resolver: zodResolver(SoldierZodSchema),
		defaultValues: {
			id: soldier._id,
			sid: soldier.sid,
			name: soldier.name,
			rank: soldier.rank,
			joinDate: new Date(soldier.joinDate),
			status: soldier.status,
		},
	});

	const handleSave = async (data: z.infer<typeof SoldierZodSchema>) => {
		if (!data.sid || !data.name || !data.rank || !data.joinDate) {
			return toast({
				variant: "destructive",
				title: "Invalid data!",
				description: "Please fill out all the fields.",
			});
		}

		data.joinDate = new Date(
			Date.UTC(
				data.joinDate.getFullYear(),
				data.joinDate.getMonth(),
				data.joinDate.getDate(),
			),
		);

		const dataWithId = {
			id: soldier._id,
			score: soldier.score,
			...data,
		};

		const updatedSoldier = await updateSoldier(dataWithId);

		if (!updatedSoldier.success) {
			toast({
				variant: "destructive",
				title: "Soldier update failed!",
				description: updatedSoldier.data,
			});
		} else {
			toast({
				title: "Soldier updated!",
				description: "The soldier has been updated successfully.",
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
				<DropdownMenuItem
					onClick={() => navigator.clipboard.writeText(soldier.sid)}
				>
					<CopyIcon className="mr-2 h-4 w-4" />
					Copy SID
				</DropdownMenuItem>
				{role === "commander" && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onSelect={(e) => {
								e.preventDefault();
								const editButton = document.getElementById(
									`edit-soldier-${soldier._id}`,
								);
								if (editButton) editButton.click();
							}}
						>
							<PencilIcon className="mr-2 h-4 w-4" />
							Edit Soldier
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-red-600"
							onSelect={(e) => {
								e.preventDefault();
								const deleteButton = document.getElementById(
									`delete-soldier-${soldier._id}`,
								);
								if (deleteButton) deleteButton.click();
							}}
						>
							<Trash2Icon className="mr-2 h-4 w-4 text-red-600" />
							Delete Soldier
						</DropdownMenuItem>
					</>
				)}
				<Dialog>
					<DialogTrigger asChild>
						<Button id={`edit-soldier-${soldier._id}`} className="hidden">
							Edit soldier
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit Soldier</DialogTitle>
							<DialogDescription>
								Make changes to the soldier&apos;s information here. Click save
								when you&apos;re done.
							</DialogDescription>
						</DialogHeader>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(handleSave)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="sid"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Soldier ID (SID)</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="rank"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Rank</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="joinDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Join Date</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className="w-full justify-start font-normal"
													>
														{field.value
															? field.value.toLocaleDateString("en-IL")
															: "Pick a date"}
														<div className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Controller
														control={form.control}
														name="joinDate"
														render={({ field: { onChange, value } }) => (
															<Calendar
																mode="single"
																selected={value}
																onSelect={(date) => onChange(date)}
															/>
														)}
													/>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>
								<DialogFooter>
									<Button type="submit">Save changes</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button id={`delete-soldier-${soldier._id}`} className="hidden">
							Delete soldier
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Soldier?</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete this soldier? This action cannot
								be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={async () => {
									try {
										const response = await deleteSoldier(soldier._id);
										if (response.success) {
											toast({
												title: "Soldier deleted!",
												description:
													"The soldier has been deleted successfully.",
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
								}}
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
