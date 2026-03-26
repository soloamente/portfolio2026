const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function isHexColor(value: string): boolean {
	return HEX_COLOR_PATTERN.test(value);
}

export function normalizeHexInput(
	previousValid: string,
	draft: string
): string {
	// Keep the last known-good color while the draft value is incomplete or invalid.
	return isHexColor(draft) ? draft : previousValid;
}

export function clampDurationMs(value: number): number {
	// Keep animation timing within an interactive and safe preview range.
	return Math.min(3000, Math.max(100, value));
}

export function clampBlurPx(value: number): number {
	// Avoid negative blur and cap costly blur values.
	return Math.min(64, Math.max(0, value));
}

export function canRunSimulation(prefersReducedMotion: boolean): boolean {
	return !prefersReducedMotion;
}
