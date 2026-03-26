import type { Metadata } from "next";

import localFont from "next/font/local";
import Script from "next/script";

import "../index.css";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

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
	title: "ADGV",
	description: "Anselmo Diogo Guatta Vicente's 2026Portfolio",
};

const themePreloadScript = `
(() => {
  const THEME_MODE_KEY = "theme-mode";
  const NEXT_THEMES_STORAGE_KEY = "theme";
  const PROGRESSIVE_BLUR_CSS_VAR = "--progressive-blur-color";
  const isValidMode = (value) =>
    value === "light" || value === "dark" || value === "time-based";

  const getDayPeriodFromHour = (hour) => {
    if (hour >= 5 && hour <= 6) return "dawn";
    if (hour >= 7 && hour <= 11) return "morning";
    if (hour >= 12 && hour <= 17) return "afternoon";
    return "night";
  };

  const getThemeForDayPeriod = (period) => {
    return period === "dawn" || period === "night" ? "dark" : "light";
  };

  const getProgressiveBlurColorForDayPeriod = (period) => {
    switch (period) {
      case "dawn":
        return "#f1d8ff";
      case "morning":
        return "#f7efe0";
      case "afternoon":
        return "#e9dfe5";
      case "night":
        return "#d1b7ff";
      default:
        return "#e9dfe5";
    }
  };

  try {
    const storedMode = localStorage.getItem(THEME_MODE_KEY);
    const mode = isValidMode(storedMode) ? storedMode : "time-based";
    const timeBasedPeriod = getDayPeriodFromHour(new Date().getHours());
    const gradientPeriod = mode === "dark" ? "night" : timeBasedPeriod;
    const resolvedTheme =
      mode === "time-based"
        ? getThemeForDayPeriod(timeBasedPeriod)
        : mode;

    if (resolvedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem(NEXT_THEMES_STORAGE_KEY, resolvedTheme);
    document.documentElement.style.setProperty(
      PROGRESSIVE_BLUR_CSS_VAR,
      getProgressiveBlurColorForDayPeriod(gradientPeriod)
    );
  } catch (_error) {
    // Ignore storage access issues (private mode / restricted environments).
  }
})();
`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${sfProRounded.variable} antialiased`}>
				<Script id="theme-preload" strategy="beforeInteractive">
					{themePreloadScript}
				</Script>
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">
						<Navbar />
						{/* <ProgressiveBlur
							backgroundColor="#4D80E6"
							className="fixed z-20"
							position="top"
						/> */}
						<ProgressiveBlur
							backgroundColor="var(--progressive-blur-color)"
							className="fixed z-20"
							position="bottom"
						/>
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
