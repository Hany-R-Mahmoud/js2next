# Next source-backed curriculum batch

- Audit date: 2026-07-15.
- Owner: source-expansion (`codex://threads/019f6507-2d20-7bf2-99c2-87ea8ef6bedf`).
- Scope: read-only inventory of curriculum records, source manifests, trust notes, and deferred goals. This review changes no runtime files or curriculum data.

## Baseline and source inventory

The canonical app currently exposes 31 lessons, 31 challenges, 44 Q&A items, and 22 best-practice cards. The current catalog projection and claim gate report full identity coverage; the claim ledger contains 136 direct-source records. These are the current baseline receipts in [`11-next-goal.md`](11-next-goal.md), [`10-learning-trust.md`](10-learning-trust.md), and [`08-content-trust-audit.md`](08-content-trust-audit.md).

The source register in [`source-manifest.md`](../curriculum/source-manifest.md) contains:

- `../js.md` and `../react.md`: extracted course transcripts, useful for discovery and source selection only;
- `p1.md`–`p6.md`: tutor, product, learning-design, and course-architecture prompts, useful for pedagogy but not technical provenance;
- `../learn-react/src/content/`: structured sibling content already bridged into nine deep-dive lessons and ten challenges.

The manifest's P0/P1 intake records are shipped: forms, browser failure debugging, URL state, client/server state, performance diagnosis, authorization, TypeScript boundaries, testing, production readiness, and ecosystem ownership. New work must therefore be a focused delta, challenge variant, or operational transfer task.

## Ranked gaps

| Rank | Gap | Evidence in current inventory | Recommended shape | Priority |
| --- | --- | --- | --- | --- |
| 1 | Optimistic mutation failure and rollback | Forms teach pending/server validation, but no record teaches React 19 `useOptimistic`, canonical-state convergence, or failure recovery. `rg` found no `useOptimistic`/rollback record in `src/data`. | One focused lesson + level-4 challenge + Q&A + practice; no dependency. | P0 |
| 2 | Route recovery under expected errors, uncaught errors, and streaming | `app-router-and-layouts` names `loading.tsx`, `error.tsx`, and `not-found.tsx`, but [`09-source-intake.md`](09-source-intake.md) explicitly calls for a focused failure-flow practice rather than another overview. | Challenge-first slice, optionally one Q&A/practice; keep the existing route lesson canonical. | P0 |
| 3 | Production observability as an actionable triage loop | Production readiness says “observability” and rollback, but no current record teaches `instrumentation.ts`, `onRequestError`, trace/log evidence, or a bounded incident diagnosis. | One focused lesson + level-8 incident challenge + Q&A + practice; content-only, no telemetry dependency. | P1 |
| 4 | Concurrent session refresh race | `design-auth-flow` covers auth architecture and names refresh races, but lacks a deterministic single-flight/ bounded-retry variant. This is a narrower security transfer, not a new auth overview. | One level-9 challenge variant + Q&A; only publish after security wording/source review. | P1 |

## Implementation-ready candidates

### 1. `optimistic-mutation-recovery` — P0

