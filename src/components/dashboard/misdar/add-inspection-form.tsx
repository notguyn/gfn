"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createInspection } from "@/lib/inspection-actions";
import { InspectionZodSchema } from "@/types/Inspection";
import type { ISoldier } from "@/types/Soldier";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

interface AddInspectionFormProps {
	soldiers: ISoldier[];
}

export function AddInspectionForm({ soldiers }: AddInspectionFormProps) {
	const { toast } = useToast();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof InspectionZodSchema>>({
		resolver: zodResolver(InspectionZodSchema),
		defaultValues: {
			date: new Date(),
			passed: true,
			notes: "",
			type: "Morning Inspection",
		},
	});

	async function onSubmit(data: z.infer<typeof InspectionZodSchema>) {
		setIsSubmitting(true);
		try {
			const result = await createInspection(data);
			if (result.success) {
				toast({
					title: "Success",
					description: "Inspection created successfully",
				});
				router.push("/dashboard/misdar");
				router.refresh();
			} else {
				toast({
					variant: "destructive",
					title: "Error",
					description: result.data || "Failed to create inspection",
				});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "Something went wrong",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="soldierId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Soldier</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value as string}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a soldier" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{soldiers.map((soldier) => (
										<SelectItem
											key={soldier.id || soldier._id}
											value={soldier.id || soldier._id || ""}
										>
											{soldier.rank} {soldier.name} ({soldier.sid})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={`w-[240px] pl-3 text-left font-normal ${
												!field.value && "text-muted-foreground"
											}`}
										>
											{field.value ? (
												field.value.toLocaleDateString()
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) =>
											date > new Date() || date < new Date("1900-01-01")
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Inspection Type</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Morning Inspection">
										Morning Inspection
									</SelectItem>
									<SelectItem value="Cleaning Inspection">
										Cleaning Inspection
									</SelectItem>
									<SelectItem value="Equipment Inspection">
										Equipment Inspection
									</SelectItem>
									<SelectItem value="Personal Appearance">
										Personal Appearance
									</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="passed"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<FormLabel className="text-base">Passed</FormLabel>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="notes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notes</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Add any notes here..."
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Create Inspection
				</Button>
			</form>
		</Form>
	);
}
