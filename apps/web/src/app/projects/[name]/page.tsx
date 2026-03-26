import { redirect } from "next/navigation";
import { resolveProjectFromRouteParam } from "@/app/projects/_lib/projects-routing";

interface ProjectPageProps {
	params: Promise<{ name: string }>;
}

export default async function ProjectPage(props: ProjectPageProps) {
	const { name } = await props.params;
	const selectedProject = resolveProjectFromRouteParam(name);

	// Invalid route params should render the Next.js not-found boundary.
	if (!selectedProject) {
		redirect("/projects");
	}

	redirect(`/projects?project=${encodeURIComponent(selectedProject.slug)}`);
}
