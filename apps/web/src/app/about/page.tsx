import { AnimatedParagraphGroup } from "@/components/animated-paragraph-group";

export default function About() {
	return (
		<main className="relative flex min-h-screen flex-col items-center justify-between bg-transparent p-24">
			{/* Noise texture overlay on top of background; pointer-events-none so it doesn't block clicks */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-300 bg-[url('/overlay/bg-noize.png')] bg-repeat opacity-60 mix-blend-overlay"
			/>
			<div className="relative z-10 flex h-screen w-full max-w-sm flex-col items-center justify-center hyphens-auto text-pretty sm:max-w-md">
				<AnimatedParagraphGroup
					className="w-full text-center"
					paragraphClassName="font-semibold text-primary-foreground text-xl"
					paragraphs={[
						"I'm a designer shaped by curiosity and a deep care for craft, details, and how products feel in real use.",
						"I spend my time exploring new tools and technologies, then turning what I learn into work that feels clear, useful, and human.",
						"I build digital experiences that are not only usable, but intentional and memorable.",
					]}
				/>
			</div>
		</main>
	);
}
