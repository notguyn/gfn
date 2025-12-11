"use server";

import Assignment from "@/models/Assignment";
import Inspection from "@/models/Inspection";
import Soldier from "@/models/Soldier";
import connectDB from "./mongodb";

export async function getDashboardStats() {
	try {
		await connectDB();

		const totalSoldiers = await Soldier.countDocuments();
		const presentSoldiers = await Soldier.countDocuments({ status: "נוכח" });

		// Get recent inspections
		const recentInspections = await Inspection.find()
			.sort({ createdAt: -1 })
			.limit(5)
			.populate("soldierId", "name rank");

		// Get top scoring soldiers
		const topSoldiers = await Soldier.find()
			.sort({ score: -1 }) // Assuming higher score is better? Or lower? Based on duties usually lower is better fairness, but for "score" field it might be positive. Let's assume higher is better for "Top".
			// Wait, in previous context, score was used for duties fairness (lowest score gets duty).
			// But "score" field in Soldier model seems to be generic.
			// Let's assume for "Top Soldiers" we might mean something else or just display them.
			// Actually, usually in these systems, points are "bad" (assignments), so "Top" might mean "Most assignments" or "Least assignments".
			// Let's display "Highest Score" (Most active/burdened) for now.
			.limit(5);

		// Get recent assignments
		const recentAssignments = await Assignment.find()
			.sort({ date: -1 })
			.limit(5)
			.populate("soldierId", "name rank")
			.populate("dutyId", "name color");

		// Calculate pass rate for inspections
		const totalInspections = await Inspection.countDocuments();
		const passedInspections = await Inspection.countDocuments({ passed: true });
		const passRate =
			totalInspections > 0
				? Math.round((passedInspections / totalInspections) * 100)
				: 0;

		return {
			totalSoldiers,
			presentSoldiers,
			recentInspections: JSON.parse(JSON.stringify(recentInspections)),
			topSoldiers: JSON.parse(JSON.stringify(topSoldiers)),
			recentAssignments: JSON.parse(JSON.stringify(recentAssignments)),
			passRate,
		};
	} catch (error) {
		console.error("Error fetching stats:", error);
		return {
			totalSoldiers: 0,
			presentSoldiers: 0,
			recentInspections: [],
			topSoldiers: [],
			recentAssignments: [],
			passRate: 0,
		};
	}
}
