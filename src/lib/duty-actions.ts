"use server";

import Assignment from "@/models/Assignment";
import Duty from "@/models/Duty";
import Soldier from "@/models/Soldier";
import type { IDuty } from "@/types/Duty";
import { revalidatePath } from "next/cache";
import connectDB from "./mongodb";

// --- Duty Actions ---

export async function createDuty(data: IDuty) {
	try {
		await connectDB();
		const duty = await Duty.create(data);
		revalidatePath("/dashboard/duties");
		return { success: true, data: JSON.parse(JSON.stringify(duty)) };
	} catch (error: any) {
		return { success: false, data: error.message };
	}
}

export async function getDuties() {
	try {
		await connectDB();
		const duties = await Duty.find().sort({ createdAt: -1 });
		return JSON.parse(JSON.stringify(duties));
	} catch (error: any) {
		return [];
	}
}

export async function deleteDuty(id: string) {
	try {
		await connectDB();
		await Duty.findByIdAndDelete(id);
		revalidatePath("/dashboard/duties");
		return { success: true };
	} catch (error: any) {
		return { success: false, data: error.message };
	}
}

// --- Assignment Actions ---

export async function createAssignment(data: {
	soldierId: string;
	dutyId: string;
	date: Date;
}) {
	try {
		await connectDB();
		const assignment = await Assignment.create(data);

		// Optional: Update soldier score immediately?
		// For now, we'll keep score updates separate or part of a "complete" action.

		revalidatePath("/dashboard/duties");
		return { success: true, data: JSON.parse(JSON.stringify(assignment)) };
	} catch (error: any) {
		return { success: false, data: error.message };
	}
}

export async function getAssignments(startDate?: Date, endDate?: Date) {
	try {
		await connectDB();
		const query: any = {};
		if (startDate && endDate) {
			query.date = { $gte: startDate, $lte: endDate };
		} else if (startDate) {
			query.date = { $gte: startDate };
		}

		const assignments = await Assignment.find(query)
			.populate("soldierId")
			.populate("dutyId")
			.sort({ date: 1 });
		return JSON.parse(JSON.stringify(assignments));
	} catch (error: any) {
		return [];
	}
}

export async function deleteAssignment(id: string) {
	try {
		await connectDB();
		await Assignment.findByIdAndDelete(id);
		revalidatePath("/dashboard/duties");
		return { success: true };
	} catch (error: any) {
		return { success: false, data: error.message };
	}
}

// --- Auto-Schedule Algorithm ---

export async function autoSchedule(date: Date, dutyIds: string[]) {
	try {
		await connectDB();

		// 1. Get all available soldiers (status 'נוכח')
		const soldiers = await Soldier.find({ status: "נוכח" }).sort({ score: 1 }); // Lowest score first (fairest)

		if (soldiers.length === 0) {
			return { success: false, data: "No available soldiers found." };
		}

		// 2. Get duties to schedule
		const duties = await Duty.find({ _id: { $in: dutyIds } });

		if (duties.length === 0) {
			return { success: false, data: "No duties found." };
		}

		// 3. Check existing assignments for this date to avoid double booking
		const existingAssignments = await Assignment.find({
			date: {
				$gte: new Date(date.setHours(0, 0, 0, 0)),
				$lt: new Date(date.setHours(23, 59, 59, 999)),
			},
		});

		const assignedSoldierIds = new Set(
			existingAssignments.map((a) => a.soldierId.toString()),
		);

		const assignmentsToCreate = [];
		let soldierIndex = 0;

		// Filter out already assigned soldiers
		const availableSoldiers = soldiers.filter(
			(s) => !assignedSoldierIds.has(s._id.toString()),
		);

		for (const duty of duties) {
			if (soldierIndex < availableSoldiers.length) {
				const soldier = availableSoldiers[soldierIndex];
				assignmentsToCreate.push({
					soldierId: soldier._id,
					dutyId: duty._id,
					date: date,
				});
				soldierIndex++;
			} else {
				// Not enough soldiers
				break;
			}
		}

		if (assignmentsToCreate.length > 0) {
			await Assignment.insertMany(assignmentsToCreate);
			revalidatePath("/dashboard/duties");
			return {
				success: true,
				data: `Successfully scheduled ${assignmentsToCreate.length} duties.`,
			};
		}

		return {
			success: false,
			data: "No new assignments created (soldiers might be busy or none available).",
		};
	} catch (error: any) {
		return { success: false, data: error.message };
	}
}
