"use client";

import type {
	AnimationSettings,
	DayPeriod,
	EasingPreset,
	PaletteByPeriod,
} from "./theme-lab-types";

const DAY_PERIOD_OPTIONS: DayPeriod[] = [
	"dawn",
	"morning",
	"afternoon",
	"night",
];
const EASING_OPTIONS: EasingPreset[] = ["ease-out", "ease-in-out", "wave-soft"];

interface ThemeLabPanelProps {
	activePeriod: DayPeriod;
	paletteByPeriod: PaletteByPeriod;
	animation: AnimationSettings;
	onActivePeriodChange: (period: DayPeriod) => void;
	onPaletteColorTextChange: (
		period: DayPeriod,
		key: "start" | "end" | "blur",
		draft: string
	) => void;
	onPaletteColorPickerChange: (
		period: DayPeriod,
		key: "start" | "end" | "blur",
		value: string
	) => void;
	onDurationChange: (value: number) => void;
	onBlurChange: (value: number) => void;
	onEasingChange: (value: EasingPreset) => void;
	exportJson: string;
	exportStatus: "idle" | "copied" | "error";
	onCopyExport: () => void;
}

export function ThemeLabPanel({
	activePeriod,
	paletteByPeriod,
	animation,
	onActivePeriodChange,
	onPaletteColorTextChange,
	onPaletteColorPickerChange,
	onDurationChange,
	onBlurChange,
	onEasingChange,
	exportJson,
	exportStatus,
	onCopyExport,
}: ThemeLabPanelProps) {
	const activePalette = paletteByPeriod[activePeriod];

	return (
		<section
			aria-label="Theme Lab controls"
			className="rounded-xl border border-primary/20 bg-background/60 p-6 shadow-sm backdrop-blur-sm"
		>
			<h2 className="font-semibold text-lg text-primary-foreground">
				Controls
			</h2>

			<div className="mt-4 space-y-5">
				<div className="space-y-2">
					<label
						className="font-medium text-primary-foreground text-sm"
						htmlFor="theme-lab-period"
					>
						Period
					</label>
					<select
						className="w-full rounded-md border border-primary/25 bg-background px-3 py-2 text-primary-foreground text-sm"
						id="theme-lab-period"
						onChange={(event) =>
							onActivePeriodChange(event.target.value as DayPeriod)
						}
						value={activePeriod}
					>
						{DAY_PERIOD_OPTIONS.map((period) => (
							<option key={period} value={period}>
								{period}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-3">
					<p className="font-medium text-primary-foreground text-sm">
						Colors ({activePeriod})
					</p>
					<ColorControlRow
						label="Gradient Start"
						onPickerChange={(value) =>
							onPaletteColorPickerChange(activePeriod, "start", value)
						}
						onTextChange={(draft) =>
							onPaletteColorTextChange(activePeriod, "start", draft)
						}
						pickerId="theme-lab-start-picker"
						textId="theme-lab-start-text"
						value={activePalette.start}
					/>
					<ColorControlRow
						label="Gradient End"
						onPickerChange={(value) =>
							onPaletteColorPickerChange(activePeriod, "end", value)
						}
						onTextChange={(draft) =>
							onPaletteColorTextChange(activePeriod, "end", draft)
						}
						pickerId="theme-lab-end-picker"
						textId="theme-lab-end-text"
						value={activePalette.end}
					/>
					<ColorControlRow
						label="Blur Color"
						onPickerChange={(value) =>
							onPaletteColorPickerChange(activePeriod, "blur", value)
						}
						onTextChange={(draft) =>
							onPaletteColorTextChange(activePeriod, "blur", draft)
						}
						pickerId="theme-lab-blur-picker"
						textId="theme-lab-blur-text"
						value={activePalette.blur}
					/>
				</div>

				<div className="space-y-3">
					<p className="font-medium text-primary-foreground text-sm">
						Animation
					</p>
					<div className="space-y-2">
						<label
							className="text-primary-foreground/85 text-sm"
							htmlFor="theme-lab-duration"
						>
							Duration (ms)
						</label>
						<input
							className="w-full rounded-md border border-primary/25 bg-background px-3 py-2 text-primary-foreground text-sm"
							id="theme-lab-duration"
							inputMode="numeric"
							onChange={(event) => onDurationChange(Number(event.target.value))}
							type="number"
							value={animation.durationMs}
						/>
					</div>

					<div className="space-y-2">
						<label
							className="text-primary-foreground/85 text-sm"
							htmlFor="theme-lab-blur-px"
						>
							Blur (px)
						</label>
						<input
							className="w-full rounded-md border border-primary/25 bg-background px-3 py-2 text-primary-foreground text-sm"
							id="theme-lab-blur-px"
							inputMode="numeric"
							onChange={(event) => onBlurChange(Number(event.target.value))}
							type="number"
							value={animation.blurPx}
						/>
					</div>

					<div className="space-y-2">
						<label
							className="text-primary-foreground/85 text-sm"
							htmlFor="theme-lab-easing"
						>
							Easing Preset
						</label>
						<select
							className="w-full rounded-md border border-primary/25 bg-background px-3 py-2 text-primary-foreground text-sm"
							id="theme-lab-easing"
							onChange={(event) =>
								onEasingChange(event.target.value as EasingPreset)
							}
							value={animation.easing}
						>
							{EASING_OPTIONS.map((preset) => (
								<option key={preset} value={preset}>
									{preset}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between gap-2">
						<p className="font-medium text-primary-foreground text-sm">
							Export JSON
						</p>
						<button
							className="rounded-md border border-primary/35 bg-background/70 px-3 py-1.5 font-medium text-primary-foreground text-xs transition-colors hover:bg-background"
							onClick={onCopyExport}
							type="button"
						>
							{exportStatus === "copied" ? "Copied!" : "Copy JSON"}
						</button>
					</div>
					<textarea
						className="h-36 w-full resize-none rounded-md border border-primary/25 bg-background px-3 py-2 font-mono text-primary-foreground text-xs"
						readOnly
						value={exportJson}
					/>
					{exportStatus === "error" && (
						<p className="text-destructive text-xs">
							Could not copy automatically. Use the JSON box to copy manually.
						</p>
					)}
				</div>
			</div>
		</section>
	);
}

interface ColorControlRowProps {
	label: string;
	pickerId: string;
	textId: string;
	value: string;
	onTextChange: (draft: string) => void;
	onPickerChange: (value: string) => void;
}

function ColorControlRow({
	label,
	pickerId,
	textId,
	value,
	onTextChange,
	onPickerChange,
}: ColorControlRowProps) {
	return (
		<div className="grid grid-cols-[1fr_auto] gap-2">
			<div className="space-y-1">
				<label className="text-primary-foreground/85 text-sm" htmlFor={textId}>
					{label}
				</label>
				<input
					className="w-full rounded-md border border-primary/25 bg-background px-3 py-2 font-mono text-primary-foreground text-sm"
					id={textId}
					onChange={(event) => onTextChange(event.target.value)}
					type="text"
					value={value}
				/>
			</div>
			<div className="flex items-end">
				<input
					aria-label={`${label} picker`}
					className="h-10 w-12 cursor-pointer rounded border border-primary/25 bg-transparent p-0.5"
					id={pickerId}
					onChange={(event) => onPickerChange(event.target.value)}
					type="color"
					value={value}
				/>
			</div>
		</div>
	);
}
