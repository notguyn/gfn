import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface AssignmentDocument extends Document {
	soldierId: mongoose.Types.ObjectId;
	dutyId: mongoose.Types.ObjectId;
	date: Date;
	createdAt: Date;
	updatedAt: Date;
}

const AssignmentSchema = new Schema<AssignmentDocument>(
	{
		soldierId: {
			type: Schema.Types.ObjectId,
			ref: "Soldier",
			required: [true, "Please provide a soldier ID"],
		},
		dutyId: {
			type: Schema.Types.ObjectId,
			ref: "Duty",
			required: [true, "Please provide a duty ID"],
		},
		date: {
			type: Date,
			required: [true, "Please provide a date"],
		},
	},
	{
		timestamps: true,
	},
);

// Compound index to ensure a soldier isn't assigned multiple duties on the same day (optional, but good for integrity)
// AssignmentSchema.index({ soldierId: 1, date: 1 }, { unique: true });

const Assignment: Model<AssignmentDocument> =
	mongoose.models.Assignment ||
	mongoose.model<AssignmentDocument>("Assignment", AssignmentSchema);

export default Assignment;
