# Learn React Assessment

## Verdict

- Status: best current product foundation; incomplete as a full curriculum and production learning service.
- Estimated completeness: `84/100` against the current prototype scope; `78/100` against the full platform vision.
- Best use in merge: app shell, lesson engine, challenge engine, learner profile, mastery algorithm, review queue, tests, and accessibility baseline.

## What exists

- Content:
  - 9 deep modules covering JavaScript foundations, React mental model, state/effects, app quality, Next.js foundations, RSC, Next.js data, production, and architecture.
  - 10 challenges with levels 1–10.
  - 13 Q&A entries.
  - 6 best-practice cards.
- Learning engine:
  - Onboarding with name, goal, prior knowledge, level, and learning preferences.
  - Curriculum prerequisite path and main path.
  - Topic lock states: locked, available, in progress, review, mastered.
  - Lesson phases:
    - Outline.
    - Diagnostic.
    - Teach.
    - Depth.
    - Complete.
  - Prediction checks, hints, answer reveal, alternate explanation, glossary, diagrams, mini-projects, retrieval, reflection, and challenge follow-up.
  - Confidence slider used in mastery updates.
- Challenge engine:
  - Choice.
  - Multi-choice.
  - Code-contains.
  - Free-text keyword scoring.
  - Attempt, hint, reveal, confidence, pass, and answer persistence.
- Learner state:
  - Local profile persistence.
  - Mastery estimates from correctness and confidence.
  - Review schedule.
  - Mistake/reflection log.
  - Streak.
  - Export/import/reset.
- Verification:
  - `npm run build` passes.
  - `npm run typecheck` passes.
  - `npm test` passes: 4 files, 14 tests.

## Strong points

- Strongest learning loop of the two projects:
  - The learner must answer before receiving the next explanation.
  - Confidence separates guessing from knowing.
  - Wrong answers schedule review.
  - Hints and reveals reduce mastery gain.
  - Reflection becomes part of the learner record.
- Content is structured for reuse:
  - Topic metadata is separate from rendering.
  - Each topic has objectives, examples, diagrams, common mistakes, practices, sources, mini-project, retrieval prompt, reflection prompt, diagnostic, and chunks.
- Curriculum locking is actually implemented through `prereqsMet` and `topicMasteryState`.
- `ChallengeWorkspace` evaluates submitted answers and updates mastery.
- Accessibility foundation is better:
  - Skip link.
  - Semantic navigation labels.
  - Native form controls.
  - Visible focus styling.
  - Reduced-motion handling.
  - Responsive mobile navigation.
- UI is more coherent:
  - Consistent ReactPath identity.
  - Clear header navigation.
  - Responsive mobile nav.
  - Reusable card, button, chip, code, and progress styles.
- Tests cover the most important pure logic:
  - Mastery.
  - Recommendations.
  - Learner flow.
  - Content schema.

## Gaps and risks

- No actual code execution:
  - Code challenges use text or keyword checks.
  - A learner can pass a `code-contains` challenge without code compiling or meeting runtime behavior.
  - A secure sandbox or repository-based exercise runner is a later milestone, not a first merge requirement.
- Curriculum is deep but still small:
  - 9 modules are a good spine, not a complete React/Next.js career curriculum.
  - Forms, TypeScript, networking, browser APIs, testing practice, and tool ecosystems need more depth.
- QA library is too small for the stated interview/work goal:
  - 13 entries cannot cover common daily-work and interview situations.
  - More Q&A should be generated from recurring mistakes and challenge follow-ups.
- Best-practice library is only 6 cards.
- No backend:
  - No account sync.
  - No cross-device progress.
  - No content version migration service.
  - No analytics or instructor/admin tooling.
- No authenticated learner model.
- Settings language field is structural only:
  - Spanish is disabled.
  - No localized content exists.
- Content validation is structural, not factual:
  - Schema tests catch shape errors.
  - They do not verify source freshness, contradictions, or version-specific framework claims.
- Lint command is not a clean source gate:
  - `eslint .` includes generated `.next` files and related generated artifacts.
  - The current sibling run reports 281 errors and 1,586 warnings.
  - Source lint should exclude generated output before it is treated as a release gate.
- UI behavior needs ordinary-browser confirmation:
  - Headless CLI semantic click commands did not always transition buttons, while DOM clicks did.
  - No browser console errors appeared.

## Scorecard

- Content breadth and depth: `24/30`.
  - Deep schemas and lessons; fewer topics and practices than `learn-next`.
- Learning interaction and adaptation: `23/25`.
  - Best of the two; adaptive behavior still mostly rule-based.
- Challenge evaluation and feedback: `12/15`.
  - Real local scoring and mastery updates; no runtime execution.
- Persistence and mastery: `14/15`.
  - Strong local learner model; no account sync or migrations.
- Engineering quality and verification: `9/10`.
  - Build, typecheck, and tests pass; lint configuration needs repair.
- UI, accessibility, and navigation: `4/5`.
  - Strong baseline; needs visual QA across themes, screen sizes, and longer lessons.

## Keep, repair, extend

- Keep:
  - `src/lib/mastery.ts`.
  - `src/lib/profile.ts`.
  - `src/lib/recommendations.ts`.
  - `src/components/LessonReader.tsx`.
  - `src/components/ChallengeWorkspace.tsx`.
  - `src/content/modules.ts` schema and phase model.
  - Tests and local export/import flow.
- Repair:
  - ESLint ignore/configuration for generated output.
  - Source freshness and factual review process.
  - More explicit empty/loading/error states.
- Extend:
  - Import `learn-next` content into the `Topic` schema.
  - Add missing library curriculum.
  - Add E2E and accessibility tests.
  - Add optional backend sync after local-first behavior is stable.
