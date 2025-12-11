"use client";

import { useRole } from "@/providers/role-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
	children: React.ReactNode;
	allowedRoles: ("commander" | "soldier")[];
	fallback?: React.ReactNode;
}

export function RoleGuard({
	children,
	allowedRoles,
	fallback,
}: RoleGuardProps) {
	const { role } = useRole();
	const router = useRouter();

	useEffect(() => {
		if (!allowedRoles.includes(role) && !fallback) {
			router.push("/dashboard");
		}
	}, [role, allowedRoles, router, fallback]);

	if (!allowedRoles.includes(role)) {
		return fallback ? <>{fallback}</> : null;
	}

	return <>{children}</>;
}
