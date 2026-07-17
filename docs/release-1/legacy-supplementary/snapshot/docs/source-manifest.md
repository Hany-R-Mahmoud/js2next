# Expansion source manifest

Inventory owner: `source-intake` (team member A)

## Source register

| ID | Path | Type | Use |
| --- | --- | --- | --- |
| `transcript-js` | `../js.md` | Course transcript, extracted 2026-07-15 | Browser/runtime foundations, async, DOM, debugging, modules. Secondary evidence only. |
| `transcript-react` | `../react.md` | Course transcript, extracted 2026-07-15 | React ecosystem, forms, React Query, auth, performance, Next.js project patterns. Secondary evidence only. |
| `prompt-ranedeer` | `../p1.md` | Tutor prompt | Personalization/lesson-loop inspiration; no technical claims. |
| `prompt-mentor` | `../p2.md` | Tutor prompt | Active/Socratic continuity; no technical claims. |
| `prompt-learnos` | `../p3.md` | Product prompt | Adaptive/multimedia ideation; no technical claims. |
| `prompt-socratic` | `../p4.md` | Teaching protocol | Clarify/probe/hypothetical/synthesis loop. |
| `prompt-adaptive` | `../p5.md` | Learning-design prompt | Mastery, retrieval, confidence, privacy, and intervention design. |
| `prompt-codebase-course` | `../p6.md` | Course-architecture prompt | Codebase-first module and quiz structure. |
| `learn-react-content` | `../learn-react/src/content/` | Existing structured source | Nine topic modules, ten challenges, QA/practice records already bridged into learn-next. |
| `react-course-study-pack` | `/Users/hanyramadan/new era/projects/react_course_study_pack(1).zip` | Secondary study pack | 40-section / 471-lecture React course inventory, concept index, recall cards, transcript gaps, and version-freshness notes used for collision review and gap selection; never technical authority. |

## Prioritized records

| ID | Title | Family | Priority | Source anchors | Planned record shape |
| --- | --- | --- | --- | --- | --- |
| `forms-validation-states` | Forms, validation, and mutation states | `app-quality` → `nextjs-data` | P0 | `transcript-react` 1772, 19979, 115967, 166875, 168696, 171435 | Lesson + level-3 challenge; native form first, runtime validation at boundary, pending/error/optimistic recovery. |
| `client-server-state` | Client/server-state synchronization | `nextjs-data` | P0 | `transcript-react` 7744, 112878, 113115, 118150, 128638 | Optional lesson + level-5 challenge; query/mutation lifecycle and explicit “do not add a cache” trade-off. |
| `browser-failure-debugging` | Browser events, fetch failures, and stale responses | `foundations` → `app-quality` | P0 | `transcript-js` 1857, 4884, 112935, 118333, 24337 | Lesson + level-4 challenge; event flow, abort/ignore, observable diagnosis. |
| `render-performance` | Render performance diagnosis | `production` | P1 | `transcript-react` 2878, 79264, 83883; `transcript-js` 94975 | Focused lesson/challenge; measure first, explain memoization and loading trade-offs. |
| `authorization-boundaries` | Authorization and data-layer security | `production` | P1 | `transcript-react` 131366, 132097, 134102, 166875 | Implemented as vendor-neutral Next.js/OWASP boundary guidance with direct official sources. |

## Existing-content collision map

| Source area | Existing target | Action |
| --- | --- | --- |
| Closures, promises, event loop, immutability | `closures-in-javascript`, `async-js-promises`, `deep-dive-async-immutability` | Reuse as prerequisite; only add browser failure transfer. |
| Components, JSX, state, reducers, context, effects | Core lessons + `deep-dive-react-mental-model` / `deep-dive-state-and-effects` | No duplicate module. |
| App Router, RSC, data/cache, auth/deploy, architecture | Core lessons + five learn-react bridges | Add focused deltas only. |
| React Router, Redux, Tailwind, styled-components, Supabase | Not canonical in current runtime | React Router and Redux Toolkit now appear only in the optional ecosystem comparison; Tailwind, styled-components, and Supabase remain deferred. |

## Publication rules

- Transcript anchors identify candidate material, not final evidence.
- Every published technical claim needs direct official/standard/research provenance, version context where volatile, verification date, support boundary, and conflict note.
- No source family/category fallback URLs.
- Preserve stable content IDs and challenge ownership; do not create duplicate topic identities.
- Do not add dependencies or runtime behavior from this manifest alone.

## Current implementation receipt (2026-07-15)

- Implemented: `forms-validation-states`, `browser-failure-debugging`, and a focused `url-state` delta.
- Implemented: `client-server-state` with optional TanStack Query v5/versioned cache semantics, `render-performance` with React Profiler/memo evidence, `authorization-boundaries` with Next.js/OWASP ownership guidance, TypeScript React-boundary foundations, testing user behavior, production readiness, and a deterministic daily package selector surfaced on the dashboard.
- Implemented: optional Redux Toolkit/React Router ownership comparison with direct sources; no runtime dependency was added.
- Implemented: runtime schema boundary slice with Zod 4 parsing guidance, a form/server-boundary challenge, Q&A, best practice, lesson retrieval checkpoint, and direct Zod/Next.js/React sources; no Zod runtime dependency was added to this static-learning app.
- Source intake remains additive: transcript anchors guide selection, while direct MDN, React, Next.js, and WAI sources are the published evidence.
