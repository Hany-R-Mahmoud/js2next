# 1. Executive summary

Audit target mismatch:

- `/Users/hanyramadan/new era/projects/learn-next` contains no source, package, or Git repo. Only build artifacts/screenshots.
- Actual learning app is `/Users/hanyramadan/new era/projects/js2next`, package name `learn-next`, UI brand `JS2Next`.

Current product: polished local-first learning prototype.

Current strengths:

- 31 lessons, 31 challenges, 44 Q&A items, 22 practices.
- Next.js App Router.
- Rich topic lessons: objectives, sections, code, diagrams, retrieval, reflection, mini-projects.
- Local mastery, review queue, streaks, migration, import/export.
- Strong content-source infrastructure.

Not launch-ready as a multi-user platform:

- No database.
- No authentication.
- No server persistence.
- No admin/CMS.
- No Track → Module → Topic → Subtopic hierarchy.
- No cumulative/module assessments.
- No E2E browser test suite.
- Content audit reports `205 pending`, `0 verified`.

Recommendation: heavily restructure learning-domain architecture while retaining Next.js, React, Tailwind, current content trust work, learner UI patterns, and pure mastery logic.

Validation:

- `npm test`: 26 files passed, 104 tests passed, 1 skipped.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run verify:sources`: passed.
- `npm run audit:content`: intentionally fails until human content review is recorded.
- Existing worktree was already dirty; audit made no edits.

# 2. Current technology stack

| Area | Current implementation | Evidence |
|---|---|---|
| Frontend | Next.js `15.5.20`, React `19.2.7` | [package.json](</Users/hanyramadan/new era/projects/js2next/package.json>) |
| Language | TypeScript `5.7` strict mode | [tsconfig.json](</Users/hanyramadan/new era/projects/js2next/tsconfig.json>) |
| Routing | Next.js App Router | [src/app](</Users/hanyramadan/new era/projects/js2next/src/app>) |
| Styling | Tailwind CSS `3.4.17`, custom CSS tokens | [tailwind.config.ts](</Users/hanyramadan/new era/projects/js2next/tailwind.config.ts), [globals.css](</Users/hanyramadan/new era/projects/js2next/src/app/globals.css) |
| State | Zustand `5`, persisted to browser storage | [learner.ts](</Users/hanyramadan/new era/projects/js2next/src/stores/learner.ts), [settings.ts](</Users/hanyramadan/new era/projects/js2next/src/stores/settings.ts) |
| Validation | Custom TypeScript/content validators | [validate.ts](</Users/hanyramadan/new era/projects/js2next/src/lib/content/validate.ts) |
| Tests | Vitest `4.1.10` | [vitest.config.ts](</Users/hanyramadan/new era/projects/js2next/vitest.config.ts) |
| Lint | ESLint `9`, Next config | [eslint.config.mjs](</Users/hanyramadan/new era/projects/js2next/eslint.config.mjs) |
| Database | None | No schema, ORM, migration, or DB client found |
| Authentication | None | No auth provider or session layer found |
| Backend/API | None | No `app/api`, server actions, or server data layer |
| Analytics | None | No analytics SDK or event sink |
| Deployment | Generic Next production build; GitHub quality workflow | [.github/workflows/quality.yml](</Users/hanyramadan/new era/projects/js2next/.github/workflows/quality.yml>) |

# 3. Current architecture

```text
TypeScript authored content
  → src/data/topics/*
  → src/data/topics/index.ts
  → src/content/topics.ts
  → src/lib/content/catalog.ts
  → App Router pages

Learner interaction
  → Zustand actions
  → localStorage
  → mastery/review/recommendation functions
  → learner UI
```

Main boundaries:

- `src/app`: routes and page-level UX.
- `src/components`: shared learner UI.
- `src/data/topics`: authored content.
- `src/content/topics.ts`: canonical runtime topic registry.
- `src/lib/content`: identity, catalog, claims, audit, source validation.
- `src/lib/learning`: mastery, review, recommendation, migration.
- `src/stores`: persisted learner/settings state.
- `src/middleware.ts`: topic slug validation only.

Architecture status:

- Client-heavy.
- Static content bundled at build time.
- No server-owned learner state.
- No request authorization boundary.
- No content editing boundary.
- No persistence concurrency control.

# 4. Current user experience

| Flow | Status |
|---|---|
| Landing page | Implemented |
| Track choice | Partial; JavaScript, React, Next.js are start options, not true pathways |
| Registration/login | Absent |
| Diagnostic | Partial; current flow chooses level/path and name, not knowledge assessment |
| Dashboard | Implemented at `/home` |
| Topic map | Implemented |
| Module navigation | Absent |
| Subtopic navigation | Absent |
| Topic lesson | Implemented |
| Retrieval checks | Implemented |
| Practice challenges | Implemented |
| Review session | Implemented |
| Reflection | Implemented |
| Progress dashboard | Implemented locally |
| Settings/accessibility | Implemented locally |
| Search | Implemented over static catalog |
| Profile | Local profile only |
| Cross-device continuity | Absent |
| Admin/content editing | Absent |

Primary route files:

- [page.tsx](</Users/hanyramadan/new era/projects/js2next/src/app/page.tsx>)
- [home/page.tsx](</Users/hanyramadan/new era/projects/js2next/src/app/home/page.tsx>)
- [topic/[slug]/page.tsx](</Users/hanyramadan/new era/projects/js2next/src/app/topic/[slug]/page.tsx>)
- [review/page.tsx](</Users/hanyramadan/new era/projects/js2next/src/app/review/page.tsx>)
- [progress/page.tsx](</Users/hanyramadan/new era/projects/js2next/src/app/progress/page.tsx>)
- [settings/page.tsx](</Users/hanyramadan/new era/projects/js2next/src/app/settings/page.tsx>)

# 5. Current content model

Current runtime object:

```ts
type TopicModule = {
  id: string;
  lesson: Lesson;
  challenges: Challenge[];
  qa: QAItem[];
  practices: BestPractice[];
  meta: {
    topicFamily: TopicFamily;
    level: Level;
    title: string;
  };
};
```

Evidence:

- [src/data/topics/types.ts](</Users/hanyramadan/new era/projects/js2next/src/data/topics/types.ts>)
- [src/types/index.ts](</Users/hanyramadan/new era/projects/js2next/src/types/index.ts>)

Supported now:

- Lesson sections.
- Concepts.
- Code examples.
- Questions.
- Diagrams.
- Learning objectives.
- Prerequisites.
- Difficulty.
- Estimated time.
- Retrieval prompts.
- Reflection.
- Mastery criteria.
- Next topics.
- Challenges.
- Q&A.
- Best practices.
- Source URLs.
- Framework versions.
- Last-updated metadata.
- Mini-projects.
- Lesson chunks.

Missing:

- Track entity.
- Module entity.
- Subtopic entity.
- Pathway-specific placement.
- Optional/advanced publication flags.
- Draft/published state.
- Content version entity.
- Immutable revision history.
- CMS/import boundary.
- Source claim review decision in published content.

Current authoring format: TypeScript files. No Markdown packet or JSON import pipeline exists.

# 6. Current assessment model

| Capability | Status |
|---|---|
| Single-choice MCQ | Fully implemented |
| Multiple-choice | Implemented in model/UI |
| True/false | Not explicit |
| Code snippets in questions | Implemented |
| Code execution | Not implemented |
| Code-contains checks | Implemented |
| Free-text model type | Present, but canonical normalization converts unsupported forms to choice in many cases |
| Explanation | Implemented |
| Per-choice feedback | Not consistently modeled |
| Hints | Implemented for challenges |
| Attempts | Persisted locally |
| Scoring | Implemented locally |
| Passing threshold | Hardcoded topic-loop behavior |
| Question randomization | Limited/deterministic |
| Question banks | Absent |
| Module reviews | Absent |
| Cumulative reviews | Absent |
| Milestone assessments | Absent |
| Review queue | Implemented locally |
| Assessment analytics | Absent |

Important current rule in [topic/[slug]/page.tsx](</Users/hanyramadan/new era/projects/js2next/src/app/topic/[slug]/page.tsx>):

- One challenge required.
- Three confirmed questions required.
- Topic completion score can fall back to `60%`.
- Target should use an explicit assessment policy, preferably `80%` mastery for required content.

Challenge UI: [ChallengeAnswerForm.tsx](</Users/hanyramadan/new era/projects/js2next/src/components/shared/ChallengeAnswerForm.tsx>).

# 7. Current progress and mastery model

`UnifiedProfile` stores:

- Learner identity.
- Level.
- Diagnostic state.
- Goals.
- Topic mastery.
- Confidence.
- Mistakes.
- Attempts.
- Review dates.
- Challenge attempts.
- Lesson progress.
- Topic stages.
- Learning events.
- Streak.
- Earned capabilities.

Evidence:

- [learning/types.ts](</Users/hanyramadan/new era/projects/js2next/src/lib/learning/types.ts>)
- [mastery.ts](</Users/hanyramadan/new era/projects/js2next/src/lib/learning/mastery.ts>)
- [adaptation.ts](</Users/hanyramadan/new era/projects/js2next/src/lib/learning/adaptation.ts>)
- [learner.ts](</Users/hanyramadan/new era/projects/js2next/src/stores/learner.ts>)

Persistence:

- Zustand `persist`.
- `learn-next-learner` localStorage key.
- Settings stored separately.
- Legacy and sibling profile migration exists.
- JSON import/export exists.

Weaknesses:

- No server authority.
- No user identity.
- No cross-device sync.
- No attempt audit trail outside local storage.
- No module/track completion records.
- No time-spent measurement.
- Learning events capped at 50.
- No concurrency handling.
- Topic IDs act as global identity; no pathway placement layer.

# 8. Admin and content management

Status: absent.

No support for:

- Creating tracks/modules/topics through UI.
- Reordering curriculum.
- Editing content.
- Drafts.
- Preview.
- Publish/unpublish.
- Versioning.
- Editor roles.
- Bulk import.
- Content rollback.
- Student-performance review.

Current content workflow: edit TypeScript → run tests/build → deploy.

Recommendation: import-first authoring before full CMS.

# 9. Database and data model audit

Current database: none.

No tables, collections, migrations, ORM, or server data access.

Recommended entities:

- `users`
- `roles`
- `pathways`
- `tracks`
- `modules`
- `topics`
- `topic_placements`
- `subtopics`
- `lesson_blocks`
- `learning_objectives`
- `prerequisite_edges`
- `content_versions`
- `sources`
- `content_claims`
- `questions`
- `question_choices`
- `assessment_sets`
- `assessment_items`
- `assessment_attempts`
- `learner_topic_progress`
- `learner_lesson_progress`
- `review_items`
- `learning_events`
- `publications`

Use immutable content versions. Progress should reference `content_version_id` so curriculum edits do not corrupt historical attempts.

# 10. Platform limitations

| Target requirement | Current limitation |
|---|---|
| Three tracks | Topic families only; no true track records |
| Ordered modules/topics | Family order only |
| Topic merging | Manual source consolidation only |
| Subtopics | Unsupported |
| Prerequisites | Topic-ID prerequisite arrays only |
| Optional material | No explicit placement status |
| Advanced material | Level exists; pathway placement absent |
| MCQ assessments | Good local foundation |
| Explanations/feedback | Present, uneven granularity |
| Reattempts | Local attempts only |
| Module reviews | Missing |
| Cumulative reviews | Missing |
| Progress tracking | Topic-level local tracking |
| Future code execution | No evaluator boundary yet |
| Content versioning | Missing |
| Curriculum updates | Rebuild required |
| Analytics | Missing |
| Admin editing | Missing |
| Multi-user support | Missing |
| Privacy controls | Browser-local only |

# 11. Target product requirements

## Required initial release

- JavaScript, React, Next.js pathways.
- Track → Module → Topic → Subtopic hierarchy.
- Ordered and prerequisite-aware curriculum.
- Reusable topics with pathway placement metadata.
- Markdown-first content packets.
- Build-time JSON normalization.
- Original explanations/examples/questions/challenges.
- In-lesson checks.
- Topic quizzes.
- Module reviews.
- MCQ explanations and wrong-answer feedback.
- Reattempts.
- Learner progress.
- Responsive learner UI.
- Import validation.
- Published-content source metadata.
- Account-backed progress if multi-device product is required.

## Recommended initial release

- Import-only editor workflow.
- Preview route.
- Content audit dashboard.
- Review queue.
- Content version pinning.
- Admin/editor role model.
- Basic learning analytics.
- Progress export/import during migration.

## Future enhancements

- Full CMS.
- Adaptive scheduling.
- Notifications.
- Cohorts.
- Collaborative learning.
- Code execution sandbox.
- Repository projects.
- Rich media.
- Advanced analytics.
- ML-based recommendations.

# 12. Recommended target architecture

Keep:

- Next.js App Router.
- React.
- Tailwind design system.
- Current learner UI patterns.
- Current source/claim model.
- Pure mastery/recommendation functions.
- Existing stable content IDs where useful.

Restructure:

```text
content/
  packets/                 # Markdown source
  schema/                  # packet validation
  compiler/                # Markdown → normalized JSON

src/domain/
  curriculum/
  assessment/
  progression/
  content-trust/

src/app/
  learner routes
  admin routes
  API/server actions

database/
  schema
  migrations
```

Recommended runtime:

- Server Components for published content and read-heavy pages.
- Client Components only for answer submission, navigation, reflection, and settings.
- PostgreSQL for users, curriculum, versions, attempts, and progress.
- Typed ORM such as Drizzle.
- Auth provider behind an internal adapter.
- Server actions or route handlers for mutations.
- Pure shared assessment engine.
- Append-only learning events plus materialized progress views.
- Source/version checks in CI.
- Admin import pipeline before CMS.

# 13. Proposed content data model

Recommended TypeScript shape:

```ts
type Topic = {
  id: string;
  canonicalSlug: string;
  title: string;
  family: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  objectives: string[];
  prerequisites: string[];
  contentVersionId: string;
  status: 'draft' | 'published' | 'archived';
};

type TopicPlacement = {
  topicId: string;
  pathwayId: 'javascript' | 'react' | 'nextjs';
  moduleId: string;
  subtopicId?: string;
  order: number;
  required: boolean;
  advanced: boolean;
  optional: boolean;
};

type LessonBlock =
  | { type: 'concept'; body: string }
  | { type: 'code-example'; language: string; code: string; explanation: string }
  | { type: 'question'; questionId: string }
  | { type: 'diagram'; nodes: unknown[]; relationships: unknown[] }
  | { type: 'synthesis'; body: string };
```

Example:

```json
{
  "id": "closures-in-javascript",
  "title": "Closures in JavaScript",
  "pathwayPlacements": [
    {
      "pathwayId": "javascript",
      "moduleId": "language-foundations",
      "subtopicId": "scope-and-functions",
      "order": 2,
      "required": true
    },
    {
      "pathwayId": "react",
      "moduleId": "react-prerequisites",
      "order": 1,
      "required": false,
      "optional": true
    }
  ],
  "level": "beginner",
  "estimatedMinutes": 25,
  "prerequisites": [],
  "version": 3,
  "status": "published"
}
```

Decision: Markdown first → validated JSON runtime.

Decision: reusable topic identity + pathway-specific placement metadata.

# 14. Proposed MCQ model

```ts
type QuestionVersion = {
  id: string;
  topicId: string;
  objectiveIds: string[];
  kind: 'single-choice' | 'multi-choice' | 'true-false';
  prompt: string;
  code?: {
    language: string;
    source: string;
  };
  choices: {
    id: string;
    label: string;
    feedback?: string;
  }[];
  correctChoiceIds: string[];
  explanation: string;
  hint?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  cognitiveLevel: 'recognize' | 'predict' | 'debug' | 'explain' | 'tradeoff';
  estimatedSeconds?: number;
  tags: string[];
  sourceIds: string[];
  version: number;
  status: 'draft' | 'published' | 'retired';
};
```

Use `correctChoiceIds: string[]` now, even for one answer. Supports future multi-answer questions without schema replacement.

# 15. Proposed learner progression

Initial rules:

- Required prerequisites unlock at `0.8` mastery.
- Optional content never blocks required progression.
- Topic completion requires:
  - lesson completion;
  - required retrieval checks;
  - one practice attempt;
  - topic assessment pass.
- Recommended pass threshold: `80%`.
- Unlimited reattempts.
- Store every attempt.
- Show explanation after submission.
- Add missed/low-confidence concepts to review.
- Module completes when all required topics pass.
- Track completes when all required modules pass.
- Failed assessment does not hard-lock learner; it recommends targeted review.
- Progress references content version.

Keep this deterministic first. Add adaptive scheduling later.

# 16. Proposed assessment experience

```text
Lesson
  → retrieval check
  → practice scenario
  → topic quiz
  → result + explanation
  → retry or continue
  → review recommendation

Module
  → module review
  → prerequisite-aware questions
  → module result
  → next-module recommendation

Cumulative
  → spaced mixed questions
  → transfer/debug/tradeoff items
  → mastery report
```

Every result should show:

- Correct/incorrect.
- Why.
- Per-choice explanation where useful.
- Relevant lesson section.
- Retry action.
- Review recommendation.
- Confidence input.

# 17. Proposed admin experience

Initial:

- Markdown packet per topic.
- YAML/frontmatter metadata.
- JSON compiler.
- Schema validation.
- Duplicate-ID validation.
- Source-link validation.
- Preview route.
- Pull-request review.
- Publish manifest.

Later CMS:

- Track/module/topic tree editor.
- Drag reorder.
- Draft/preview/publish.
- Question editor.
- Version comparison.
- Rollback.
- Editor/admin roles.
- Learner-impact warnings before publishing changes.

Full CMS is not necessary for first release. Import-first is cheaper and safer.

# 18. Migration plan

## Preserve

- Stable topic IDs where semantically valid.
- Existing lesson content after human review.
- Source claim ledger.
- Current UI shell.
- Current mastery/recommendation pure functions.
- Local progress export.

## Refactor

- `TopicFamily` into pathway/module/topic placement.
- TypeScript data into packet schema.
- Progress keys into version-aware IDs.
- Assessment records into versioned question records.

## Replace

- Browser-only learner authority.
- Hardcoded topic-family map.
- Topic completion fallback scoring.
- Compatibility exports after migration stabilizes.

## Add

- Database.
- Authentication.
- Content compiler.
- Server progress mutations.
- Admin/import route.
- Module/cumulative reviews.
- E2E tests.

## Migration safety

- Keep `/topic/[slug]` URLs.
- Add redirects for changed route vocabulary.
- Allow JSON progress export before cutover.
- Map old topic IDs through explicit migration table.
- Run old and new progression calculators in shadow mode.
- Keep rollback to local-only mode during first server rollout.

# 19. Implementation phases

| Phase | Objective | Completion gate |
|---|---|---|
| 0. Identity | Reconcile `learn-next` vs `js2next`; clean repo ownership | One canonical repo/path/brand |
| 1. Content contract | Markdown packets → validated JSON | All packets compile; duplicate/source checks pass |
| 2. Curriculum | Add pathways, modules, subtopics, placements | Ordered map and prerequisite graph render |
| 3. Assessment | Versioned MCQ engine and topic/module reviews | Deterministic scoring tests pass |
| 4. Accounts/progress | Auth + database-backed learner state | Reload/device/account continuity proven |
| 5. Admin import | Preview, publish, rollback, editor roles | Non-developer can publish a topic safely |
| 6. Product hardening | E2E, accessibility, security, analytics | Critical browser flows pass in CI |
| 7. Future sandbox | Isolated code execution | Threat model, isolation, quotas, abuse controls pass |

# 20. Blockers and required decisions

| Decision | Recommendation | Can work continue? |
|---|---|---|
| Canonical repo identity | Rename/reconcile `learn-next` and `js2next` | Yes, but resolve before deployment |
| Collection format | Markdown first → JSON later | Yes |
| Topic reuse | Reusable topics + pathway placement metadata | Yes |
| Local-only vs account-backed MVP | Account-backed for real platform; local-first export remains fallback | Yes, content work can proceed |
| Mastery threshold | 80% for required completion | Yes |
| Editor workflow | Import-first before CMS | Yes |
| Auth provider | Choose one provider behind adapter | Backend phase blocked until selected |
| Roles | `admin`, `editor`, `reviewer` | CMS phase can wait |
| Human content review ownership | Required before publishing claims | Content publication blocked until assigned |

# 21. File-by-file reference

## Application

- [src/app/page.tsx](</Users/hanyramadan/new era/projects/js2next/src/app/page.tsx>) — landing and onboarding.
- [src/app/home/page.tsx](</Users/hanyramadan/new era/projects/js2next/src/app/home/page.tsx>) — dashboard/topic map.
- [src/app/topic/[slug]/page.tsx](</Users/hanyramadan/new era/projects/js2next/src/app/topic/[slug]/page.tsx>) — topic loop.
- [src/app/review/page.tsx](</Users/hanyramadan/new era/projects/js2next/src/app/review/page.tsx>) — review queue.
- [src/app/progress/page.tsx](</Users/hanyramadan/new era/projects/js2next/src/app/progress/page.tsx>) — mastery view.
- [src/app/settings/page.tsx](</Users/hanyramadan/new era/projects/js2next/src/app/settings/page.tsx>) — settings/data controls.
- [src/components/layout/AppLayout.tsx](</Users/hanyramadan/new era/projects/js2next/src/components/layout/AppLayout.tsx>) — responsive shell/navigation.

## Content

- [src/data/topics/types.ts](</Users/hanyramadan/new era/projects/js2next/src/data/topics/types.ts>) — topic contract.
- [src/data/topics/index.ts](</Users/hanyramadan/new era/projects/js2next/src/data/topics/index.ts>) — topic registry/normalization.
- [src/content/topics.ts](</Users/hanyramadan/new era/projects/js2next/src/content/topics.ts>) — canonical bundle registry.
- [src/data/curriculum.ts](</Users/hanyramadan/new era/projects/js2next/src/data/curriculum.ts>) — topic-family metadata.
- [src/lib/content/catalog.ts](</Users/hanyramadan/new era/projects/js2next/src/lib/content/catalog.ts>) — normalized catalog.
- [src/lib/content/claims.ts](</Users/hanyramadan/new era/projects/js2next/src/lib/content/claims.ts>) — claim/source ledger.
- [src/lib/content/audit.ts](</Users/hanyramadan/new era/projects/js2next/src/lib/content/audit.ts>) — human review matrix.
- [scripts/content-audit-report.mjs](</Users/hanyramadan/new era/projects/js2next/scripts/content-audit-report.mjs>) — audit command.

## Learning engine

- [src/lib/learning/types.ts](</Users/hanyramadan/new era/projects/js2next/src/lib/learning/types.ts>) — profile/progress types.
- [src/lib/learning/mastery.ts](</Users/hanyramadan/new era/projects/js2next/src/lib/learning/mastery.ts>) — scoring/mastery.
- [src/lib/learning/adaptation.ts](</Users/hanyramadan/new era/projects/js2next/src/lib/learning/adaptation.ts>) — review queue/events.
- [src/lib/learning/recommendations.ts](</Users/hanyramadan/new era/projects/js2next/src/lib/learning/recommendations.ts>) — next-topic selection.
- [src/lib/learning/migration.ts](</Users/hanyramadan/new era/projects/js2next/src/lib/learning/migration.ts>) — profile migrations.
- [src/stores/learner.ts](</Users/hanyramadan/new era/projects/js2next/src/stores/learner.ts>) — persisted learner state.
- [src/components/shared/ProgressBackup.tsx](</Users/hanyramadan/new era/projects/js2next/src/components/shared/ProgressBackup.tsx>) — JSON export/import.

## Verification

- [src](</Users/hanyramadan/new era/projects/js2next/src>) — 126 source/test files.
- [vitest.config.ts](</Users/hanyramadan/new era/projects/js2next/vitest.config.ts>) — unit test config.
- [.github/workflows/quality.yml](</Users/hanyramadan/new era/projects/js2next/.github/workflows/quality.yml>) — CI gates.
- [docs/project-schema.md](</Users/hanyramadan/new era/projects/js2next/docs/project-schema.md>) — current architecture documentation.
- [docs/review/07-unified-app-roadmap.md](</Users/hanyramadan/new era/projects/js2next/docs/review/07-unified-app-roadmap.md>) — intended roadmap.

# 22. Final recommendation

Do not rebuild the entire application.

Do rebuild the learning domain:

- Retain Next.js, React, Tailwind, app shell, content trust ledger, source validation, and pure learning algorithms.
- Replace topic-family-only content with pathway placement metadata.
- Introduce Markdown-first content packets and JSON compilation.
- Add versioned assessment/content records.
- Move learner authority from localStorage to authenticated server persistence.
- Add import-first admin workflow.
- Add module/cumulative assessments and real E2E coverage.
- Keep code execution deferred until sandbox security is designed.

Current app is a strong prototype foundation. It is not yet a complete learning platform.