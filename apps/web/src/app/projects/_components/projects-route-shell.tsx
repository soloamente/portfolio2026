import { readFile } from "node:fs/promises";
import { ProjectCardLink } from "@/app/projects/_components/project-card-link";
import { PROJECTS } from "@/app/projects/_lib/projects-data";
import { AnimatedCardGrid } from "@/components/animated-card";
import { AnimatedHeading } from "@/components/animated-heading";
import { ProjectCoverLottie } from "@/components/project-cover-lottie";

export interface ProjectsRouteShellProps {
	readonly dialogOverlay?: React.ReactNode;
	readonly drawerOverlay?: React.ReactNode;
}

// Module-relative URL avoids brittle cwd assumptions across runtime/build environments.
const PROJECT_COVER_LOTTIE_URL = new URL(
	"../covers/Cura.json",
	import.meta.url
);

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Minimal Lottie runtime contract guard.
 * Accepts only object payloads with at least one known Lottie marker key.
 */
function isLottieLikePayload(value: unknown): value is Record<string, unknown> {
	if (!isRecord(value)) {
		return false;
	}

	return "v" in value || "layers" in value || "assets" in value;
}

/**
 * Reads and parses the local Lottie JSON file.
 * Returns null when the file is missing or invalid so the page can still render.
 */
async function readProjectCoverAnimationData(): Promise<Record<
	string,
	unknown
> | null> {
	try {
		const fileContents = await readFile(PROJECT_COVER_LOTTIE_URL, "utf-8");
		const parsedData: unknown = JSON.parse(fileContents);

		// Prevent passing clearly non-Lottie object payloads into the animation component.
		if (isLottieLikePayload(parsedData)) {
			return parsedData;
		}

		return null;
	} catch (error) {
		// Keep file-read failures debuggable without crashing the page render.
		console.error(
			`[projects] Failed to load Lottie cover from ${PROJECT_COVER_LOTTIE_URL.href}:`,
			error
		);
		return null;
	}
}

/**
 * Shared visual shell for projects routes.
 * It supports both grid-only (`/projects`) and grid + dialog (`/projects/[name]`) states.
 */
export async function ProjectsRouteShell({
	dialogOverlay,
	drawerOverlay,
}: ProjectsRouteShellProps) {
	const projectCoverAnimationData = await readProjectCoverAnimationData();
	const hasDialogOverlay = Boolean(dialogOverlay);
	const hasDrawerOverlay = Boolean(drawerOverlay);

	return (
		<main className="relative flex h-fit min-h-screen flex-col items-center justify-between">
			{/* Noise texture overlay on top of background; pointer-events-none so it doesn't block clicks */}
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
					{PROJECTS.map((project) => (
						<ProjectCardLink
							className="h-[400px] w-[400px]"
							key={project.slug}
							slug={project.slug}
						>
							<div
								className="h-full w-full overflow-hidden rounded-xl bg-[url('/bg/1.jpg')] bg-center bg-cover"
								style={{ viewTransitionName: `project-media-${project.slug}` }}
							>
								<ProjectCoverLottie
									animationData={projectCoverAnimationData}
									className="h-full w-full"
								/>
							</div>
						</ProjectCardLink>
					))}
				</AnimatedCardGrid>
			</section>
			{/* Route-driven overlay host keeps layering contract explicit across route states. */}
			<div
				aria-hidden={!(hasDialogOverlay || hasDrawerOverlay)}
				className="pointer-events-none fixed inset-0 z-30"
				data-has-dialog={hasDialogOverlay}
				data-has-drawer={hasDrawerOverlay}
			>
				{dialogOverlay}
				{drawerOverlay}
			</div>
		</main>
	);
}
