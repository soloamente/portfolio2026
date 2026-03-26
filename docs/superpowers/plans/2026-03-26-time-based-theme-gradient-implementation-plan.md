# Time-Based Theme + Wave Blur Background Gradient Implementation Plan
> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax.

**Goal:** Add a 3-way theme mode control (`light` / `dark` / `time-based`) that also drives a site-wide background gradient based on local time day-part, including a smooth “wave blur” transition when the day-part changes. Mode persists via `localStorage` and updates every minute.

**Architecture:** Introduce pure helper functions for day-period mapping, theme selection, and gradient palette lookup. Add a client-side `ThemeModeController` that reads/persists the selected mode in `localStorage`, updates `next-themes` theme when required, and computes the current day-part every minute. Add a global `BackgroundWaveGradient` component with two fixed layers (base + overlay) to animate blur/opacity only when the day-part changes (never on initial mount; disabled entirely under `prefers-reduced-motion: reduce`). Add a `beforeInteractive` inline script in the root layout to prevent first-paint theme flashes.

**Tech Stack:** Next.js App Router, `next-themes`, Tailwind CSS, shadcn UI components, TypeScript (strict), CSS Modules for keyframes, Bun test runner (`bun test`).

---

### Task 1: Pure day-period + gradient helpers (with TDD)

**Files:**
- Create: `apps/web/src/components/theme/theme-utils.ts`
- Create: `apps/web/src/components/theme/theme-utils.test.ts`

**Assumptions:**
- Bun discovers tests by filename containing `.test` (so `theme-utils.test.ts` must exist).
- Pure helpers must not touch DOM APIs.

- [ ] **Step 1: Write the failing tests (and stub exports to compile)**

```ts
// Test cases to cover
// - getDayPeriod(date): dawn boundary (04:59 night, 05:00 dawn), morning boundary (06:59 dawn, 07:00 morning), afternoon boundary (11:59 morning, 12:00 afternoon), night boundary (17:59 afternoon, 18:00 night)
// - getThemeForDayPeriod(period): dawn/night => "dark", morning/afternoon => "light"
// - getGradientForDayPeriod(period): exact gradient strings from the spec
// - getInitialModeFromStorage(value): validates only "light" | "dark" | "time-based", otherwise defaults to "time-based"
// - shouldTriggerWaveBlur(previous, next, prefersReducedMotion): 
//   - returns false if prefersReducedMotion is true
//   - returns false if previous is null (initial mount safety)
//   - returns true only when previous !== next
```

