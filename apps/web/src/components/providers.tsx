"use client";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/utils/trpc";

import { SmoothScroll } from "./smooth-scroll";
import { ThemeModeController } from "./theme/theme-mode-controller";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			disableTransitionOnChange
			enableSystem={false}
			storageKey="theme"
		>
			<ThemeModeController>
				<SmoothScroll>
					<QueryClientProvider client={queryClient}>
						{children}
					</QueryClientProvider>
				</SmoothScroll>
				<Toaster richColors />
			</ThemeModeController>
		</ThemeProvider>
	);
}
