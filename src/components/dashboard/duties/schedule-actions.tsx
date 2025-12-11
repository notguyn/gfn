"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { autoSchedule } from "@/lib/duty-actions";
import { useRole } from "@/providers/role-provider";
import { Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ScheduleActionsProps {
	duties: any[];
	currentDate: Date | string;
}

export function ScheduleActions({ duties, currentDate }: ScheduleActionsProps) {
	const { role } = useRole();
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	if (role !== "commander") {
		return null;
	}

	const handleAutoSchedule = async () => {
		setIsLoading(true);
		try {
			const dutyIds = duties.map((d) => d._id);
			const date =
				typeof currentDate === "string" ? new Date(currentDate) : currentDate;
			const result = await autoSchedule(date, dutyIds);

			if (result.success) {
				toast({
					title: "Schedule updated",
					description: result.data,
				});
				router.refresh();
			} else {
				toast({
					variant: "destructive",
					title: "Scheduling failed",
					description: result.data,
				});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: "An unexpected error occurred",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Actions</CardTitle>
				<CardDescription>Quick tools for scheduling</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<Button
					className="w-full"
					onClick={handleAutoSchedule}
					disabled={isLoading}
				>
					<Wand2 className="mr-2 h-4 w-4" />
					{isLoading ? "Scheduling..." : "Auto-Schedule Today"}
				</Button>
			</CardContent>
		</Card>
	);
}
