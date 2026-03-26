"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	PROJECT_MORPH_STAGE,
	PROJECT_MORPH_TIMING,
	PROJECT_MORPH_WRAPPER,
	type ProjectMorphStage,
} from "@/app/projects/_components/project-morph-storyboard";
import { AnimatedCard, AnimatedCardGrid } from "@/components/animated-card";
import { AnimatedHeading } from "@/components/animated-heading";
import { ProjectCoverLottie } from "@/components/project-cover-lottie";
import type { ProjectRecord } from "../_lib/projects-data";

interface ProjectsPageExperienceProps {
	readonly projects: readonly ProjectRecord[];
	readonly projectCoverAnimationData: Record<string, unknown> | null;
}

function getWrapperTransition(isClosing: boolean) {
	if (isClosing) {
		return PROJECT_MORPH_WRAPPER.transition;
	}

	// Open should feel snappier than close while keeping the same easing curve.
	return {
		duration: PROJECT_MORPH_WRAPPER.transition.duration * 0.58,
		ease: PROJECT_MORPH_WRAPPER.transition.ease,
	};
}

function getSecondaryWrapperTransition(isClosing: boolean) {
	if (isClosing) {
		return PROJECT_MORPH_WRAPPER.transition;
	}

	// Let the primary wrapper lead the motion first, then fade/scale this layer in.
	return {
		duration: PROJECT_MORPH_WRAPPER.transition.duration * 0.45,
		delay: PROJECT_MORPH_WRAPPER.transition.duration * 0.42,
		ease: PROJECT_MORPH_WRAPPER.transition.ease,
	};
}

function getContentTransition() {
	// Keep content reveal slightly after the secondary wrapper starts showing.
	return {
		duration: 0.24,
		delay: 0.08,
		ease: [0.22, 1, 0.36, 1] as const,
	};
}

