"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Typed routes expect href to match generated Route; cast so link arrays work
type LinkHref = ComponentProps<typeof Link>["href"];

export default function Navbar() {
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/projects", label: "Projects" },
		{ to: "/crafts", label: "Crafts" },
		{ to: "/about", label: "About" },
		{ to: "/contact", label: "Contact" },
	] as const;
	const pathname = usePathname();

	return (
		<div className="fixed right-0 bottom-5 left-0 z-50 flex items-center justify-center px-2 py-1">
			<nav className="flex h-fit w-fit rounded-full bg-background/35 p-1 text-lg backdrop-blur-sm">
				{links.map(({ to, label }) => {
					// Home: active only on exact "/"; other routes: exact match or nested path
					const isActive =
						to === "/"
							? pathname === "/"
							: pathname === to || pathname.startsWith(`${to}/`);
					return (
						<Link
							className={cn(
								"rounded-full px-4.25 py-2.75 font-medium text-sm leading-none opacity-50",
								isActive &&
									"bg-background opacity-100 shadow-[0_0_7px_0_rgba(0,0,0,0.09)]"
							)}
							href={to as LinkHref}
							key={to}
						>
							{label}
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
