# portfolio2026

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Self, TRPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **tRPC** - End-to-end type-safe APIs
- **Turborepo** - Optimized monorepo build system
- **Biome** - Linting and formatting
- **Oxlint** - Oxlint + Oxfmt (linting & formatting)

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the fullstack application.

## Deploying to Vercel

This repo is a Turborepo: Next.js lives under `apps/web`, not the repository root. If Vercel reports **“No Next.js version detected”**, the project is building from the wrong directory.

1. In the Vercel dashboard, open the project → **Settings** → **General** → **Root Directory**.
2. Set **Root Directory** to `apps/web` and save.
3. Leave **Framework Preset** as Next.js (or let Vercel auto-detect).

Vercel will still install workspace dependencies from the monorepo root; `apps/web/vercel.json` pins `installCommand` and `buildCommand` so installs and Turbo builds run from the repo root.

## Git Hooks and Formatting

- Format and lint fix: `bun run check`

## Project Structure

```
portfolio2026/
├── apps/
│   └── web/         # Fullstack application (Next.js)
├── packages/
│   ├── api/         # API layer / business logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run check-types`: Check TypeScript types across all apps
- `bun run check`: Run Biome formatting and linting
- `bun run check`: Run Oxlint and Oxfmt
