import {
	BarChart3,
	CalendarDays,
	ClipboardList,
	Settings,
	SquarePen,
	Users,
} from "lucide-react";

type Submenu = {
	href: string;
	label: string;
	active: boolean;
};

type Menu = {
	href: string;
	label: string;
	active: boolean;
	icon: any;
	submenus: Submenu[];
};

type Group = {
	groupLabel: string;
	menus: Menu[];
};

export function getMenuList(
	pathname: string,
	role: "commander" | "soldier" = "commander",
): Group[] {
	const allMenus: Group[] = [
		{
			groupLabel: "Contents",
			menus: [
				{
					href: "/dashboard/soldiers",
					label: "Soldiers",
					active: pathname.includes("/dashboard/soldiers"),
					icon: Users,
					submenus: [],
				},
				{
					href: "/dashboard/misdar",
					label: "Misdar",
					active: pathname.includes("/dashboard/misdar"),
					icon: ClipboardList,
					submenus: [],
				},
				{
					href: "/dashboard/duties",
					label: "Duties",
					active: pathname.includes("/dashboard/duties"),
					icon: CalendarDays,
					submenus: [],
				},
				{
					href: "/dashboard/reports",
					label: "Reports",
					active: pathname.includes("/dashboard/reports"),
					icon: BarChart3,
					submenus: [],
				},
			],
		},
		{
			groupLabel: "Settings",
			menus: [
				{
					href: "/account",
					label: "Account",
					active: pathname.includes("/account"),
					icon: Settings,
					submenus: [],
				},
			],
		},
	];

	if (role === "soldier") {
		// Filter out restricted menus for soldiers
		return allMenus
			.map((group) => ({
				...group,
				menus: group.menus
					.filter((menu) => {
						// Soldiers can only see Missions, Misdar, and Duties (and Settings)
						// Hide Soldiers management and Reports
						return ["Missions", "Misdar", "Duties", "Account"].includes(
							menu.label,
						);
					})
					.map((menu) => {
						// Also remove "New Mission" submenu for soldiers if needed, but for now let's keep it simple
						// If we want to restrict submenus:
						if (menu.label === "Missions") {
							return {
								...menu,
								submenus: menu.submenus.filter(
									(sub) => sub.label !== "New Mission",
								),
							};
						}
						return menu;
					}),
			}))
			.filter((group) => group.menus.length > 0);
	}

	return allMenus;
}

export function getActivePage(pathname: string): string {
	const activeLabels: string[] = [];

	const data = getMenuList(pathname);

	data.forEach((group) => {
		group.menus.forEach((menu) => {
			if (menu.active) {
				activeLabels.push(menu.label);
			}

			menu.submenus.forEach((submenu) => {
				if (submenu.active) {
					activeLabels.push(submenu.label);
				}
			});
		});
	});

	if (activeLabels.length === 0) return "Dashboard";

	if (activeLabels.length > 1) return activeLabels.join(" > "); // NOTE - This can be a breadcrumb if you want to.

	return activeLabels[0];
}
