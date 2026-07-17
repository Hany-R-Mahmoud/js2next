# START HERE — JS2Next Release 1 Codex Handoff

This bundle is the complete and authoritative implementation handoff.

## What Codex must have

1. Access to the canonical `js2next` repository.
2. This entire bundle, extracted without changing its folder structure.

Place the extracted folder in the repository as:

`_handoff/js2next_codex_handoff_bundle/`

The implementation package is inside:

`_handoff/js2next_codex_handoff_bundle/js2next_release1_codex_package/`

Treat every file in `_handoff/` as read-only source material.

## Exact reading order

1. `START_HERE.md`
2. `js2next_release1_codex_package/README.md`
3. `js2next_release1_codex_package/specs/00_PRODUCT_CONTRACT.md`
4. `js2next_release1_codex_package/specs/01_RELEASE_1_SCOPE.md`
5. `js2next_release1_codex_package/specs/02_PRESERVE_REPLACE_ARCHIVE.md`
6. `js2next_release1_codex_package/specs/03_TARGET_ARCHITECTURE.md`
7. `js2next_release1_codex_package/specs/04_CONTENT_SPEC.md`
8. `js2next_release1_codex_package/specs/05_ASSESSMENT_SPEC.md`
9. `js2next_release1_codex_package/specs/06_PROGRESSION_SPEC.md`
10. `js2next_release1_codex_package/specs/07_MIGRATION_PLAN.md`
11. `js2next_release1_codex_package/specs/08_ACCEPTANCE_CRITERIA.md`
12. `js2next_release1_codex_package/codex/MASTER_CODEX_PROMPT.md`
13. `js2next_release1_codex_package/codex/EXECUTION_PLAN.md`
14. Remaining schemas, curriculum, content, assessments, migration files, manifests, and validation files.

## Authority rules

- The new content in this bundle is the canonical learner-facing source.
- Existing repository lessons, challenges, Q&A, practices, `TopicFamily`, and `TopicBundle` content are legacy supplementary material.
- Do not adapt the new curriculum to preserve the old learning-domain model.
- Reuse infrastructure only where it supports the target architecture.
- Release 1 is local-first: no authentication, database, full CMS, external analytics, or code execution.
- Do not mark content as human-reviewed or published automatically.
- Preserve IDs, versions, review states, and package structure.

## Before editing

- Confirm the working directory is the canonical `js2next` repository.
- Inspect Git status and preserve unrelated work.
- Work on a dedicated branch, not `main`.
- Record a baseline.
- Run the existing tests, typecheck, lint, build, and source-validation commands.
- If the repository is wrong or baseline failures cannot be safely attributed, stop and report the blocker.

## Execution rule

Implement phase by phase using `codex/EXECUTION_PLAN.md`.
A phase is complete only when its acceptance criteria pass.
Keep the migration reversible and checkpoint after every phase.

## Completion rule

Do not claim completion until every applicable requirement in
`specs/08_ACCEPTANCE_CRITERIA.md` passes, except items explicitly requiring human editorial approval.

At completion report:

- architecture implemented;
- preserved, replaced, archived, and removed systems;
- changed files;
- test/build results;
- content inventory;
- migration and rollback steps;
- known risks;
- items awaiting human review;
- confirmation that no content was auto-published.
