import type { Metadata } from "next";

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
	title: "Soldiers",
};

export default function SoldiersLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
