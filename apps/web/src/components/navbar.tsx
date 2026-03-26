"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";

// Typed routes expect href to match generated Route; cast so link arrays work
type LinkHref = ComponentProps<typeof Link>["href"];

// Keep the list of links at module scope so we can reliably use it in hooks
const links = [
	{ to: "/", label: "Home" },
	{ to: "/projects", label: "Projects" },
	{ to: "/crafts", label: "Crafts" },
	{ to: "/about", label: "About" },
	{ to: "/contact", label: "Contact" },
] as const;

// Helpful type to describe the pill clipping region; we keep it as a raw CSS string
interface PillClipState {
	clipPath: string;
}

export default function Navbar() {
	const pathname = usePathname();

	// We track the nav container so we can measure link positions relative to it
	const navRef = useRef<HTMLDivElement | null>(null);

	// We keep a ref to each link so we can compute the white pill position based on the active link
	const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

	// This state holds the current clip-path for the shared white pill background
	const [pillClip, setPillClip] = useState<PillClipState | null>(null);

	// Slower + smoother easing for a more fluid slide/resize.
	const CLIP_PATH_TRANSITION_MS = 520;
	const CLIP_PATH_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

	/* ─────────────────────────────────────────────────────────
	 * NAVBAR PILL ANIMATION STORYBOARD
	 *
	 *   0ms   route changes, we measure the active link
	 *  40ms   white pill snaps to new measurements (no flicker)
	 * 520ms   clip-path animates so the pill "slides" to the new label
	 *
	 * The pill is a single full-width white layer under all labels.
	 * We reveal just the active label area using a rounded clip-path,
	 * so the width always matches the content and transitions stay smooth.
	 * ───────────────────────────────────────────────────────── */

	useLayoutEffect(() => {
		// Helper that recomputes the pill clip-path based on the current active link
		const updatePillClip = () => {
			const navElement = navRef.current;

			if (!navElement) {
				return;
			}

			const navRect = navElement.getBoundingClientRect();

			// Find which link should be active for the current pathname
			const activeLink = links.find(({ to }) =>
				to === "/"
					? pathname === "/"
					: pathname === to || pathname.startsWith(`${to}/`)
			);

			if (!activeLink) {
				return;
			}

			const activeAnchor = linkRefs.current[activeLink.to];

			if (!activeAnchor) {
				return;
			}

			const linkRect = activeAnchor.getBoundingClientRect();

			// Compute the left/right padding of the pill relative to the nav container
			const left = linkRect.left - navRect.left;
			const right = navRect.right - linkRect.right;

			// Use an inset() clip-path so the pill stays fully rounded and only reveals the active label area.
			// We keep everything in px so resizing remains precise and we can animate the clip-path smoothly.
			const clipPath = `inset(0px ${right}px 0px ${left}px round 9999px)`;

			setPillClip({ clipPath });
		};

		// Run once on mount / route change.
		updatePillClip();

		// Also update on resize so the pill stays aligned when the viewport changes
		window.addEventListener("resize", updatePillClip);

		return () => {
			window.removeEventListener("resize", updatePillClip);
		};
	}, [pathname]);

	return (
		<div className="fixed right-0 bottom-5 left-0 z-500 flex items-center justify-center px-2 py-1">
			<div className="flex items-center gap-2">
				<nav
					className="relative flex h-fit w-fit rounded-full bg-background/35 p-1 text-lg backdrop-blur-sm"
					ref={navRef}
				>
					{/* Shared white pill layer that sits under all labels; we reveal only the active area via clip-path */}
					{pillClip && (
						<div
							aria-hidden="true"
							// We inset the pill slightly on the Y axis so the original vertical padding of the nav is preserved.
							className="pointer-events-none absolute inset-x-0 inset-y-1 z-0 bg-background"
							style={{
								clipPath: pillClip.clipPath,
								// We animate the clip-path so the pill glides smoothly between labels
								transition: `clip-path ${CLIP_PATH_TRANSITION_MS}ms ${CLIP_PATH_EASING}`,
								willChange: "clip-path",
								// Put the shadow on the moving pill itself so it stays in sync
								// with the animation (no instant "label glow" jump).
								filter: "drop-shadow(0px 0px 7px rgba(0,0,0,0.09))",
							}}
						/>
					)}

					{links.map(({ to, label }) => {
						// Home: active only on exact "/"; other routes: exact match or nested path
						const isActive =
							to === "/"
								? pathname === "/"
								: pathname === to || pathname.startsWith(`${to}/`);

						return (
							<Link
								className={cn(
									"relative z-10 rounded-full px-4.25 py-2.75 font-medium text-sm leading-none opacity-50",
									isActive && "opacity-100"
								)}
								href={to as LinkHref}
								key={to}
								ref={(element) => {
									// We store each anchor so the pill can align to its bounding box
									linkRefs.current[to] = element;
								}}
							>
								{label}
							</Link>
						);
					})}
				</nav>
				<ModeToggle />
			</div>
		</div>
	);
}
