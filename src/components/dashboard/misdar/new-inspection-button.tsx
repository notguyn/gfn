"use client";

import { Button } from "@/components/ui/button";
import { useRole } from "@/providers/role-provider";
import { Plus } from "lucide-react";
import Link from "next/link";

export function NewInspectionButton() {
	const { role } = useRole();

	if (role !== "commander") {
		return null;
	}

	return (
		<Link href="/dashboard/misdar/add">
			<Button>
				<Plus className="mr-2 h-4 w-4" /> New Inspection
			</Button>
		</Link>
	);
}
