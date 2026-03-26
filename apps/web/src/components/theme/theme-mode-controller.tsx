"use client";

import { useTheme } from "next-themes";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { BackgroundWaveGradient } from "./background-wave-gradient";
import {
	type DayPeriod,
	getDayPeriod,
	getGradientForDayPeriod,
	getInitialModeFromStorage,
	getProgressiveBlurColorForDayPeriod,
	getThemeForDayPeriod,
	type ThemeMode,
} from "./theme-utils";

const THEME_MODE_STORAGE_KEY = "theme-mode";

interface ThemeModeControllerContextValue {
	mode: ThemeMode;
	setMode: (nextMode: ThemeMode) => void;
	dayPeriod: DayPeriod;
}

const ThemeModeControllerContext =
	createContext<ThemeModeControllerContextValue | null>(null);

export function useThemeModeController(): ThemeModeControllerContextValue {
	const context = useContext(ThemeModeControllerContext);
	if (!context) {
		throw new Error(
			"useThemeModeController must be used within ThemeModeController."
		);
	}
	return context;
}

interface ThemeModeControllerProps {
	children: ReactNode;
}

export function ThemeModeController({ children }: ThemeModeControllerProps) {
	const { setTheme } = useTheme();
	const [mode, setMode] = useState<ThemeMode>("time-based");
	const [dayPeriod, setDayPeriod] = useState<DayPeriod>(() =>
		getDayPeriod(new Date())
	);
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		const storedValue =
			typeof window === "undefined"
				? null
				: window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
		setMode(getInitialModeFromStorage(storedValue));
		setDayPeriod(getDayPeriod(new Date()));
		setIsHydrated(true);
	}, []);

	useEffect(() => {
		// Keep day period current for time-based mode and for "alive" gradients in manual modes.
		const updateDayPeriod = () => {
			setDayPeriod(getDayPeriod(new Date()));
		};

		const msUntilNextMinute = 60_000 - (Date.now() % 60_000);
		let intervalId: ReturnType<typeof setInterval> | null = null;
		const timeoutId = setTimeout(() => {
			updateDayPeriod();
			intervalId = setInterval(updateDayPeriod, 60_000);
		}, msUntilNextMinute);

		return () => {
			clearTimeout(timeoutId);
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, []);

	useEffect(() => {
		if (!isHydrated) {
			return;
		}
		const nextTheme =
			mode === "time-based" ? getThemeForDayPeriod(dayPeriod) : mode;
		setTheme(nextTheme);
	}, [dayPeriod, isHydrated, mode, setTheme]);

	useEffect(() => {
		if (!isHydrated || typeof window === "undefined") {
			return;
		}
		window.localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
	}, [isHydrated, mode]);

	// In manual dark mode, force a night gradient so the background and theme feel coherent.
	const gradientDayPeriod = mode === "dark" ? "night" : dayPeriod;
	const gradient = getGradientForDayPeriod(gradientDayPeriod);
	const progressiveBlurColor =
		getProgressiveBlurColorForDayPeriod(gradientDayPeriod);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}
		document.documentElement.style.setProperty(
			"--progressive-blur-color",
			progressiveBlurColor
		);
	}, [progressiveBlurColor]);

	const contextValue = useMemo<ThemeModeControllerContextValue>(
		() => ({
			dayPeriod,
			mode,
			setMode,
		}),
		[dayPeriod, mode]
	);

	return (
		<ThemeModeControllerContext.Provider value={contextValue}>
			<BackgroundWaveGradient dayPeriod={dayPeriod} gradient={gradient} />
			{children}
		</ThemeModeControllerContext.Provider>
	);
}
