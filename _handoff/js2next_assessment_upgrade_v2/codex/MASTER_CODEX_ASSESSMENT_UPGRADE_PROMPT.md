# Codex Prompt — JS2Next Assessment Practicality Upgrade v2

You are working in the already regenerated canonical `js2next` application.

This package is a focused assessment-data upgrade. It does **not** authorize another full application regeneration.

## Objective

Replace the current generic/theoretical assessment data with the supplied skill-aligned v2 questions and update the assessment presentation so coding topics primarily show realistic code challenges while conceptual topics remain appropriately conceptual.

## Authority

Use this package as the authority for assessment data and assessment-profile behavior. Do not regenerate or paraphrase the supplied questions. Do not reintroduce legacy questions from the old application or the earlier Release 1 package.

## Read first

1. `README.md`
2. `specs/ASSESSMENT_POLICY_V2.md`
3. `specs/ASSESSMENT_EXPERIENCE_V2.md`
4. `audit/topic-assessment-profiles.json`
5. `migration/assessment-replacement-manifest.json`
6. `validation/VALIDATION_REPORT.md`

## Required implementation

1. Inspect the current repository and identify its canonical compiled and authored assessment sources.
2. Preserve unrelated application changes and current learner-facing lesson content.
3. Replace question records with `assessments/question-bank.v2.json`.
4. Use `patched-topic-packets/` where the project stores topic-owned questions or assessment metadata.
5. Preserve question IDs but honor version `2` and policy version `2.0`.
6. Replace or update module and cumulative assessment-set records from this package.
7. Render code questions using the existing code-block component.
8. Use each topic's `assessmentProfile.type` to label the topic assessment appropriately.
9. Implement the local-progress migration exactly as stated in the manifest: preserve lesson progress but archive/invalidate v1 assessment results.
10. Keep all content draft and pending human review. Do not auto-publish.
11. Add tests for question identity, code rendering, profile labels, scoring, retry, feedback, migration, and absence of v1 question content from the active catalog.
12. Run the complete existing test/typecheck/lint/build/source-validation suite.

## Prohibited actions

- Do not rebuild unrelated routes, navigation, styling, curriculum, or lesson content.
- Do not add authentication, a database, a CMS, analytics, or code execution.
- Do not change correct answers or question wording unless a supplied record fails schema validation; report such a failure instead of silently rewriting it.
- Do not mark any v2 question reviewed or published.
- Do not discard v1 attempts without a reversible archive/migration step.

## Completion report

Report changed files, migration behavior, counts by assessment profile and presentation type, tests and commands run, remaining human-review items, and confirmation that no content was auto-published.
