"use server";

import Inspection from "@/models/Inspection";
import type { IInspection } from "@/types/Inspection";
import { revalidateTag } from "next/cache";
import { cache } from "react";

const revalidateInspections = () => revalidateTag("inspections");

const handleError = (error: unknown): { success: false; data: string } => {
	console.error(error);
	return { success: false, data: JSON.stringify(error) };
};

export const createInspection = async (inspectionData: IInspection) => {
	try {
		const inspection = new Inspection(inspectionData);
		await inspection.save();

		revalidateInspections();
		return { success: true, data: JSON.stringify(inspection) };
	} catch (error) {
		return handleError(error);
	}
};

export const getInspections = cache(async (soldierId?: string) => {
	try {
		const query = soldierId ? { soldierId } : {};
		const inspections = await Inspection.find(query)
			.sort({ date: -1 })
			.populate("soldierId"); // Populate soldier details
		return JSON.parse(JSON.stringify(inspections));
	} catch (error) {
		console.error("Failed to fetch inspections:", error);
		return [];
	}
});

export const updateInspection = async (inspectionData: IInspection) => {
	try {
		const { id, ...updateData } = inspectionData;
		if (!id)
			return { success: false, data: "Inspection ID is required for update." };

		const updatedInspection = await Inspection.findByIdAndUpdate(
			id,
			updateData,
			{ new: true },
		);

		revalidateInspections();
		return { success: true, data: JSON.stringify(updatedInspection) };
	} catch (error) {
		return handleError(error);
	}
};

export const deleteInspection = async (id: string) => {
	try {
		await Inspection.findByIdAndDelete(id);
		revalidateInspections();
		return { success: true, data: "Inspection deleted successfully." };
	} catch (error) {
		return handleError(error);
	}
};
