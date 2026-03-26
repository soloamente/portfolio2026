import "@portfolio2026/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	experimental: {
		viewTransition: true,
	},
};

export default nextConfig;
