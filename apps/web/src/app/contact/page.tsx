import Link from "next/link";
import { AnimatedHeading } from "@/components/animated-heading";
import IconDiscord from "@/components/icons/discord";
import IconEnvelope from "@/components/icons/envelope";

export default function Contact() {
	return (
		<main className="relative flex min-h-screen flex-col items-center justify-between bg-transparent p-24">
			{/* Noise texture overlay on top of background; pointer-events-none so it doesn't block clicks */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-300 bg-[url('/overlay/bg-noize.png')] bg-repeat opacity-60 mix-blend-overlay"
			/>
			<div className="relative z-10 flex h-screen flex-col items-center justify-center gap-6 text-center">
				<div className="flex flex-col items-center justify-center gap-2">
					<AnimatedHeading
						as="h1"
						className="max-w-xl text-balance font-semibold text-2xl text-primary-foreground"
						text="Contact me if you want to chat about work, a project, or just say hi."
					/>
					{/* <p className="max-w-xl text-base text-primary-foreground/90">
						If you want to chat about work, a project, or just say hi, email me.
					</p> */}
				</div>
				<div className="flex flex-col items-center justify-center gap-3">
					<a
						className="flex gap-2 rounded-full bg-background/70 px-4 py-3 font-medium text-foreground backdrop-blur-sm transition-all transition-transform duration-300 ease-out hover:scale-105"
						href="mailto:hello@soloamente.dev"
						rel="noopener noreferrer"
						target="_blank"
					>
						<IconEnvelope color="" size="24px" /> Send me an email
					</a>
					<Link
						className="flex items-center gap-2 rounded-full bg-background/70 px-4 py-3 font-medium text-foreground backdrop-blur-sm transition-opacity transition-transform duration-300 ease-out hover:scale-105 hover:opacity-90"
						href="https://discord.gg/soloamente"
						target="_blank"
					>
						<IconDiscord color="" size="24px" />{" "}
						<span>Contact me on Discord</span>
					</Link>
				</div>
			</div>
		</main>
	);
}
