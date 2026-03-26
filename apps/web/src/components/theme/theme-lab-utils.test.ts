import { describe, expect, it } from "bun:test";

import {
	canRunSimulation,
	clampBlurPx,
	clampDurationMs,
	isHexColor,
	normalizeHexInput,
} from "./theme-lab-utils";

describe("theme-lab-utils", () => {
	it("isHexColor accepts only full #RRGGBB values", () => {
		expect(isHexColor("#a1b2c3")).toBe(true);
		expect(isHexColor("#ABCDEF")).toBe(true);

		expect(isHexColor("#abc")).toBe(false);
		expect(isHexColor("#12345")).toBe(false);
		expect(isHexColor("123456")).toBe(false);
		expect(isHexColor("#1234567")).toBe(false);
		expect(isHexColor("#12GG56")).toBe(false);
	});

	it("normalizeHexInput keeps previous valid value for invalid or partial drafts", () => {
		const previousValid = "#112233";

		expect(normalizeHexInput(previousValid, "#aabbcc")).toBe("#aabbcc");
		expect(normalizeHexInput(previousValid, "#abc")).toBe(previousValid);
		expect(normalizeHexInput(previousValid, "hello")).toBe(previousValid);
		expect(normalizeHexInput(previousValid, "#12345")).toBe(previousValid);
		expect(normalizeHexInput(previousValid, "#1234567")).toBe(previousValid);
	});

	it("clampDurationMs clamps values to 100..3000", () => {
		expect(clampDurationMs(-1)).toBe(100);
		expect(clampDurationMs(99)).toBe(100);
		expect(clampDurationMs(100)).toBe(100);
		expect(clampDurationMs(750)).toBe(750);
		expect(clampDurationMs(3000)).toBe(3000);
		expect(clampDurationMs(3001)).toBe(3000);
	});

	it("clampBlurPx clamps values to 0..64", () => {
		expect(clampBlurPx(-1)).toBe(0);
		expect(clampBlurPx(0)).toBe(0);
		expect(clampBlurPx(12)).toBe(12);
		expect(clampBlurPx(64)).toBe(64);
		expect(clampBlurPx(65)).toBe(64);
	});

	it("canRunSimulation returns false when reduced motion is enabled", () => {
		expect(canRunSimulation(true)).toBe(false);
		expect(canRunSimulation(false)).toBe(true);
	});
});
