# Content trust audit

- Audit date: 2026-07-15.

## Purpose

- Establish a factual and provenance gate for the merged React + Next.js curriculum.
- Keep framework-version differences explicit.
- Prevent generated fallback links from presenting a broad topic page as evidence for a specific claim.
- Give both humans and agents a short, repeatable review contract.

## Current gate result

- Status: `pinned-runtime gate complete; upgrade-triggered maintenance remains`.
- Structural provenance: `pass` for the current published catalog projection.
- Claim-level support: `pass for catalog coverage`; 136 volatile claims now have executable structural checks across lessons, challenges, QA, and practices, with every published catalog record covered at least once.
- Live-link resolution: `pass` for the current unique catalog and claim URL set on 2026-07-15; enforced by `.github/workflows/quality.yml`.
- Framework-conflict audit: `in progress`.

## What changed in the current slice

- Added typed identity keys for lessons, challenges, QA items, and practices.
- Mapped every challenge to an owning lesson slug; a challenge is not allowed to create a second topic identity.
- Added a canonical catalog projection in `src/lib/content/catalog.ts`.
- Removed family/category fallback source URLs from the inventory path.
- Added explicit source links for the previously unlinked challenge and QA records.
- Added a claim-level ledger for JavaScript closures, Promise/microtask scheduling, React snapshots/updaters/memoization/Strict Mode/hydration/forms/state/effect cleanup, RSC boundaries, WCAG, Next.js routing/server components/data fetching/revalidation/auth/secret handling/production targets, OWASP session/CSRF/browser-storage controls, and async race conditions.
- Added `npm run verify:sources`, a live HTTP check for every unique catalog and claim URL.
- Fixed stale Next.js performance URLs discovered by the live check and pointed them to the current production checklist.
- Added visible source type, verification date, framework version, and direct links to lesson, challenge, Q&A, and practice surfaces.
- Added a repository CI workflow that runs the live source gate alongside the normal quality commands.
- Added structural tests for unique identities, source presence, valid HTTP provenance, and challenge ownership.
- Added canonical content schema v1 checks for version, title, tags, non-empty topic ownership, and explicit expansion QA/practice ownership.
- Added applied-learning extension coverage for diagrams, retrieval chunks, and mini-project rubrics in the testing and production modules.
- Corrected SSR-safe browser-storage guidance, server-action validation/authorization examples, client/server sorting boundaries, cache invalidation wording, layout persistence wording, JSX execution language, and accessibility contrast thresholds.
- Added direct provenance for TanStack Query, BroadcastChannel, `fetch()`, React `createElement`, the Next.js project structure guide, and the React Server/Client boundary.
- Added direct provenance for the three imported sibling practice cards: explicit cache intent, semantic HTML before ARIA, and server-side authorization.
- Added direct MDN-backed claims for event bubbling, fetch HTTP-status handling, AbortController cancellation, and obsolete-response authority.
- Added direct TanStack Query v5-backed claims for query-key identity, mutation invalidation, server-state scope, and cache ownership.
- Added direct React/Next.js-backed claims for Profiler evidence, memo/useMemo boundaries, and production-like performance measurement.
- Added direct Next.js/OWASP-backed claims for server authorization, ownership enforcement, and authentication/authorization separation.
- Added direct TypeScript Handbook-backed claims for runtime narrowing, union UI states, and assertion boundaries.
- Added direct Testing Library-backed claims for behavior contracts, accessible queries, test-layer boundaries, and implementation-detail avoidance.
- Added direct Next.js-backed claims for production build checks, self-hosting runtime requirements, configuration exposure, and release recovery evidence.
- Added an optional ecosystem comparison with direct Next.js App Router, Redux Toolkit, and React Router sources; the comparison records ownership and trade-offs without adding runtime dependencies.
- Expanded the claim ledger across all published lesson, challenge, QA, and practice identities; the strict coverage test now rejects any uncovered catalog record.

## Factual corrections recorded

- JavaScript closures and React render snapshots are different ideas:
  - A JavaScript closure retains access to lexical bindings.
  - A React render produces a snapshot of state values for that render.
  - A functional state updater fixes a state transition based on prior state, but it does not make an old timeout or promise callback read the newest render value. A ref or an explicit synchronization strategy is required when the latest value is needed.
- Next.js cache invalidation is model-sensitive:
  - The app is pinned to Next.js `15.5.20` and does not enable the newer Cache Components configuration.
  - Current Next.js documentation describes `revalidateTag`, `updateTag`, and `revalidatePath` with different timing and invocation semantics. Curriculum claims must name the cache model and operation rather than use a universal “immediate” or “eventual” statement.
- Authentication guidance must keep authorization at server boundaries; a redirect or middleware check alone is not the complete authorization policy.

