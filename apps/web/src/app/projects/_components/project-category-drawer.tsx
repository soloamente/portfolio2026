"use client";

import { Drawer } from "@base-ui/react/drawer";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import type {
	ProjectCategoryRecord,
	ProjectRecord,
} from "@/app/projects/_lib/projects-data";

export interface ProjectCategoryDrawerProps {
	readonly project: ProjectRecord;
	readonly category: ProjectCategoryRecord;
}

/**
 * Bottom drawer layer for `/projects/[name]/[category]`.
 * It exposes an accessible region label and route-based close controls.
 */
export function ProjectCategoryDrawer({
	project,
	category,
}: ProjectCategoryDrawerProps) {
	const router = useRouter();
	const drawerHeadingId = `project-category-drawer-title-${project.slug}-${category.slug}`;
	const backHref = `/projects/${project.slug}` as Route;
	const categoryHref = `/projects/${project.slug}/${category.slug}`;

	const focusOriginCategoryTrigger = useCallback(() => {
		// Restore focus to the category trigger behind the drawer before route close.
		const categoryTrigger = document.querySelector<HTMLAnchorElement>(
			`a[href="${categoryHref}"]`
		);
		categoryTrigger?.focus();
	}, [categoryHref]);

	useEffect(() => {
		// Keep keyboard dismissal aligned with route navigation semantics.
		const handleWindowKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") {
				return;
			}

			event.preventDefault();
			focusOriginCategoryTrigger();
			router.push(backHref);
		};

		window.addEventListener("keydown", handleWindowKeyDown);
		return () => {
			window.removeEventListener("keydown", handleWindowKeyDown);
		};
	}, [backHref, focusOriginCategoryTrigger, router]);

	useEffect(() => {
		const markDrawerPopNavigation = () => {
			// Helps the dialog choose a reverse transition when browser back closes drawer.
			sessionStorage.setItem("projects-overlay-nav", "drawer-pop");
		};

		window.addEventListener("popstate", markDrawerPopNavigation);
		return () => {
			window.removeEventListener("popstate", markDrawerPopNavigation);
		};
	}, []);

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			focusOriginCategoryTrigger();
			router.push(backHref);
		}
	};

	return (
		<Drawer.Root modal={false} onOpenChange={handleOpenChange} open>
			<Drawer.Portal>
				<Drawer.Backdrop className="fixed inset-0 z-45 bg-black/30" />
				<Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center p-4">
					<Drawer.Popup className="w-full max-w-3xl outline-none">
						<Drawer.Content
							aria-labelledby={drawerHeadingId}
							className="w-full rounded-2xl border border-border/60 bg-background p-5 shadow-2xl"
						>
							<div className="flex items-center justify-between gap-4">
								<Drawer.Title
									className="font-semibold text-foreground text-lg"
									id={drawerHeadingId}
								>
									{category.label}
								</Drawer.Title>
								<Link
									autoFocus
									className="rounded-md px-3 py-2 text-foreground/80 text-sm transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
									href={backHref}
									onClick={focusOriginCategoryTrigger}
									transitionTypes={["project-category-close"]}
								>
									Back to {project.title}
								</Link>
							</div>
							<Drawer.Description className="mt-2 text-foreground/75 text-sm">
								Category route is open. Press Escape to return to the project
								dialog.
							</Drawer.Description>
						</Drawer.Content>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	);
}
