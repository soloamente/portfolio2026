# Theme Lab Dev-Only Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dev-only `/theme-lab` playground in `apps/web` for previewing and tuning palette and wave-animation settings without affecting production behavior or persisted app state.

**Architecture:** Keep route gating in a Server Component page (`notFound()` when not in development), and keep all interactivity in a dedicated client component with local ephemeral state only. Extract pure helper logic (color validation and animation value normalization) for TDD-friendly unit tests. Split UI into a small control panel and preview canvas so changes stay isolated and non-invasive.

**Tech Stack:** Next.js App Router, React client components, TypeScript, Bun test runner, existing project styling/utilities in `apps/web`.

---

## File Map (Planned)

- Create: `apps/web/src/app/theme-lab/page.tsx` (server route + dev-only gate)
- Create: `apps/web/src/components/theme/theme-lab-client.tsx` (interactive state owner)
- Create: `apps/web/src/components/theme/theme-lab-panel.tsx` (controls UI)
- Create: `apps/web/src/components/theme/theme-lab-preview.tsx` (visual simulation canvas)
- Create: `apps/web/src/components/theme/theme-lab-types.ts` (shared interfaces/constants)
- Create: `apps/web/src/components/theme/theme-lab-utils.ts` (pure helpers)
- Create: `apps/web/src/components/theme/theme-lab-utils.test.ts` (unit tests)
- Optional create (only if needed for focused styling): `apps/web/src/components/theme/theme-lab.module.css`

No nav updates, no persistence/export, no global theme behavior changes.

---

### Task 1: Lock in pure helper behavior with tests (TDD first)

**Files:**
- Create: `apps/web/src/components/theme/theme-lab-utils.test.ts`
- Create: `apps/web/src/components/theme/theme-lab-utils.ts` (initially minimal stubs to compile)

- [ ] **Step 1: Write failing tests for helper behavior**

Test targets:
- `isHexColor(value)` accepts only full `#RRGGBB`
- `normalizeHexInput(previousValid, draft)` keeps previous valid value when draft is partial/invalid
- `clampDurationMs(value)` clamps to safe range `100..3000`
- `clampBlurPx(value)` clamps to safe range `0..64`
- `canRunSimulation(prefersReducedMotion)` returns `false` when reduced motion is enabled

Run:
`cd apps/web && bun test src/components/theme/theme-lab-utils.test.ts`

Expected:
- FAIL with assertion mismatches or stub-not-implemented behavior.

- [ ] **Step 2: Implement minimal helper logic to satisfy tests**

Implementation notes:
- Keep helpers pure and side-effect free.
- Export explicit function return types.
- Add brief comments explaining safety constraints (input validation and clamping rationale).

- [ ] **Step 3: Re-run tests**

Run:
`cd apps/web && bun test src/components/theme/theme-lab-utils.test.ts`

Expected:
- PASS for all helper tests in this file.

- [ ] **Step 4: Run full web test suite smoke**

Run:
`cd apps/web && bun test`

Expected:
- Existing tests still pass; no regressions from new helper/test files.

---

### Task 2: Add server route gate for `/theme-lab` (dev-only)

**Files:**
- Create: `apps/web/src/app/theme-lab/page.tsx`

- [ ] **Step 1: Implement server-level dev gate**

Implementation requirements:
- Keep this file as a Server Component.
- If `process.env.NODE_ENV !== "development"`, call `notFound()` immediately.
- In development, render the client entry component (`ThemeLabClient`).

- [ ] **Step 2: Validate local dev behavior**

Run:
`cd apps/web && bun run dev`

Manual check:
- Visit `http://localhost:3000/theme-lab`.

Expected:
- Route renders Theme Lab UI in development.

- [ ] **Step 3: Validate production gate smoke**

Run:
`cd apps/web && bun run build && bun run serve`

Manual check:
- Visit `http://localhost:3000/theme-lab`.

Expected:
- 404 behavior (route blocked by `notFound()` in non-development runtime).

---

### Task 3: Define shared Theme Lab model and defaults

**Files:**
- Create: `apps/web/src/components/theme/theme-lab-types.ts`

- [ ] **Step 1: Add explicit interfaces and constants**

Define:
- `DayPeriod` union: `dawn | morning | afternoon | night`
- `PeriodPalette` interface: `start`, `end`, `blur` colors
- `PaletteByPeriod` map type
- `AnimationSettings` interface: `durationMs`, `blurPx`, `easing`
- `EasingPreset` union for preview dropdown options
- Default constants for palette + animation values used as initial client state

Expected outcome:
- A single source of truth for UI defaults and type-safe prop contracts.

- [ ] **Step 2: Type-check project**

Run:
`cd apps/web && bun run check-types`

Expected:
- PASS with no TypeScript errors introduced by new type definitions.

---

### Task 4: Build interactive client state container (ephemeral only)

**Files:**
- Create: `apps/web/src/components/theme/theme-lab-client.tsx`

- [ ] **Step 1: Implement local state ownership**

