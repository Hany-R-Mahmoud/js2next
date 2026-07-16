# Improvement Roadmap

## P0: make current product truthful and reliable

- Completed in the unified foundation: diagnostic level calculation includes the final answer.
- Completed in the unified foundation: challenge progress is part of the canonical learner profile and typed answers update mastery.
- Completed in the unified foundation: lesson position, answers, attempts, hints, reveals, predictions, practice notes, and reflections persist.
- Completed in the unified foundation: prerequisite locks apply to curriculum links and direct lesson routes.
- Completed in the unified foundation: diagrams use an accessible semantic renderer.
- Completed in the unified foundation: `typecheck`, configured ESLint, unit tests, source verification, and production build are repository gates.
- Still open: exclude generated output from the sibling `learn-react` lint configuration if that project remains independently maintained.
- Completed in the unified foundation: duplicate content keys, direct-source metadata, verification dates, and framework-version metadata are structurally checked for the published catalog.

## P1: make learning adaptive

- Model learning events:
  - Lesson started.
  - Diagnostic answered.
  - Prediction answered.
  - Hint requested.
  - Answer revealed.
  - Challenge passed.
  - Reflection saved.
  - Review completed.
- Drive recommendations from events, not only completion percentages.
- Use confidence plus correctness:
  - Correct + low confidence → near review.
  - Wrong + high confidence → misconception intervention.
  - Correct + high confidence → longer interval and transfer task.
- Add review queue controls:
  - Due today.
  - Overdue.
  - Snoozed.
  - Retired/mastered.
- Add daily packages:
  - 15-minute minimum.
  - 30-minute standard.
  - 60-minute deep practice.
- Add “why this next” explanation to each recommendation.

## P2: increase challenge quality

- Keep the 10-level ladder, but add multiple challenges per level.
- Add challenge types:
  - Trace output.
  - Predict render behavior.
  - Fix a bug.
  - Write a reducer.
  - Design a state boundary.
  - Review a pull request.
  - Diagnose a performance trace.
  - Design an auth/data flow.
  - Explain a trade-off in interview format.
  - Build a capstone slice.
- Add rubric dimensions:
  - Correctness.
  - Constraint adherence.
  - Accessibility.
  - Performance reasoning.
  - Maintainability.
  - Communication.
- First implementation step:
  - Continue deterministic checks for choice, keywords, and required concepts.
  - Add tests for the evaluator itself.
- Later implementation step:
  - Add a sandbox or repository exercise runner only after threat modeling.
  - Never execute arbitrary learner code in the main app process.

## P3: improve correctness and source trust

- Create content metadata:
  - `sourceUrl`.
  - `sourceType`.
  - `lastVerifiedAt`.
  - `frameworkVersion`.
  - `confidence`.
  - `knownDisagreement`.
- Review volatile topics against current official docs:
  - Next.js caching.
  - Server Actions.
  - Authentication guidance.
  - React Actions and optimistic updates.
  - Compiler and memoization guidance.
- Write “version notes” when behavior changed between Next.js or React releases.
- Separate:
  - Fact.
  - Recommendation.
  - Trade-off.
  - Local project convention.
- Add a content CI check for:
  - Dead lesson IDs.
  - Broken internal links.
  - Duplicate IDs.
  - Missing sources.
  - Empty acceptance criteria.

## P4: add ecosystem curriculum incrementally

- Add TypeScript before advanced library use.
- Add forms and schemas before Server Actions forms.
- Add server state before TanStack Query.
- Add testing before mocking and E2E.
- Add accessibility before component-library abstraction.
- Add performance before optimization libraries.
- Add auth/security before production deployment.

## Product metrics

- Track locally first; do not add analytics before consent/privacy decisions.
- Useful metrics:
  - Time to first meaningful action.
  - Lesson start-to-completion rate.
  - Prediction accuracy before reveal.
  - Hint rate.
  - Reveal rate.
  - Challenge pass rate by attempt.
  - Confidence calibration.
  - Review retention after 1, 7, and 30 days.
  - Return rate for daily packages.
  - Accessibility issue count.
- Avoid optimizing for:
  - Click count.
  - Streak length alone.
  - Lesson completion without delayed retention.
