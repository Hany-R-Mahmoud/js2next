# JS2Next UX Remediation Execution Plan

Status: planning only. No application implementation is authorized by this document.

## 1. Product decision

Fix trust and task completion before adding curriculum or visual novelty.

The study found no P0 issue, but repeated P1 failures affect the core learning journey:

- progress and stage state can disagree after completion or reload;
- navigation can appear active without delivering the expected destination;
- mobile navigation hides important destinations;
- onboarding assigns profile defaults that do not match the learner;
- Arabic discovery accepts input but does not help learners find English content.

The existing Learn, Practice, Check, Reflect model, explanatory feedback, mastery threshold, semantic structure, and accessibility controls should be preserved.

## 2. Evidence and confidence

| Theme | Study signal | Confidence | Product implication |
|---|---|---:|---|
| Progress and stage integrity | U01, U05, U09, U12, U13, U14; U07 saw a transient zero state | High | Learners cannot trust completion, unlocking, or the next action. |
| Navigation reliability | U01, U03, U11, U12, U15; delayed transitions in U14 | Medium-high | Reproduce against production build, then fix confirmed route failures. |
| Mobile information architecture | Search or Tracks missing in U05, U09, U11, U14; crowding/overlap in U08 and U10 | High | Current four-item bar needs a discoverable overflow contract. |
| Onboarding/profile fit | U04 and U08 through U15 | High | Starting track, experience level, and learning style are incorrectly coupled or omitted. |
| Arabic discovery | Every completed persona that exercised Arabic search reported zero, weak, or irrelevant results | High | Arabic-assisted discovery is the smallest useful localization step. |
| Full Arabic UI and RTL | No Arabic locale existed; Arabic fields often remained LTR | Medium | Treat full localization as a separate product initiative. Add bidi-safe inputs now. |
| Content polish | U15 plus isolated report notes | Medium-low | Fix after journey integrity; verify production before changing developer-only UI. |

Study limitation: 15 of 20 planned reports completed. U16 through U20 were blocked by agent quota, leaving R-M10, R-M11, and N-M05 without their planned advanced-persona coverage. Synthetic findings do not replace real Arabic-speaking learner research.

## 3. Goals, non-goals, metrics

### Goals

1. One trustworthy progress result across topic, module, Home, Progress, Review, and assessment surfaces.
2. Every visible navigation action reaches its advertised URL and content.
3. Core destinations remain discoverable at 320px and 200% zoom.
4. Onboarding records explicit learner choices and persists them.
5. Arabic queries find relevant English curriculum through aliases and clear language guidance.
6. Existing design system and learning loop remain intact.

### Non-goals

- No curriculum expansion.
- No broad visual redesign or framework migration.
- No new server account system or cloud synchronization.
- No complete Arabic translation in this initiative.
- No speculative state framework, plugin system, or generalized i18n platform.
- No unrelated cleanup.

### Release metrics

| Metric | Required result |
|---|---:|
| Complete topic/module, navigate away, reload, reopen | 100% state agreement across tested surfaces |
| Tested internal navigation actions | 100% advertised URL and content transition |
| Profile choices after reload/new route | 100% persisted |
| Arabic benchmark queries | Intended topic/module in top 3 for at least 90% of agreed benchmark |
| 320/375/768/1024/1280 layouts | No hidden required action, overlap, clipping, or horizontal overflow |
| 200% zoom and keyboard journeys | Core task completion without lost focus or content |
| Automated quality | Build, typecheck, lint, unit/integration tests green |
| Frontend audit | Production Chrome mobile and desktop gates pass; no UX removal used to improve scores |
| Post-fix learner rerun | No open P1 in the repeated core journeys |

## 4. Owner decisions before implementation

### D1. Mobile navigation contract

Recommended default:

- primary bar: Home, Search, Progress, More;
- More sheet: Tracks, Review, Settings;
- Home surfaces a prominent Review action when review is due.

Reason: four stable targets fit 320px; Search becomes directly discoverable; lower-frequency destinations remain one explicit action away. The existing `DESIGN.md` already specifies a More sheet, but current code has an empty `moreNavigation` contract and no sheet.

Alternative: keep Review primary and put Search in More. Reject unless retention is explicitly prioritized above content discovery, because Arabic and mobile users repeatedly failed to find Search.

### D2. Arabic scope

