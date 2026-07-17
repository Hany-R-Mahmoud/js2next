# Internal knowledge audit plan

Status: implemented as an internal review workflow; the curriculum is not release-ready until the pending review queue is completed.

This workflow is deliberately invisible to learners. Audit fields are stored in the content/claim data and consumed by validation/tests and reviewer tooling only. They are not imported by route components, lesson cards, progress views, or other learner-facing UI.

## Evidence contract

Each claim-level audit row carries:

- stable `claimId` and owning `contentId`;
- the exact claim wording;
- direct source URL;
- source type;
- last verified date;
- relevant framework or platform version;
- what the source supports;
- what the source does not support or could conflict with;
- confidence level;
- independent review status, reviewer, review date, and review notes.

The published evidence fields already live in `src/lib/content/claims.ts` and are checked against the canonical catalog in `src/lib/content/claims.ts`. The independent human decision fields live in `src/lib/content/audit.ts`.

## Review lifecycle

1. Inventory: every published catalog record must have a stable identity and direct provenance.
2. Claim extraction: split instructional prose into atomic claims; avoid marking a whole lesson as verified when only one sentence was checked.
3. Source review: confirm that the linked source directly supports the exact claim, including version-sensitive behavior and exceptions.
4. Decision: add one `ContentAuditReview` entry in `contentAuditReviews` with `verified`, `needs-revision`, `deprecated`, or leave it `pending`.
5. Notes: record the reviewer, date, wording/scope decision, and any limitation or follow-up.
6. Release gate: `validateContentAudit()` must return `ok: true` before a content batch is treated as fully reviewed.
7. Maintenance: rerun the review for claims affected by framework/library upgrades, source changes, or reported learner errors.

## Current implementation

- `src/lib/content/catalog.ts` is the canonical inventory of lessons, challenges, Q&A, and practices.
- `src/lib/content/claims.ts` is the source-backed claim ledger.
- `src/lib/content/audit.ts` builds the internal matrix and validates human review decisions.
- `src/lib/content/audit.test.ts` protects the workflow from missing provenance, duplicate IDs, detached reviews, incomplete approvals, and accidental release-readiness before review.
- `contentAuditReviews` intentionally starts empty. Existing source verification is not treated as human approval.

Run the structural audit checks with:

```sh
npm test -- src/lib/content/audit.test.ts src/lib/content/claims.test.ts src/lib/content/catalog.test.ts
```

The next review batch should add decisions to `contentAuditReviews` in small topic-family slices. Do not set `verified` merely because a URL responds: the reviewer must confirm the exact claim, version context, support boundary, and conflict note.
