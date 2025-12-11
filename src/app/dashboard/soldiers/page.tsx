import { columns } from "@/components/dashboard/table/columns";
import { DataTable } from "@/components/dashboard/table/data-table";
import { getAllSoldiers } from "@/lib/action";

export const revalidate = 3600; // 1 hour

export default async function Soldiers() {
	const soldiers = await getAllSoldiers();

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={soldiers} />
		</div>
	);
}