Recommended default for this initiative: English interface with Arabic-assisted discovery.

- curated Arabic aliases for tracks, modules, and common concepts;
- Arabic normalization and mixed Arabic/English matching;
- bilingual empty-state guidance;
- `dir="auto"` on free-text/search/reflection inputs;
- no page-level RTL switch until translated navigation, content, and QA exist.

### D3. Existing worktree

Current worktree contains user-owned changes in progression, stage tabs, topic/module pages, CSS, content, and reports. Before execution, the owner must checkpoint the intended baseline in a commit or explicitly identify which changes belong to the implementation baseline. Agents must not reset, stash, or overwrite this work.

## 5. Execution sequence

### Phase 0: Baseline and reproducibility

Owner: debugging/test specialist. No product behavior changes.

Tasks:

1. Record baseline commit, intended dirty changes, browser, viewport, and storage origin.
2. Run production build for behavioral reproduction. Do not use the development overlay as product evidence.
3. Build deterministic local-storage fixtures for:
   - fresh learner;
   - topic Learn complete;
   - topic mastered;
   - module practice complete;
   - module assessment passed;
   - intermediate/reflective profile;
   - Arabic reflection text.
4. Reproduce each P1 with URL, action, before/after storage snapshot, visible result, and reload result.
5. Classify findings:
   - confirmed application defect;
   - hydration/loading presentation defect;
   - automation timing artifact;
   - already fixed by current uncommitted work.
6. Verify React development tooling. If missing and not declined by owner, wire `react-grab`, `react-scan`, and `react-doctor` as development-only tooling; prove no production bundle exposure.

Exit:

- reproducibility matrix approved;
- no implementation task relies only on an unconfirmed browser timeout;
- current baseline is recoverable.

### Phase 1: Progress ownership and stage integrity

Priority: Must ship first.

Primary surfaces:

- `src/components/progress/useProgressState.ts`
- `src/components/progress/progress-model.ts`
- `src/components/assessment/AssessmentRunner.tsx`
- `src/components/practice/PracticeClient.tsx`
- `src/components/curriculum/stage-state.ts`
- `src/components/curriculum/ModuleStageTabs.tsx`
- `src/components/curriculum/TopicStageTabs.tsx`
- `src/domain/progression/`
- `src/infrastructure/local-progress/`

Implementation contract:

1. Keep one canonical owner for learning progress: `js2next.local-progress` through the existing adapter/domain functions.
2. Route assessment, practice, reflection, topic, and module writes through one update path that also notifies mounted consumers.
3. Derive Home, Progress, topic stage, module stage, and unlock state from that same snapshot.
4. Do not render default zero/locked state as learner truth before hydration. Use the existing loading/skeleton vocabulary.
5. Re-entry rules:
   - mastered topic opens at Reflect or a clear completed summary;
   - passed module Check remains passed;
   - Reflect stays reachable after submitted Check;
   - incomplete work resumes at the first valid next stage.
6. Keep profile/preferences in their existing bounded stores. Do not create a third progress representation or merge unrelated profile data into the progress domain.

Acceptance scenarios:

1. Complete topic Learn, Practice, Check; return, reload, and open from Home and Progress.
2. Complete module Practice and Check; return, reload, and open module directly.
3. Keep two tabs open; complete in one, verify the other updates.
4. Load a saved mastered state on a slow/hydration-delayed route; zero/locked state must never flash as final state.
5. Import/migrate existing valid progress and verify no mastery loss.

Required tests:

- domain aggregation and stage-state unit tests;
- storage adapter/migration tests;
- component integration test for write notification;
- browser journey covering completion, navigation, reload, and re-entry.

### Phase 2: Navigation reliability and mobile information architecture

Priority: Must ship after Phase 0 confirmation; may overlap late Phase 1 testing only if files do not conflict.

Primary surfaces:

- `src/lib/navigation.ts`
- `src/components/layout/AppLayout.tsx`
- `src/app/globals.css`
- `docs/DESIGN.md`
- navigation tests and browser journeys

Implementation contract:

