/** Category metadata used to build nested `/projects/[name]/[category]` routes. */
export interface ProjectCategoryRecord {
	readonly label: string;
	readonly slug: string;
}

/** Project metadata used to build `/projects/[name]` routes and overlays. */
export interface ProjectRecord {
	readonly slug: string;
	readonly title: string;
	readonly categories: readonly ProjectCategoryRecord[];
}

/**
 * Initial route contract for projects.
 * Keep slug values URL-safe because they are consumed directly as route params.
 */
export const PROJECTS = [
	{
		slug: "project-scene-1",
		title: "Project Scene 1",
		categories: [
			{ label: "Design", slug: "design" },
			{ label: "Engineering", slug: "engineering" },
		],
	},
] as const satisfies readonly ProjectRecord[];
