import { describe, expect, it } from "bun:test";

import {
	type DayPeriod,
	getDayPeriod,
	getGradientForDayPeriod,
	getInitialModeFromStorage,
	getProgressiveBlurColorForDayPeriod,
	getThemeForDayPeriod,
	shouldTriggerWaveBlur,
	type ThemeMode,
} from "./theme-utils";

describe("theme-utils (day period + gradients)", () => {
	it("getDayPeriod boundaries (04:59 night, 05:00 dawn, 06:59 dawn, 07:00 morning)", () => {
		expect(getDayPeriod(new Date(2020, 0, 1, 4, 59))).toBe("night");
		expect(getDayPeriod(new Date(2020, 0, 1, 5, 0))).toBe("dawn");
		expect(getDayPeriod(new Date(2020, 0, 1, 6, 59))).toBe("dawn");
		expect(getDayPeriod(new Date(2020, 0, 1, 7, 0))).toBe("morning");
	});

	it("getDayPeriod boundaries (11:59 morning, 12:00 afternoon, 17:59 afternoon, 18:00 night)", () => {
		expect(getDayPeriod(new Date(2020, 0, 1, 11, 59))).toBe("morning");
		expect(getDayPeriod(new Date(2020, 0, 1, 12, 0))).toBe("afternoon");
		expect(getDayPeriod(new Date(2020, 0, 1, 17, 59))).toBe("afternoon");
		expect(getDayPeriod(new Date(2020, 0, 1, 18, 0))).toBe("night");
	});

	it("getThemeForDayPeriod maps dawn/night -> dark and morning/afternoon -> light", () => {
		const dawn: DayPeriod = "dawn";
		const morning: DayPeriod = "morning";
		const afternoon: DayPeriod = "afternoon";
		const night: DayPeriod = "night";

		expect(getThemeForDayPeriod(dawn)).toBe("dark");
		expect(getThemeForDayPeriod(morning)).toBe("light");
		expect(getThemeForDayPeriod(afternoon)).toBe("light");
		expect(getThemeForDayPeriod(night)).toBe("dark");
	});

	it("getGradientForDayPeriod returns exact palette strings", () => {
		const expected = {
			dawn: "linear-gradient(to bottom, #2f5aa7 0%, #f1d8ff 100%)",
			morning: "linear-gradient(to bottom, #4d80e6 0%, #f7efe0 100%)",
			afternoon: "linear-gradient(to bottom, #4d80e6 0%, #e9dfe5 100%)",
			night: "linear-gradient(to bottom, #09102a 0%, #d1b7ff 100%)",
		} satisfies Record<DayPeriod, string>;

		expect(getGradientForDayPeriod("dawn")).toBe(expected.dawn);
		expect(getGradientForDayPeriod("morning")).toBe(expected.morning);
		expect(getGradientForDayPeriod("afternoon")).toBe(expected.afternoon);
		expect(getGradientForDayPeriod("night")).toBe(expected.night);
	});

	it("getProgressiveBlurColorForDayPeriod returns exact colors", () => {
		const expected = {
			dawn: "#f1d8ff",
			morning: "#f7efe0",
			afternoon: "#e9dfe5",
			night: "#d1b7ff",
		} satisfies Record<DayPeriod, string>;

		expect(getProgressiveBlurColorForDayPeriod("dawn")).toBe(expected.dawn);
		expect(getProgressiveBlurColorForDayPeriod("morning")).toBe(
			expected.morning
		);
		expect(getProgressiveBlurColorForDayPeriod("afternoon")).toBe(
			expected.afternoon
		);
		expect(getProgressiveBlurColorForDayPeriod("night")).toBe(expected.night);
	});

	it("getInitialModeFromStorage validates values and defaults invalid -> time-based", () => {
		const validValues: ThemeMode[] = ["light", "dark", "time-based"];
		for (const v of validValues) {
			expect(getInitialModeFromStorage(v)).toBe(v);
		}

		expect(getInitialModeFromStorage(null)).toBe("time-based");
		expect(getInitialModeFromStorage(undefined)).toBe("time-based");
		expect(getInitialModeFromStorage("nope")).toBe("time-based");
		expect(getInitialModeFromStorage({})).toBe("time-based");
	});

	it("shouldTriggerWaveBlur respects reduced motion and initial mount gating", () => {
		expect(shouldTriggerWaveBlur(null, "morning", true)).toBe(false);
		expect(shouldTriggerWaveBlur(null, "morning", false)).toBe(false);

		expect(shouldTriggerWaveBlur("dawn", "dawn", false)).toBe(false);
		expect(shouldTriggerWaveBlur("dawn", "morning", false)).toBe(true);
	});
});
