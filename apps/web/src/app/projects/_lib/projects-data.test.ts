import { describe, expect, it } from "bun:test";

import { getProjectHref } from "../_components/project-card-link";
import { PROJECTS } from "./projects-data";

/** Slugs must be lowercase URL-safe segments for route params. */
const URL_SAFE_SEGMENT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe("projects data contract", () => {
	it("provides stable project card hrefs for the `/projects/[name]` route", () => {
		for (const project of PROJECTS) {
			const href = getProjectHref(project.slug);

			// Ensure project card links always target the route entry contract.
			expect(href).toBe(`/projects/${project.slug}`);
			expect(href.split("/").filter(Boolean)).toEqual([
				"projects",
				project.slug,
			]);
		}
	});

	it("defines route-safe project/category slugs with minimum category coverage", () => {
		expect(PROJECTS.length).toBeGreaterThan(0);

		for (const project of PROJECTS) {
			expect(project.slug).toMatch(URL_SAFE_SEGMENT_PATTERN);
			expect(project.title.trim().length).toBeGreaterThan(0);
			expect(project.categories.length).toBeGreaterThanOrEqual(2);

			for (const category of project.categories) {
				expect(category.label.trim().length).toBeGreaterThan(0);
				expect(category.slug).toMatch(URL_SAFE_SEGMENT_PATTERN);

				// Ensure composed route is stable and parseable by URL semantics.
				const composedPath = `/projects/${project.slug}/${category.slug}`;
				expect(composedPath).toBe(
					new URL(composedPath, "https://example.test").pathname
				);
				expect(composedPath.split("/").filter(Boolean)).toEqual([
					"projects",
					project.slug,
					category.slug,
				]);
			}
		}
	});

	it("enforces unique project slugs and unique category slugs per project", () => {
		const projectSlugs = PROJECTS.map((project) => project.slug);
		expect(new Set(projectSlugs).size).toBe(projectSlugs.length);

		for (const project of PROJECTS) {
			const categorySlugs = project.categories.map((category) => category.slug);
			expect(new Set(categorySlugs).size).toBe(categorySlugs.length);
		}
	});
});
