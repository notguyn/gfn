import { z } from "zod";

export interface ISoldier {
	_id?: string;
	id?: string;
	sid: string;
	name: string;
	rank: string;
	joinDate: Date;
	score: number;
	status: string;
}

export const SoldierZodSchema = z.object({
	sid: z
		.string()
		.regex(/^\d{7}$/, { message: "Soldier ID must contain exactly 7 digits." }),
	name: z.string().min(1, { message: "Name cannot be empty." }),
	rank: z.string().min(1, { message: "Rank cannot be empty." }),
	joinDate: z.date({ message: "Invalid date format." }),
	status: z.enum(["נוכח", "יום ג'", "חופש"]).default("נוכח"),
});
