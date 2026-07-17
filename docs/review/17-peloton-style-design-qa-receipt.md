# Peloton-style learning surface QA receipt

Date: 2026-07-15  
Scope: dark-first visual language migration for the React/Next.js learning platform.

## Contract shipped

- `#121212` app background, `#1F1F1F` cards, `#E63946` primary/recovery actions.
- `#007AFF` progress, links, focus, and informative states.
- `#C7FF00` achievement/mastery badges.
- System font stack only; no remote font dependency.
- 8px rhythm; 999px buttons/nav pills; 12px cards; 10px inputs; 6px tags/badges.
- Desktop persistent sidebar; mobile Dashboard/Curriculum/Challenges/Progress/More tab bar.
- Q&A, Best Practices, and Settings remain desktop-visible and move into the mobile More sheet.

## Browser evidence

Runner: `agent-browser` against `next start` on `localhost:3002` after a clean production build.

Routes exercised: `/`, `/dashboard`, `/curriculum`, `/lesson/closures-in-javascript`, `/challenge`, `/challenge/fix-stale-closure`, `/qa`, `/best-practices`, `/progress`, `/settings`, `/design-system`.

Viewport smoke matrix: `320`, `375`, `768`, `1024`, and `1280` widths. `document.documentElement.scrollWidth === innerWidth` observed on every exercised route/viewport; no horizontal overflow.

Interaction evidence:

- Mobile More sheet exposes a labelled complementary navigation with Q&A, Best Practices, Settings.
- Escape closes More and restores focus to the More trigger.
- Desktop snapshot exposes all seven navigation destinations.
- Production dashboard snapshot exposes no Next.js dev-tools control.
- First Tab reaches the skip link with a visible `2px` focus outline.
- Production 375px controls had no visible `button`/`select` below 44px; mobile tab items remain touch-safe.
- Screenshot review covered dashboard mobile/desktop, More sheet, curriculum, challenge detail, and design-system showcase.

## Automated verification

- `npm test` — 20 files passed, 54 tests passed, 1 skipped.
- `npm run lint` — passed with zero warnings.
- `npm run typecheck` — passed.
- `npm run build` — passed; 12 routes generated.
- `npm run verify:sources` — passed; 1 live-source test passed.

## Changed surface

`../DESIGN.md`, `tailwind.config.ts`, `src/app/globals.css`, `src/components/layout/AppLayout.tsx`, `src/lib/navigation.ts`, `src/lib/navigation.test.ts`, shared learning primitives, route surfaces, and curriculum icon labels.

## Deferred

No Lighthouse/axe package was added. Manual accessibility evidence covers landmarks, focus, keyboard close, touch targets, reduced-motion CSS, and overflow; add automated axe/Lighthouse capture when the project adopts a browser-audit dependency.
