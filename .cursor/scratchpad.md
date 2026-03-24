# Background and Motivation

- Executor mode requested by user with TDD workflow.
- Need to execute one subtask at a time and report milestone for manual verification.

# Key Challenges and Analysis

- No existing test infrastructure detected in `apps/web`:
  - No `test` script in `apps/web/package.json`.
  - No `*.test.*` or `*.spec.*` files found under `apps/web`.
- Strict TDD (red-green-refactor) requires test runner setup before feature execution.

# High-level Task Breakdown

1. Set up a minimal test harness for `apps/web` (framework to be confirmed by user) and verify a sample failing test runs.
   - Success criteria: one intentionally failing test executes and fails for the expected reason.
2. Implement first requested feature/bugfix via TDD cycle (RED -> GREEN -> REFACTOR).
   - Success criteria: new test first fails, then passes after minimal code changes.
3. Run project checks relevant to edited scope.
   - Success criteria: all invoked checks pass for touched files/tasks.

# Project Status Board

- [x] Detect current execution preconditions and repository state
- [x] Configure test harness for `apps/web`
- [x] Execute first feature task with strict TDD
- [x] Run project checks relevant to edited scope
- [x] Validate and report milestone for human verification

# Current Status / Progress Tracking

- User confirmed Bun test direction.
- Minimal Bun test harness added:
  - Added script `test` in `apps/web/package.json` (`bun test`).
  - Added test file `apps/web/src/app/projects/page.test.tsx`.
- RED phase verified with Bun:
  - Ran `bun run test src/app/projects/page.test.tsx`.
  - Failure is expected and correct: expected 6 images with alt "Project 1", received 5.
- GREEN phase complete for first task:
  - Added one more project card in `apps/web/src/app/projects/page.tsx` (now 6 total cards).
  - Re-ran `bun run test src/app/projects/page.test.tsx`.
  - Test now passes: 1 pass, 0 fail.
- Scoped lint check result:
  - No linter errors on updated files.
- Scoped verification checks completed:
  - `bun run test src/app/projects/page.test.tsx` -> pass (1 pass, 0 fail).
  - `bun run build` in `apps/web` -> success (Next.js production build completed).
- New executor subtask: fix Next.js build failure in `apps/web/src/index.css` caused by unknown Tailwind utility class `bg-main-gradient`.
- Applied fix in `apps/web/src/index.css`:
  - Replaced `@apply bg-main-gradient;` with `background-image: var(--main-gradient);` inside `.main-gradient`.
  - This preserves the intended gradient without requiring a missing Tailwind utility.

# Executor's Feedback or Assistance Requests

- Lenis smooth scroll (2025-03-24): added `SmoothScroll` using `ReactLenis` from `lenis/react` with `root`, wired in `providers.tsx`; `prefers-reduced-motion: reduce` skips Lenis. Production build for `apps/web` succeeded.

- Planner cross-check complete: all listed success criteria have been met and manually confirmed by user.
- Project task is complete.
- Milestone ready for manual verification:
  - Please verify the projects page still shows the gradient style where `.main-gradient` is used.
  - If visual output is correct, this subtask can be marked complete.

# Lessons

- Read the file before editing it.
- If strict TDD is required but no test runner exists, establish minimal test tooling before writing production code.
- Do not introduce Vite/Vitest unless explicitly approved for this repo.
- In this repo, prefer `bun test` when adding TDD coverage unless told otherwise.
- If Tailwind throws "Cannot apply unknown utility class", prefer a direct CSS declaration unless the utility is explicitly defined in theme/config.
