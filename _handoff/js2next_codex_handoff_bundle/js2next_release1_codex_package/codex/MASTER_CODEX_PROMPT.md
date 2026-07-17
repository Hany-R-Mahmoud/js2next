You are Codex executing a major Release 1 learning-domain replacement inside an existing project.

## Repository identity

The canonical source repository is `js2next`. The project originally began as `learn-next` and was later renamed. Treat residual `learn-next` package, path, or brand references as historical naming residue, not as a second repository.

Before changing anything:

1. Verify you are inside the actual `js2next` source repository.
2. Inspect Git status, branch, package manager, package scripts, and existing dirty files.
3. Preserve all unrelated user changes.
4. Run the existing test, typecheck, lint, build, and source-validation commands.
5. Record a baseline receipt.

## Product authority

The attached JS2Next Release 1 package is authoritative for the new learning domain.

You have full authority to:

- replace existing learning-domain architecture;
- replace current content contracts and registries;
- change routes and learner flows;
- change completion, assessment, and progression rules;
- introduce new domain layers and import pipelines;
- archive or remove unsuitable compatibility code after cutover;
- redesign UI components when existing ones do not serve the target experience.

Do not preserve an implementation merely because it already exists. Preserve only infrastructure that satisfies the target product and lowers risk.

## Canonical content policy

The newly supplied curriculum and topic packets are the only candidate learner-facing source of knowledge.

Existing repository lessons, challenges, Q&A, practices, course projects, and topic-family organization are supplementary internal references only. They must not be automatically migrated, merged, or rendered.

Course transcripts are research and coverage references only. Never copy transcript wording into learner content.

Official documentation is the technical verification authority.

Archive existing instructional content as `legacy-supplementary` and ensure it is outside the new runtime import graph.

## Release 1 boundaries

Implement Release 1 only:

- JavaScript, React, and Next.js tracks.
- Track → Module → Topic → Subtopic hierarchy.
- Markdown-first content packets normalized to validated JSON.
- In-lesson single-answer MCQs.
- Five-question topic quizzes.
- Module reviews.
- Cumulative track reviews.
- Explanations, hints, useful wrong-choice feedback, and unlimited retries.
- 80% mastery threshold.
- Soft prerequisites and targeted review.
- Browser-local progress through a storage adapter.
- Progress export/import.
- Responsive and accessible learner UI.
- Human-controlled review and publication.

Do not add:

- authentication;
- database persistence;
- cross-device sync;
- payments;
- full CMS;
- external analytics;
- cohorts/social features;
- certificates;
- code execution or automated code grading;
- AI adaptation.

Code snippets may be displayed in lessons and MCQs, but there must be no run button, evaluator, worker, sandbox, or execution API.

## Human publication gate

All supplied content is `draft` and `pending-human-review`.

You may import, validate, compile, render in draft preview, and test it. You must not:

- mark it approved;
- mark it published;
- include it in a production publication manifest;
- bypass review checks.

Build the review and manifest mechanism, but leave the draft manifest unpublished until a human reviewer approves exact versions.

## Source package

Treat these files as the implementation contract:

- `README.md`
- `specs/00_PRODUCT_CONTRACT.md`
- `specs/01_RELEASE_1_SCOPE.md`
- `specs/02_PRESERVE_REPLACE_ARCHIVE.md`
- `specs/03_TARGET_ARCHITECTURE.md`
- `specs/04_CONTENT_SPEC.md`
- `specs/05_ASSESSMENT_SPEC.md`
- `specs/06_PROGRESSION_SPEC.md`
- `specs/07_MIGRATION_PLAN.md`
- `specs/08_ACCEPTANCE_CRITERIA.md`
- `specs/09_CONTENT_REVIEW_PLAYBOOK.md`
- `schemas/*.json`
- `curriculum/curriculum.runtime.json`
- `content/**/*.md`
- `content/**/*.json`
- `assessments/question-bank.json`
- `assessments/module-reviews/**/*.json`
- `assessments/cumulative/*.json`
- `manifests/release-1.draft.manifest.json`
- `validation/VALIDATION_REPORT.md`

## Required implementation sequence

### 1. Safety and archive

- Create a reversible migration branch/snapshot.
- Archive current instructional content and registries.
- Add a boundary test proving the new runtime cannot import legacy learning content.
- Keep rollback available.

### 2. Contracts and compiler

- Add the supplied JSON Schemas.
- Implement deterministic Markdown/frontmatter → normalized JSON compilation.
- Validate duplicate IDs, references, choices, correct answers, objectives, prerequisites, status, and source metadata.
- Generated JSON must never be hand edited.
- Add draft preview.

### 3. Curriculum domain

- Implement three tracks, 27 modules, 79 topic placements, subtopics, ordering, flags, and prerequisite edges.
- Add target routes and navigation.
- Do not force this hierarchy into the old `TopicFamily` model.

### 4. Assessment domain

- Implement a pure single-answer MCQ scorer.
- Add topic quizzes, module reviews, cumulative reviews, explanations, hints, feedback, retries, and objective-level misses.
- Keep assessment state independent from storage technology.

### 5. Progression and local persistence

- Implement version-aware topic, module, and track progress.
- Use a local storage adapter for Release 1.
- Store every attempt.
- Implement review queue and export/import.
- Perform a clean reset from legacy mastery while preserving a separate legacy export.

### 6. Pilot and cutover

- Integrate one complete JavaScript module first.
- Run all quality and E2E gates.
- Keep a feature flag/catalog pointer for rollback.
- Then integrate the entire draft catalog for preview.
- Do not publish without human approval.

## Reuse guidance

Strong candidates for reuse or adaptation:

- Next.js, React, TypeScript, Tailwind;
- responsive app shell and design tokens;
- accessibility settings;
- code-block, knowledge-check, feedback, search, and progress UI patterns;
- pure mastery, prerequisite, review, recommendation, and migration functions;
- content identity and source-validation concepts;
- local export/import.

Replace or remove when conflicting:

- `TopicFamily` curriculum authority;
- current `TopicBundle` registry;
- old lesson/challenge/Q&A/practice text;
- mandatory Learn → Challenge → Q&A loop;
- hardcoded fallback scoring;
- old completion rules;
- direct coupling between domain logic and Zustand/localStorage;
- compatibility exports after stable cutover.

## Engineering rules

- Prefer a clean long-term domain model over minimal diff size.
- Do not rewrite unrelated infrastructure.
- Keep content IDs stable exactly as supplied.
- Keep content status and review status intact.
- Never silently repair malformed content; fail validation with actionable diagnostics.
- Add unit tests for pure domains and E2E tests for critical learner flows.
- Keep generated artifacts deterministic.
- Avoid new production dependencies unless justified.
- Do not introduce secrets or external services.
- Maintain accessible labels, focus order, keyboard operation, reduced motion, contrast, and responsive layouts.
- Use exact content versions in attempts and progress.
- Make migration reversible.

## Acceptance

Do not report completion until every criterion in `specs/08_ACCEPTANCE_CRITERIA.md` has passed or is explicitly marked as waiting only for human content approval.

At completion, provide:

1. a concise architectural summary;
2. preserve/replace/archive receipt;
3. file-by-file change list;
4. commands and test results;
5. content inventory;
6. migration and rollback instructions;
7. known risks;
8. items waiting for human review;
9. confirmation that no content was auto-published.
