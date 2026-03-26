# Projects Route-Driven Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Daybreak-style, animated, route-driven projects flow where card click expands to project dialog (`/projects/[name]`) and category click opens a bottom drawer (`/projects/[name]/[category]`) while preserving back/forward navigation and deep-link behavior.

**Architecture:** Keep `/projects` as the visual source page and map route state directly to overlay layers. Use a shared composition shell so `/projects`, `/projects/[name]`, and `/projects/[name]/[category]` render from one structure (preventing duplication and visual flicker). Add strict param validation and explicit a11y/focus behavior for dialog+drawer layering.

**Tech Stack:** Next.js App Router, TypeScript, React, Tailwind CSS, motion library already used in repo, Bun test, existing `AnimatedCard` and `AnimatedHeading` components.

---

## File Structure (planned responsibilities)

- Modify: `apps/web/src/app/projects/page.tsx` — route-aware grid entry.
- Create: `apps/web/src/app/projects/_lib/projects-data.ts` — project/category records.
- Create: `apps/web/src/app/projects/_lib/projects-routing.ts` — param validation helpers.
- Create: `apps/web/src/app/projects/_components/project-card-link.tsx` — route-linked card entry.
- Create: `apps/web/src/app/projects/_components/projects-route-shell.tsx` — shared layout shell reused by all projects routes.
- Create: `apps/web/src/app/projects/_components/project-dialog-overlay.tsx` — project overlay layer.
- Create: `apps/web/src/app/projects/_components/project-category-drawer.tsx` — category drawer layer.
- Modify: `apps/web/src/app/projects/[name]/page.tsx` — project overlay route + invalid slug guard.
- Create: `apps/web/src/app/projects/[name]/[category]/page.tsx` — drawer route + invalid category guard.
- Test: `apps/web/src/app/projects/_lib/projects-data.test.ts`
- Test: `apps/web/src/app/projects/_lib/projects-routing.test.ts`

---

### Task 1: Define projects data contract (TDD)

**Files:**
- Create: `apps/web/src/app/projects/_lib/projects-data.ts`
- Test: `apps/web/src/app/projects/_lib/projects-data.test.ts`

- [ ] **Step 1: Write the failing test**
  - Assert each project has:
    - URL-safe `slug`
    - display `title`
    - at least two categories
    - category slugs usable in `/projects/[name]/[category]`.

- [ ] **Step 2: Run test to verify it fails**
  - Run: `cd apps/web && bun test src/app/projects/_lib/projects-data.test.ts`
  - Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
  - Add typed interfaces and initial project dataset matching current card content.

- [ ] **Step 4: Run test to verify it passes**
  - Run: `cd apps/web && bun test src/app/projects/_lib/projects-data.test.ts`
  - Expected: PASS

- [ ] **Step 5: Optional commit (only if user explicitly requests)**

---

### Task 2: Implement route validation helpers (TDD)

**Files:**
- Create: `apps/web/src/app/projects/_lib/projects-routing.ts`
- Test: `apps/web/src/app/projects/_lib/projects-routing.test.ts`

- [ ] **Step 1: Write the failing test**
  - Cover:
    - valid `name` resolves project
    - invalid `name` resolves null
    - valid category belongs to resolved project
    - invalid/mismatched category resolves null.

- [ ] **Step 2: Run test to verify it fails**
  - Run: `cd apps/web && bun test src/app/projects/_lib/projects-routing.test.ts`
  - Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
  - Implement pure helpers:
    - `getProjectByNameSlug(name)`
    - `getProjectCategoryBySlug(project, category)`.

- [ ] **Step 4: Run test to verify it passes**
  - Run: `cd apps/web && bun test src/app/projects/_lib/projects-routing.test.ts`
  - Expected: PASS

- [ ] **Step 5: Optional commit (only if user explicitly requests)**

---

### Task 3: Make cards route into project overlay state

**Files:**
- Create: `apps/web/src/app/projects/_components/project-card-link.tsx`
- Modify: `apps/web/src/app/projects/page.tsx`
- Modify: `apps/web/src/app/projects/_lib/projects-data.test.ts` (href contract checks)

- [ ] **Step 1: Write the failing test**
  - Add expected project href format assertions (`/projects/${slug}`).

- [ ] **Step 2: Run test to verify it fails**
  - Run: `cd apps/web && bun test src/app/projects/_lib/projects-data.test.ts`
  - Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
  - Wrap card entry in `Link`.
  - Render cards from shared project data.

- [ ] **Step 4: Verify**
  - Run: `cd apps/web && bun test src/app/projects/_lib/projects-data.test.ts`
  - Run: `cd apps/web && bun run build`
  - Expected: PASS

- [ ] **Step 5: Optional commit (only if user explicitly requests)**

---

### Task 4: Build shared shell + `/projects/[name]` overlay state

**Files:**
- Create: `apps/web/src/app/projects/_components/projects-route-shell.tsx`
- Create: `apps/web/src/app/projects/_components/project-dialog-overlay.tsx`
- Modify: `apps/web/src/app/projects/[name]/page.tsx`
- Modify: `apps/web/src/app/projects/_lib/projects-routing.test.ts` (invalid-route assertions)

