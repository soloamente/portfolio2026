"use client";

/**
 * Multiple paragraphs share one whileInView (no separate scroll triggers per block) but stagger
 * their entrance so each <p> follows the previous with a short delay.
 */

import { motion } from "motion/react";
import { ENTRANCE_DELAY_S, TEXT_FADE_EASE } from "@/components/animated-heading";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export interface AnimatedParagraphGroupProps {
	paragraphs: string[];
	/** Classes on the outer wrapper (width, alignment, etc.) */
	className?: string;
	/** Classes applied to each <p> */
	paragraphClassName?: string;
	/** Delay between each paragraph starting (seconds); ignored when prefers-reduced-motion */
	staggerParagraphs?: number;
}

export function AnimatedParagraphGroup({
	paragraphs,
	className,
	paragraphClassName,
	staggerParagraphs = 0.14,
}: AnimatedParagraphGroupProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const paragraphTransition = prefersReducedMotion
		? { duration: 0.2, ease: TEXT_FADE_EASE }
		: {
				opacity: { duration: 0.9, ease: TEXT_FADE_EASE },
				y: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const },
				filter: { duration: 0.58, ease: TEXT_FADE_EASE },
			};

	return (
		<motion.div
			className={cn("flex flex-col gap-8", className)}
			initial="hidden"
			variants={{
				hidden: {},
				visible: {
					transition: {
						staggerChildren: prefersReducedMotion ? 0 : staggerParagraphs,
						delayChildren: prefersReducedMotion ? 0 : ENTRANCE_DELAY_S,
					},
				},
			}}
			viewport={{ amount: 0.25, margin: "-40px" }}
			whileInView="visible"
		>
			{paragraphs.map((paragraph, index) => (
				<motion.p
					className={cn("transform-gpu", paragraphClassName)}
					key={`${index}-${paragraph.slice(0, 24)}`}
					transition={paragraphTransition}
					variants={{
						hidden: prefersReducedMotion
							? { opacity: 0 }
							: { opacity: 0, y: "0.2em", filter: "blur(10px)" },
						visible: prefersReducedMotion
							? { opacity: 1 }
							: { opacity: 1, y: 0, filter: "blur(0px)" },
					}}
				>
					{paragraph}
				</motion.p>
			))}
		</motion.div>
	);
}
