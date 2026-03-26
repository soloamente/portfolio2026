import { describe, expect, it } from "bun:test";

import { PROJECTS, type ProjectRecord } from "./projects-data";
import {
	getProjectByNameSlug,
	getProjectCategoryBySlug,
	resolveProjectCategoryFromRouteParam,
	resolveProjectFromRouteParam,
} from "./projects-routing";

function getFirstProjectOrThrow(): ProjectRecord {
	const selectedProject = PROJECTS.at(0);
	if (!selectedProject) {
		throw new Error("Expected at least one project fixture for routing tests.");
	}

	return selectedProject;
}

function getFirstCategorySlugOrThrow(project: ProjectRecord): string {
	const selectedCategory = project.categories.at(0);
	if (!selectedCategory) {
		throw new Error(
			"Expected project fixture to include at least one category."
		);
	}

	return selectedCategory.slug;
}

describe("projects routing helpers", () => {
	it("resolves a valid project slug and returns null for an invalid slug", () => {
		const selectedProject = getFirstProjectOrThrow();

		// Valid project route param resolves to the project record.
		expect(getProjectByNameSlug(selectedProject.slug)).toBe(selectedProject);

		// Unknown route param must resolve to null for notFound guards.
		expect(getProjectByNameSlug("does-not-exist")).toBeNull();
	});

	it("resolves category slug only when it belongs to the selected project", () => {
		const selectedProject = getFirstProjectOrThrow();
		const selectedCategorySlug = getFirstCategorySlugOrThrow(selectedProject);
		const selectedCategory = getProjectCategoryBySlug(
			selectedProject,
			selectedCategorySlug
		);
		if (!selectedCategory) {
			throw new Error(
				"Expected selected project to resolve its own first category slug."
			);
		}

		// Matching category slug under selected project resolves correctly.
		expect(
			getProjectCategoryBySlug(selectedProject, selectedCategory.slug)
		).toBe(selectedCategory);

		// Mismatched or invalid category slug must resolve null.
		expect(
			getProjectCategoryBySlug(selectedProject, "unknown-category")
		).toBeNull();
	});

	it("returns null when category slug exists on another project fixture", () => {
		const selectedProject: ProjectRecord = {
			slug: "selected-project",
			title: "Selected Project",
			categories: [
				{ label: "Design", slug: "design" },
				{ label: "Engineering", slug: "engineering" },
			],
		};
		const otherProject: ProjectRecord = {
			slug: "other-project",
			title: "Other Project",
			categories: [
				{ label: "Marketing", slug: "marketing" },
				{ label: "Research", slug: "research" },
			],
		};
		const otherProjectCategorySlug = getFirstCategorySlugOrThrow(otherProject);

		// Category exists in another project fixture, but not in selected project.
		expect(
			getProjectCategoryBySlug(selectedProject, otherProjectCategorySlug)
		).toBeNull();
	});

	it("treats malformed and unknown route params as invalid project routes", () => {
		const selectedProject = getFirstProjectOrThrow();

		// Valid URL params should resolve after route-param decoding.
		expect(resolveProjectFromRouteParam(selectedProject.slug)).toBe(
			selectedProject
		);

		// Unknown slugs should map to null so the route page can call notFound().
		expect(resolveProjectFromRouteParam("not-a-real-project")).toBeNull();

		// Malformed URI params should not throw in the route page contract.
		expect(resolveProjectFromRouteParam("%E0%A4%A")).toBeNull();
	});

	it("treats invalid, mismatched, and malformed category params as invalid", () => {
		const selectedProject = getFirstProjectOrThrow();
		const selectedCategorySlug = getFirstCategorySlugOrThrow(selectedProject);
		const selectedCategory = getProjectCategoryBySlug(
			selectedProject,
			selectedCategorySlug
		);
		if (!selectedCategory) {
			throw new Error(
				"Expected selected project to resolve its own first category slug."
			);
		}

		// Valid category under selected project should resolve.
		expect(
			resolveProjectCategoryFromRouteParam(
				selectedProject,
				selectedCategory.slug
			)
		).toBe(selectedCategory);

		// Unknown slug should map to null for notFound route guard.
		expect(
			resolveProjectCategoryFromRouteParam(selectedProject, "not-a-category")
		).toBeNull();

		const mismatchedCategorySlug = "marketing";
		// Category-like slug not in selected project should also resolve null.
		expect(
			resolveProjectCategoryFromRouteParam(
				selectedProject,
				mismatchedCategorySlug
			)
		).toBeNull();

		// Malformed URI params should never throw from the route contract.
		expect(
			resolveProjectCategoryFromRouteParam(selectedProject, "%E0%A4%A")
		).toBeNull();
	});
});
