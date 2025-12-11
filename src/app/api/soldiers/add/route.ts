import { createMultipleSoldiers } from "@/lib/action";
import type { ISoldier } from "@/types/Soldier";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const soldiers: ISoldier[] = await request.json();

		if (!Array.isArray(soldiers)) {
			return NextResponse.json(
				{ error: "Invalid request format. Expected an array of soldiers." },
				{ status: 400 },
			);
		}

		const result = await createMultipleSoldiers(soldiers);

		if (result.success) {
			return NextResponse.json(result.data);
		}
		return NextResponse.json({ error: result.data }, { status: 400 });
	} catch (error) {
		console.error("Error adding soldiers:", error);
		return NextResponse.json(
			{ error: "Failed to add soldiers" },
			{ status: 500 },
		);
	}
}
