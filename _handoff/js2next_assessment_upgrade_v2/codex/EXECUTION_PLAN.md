# Execution Plan

## Phase 0 — Baseline and mapping

- Verify repository and branch.
- Record Git status.
- Run baseline quality commands.
- Locate active authored question data, compiled question data, topic packets, assessment sets, and local-progress versioning.

**Gate:** no edits until the active data flow is understood.

## Phase 1 — Schema and profile support

- Add v2 question fields.
- Add assessment-profile types and labels.
- Add validators for code-question requirements and profile mixes.

**Gate:** schemas and validators pass against the supplied package.

## Phase 2 — Data replacement

- Import the v2 question bank.
- Update topic-owned assessment records.
- Update module and cumulative assessment sets.
- Confirm all 632 active IDs resolve to version 2 records.

**Gate:** no active v1 question record is reachable from the learner catalog.

## Phase 3 — Learner experience

- Render code blocks and profile-specific challenge labels.
- Preserve single-choice controls, explanations, retries, and mastery behavior.
- Verify responsive and accessible behavior.

**Gate:** representative conceptual, workflow, hybrid, and coding topics work in the browser.

## Phase 4 — Progress migration

- Preserve non-assessment learner state.
- Archive v1 attempts.
- Invalidate v1-derived quiz/module/cumulative scores.
- Recalculate mastery only after v2 submissions.

**Gate:** migration and rollback tests pass.

## Phase 5 — Verification

- Run unit, integration, E2E/browser, typecheck, lint, build, source validation, and content validation.
- Produce final inventory and human-review report.

**Gate:** all applicable acceptance criteria pass.
