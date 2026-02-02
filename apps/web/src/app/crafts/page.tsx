export default function Crafts() {
	return (
		<main className="relative flex min-h-screen flex-col items-center justify-between bg-linear-to-b from-0% from-[#4D80E6] to-100% to-[#E9DFE5] p-24">
			{/* Noise texture overlay on top of background; pointer-events-none so it doesn't block clicks */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0 bg-[url('/overlay/bg-noize.png')] bg-repeat opacity-60 mix-blend-overlay"
			/>
			<div className="relative z-10 flex h-screen flex-col items-center justify-center">
				<h1 className="font-semibold text-2xl text-primary-foreground">
					Some of my small stuff I made in my free time, for fun.
				</h1>
			</div>
		</main>
	);
}