1. Implement D1 in `DESIGN.md` before UI code.
2. Use real Next.js links for destinations. Do not add click handlers that duplicate routing.
3. Implement the existing design-system More-sheet primitive with native dialog/popover behavior where supported by the project pattern.
4. Required sheet behavior: labelled trigger, focus entry, focus containment, Escape close, focus restoration, inert closed state, 44px targets, safe-area padding.
5. Active styling follows actual pathname only. A failed transition must not make a destination look active.
6. Add pending feedback only where reproduced latency needs it; no decorative route motion.
7. Reserve bottom-navigation space so Settings and reset controls cannot be obscured.

Acceptance scenarios:

- test every desktop and mobile nav item from Home, Tracks, module, assessment, Search, Progress, Review, and Settings;
- verify URL, heading, active state, Back/Forward, open-in-new-tab semantics, and focus destination;
- verify 320px, 375px, 768px, and 200% zoom;
- verify direct URL remains a valid recovery path.

### Phase 3: Onboarding and profile persistence

Priority: Must ship.

Primary surfaces:

- `src/app/page.tsx`
- `src/app/onboarding/page.tsx`
- `src/stores/learner.ts`
- `src/app/settings/page.tsx`
- `src/components/layout/AppLayout.tsx`
- learner-store and onboarding browser tests

Implementation contract:

1. Decouple starting track from experience level.
2. Onboarding asks, in this order:
   - starting layer;
   - experience level;
   - learning style;
   - optional name;
   - review and confirm.
3. Starting layer sets initial focus only. It must not silently overwrite level or learning style.
4. Existing learner re-run preserves values until confirmation; Cancel leaves profile unchanged.
5. Persist level, style, pace, and focus through the installed Zustand version's verified hydration lifecycle.
6. Hide default-profile copy until hydration completes. Do not show Beginner/Active as a transient persisted value.
7. Settings changes one field without mutating unrelated fields.
8. Use concise select labels with supporting descriptions outside native options to prevent truncation.

Acceptance scenarios:

- all 3 starting layers crossed with Beginner, Intermediate, and Advanced selections;
- Visual, Verbal, Active, and Reflective persist after reload;
- changing accessibility does not change focus;
- re-running onboarding can be cancelled safely;
- Arabic and long Latin names remain intact.

### Phase 4: Arabic-assisted discovery and bidi-safe input

Priority: Should ship with the trust fixes; can execute in parallel with Phase 3 after Phase 0.

Primary surfaces:

- `src/lib/content/search.ts`
- `src/lib/content/search.test.ts`
- `src/app/search/SearchPageContent.tsx`
- `src/app/home/page.tsx`
- `src/components/shared/SearchBar.tsx`
- topic/module reflection fields
- a small, curriculum-owned Arabic alias data file only if needed by two current search surfaces

Implementation contract:

1. Use one shared search-normalization contract for Home and Search.
2. Normalize Arabic diacritics, tatweel, common alef variants, whitespace, and case without damaging English tokens.
3. Add reviewed Arabic aliases only for current curriculum concepts. No machine-generated runtime translation.
4. Rank exact aliases above partial mixed-language matches.
5. Empty state explains that lesson content is English and offers an English equivalent when known.
6. Use `dir="auto"` for search, name, and reflection inputs; preserve code and technical tokens LTR.
7. Keep `<html lang="en">` until a real Arabic locale exists.

Initial benchmark examples:

| Arabic query | Expected English target |
|---|---|
| جافاسكريبت | JavaScript track/topics |
| الإغلاقات / إغلاق | Closures |
| إدارة الحالة | State management |
| المكونات | Components |
| الوعود | Promises |
| البرمجة غير المتزامنة | Asynchronous JavaScript |
| مكونات الخادم | React Server Components |
| التخزين المؤقت | Caching |

Acceptance:

- agreed benchmark reaches intended result in top 3;
- unknown Arabic query gets honest guidance, not an empty-library implication;
- mixed Arabic/English query does not match only the English token while ignoring Arabic intent;
- Arabic reflection survives save, reload, cursor movement, and mixed technical text.

### Phase 5: Responsive, accessibility, and content hardening

Priority: Ship before release; start after structural flows stabilize.

Tasks:

1. Fix bottom-safe-area overlap, crowded navigation labels, and long-control truncation.
2. Verify no horizontal overflow at 320px and 200% zoom.
3. Verify visible focus, keyboard order, touch targets, reduced motion, high contrast, and font-size controls.
4. Audit literal Markdown/backticks and API casing in visible titles, especially `useState` and `useReducer`.
5. Reproduce assessment feedback-order concern before changing stable question/feedback ordering.
6. Verify “Open Next.js Dev Tools” is absent in production. If absent, close as development-only evidence; do not add product code.
7. Preserve existing product register: restrained dark learning studio, clear next action, no gamification or decorative motion.

