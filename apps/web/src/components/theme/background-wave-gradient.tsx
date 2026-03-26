"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import styles from "./background-wave-gradient.module.css";
import type { DayPeriod } from "./theme-utils";
import { shouldTriggerWaveBlur } from "./theme-utils";

interface BackgroundWaveGradientProps {
	dayPeriod: DayPeriod;
	gradient: string;
}

export function BackgroundWaveGradient({
	dayPeriod,
	gradient,
}: BackgroundWaveGradientProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const previousDayPeriodRef = useRef<DayPeriod | null>(null);
	const [overlayAnimationKey, setOverlayAnimationKey] = useState(0);
	const [overlayGradient, setOverlayGradient] = useState(gradient);
	const [isWaveVisible, setIsWaveVisible] = useState(false);

	useEffect(() => {
		const previousDayPeriod = previousDayPeriodRef.current;

		if (
			shouldTriggerWaveBlur(previousDayPeriod, dayPeriod, prefersReducedMotion)
		) {
			// Keep overlay gradient in sync with the new target gradient before animating.
			setOverlayGradient(gradient);
			setOverlayAnimationKey((previous) => previous + 1);
			setIsWaveVisible(true);
		} else {
			setOverlayGradient(gradient);
		}

		previousDayPeriodRef.current = dayPeriod;
	}, [dayPeriod, gradient, prefersReducedMotion]);

	return (
		<>
			{/* Base global gradient layer: always visible behind app content. */}
			<div
				aria-hidden
				className="pointer-events-none fixed inset-0 z-0"
				style={{ backgroundImage: gradient }}
			/>
			{/* Overlay layer creates a short blur/fade "wave" when day period changes. */}
			{isWaveVisible && (
				<div
					aria-hidden
					className={`pointer-events-none fixed inset-0 z-1 ${styles.overlayWave}`}
					key={overlayAnimationKey}
					onAnimationEnd={() => setIsWaveVisible(false)}
					style={{ backgroundImage: overlayGradient }}
				/>
			)}
		</>
	);
}
