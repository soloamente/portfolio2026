import { readFile } from "node:fs/promises";
import path from "node:path";
import { Suspense } from "react";
import { ProjectsPageExperience } from "@/app/projects/_components/projects-page-experience";
import { PROJECTS } from "@/app/projects/_lib/projects-data";

/**
 * Resolve from app root instead of current working directory.
 * Relative paths like "./covers/..." are resolved from process cwd, not this file.
 */
const PROJECT_COVER_LOTTIE_PATH = path.join(
	process.cwd(),
	"src/app/projects/covers/Cura.json"
);

/**
 * Reads and parses the local Lottie JSON file.
 * Returns null when the file is missing or invalid so the page can still render.
 */
async function readProjectCoverAnimationData(): Promise<Record<
	string,
	unknown
> | null> {
	try {
		const fileContents = await readFile(PROJECT_COVER_LOTTIE_PATH, "utf-8");
		const parsedData: unknown = JSON.parse(fileContents);

		if (parsedData !== null && typeof parsedData === "object") {
			return parsedData as Record<string, unknown>;
		}

		return null;
	} catch (error) {
		// Keep file-read failures debuggable without crashing the page render.
		console.error(
			`[projects] Failed to load Lottie cover from ${PROJECT_COVER_LOTTIE_PATH}:`,
			error
		);
		return null;
	}
}

export default async function Projects() {
	const projectCoverAnimationData = await readProjectCoverAnimationData();

	return (
		<Suspense fallback={null}>
			<ProjectsPageExperience
				projectCoverAnimationData={projectCoverAnimationData}
				projects={PROJECTS}
			/>
		</Suspense>
	);
}