## 6. Pull-request boundaries

| PR | Scope | Dependency | Merge gate |
|---|---|---|---|
| PR1 | Progress ownership, hydration, re-entry | Phase 0 | State-integrity browser journey and migrations green |
| PR2 | Navigation reliability and mobile More sheet | D1, Phase 0 | Full route matrix and responsive/keyboard proof |
| PR3 | Onboarding and profile persistence | Phase 0; coordinate with PR2 AppLayout changes | Profile matrix and reload proof |
| PR4 | Arabic search aliases, normalization, bidi inputs | D2 | Search benchmark and Arabic input proof |
| PR5 | Responsive/accessibility/content hardening | PR1-PR4 | Visual QA, accessibility, production audits |

Keep each PR independently reviewable. Do not combine broad refactors, visual redesign, or curriculum work with these fixes.

## 7. Implementation handoff contract

Each future `agent-implementer` packet must include:

- exact phase and acceptance scenario;
- files in scope and files explicitly excluded;
- current baseline commit and overlapping user-owned changes;
- persona/journey served;
- existing `DESIGN.md` tokens and primitives to preserve;
- required loading, empty, error, success, disabled, focus, and recovery states;
- required tests and real-browser evidence;
- status: `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, or `BLOCKED`.

Workers must return `BLOCKED` rather than inventing an unresolved product decision or visual direction.

## 8. Clean-code and scope guard

Run `clean-code-guard` on every implementation diff before review:

- one progress owner; no duplicate state abstraction;
- no new dependency without a verified present need and installed-version check;
- no broad catch that hides storage or migration failure;
- no generic helper/manager naming;
- small functions, maximum four parameters, bounded complexity;
- no speculative locale framework, feature flags, factories, or interfaces;
- no copied search logic across Home and Search;
- no hardcoded success, placeholder copy, dead code, unused imports, or weakened tests;
- match neighboring project style and existing adapter/store patterns;
- behavior changes and refactors remain separate review units.

## 9. Verification and release gates

### Per PR

1. Targeted unit and integration tests.
2. `npm run typecheck`.
3. `npm run lint`.
4. Relevant browser journey on actual rendered UI.
5. Clean-code guard pass.

### Final integrated build

1. `npm test` and project release validators.
2. Production build and start, not development-server measurement.
3. `/visual-qa` at 375, 768, and 1280px, plus explicit 320px and 200% zoom stress checks.
4. Keyboard journeys for onboarding, navigation, module stages, Search, Settings, and assessment return paths.
5. WCAG 2.2 AA checks including contrast, semantics, focus, touch, reduced motion, high contrast, and text resizing.
6. Real Chrome Lighthouse mobile and desktop, 3-5 runs with median; diagnose failures from JSON. Do not remove useful behavior for scores.
7. React static/runtime checks using the approved development-only tooling.
8. Lane C review: objective artifacts first, then design critique, accessibility review, Nielsen walkthrough, and persona walkthrough.
9. Independent implementation review with every Critical/Major issue fixed, escalated, or explicitly blocking.

### Learner validation

1. Repeat core journeys with representative U01, U08, U12, U14, and U15 personas.
2. Complete the missing U16-U20 advanced wave after quota is available.
3. Before claiming regional validation, test with real Arabic-speaking learners; synthetic personas establish hypotheses, not market proof.

## 10. Recommended dispatch order

1. Debugging/test specialist: Phase 0 reproduction matrix.
2. `agent-implementer`: PR1 progress integrity.
3. Product owner confirms D1 and D2 while PR1 runs.
4. `agent-implementer` + frontend guidance: PR2 and PR3 in isolated file scopes.
5. `agent-implementer` + frontend guidance: PR4.
6. Frontend/accessibility specialist: PR5 hardening.
7. Reviewer, tester, visual QA, clean-code guard, then final integrated review.

## 11. Plan completion criteria

Planning is complete when:

- D1-D3 are accepted or revised;
- current WIP baseline is checkpointed;
- each PR has an owner and file scope;
- Phase 0 evidence matrix exists;
- implementation begins only from a confirmed defect and testable acceptance scenario.
