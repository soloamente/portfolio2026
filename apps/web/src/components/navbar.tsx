"use client";
import Link from "next/link";

export default function Navbar() {
	const links = [{ to: "/", label: "Home" }] as const;

	return (
		<div className="fixed right-0 bottom-5 left-0 z-50 flex items-center justify-center px-2 py-1">
			<nav className="flex h-fit w-fit gap-4 rounded-full bg-background/35 p-1.75 text-lg backdrop-blur-lg">
				{links.map(({ to, label }) => {
					return (
						<Link
							className="rounded-lg bg-background px-5 py-3.75"
							href={to}
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
