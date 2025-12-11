import { AddInspectionForm } from "@/components/dashboard/misdar/add-inspection-form";
import { RoleGuard } from "@/components/role-guard";
import { getAllSoldiers } from "@/lib/action";

export const revalidate = 0;

export default async function AddInspectionPage() {
	const soldiers = await getAllSoldiers();

	return (
		<RoleGuard
			allowedRoles={["commander"]}
			fallback={
				<div className="p-8 text-center text-red-500">
					Access Denied: Only commanders can add inspections.
				</div>
			}
		>
			<div className="container mx-auto py-10 max-w-2xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">
						Add New Inspection
					</h1>
					<p className="text-muted-foreground mt-2">
						Record a new inspection result for a soldier.
					</p>
				</div>
				<AddInspectionForm soldiers={soldiers} />
			</div>
		</RoleGuard>
	);
}
