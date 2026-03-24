"use client";

// Lenis smooth scrolling for the document; respects prefers-reduced-motion so users who
// disable animations keep native scrolling (accessibility).
import { ReactLenis } from "lenis/react";
import { useSyncExternalStore } from "react";

import "lenis/dist/lenis.css";

/** Subscribes to OS/browser reduced-motion preference changes (client-only). */
function subscribeReducedMotion(onStoreChange: () => void): () => void {
	const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
	mq.addEventListener("change", onStoreChange);
	return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionClient(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** SSR: assume motion is allowed so Lenis hydrates consistently; client then corrects if needed. */
function getReducedMotionServer(): boolean {
	return false;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
	const prefersReducedMotion = useSyncExternalStore(
		subscribeReducedMotion,
		getReducedMotionClient,
		getReducedMotionServer
	);

	if (prefersReducedMotion) {
		return children;
	}

	return (
		<ReactLenis
			options={{
				// Lenis runs its own rAF loop when true (default in ReactLenis; set explicitly for clarity).
				autoRaf: true,
				// Slightly softer inertia than default lerp; tweak to taste.
				lerp: 0.09,
			}}
			root
		>
			{children}
		</ReactLenis>
	);
}
