"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { RoleGuard } from "@/components/role-guard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { toast } from "@/components/ui/use-toast";
import { SoldierZodSchema } from "@/types/Soldier";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

const MultiSoldierSchema = z.object({
	soldiers: z.array(SoldierZodSchema),
});

type MultiSoldierForm = z.infer<typeof MultiSoldierSchema>;

export default function AddSoldiers() {
	return (
		<RoleGuard
			allowedRoles={["commander"]}
			fallback={
				<div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
					<AlertCircle className="h-16 w-16 text-destructive" />
					<h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
					<p className="text-muted-foreground">
						You do not have permission to add soldiers.
					</p>
					<Button asChild variant="outline">
						<Link href="/dashboard/soldiers">Back to Soldiers</Link>
					</Button>
				</div>
			}
		>
			<AddSoldiersContent />
		</RoleGuard>
	);
}

function AddSoldiersContent() {
	const router = useRouter();
	const form = useForm<MultiSoldierForm>({
		resolver: zodResolver(MultiSoldierSchema),
		defaultValues: {
			soldiers: [
				{
					sid: "",
					name: "",
					rank: "",
					joinDate: new Date(),
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "soldiers",
	});

	const [expandedSoldiers, setExpandedSoldiers] = useState<boolean[]>([true]);

	const toggleSoldier = (index: number) => {
		setExpandedSoldiers((prev) => {
			const newExpanded = [...prev];
			newExpanded[index] = !newExpanded[index];
			return newExpanded;
		});
	};

	const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			toggleSoldier(index);
		}
	};

	const onSubmit = async (data: MultiSoldierForm) => {
		const soldiersToCreate = data.soldiers.map((soldier) => ({
			...soldier,
			joinDate: new Date(
				Date.UTC(
					soldier.joinDate.getFullYear(),
					soldier.joinDate.getMonth(),
					soldier.joinDate.getDate(),
				),
			),
		}));

		try {
			const response = await fetch("/api/soldiers/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(soldiersToCreate),
			});

			const result = await response.json();

			if (response.ok) {
				toast({
					title: "Success!",
					description: "Soldiers were added successfully.",
				});
				router.push("/dashboard/soldiers");
				router.refresh();
			} else {
				toast({
					variant: "destructive",
					title: "Error",
					description: result.error || "Failed to add soldiers",
				});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to add soldiers",
			});
		}
	};

	const handleBack = () => {
		if (window.history.length > 2) router.back();
		else router.push("/dashboard/soldiers");
	};

	return (
		<>
			<Button onClick={handleBack} variant="outline" className="mt-4">
				Back
			</Button>
			<div className="flex justify-center items-center">
				<Card className="w-full max-w-2xl">
					<CardHeader>
						<CardTitle>Add New Soldiers</CardTitle>
						<CardDescription>
							Fill out the form to add multiple soldiers. Click on a
							soldier&apos;s header to expand or collapse their details.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								{fields.map((field, index) => (
									<div
										key={field.id}
										className="border rounded-md overflow-hidden"
									>
										<div
											className="flex justify-between items-center p-4 cursor-pointer"
											onClick={() => toggleSoldier(index)}
											onKeyDown={(e) => handleKeyDown(e, index)}
											role="button"
											tabIndex={0}
										>
											<h3 className="text-lg font-semibold">
												Soldier {index + 1}
											</h3>
											<div className="flex items-center">
												<Button
													type="button"
													variant="destructive"
													size="icon"
													onClick={(e) => {
														e.stopPropagation();
														remove(index);
														setExpandedSoldiers((prev) => {
															const newExpanded = [...prev];
															newExpanded.splice(index, 1);
															return newExpanded;
														});
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
												{expandedSoldiers[index] ? (
													<ChevronUp className="ml-2" />
												) : (
													<ChevronDown className="ml-2" />
												)}
											</div>
										</div>
										{expandedSoldiers[index] && (
											<div className="p-4 space-y-4">
												<FormField
													control={form.control}
													name={`soldiers.${index}.sid`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Soldier ID (SID)</FormLabel>
															<FormControl>
																<Input
																	placeholder="Enter soldier ID"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`soldiers.${index}.name`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Name</FormLabel>
															<FormControl>
																<Input
																	placeholder="Enter soldier's name"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`soldiers.${index}.rank`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Rank</FormLabel>
															<FormControl>
																<Input
																	placeholder="Enter soldier's rank"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`soldiers.${index}.joinDate`}
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
																<PopoverContent
																	className="w-auto p-0"
																	align="start"
																>
																	<Controller
																		control={form.control}
																		name={`soldiers.${index}.joinDate`}
																		render={({
																			field: { onChange, value },
																		}) => (
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
											</div>
										)}
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										append({
											sid: "",
											name: "",
											rank: "",
											joinDate: new Date(),
											status: "נוכח",
										});
										setExpandedSoldiers((prev) => [...prev, true]);
									}}
									className="w-full"
								>
									<Plus className="mr-2 h-4 w-4" /> Add Another Soldier
								</Button>
								<Button type="submit" className="w-full">
									Add Soldiers
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
