import type { IInspection } from "@/types/Inspection";
import { type Document, type Model, Schema, model, models } from "mongoose";

export interface IInspectionDocument extends Omit<IInspection, "id">, Document {
	createdAt: Date;
	updatedAt: Date;
}

const InspectionSchema = new Schema<IInspectionDocument>(
	{
		soldierId: {
			type: String,
			required: true,
			ref: "Soldier", // Ideally referencing Soldier model, but Soldier uses 'sid' as custom ID or just string.
			// If Soldier.ts schema has 'sid' as unique, we can store 'sid' here.
		},
		date: {
			type: Date,
			required: true,
			default: Date.now,
		},
		type: {
			type: String,
			required: true,
		},
		passed: {
			type: Boolean,
			required: true,
		},
		notes: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

const Inspection: Model<IInspectionDocument> =
	models?.Inspection || model("Inspection", InspectionSchema);

export default Inspection;
