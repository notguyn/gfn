import type { ISoldier } from "@/types/Soldier";
import {
	type Document,
	type Model,
	Schema,
	type Types,
	model,
	models,
} from "mongoose";

export interface ISoldierDocument
	extends Omit<ISoldier, "id" | "_id">,
		Document {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const SoldierSchema = new Schema<ISoldierDocument>(
	{
		sid: {
			// Soldier ID
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		rank: {
			type: String,
			required: true,
		},
		joinDate: {
			type: Date,
			required: true,
		},
		score: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			enum: ["נוכח", "יום ג'", "חופש"],
			default: "נוכח",
		},
	},
	{
		timestamps: true,
	},
);

const Soldier: Model<ISoldierDocument> =
	models?.Soldier || model("Soldier", SoldierSchema);

export default Soldier;
