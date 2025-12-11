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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getAllSoldiers } from "@/lib/action";
import { createAssignment, deleteAssignment } from "@/lib/duty-actions";
import { useRole } from "@/providers/role-provider";
import type { ISoldier } from "@/types/Soldier";
import { Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

interface ScheduleViewProps {
	assignments: any[];
	duties: any[];
	date: Date | string;
}

export function ScheduleView({ assignments, duties, date }: ScheduleViewProps) {
	const { toast } = useToast();
	const { role } = useRole();
	const [soldiers, setSoldiers] = useState<ISoldier[]>([]);
	const [selectedSoldier, setSelectedSoldier] = useState<string>("");

	useEffect(() => {
		getAllSoldiers().then(setSoldiers);
	}, []);

	const handleAssign = async (dutyId: string) => {
		if (!selectedSoldier) return;

		const result = await createAssignment({
			soldierId: selectedSoldier,
			dutyId,
			date: typeof date === "string" ? new Date(date) : date,
		});

		if (result.success) {
			toast({ title: "Soldier assigned successfully" });
			setSelectedSoldier("");
		} else {
			toast({
				variant: "destructive",
				title: "Error",
				description: result.data,
			});
		}
	};

	const handleDelete = async (id: string) => {
		if (confirm("Remove this assignment?")) {
			const result = await deleteAssignment(id);
			if (result.success) {
				toast({ title: "Assignment removed" });
			} else {
				toast({
					variant: "destructive",
					title: "Error",
					description: result.data,
				});
			}
		}
	};

	// Group assignments by duty
	const assignmentsByDuty = duties.reduce(
		(acc, duty) => {
			acc[duty._id] = assignments.filter((a) => a.dutyId._id === duty._id);
			return acc;
		},
		{} as Record<string, any[]>,
	);

	return (
		<div className="grid gap-6">
			{duties.map((duty) => (
				<Card key={duty._id}>
					<CardHeader className="pb-3">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-3">
								<div
									className="w-4 h-4 rounded-full"
									style={{ backgroundColor: duty.color }}
								/>
								<div>
									<CardTitle className="text-lg">{duty.name}</CardTitle>
									<CardDescription>
										{assignmentsByDuty[duty._id]?.length || 0} soldiers assigned
									</CardDescription>
								</div>
							</div>

							{role === "commander" && (
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="outline" size="sm">
											<UserPlus className="h-4 w-4 mr-2" />
											Assign
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Assign Soldier to {duty.name}</DialogTitle>
										</DialogHeader>
										<div className="flex flex-col gap-4 pt-4">
											<Select
												value={selectedSoldier}
												onValueChange={setSelectedSoldier}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select soldier" />
												</SelectTrigger>
												<SelectContent>
													{soldiers.map((soldier) => (
														<SelectItem
															key={soldier.id || soldier._id}
															value={soldier.id || soldier._id || ""}
														>
															{soldier.rank} {soldier.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Button
												onClick={() => handleAssign(duty._id)}
												disabled={!selectedSoldier}
											>
												Assign Soldier
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							)}
						</div>
					</CardHeader>
					<CardContent>
						{assignmentsByDuty[duty._id]?.length === 0 ? (
							<p className="text-sm text-muted-foreground italic">
								No soldiers assigned yet.
							</p>
						) : (
							<div className="space-y-2">
								{assignmentsByDuty[duty._id]?.map((assignment: any) => (
									<div
										key={assignment._id}
										className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm"
									>
										<div className="flex items-center gap-2">
											<span className="font-medium">
												{assignment.soldierId.rank} {assignment.soldierId.name}
											</span>
											<span className="text-muted-foreground text-xs">
												({assignment.soldierId.sid})
											</span>
										</div>
										{role === "commander" && (
											<Button
												variant="ghost"
												size="icon"
												className="h-6 w-6 text-muted-foreground hover:text-red-500"
												onClick={() => handleDelete(assignment._id)}
											>
												<Trash2 className="h-3 w-3" />
											</Button>
										)}
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			))}

			{duties.length === 0 && (
				<div className="text-center py-10 text-muted-foreground">
					No duties defined. Create duties on the right to start scheduling.
				</div>
			)}
		</div>
	);
}
