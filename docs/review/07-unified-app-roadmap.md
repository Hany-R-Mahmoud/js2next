# Unified app roadmap

## Decision

- Target workspace: `learn-next`.
- Canonical product: one React + Next.js curriculum, not two parallel apps.
- Architecture base: `learn-react` learning engine and verification approach.
- Content base: `learn-next` breadth, practical scenarios, Q&A, and best-practice cards.
- Visual base: `learn-next` warm editorial palette plus `learn-react` responsive/accessibility patterns.
- Mastery scale: `0–1` internally; percentages only at UI boundaries.
- Route identity: stable canonical IDs with optional URL slugs; no duplicate route vocabulary.

## Stages and gates

### Stage 0 — evidence and source governance — implementation complete

- Existing assessments and merge decisions are in `docs/review/01` through `06`.
- Official-source policy and volatile-topic review rules are recorded.
- Current status: the policy exists, direct source coverage is enforced for published catalog records, 136 volatile claims have a ledger, and the live source check passes when network access is available. Content-record claim coverage and the pinned-version claim review now pass; future framework upgrades must reopen the version review.
- Gate: every volatile claim must identify the direct source, supported claim, framework/version context, verification date, and any competing model. The pinned-version gate passes; see `08-content-trust-audit.md` for the upgrade-triggered maintenance queue.

### Stage 1 — unified base app — implementation gate passed; product-phase follow-up remains

- Add canonical learner types and mastery/challenge evaluation seams to `learn-next`.
- Add durable lesson/challenge progress and profile migration boundaries.
- Add typecheck, lint, and unit-test gates.
- Current status: build, typecheck, lint, unit tests, source verification, route/data parity, and the fresh browser matrix pass; `canonicalProfile` is the only store state and persisted learner record; prerequisite enforcement blocks both curriculum links and direct lesson routes.
- Current reliability work also includes normalized mastery v3, canonical `challenge:<slug>` IDs, `learn-react` v1 and legacy profile migration, JSON import/export, reveal gating until a real attempt, durable lesson answer/reflection state, and direct middleware/content parity coverage.
- Release constraint: the app foundation is usable; the next goal in `11-next-goal.md` covers the remaining curriculum, adaptation, design-system, and release hardening work.
- Gate: clean checkout build checks, route/data parity, executable browser flows, one learner-state owner, responsive browser evidence, and independent review. Visual follow-up items are tracked under Stage 6 rather than blocking the data/runtime foundation.

### Stage 2 — content normalization — in progress

- Convert lessons, challenges, Q&A, and practices into one versioned content contract.
- Add `sourceUrl`, `sourceType`, `lastVerifiedAt`, framework version, and confidence metadata.
- Deduplicate IDs and preserve every reachable item.
- Gate: schema validation, duplicate detection, dead-link checks, and content inventory report.

Current merge slice:

- `src/data/learn-react-bridge.ts` converts nine learn-react modules into the learn-next lesson contract.
- The nine deep dives are reachable through `/lesson/deep-dive-*` and use the existing lesson reader, progress persistence, source inventory, and route graph.
- The adapter preserves learn-react’s plain explanation, technical model, causal explanation, example, prediction check, synthesis, retrieval, reflection, and mastery fields.
- `src/data/learn-react-challenge-bridge.ts` converts all ten learn-react challenges into the existing challenge routes while preserving typed checks, staged hints, acceptance criteria, wrong paths, follow-ups, and source links.
- `src/data/learn-react-qa-bridge.ts` folds in nine deep-dive prediction questions plus four additional learn-react QA items. The six overlapping learn-react practice cards are intentionally deduplicated against the eight existing learn-next practice cards rather than copied as duplicates.
- This merge slice now includes semantic learning diagrams, two prediction checkpoints with persisted chunk progress, an applied mini-project with persisted notes, and first-class typed challenge scoring in the visible UI.
- Canonical content schema v1 now requires schema version, title, topic ID, tags, topic family, and source metadata in the catalog projection; exported QA/practice records require explicit ownership, while raw source arrays use separate unowned input contracts before normalization.
- Richer pedagogy is now live for all 31 lessons: topic-specific diagrams, persisted retrieval chunks, and rubric-backed mini-projects render through `LessonExtras`. Migration-only raw fields should move into source contracts.

Current trust gate:

- `src/lib/content/identity.ts` defines typed content keys and challenge-to-lesson ownership.
- `src/lib/content/catalog.ts` provides the current canonical catalog projection for lessons, challenges, QA, and practices.
- `src/lib/content/claims.ts` now records 136 volatile claims with direct sources, version context, support boundaries, conflicts, and confidence; the executable coverage test reports no uncovered catalog records.
- `npm run verify:sources` checks every unique catalog and claim URL against a live HTTP response; the current run passes after correcting stale Next.js performance links.
- `src/components/shared/SourceAttribution.tsx` exposes source type, verification date, framework version, and direct links on lesson, challenge, Q&A, and practice surfaces.
- `.github/workflows/quality.yml` promotes tests, lint, clean typecheck, live source verification, and production build into the repository quality gate.
- `src/lib/content/inventory.ts` no longer invents family/category fallback URLs; missing direct provenance is an inventory failure.
- The catalog currently requires direct provenance for all published records and maps challenge ownership to an existing lesson.
- Every published catalog record is now tied to at least one audited claim and direct source; the pinned-version statement/conflict review passes. Current live-link health passes and is enforced by the repository quality workflow.

### Stage 3 — learning loop and adaptation

