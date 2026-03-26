---
date: 2026-03-26
topic: time-based-theme-gradient
---

# Time-Based Theme + Background Gradient (Wave Blur)

## What We're Building
Add a 3-way theme mode selector to the web app:

- `light`: force light theme
- `dark`: force dark theme
- `time-based`: automatically choose the theme (and background gradient) based on the user's **local device time**

When `time-based` is selected, the app will:

1. Compute the active day period (dawn / morning / afternoon / night) from the local clock.
2. Switch the app theme between `light` and `dark` accordingly.
3. Update the site background gradient to match the active day period.
4. Update the above live every 60 seconds.

Additionally, when the day period changes, the gradient transition should feel **smooth like a wave blur** rather than an abrupt jump.

## Why This Approach
The project currently mixes:

- page-level hardcoded Tailwind gradient backgrounds (e.g. `bg-linear-to-b from/to`)
- a shared background layer used on the projects page (`.main-gradient` -> `--main-gradient`)

To make the time-based gradient truly site-wide and consistent, this design introduces a single global background controller:

- one global background gradient layer (fixed position, behind content)
- a small client controller that computes day periods and coordinates:
  - `next-themes` theme switching
  - gradient day-period changes

Because gradients cannot be smoothly “interpolated” via CSS across gradient strings, the wave-blur effect is implemented by animating opacity + blur on an overlay layer at the moment the gradient changes.

## Key Decisions
- **Time-based mode is automatic using local device time** (no location/sunrise integration).
- **Fixed day-part ranges** (no dynamic sunrise/sunset):
  - `dawn`: 05:00–06:59 → theme `dark`
  - `morning`: 07:00–11:59 → theme `light`
  - `afternoon`: 12:00–17:59 → theme `light`
  - `night`: 18:00–04:59 → theme `dark`
- **Mode selection is strictly 3-way**: `light` / `dark` / `time-based` (no `system`).
- **Theme switching is coordinated with `next-themes`** (`light`/`dark`) using the existing provider.
- **Persisted mode** is stored in `localStorage`:
  - key: `theme-mode`
  - values: `light` | `dark` | `time-based`
- **Wave blur transition**:
  - the base background gradient updates to the new period immediately
  - an overlay layer renders the same new gradient with stronger blur and fades out via CSS keyframes
  - parameters: overlay blur ~`28px`, duration ~`900ms`, fade opacity `1 -> 0`
  - for `prefers-reduced-motion: reduce`, wave blur never triggers (instant update only)
- **Progressive blur** remains fixed at `#E9DFE5` for now (not time-based).

## Visual/UX Requirements
- The theme mode control should be accessible and consistent with existing UI patterns.
- It should be exposed in the existing navigation area (recommended: inside the `Navbar`).
- Selecting a mode should apply immediately (no confirmation step).
- In `time-based`, the control should still reflect the current mode as `time-based`.

## Gradient Palette (Soft Minimal)
The time-based gradient colors for each day period:

- `dawn`: `linear-gradient(to bottom, #2f5aa7 0%, #f1d8ff 100%)`
- `morning`: `linear-gradient(to bottom, #4d80e6 0%, #f7efe0 100%)`
- `afternoon`: `linear-gradient(to bottom, #6cc7ff 0%, #e9dfe5 100%)`
- `night`: `linear-gradient(to bottom, #09102a 0%, #d1b7ff 100%)`

## Architecture (Proposed Components)
Client components:

1. `apps/web/src/components/theme/theme-mode-controller.tsx`
   - Responsibilities:
     - read persisted mode (`light` / `dark` / `time-based`) from `localStorage`
     - compute day period from `new Date()` and current hour
     - update `next-themes` theme when:
       - `light`/`dark` mode is selected directly
       - `time-based` mode is selected and day period changes
     - provide day period + gradient info to the background component
     - set up a 60-second interval when in `time-based`

