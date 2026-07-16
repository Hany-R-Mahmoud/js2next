# Learn Next Assessment

## Verdict

- Status: strong content-first prototype; incomplete learning product.
- Estimated completeness: `65/100` against the requested platform vision.
- Best use in merge: content corpus, challenge scenarios, Q&A library, best-practice framing, and warm visual language.
- Do not use as the merge base until challenge state and assessment quality are repaired.

## What exists

- Content:
  - 11 lessons from JavaScript closures and async work through React state, RSC, data fetching, deployment, and architecture.
  - 9 topic families in `src/data/curriculum.ts`.
  - 10 challenge levels from tracing to capstone architecture.
  - 12 Q&A entries.
  - 8 best-practice cards with rationale, trade-offs, applicability, and source links.
- Learning surfaces:
  - Diagnostic onboarding.
  - Dashboard.
  - Curriculum grouped by topic family.
  - Section-based lesson reader.
  - Challenge list and challenge detail.
  - Q&A search.
  - Best practices.
  - Progress.
  - Settings with export, reset, accessibility, and pacing controls.
- State:
  - Zustand with persistence.
  - Profile, diagnostic answers, mastery, streak, review queue, and settings model already exist.
- Runtime:
  - `npm run build` passes.
  - Static and dynamic routes compile and render.

## Strong points

- Content is unusually practical for a generated starter:
  - Stale closures.
  - Race conditions.
  - State placement.
  - RSC boundaries.
  - Server data fetching.
  - Performance investigation.
  - Auth architecture.
  - Deployment and architecture decisions.
- Lesson prose includes:
  - Why the topic matters.
  - Mental model.
  - Code example.
  - Common mistakes.
  - Best practices.
  - Retrieval prompt.
  - Reflection prompt.
  - Mastery criteria.
- Challenge ladder has a useful progression:
  - Recognition.
  - Component implementation.
  - Requirements-based building.
  - Debugging.
  - Trade-off selection.
  - Integration.
  - Performance.
  - Architecture.
  - Failure investigation.
  - Capstone.
- Best-practice cards avoid absolute rules by including “when not” guidance.
- Local-first persistence is a good privacy-preserving prototype choice.
- UI is readable and compact:
  - Clear sidebar navigation.
  - Warm paper palette.
  - Strong visual hierarchy.
  - Basic focus styling.
  - Reduced-motion and high-contrast settings exist.

## Gaps and risks

- Challenge evaluation is the largest product gap:
  - `src/app/challenge/[slug]/page.tsx` records a text submission only in local component state.
  - It does not call the learner store.
  - It does not calculate correctness.
  - It does not create mastery or review data.
  - Reloading the page loses the submission, hints, and reveal state.
  - “Submitted” means “text accepted,” not “skill demonstrated.”
- Diagnostic bug risk:
  - `src/app/page.tsx` calculates the final level from `levelScores` immediately after setting the last score.
  - React state updates are asynchronous, so the last answer can be omitted from level selection.
  - Fix by deriving the next score object locally before calculating the level.
- Curriculum lock semantics are mostly visual:
  - Lessons show prerequisite counts.
  - The page does not enforce prerequisite mastery before opening a lesson.
  - This conflicts with the product language that topics unlock as the learner progresses.
- Lesson progress is not durable until completion:
  - Section position and answer state are local to the page.
  - Closing or refreshing mid-lesson loses the current position.
- Diagram support is weak:
  - The lesson type includes diagram sections.
  - The page renders a text placeholder rather than a real diagram component.
- Personalization is shallow:
  - Profile stores style, communication style, pace, strengths, weaknesses, and confidence.
  - Lesson content does not materially change by those preferences.
- Mastery math is simpler than `learn-react`:
  - Fixed score threshold.
  - Fixed one-day review interval after lesson completion.
  - No confidence-aware update path for lesson questions.
- Tooling gaps:
  - No test files.
  - No `typecheck` script.
  - `next lint` is deprecated and interactive with the current dependency state.
  - No E2E or accessibility automation.
- Naming drift:
  - App brand says “Learn React” while the project is `learn-next` and the stated target is React + Next.js.
- Content risks to verify before publication:
  - Version-sensitive Next.js caching statements.
  - Broad performance claims such as bundle-size thresholds.
  - Auth examples that should not imply localStorage token storage is safe.

## Scorecard

- Content breadth and depth: `26/30`.
  - Strong breadth; only 11 lessons for a long-term platform.
- Learning interaction and adaptation: `17/25`.
  - Good lesson flow and prompts; limited real adaptation and no durable mid-lesson state.
- Challenge evaluation and feedback: `4/15`.
  - Rich challenge metadata, weak execution and scoring.
- Persistence and mastery: `10/15`.
  - Good store foundation; challenge progress and nuanced review are missing.
- Engineering quality and verification: `5/10`.
  - Build passes; tests and typecheck gate are absent.
- UI, accessibility, and navigation: `3/5`.
  - Solid desktop baseline; more semantic and responsive QA needed.

## Keep, repair, replace

- Keep:
  - `src/data/lessons.ts` content after source/version review.
  - `src/data/challenges.ts` scenarios and level progression.
  - `src/data/qa.ts` and `src/data/best-practices.ts` as seed corpus.
  - Topic-family taxonomy.
  - Warm paper/teal/coral visual tokens.
- Repair:
  - Diagnostic level calculation.
  - Challenge persistence and scoring.
  - Prerequisite enforcement.
  - Diagram renderer.
  - Mid-lesson save state.
  - Lint/typecheck scripts.
- Replace during merge:
  - Local challenge-only state with the normalized learner profile engine from `learn-react`.
  - Lesson reader internals with the phase/chunk engine from `learn-react`, while retaining the richer lesson prose.
