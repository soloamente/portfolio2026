"use client";

import { Drawer } from "@base-ui/react/drawer";
import { motion } from "motion/react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ProjectRecord } from "@/app/projects/_lib/projects-data";
import {
	PROJECT_MORPH_STAGE,
	PROJECT_MORPH_TIMING,
	PROJECT_MORPH_WRAPPER,
	type ProjectMorphStage,
} from "./project-morph-storyboard";

export interface ProjectDialogOverlayProps {
	readonly project: ProjectRecord;
}

/**
 * Minimal project dialog baseline for `/projects/[name]`.
 * Provides heading semantics, category cards, and a keyboard-focusable close/back affordance.
 */
export function ProjectDialogOverlay({ project }: ProjectDialogOverlayProps) {
	const dialogHeadingId = `project-dialog-title-${project.slug}`;
	const closeHref = "/projects" as Route;
	const router = useRouter();
	const [isClosing, setIsClosing] = useState(false);
	const [morphStage, setMorphStage] = useState<ProjectMorphStage>(
		PROJECT_MORPH_STAGE.idle
	);
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const openStageTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

	const beginCloseTransition = () => {
		// Prevent double navigation while close animation is in-flight.
		if (isClosing) {
			return;
		}
		// Clear in-flight open stage timers so close sequencing owns the timeline.
		openStageTimersRef.current.forEach(clearTimeout);
		openStageTimersRef.current = [];
		setIsClosing(true);
		setMorphStage(PROJECT_MORPH_STAGE.wrapperExpanded);
		closeTimeoutRef.current = setTimeout(() => {
			router.push(closeHref);
		}, PROJECT_MORPH_TIMING.closeCollapseMs);
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			beginCloseTransition();
		}
	};

	useEffect(() => {
		// Stage-driven open timeline scaffold.
		// Task 1 only: define and schedule stages without changing full visual choreography yet.
		setMorphStage(PROJECT_MORPH_STAGE.geometryLocked);
		openStageTimersRef.current.push(
			setTimeout(
				() => setMorphStage(PROJECT_MORPH_STAGE.wrapperExpanded),
				PROJECT_MORPH_TIMING.wrapperExpandMs
			)
		);
		openStageTimersRef.current.push(
			setTimeout(
				() => setMorphStage(PROJECT_MORPH_STAGE.contentVisible),
				PROJECT_MORPH_TIMING.contentRevealMs
			)
		);
		openStageTimersRef.current.push(
			setTimeout(
				() => setMorphStage(PROJECT_MORPH_STAGE.settled),
				PROJECT_MORPH_TIMING.settleMs
			)
		);

		return () => {
			openStageTimersRef.current.forEach(clearTimeout);
			openStageTimersRef.current = [];
			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current);
			}
		};
	}, []);

	return (
		<Drawer.Root onOpenChange={handleOpenChange} open>
			<Drawer.Portal>
				{/* Base UI default-style leaning backdrop + popup transitions for true drawer feel. */}
				<Drawer.Backdrop className="fixed inset-0 z-40 bg-black/40" />
				<Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
					<Drawer.Popup className="w-full max-w-4xl outline-none">
						<motion.div
							animate={
								isClosing ? { y: "100%", opacity: 1 } : { y: 0, opacity: 1 }
							}
							className="w-full"
							data-morph-stage={morphStage}
							exit={{ y: "100%", opacity: 1 }}
							initial={{ y: "100%", opacity: 1 }}
							transition={PROJECT_MORPH_WRAPPER.transition}
						>
							<Drawer.Content
								aria-labelledby={dialogHeadingId}
								className="h-[90dvh] w-full overflow-auto rounded-t-2xl bg-background p-6"
							>
								{/* Keep close/back first and autofocus it as the initial keyboard focus target. */}
								<Link
									autoFocus
									className="inline-flex rounded-md px-3 py-2 text-foreground/80 text-sm transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
									href={closeHref}
									onClick={(event) => {
										event.preventDefault();
										beginCloseTransition();
									}}
									transitionTypes={["project-close"]}
								>
									Back to projects
								</Link>

								{/* Shared view-transition target so the card media wrapper morphs into this full-page drawer media area. */}
								<div
									className="mt-4 h-56 w-full overflow-hidden rounded-xl bg-[url('/bg/1.jpg')] bg-center bg-cover"
									style={{
										viewTransitionName: `project-media-${project.slug}`,
									}}
								/>

								<Drawer.Title
									className="mt-3 font-semibold text-2xl text-foreground"
									id={dialogHeadingId}
								>
									{project.title}
								</Drawer.Title>

								<Drawer.Description className="mt-2 text-foreground/75 text-sm">
									Select a category to continue exploring this project.
								</Drawer.Description>

								<div className="mt-5 grid gap-3 sm:grid-cols-2">
									{project.categories.map((category) => {
										const categoryHref =
											`/projects/${project.slug}/${category.slug}` as Route;
										return (
											<Link
												className="rounded-xl border border-border/60 bg-card px-4 py-3 text-left text-card-foreground transition hover:border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
												href={categoryHref}
												key={category.slug}
												transitionTypes={["project-category-open"]}
											>
												<span className="font-medium text-sm">
													{category.label}
												</span>
											</Link>
										);
									})}
								</div>
							</Drawer.Content>
						</motion.div>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	);
}
