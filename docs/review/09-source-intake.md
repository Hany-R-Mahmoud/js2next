# Source intake: expansion batch

## Scope

Inventory covers the assigned source set: `../js.md`, `../react.md`, `../p1.md`–`../p6.md`, and the sibling `../learn-react` content. Runtime code was not changed.

`js.md` and `react.md` are course transcripts extracted on 2026-07-15. They are useful secondary source material, not publication-grade provenance. Volatile framework claims need direct official sources, version notes, and verification dates before entering the catalog.

## Existing coverage

The current catalog already contains the nine learn-react deep dives and ten learn-react challenges. Existing route-facing coverage includes:

| Covered | Current records | Intake decision |
| --- | --- | --- |
| JavaScript closures, promises/event loop, immutability/modules | `closures-in-javascript`, `async-js-promises`, `deep-dive-async-immutability` | Do not duplicate; use only for prerequisites or transfer variants. |
| Components, JSX, props, state, events, reducers, context | `components-and-jsx`, `state-and-events`, `use-reducer-and-context`, `deep-dive-react-mental-model` | Do not duplicate. |
| Effects, cleanup, custom hooks, race conditions | `use-effect-and-custom-hooks`, `deep-dive-state-and-effects` | Deepen only with distinct async/form or performance scenarios. |
| App Router, RSC, server data, caching, Server Actions | `app-router-and-layouts`, `server-vs-client-components`, `server-data-fetching`, bridge deep dives | Deepen forms, client server-state, pending/optimistic UI, and operational failure paths. |
| Auth, secrets, performance, deployment, architecture | production and architecture deep dives; existing challenges | Do not add generic overview records; add focused security/performance transfer tasks only. |
| Accessibility, forms, error/loading states, testing | `deep-dive-app-quality` | Existing overview is broad but shallow; add a focused practice module, not a replacement lesson. |

## Candidate inventory

| Priority | Candidate | Category/family | Source evidence | Implementation boundary | Status |
| --- | --- | --- | --- | --- | --- |
| P0 | Browser events, event delegation, and request failures | foundations / app-quality | `../js.md:1857`, `../js.md:4884`, `../js.md:112935`, `../js.md:118333`, `../js.md:24337` | One beginner/intermediate module; use React event examples only after the browser model. | Ready after direct MDN links are attached. |
| P0 | Forms, runtime validation, pending/error/optimistic states | app-quality / nextjs-data | `../react.md:1772`, `../react.md:19979`, `../react.md:115967`, `../react.md:166875`, `../react.md:168696`, `../react.md:171435` | Focus on boundary validation and observable form states; do not repeat native-label basics. | First batch. |
| P0 | Client server-state synchronization | nextjs-data | `../react.md:7744`, `../react.md:112878`, `../react.md:113115`, `../react.md:118150`, `../react.md:128638` | Query/mutation lifecycle, invalidation, prefetch, retry, and custom-hook boundary. Keep optional; native Next fetching remains canonical default. | First batch. |
| P1 | Render performance and diagnosis | production / app-quality | `../react.md:2878`, `../react.md:79264`, `../react.md:83883`, `../js.md:94975` | Profile symptoms, render identity, memoization trade-offs, loading/code-splitting; avoid performance guarantees. | Ready as second batch. |
| P1 | Authorization and data-layer security | production | `../react.md:131366`, `../react.md:132097`, `../react.md:134102`, `../react.md:166875` | Authn vs authz, server boundary, ownership checks, RLS/CSRF caveats. Supabase examples require vendor-neutral rewrite. | Needs official-source rewrite. |
| P1 | Production error recovery and streaming | nextjs-foundations / production | `../react.md:139032`, `../react.md:153279`, `../react.md:154944`, `../react.md:155287` | Error boundaries, `loading.tsx`, not-found, recovery and observability. Current route lesson covers basics; add failure-flow practice. | Ready as focused challenge, not overview lesson. |
| P2 | Redux and React Router | state-behavior / nextjs-foundations | `../react.md:4796`, `../react.md:5751`, `../react.md:6155`, `../react.md:8997` | Optional ecosystem comparison only. | Implemented as source-backed ownership comparison; canonical app uses Next App Router + Zustand. |
| P2 | TypeScript for React developers | foundations | TypeScript Handbook narrowing/everyday-types/generics plus React TypeScript guide | Inference, narrowing, unions, generics, props/events, API types, runtime validation distinction. | Implemented as a focused boundary module; deeper schema/form typing remains follow-up. |
| P2 | DOM/OOP/large vanilla-JS project | foundations | `../js.md:1857`, `../js.md:5317`, `../js.md:5323`, `../js.md:132684` | Useful optional bridge for beginners; not needed for current React route graph. | Defer. |

## First implementation batch

Implement in this order:

