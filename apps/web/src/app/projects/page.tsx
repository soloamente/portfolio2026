"use client";

import { motion } from "motion/react";
import Image from "next/image";

export default function Projects() {
	// Full heading string tokenized so both words and spaces animate; /\s+|\S+/g splits into alternating runs of whitespace and non-whitespace
	const title = "Some of the projects I've worked on.";
	const tokens = title.match(/\s+|\S+/g) ?? [];
	return (
		<main className="relative flex h-fit min-h-screen flex-col items-center justify-between">
			{/* Noise texture overlay on top of background; pointer-events-none so it doesn't block clicks */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-300 bg-[url('/overlay/bg-noize.png')] bg-repeat opacity-60 mix-blend-overlay"
			/>

			<div className="main-gradient fixed inset-0 z-0" />
			<section className="relative z-10 mt-[10%] mb-15 flex h-screen flex-col items-center justify-center gap-25">
				{/* Single whileInView on parent so the whole heading animates together; per-token whileInView caused only visible tokens to animate when partially scrolled */}
				<motion.div
					className="w-8/12 max-w-[20ch] whitespace-pre text-center font-[450] text-3xl text-primary-foreground lg:text-3xl 2xl:text-4xl"
					initial="hidden"
					variants={{
						hidden: {},
						visible: {
							transition: {
								staggerChildren: 0.08,
								delayChildren: 0.5,
							},
						},
					}}
					viewport={{ amount: 0.3, margin: "-50px" }}
					whileInView="visible"
				>
					{tokens.map((token, index) => (
						<motion.span
							className="inline-block will-change-auto"
							key={`${index}-${token}`}
							transition={{ ease: "easeOut", duration: 0.5 }}
							variants={{
								hidden: { opacity: 0, y: "20%", filter: "blur(20px)" },
								visible: { opacity: 1, y: 0, filter: "blur(0px)" },
							}}
						>
							{token}
						</motion.span>
					))}
				</motion.div>

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