State to include:
- active period (`DayPeriod`)
- palette map (`PaletteByPeriod`)
- animation settings (`AnimationSettings`)
- simulation trigger token/counter for preview re-runs

Constraints:
- Use client component (`"use client"`).
- No `localStorage`, no cookies, no API writes.
- Keep updates immediate (toggle/controls apply instantly).

- [ ] **Step 2: Wire panel + preview composition**

Render:
- `ThemeLabPanel` for controls
- `ThemeLabPreview` for visual output

Pass state and typed handlers down as props.

Expected outcome:
- Page interactions fully contained in this component tree; zero side effects outside `/theme-lab`.

- [ ] **Step 3: Dev smoke**

Run:
`cd apps/web && bun run dev`

Manual check:
- Controls update visible preview values immediately.

Expected:
- No crashes/hydration warnings in browser console.

---

### Task 5: Implement controls panel (colors + animation)

**Files:**
- Create: `apps/web/src/components/theme/theme-lab-panel.tsx`
- Modify: `apps/web/src/components/theme/theme-lab-client.tsx` (connect handlers)

- [ ] **Step 1: Add period selector**

UI:
- selectable options for `dawn`, `morning`, `afternoon`, `night`.

Expected:
- selecting period changes which palette fields are being edited.

- [ ] **Step 2: Add color controls for selected period**

Per selected period:
- gradient start color
- gradient end color
- blur overlay color

Input pattern:
- HTML color input + text input for exact hex.
- Text input updates must pass through `normalizeHexInput`.

Expected:
- partial/invalid text does not corrupt stored valid color.

- [ ] **Step 3: Add animation controls**

Controls:
- duration (ms)
- blur strength (px)
- easing preset selector (include at least `ease-out`, `ease-in-out`, and one cubic-bezier custom preset label)

Validation:
- clamp numeric values through helper functions.

Expected:
- animation values always stay in safe bounds.

- [ ] **Step 4: Accessibility and interaction pass**

Checks:
- Labels correctly connected to each input.
- Control interactions are keyboard operable.

Expected:
- form controls are clear and usable without pointer-only interaction.

---

### Task 6: Implement preview canvas and reduced-motion simulation handling

**Files:**
- Create: `apps/web/src/components/theme/theme-lab-preview.tsx`
- Modify: `apps/web/src/components/theme/theme-lab-client.tsx` (simulation trigger wiring)

- [ ] **Step 1: Build preview canvas rendering**

Preview requirements:
- large area showing selected period gradient (start -> end)
- display active values (period, colors, animation settings) so tuning is visible

Expected:
- visual output always reflects current in-memory state.

- [ ] **Step 2: Add simulate button behavior**

Behavior:
- clicking simulate triggers wave-style overlay animation using current animation settings.
- this is preview-only and does not mutate app-wide theme config.

Expected:
- each click produces an observable animation run.

- [ ] **Step 3: Enforce reduced-motion guard**

Behavior:
- detect `prefers-reduced-motion: reduce` in client.
- when enabled, simulation is disabled or becomes a no-op with clear UI feedback (e.g., disabled button text/label).

Expected:
- no wave simulation animation runs when reduced motion preference is active.

- [ ] **Step 4: Manual simulation verification**

Run:
`cd apps/web && bun run dev`

Manual checks:
- simulate works under normal motion settings.
- simulate does not animate under reduced-motion setting.

Expected:
- behavior matches accessibility requirement in spec.

---

### Task 7: Route-gating smoke strategy + final verification checklist

**Files:**
- Optional docs update if needed: `docs/superpowers/specs/2026-03-26-theme-lab-design.md` (only if implementation notes are added; otherwise no change)

- [ ] **Step 1: Quick route gating smoke in production runtime**

Run:
`cd apps/web && bun run build && bun run serve`

Check:
- open `/theme-lab` in browser.

Expected:
- 404/not found in non-development runtime.

- [ ] **Step 2: Dev runtime smoke for feature scope**

Run:
`cd apps/web && bun run dev`

Checklist:
- `/theme-lab` loads in development.
- color controls update preview immediately.
- animation controls affect simulation output.
- reduced-motion disables/no-ops simulation.
- no persistence after hard refresh (state resets to defaults).

Expected:
- all checks pass; scope remains preview-only and isolated.

- [ ] **Step 3: Final quality commands**

Run:
- `cd apps/web && bun test`
- `cd apps/web && bun run check-types`
- `cd apps/web && bun run lint` (if lint script is healthy in this workspace)

Expected:
- tests/type-check pass; lint clean or known pre-existing warnings only.

---

## Out of Scope Guardrails

- Do not add `/theme-lab` links in navbar or other navigation.
- Do not persist settings to storage.
- Do not add export/import/apply-to-config actions.
- Do not modify global theme behavior outside this dev-only route.

---

## Suggested Commit Slices (Optional)

1. `test(theme-lab): add helper tests and pure utils`
2. `feat(theme-lab): add dev-only route gate and client shell`
3. `feat(theme-lab): add controls and preview simulation`
4. `chore(theme-lab): run verification and tighten typing`
