"use client";

import { type ReactNode, createContext, useContext, useState } from "react";

type Role = "commander" | "soldier";

interface RoleContextType {
	role: Role;
	setRole: (role: Role) => void;
	canEdit: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
	const [role, setRole] = useState<Role>("commander"); // Default to commander for now

	const value = {
		role,
		setRole,
		canEdit: role === "commander",
	};

	return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
	const context = useContext(RoleContext);
	if (context === undefined) {
		throw new Error("useRole must be used within a RoleProvider");
	}
	return context;
}