1. `forms-validation-states` — form submission as a trust boundary; native constraints, runtime validation, pending/error/empty/success states, Server Action input handling, `useFormStatus`, and optimistic rollback. Prerequisites: `deep-dive-app-quality`, `server-data-fetching`.
2. `client-server-state` — query keys, stale/fresh state, mutations, invalidation, prefetch, retries, and when not to add a client cache. Prerequisites: `deep-dive-nextjs-data`; mark TanStack Query as optional and versioned.
3. `browser-failure-debugging` — event propagation/delegation, fetch failure paths, abort/race diagnosis, and breakpoint-driven debugging. Prerequisites: `async-js-promises`; bridge to React only after browser primitives.

### Challenge candidates for batch 1

| Level | Candidate | Observable acceptance | Source basis |
| --- | --- | --- | --- |
| 3 | Repair a validated form action | Reject malformed/untrusted input; show field and pending states; preserve accessible labels; no success state on failure. | React forms, form validation, Server Actions sections. |
| 5 | Choose the state owner for a remote list | Explain URL vs local UI vs server cache; choose query cache only when client synchronization requires it; name invalidation path. | React Query section; current architecture lesson. |
| 4 | Debug stale search results | Identify event/request order, abort or ignore obsolete response, and expose loading/error recovery. | JS promises/event loop/fetch plus existing race-condition challenge. |

Do not reuse existing slugs `build-todo-list`, `debug-race-condition`, `production-stale-cache-failure`, or `capstone-build-portfolio`; new records must target distinct acceptance criteria.

## Pedagogy and prompt-source notes

- `p1.md` and `p2.md` specify tutor configuration, Socratic interaction, active learning, and continuity prompts. Use as interaction guidance only; do not import emoji/configuration requirements into content records.
- `p3.md` proposes adaptive paths, multimedia, recommendations, and gamification. Treat as product ideation, not evidence for technical claims.
- `p4.md` gives the strongest reusable teaching loop: clarify → probe → hypothesize → synthesize; map this to prediction, feedback, and reflection fields already supported by the app.
- `p5.md` supplies adaptive-learning requirements: prerequisite graph, mastery, retrieval/spaced review, confidence, intervention, accessibility, privacy, and durable-learning metrics. It supports design decisions, not framework facts.
- `p6.md` supports a codebase-first course format: user journey → actors → data flow → external boundary → reusable patterns → failure diagnosis. Reuse for future project-based modules; exact snippets must come from the real repo.

## Duplication, conflict, and trust notes

1. The transcript repeats topics already bridged from `learn-react`; preserve one canonical lesson identity and add variants/challenges instead of copied modules.
2. React Query material explicitly references v4 (`../react.md:113364`). Any TanStack Query record must use current official docs and state the installed/target version; no dependency should be added by source intake.
3. Supabase/Auth.js sections are vendor- and course-project-specific. Convert them to vendor-neutral concepts or label the provider as an example; verify all auth, RLS, cookie, CSRF, and Server Action claims against primary sources.
4. Next.js transcript caching, Server Actions, loading, and revalidation behavior is version-sensitive. The app is pinned to Next.js 15.5.20; retain the current version/context conflict notes in `08-content-trust-audit.md`.
5. `p1.md`–`p6.md` contain prompt/design prescriptions, not authoritative technical sources. They cannot satisfy source metadata for published curriculum records.
6. TypeScript was underrepresented in the supplied transcripts. The current focused module uses direct TypeScript Handbook and React sources; deeper schema/form typing still needs its own source review.

## Gate for curriculum-content member

The first batch is implementation-ready only when each record has: stable ID, family, level, prerequisites, objectives, prediction/check, transfer task, mastery criteria, direct official sources, framework/version context, `lastVerifiedAt`, and no duplicate identity. Keep the implementation to content files/tests; no app-shell or learning-engine changes.

## Publication receipt (2026-07-15)

- Published the P0 forms/validation, browser-failure, and client/server-state records plus P1 performance-diagnosis, authorization-boundary, TypeScript, testing, and production-readiness records as nine sourced lessons, nine challenges, sixteen QA items, and nine practices.
- Added the schema/form boundary slice with Zod parsing, structured field-error recovery, a level-5 design challenge, one Q&A item, one practice, and direct Next.js 15/React/Zod sources. React Hook Form remains a comparison target until it is needed by the runtime or a source-backed lesson contract.
- Published URL-state as an additional focused Next.js data-state lesson, challenge, QA item, and practice.
- Every new record is reachable through the existing exports, middleware route identity, canonical challenge ownership map, and direct source metadata.
- TanStack Query/client-server synchronization, performance diagnosis, authorization ownership, TypeScript foundations, testing boundaries, production readiness, and ecosystem tool ownership are implemented as optional, source-backed modules. Redux Toolkit and React Router are comparison material only; no runtime dependency was added.
- Canonical catalog v1 now projects explicit title/topic/tags/schema fields; every published record also has a claim-backed direct source.
- Canonical catalog v1 now has explicit topic-family ownership for all QA/practice exports and diagrams, chunks, and rubrics for all lessons; raw source arrays normalize into required route-facing contracts.
