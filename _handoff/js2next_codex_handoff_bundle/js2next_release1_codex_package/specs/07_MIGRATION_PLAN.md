# Migration and Cutover Plan

## Phase 0 — Safety and identity

1. Verify the working repository is `js2next`.
2. Record branch, commit, dirty files, package scripts, and current test results.
3. Do not modify or discard unrelated user changes.
4. Create a migration branch and a reversible snapshot.
5. Document residual `learn-next` package/brand references before renaming them.

## Phase 1 — Legacy archive

1. Copy current instructional files and registries into an internal archive.
2. Add a README stating they are supplementary and non-runtime.
3. Preserve source/audit metadata for historical reference.
4. Keep current runtime operational until the new pilot passes.

## Phase 2 — Contracts and compiler

1. Add the supplied JSON Schemas.
2. Add Markdown/frontmatter parsing and normalization.
3. Validate IDs, references, sources, statuses, and duplicate collisions.
4. Generate normalized JSON into a non-hand-edited directory.
5. Add a draft preview route.
6. Ensure draft content cannot enter the published manifest.

## Phase 3 — Curriculum domain

1. Add three tracks and ordered modules.
2. Add reusable topic placements and prerequisite edges.
3. Build track/module/topic navigation.
4. Keep old routes behind redirects or a temporary compatibility layer.
5. Do not import legacy content into the new catalog.

## Phase 4 — Assessment domain

1. Implement single-choice MCQ rendering and deterministic scoring.
2. Support code snippets without execution.
3. Add topic quizzes, module reviews, cumulative reviews, explanations, retries, and local attempt history.
4. Adapt useful existing components only when they satisfy the new contracts.

## Phase 5 — Local progression

1. Implement the storage adapter and new version-aware local schema.
2. Add mastery, module/track completion, review queue, and export/import.
3. Keep legacy export separately; do not silently convert mastery.
4. Add migration version guards.

## Phase 6 — Pilot cutover

1. Integrate one complete module first.
2. Run unit, type, lint, build, accessibility, and E2E tests.
3. Compare new and old runtime only for regressions in infrastructure, not content parity.
4. Obtain human content review.
5. Enable the new catalog behind a reversible feature flag.

## Phase 7 — Full catalog cutover

1. Import all supplied packets and assessment sets.
2. Validate inventory and routes.
3. Switch the learner catalog to the new manifest.
4. Verify no runtime imports from the legacy archive.
5. Retain rollback for at least one release cycle.
6. Remove compatibility authority only after acceptance.

## Rollback

Rollback switches the catalog pointer/feature flag to the prior registry and restores the old local profile namespace. Do not delete the archive or old registry in the same release as the first cutover.
