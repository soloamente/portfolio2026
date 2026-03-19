import { useSyncExternalStore } from "react";

/**
 * True when the user prefers reduced motion (OS / browser setting).
 * SSR snapshot is false so we animate on first paint, then respect the media query on the client.
 */
export function usePrefersReducedMotion(): boolean {
	return useSyncExternalStore(
		(onChange) => {
			if (typeof window === "undefined") {
				// Server render: no matchMedia; unsubscribe is a no-op.
				return () => undefined;
			}
			const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
			mq.addEventListener("change", onChange);
			return () => mq.removeEventListener("change", onChange);
		},
		() => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		() => false
	);
}
