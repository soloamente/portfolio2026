import Image from "next/image";
import { AnimatedCard, AnimatedCardGrid } from "@/components/animated-card";
import { AnimatedHeading } from "@/components/animated-heading";

/** Stable keys for static placeholder grid (Biome: avoid array index as key). */
const CRAFT_CARD_KEYS = [
	"craft-ph-1",
	"craft-ph-2",
	"craft-ph-3",
	"craft-ph-4",
] as const;

export default function Crafts() {
	return (
		<main className="relative flex h-fit min-h-screen flex-col items-center justify-between bg-linear-to-b from-0% from-[#4D80E6] via-100% via-[#E9DFE5] to-200% to-[#4D80E6]">
			{/* Noise texture overlay on top of background; pointer-events-none so it doesn't block clicks */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-300 bg-[url('/overlay/bg-noize.png')] bg-repeat opacity-60 mix-blend-overlay"
			/>
			<section className="relative z-10 mt-[10%] mb-15 flex h-screen flex-col items-center justify-center gap-25">
				<AnimatedHeading
					as="h1"
					className="w-8/12 max-w-[20ch] font-[450] text-3xl text-primary-foreground lg:text-3xl 2xl:text-4xl"
					text="Some of my small stuff I made in my free time, for fun."
				/>
				<AnimatedCardGrid className="grid h-fit w-fit grid-cols-1 gap-5 md:grid-cols-3">
					{CRAFT_CARD_KEYS.map((cardKey, index) => (
						<AnimatedCard className="h-[400px] w-[400px]" key={cardKey}>
							<div className="h-full w-full overflow-hidden rounded-xl bg-[url('/bg/1.jpg')] bg-center bg-cover">
								<Image
									alt={`Craft ${index + 1}`}
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
