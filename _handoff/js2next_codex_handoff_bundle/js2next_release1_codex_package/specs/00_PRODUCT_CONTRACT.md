# Product Contract — JS2Next Release 1

## Authority

This document is authoritative for the Release 1 learning domain. When the existing repository conflicts with this contract, the contract wins.

JS2Next has full authority to replace, restructure, or remove current learning-domain code, routes, data contracts, completion rules, and content. The existing project is reusable infrastructure, not a product constraint.

## Canonical content

1. The approved JavaScript, React, and Next.js curriculum in this package defines scope and order.
2. The newly authored packets in `content/` are the only candidate learner-facing knowledge source.
3. Official documentation is used to verify technical claims and freshness.
4. Course transcripts are coverage and sequencing research only.
5. Existing repository lessons, challenges, Q&A, practices, and project examples are supplementary internal references only.

No legacy instructional item enters the new runtime automatically.

## Product hierarchy

`Track → Module → Topic → Subtopic`

Release 1 contains exactly three tracks:

- JavaScript
- React
- Next.js

Topics may merge several source lectures. A topic may contain multiple subtopics. Optional or advanced topics never block required progression.

## Learning and assessment

- Original explanations, examples, questions, answers, and feedback.
- Single-answer MCQs are the primary question type.
- Code may be displayed inside questions, but code is never executed in Release 1.
- Every topic contains at least three in-lesson checks and a five-question topic quiz.
- Every module has a module review.
- Every track has a cumulative review.
- Mastery target: 80%.
- Attempts: unlimited.
- A failed assessment recommends targeted review; it does not permanently lock the learner.
- Important incorrect choices include useful feedback.
- Explanations appear after submission.

## Publication

All generated packets and assessment sets begin as `draft` and `pending-human-review`. Only a designated human reviewer may move content to `reviewed` and then `published`. Codex must never auto-approve or auto-publish content.

## Release 1 persistence

Release 1 is local-first:

- Zustand/browser persistence may be retained or adapted.
- Progress export/import must remain available.
- No authentication, database, or cross-device synchronization is required.
- Data contracts must remain separable from storage so a server adapter can be added later.

## Deferred scope

Authentication, database persistence, a full CMS, payments, analytics vendors, cohorts, notifications, certificates, code execution, repository projects, and AI adaptation are outside Release 1.
