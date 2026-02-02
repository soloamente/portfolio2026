import Image from "next/image";

export default function Projects() {
	return (
		<main className="relative flex min-h-screen h-fit flex-col items-center justify-between bg-linear-to-b from-0% from-[#4D80E6] via-100% via-[#E9DFE5] to-200% to-[#4D80E6] ">
			{/* Noise texture overlay on top of background; pointer-events-none so it doesn't block clicks */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0 bg-[url('/overlay/bg-noize.png')] bg-repeat opacity-60 mix-blend-overlay"
			/>
			<section className="relative z-10 mt-[10%] flex h-screen flex-col items-center justify-center gap-25">
				<h1 className="font-semibold text-2xl text-primary-foreground">
					Some of my small stuff I made in my free time, for fun.
				</h1>
				<div className="h-fit w-fit gap-5 md:grid md:grid-cols-3">
					<div className="h-[400px] w-[400px] rounded-2xl bg-background/60 p-2.5 backdrop-blur-sm">
						<div className="h-full w-full overflow-hidden rounded-xl bg-[url('/bg/1.jpg')] bg-center bg-cover">
							<Image
								alt="Project 1"
								height={3000}
								src="/placeholder/image1.png"
								width={3000}
							/>
						</div>
					</div>
					<div className="h-[400px] w-[400px] rounded-2xl bg-background/60 p-2.5 backdrop-blur-sm">
						<div className="h-full w-full overflow-hidden rounded-xl bg-[url('/bg/1.jpg')] bg-center bg-cover">
							<Image
								alt="Project 1"
								height={3000}
								src="/placeholder/image1.png"
								width={3000}
							/>
						</div>
					</div>
					<div className="h-[400px] w-[400px] rounded-2xl bg-background/60 p-2.5 backdrop-blur-sm">
						<div className="h-full w-full overflow-hidden rounded-xl bg-[url('/bg/1.jpg')] bg-center bg-cover">
							<Image
								alt="Project 1"
								height={3000}
								src="/placeholder/image1.png"
								width={3000}
							/>
						</div>
					</div>
					<div className="h-[400px] w-[400px] rounded-2xl bg-background/60 p-2.5 backdrop-blur-sm">
						<div className="h-full w-full overflow-hidden rounded-xl bg-[url('/bg/1.jpg')] bg-center bg-cover">
							<Image
								alt="Project 1"
								height={3000}
								src="/placeholder/image1.png"
								width={3000}
							/>
						</div>
					</div>
				</div>
            </section>
            
		</main>
	);
}
