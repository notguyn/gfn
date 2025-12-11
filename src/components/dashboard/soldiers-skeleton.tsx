import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";

export const SoldiersTableSkeleton = () => {
	const uniqueKeys = Array.from({ length: 5 }, () => crypto.randomUUID());

	return (
		<div className="container mx-auto py-10">
			<div>
				<div className="flex items-center py-4">
					<Skeleton className="h-10 w-full max-w-sm" />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Skeleton className="h-10 w-24 ml-auto" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{uniqueKeys.map((key) => (
								<DropdownMenuCheckboxItem key={key}>
									<Skeleton className="h-4 w-full" />
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								{uniqueKeys.map((key) => (
									<TableHead key={key}>
										<Skeleton className="h-8 w-full" />
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{uniqueKeys.map((rowKey) => (
								<TableRow key={rowKey}>
									{uniqueKeys.map((cellKey) => (
										<TableCell key={cellKey}>
											<Skeleton className="h-8 w-full" />
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<Skeleton className="h-8 w-20" />
					<Skeleton className="h-8 w-20" />
				</div>
			</div>
		</div>
	);
};

export const AddSoldierSkeleton = () => {
	return (
		<>
			<Skeleton className="h-10 w-24 mt-4" />
			<div className="flex justify-center items-center">
				<Card className="w-full max-w-2xl">
					<CardHeader>
						<Skeleton className="h-8 w-48" />
						<CardDescription>
							<Skeleton className="h-6 w-full mt-2" />
							<Skeleton className="h-6 w-full mt-2" />
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Skeleton className="space-y-4">
							<div className="border rounded-md overflow-hidden">
								<div className="flex justify-between items-center p-4">
									<Skeleton className="h-6 w-32" />
									<div className="flex items-center">
										<Skeleton className="h-6 w-6" />
										<Skeleton className="h-6 w-6 ml-2" />
									</div>
								</div>
								<div className="p-4 space-y-4">
									<Skeleton className="h-6 w-full" />
									<Skeleton className="h-6 w-full" />
									<Skeleton className="h-6 w-full" />
									<Skeleton className="h-10 w-full" />
								</div>
							</div>
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</Skeleton>
					</CardContent>
				</Card>
			</div>
		</>
	);
};
