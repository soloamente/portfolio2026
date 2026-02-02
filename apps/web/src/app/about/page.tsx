export default function About() {
	return (
		<main className="relative flex min-h-screen flex-col items-center justify-between bg-linear-to-b from-0% from-[#4D80E6] to-100% to-[#E9DFE5] p-24">
			{/* Noise texture overlay on top of background; pointer-events-none so it doesn't block clicks */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0 bg-[url('/overlay/bg-noize.png')] bg-repeat opacity-60 mix-blend-overlay"
			/>
			<div className="relative z-10 flex h-screen w-md flex-col items-center justify-center gap-8 hyphens-auto text-pretty">
				<p className="text-center font-semibold text-primary-foreground text-xl">
					I’m primarily a Designer driven by curiosity and obsession for
					well-crafted experiences and curated details.
				</p>
				<p className="text-center font-semibold text-primary-foreground text-xl">
					{" "}
					My hobby is to explore new tools, experimenting with new technologies,
					refining my taste and create stuff i like.
				</p>

				<p className="text-center font-semibold text-primary-foreground text-xl">
					Focused on building products that are not just usable, but
					intentional.
				</p>
			</div>
		</main>
	);
}
