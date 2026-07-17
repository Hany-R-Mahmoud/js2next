# JS2Next Assessment Practicality Upgrade v2

This package changes the assessment bank after hands-on testing showed that coding topics were being assessed with overly theoretical MCQs.

## Scope

- Classifies all 79 topics as conceptual, workflow, hybrid, or coding.
- Replaces all 632 question records while preserving stable IDs.
- Uses code-heavy topic quizzes for coding and hybrid topics.
- Uses realistic developer scenarios for workflow topics.
- Keeps conceptual topics conceptual without forcing irrelevant code.
- Updates module and cumulative assessment-set metadata.
- Provides a reversible local-progress migration and a focused Codex execution prompt.

## What to give Codex

Attach this entire ZIP to Codex while it has the current canonical `js2next` repository open. Paste the contents of:

`codex/MASTER_CODEX_ASSESSMENT_UPGRADE_PROMPT.md`

Do not attach the old transcripts or earlier assessment question bank as competing instructions.

## Canonical files

- `assessments/question-bank.v2.json`
- `patched-topic-packets/`
- `audit/topic-assessment-profiles.json`
- `migration/assessment-replacement-manifest.json`
- `specs/ASSESSMENT_POLICY_V2.md`
- `specs/ASSESSMENT_EXPERIENCE_V2.md`
- `specs/ACCEPTANCE_CRITERIA.md`

All content remains draft pending human review.
