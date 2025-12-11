import { ReportsContent } from "@/components/dashboard/reports/reports-content";
import { RoleGuard } from "@/components/role-guard";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/report-actions";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function ReportsPage() {
	const stats = await getDashboardStats();

	return (
		<RoleGuard
			allowedRoles={["commander"]}
			fallback={
				<div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
					<AlertCircle className="h-16 w-16 text-destructive" />
					<h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
					<p className="text-muted-foreground">
						You do not have permission to view reports.
					</p>
					<Button asChild variant="outline">
						<Link href="/dashboard">Back to Dashboard</Link>
					</Button>
				</div>
			}
		>
			<ReportsContent stats={stats} />
		</RoleGuard>
	);
}