2. `apps/web/src/components/theme/background-wave-gradient.tsx`
   - Responsibilities:
     - render a fixed, behind-content gradient background layer site-wide
     - when the day-period gradient changes, trigger the wave-blur overlay animation
   - Uses:
     - two layers (base + overlay)
     - CSS keyframes for fade/blur “wave”
     - `prefers-reduced-motion` to disable the wave overlay

3. Update existing `apps/web/src/components/mode-toggle.tsx` (or rename/move if desired)
   - Extend dropdown options to include:
     - `time-based`
   - Wire selection to the theme-mode controller.

Page integration:
- Replace page-level Tailwind gradient backgrounds (e.g. `bg-linear-to-b ...`) with `bg-transparent` so the global background layer is visible consistently.
- Remove or avoid page-specific `.main-gradient` usage so it doesn’t fight with the global background.

CSS source of truth:
- The new global background component should be the only place that decides the time-based gradient.
- Prefer rendering gradients by setting `style={{ backgroundImage: ... }}` on the base/overlay layers directly.
- If any legacy `.main-gradient` / `--main-gradient` usage remains after refactor, it must be removed or ignored to avoid competing sources of truth.

## Global Integration Scope (Current Routes)
Update pages that currently hardcode the Tailwind gradient:

- `apps/web/src/app/page.tsx` (Home)
- `apps/web/src/app/about/page.tsx`
- `apps/web/src/app/contact/page.tsx`
- `apps/web/src/app/crafts/page.tsx`
- `apps/web/src/app/projects/page.tsx`:
  - remove the page-level `.main-gradient` fixed layer so it doesn’t override the global background
- `apps/web/src/app/projects/[name]/page.tsx`

Noise overlay behavior:
- keep the existing noise texture overlays as `pointer-events-none` and ensure they remain above the global background layer (so clicks still go through).

## Persisted Mode + Hydration Strategy
To avoid flashes and avoid triggering a wave animation on first mount:

1. On initial client mount, read `localStorage.getItem('theme-mode')`.
2. If missing/invalid, default to `time-based`.
3. Compute the current day period from `new Date()` (local time).
4. Call `next-themes` `setTheme('light'|'dark')` based on the mapping.
5. Set the background gradient for the computed day period.
6. **Important:** do not start the wave overlay animation during the first initialization pass.
   - Only trigger the wave when the day period changes after the initial render.

Pre-hydration (flash prevention):
- Because `next-themes` has a `defaultTheme` (currently `light`), switching to `dark` based on time can cause a first-paint flash.
- To prevent that, implementation should add a tiny inline script (e.g. via `next/script` with `beforeInteractive`) that:
  - reads `localStorage.getItem('theme-mode')` (if available)
  - determines the initial theme as `light` or `dark`:
    - if `theme-mode` is `light` / `dark`, use it directly
    - if `theme-mode` is `time-based`, compute the current hour and map to day period -> theme
  - sets `document.documentElement` class immediately:
    - if initial theme is `dark`, ensure `document.documentElement.classList.add('dark')`
    - if initial theme is `light`, ensure `document.documentElement.classList.remove('dark')`
  - also sets `localStorage.setItem('theme', initialTheme)` (or the explicit `storageKey` you configure for `next-themes`)
    - this keeps `next-themes` from “correcting” the theme during hydration back to `defaultTheme`
  - does not run any wave-blur animation logic (wave blur only starts after real day-period transitions on the client)

## Wave-Blur Implementation Contract
The background component must satisfy the following constraints:

- **Layering**:
  - base layer: fixed, full-screen, behind content (z-index ~`0`)
  - overlay layer: fixed, full-screen, above base but below content (z-index ~`1`), `pointer-events-none`
  - existing per-page noise overlays: `z-300` and `pointer-events-none` (should remain on top of the gradient background)
  - `ProgressiveBlur` in `app/layout.tsx`: fixed with its own z-index (should remain visually consistent with the new global background)
  - overlay must have `pointer-events: none`
  - overlay should not block clicks/scroll or steal focus
