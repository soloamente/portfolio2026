---
date: 2026-03-26
topic: projects-route-driven-overlay
---

# Projects Route-Driven Overlay Brainstorm

## What We're Building
We are designing a Daybreak-style projects exploration flow under the existing `projects` namespace. On card click, the image wrapper expands in place into a dialog-like project surface. Inside that surface, users see category cards (for example, `Brand` and `Web`). Clicking a category opens a bottom drawer while keeping the dialog visible in the background.

The interaction is route-driven and animated. Route state should map directly to UI state:
- `/projects` shows the projects grid
- `/projects/[project]` shows the expanded project dialog state
- `/projects/[project]/[category]` shows the category drawer layered over the project dialog

This preserves deep links and browser back/forward semantics while maintaining a premium animated feel.

## Why This Approach
Three approaches were considered:
- Route-driven overlays (recommended)
- Local UI state only
- Hybrid route + local drawer state

Route-driven overlays were selected because they match the reference interaction quality while preserving navigation correctness and shareable links. This also provides a clearer product model: every meaningful UI state has a stable URL.

## Key Decisions
- Use an **expand-in-place** card interaction as the first transition on click.
- Keep using the existing `/projects` route family (no new `/work` namespace).
- On category click, open a **bottom drawer over the dialog** (dialog remains visible behind).
- On drawer dismiss, return to the same open dialog so users can choose another category.
- Keep the same interaction model on mobile (no alternate mobile-first flow).
- Encode state in routes:
  - project state: `/projects/[project]`
  - category state: `/projects/[project]/[category]`
- Target a polished animated transition style similar to daybreak.studio, with implementation details deferred to planning.

## Resolved Questions
- Entry behavior: expand card inline into dialog.
- Drawer layering behavior: drawer overlays dialog.
- Drawer dismiss behavior: return to dialog.
- Mobile behavior: same as desktop flow.
- URL behavior: route-driven state for both project and category.
- Route namespace: keep `projects`.

## Open Questions
- None for brainstorm scope.

## Next Steps
Proceed to implementation planning to define the concrete route structure, component boundaries, animation orchestration strategy, and verification steps.
