import { AnimatedHeading } from "@/components/animated-heading";

interface ProjectPageProps {
	params: Promise<{ name: string }>;
}

export default async function ProjectPage(props: ProjectPageProps) {
	const { name } = await props.params;
	const title = decodeURIComponent(name);

	return (
		<main className="relative flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-0% from-[#4D80E6] to-100% to-[#E9DFE5] p-24">
			{/* Noise texture overlay on top of background; pointer-events-none so it doesn't block clicks */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-300 bg-[url('/overlay/bg-noize.png')] bg-repeat opacity-60 mix-blend-overlay"
			/>
			<section className="relative z-10 w-full max-w-3xl rounded-2xl bg-background/60 p-6 backdrop-blur-sm">
				<AnimatedHeading
					as="h1"
					className="text-left font-semibold text-2xl text-foreground"
					text={title}
				/>
				<p className="mt-2 text-foreground/80">
					This is a placeholder detail page for now. Wire it up to real project
					data when you’re ready.
				</p>
			</section>
		</main>
	);
}
