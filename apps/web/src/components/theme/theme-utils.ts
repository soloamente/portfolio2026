export type DayPeriod = "dawn" | "morning" | "afternoon" | "night";

export type ThemeMode = "light" | "dark" | "time-based";

const GRADIENTS_BY_DAY_PERIOD: Record<DayPeriod, string> = {
	dawn: "linear-gradient(to bottom, #2f5aa7 0%, #f1d8ff 100%)",
	morning: "linear-gradient(to bottom, #4d80e6 0%, #f7efe0 100%)",
	afternoon: "linear-gradient(to bottom, #4d80e6 0%, #e9dfe5 100%)",
	night: "linear-gradient(to bottom, #09102a 0%, #d1b7ff 100%)",
};

const PROGRESSIVE_BLUR_BY_DAY_PERIOD: Record<DayPeriod, string> = {
	dawn: "#f1d8ff",
	morning: "#f7efe0",
	afternoon: "#e9dfe5",
	night: "#d1b7ff",
};

export function getDayPeriod(_date: Date): DayPeriod {
	// Local-time day-part boundaries:
	// - dawn: 05:00–06:59
	// - morning: 07:00–11:59
	// - afternoon: 12:00–17:59
	// - night: 18:00–04:59
	const hour = _date.getHours();
	if (hour >= 5 && hour <= 6) {
		return "dawn";
	}
	if (hour >= 7 && hour <= 11) {
		return "morning";
	}
	if (hour >= 12 && hour <= 17) {
		return "afternoon";
	}
	return "night";
}

export function getThemeForDayPeriod(_period: DayPeriod): "light" | "dark" {
	switch (_period) {
		case "dawn":
		case "night":
			return "dark";
		case "morning":
		case "afternoon":
			return "light";
		default:
			return "light";
	}
}

export function getGradientForDayPeriod(period: DayPeriod): string {
	return GRADIENTS_BY_DAY_PERIOD[period];
}

export function getProgressiveBlurColorForDayPeriod(period: DayPeriod): string {
	return PROGRESSIVE_BLUR_BY_DAY_PERIOD[period];
}

export function getInitialModeFromStorage(value: unknown): ThemeMode {
	if (value !== "light" && value !== "dark" && value !== "time-based") {
		return "time-based";
	}
	return value;
}

export function shouldTriggerWaveBlur(
	previous: DayPeriod | null,
	next: DayPeriod,
	prefersReducedMotion: boolean
): boolean {
	if (prefersReducedMotion) {
		return false;
	}
	if (previous === null) {
		return false;
	}
	return previous !== next;
}
