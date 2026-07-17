# JS2Next Release 1 — Codex Execution Package

This package replaces the current learning-content authority with a newly organized and independently authored JavaScript, React, and Next.js curriculum.

## Inventory

- 3 tracks
- 27 modules
- 79 topic packets
- 632 single-answer MCQs
- 27 module reviews
- 3 cumulative reviews
- 6 JSON Schemas
- 10 product and implementation specifications

All content is `draft`, `unpublished`, and `pending-human-review`.

## Start here

1. Read `specs/00_PRODUCT_CONTRACT.md`.
2. Read `specs/01_RELEASE_1_SCOPE.md`.
3. Read `codex/MASTER_CODEX_PROMPT.md`.
4. Execute `codex/EXECUTION_PLAN.md`.
5. Use `validation/VALIDATION_REPORT.md` as the package receipt.
6. Do not publish any packet before a human review decision.

## Directory map

```text
content/                 canonical Markdown and normalized JSON topic packets
curriculum/              approved source map and runtime curriculum
assessments/             question bank, module reviews, cumulative reviews
schemas/                 JSON Schemas
specs/                   product, architecture, content, assessment, migration contracts
codex/                   master execution prompt and phased implementation plan
migration/               legacy archival rules
fixtures/                Release 1 local-progress fixture
manifests/               draft, deliberately unpublished manifest
validation/              inventory, checks, hashes, and validation report
```

## Non-negotiable decisions

- Canonical repo: `js2next`.
- New package content is the learner-facing authority.
- Existing project learning content is supplementary legacy material only.
- Release 1 is local-first.
- No auth, database, full CMS, analytics service, or code execution.
- MCQs are the primary assessment type.
- Mastery threshold is 80%; retries are unlimited.
- Human approval is required to publish.
