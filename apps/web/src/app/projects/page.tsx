import Image from "next/image";
import { AnimatedCard, AnimatedCardGrid } from "@/components/animated-card";
import { AnimatedHeading } from "@/components/animated-heading";

/** Stable keys for static placeholder grid (Biome: avoid array index as key). */
const PROJECT_CARD_KEYS = [
	"project-ph-1",
	"project-ph-2",
	"project-ph-3",
	"project-ph-4",
	"project-ph-5",
	"project-ph-6",
] as const;

export default function Projects() {
	return (
		<main className="relative flex h-fit min-h-screen flex-col items-center justify-between">
			{/* Noise texture overlay on top of background; pointer-events-none so it doesn't block clicks */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-300 bg-[url('/overlay/bg-noize.png')] bg-repeat opacity-60 mix-blend-overlay"
			/>

			<div className="main-gradient fixed inset-0 z-0" />
			<section className="relative z-10 mt-[10%] mb-15 flex h-screen flex-col items-center justify-center gap-25">
				<AnimatedHeading
					as="h1"
					className="w-8/12 max-w-[20ch] font-[450] text-3xl text-primary-foreground lg:text-3xl 2xl:text-4xl"
					text="Some of the projects I've worked on."
				/>

				<AnimatedCardGrid className="grid h-fit w-fit gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
					{PROJECT_CARD_KEYS.map((cardKey, index) => (
						<AnimatedCard className="h-[400px] w-[400px]" key={cardKey}>
							<div className="h-full w-full overflow-hidden rounded-xl bg-[url('/bg/1.jpg')] bg-center bg-cover">
								<Image
									alt={`Project ${index + 1}`}
									height={3000}
									src="/placeholder/image1.png"
									width={3000}
								/>
							</div>
						</AnimatedCard>
					))}
				</AnimatedCardGrid>
			</section>
		</main>
	);
}
