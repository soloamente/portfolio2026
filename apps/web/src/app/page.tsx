import { AnimatedHeading } from "@/components/animated-heading";

export default function Home() {
	return (
		<main className="relative flex min-h-screen flex-col items-center justify-between bg-transparent p-24">
			{/* Noise texture overlay on top of background; pointer-events-none so it doesn't block clicks */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-300 bg-[url('/overlay/bg-noize.png')] bg-repeat opacity-60 mix-blend-overlay"
			/>
			<div className="relative z-10 flex h-screen flex-col items-center justify-center">
				<AnimatedHeading
					as="h1"
					className="font-semibold text-2xl text-primary-foreground"
					text="Designer, hobbyist photographer and Developer based in Italy."
				/>
			</div>
		</main>
	);
}
