# React Course Study Pack Curriculum Receipt

- Audit date: 2026-07-15.
- Input: `/Users/hanyramadan/new era/projects/react_course_study_pack(1).zip`.
- Role: secondary study evidence. React, Next.js, MDN, WAI, OWASP, and library documentation remain technical authority.
- Policy: all published wording is original; transcript text is not copied into route-facing content.

## ZIP inventory

The package validation report records:

| Metric | Receipt |
| --- | ---: |
| Reconstructed sections | 40 |
| Lecture headings | 471 |
| Transcript-backed lectures | 462 |
| Transcript gaps | 9 |
| Concept categories | 33 |
| Recall cards | 471 |
| Retained transcript words | 651,331 |
| Source body lines | 177,947 |

The nine transcript gaps are resource or version-context lectures: `Read Before You Start!`, `Useful Resources for Part 1`, `Useful Resources for Part 2`, `Useful Resources for Part 3`, `Useful Resources for Part 4`, `Make Sure to Use React Query v4!`, `Useful Resources for Part 5`, `Download Fresh Starter Files + Slides!`, and `Frequent Next.js Updates + Documentation`.

Version warnings were retained as review constraints: Create React App is deprecated for new apps; Node 18 is EOL; the pack teaches React Router 6, React Query v4, Tailwind v3, older Next.js conventions, and an earlier Auth.js/NextAuth generation. Supabase setup and manual memoization also need current-doc checks. These warnings block blind transcript-to-runtime copying.

## Coverage and collision matrix

| ZIP topic family | Canonical status | Decision |
| --- | --- | --- |
| Components, props, JSX, state, events, forms | Existing core lessons and form boundary | Keep/revise through existing records; no duplicate beginner module. |
| Effects, data fetching, custom hooks, refs, reducers, context | Existing core/deep-dive lessons | Keep; use ZIP as gap evidence only. |
| React Router and Redux Toolkit | Existing optional ecosystem comparison | Keep as comparison; no runtime dependency or competing router. |
| React Query / TanStack Query | Existing optional server-state lesson | Revise with current TanStack Query v5 sources; do not import pack’s v4 contract. |
| Optimistic mutations | New focused lesson/challenge/QA/practice | Implemented as `expansion-optimistic-mutations`. |
| App Router errors, not-found, loading, streaming | Existing overview plus missing failure-flow transfer | Implemented as challenge, QA, and practice attached to `app-router-and-layouts`. |
| Authentication and session races | Existing auth architecture plus narrow race gap | Implemented as challenge/QA attached to server authorization ownership. |
| Production observability and incident response | Existing release checklist lacked actionable triage | Implemented as lesson/challenge/QA/practice. |
| Tailwind CSS, Styled Components, Supabase | Optional project/tool material, no product runtime need | Defer; no dependency or vendor-specific runtime surface. |
| Legacy Next.js Pages Router | Explicit optional legacy section | Defer; App Router is canonical and migration comparison is enough for now. |
| Class-based React and vanilla setup/project walkthroughs | Historical or setup-oriented material | Defer; no current route-facing gap. |

## Implemented revisions

- Added `expansion-instrumentation-incident-triage`: original lesson with version context, retrieval, transfer rubric, and Next.js 15 instrumentation/OpenTelemetry/production sources.
- Added `expansion-design-route-recovery`: challenge-first failure matrix for `notFound`, expected failures, `error.tsx`/`reset`, `loading.tsx`, and nested `Suspense`.
- Added `expansion-triage-instrumentation-incident`: production incident challenge with safe telemetry and rollback acceptance.
- Added `expansion-design-session-refresh-race`: bounded single-flight, stale-result, retry, logout, and server-authority challenge; no auth runtime code added.
- Added four Q&A records and two practices for route recovery, instrumentation, and refresh races.
- Added identity mappings, catalog contract coverage, and nine direct-source claim records.
- Added ZIP provenance to [`source-manifest.md`](../curriculum/source-manifest.md).

## Deferred scope

- Tailwind, Styled Components, Supabase, and Pages Router remain deferred because current runtime has no product boundary requiring those dependencies or vendor integrations.
- React Hook Form remains deferred; native forms plus runtime-boundary guidance cover current scope.
- Full transcript/recall-card import remains deferred; it would duplicate canonical lessons and create a second content authority.

## Verification receipt

- Focused content/identity/catalog/claim tests: 5 files passed; 17 tests passed.
- Full tests: 19 files passed, 1 skipped; 52 tests passed, 1 skipped.
- Source-link validation: 1 test passed.
- Typecheck: passed.
- Lint: passed with no warnings.
- Build: passed on Next.js 15.5.20; 12 routes generated. Webpack emitted only its non-blocking large-string cache warning.
- Browser smoke: instrumentation, route-recovery, and session-refresh challenge routes rendered with expected headings and no console errors; the new lesson route resolved to its prerequisite lock state with no console errors; an unknown challenge returned the expected 404 page.
