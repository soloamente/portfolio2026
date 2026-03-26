import { redirect } from "next/navigation";
import {
	resolveProjectCategoryFromRouteParam,
	resolveProjectFromRouteParam,
} from "@/app/projects/_lib/projects-routing";

interface ProjectCategoryPageProps {
	params: Promise<{ name: string; category: string }>;
}

export default async function ProjectCategoryPage(
	props: ProjectCategoryPageProps
) {
	const { name, category } = await props.params;
	const selectedProject = resolveProjectFromRouteParam(name);
	if (!selectedProject) {
		redirect("/projects");
	}

	const selectedCategory = resolveProjectCategoryFromRouteParam(
		selectedProject,
		category
	);
	// Invalid or mismatched categories must hit notFound.
	if (!selectedCategory) {
		redirect(`/projects?project=${encodeURIComponent(selectedProject.slug)}`);
	}

	redirect(
		`/projects?project=${encodeURIComponent(selectedProject.slug)}&category=${encodeURIComponent(selectedCategory.slug)}`
	);
}
