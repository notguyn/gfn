import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface DutyDocument extends Document {
	name: string;
	description?: string;
	points: number;
	color: string;
	createdAt: Date;
	updatedAt: Date;
}

const DutySchema = new Schema<DutyDocument>(
	{
		name: {
			type: String,
			required: [true, "Please provide a duty name"],
			unique: true,
		},
		description: {
			type: String,
		},
		points: {
			type: Number,
			required: [true, "Please provide points value"],
			default: 1,
		},
		color: {
			type: String,
			default: "#3b82f6",
		},
	},
	{
		timestamps: true,
	},
);

const Duty: Model<DutyDocument> =
	mongoose.models.Duty || mongoose.model<DutyDocument>("Duty", DutySchema);

export default Duty;