- Add lesson phases, diagnostics, predictions, confidence, hints, reveals, review scheduling, and “why this next” recommendations.
- Add migrations for both existing local-storage formats.
- Gate: deterministic mastery/recommendation tests and refresh-safe lesson/challenge flows.

### Stage 4 — challenge ladder

- Expand the ten-level ladder into trace, predict, debug, design, review, performance, architecture, and capstone tasks.
- Keep deterministic evaluators first; defer arbitrary code execution until threat modeling and isolation exist.
- Gate: evaluator tests, feedback review, keyboard flow, and explicit scored/unscored labels.

### Stage 5 — ecosystem curriculum

- Add TypeScript, forms, schemas, server state/TanStack Query, testing, accessibility, performance, auth/security, and deployment in dependency order.
- Add an optional tool-ownership comparison for Redux Toolkit, React Router, Next App Router, URL state, and server-state caches without changing the canonical runtime dependencies.
- Gate: each module has objectives, prerequisites, exercises, source metadata, and a verified version note.

### Stage 6 — UI/UX consolidation

- Build the documented primitive showcase, then consolidate dashboard, lesson reader, challenge workspace, review queue, and settings.
- Keep warm light mode as default; add deliberate dark mode only after contrast and state coverage.
- Gate: browser QA at 375/768/1280, keyboard audit, reduced-motion audit, and no placeholder/empty dead ends.

### Stage 7 — production readiness

- Add privacy-aware sync/auth only when local-first behavior and export/import are stable.
- Add repository exercises or a sandbox only after security review.
- Gate: production build, E2E critical path, accessibility scan, security review, and deployment smoke.

## Stage 1 execution scope

- Keep existing routes working while the canonical engine is introduced behind adapters.
- Do not copy both app shells or merge package locks.
- Do not add server state, auth, analytics, or arbitrary code execution in this stage.
- Every change must have a focused test or command-level gate.

## Current execution receipt

- Receipt date: 2026-07-15.

- Canonical engine seam: `src/lib/learning/types.ts`, `mastery.ts`, and `migration.ts`.
- Durable progress: `src/stores/learner.ts`, lesson position restore after Zustand hydration, durable lesson answer/reflection state, typed challenge attempt persistence, and sibling-profile import migration.
- Content trust seam: `src/lib/content/validate.ts`, `inventory.ts`, and tests that expose missing challenge/Q&A source metadata for Stage 2.
- Reliability: `eslint.config.mjs`, `vitest.config.ts`, `package.json` scripts, offline-safe font fallback, middleware 404 handling, and branded `src/app/not-found.tsx`.
- Knowledge corrections: closure answer, Next.js 15 fetch/cache model, Route Handler scope, `revalidatePath` context, Client Component boundary, auth guidance, and performance absolutes.
- Automated receipt: `npm run typecheck`, `npm run lint`, `npm run verify:sources`, and `npm run build` pass on Next.js 15.5.20; `npm test` passes with 18 files, 48 tests, and one intentionally skipped live suite. Focused normalized-catalog/expansion/claim/package/lesson-extension tests pass.
- Browser receipt: fresh production smoke passes the dashboard recommendation and daily-package cards, mobile drawer focus trap/restoration and scroll lock, typed challenge scoring with mastery update and reload persistence, reveal gating before submission, lesson prediction and practice-note persistence after reload, visible source attribution, settings import/export controls, user-facing 404s, and no console errors. New lesson smoke confirms retrieval checkpoint and mini-project rubric render at 375px. The current visual matrix has 375/768/1280 evidence in `.omo/teams/team-c9a16822/artifacts/` and historical route matrices under `.omo/evidence/`.
- Historical QA artifacts under `.omo/evidence/unified-qa-gate-review.md` and `.omo/evidence/unified-qa/learn-next-manual-qa.md` describe pre-fix failures; they are retained as audit history and are not current receipts.
- Canonical follow-up currently complete: one persisted canonical learner profile, v2-to-v3 and legacy-state hydration migration, `learn-react` v1 import migration, typed content identities, canonical challenge IDs, challenge-to-lesson ownership, direct source metadata for published records, persisted challenge/lesson records, reveal gating, route/data parity, lesson handoff graph validation, and source-inventory validation.
- Canonical follow-up: the deterministic daily package remains pure and dashboard-composed in this phase. Persistence or scheduling is deferred until product requirements define cadence, timezone, reminders, privacy, and cross-device ownership; reopen claim-level review when a framework/library version changes.
- Merge receipt: 31 lessons, 31 challenges, 44 QA items, and 22 best-practice cards are now in the canonical app. The schema/form boundary, client/server-state, performance-diagnosis, authorization-boundary, TypeScript-for-React, testing, production-readiness, and ecosystem-comparison modules use direct Zod, TanStack Query v5, React, Next.js, OWASP, TypeScript, Testing Library, Playwright, Redux Toolkit, and React Router sources; the deterministic daily package is surfaced on the dashboard without persistence or a scheduler. Bridge/expansion tests prevent duplicate IDs and dead lesson/challenge handoffs; the canonical catalog and source inventory pass structural validation for lessons, challenges, QA, and practices.
- Correctness receipt: canonical streak/mastery writes now stay synchronized at normalized `0–1`, malformed profiles and mismatched progress keys are rejected, sibling progress maps into canonical identities, solution reveal requires an attempt, and the diagnostic final answer is included in level selection.
- Remaining merge work: define the product requirements for adaptive-package persistence or scheduling in the next phase; no scheduler is added to the local-first curriculum without that contract.
