"use client";

import Lottie from "lottie-react";

export interface ProjectCoverLottieProps {
	animationData: Record<string, unknown> | null;
	className?: string;
}

export function ProjectCoverLottie({
	animationData,
	className,
}: ProjectCoverLottieProps) {
	if (animationData === null) {
		// Helpful fallback so the card still communicates why the animation is missing.
		return (
			<div
				className={`flex h-full w-full items-center justify-center rounded-xl bg-background/70 p-4 text-center text-foreground/80 text-sm ${className ?? ""}`}
			>
				Lottie cover file not found at src/app/projects/covers/Cura.json
			</div>
		);
	}

	return (
		<Lottie
			animationData={animationData}
			autoplay
			className={className}
			loop
			rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
		/>
	);
}
