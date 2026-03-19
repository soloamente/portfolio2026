"use client";

import Image from "next/image";
import { AnimatedHeading } from "@/components/animated-heading";

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

				<div className="grid h-fit w-fit gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
