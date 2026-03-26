"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type {
	AnimationSettings,
	DayPeriod,
	PaletteByPeriod,
} from "./theme-lab-types";
import { canRunSimulation } from "./theme-lab-utils";

interface ThemeLabPreviewProps {
	activePeriod: DayPeriod;
	paletteByPeriod: PaletteByPeriod;
	animation: AnimationSettings;
	simulationToken: number;
	onSimulate: () => void;
}

const EASING_TO_TIMING_FUNCTION: Record<AnimationSettings["easing"], string> = {
	"ease-out": "cubic-bezier(0, 0, 0.2, 1)",
	"ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
	"wave-soft": "cubic-bezier(0.16, 1, 0.3, 1)",
};

export function ThemeLabPreview({
	activePeriod,
	paletteByPeriod,
	animation,
	simulationToken,
	onSimulate,
}: ThemeLabPreviewProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const overlayRef = useRef<HTMLDivElement | null>(null);
	const [isWaveVisible, setIsWaveVisible] = useState(false);
	const activePalette = paletteByPeriod[activePeriod];
	const simulationEnabled = canRunSimulation(prefersReducedMotion);

	useEffect(() => {
		if (!simulationEnabled || simulationToken === 0) {
			setIsWaveVisible(false);
			return;
		}

		const overlayElement = overlayRef.current;
		if (!overlayElement) {
			return;
		}

		setIsWaveVisible(true);
		// Run the wave-style preview animation with current tuning values.
		const waveAnimation = overlayElement.animate(
			[
				{
					opacity: 0.85,
					filter: `blur(${animation.blurPx}px)`,
					transform: "scale(1.02)",
				},
				{
					opacity: 0,
					filter: "blur(0px)",
					transform: "scale(1)",
				},
			],
			{
				duration: animation.durationMs,
				easing: EASING_TO_TIMING_FUNCTION[animation.easing],
				fill: "forwards",
			}
		);

		waveAnimation.onfinish = () => {
			setIsWaveVisible(false);
		};

		return () => {
			waveAnimation.cancel();
			setIsWaveVisible(false);
		};
	}, [
		animation.blurPx,
		animation.durationMs,
		animation.easing,
		simulationEnabled,
		simulationToken,
	]);

	return (
		<section
			aria-label="Theme Lab preview canvas"
			className="rounded-xl border border-primary/20 bg-background/40 p-6 shadow-sm backdrop-blur-sm"
		>
			<div className="flex items-center justify-between gap-3">
				<h2 className="font-semibold text-lg text-primary-foreground">
					Preview
				</h2>
				<button
					className="rounded-md border border-primary/35 bg-background/70 px-3 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
					disabled={!simulationEnabled}
					onClick={onSimulate}
					type="button"
				>
					{simulationEnabled ? "Run Simulation" : "Reduced Motion Enabled"}
				</button>
			</div>

			<div className="mt-4 grid gap-3 text-primary-foreground/85 text-sm">
				<p>{`Period: ${activePeriod}`}</p>
				<p>{`Start: ${activePalette.start}`}</p>
				<p>{`End: ${activePalette.end}`}</p>
				<p>{`Blur: ${activePalette.blur}`}</p>
				<p>{`Duration: ${animation.durationMs}ms | BlurPx: ${animation.blurPx} | Easing: ${animation.easing}`}</p>
			</div>

			<div
				aria-hidden="true"
				className="relative mt-5 h-64 overflow-hidden rounded-xl border border-primary/20"
				style={{
					backgroundImage: `linear-gradient(135deg, ${activePalette.start}, ${activePalette.end})`,
				}}
			>
				<div
					className="pointer-events-none absolute inset-0"
					style={{
						background: `radial-gradient(circle at 25% 30%, ${activePalette.blur}cc, transparent 60%)`,
					}}
				/>
				<div
					className="pointer-events-none absolute inset-0"
					ref={overlayRef}
					style={{
						backgroundImage: `linear-gradient(135deg, ${activePalette.start}, ${activePalette.end})`,
						opacity: isWaveVisible ? 0.85 : 0,
					}}
				/>
			</div>
		</section>
	);
}
