---
date: 2026-03-26
topic: theme-lab
---

# Theme Lab Preview Page Design

## What We're Building
Add a dedicated dev-only route at `/theme-lab` to preview and tune background palettes and wave-blur animation behavior without changing production theme configuration.

This page is a local playground:
- Preview-only controls (ephemeral React state)
- No source-file writes from the UI
- No config persistence/export yet

## Why This Approach
You asked for a way to quickly see all background colors and animation behavior before deciding whether you like them. A dedicated lab route is the safest and fastest option:

- Isolated from production behavior
- Immediate visual feedback for palette and animation changes
- Easy to iterate without repeatedly editing source files and rebuilding mental context

## Key Decisions
- Route is `/theme-lab`.
- Route is **development-only**.
- Tool is **preview-only** (no apply/export in this version).
- Controls include both:
  - Colors (all day periods + blur colors)
  - Animation parameters (duration, blur strength, easing)

## Route Behavior
- In development:
  - render full Theme Lab UI
- In production:
  - always return `notFound()` for this route

Canonical rule:
- If `process.env.NODE_ENV !== "development"`, the route must call `notFound()`.
- This applies to:
  - production deploys
  - preview deploys
  - local `next build && next start`

Implementation note:
- Keep `apps/web/src/app/theme-lab/page.tsx` as a Server Component and do the env gate there.

## UI/Interaction Design
The page should include these sections:

1. **Period selector**
   - Options: `dawn`, `morning`, `afternoon`, `night`
   - Determines which palette is currently shown in focused preview controls

2. **Color controls**
   - For each day period:
     - Gradient start color
     - Gradient end color
     - Progressive blur color
   - Recommended inputs: HTML color input + text input for exact hex values

3. **Animation controls**
   - Duration (ms)
   - Blur strength (px)
   - Easing preset selector (e.g. ease-out, ease-in-out, custom cubic-bezier)

4. **Preview canvas**
   - Shows the currently selected period gradient in full area
   - Simulate button triggers a wave-style overlay transition using the current animation settings
   - Include labels to make active values obvious while tuning

## Architecture
Proposed structure:

- `apps/web/src/app/theme-lab/page.tsx`
  - Server route shell and dev-only gate (`notFound()` when not dev)
- `apps/web/src/components/theme/theme-lab-client.tsx`
  - Client wrapper that owns local React state (`useState`) and interactions
- `apps/web/src/components/theme/theme-lab-panel.tsx`
  - Controls for colors and animation
- `apps/web/src/components/theme/theme-lab-preview.tsx`
  - Visual preview area and simulation trigger
- Optional: `apps/web/src/components/theme/theme-lab-types.ts`
  - Shared interfaces/types for palette + animation model

Data flow:
- `theme-lab-client.tsx` owns local state for:
  - palette map
  - blur-color map
  - animation config
  - active day period
- `page.tsx` renders `theme-lab-client.tsx` only when in development
- `theme-lab-client.tsx` passes state/handlers to panel and preview components
- Preview renders from state only (no global theme runtime mutation)

## Input Constraints / Edge Cases
- Color text fields:
  - only apply values when they match full `#RRGGBB`
  - keep last valid value on partial/invalid input
- Animation controls:
  - duration clamped to a safe range (e.g. `100-3000ms`)
  - blur clamped to a safe range (e.g. `0-64px`)
- Reduced motion:
  - if `prefers-reduced-motion: reduce`, simulation action is disabled or no-op

## Non-Goals (for v1)
- No “Apply to app config” action
- No JSON export/import
- No persistence to localStorage
- No navigation integration in navbar

## Testing Plan
Given this is a preview-only tool, focus on lightweight coverage:

- Unit tests for extracted pure helpers (if created), such as:
  - gradient string builder
  - animation style builder from controls
- Route gating smoke test:
  - `/theme-lab` is not available when `NODE_ENV=production`
- Manual checks:
  - `/theme-lab` accessible in development
  - `/theme-lab` blocked in production
  - controls update preview immediately
  - simulate button triggers wave animation with selected settings

## Open Questions
- None blocking for v1.
- Future extensions can add:
  - apply-to-config
  - export/import presets
  - persistence between reloads

## Next Steps
→ `/workflows:plan` for implementation details.

