"use client";

/**
 * Card grid uses the same stagger model as {@link AnimatedHeading}: a parent
 * `motion` container with `staggerChildren` so each tile steps in sequence.
 * Per-card motion matches heading tokens (opacity / y / blur timings).
 */

import { motion } from "motion/react";
import {
	ENTRANCE_DELAY_S,
	TEXT_FADE_EASE,
} from "@/components/animated-heading";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/** Matches `AnimatedHeading` token y animation. */
const HEADING_Y_EASE = [0.25, 0.46, 0.45, 0.94] as const;

/** Same step as `headingStagger` in AnimatedHeading — visible cascade across cards. */
const CARD_STAGGER = 0.045;

export interface AnimatedCardGridProps {
	className?: string;
	children: React.ReactNode;
}

/**
 * Wraps the projects/crafts grid; when the block enters the viewport, children
 * animate with staggered delays (like staggered heading tokens).
 */
export function AnimatedCardGrid({
	className,
	children,
}: AnimatedCardGridProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const staggerChildren = prefersReducedMotion ? 0 : CARD_STAGGER;

	return (
		<motion.div
			className={className}
			initial="hidden"
			variants={{
				hidden: {},
				visible: {
					transition: {
						staggerChildren,
						delayChildren: prefersReducedMotion ? 0 : ENTRANCE_DELAY_S,
					},
				},
			}}
			viewport={{ amount: 0.3, margin: "-50px" }}
			whileInView="visible"
		>
			{children}
		</motion.div>
	);
}

export interface AnimatedCardProps {
	className?: string;
	children: React.ReactNode;
}

export function AnimatedCard({ className, children }: AnimatedCardProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const tokenTransition = prefersReducedMotion
		? { duration: 0.2, ease: TEXT_FADE_EASE }
		: {
				opacity: { duration: 0.9, ease: TEXT_FADE_EASE },
				y: { duration: 0.9, ease: HEADING_Y_EASE },
				filter: { duration: 0.58, ease: TEXT_FADE_EASE },
			};

	return (
		<motion.div
			className={cn("transform-gpu", className)}
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
			{/* Inner shell: hover scale uses CSS transform here so it does not fight Motion’s transform on the outer node. */}
			<div className="card-hover-scale h-full w-full cursor-pointer rounded-2xl bg-background/60 p-2 backdrop-blur-sm hover:shadow-orange-300/5 hover:shadow-sm">
				{children}
			</div>
		</motion.div>
	);
}