Expected: `bun test` fails because the helper logic is intentionally stubbed/incorrect.

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd apps/web && bun test`

Expected: FAIL (assertions mismatch).

- [ ] **Step 3: Implement the minimal correct logic**

Implement `theme-utils.ts`:
- Define string-literal unions for `DayPeriod` (`"dawn" | "morning" | "afternoon" | "night"`) and theme mode (`"light" | "dark" | "time-based"`).
- Implement:
  - `getDayPeriod(date: Date): DayPeriod` using the spec hour ranges:
    - dawn: 05:00–06:59
    - morning: 07:00–11:59
    - afternoon: 12:00–17:59
    - night: 18:00–04:59
  - `getThemeForDayPeriod(period: DayPeriod): "light" | "dark"`
  - `getGradientForDayPeriod(period: DayPeriod): string` using exact gradient palette from the spec
  - `getInitialModeFromStorage(value: unknown): ThemeMode` with safe fallback to `"time-based"`
  - `shouldTriggerWaveBlur(previous: DayPeriod | null, next: DayPeriod, prefersReducedMotion: boolean): boolean`

- [ ] **Step 4: Re-run tests to confirm they pass**

Run: `cd apps/web && bun test`

Expected: PASS (all helper tests green).

- [ ] **Step 5: If Bun doesn’t discover tests, add minimal config**

Only if `bun test` reports no tests found:
- [ ] Create `apps/web/bunfig.toml` with `[test] include = ["src/**/*.test.*"]`
- [ ] Re-run: `cd apps/web && bun test`

Expected: tests are discovered and pass.

---

### Task 2: Global background component with wave blur overlay (day-part change only)

**Files:**
- Create: `apps/web/src/components/theme/background-wave-gradient.tsx`
- Create: `apps/web/src/components/theme/background-wave-gradient.module.css`

**Behavior requirements:**
- Renders two fixed full-screen layers:
  - Base layer: behind content (z-index ~`0`) with `backgroundImage: gradient`
  - Overlay layer: between base and content (z-index ~`1`), `pointer-events: none`, animated only when the day period changes
- Wave blur:
  - overlay blur ~`28px` and fades out over ~`900ms`
  - overlay animation must not trigger on initial mount
- Reduced motion:
  - when `prefers-reduced-motion: reduce`, wave overlay never animates (instant update only)

- [ ] **Step 1: Implement component (using the pure gating helper)**

Implementation detail:
- Use `usePrefersReducedMotion()` from `apps/web/src/hooks/use-prefers-reduced-motion.ts`.
- Accept props:
  - `dayPeriod: DayPeriod`
  - `gradient: string`
- Use a ref to store the previous `dayPeriod`.
- On `dayPeriod` change:
  - if `shouldTriggerWaveBlur(prev, next, prefersReducedMotion)` is true, increment an `animationNonce` to restart the overlay animation.

- [ ] **Step 2: Manual verification checks (no DOM unit test required)**

Run:
1. `cd apps/web && bun run dev`
2. Manually switch theme mode to `time-based` and wait for day-part boundary (or temporarily test by forcing day period changes in a dev-only method if you add one).

Expected:
- On day-part transitions, gradient transitions show smooth blur/opacity wave.
- No animation on first load.
- With OS reduced-motion enabled, no blur wave animation.

---

### Task 3: ThemeModeController (localStorage mode + next-themes coordination + minute updates)

**Files:**
- Create: `apps/web/src/components/theme/theme-mode-controller.tsx`
- Modify: `apps/web/src/components/providers.tsx`

**Behavior requirements:**
- Mode values persisted in `localStorage`:
  - key: `theme-mode`
  - values: `"light" | "dark" | "time-based"`
- `time-based` behavior:
  - every minute:
    - compute current day period from local device time
    - update background gradient day-part
    - switch `next-themes` theme between `light` and `dark` based on day-part mapping
    - only trigger theme/gradient updates when day-part actually changed
- Manual `light`/`dark` behavior:
  - background should keep reflecting current day-part gradient (recommended to keep the background “alive”)
  - `next-themes` theme is forced to the selected manual theme
- No wave blur on initial hydration (background component handles this).

**Context API:**
- Provide a `useThemeModeController()` hook for UI components (ModeToggle) to call:
  - `mode`
  - `setMode(nextMode: ThemeMode)`

- [ ] **Step 1: Implement ThemeModeController**

Implementation detail:
- In a `useEffect`, read `localStorage.getItem("theme-mode")`.
- Validate via `getInitialModeFromStorage`.
- Maintain:
  - `mode: ThemeMode`
  - `dayPeriod: DayPeriod` (updated every minute)
  - `gradient: string` (derived from dayPeriod via `getGradientForDayPeriod`)
- Use `next-themes` `useTheme()` to call `setTheme("light" | "dark")`:
  - if mode is `"time-based"`, map theme from `dayPeriod`
  - else map theme directly from mode (`"light"` or `"dark"`)
- Start a timer:
  - schedule first tick aligned to the next minute boundary (optional but preferred)
  - then tick every 60 seconds
- On `mode` change:
  - persist `theme-mode` in `localStorage`
  - apply theme immediately (no confirmation, no extra delays)

- [ ] **Step 2: Configure next-themes provider**

Modify `apps/web/src/components/providers.tsx`:
- Ensure system theme is disabled because mode is strictly 3-way.
- Set:
  - `enableSystem={false}`
  - `storageKey="theme"` (must match the inline script’s key)
  - keep `attribute="class"`, `defaultTheme="light"`, and `disableTransitionOnChange` to avoid transition jank.

Wrap app children with the controller:
- Update `Providers` to render `<ThemeModeController>{children}</ThemeModeController>` so the controller can render the global background and provide context for the toggle.

- [ ] **Step 3: Manual verification checks**

Run: `cd apps/web && bun run dev`

Expected:
- Dropdown includes `light`, `dark`, `time-based` after Task 4.
- Selecting modes updates the theme immediately.
- In `time-based`, theme switches at the day-part boundaries (hour ranges from Task 1).
- Reload persists the previously selected mode.

---

### Task 4: UI wiring — 3-option mode selector in navigation

**Files:**
- Modify: `apps/web/src/components/mode-toggle.tsx`
- Modify: `apps/web/src/components/navbar.tsx`

**Behavior requirements:**
- Mode selector exposes exactly 3 options: `light`, `dark`, `time-based`
- No `system` option.
- Selecting a mode updates immediately.
- Icon-only interactive element must have an explicit accessible label (use `aria-label`).

- [ ] **Step 1: Update `ModeToggle` dropdown options**

In `apps/web/src/components/mode-toggle.tsx`:
- Replace the third `system` option with `time-based`.
- Replace direct `useTheme().setTheme(...)` calls with `useThemeModeController().setMode(...)`.
- Optional UX:
  - reflect currently selected value in the trigger icon (the actual icon can still reflect the applied theme from `next-themes`, which is acceptable).

- [ ] **Step 2: Place `ModeToggle` into Navbar**

In `apps/web/src/components/navbar.tsx`:
- Import `ModeToggle` and render it inside the fixed nav container (alongside the existing link pill).
- Ensure it does not break pill alignment (the pill’s `clip-path` should still only affect link text).

- [ ] **Step 3: Manual verification checks**

Expected:
- Exactly 3 options appear (`light`, `dark`, `time-based`).
- No `system` option anywhere.
- Selecting changes theme and gradient immediately.

---

### Task 5: Flash prevention — inline pre-hydration script in RootLayout

**Files:**
- Modify: `apps/web/src/app/layout.tsx`

**Behavior requirements:**
- Add an inline script using `next/script` with `beforeInteractive`.
- Script must:
  - read `localStorage.getItem("theme-mode")`
  - validate, default to `"time-based"` if missing/invalid
  - compute day period from `new Date().getHours()` and map to initial theme when mode is `"time-based"`
  - set `document.documentElement.classList`:
    - add `dark` if initial theme is dark
    - remove `dark` if initial theme is light
  - write `localStorage.setItem("theme", initialTheme)` using the configured next-themes `storageKey`
- Must not trigger any wave-blur animation logic.

- [ ] **Step 1: Add `theme-preload` script**

Implementation detail:
- Use `id="theme-preload"` and `strategy="beforeInteractive"`.
- Wrap `localStorage` reads/writes in try/catch to avoid Safari/private-mode edge cases.
- Keep the hour-to-day-period mapping consistent with Task 1.

- [ ] **Step 2: Manual verification checks**

Expected:
- No initial flash of incorrect theme on reload when time-based maps to dark.
- Theme class and next-themes value agree.

---

### Task 6: Remove page-level gradients so global background is the only gradient source of truth

**Files:**
- Modify: `apps/web/src/app/page.tsx`
- Modify: `apps/web/src/app/about/page.tsx`
- Modify: `apps/web/src/app/crafts/page.tsx`
- Modify: `apps/web/src/app/contact/page.tsx`
- Modify: `apps/web/src/app/projects/page.tsx`
- Modify: `apps/web/src/app/projects/[name]/page.tsx`

**Behavior requirements:**
- Replace page-level `bg-linear-to-b ...` backgrounds with `bg-transparent`.
- Remove the projects page-only `.main-gradient` fixed layer:
  - delete `<div className="main-gradient fixed inset-0 z-0" />`
- Keep the existing noise texture overlay:
  - `pointer-events-none` and high z-index so it stays above gradients.

- [ ] **Step 1: Apply gradient removal edits**

For each of the listed page files:
- Replace the `bg-linear-to-b from-[#4D80E6] ...` classes with `bg-transparent` while preserving existing layout classes (`min-h-screen`, `p-24`, etc.).
- For `apps/web/src/app/projects/page.tsx`, remove the `.main-gradient` fixed element entirely.

- [ ] **Step 2: Manual verification checks**

Expected:
- All routes show the same global time-based gradient background.
- Projects page no longer “fights” with a separate `.main-gradient` layer.

---

### Task 7: Verification (tests + build + quick runtime smoke)

**Files:**
- None (commands only)

- [ ] **Step 1: Run Bun tests**

Run: `cd apps/web && bun test`

Expected: PASS for theme helper tests.

- [ ] **Step 2: Run Next.js production build**

Run: `cd apps/web && bun run build`

Expected: SUCCESS.

- [ ] **Step 3: Manual checklist**

1. Select `light`: theme is light, background gradient updates to current day period immediately.
2. Select `dark`: theme is dark, background gradient updates to current day period immediately.
3. Select `time-based`: theme follows day-part mapping and updates every minute.
4. Wave blur occurs only when day-part changes (not on first mount).
5. With `prefers-reduced-motion: reduce`, the wave blur animation never triggers.

---

## Notes (scope control)
- Do not refactor unrelated components beyond wiring changes needed for the theme dropdown and page background removal.
- Keep gradient day-part definitions single-sourced via `BackgroundWaveGradient` + `theme-utils`.
