import {
	PROJECTS,
	type ProjectCategoryRecord,
	type ProjectRecord,
} from "./projects-data";

/**
 * Resolve a project route param (`/projects/[name]`) to a known record.
 * Returns null for unknown slugs so route handlers can call notFound().
 */
export function getProjectByNameSlug(name: string): ProjectRecord | null {
	return PROJECTS.find((project) => project.slug === name) ?? null;
}

/**
 * Resolve a raw route param from `/projects/[name]` to a known project.
 * Returns null for malformed URI params or unknown project slugs.
 */
export function resolveProjectFromRouteParam(
	nameParam: string
): ProjectRecord | null {
	try {
		const decodedNameParam = decodeURIComponent(nameParam);
		return getProjectByNameSlug(decodedNameParam);
	} catch {
		return null;
	}
}

/**
 * Resolve a category route param (`/projects/[name]/[category]`) under a project.
 * Returns null when the category doesn't belong to the selected project.
 */
export function getProjectCategoryBySlug(
	project: ProjectRecord,
	category: string
): ProjectCategoryRecord | null {
	return project.categories.find((entry) => entry.slug === category) ?? null;
}

/**
 * Resolve a raw category route param from `/projects/[name]/[category]`.
 * Returns null for malformed URI params or categories not owned by the project.
 */
export function resolveProjectCategoryFromRouteParam(
	project: ProjectRecord,
	categoryParam: string
): ProjectCategoryRecord | null {
	try {
		const decodedCategoryParam = decodeURIComponent(categoryParam);
		return getProjectCategoryBySlug(project, decodedCategoryParam);
	} catch {
		return null;
	}
}