- **Family/level:** `app-quality` → `nextjs-data`, intermediate/advanced.
- **Prerequisites:** `expansion-runtime-schema-boundaries`, `expansion-client-server-state`.
- **Lesson objective:** distinguish optimistic view state from canonical server state; show pending intent; converge on the server result; restore the last canonical value and expose an actionable error when the action fails.
- **Prediction check:** given a like/save action that rejects, predict what remains visible, which state owns the final value, and which message is recoverable.
- **Transfer task:** design a save flow with optimistic row state, duplicate-submit protection, server rejection, retry, and accessible status feedback.
- **Challenge acceptance:** optimistic state appears only during the Action; failed mutation does not become durable success; canonical state remains authoritative; the learner names rollback/retry and a visible error path; no client-only authorization claim.
- **Focused verification:** one content route/catalog identity test; one evaluator test for failure/rollback acceptance; one source/claim coverage assertion.
- **Direct sources:** [React `useOptimistic`](https://react.dev/reference/react/useOptimistic), [React `useActionState`](https://react.dev/reference/react/useActionState), [React form actions](https://react.dev/reference/react-dom/components/form), [Next.js 15 error handling](https://nextjs.org/docs/15/app/getting-started/error-handling).
- **Version/conflict note:** pin React `19.2.7` and Next.js `15.5.20`; `useOptimistic` is temporary UI state, not persistence or authorization. Do not teach a generic “rollback library” contract.

### 2. `route-recovery-and-streaming` — P0

- **Family/level:** `nextjs-foundations` → `production`, advanced challenge.
- **Prerequisites:** `app-router-and-layouts`, `server-data-fetching`, `expansion-testing-user-behavior`.
- **Recommended record shape:** challenge-first; do not add a second App Router overview lesson.
- **Scenario:** a dynamic dashboard has a missing resource, an expected form/data failure, an uncaught render exception, and a slow nested data dependency.
- **Challenge acceptance:** classify expected vs uncaught failure; place `notFound()` and `error.tsx` at the correct segment; use `reset()` for retry; choose `loading.tsx` or nested `Suspense` for the slow dependency; explain why an error boundary does not catch ordinary event-handler failures; define one user-visible smoke assertion per state.
- **Focused verification:** challenge evaluator checks all four state classes; Q&A checks boundary ownership; route identity and direct-source coverage remain green.
- **Direct sources:** [Next.js 15 error handling](https://nextjs.org/docs/15/app/getting-started/error-handling), [Next.js 15 fetching data and streaming](https://nextjs.org/docs/15/app/getting-started/fetching-data), [Next.js `notFound`](https://nextjs.org/docs/app/api-reference/functions/not-found).
- **Version/conflict note:** use the pinned Next.js 15 docs. Keep `loading.tsx` route-level and `<Suspense>` component-level in examples; do not imply streaming removes the need for explicit error recovery.

### 3. `instrumentation-and-incident-triage` — P1

- **Family/level:** `production`, advanced.
- **Prerequisites:** `expansion-production-readiness`, `expansion-testing-user-behavior`, `expansion-performance-diagnosis`.
- **Lesson objective:** turn a production symptom into a bounded evidence loop: request/error signal, route and deployment context, user-safe log fields, reproduction, mitigation, and rollback trigger.
- **Prediction check:** given a slow or failing route with incomplete logs, identify the next signal to collect and distinguish instrumentation from fixing the underlying bug.
- **Transfer task:** write an incident card for a failing Server Action or route: impact, hypothesis, evidence, safe correlation ID, owner, mitigation, verification, and rollback condition.
- **Challenge acceptance:** names `instrumentation.ts`/`register` or `onRequestError` correctly; avoids secrets/PII in telemetry; distinguishes server signals from browser UX; proposes a production-like reproduction and rollback; does not require installing an observability vendor.
- **Focused verification:** claim test for versioned Next.js instrumentation sources; evaluator test for evidence/rollback fields; content route reachability test.
- **Direct sources:** [Next.js 15 instrumentation guide](https://nextjs.org/docs/15/app/guides/instrumentation), [Next.js 15 instrumentation file convention](https://nextjs.org/docs/15/app/api-reference/file-conventions/instrumentation), [Next.js 15 OpenTelemetry guide](https://nextjs.org/docs/15/app/guides/open-telemetry), [Next.js 15 production checklist](https://nextjs.org/docs/15/app/guides/production-checklist).
- **Version/conflict note:** pin Next.js `15.5.20`; instrumentation is an integration seam, not proof that a provider is configured. Keep vendor SDKs and runtime dependencies out of this content-only slice.

### 4. `session-refresh-race` — P1, gated

- **Family/level:** `production`, expert challenge variant owned by the existing `design-auth-flow` topic.
- **Prerequisites:** `design-auth-flow`, `expansion-authorization-boundaries`.
- **Scenario:** several requests observe an expired session at once while another tab logs out. The learner must define refresh ownership, bounded retry, stale-result rejection, and cross-tab invalidation.
- **Challenge acceptance:** one refresh owner or equivalent single-flight contract; no unbounded retry loop; logout invalidates local session presentation across tabs; server authorization remains authoritative; refresh/session material is not placed in `localStorage`; race and denial tests are named.
- **Focused verification:** deterministic evaluator checks race, retry bound, cross-tab event, and server-authority keywords; source coverage test; security review before publication.
- **Direct sources:** [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), [MDN BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel), [Next.js authentication](https://nextjs.org/docs/app/guides/authentication).
- **Version/conflict note:** this is vendor-neutral design content only. BroadcastChannel communicates same-origin browsing contexts; it does not grant permission or replace server authorization. Do not add auth runtime code to satisfy this candidate.

## Explicit non-gaps and deferrals

- **Do not duplicate browser failure debugging.** `expansion-browser-failure-debugging` and `expansion-debug-stale-search-results` already cover propagation, HTTP-vs-network failure, abort/ignore, and retry.
- **Do not duplicate schema/TypeScript boundaries.** `expansion-runtime-schema-boundaries` and `expansion-type-safe-form-boundary` already cover runtime parsing, field errors, `unknown`, and compile-time/runtime separation. Add a new record only if a later product asks for a distinct form-library comparison.
- **React Hook Form comparison remains deferred.** The app has no React Hook Form runtime need; compare it with native React forms and Zod only when a concrete product boundary or learner request justifies the extra ecosystem surface.
- **Vanilla DOM/OOP and large vanilla-JS project material remains optional.** Existing foundations plus the browser-failure slice cover the route graph without another beginner module.
- **No new dependency follows from this review.** All four candidates can ship as static content, claims, and focused tests; runtime or auth/telemetry integration requires a separate product/security decision.

## Publication gate

For any candidate selected, preserve the existing contract: stable non-duplicate identity, topic family, level, prerequisites, objectives, prediction, transfer task, mastery criteria, direct official/standard sources, framework/library version, `lastUpdated`/verification date, support boundary, conflict note, catalog reachability, and focused claim/evaluator tests. Re-run source verification, typecheck, lint, full tests, build, and browser QA after implementation.

### Recommended order

1. `optimistic-mutation-recovery` — smallest uncovered learner behavior and highest direct value.
2. `route-recovery-and-streaming` — closes the known App Router failure-flow gap without duplicating the overview.
3. `instrumentation-and-incident-triage` — converts “observability” from checklist language into practice.
4. `session-refresh-race` — publish only after the security contract is reviewed; keep it a challenge variant, not a new auth module.