export function ProjectsPageExperience({
	projects,
	projectCoverAnimationData,
}: ProjectsPageExperienceProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isClosing, setIsClosing] = useState(false);
	const [hiddenCardImageSlug, setHiddenCardImageSlug] = useState<string | null>(
		null
	);
	const [closingProject, setClosingProject] = useState<ProjectRecord | null>(
		null
	);
	const [morphStage, setMorphStage] = useState<ProjectMorphStage>(
		PROJECT_MORPH_STAGE.idle
	);
	const closeFallbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);

	const activeProjectSlug = searchParams.get("project");
	const activeCategorySlug = searchParams.get("category");
	const isDialogVisible = Boolean(activeProjectSlug);

	const activeProject = useMemo(() => {
		if (!activeProjectSlug) {
			return null;
		}
		return (
			projects.find((project) => project.slug === activeProjectSlug) ?? null
		);
	}, [activeProjectSlug, projects]);

	const activeCategory = useMemo(() => {
		if (!(activeProject && activeCategorySlug)) {
			return null;
		}
		return (
			activeProject.categories.find(
				(category) => category.slug === activeCategorySlug
			) ?? null
		);
	}, [activeCategorySlug, activeProject]);
	const displayedProject = activeProject ?? closingProject;

	const updateQueryState = (next: {
		project?: string | null;
		category?: string | null;
	}) => {
		const params = new URLSearchParams(searchParams.toString());
		if (next.project === null) {
			params.delete("project");
		} else if (typeof next.project === "string") {
			params.set("project", next.project);
		}
		if (next.category === null) {
			params.delete("category");
		} else if (typeof next.category === "string") {
			params.set("category", next.category);
		}
		const query = params.toString();
		const href = (
			query.length > 0 ? `${pathname}?${query}` : pathname
		) as Route;
		const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
		if (href === currentUrl) {
			return;
		}
		router.replace(href, { scroll: false });
	};

	const handleProjectOpen = (projectSlug: string) => {
		setIsClosing(false);
		setClosingProject(null);
		// Stage tag is used for deterministic debugging while the shared-wrapper morph runs.
		setMorphStage(PROJECT_MORPH_STAGE.wrapperExpanded);
		updateQueryState({ project: projectSlug, category: null });
	};

	const beginDialogClose = () => {
		if (isClosing) {
			return;
		}

		// Keep the destination card image hidden until wrapper morph-back completes.
		setHiddenCardImageSlug(activeProjectSlug);
		setIsClosing(true);
		setClosingProject(activeProject);
		setMorphStage(PROJECT_MORPH_STAGE.geometryLocked);
		// Clear route state immediately so shared-layout return morph can run.
		updateQueryState({ project: null, category: null });
		if (closeFallbackTimeoutRef.current) {
			clearTimeout(closeFallbackTimeoutRef.current);
		}
		// Safety fallback: if layout completion callback doesn't fire,
		// force-close state after the known wrapper collapse duration.
		closeFallbackTimeoutRef.current = setTimeout(() => {
			setHiddenCardImageSlug(null);
			setClosingProject(null);
			setIsClosing(false);
			setMorphStage(PROJECT_MORPH_STAGE.idle);
			closeFallbackTimeoutRef.current = null;
		}, PROJECT_MORPH_TIMING.closeCollapseMs);
	};

	const handleCategorySelect = (categorySlug: string) => {
		updateQueryState({ category: categorySlug });
	};

	useEffect(() => {
		// Keep Escape close support after removing bottom-drawer primitives.
		if (!isDialogVisible) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				beginDialogClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isDialogVisible, isClosing]);

	useEffect(() => {
		// When expanded, lock document scroll so only the wrapper surface scrolls.
		if (!isDialogVisible) {
			return;
		}

		const previousBodyOverflow = document.body.style.overflow;
		const previousHtmlOverflow = document.documentElement.style.overflow;
		document.body.style.overflow = "hidden";
		document.documentElement.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousBodyOverflow;
			document.documentElement.style.overflow = previousHtmlOverflow;
		};
	}, [isDialogVisible]);

	useEffect(() => {
		return () => {
			if (closeFallbackTimeoutRef.current) {
				clearTimeout(closeFallbackTimeoutRef.current);
			}
		};
	}, []);

	return (
		<LayoutGroup id="projects-wrapper-morph">
			<main className="relative flex h-fit min-h-screen flex-col items-center justify-between">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 z-300 bg-[url('/overlay/bg-noize.png')] bg-repeat opacity-60 mix-blend-overlay"
				/>
				<section className="relative z-10 mb-15 flex min-h-screen flex-col items-center justify-center gap-22">
					<AnimatedHeading
						as="h1"
						className="w-full max-w-[20ch] text-center font-[450] text-3xl text-primary-foreground lg:text-3xl 2xl:text-4xl"
						text="Some of the projects I've worked on."
					/>

					<AnimatedCardGrid className="grid h-fit w-fit gap-5 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
						{projects.map((project) => (
							<button
								className="text-left"
								key={project.slug}
								onClick={() => handleProjectOpen(project.slug)}
								type="button"
							>
								<AnimatedCard
									className="h-[400px] w-[400px]"
									shellLayoutId={`project-wrapper-${project.slug}`}
									shellTransition={getWrapperTransition(isClosing)}
								>
									<div
										className={`h-full w-full overflow-hidden rounded-xl bg-[url('/bg/1.jpg')] bg-center bg-cover ${hiddenCardImageSlug === project.slug ? "opacity-0" : "opacity-100"}`}
									>
										<ProjectCoverLottie
											animationData={projectCoverAnimationData}
											className="h-full w-full"
										/>
									</div>
								</AnimatedCard>
							</button>
						))}
					</AnimatedCardGrid>
				</section>

				<AnimatePresence>
					{(isDialogVisible || isClosing) && displayedProject ? (
						<motion.div
							animate={
								isClosing
									? { opacity: 0, scale: 0.98 }
									: { opacity: 1, scale: 1 }
							}
							className="fixed inset-0 z-50 origin-center"
							exit={{ opacity: 0, scale: 0.98 }}
							initial={{ opacity: 0, scale: 0.98 }}
							layoutId={`project-wrapper-${displayedProject.slug}`}
							onAnimationComplete={() => {
								// Close all expanded layers at the exact same moment.
								if (!isClosing) {
									return;
								}
								if (closeFallbackTimeoutRef.current) {
									clearTimeout(closeFallbackTimeoutRef.current);
									closeFallbackTimeoutRef.current = null;
								}
								setHiddenCardImageSlug(null);
								setClosingProject(null);
								setIsClosing(false);
								setMorphStage(PROJECT_MORPH_STAGE.idle);
							}}
							transition={getSecondaryWrapperTransition(isClosing)}
						>
							<motion.div
								className={`h-full w-full bg-background/45 p-4 backdrop-blur-md md:p-8 ${isClosing ? "overflow-hidden" : "overflow-auto"}`}
								data-morph-stage={morphStage}
								exit={{ opacity: 0 }}
								transition={getSecondaryWrapperTransition(isClosing)}
							>
								<motion.div
									animate={
										isClosing ? { opacity: 0, y: -6 } : { opacity: 1, y: 0 }
									}
									className={`mx-auto flex w-full max-w-7xl flex-col ${isClosing ? "pointer-events-none" : ""}`}
									exit={{ opacity: 0, y: -10 }}
									transition={getContentTransition()}
								>
									<div className="mb-6 flex justify-end">
										<button
											aria-label="Close project details"
											className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/90 text-foreground/80 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											onClick={beginDialogClose}
											type="button"
										>
											X
										</button>
									</div>

									{/* Keep media size fixed so only wrapper growth is perceived. */}
									<motion.div
										animate={
											isClosing
												? { opacity: 1, filter: "blur(0px)" }
												: { opacity: 0, filter: "blur(18px)" }
										}
										className="h-[400px] w-[400px] overflow-hidden rounded-xl bg-[url('/bg/1.jpg')] bg-center bg-cover"
										exit={{ opacity: 0, filter: "blur(20px)" }}
										initial={{ opacity: 1, filter: "blur(0px)" }}
										transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
									>
										<ProjectCoverLottie
											animationData={projectCoverAnimationData}
											className="h-full w-full"
										/>
									</motion.div>

									<h2
										className="mt-8 font-semibold text-2xl text-foreground"
										id={`project-title-${displayedProject.slug}`}
									>
										{displayedProject.title}
									</h2>
									<p className="mt-2 text-foreground/75 text-sm">
										Explore categories in this project.
									</p>

									<div className="mt-5 grid gap-3 sm:grid-cols-2">
										{displayedProject.categories.map((category) => (
											<button
												className="rounded-xl border border-border/60 bg-card px-4 py-3 text-left text-card-foreground transition hover:border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
												key={category.slug}
												onClick={() => handleCategorySelect(category.slug)}
												type="button"
											>
												<span className="font-medium text-sm">
													{category.label}
												</span>
											</button>
										))}
									</div>

									{activeCategory && activeProject ? (
										<section className="mt-6 rounded-xl border border-border/60 bg-card p-4">
											<h3 className="font-medium text-base text-card-foreground">
												{activeCategory.label}
											</h3>
											<p className="mt-2 text-card-foreground/75 text-sm">
												Category content placeholder. This now stays on the same
												page for smoother animation control.
											</p>
										</section>
									) : null}
								</motion.div>
							</motion.div>
						</motion.div>
					) : null}
				</AnimatePresence>
			</main>
		</LayoutGroup>
	);
}
