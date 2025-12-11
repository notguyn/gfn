"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Activity, CalendarDays, ClipboardCheck, Users } from "lucide-react";

interface ReportsContentProps {
	stats: any;
}

export function ReportsContent({ stats }: ReportsContentProps) {
	return (
		<div className="container mx-auto py-10 space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Reports & Statistics
				</h1>
				<p className="text-muted-foreground">
					Overview of unit performance and activity
				</p>
			</div>

			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Soldiers
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalSoldiers}</div>
						<p className="text-xs text-muted-foreground">
							{stats.presentSoldiers} present today
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Inspection Pass Rate
						</CardTitle>
						<ClipboardCheck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.passRate}%</div>
						<p className="text-xs text-muted-foreground">
							Average across all inspections
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Recent Assignments
						</CardTitle>
						<CalendarDays className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.recentAssignments.length}
						</div>
						<p className="text-xs text-muted-foreground">
							Assignments in the last 7 days
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Duties</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">Active</div>
						<p className="text-xs text-muted-foreground">System operational</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				{/* Recent Inspections */}
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Recent Inspections</CardTitle>
						<CardDescription>
							Latest inspection results from the unit.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-8">
							{stats.recentInspections.map((inspection: any) => (
								<div key={inspection._id} className="flex items-center">
									<div className="ml-4 space-y-1">
										<p className="text-sm font-medium leading-none">
											{inspection.type}
										</p>
										<p className="text-sm text-muted-foreground">
											{new Date(inspection.date).toLocaleDateString()}
										</p>
									</div>
									<div
										className={`ml-auto font-medium ${
											inspection.passed ? "text-green-500" : "text-red-500"
										}`}
									>
										{inspection.passed ? "Passed" : "Failed"}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Recent Assignments */}
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Recent Assignments</CardTitle>
						<CardDescription>Latest duty assignments.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-8">
							{stats.recentAssignments.map((assignment: any) => (
								<div key={assignment._id} className="flex items-center">
									<div
										className="h-9 w-9 rounded-full flex items-center justify-center border"
										style={{ backgroundColor: assignment.dutyId.color }}
									>
										{assignment.dutyId.name.substring(0, 2).toUpperCase()}
									</div>
									<div className="ml-4 space-y-1">
										<p className="text-sm font-medium leading-none">
											{assignment.soldierId.rank} {assignment.soldierId.name}
										</p>
										<p className="text-sm text-muted-foreground">
											{assignment.dutyId.name}
										</p>
									</div>
									<div className="ml-auto text-sm text-muted-foreground">
										{new Date(assignment.date).toLocaleDateString()}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
