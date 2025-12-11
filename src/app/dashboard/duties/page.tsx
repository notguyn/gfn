import { ScheduleActions } from "@/components/dashboard/duties/schedule-actions";
import { Button } from "@/components/ui/button";
import { getAssignments, getDuties } from "@/lib/duty-actions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DutiesList } from "./_components/duties-list";
import { ScheduleView } from "./_components/schedule-view";

export const revalidate = 0;

interface PageProps {
	searchParams: {
		date?: string;
	};
}

export default async function DutiesPage({ searchParams }: PageProps) {
	const dateStr = searchParams.date || new Date().toISOString().split("T")[0];
	const currentDate = new Date(dateStr);

	// Fetch data
	const duties = await getDuties();
	const assignments = await getAssignments(currentDate, currentDate); // Get assignments for this day

	// Navigation
	const prevDate = new Date(currentDate);
	prevDate.setDate(prevDate.getDate() - 1);
	const nextDate = new Date(currentDate);
	nextDate.setDate(nextDate.getDate() + 1);

	// Convert dates to ISO strings for client components to avoid serialization issues
	const currentDateIso = currentDate.toISOString();

	return (
		<div className="container mx-auto py-10 space-y-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Duty Schedule</h1>
					<p className="text-muted-foreground">
						Manage daily duties and assignments
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Link
						href={`/dashboard/duties?date=${prevDate.toISOString().split("T")[0]}`}
					>
						<Button variant="outline" size="icon">
							<ChevronLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div className="font-medium min-w-[150px] text-center">
						{currentDate.toLocaleDateString("en-IL", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</div>
					<Link
						href={`/dashboard/duties?date=${nextDate.toISOString().split("T")[0]}`}
					>
						<Button variant="outline" size="icon">
							<ChevronRight className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Main Schedule View */}
				<div className="md:col-span-2 space-y-6">
					<ScheduleView
						assignments={assignments}
						duties={duties}
						date={currentDateIso}
					/>
				</div>

				{/* Sidebar: Duties Management & Quick Actions */}
				<div className="space-y-6">
					<ScheduleActions duties={duties} currentDate={currentDateIso} />

					<DutiesList duties={duties} />
				</div>
			</div>
		</div>
	);
}
