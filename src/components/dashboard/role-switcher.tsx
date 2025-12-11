"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRole } from "@/providers/role-provider";

interface RoleSwitcherProps {
	isOpen?: boolean;
}

export function RoleSwitcher({ isOpen }: RoleSwitcherProps) {
	const { role, setRole } = useRole();

	if (isOpen === false) {
		return (
			<TooltipProvider disableHoverableContent>
				<Tooltip delayDuration={100}>
					<TooltipTrigger asChild>
						<div className="flex justify-center w-full py-2">
							<Switch
								id="role-mode-collapsed"
								checked={role === "commander"}
								onCheckedChange={(checked: boolean) =>
									setRole(checked ? "commander" : "soldier")
								}
							/>
						</div>
					</TooltipTrigger>
					<TooltipContent side="right">
						{role === "commander" ? "Commander Mode" : "Soldier Mode"}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<div className="flex items-center space-x-2 px-4 py-2 w-full">
			<Switch
				id="role-mode"
				checked={role === "commander"}
				onCheckedChange={(checked: boolean) =>
					setRole(checked ? "commander" : "soldier")
				}
			/>
			<Label htmlFor="role-mode" className="text-sm font-medium truncate">
				{role === "commander" ? "Commander Mode" : "Soldier Mode"}
			</Label>
		</div>
	);
}
