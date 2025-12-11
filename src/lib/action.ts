"use server";
import Soldier from "@/models/Soldier";
import type { ISoldier } from "@/types/Soldier";
import { revalidateTag } from "next/cache";
import { cache } from "react";

const revalidateSoldiers = () => revalidateTag("soldiers");

const handleError = (error: unknown): { success: false; data: string } => {
	console.error(error);
	return { success: false, data: JSON.stringify(error) };
};

export const createSoldier = async ({
	sid,
	name,
	rank,
	joinDate,
}: ISoldier) => {
	try {
		const soldierExists = await Soldier.findOne({ sid });
		if (soldierExists) return { success: false, data: "SID already in use." };

		const soldier = new Soldier({ sid, name, rank, joinDate });
		await soldier.save();

		revalidateSoldiers();
		return { success: true, data: JSON.stringify(soldier) };
	} catch (error) {
		return handleError(error);
	}
};

export const createMultipleSoldiers = async (soldiers: ISoldier[]) => {
	try {
		const existingSids = await Soldier.find({
			sid: { $in: soldiers.map((s) => s.sid) },
		}).select("sid");
		const existingSidSet = new Set(existingSids.map((s) => s.sid));

		const validSoldiers = soldiers.filter((s) => !existingSidSet.has(s.sid));
		const invalidSids = soldiers
			.filter((s) => existingSidSet.has(s.sid))
			.map((s) => s.sid);

		if (validSoldiers.length > 0) {
			await Soldier.insertMany(validSoldiers);
		}

		revalidateSoldiers();
		return {
			success: true,
			data: {
				created: validSoldiers.length,
				failed: invalidSids,
			},
		};
	} catch (error) {
		return handleError(error);
	}
};

export const getAllSoldiers = cache(async () => {
	try {
		const soldiers = await Soldier.find();

		return JSON.parse(JSON.stringify(soldiers));
	} catch (error) {
		revalidateSoldiers();
		return {};
	}
});

export const updateSoldier = async ({
	id,
	sid,
	name,
	rank,
	joinDate,
}: ISoldier) => {
	try {
		if (sid) {
			const soldierExists = await Soldier.findOne({ sid, _id: { $ne: id } });
			if (soldierExists) return { success: false, data: "SID already in use." };
		}

		const updatedSoldier = await Soldier.findByIdAndUpdate(
			id,
			{ sid, name, rank, joinDate },
			{ new: true },
		);

		revalidateSoldiers();
		return { success: true, data: JSON.stringify(updatedSoldier) };
	} catch (error) {
		return handleError(error);
	}
};

export const deleteSoldier = async (id: string) => {
	try {
		await Soldier.findByIdAndDelete(id);

		revalidateSoldiers();
		return { success: true, data: "Soldier deleted successfully." };
	} catch (error) {
		return handleError(error);
	}
};
