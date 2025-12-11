import type { ISoldier } from "@/types/Soldier";
import { z } from "zod";

export interface IInspection {
	id?: string;
	soldierId: string | ISoldier;
	date: Date;
	type: string;
	passed: boolean;
	notes?: string;
}

export const InspectionZodSchema = z.object({
	soldierId: z.string().min(1, { message: "Soldier is required." }),
	date: z.date({ message: "Invalid date format." }),
	type: z.string().min(1, { message: "Type cannot be empty." }),
	passed: z.boolean(),
	notes: z.string().optional(),
});
