import { columns } from "@/components/dashboard/misdar/columns";
import { NewInspectionButton } from "@/components/dashboard/misdar/new-inspection-button";
import { DataTable } from "@/components/dashboard/table/data-table";
import { getInspections } from "@/lib/inspection-actions";

export const revalidate = 0;

export default async function MisdarPage() {
	const inspections = await getInspections();

	return (
		<div className="container mx-auto py-10">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold tracking-tight">Inspections</h1>
				<NewInspectionButton />
			</div>
			<DataTable columns={columns} data={inspections} />
		</div>
	);
}
