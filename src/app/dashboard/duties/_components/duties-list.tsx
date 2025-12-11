"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createDuty, deleteDuty } from "@/lib/duty-actions";
import { useRole } from "@/providers/role-provider";
import { DutyZodSchema } from "@/types/Duty";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

interface DutiesListProps {
	duties: any[];
}

export function DutiesList({ duties }: DutiesListProps) {
	const { toast } = useToast();
	const { role } = useRole();
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm<z.infer<typeof DutyZodSchema>>({
		resolver: zodResolver(DutyZodSchema),
		defaultValues: {
			name: "",
			description: "",
			points: 1,
			color: "#3b82f6",
		},
	});

	async function onSubmit(data: z.infer<typeof DutyZodSchema>) {
		const result = await createDuty(data);
		if (result.success) {
			toast({ title: "Duty created successfully" });
			setIsOpen(false);
			form.reset();
		} else {
			toast({
				variant: "destructive",
				title: "Error",
				description: result.data,
			});
		}
	}

	async function handleDelete(id: string) {
		if (confirm("Are you sure you want to delete this duty?")) {
			const result = await deleteDuty(id);
			if (result.success) {
				toast({ title: "Duty deleted successfully" });
			} else {
				toast({
					variant: "destructive",
					title: "Error",
					description: result.data,
				});
			}
		}
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Duties</CardTitle>
					<CardDescription>Available duties to assign</CardDescription>
				</div>
				{role === "commander" && (
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger asChild>
							<Button size="sm">
								<Plus className="h-4 w-4" />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create New Duty</DialogTitle>
							</DialogHeader>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-4"
								>
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input placeholder="e.g. Guard Duty" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="points"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Points</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														onChange={(e) =>
															field.onChange(Number(e.target.value))
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="color"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Color</FormLabel>
												<FormControl>
													<div className="flex items-center gap-2">
														<Input
															type="color"
															className="w-12 h-10 p-1"
															{...field}
														/>
														<span className="text-sm text-muted-foreground">
															{field.value}
														</span>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type="submit" className="w-full">
										Create Duty
									</Button>
								</form>
							</Form>
						</DialogContent>
					</Dialog>
				)}
			</CardHeader>
			<CardContent className="space-y-2">
				{duties.length === 0 && (
					<p className="text-sm text-muted-foreground text-center py-4">
						No duties defined yet.
					</p>
				)}
				{duties.map((duty) => (
					<div
						key={duty._id}
						className="flex items-center justify-between p-3 border rounded-md"
					>
						<div className="flex items-center gap-3">
							<div
								className="w-3 h-3 rounded-full"
								style={{ backgroundColor: duty.color }}
							/>
							<div>
								<p className="font-medium text-sm">{duty.name}</p>
								<p className="text-xs text-muted-foreground">
									{duty.points} points
								</p>
							</div>
						</div>
						{role === "commander" && (
							<Button
								variant="ghost"
								size="sm"
								className="text-red-500 hover:text-red-600 hover:bg-red-50"
								onClick={() => handleDelete(duty._id)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						)}
					</div>
				))}
			</CardContent>
		</Card>
	);
}
