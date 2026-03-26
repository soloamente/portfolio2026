import type { Route } from "next";
import Link from "next/link";
import type { ProjectRecord } from "@/app/projects/_lib/projects-data";
import { AnimatedCard } from "@/components/animated-card";

export interface ProjectCardLinkProps {
	readonly slug: ProjectRecord["slug"];
	readonly className?: string;
	readonly children: React.ReactNode;
}

/** Centralized route contract for project card entries. */
export function getProjectHref(slug: ProjectRecord["slug"]): Route {
	// Typed route cast keeps Next.js typed-routes checks while preserving dynamic slug support.
	return `/projects/${slug}` as Route;
}

export function ProjectCardLink({
	slug,
	className,
	children,
}: ProjectCardLinkProps) {
	return (
		<Link href={getProjectHref(slug)} transitionTypes={["project-open"]}>
			{/* Keep the existing card visual container so hover/motion behavior is unchanged. */}
			<AnimatedCard className={className}>{children}</AnimatedCard>
		</Link>
	);
}
