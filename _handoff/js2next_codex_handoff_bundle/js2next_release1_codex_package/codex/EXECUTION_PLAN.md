# Codex Execution Plan

Follow the phases in order. Commit each phase separately when possible. Do not collapse safety, compiler, curriculum, assessment, and cutover into one unreviewable change.

## Phase A — Repository verification

- Work only in the canonical `js2next` repository.
- Inspect `package.json`, lockfile, current routes, stores, content registries, tests, and dirty worktree.
- Preserve unrelated changes.
- Run and record the existing quality commands before editing.
- Resolve residual `learn-next` naming only when it is safe and in scope.

**Gate:** baseline receipt recorded; no user changes lost.

## Phase B — Archive existing instructional authority

- Snapshot the current lesson/challenge/Q&A/practice content.
- Move or copy it to an internal `legacy-supplementary` location.
- Add a clear non-runtime boundary and tests preventing imports into the new catalog.
- Do not delete the original authority until the pilot passes.

**Gate:** archive is complete and old runtime still works.

## Phase C — Content contracts and import pipeline

- Add schemas from `schemas/`.
- Add Markdown/frontmatter parser.
- Normalize packets to deterministic JSON.
- Validate duplicate IDs, references, statuses, source metadata, module/topic placement, and MCQ correctness.
- Add a draft preview route.
- Add a manifest loader that refuses pending or unapproved content in production.

**Gate:** all supplied packets compile; generated output is deterministic.

## Phase D — Curriculum and navigation

- Add `src/domain/curriculum`.
- Load `curriculum/curriculum.runtime.json`.
- Build track, module, topic, and subtopic navigation.
- Add required/optional/advanced labels and prerequisite warnings.
- Preserve safe redirects for old URLs.

**Gate:** 3 tracks, 27 modules, and 79 topics render in the intended order.

## Phase E — Assessment engine

- Add `src/domain/assessment`.
- Implement single-answer MCQ evaluation, explanations, hints, choice feedback, attempts, topic quizzes, module reviews, and cumulative reviews.
- Render code snippets without any evaluator or run button.
- Ensure scoring is pure and separately tested.

**Gate:** scoring and reference tests pass; 80% mastery rule is deterministic.

## Phase F — Local progression

- Add a storage adapter boundary and Release 1 local implementation.
- Store content versions, immutable attempts, topic/module/track progress, review queue, and last activity.
- Add safe export/import.
- Keep legacy progress in a separate namespace and perform a clean reset for the new catalog.

**Gate:** refresh and export/import continuity pass.

## Phase G — End-to-end pilot

- Choose the first substantive JavaScript module as the pilot.
- Complete the full learner flow and accessibility review.
- Keep new catalog behind a feature flag/catalog pointer.
- Obtain human content review before any production manifest entry.

**Gate:** unit, type, lint, build, E2E, accessibility, and human review pass.

## Phase H — Full catalog cutover

- Import all packets and assessment sets.
- Generate the draft inventory report.
- After human approvals, create the published manifest.
- Switch the runtime catalog.
- Verify legacy content cannot appear.
- Retain rollback for one release cycle.

**Gate:** all acceptance criteria pass and a rollback rehearsal succeeds.

## Required implementation receipts

At the end of every phase report:

- files created, changed, moved, or deleted;
- commands run and results;
- decisions made;
- deviations from this package and reasons;
- unresolved risks;
- exact next gate.
