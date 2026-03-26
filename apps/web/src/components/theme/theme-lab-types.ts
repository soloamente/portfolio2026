export type DayPeriod = "dawn" | "morning" | "afternoon" | "night";

export interface PeriodPalette {
	start: string;
	end: string;
	blur: string;
}

export type PaletteByPeriod = Record<DayPeriod, PeriodPalette>;

export type EasingPreset = "ease-out" | "ease-in-out" | "wave-soft";

export interface AnimationSettings {
	durationMs: number;
	blurPx: number;
	easing: EasingPreset;
}

// Central defaults for Theme Lab so future controls/preview share one source of truth.
export const DEFAULT_THEME_LAB_PALETTE: PaletteByPeriod = {
	dawn: {
		start: "#2f5aa7",
		end: "#f1d8ff",
		blur: "#f1d8ff",
	},
	morning: {
		start: "#4d80e6",
		end: "#f7efe0",
		blur: "#f7efe0",
	},
	afternoon: {
		start: "#4d80e6",
		end: "#e9dfe5",
		blur: "#e9dfe5",
	},
	night: {
		start: "#09102a",
		end: "#d1b7ff",
		blur: "#d1b7ff",
	},
};

export const DEFAULT_THEME_LAB_ANIMATION_SETTINGS: AnimationSettings = {
	durationMs: 900,
	blurPx: 24,
	easing: "ease-out",
};

export const DEFAULT_THEME_LAB_PERIOD: DayPeriod = "morning";
