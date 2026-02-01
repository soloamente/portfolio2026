import type { Metadata } from "next";

import localFont from "next/font/local";

import "../index.css";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";

// SF Pro Rounded from src/fonts (copied from public/fonts so next/font/local can resolve at build)
const sfProRounded = localFont({
	src: [
		{
			path: "../fonts/SF_Pro_Rounded/SF-Pro-Rounded-Thin.otf",
			weight: "100",
			style: "normal",
		},
		{
			path: "../fonts/SF_Pro_Rounded/SF-Pro-Rounded-Ultralight.otf",
			weight: "200",
			style: "normal",
		},
		{
			path: "../fonts/SF_Pro_Rounded/SF-Pro-Rounded-Light.otf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../fonts/SF_Pro_Rounded/SF-Pro-Rounded-Regular.otf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../fonts/SF_Pro_Rounded/SF-Pro-Rounded-Medium.otf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../fonts/SF_Pro_Rounded/SF-Pro-Rounded-Semibold.otf",
			weight: "600",
			style: "normal",
		},
		{
			path: "../fonts/SF_Pro_Rounded/SF-Pro-Rounded-Bold.otf",
			weight: "700",
			style: "normal",
		},
		{
			path: "../fonts/SF_Pro_Rounded/SF-Pro-Rounded-Heavy.otf",
			weight: "800",
			style: "normal",
		},
		{
			path: "../fonts/SF_Pro_Rounded/SF-Pro-Rounded-Black.otf",
			weight: "900",
			style: "normal",
		},
	],
	variable: "--font-sf-pro-rounded",
	display: "swap",
});

export const metadata: Metadata = {
	title: "portfolio2026",
	description: "portfolio2026",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${sfProRounded.variable} antialiased`}>
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">
						<Navbar />
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
