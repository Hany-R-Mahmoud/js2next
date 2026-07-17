# Product Hardening and Curriculum Organization Receipt

- Audit date: 2026-07-16.
- Scope: the unblocked recommendations from the product review, the multiple-choice interaction contract, and the remaining curriculum organization task.
- Product decision: `earnedCapabilities` is an active product feature. Topic completion now surfaces earned capability definitions instead of treating the field as dead schema.
- Release truth: engineering work is verified, but the curriculum is not content-audit complete until the pending human claim reviews are decided.

## Delivered product changes

- Topic practice, confirmation Q&A, and focused review use selectable multiple-choice controls. Conceptual prompts no longer require free-text responses.
- Every canonical Q&A item has four choices and a deterministic correct answer. Every conceptual challenge is a choice or multi-choice interaction; the two genuine code challenges retain code input.
- Changing an answer after checking it clears stale feedback. Topic confirmation and focused review also invalidate the previous correct gate until the changed answer is checked again.
- Wrong-answer feedback links back to the exact lesson section when that relationship exists.
- Topic completion has an explicit completion card and earned-capability reward state.
- The streak is visible in the application shell on desktop and mobile, including focused review.
- Mobile primary navigation is consistently limited to Home, Progress, and Settings and does not overlap the independently scrolling content pane.
- Focused review remains capped at ten queued items while using the shared app shell.
- The content audit report groups all pending claims by topic family.

## Curriculum organization completed

The authored curriculum is split into per-topic modules under `src/data/topics/`. There are 33 topic modules plus the typed registry, shared types, and supplemental content module. Each topic module co-locates its lesson, challenges, Q&A, and practices while preserving stable content IDs and the canonical runtime registry.

The older aggregate files remain compatibility bridges for middleware, tests, and the internal design-system route. Removing them is not required for the per-topic authoring boundary and should only happen after a separate terminology/compatibility review.

## Input policy

Learner text entry is intentionally retained only for:

- the two code challenges, where authored code is the answer;
- optional mini-project implementation notes;
- normal product controls such as search, settings, and import/export.

Conceptual practice, confirmation Q&A, and focused review do not render textareas.

## Verification

- Full tests: `npm test` — 26 files passed, 1 skipped; 103 tests passed, 1 skipped.
- Lint: `npm run lint` — passed with zero warnings.
- Typecheck: `npm run typecheck` — passed.
- Production build: `npm run build` — passed for all application routes.
- Live source check: `npm run verify:sources` — passed.
- Browser console: zero errors and zero warnings in the final production flow.
- Responsive evidence: `.omo/evidence/mcq-final-v10/` contains 15 mobile and desktop captures covering practice, correct/incorrect feedback, confirmation, focused review, navigation, and answer-change invalidation.
- Manual state checks:
  - focused review: changing a correct answer produces no stale status and disables Next;
  - topic confirmation: changing a correct answer produces no stale status and disables Confirm;
  - practice: changing a scored answer clears the prior result;
  - mobile content and navigation occupy non-overlapping viewport regions.

## Content-audit status

`npm run audit:content` reports the expected human-review queue:

| Metric | Count |
|---|---:|
| Claims | 205 |
| Catalog content records | 198 |
| Verified | 0 |
| Pending | 205 |
| Needs revision | 0 |
| Deprecated | 0 |

Pending claims are grouped across all nine topic families. `ok: false` is intentional and truthful until reviewers assess the exact claim wording, source support, version context, limitations, and conflict notes.

## Remaining human decisions

- Review and classify the 205 content claims in topic-family batches.
- Editorially audit generated MCQ distractors for plausibility, ambiguity, and instructional quality before calling the curriculum release-ready.
- Decide the backend/account/sync direction; progress remains browser-local, with import/export as the current safety net.
- Decide release policy and whether compatibility bridge terminology should be consolidated or removed.

Everything else in this hardening scope is implemented and can be maintained without additional product input.
