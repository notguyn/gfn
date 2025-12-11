import connectToDatabase from "@/lib/mongodb";
import Soldier from "@/models/Soldier";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		await connectToDatabase();
		const scores = await request.json();

		// Update each soldier's score
		for (const [soldierId, score] of Object.entries(scores)) {
			await Soldier.findByIdAndUpdate(soldierId, { score });
		}

		return NextResponse.json({ message: "Scores updated successfully" });
	} catch (error) {
		console.error("Error updating scores:", error);
		return NextResponse.json(
			{ error: "Failed to update scores" },
			{ status: 500 },
		);
	}
}