- [ ] **Step 1: Write the failing test**
  - Extend tests for invalid `name` handling contract used by route page.

- [ ] **Step 2: Run test to verify it fails**
  - Run: `cd apps/web && bun test src/app/projects/_lib/projects-routing.test.ts`
  - Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
  - Implement shared shell that can render:
    - grid only
    - grid + dialog.
  - In `[name]/page.tsx`, validate param and call `notFound()` on invalid slug.
  - Dialog a11y baseline:
    - visible heading label
    - keyboard reachable close/back control
    - defined focus target when dialog opens.

- [ ] **Step 4: Verify**
  - Run: `cd apps/web && bun test src/app/projects/_lib/projects-routing.test.ts`
  - Run: `cd apps/web && bun run build`
  - Expected: PASS

- [ ] **Step 5: Optional commit (only if user explicitly requests)**

---

### Task 5: Build `/projects/[name]/[category]` drawer state

**Files:**
- Create: `apps/web/src/app/projects/_components/project-category-drawer.tsx`
- Create: `apps/web/src/app/projects/[name]/[category]/page.tsx`
- Modify: `apps/web/src/app/projects/_components/projects-route-shell.tsx`
- Modify: `apps/web/src/app/projects/_lib/projects-routing.ts`
- Modify: `apps/web/src/app/projects/_lib/projects-routing.test.ts`

- [ ] **Step 1: Write the failing test**
  - Add category mismatch and invalid category tests.

- [ ] **Step 2: Run test to verify it fails**
  - Run: `cd apps/web && bun test src/app/projects/_lib/projects-routing.test.ts`
  - Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
  - Build page composition: grid + dialog + drawer.
  - Call `notFound()` for invalid/mismatched categories.
  - Drawer a11y baseline:
    - labeled region
    - Escape/back closes to `/projects/[name]`
    - focus returns to originating category trigger.

- [ ] **Step 4: Verify**
  - Run: `cd apps/web && bun test src/app/projects/_lib/projects-routing.test.ts`
  - Run: `cd apps/web && bun run build`
  - Expected: PASS

- [ ] **Step 5: Optional commit (only if user explicitly requests)**

---

### Task 6: Animation contract + reduced-motion parity

**Files:**
- Modify: `apps/web/src/app/projects/_components/project-dialog-overlay.tsx`
- Modify: `apps/web/src/app/projects/_components/project-category-drawer.tsx`
- Modify: `apps/web/src/app/projects/_components/projects-route-shell.tsx`
- Modify: `apps/web/src/components/animated-card.tsx` (only if continuity requires it)

- [ ] **Step 1: Define failing checks**
  - If helper logic is introduced, add failing tests for reduced-motion branching.
  - Otherwise, define explicit manual checks before coding.

- [ ] **Step 2: Confirm missing behavior**
  - Run targeted tests/checklist and capture expected failures.

- [ ] **Step 3: Implement minimal transitions**
  - Define transition contract:
    - card -> dialog enter/exit
    - dialog -> drawer enter/exit
    - reverse transitions via browser back.
  - Respect reduced motion by removing non-essential motion.
  - Keep frequent interaction timings short.
  - Confirm and follow project motion import convention before editing.

- [ ] **Step 4: Verify**
  - Run: `cd apps/web && bun run build`
  - Manual: route transitions + keyboard flows + reduced-motion behavior.
  - Manual (mobile viewport): confirm same interaction model as desktop:
    - card opens `/projects/[name]` overlay state
    - category opens `/projects/[name]/[category]` drawer-over-dialog
    - drawer dismiss returns to `/projects/[name]`.

- [ ] **Step 5: Optional commit (only if user explicitly requests)**

---

### Task 7: End-to-end verification + project tracking

**Files:**
- Modify: `.cursor/scratchpad.md`
- Modify: `docs/brainstorms/2026-03-26-projects-route-driven-overlay-brainstorm.md` (only if scope changed)

- [ ] **Step 1: Run full checks**
  - `cd apps/web && bun test`
  - `cd apps/web && bun run build`

- [ ] **Step 2: Manual QA matrix**
  - Validate:
    - `/projects` -> `/projects/[name]` on card click
    - `/projects/[name]` -> `/projects/[name]/[category]` on category click
    - drawer dismiss returns to `/projects/[name]`
    - browser back sequence category -> project -> grid
    - direct deep-link loads at each state
    - refresh on nested route preserves expected state
    - invalid project/category routes show not-found behavior
    - keyboard-only and reduced-motion paths are usable
    - mobile viewport parity matches desktop interaction sequence.

- [ ] **Step 3: Update scratchpad status + lessons**

- [ ] **Step 4: Optional commit (only if user explicitly requests)**

---

## Notes / Constraints

- Keep imports at top-level (no inline imports).
- Keep route namespace under `projects`.
- Keep components focused; avoid expanding `projects/page.tsx` responsibilities.
- Enforce a11y contract for overlay and drawer.
- Do not commit unless user explicitly requests it.
