import { notFound } from "next/navigation";

import { ThemeLabClient } from "@/components/theme/theme-lab-client";

export default function ThemeLabPage() {
	// Keep Theme Lab strictly dev-only so preview tooling never ships to production users.
	if (process.env.NODE_ENV !== "development") {
		notFound();
	}

	return <ThemeLabClient />;
}
