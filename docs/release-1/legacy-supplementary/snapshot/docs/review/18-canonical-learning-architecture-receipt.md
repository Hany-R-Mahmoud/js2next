# Canonical Learning Architecture Receipt

- Audit date: 2026-07-16.
- Reference: `/Users/hanyramadan/Downloads/learn-next-structure.md`.
- Delivery mode: development-stage architecture migration; legacy learning destinations removed.
- Content authority: official React, Next.js, MDN, WAI, OWASP, and library documentation. The React course ZIP remains secondary study evidence; its traceability is recorded in `16-react-course-study-pack-receipt.md`.

## ZIP inventory carried forward

| Metric | Count |
|---|---:|
| Sections | 40 |
| Lecture headings | 471 |
| Transcript-backed lectures | 462 |
| Transcript gaps | 9 |
| Concept categories | 33 |
| Recall cards | 471 |

Version warnings and deferred source gaps remain documented in the ZIP receipt. No transcript text was copied into route-facing content.

## Architecture implemented

```text
Product shell
├── /onboarding
├── /home
│   ├── due review queue
│   ├── one daily suggestion
│   └── topic map + family filter
├── /topic/[slug]
│   ├── Act 1: Learn
│   ├── Act 2: Practice (up to 3 challenges)
│   └── Act 3: Confirm (up to 5 Q&A cards)
├── /review
│   └── focused, max 10, no score or app navigation
├── /progress
│   ├── mastery map
│   ├── weak spots (max 5)
│   └── recent activity (7 days, max 7)
└── /settings
    ├── level, focus area, pace
    ├── re-run onboarding
    ├── accessibility
    └── import/export/reset

Canonical content plane
└── src/content/topics.ts
    └── TopicBundle
        ├── lesson
        ├── exact-topic challenges
        ├── exact-topic Q&A
        └── exact-topic practices
            └── src/content/topic-loop-content.ts
                └── source-backed supplemental records for sparse topics

Canonical learner state
└── UnifiedProfile
    ├── topicProgress: learn → practice → confirm → complete
    ├── masteryRecords + reviewSchedule
    ├── challengeProgress
    ├── learningEvents
    └── manual review flags
```

## Coverage/collision matrix

| Reference requirement | Result | Evidence |
|---|---|---|
| Learn → Practice → Confirm loop | Implemented | `src/app/topic/[slug]/page.tsx`, learner store tests |
| One canonical topic identity | Implemented | `src/content/topics.ts`, `src/content/topics.test.ts` |
| Exact challenge/Q&A/practice ownership at runtime | Implemented | bundle migration test; catalog now reads bundles; authored source remains behind the registry |
| One daily recommendation | Implemented | `src/app/home/page.tsx` |
| Review queue + focused session | Implemented | `src/app/review/page.tsx`, manual-review adaptation |
| Five product routes | Implemented | onboarding, home, topic, progress, settings |
| No legacy learning destinations | Implemented | old dashboard/curriculum/challenge/lesson/qa/best-practices pages removed |
| Content split into four files per topic | Deliberate deviation | one typed registry keeps development edits disjoint and avoids duplicating 33 topic files; source arrays remain behind it |
| 3–5 Q&A and 1–3 challenges for every topic | Implemented | `src/content/topic-loop-content.ts`, `src/content/topics.test.ts`; every bundle has 3–5 Q&A and 1–3 challenges |
| Exact wrong-answer deep links | Implemented | `src/lib/content/identity.ts`, identity tests, and `ChallengeAnswerForm`; every published challenge resolves to an existing lesson section |

Review findings addressed after the first gate:

- Act transitions are now guarded and sparse topics cannot be completed without one practice check and three confirmation cards.
- Confirmation answers require an explicit reveal before marking a card understood.
- Streak updates occur on act completion, not on every Home visit; the first completed act establishes a one-day streak.
- Home always shows one suggestion, including the empty/new profile state.
- Focused review has no in-session application navigation, is capped at ten items, and waits for persisted state hydration.
- Completed manual-review items record `lastReviewCompletedAt`, preventing unchanged low-confidence items from immediately reappearing.
- Topic hydration resumes the persisted act, exposes tab/panel semantics, and gives wrong answers exact lesson-section recovery links.
- Review event retention handles a zero-item limit correctly.
- First-time Learn → Practice creates the topic progress record instead of blocking.

## Deferred scope

- Tailwind, Styled Components, Supabase, React Hook Form, and Pages Router remain comparison/deferred material; no runtime dependency or product boundary requires them.
- Full ZIP transcript/recall-card import remains deferred to avoid a second content authority and duplicated lessons.
- Per-topic physical source files remain deferred until the authored data is actively edited topic-by-topic; the canonical runtime boundary already exists.

## Verification evidence

- Full tests: `npm test` — 21 files passed, 1 skipped; 63 tests passed, 1 skipped.
- Typecheck: `npm run typecheck` — passed.
- Lint: `npm run lint` — passed with zero warnings.
- Source validation: `npm run verify:sources` — 1 test passed.
- Production build: `npm run build` — passed; routes generated: `/`, `/onboarding`, `/home`, `/topic/[slug]`, `/review`, `/progress`, `/settings`, plus `/design-system` and Next error routes. Non-blocking webpack large-string cache warning only.
- Browser/visual QA: Playwright checks passed for onboarding (4 questions), Home (daily suggestion/topic map), topic Learn → Practice transition, progress, settings, review reveal/complete, 375px Home screenshot, and 1280px topic screenshot. Final browser console check returned 0 errors after hydration fixes.
- Review gates: one source review returned actionable findings that were fixed above; one narrow review returned the first-time transition and sparse-content findings, fixed above. Two broad reviewer jobs timed out and were not used as evidence.