- **Update sequencing on day-period change**:
  1. Update the base layer gradient to the new period immediately.
  2. Update the overlay layer gradient to the same new period.
  3. Trigger the overlay animation (opacity fade + blur decay) for ~`900ms`.
- **Reduced motion**:
  - when `prefers-reduced-motion: reduce` is active, do not mount/trigger the overlay animation at all.
- **Initial mount safety**:
  - because `usePrefersReducedMotion()` can be `false` during SSR, the background component must gate animation on a real “previous day period” value:
    - store the first computed day period in a ref
    - only trigger the overlay when `previousDayPeriod !== nextDayPeriod`

## Data Flow
1. User selects a mode in the UI.
2. The controller stores mode in `localStorage`.
3. If `light`/`dark`:
   - call `setTheme('light'|'dark')`
   - set gradient to the palette for that period-equivalent
     - default behavior (recommended): keep the last computed `time-based` gradient so the background stays “alive” visually even in manual mode
     - (implementation can later be made theme-fixed if you prefer)
4. If `time-based`:
   - compute day period from local time
   - call `setTheme('light'|'dark')` based on the mapping above
   - update background gradient day period so the wave blur can trigger when it changes
5. Every 60 seconds in `time-based`:
   - recompute day period
   - only trigger theme/gradient updates if the day period actually changed (to avoid redundant work)

## Error Handling / Edge Cases
- `localStorage` not available:
  - fall back to `time-based` using current device time without persistence.
- Hydration mismatch:
  - mode/gradient is computed client-side in `useEffect` to avoid server/client divergence.
- Time boundary:
  - updates are minute-level; the worst case is a shift up to 59 seconds.

## Testing Plan (To Be Implemented)
Unit tests (pure functions):
- `getDayPeriod(date)` returns correct period for boundary times.
- `getThemeForDayPeriod(period)` returns expected `light`/`dark`.
- `getGradientForDayPeriod(period)` returns expected gradient string.

Test runner alignment:
- `apps/web` exposes `bun test` via `package.json`.
- Bun test discovery requires a filename containing `.test` (or `.spec`, etc.).
- Therefore:
  - name pure function tests like `get-day-period.test.ts`
  - place them under `apps/web/src/` (or any folder included by Bun discovery)
  - write tests so they do not require DOM APIs (pure helpers only)

Component tests (optional after harness is confirmed):
- controller sets `next-themes` theme in response to mode selection.
- background component triggers wave animation when the day-period gradient changes.

## Implementation Acceptance Criteria (must be true before claiming done)
- Mode selector:
  - provides exactly 3 options: `light`, `dark`, `time-based`
  - applying a selection updates theme + gradient immediately
  - `time-based` updates every 60 seconds
  - the selected mode persists across refreshes via `localStorage.theme-mode`
- Hydration + flash prevention:
  - users should not see a first-paint light-theme flash when the current period maps to dark
- Background single source of truth:
  - all pages under `apps/web/src/app/*/page.tsx` that currently hardcode Tailwind gradient backgrounds (`bg-linear-to-b ...`) are changed to `bg-transparent`
  - the projects-page-only `<div className="main-gradient ..." />` is removed so the global background is the only gradient renderer
- Wave blur:
  - wave blur triggers only when the day period changes (not on initial hydration)
  - overlay is `pointer-events-none`
  - in `prefers-reduced-motion: reduce`, the wave overlay never animates (instant update only)

Manual verification checklist:
- Toggle `light` and `dark` and verify immediate theme + gradient behavior.
- Toggle `time-based` and verify theme flips at the expected boundaries.
- Keep an eye on the wave blur: gradient changes should appear “soft” rather than hard cuts.
- Verify `prefers-reduced-motion: reduce` disables wave animation.

## Open Questions
- For manual `light`/`dark`, should the gradient:
  - stay “alive” by using the last `time-based` computed palette (recommended default)
  - or switch to a fixed palette per manual theme

If you don’t choose now, we’ll implement the recommended default described above.

## Next Steps
→ `/workflows:plan` for implementation details.

