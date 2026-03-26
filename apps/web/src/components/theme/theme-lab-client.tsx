"use client";

import { useState } from "react";
import { ThemeLabPanel } from "./theme-lab-panel";
import { ThemeLabPreview } from "./theme-lab-preview";
import {
	type AnimationSettings,
	type DayPeriod,
	DEFAULT_THEME_LAB_ANIMATION_SETTINGS,
	DEFAULT_THEME_LAB_PALETTE,
	DEFAULT_THEME_LAB_PERIOD,
	type EasingPreset,
	type PaletteByPeriod,
} from "./theme-lab-types";
import {
	clampBlurPx,
	clampDurationMs,
	normalizeHexInput,
} from "./theme-lab-utils";

export function ThemeLabClient() {
	// Keep all Theme Lab changes local to this route; no global mutation or persistence.
	const [activePeriod, setActivePeriod] = useState<DayPeriod>(
		DEFAULT_THEME_LAB_PERIOD
	);
	const [paletteByPeriod, setPaletteByPeriod] = useState<PaletteByPeriod>(
		DEFAULT_THEME_LAB_PALETTE
	);
	const [animation, setAnimation] = useState<AnimationSettings>(
		DEFAULT_THEME_LAB_ANIMATION_SETTINGS
	);
	const [simulationToken, setSimulationToken] = useState(0);
	const [exportStatus, setExportStatus] = useState<"idle" | "copied" | "error">(
		"idle"
	);

	function handlePaletteColorTextChange(
		period: DayPeriod,
		key: "start" | "end" | "blur",
		draft: string
	) {
		setPaletteByPeriod((previous) => {
			const currentColor = previous[period][key];
			const nextColor = normalizeHexInput(currentColor, draft);

			return {
				...previous,
				[period]: {
					...previous[period],
					[key]: nextColor,
				},
			};
		});
	}

	function handlePaletteColorPickerChange(
		period: DayPeriod,
		key: "start" | "end" | "blur",
		value: string
	) {
		setPaletteByPeriod((previous) => ({
			...previous,
			[period]: {
				...previous[period],
				[key]: value,
			},
		}));
	}

	function handleDurationChange(value: number) {
		setAnimation((previous) => ({
			...previous,
			durationMs: clampDurationMs(
				Number.isFinite(value) ? value : previous.durationMs
			),
		}));
	}

	function handleBlurChange(value: number) {
		setAnimation((previous) => ({
			...previous,
			blurPx: clampBlurPx(Number.isFinite(value) ? value : previous.blurPx),
		}));
	}

	function handleEasingChange(value: EasingPreset) {
		setAnimation((previous) => ({
			...previous,
			easing: value,
		}));
	}

	function handleSimulationTrigger() {
		// Increment a local token so each click forces a fresh preview animation run.
		setSimulationToken((previous) => previous + 1);
	}

	const exportJson = JSON.stringify(
		{
			activePeriod,
			paletteByPeriod,
			animation,
		},
		null,
		2
	);

	async function handleCopyExport() {
		try {
			await navigator.clipboard.writeText(exportJson);
			setExportStatus("copied");
		} catch (_error) {
			setExportStatus("error");
		}
	}

	return (
		<main className="relative flex min-h-screen flex-col bg-transparent p-8">
			<div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2">
				<ThemeLabPanel
					activePeriod={activePeriod}
					animation={animation}
					exportJson={exportJson}
					exportStatus={exportStatus}
					onActivePeriodChange={setActivePeriod}
					onBlurChange={handleBlurChange}
					onCopyExport={handleCopyExport}
					onDurationChange={handleDurationChange}
					onEasingChange={handleEasingChange}
					onPaletteColorPickerChange={handlePaletteColorPickerChange}
					onPaletteColorTextChange={handlePaletteColorTextChange}
					paletteByPeriod={paletteByPeriod}
				/>
				<ThemeLabPreview
					activePeriod={activePeriod}
					animation={animation}
					onSimulate={handleSimulationTrigger}
					paletteByPeriod={paletteByPeriod}
					simulationToken={simulationToken}
				/>
			</div>
		</main>
	);
}
