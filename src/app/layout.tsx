import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { RoleProvider } from "@/providers/role-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "GFN",
		template: "%s | GFN",
	},
	description: "GFN System. The system that will help you manage your bases.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning={true} lang="en">
			<body suppressHydrationWarning={true} className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<RoleProvider>
						{children}
						<Toaster />
					</RoleProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