## Direct references used for this audit

- [React state as a snapshot](https://react.dev/learn/state-as-a-snapshot).
- [React updating state based on previous state](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state).
- [React synchronizing with effects](https://react.dev/learn/synchronizing-with-effects).
- [Next.js 15 caching and revalidation](https://nextjs.org/docs/15/app/guides/caching).
- [Next.js caching without Cache Components](https://nextjs.org/docs/app/guides/caching-without-cache-components).
- [Next.js authentication and authorization](https://nextjs.org/docs/app/guides/authentication).
- [React `use client` boundary](https://react.dev/reference/rsc/use-client).
- [React `createElement`](https://react.dev/reference/react/createElement).
- [React `cache`](https://react.dev/reference/react/cache).
- [MDN `fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch).
- [MDN `BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel).
- [TanStack Query React overview](https://tanstack.com/query/latest/docs/framework/react/overview).
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).
- [OWASP Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
- [OWASP HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html).

## Required record for each volatile claim

- `claimId`: stable identifier for the statement.
- `contentId`: lesson, challenge, QA, or practice identity.
- `claim`: the smallest factual statement being taught.
- `sourceUrl`: direct primary source, standard, or research source.
- `sourceType`: `official`, `standard`, or `research`; community sources require a second confirmation.
- `frameworkVersion`: React/Next.js version or cache model when behavior can change.
- `lastVerifiedAt`: date of the review.
- `supports`: what the source actually supports.
- `conflicts`: competing behavior or version-specific caveat.
- `confidence`: `high`, `medium`, or `needs-review`.

## Review receipt — 2026-07-15

- Closed the version-sensitive queue for the pinned Next.js `15.5.20` runtime.
- Revalidation claims now use the versioned Next.js 15 caching guide, with separate wording for cache invalidation, invocation context, and client Router Cache effects.
- Image claims now use the versioned Next.js 15 Image reference; environment-variable claims use the versioned Next.js 15 environment guide.
- Production-measurement and runtime-configuration claims now use the versioned Next.js 15 production checklist.
- URL-state claims now use the versioned Next.js 15 linking and navigating guide.
- Three claims remain deliberately cautious (`medium` confidence): targeted cache invalidation as curriculum guidance, production measurement evidence, and cross-framework performance measurement. None is a framework guarantee.
- The executable claim test now fails if a `needs-review` claim is reintroduced or if a Next.js 15.5.20 claim points at an unversioned Next.js guide.

## Ongoing maintenance queue

- Keep the source metadata projection and the claim ledger aligned; every published content identity now has at least one claim record, while individual source/statement granularity can still improve.
- Expand the 136-claim ledger across additional volatile statements within already-covered records.
- Review the multiple claims inside the 31 lessons, 31 challenges, 44 Q&A items, and 22 practice cards; record conflicts and version boundaries even when a record already has one claim.
- Re-open a version review when upgrading Next.js, React, or a directly referenced ecosystem library; the current pinned-version review is closed.
- Review bridge content for duplicated explanations and conflicting terminology before removing the source schemas.

## Findings from the latest challenge review

- Resolved: `StrictMode` and Effect cleanup claims now say “development with Strict Mode enabled”; they are not production behavior.
- Resolved: the event-loop lesson uses host-specific “task” language; Promise reactions are microtasks, and browser/Node scheduling is not conflated.
- Resolved: Server Component teaching distinguishes async Server Components from Client Components’ initial server render and hydration.
- Next.js cache and Server Action examples are pinned to Next.js `15.5.20`; versioned Next.js 15 documentation was checked for the current ledger. Any migration to newer semantics needs a separate versioned curriculum update.
- Remaining security review is narrower: refresh-token rotation/race behavior and cross-tab synchronization still need an explicit implementation contract; the session, CSRF, and browser-storage claims now have OWASP support.
- Resolved: performance budgets, Lighthouse thresholds, virtualization gains, and “60fps” outcomes are labeled as measured targets or acceptance criteria, not framework guarantees.
- Resolved: accessibility guidance cites WCAG for contrast and distinguishes 4.5:1 normal text, 3:1 large text, and non-text contrast; WAI-ARIA APG remains a separate interaction reference.
- Resolved in the current pass: SSR-safe `localStorage`, validated Server Action inputs, server authorization, data-prop sorting across the RSC boundary, and layout/JSX execution wording.

## Agent handoff rules

- Do not add a technical claim without a direct source or an explicit `needs-review` marker.
- Do not infer framework behavior from a source for a different major/minor model without recording the mismatch.
- Do not repair a missing source by pointing to a family/category landing page.
- Do not mark the unified curriculum complete until the remaining product decision is recorded and the executable checks pass. Re-open this review when a framework or library version changes.
