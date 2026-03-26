/* ─────────────────────────────────────────────────────────
 * PROJECT MORPH STORYBOARD
 *
 * Read top-to-bottom. Each `at` value is ms after trigger.
 *
 *    0ms   card wrapper idle in grid
 *   30ms   source geometry lock + elevated wrapper layer
 *  560ms   wrapper expands and morphs to dialog shell
 *  760ms   source image blurs/fades out while detail content fades in
 *  980ms   dialog settles into interactive state
 *
 * Reverse close uses mirrored stages:
 *  content out -> wrapper collapse -> image restore at source.
 * ───────────────────────────────────────────────────────── */

/**
 * Stage model used across project route overlays.
 * A single integer keeps choreography additive and deterministic.
 */
export const PROJECT_MORPH_STAGE = {
	idle: 0,
	geometryLocked: 1,
	wrapperExpanded: 2,
	contentVisible: 3,
	settled: 4,
} as const;

export type ProjectMorphStage =
	(typeof PROJECT_MORPH_STAGE)[keyof typeof PROJECT_MORPH_STAGE];

/**
 * Single timing source for open and close choreography.
 * Keep all future stage timers derived from these constants.
 */
export const PROJECT_MORPH_TIMING = {
	geometryLockMs: 30, // ensure first paint has a stable source rectangle
	wrapperExpandMs: 560, // card wrapper expands to dialog shell
	contentRevealMs: 760, // detail content cross-fades in after shell expansion
	settleMs: 980, // final stage where dialog is fully interactive
	closeCollapseMs: 720, // wrapper collapses back to card on close
} as const;

/**
 * Wrapper visual configuration for container-level motion.
 * This file intentionally centralizes spring/ease values for future task work.
 */
export const PROJECT_MORPH_WRAPPER = {
	initialBorderRadiusPx: 16, // card corner roundness in the grid
	finalBorderRadiusPx: 24, // larger radius in full-page dialog shell
	transition: {
		duration: PROJECT_MORPH_TIMING.closeCollapseMs / 1000,
		ease: [0.22, 1, 0.36, 1] as const,
	},
} as const;

/**
 * Image handoff values used by the later blur/fade implementation.
 */
export const PROJECT_MORPH_IMAGE = {
	blurOutPx: 18, // blur intensity while wrapper expands
	fadeOutOpacity: 0, // source image fades to transparent in dialog state
} as const;

/**
 * Detail content reveal contract used by the later content sequencing task.
 */
export const PROJECT_MORPH_CONTENT = {
	initialOpacity: 0,
	finalOpacity: 1,
	initialOffsetY: 12, // subtle upward settle on reveal
	finalOffsetY: 0,
} as const;
