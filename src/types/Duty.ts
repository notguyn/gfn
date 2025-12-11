import { z } from "zod";

export interface IDuty {
	id?: string;
	name: string;
	description?: string;
	points: number;
	color: string; // For UI display
}

export const DutyZodSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	description: z.string().optional(),
	points: z.coerce.number().min(1, "Points must be at least 1"),
	color: z.string().optional().default("#3b82f6"), // blue-500 default
});

export interface IAssignment {
	id?: string;
	soldierId: string;
	dutyId: string;
	date: Date;
}

export const AssignmentZodSchema = z.object({
	soldierId: z.string().min(1, "Soldier is required"),
	dutyId: z.string().min(1, "Duty is required"),
	date: z.coerce.date(),
});
