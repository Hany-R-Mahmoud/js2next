# Next Goal: Curriculum Expansion and Whole-App Design System

- Goal date: 2026-07-15.
- Canonical workspace: `/Users/hanyramadan/new era/projects/learn-next`.
- Product target: one trustworthy React + Next.js learning platform for practical frontend work, interviews, debugging, architecture, and production decisions.
- Working rule: add source-backed learning value and observable learner behavior; do not add speculative runtime dependencies or duplicate the two app shells.

## Current baseline

- 31 lessons, 31 challenges, 44 Q&A items, and 22 best-practice cards are reachable through the canonical app.
- All lessons have a diagram, persisted retrieval checkpoint, and rubric-backed mini-project.
- The first source-intake batch is implemented: forms/validation, browser failure debugging, URL state, client/server state, performance diagnosis, authorization, TypeScript boundaries, testing, production readiness, and ecosystem ownership comparisons.
- The first schema/form boundary slice is now implemented with Zod parsing guidance; React Hook Form remains a later comparison target rather than an unneeded runtime dependency.
- Claim coverage, direct-source validation, pinned Next.js 15.5.20 review, typecheck, lint, tests, source verification, build, and production smoke pass.
- Adaptive events now retain a bounded local trail for completed lessons and challenge attempts; the derived queue prioritizes due review, low confidence, and weak mastery with explicit reasons.
- A token-driven primitive showcase is now reachable at `/design-system`; the shared shell uses inline SVG navigation icons, and source/code/motion primitives have responsive fixes for narrow widths.
- Daily packages are deterministic and dashboard-visible, but intentionally not persisted or scheduled.

## New targets to add

### 1. Source-backed curriculum expansion

- Expand the curriculum categories in dependency order:
  - JavaScript/browser foundations.
  - TypeScript for React developers.
  - React mental models and state behavior.
  - Forms, schemas, validation, and async UI states.
  - Next.js App Router and server/client boundaries.
  - URL state, native data fetching, and optional TanStack Query.
  - Testing, accessibility, performance, auth/security, and deployment.
  - Architecture, code review, debugging incidents, and interview transfer.
- Add the remaining focused source modules instead of duplicating existing overviews:
  - React Hook Form and Zod boundary comparison.
  - Deeper schema/form typing with runtime-versus-compile-time failure cases.
  - Error recovery, streaming, loading, not-found, and observability scenarios.
  - Optimistic UI rollback and mutation failure practice.
  - More browser/network diagnosis and production incident variants.
- Every new record must include objectives, prerequisites, prediction, transfer task, mastery criteria, direct official sources, version context, verification date, and conflict notes.

### 2. Adaptive learning loop

- Record meaningful local learning events, not only completion:
  - Start, prediction, confidence, hint, reveal, challenge attempt, reflection, and review completion.
- Add confidence/correctness interventions:
  - Correct + low confidence → near review.
  - Wrong + high confidence → misconception explanation and variant.
  - Correct + high confidence → longer interval and transfer task.
- Add a visible review queue with due, overdue, snoozed, and mastered states.
- Keep recommendation reasons deterministic and explainable.
- Extend daily packages to 15-, 30-, and 60-minute modes only after the package contract is stable.
- Defer persistence, reminders, scheduling, and cross-device sync until cadence, timezone, privacy, and ownership requirements are explicitly chosen.

### 3. Challenge ladder depth

- Keep deterministic evaluation as the default and add multiple variants per level:
  - Familiar context.
  - Novel context.
  - Interview/work context.
- Cover trace, predict, build, debug, state ownership, integration, accessibility/performance review, architecture defense, production incident, and capstone review.
- Add rubric dimensions for correctness, constraints, accessibility, performance reasoning, maintainability, and communication.
- Extend the challenge contract only when the visible evaluator and feedback surface can consume the new fields.
- Do not execute arbitrary learner code in the main app process; sandboxing requires a separate security design.

### 4. Whole-app design-system rollout

- Make `DESIGN.md` executable through a small primitive showcase route before another major shell redesign.
- Audit and normalize dashboard, curriculum, lesson reader, challenge workspace, Q&A, practices, progress, and settings against the same tokens and component states.
- Verify mobile and desktop behavior at 320, 375, 768, 1024, and 1280px.
- Preserve the warm light default, readable code, visible focus, keyboard flows, reduced motion, drawer focus behavior, source attribution, loading, empty, error, locked, completed, and saved states.
- Improve desktop layouts only where wider space improves hierarchy; do not create separate mobile and desktop interaction models.
- Treat dark mode as a deliberate follow-up requiring contrast and state coverage, not an automatic system preference.

### 5. Trust, verification, and release gates

- Keep every published claim tied to a direct source and pinned framework/library context.
- Re-open version review whenever React, Next.js, TanStack Query, TypeScript, or another directly taught library changes.
- Add focused tests for each new evaluator, recommendation rule, schema contract, and content route.
- Keep live source verification, typecheck, lint, full tests, production build, and browser QA as release gates.
- Add accessibility and reduced-motion checks to the browser matrix before calling UI consolidation complete.

## Explicitly deferred

- Authentication, privacy-aware sync, analytics, Sentry, Storybook, MSW runtime integration, and arbitrary code execution are curriculum topics or later product phases, not automatic dependencies.
- Tailwind alternatives, styled-components, Supabase, and a second router remain optional comparison material unless a concrete product boundary requires them.
- Sibling `learn-react` lint cleanup is maintenance only and does not change the canonical app.

## Execution order

1. Add the next source-backed forms/schema and error-recovery content with focused tests. (Completed for the first schema/form slice.)
2. Add event/confidence/review-queue seams without breaking the canonical learner profile. (Completed for lesson/challenge events and the derived queue.)
3. Expand challenge variants and evaluator/rubric coverage.
4. Build the primitive showcase and audit shared surfaces at all target widths. (Showcase and shared primitive fixes are implemented; the retained screenshot matrix remains a release-evidence task.)
5. Run trust, accessibility, production, and browser gates; update this goal receipt.

## Definition of done

- New curriculum is reachable, non-duplicated, source-backed, and version-aware.
- Adaptive recommendations explain themselves and respond to confidence plus correctness.
- Challenge variants provide deterministic feedback and visible rubric evidence.
- All canonical routes follow the same responsive/accessibility design system on mobile and desktop.
- Verification gates pass and remaining deferred scope is recorded as a product decision rather than an accidental omission.
