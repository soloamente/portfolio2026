"use client";

/**
 * Staggered token reveal: opacity + em-based y + blur(0) for a soft “focus” feel.
 * Blur uses a slightly shorter duration than opacity/y to avoid fighting the GPU too long.
 */

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/** Same handle as many editorial sites use for long opacity ramps (see e.g. daybreak.studio-style text-fade-in). */
export const TEXT_FADE_EASE = [0.61, 1, 0.88, 1] as const;

/** Lead-in before staggered children (heading tokens, card grids) on scroll-driven reveals. */
export const ENTRANCE_DELAY_S = 0.2;

const motionTags = {
	div: motion.div,
	h1: motion.h1,
	h2: motion.h2,
	h3: motion.h3,
	p: motion.p,
} as const;

export type AnimatedHeadingAs = keyof typeof motionTags;

export interface AnimatedHeadingProps {
	/** Plain text to split into word/space tokens and animate */
	text: string;
	className?: string;
	as?: AnimatedHeadingAs;
}

export function AnimatedHeading({
	text,
	className,
	as = "h1",
}: AnimatedHeadingProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	// Words and spaces as separate tokens so spacing is preserved with whitespace-pre
	const tokens = text.match(/\s+|\S+/g) ?? [];
	// Brisk stagger + ~0.9s per token; reduced motion: no blur/y, quick fades, no stagger
	const headingStagger = prefersReducedMotion ? 0 : 0.045;
	const tokenTransition = prefersReducedMotion
		? { duration: 0.2, ease: TEXT_FADE_EASE }
		: {
				opacity: { duration: 0.9, ease: TEXT_FADE_EASE },
				y: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const },
				filter: { duration: 0.58, ease: TEXT_FADE_EASE },
			};

	const MotionTag = motionTags[as];

	return (
		<MotionTag
			// w-full + flex wrap + justify-center: text-center on shrink-wrapped headings does not
			// visually center multi-line token spans; this matches the parent width and centers each row.
			className={cn(
				"flex w-full max-w-full flex-wrap justify-center whitespace-pre",
				className
			)}
			initial="hidden"
			variants={{
				hidden: {},
				visible: {
					transition: {
						staggerChildren: headingStagger,
						// Pause before the first token/card so motion reads as one beat after scroll-in.
						delayChildren: prefersReducedMotion ? 0 : ENTRANCE_DELAY_S,
					},
				},
			}}
			viewport={{ amount: 0.3, margin: "-50px" }}
			whileInView="visible"
		>
			{tokens.map((token, index) => (
				<motion.span
					// Flex items are blockified; no inline-block so rows stay centered under justify-center.
					className="transform-gpu"
					key={`${index}-${token}`}
					transition={tokenTransition}
					variants={{
						hidden: prefersReducedMotion
							? { opacity: 0 }
							: { opacity: 0, y: "0.28em", filter: "blur(9px)" },
						visible: prefersReducedMotion
							? { opacity: 1 }
							: { opacity: 1, y: 0, filter: "blur(0px)" },
					}}
				>
					{token}
				</motion.span>
			))}
		</MotionTag>
	);
}
