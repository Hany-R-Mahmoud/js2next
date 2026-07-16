# Impeccable UI/UX Audit

Date: 2026-07-16  
Scope: existing UI only. No platform structure change proposed.

Note: the findings below preserve the original audit snapshot. Current implementation status is tracked in the final checklist.

## Executive summary

Overall health: **13/20, Acceptable.** The platform is usable and has a coherent dark product UI, but repeated learning surfaces still create avoidable friction.

| Dimension | Score | Finding |
|---|---:|---|
| Accessibility | 3/4 | Good landmarks, focus treatment, labels, and live feedback. Reusable form IDs and the confirm flow remain weak points. |
| Performance | 3/4 | No large runtime dependency or layout-thrash issue found. Catalog work and long topic lists repeat on client renders. |
| Theming | 2/4 | Visual tokens exist, but CSS variables and Tailwind color literals are two sources of truth. |
| Responsive design | 3/4 | 375px and 360px content widths showed no horizontal overflow. Narrow screens remain dense and scroll-heavy. |
| Anti-patterns | 2/4 | Card-heavy catalog screens, repeated tracked uppercase labels, and duplicated content navigation reduce product clarity. |

P0: 0  
P1: 4  
P2: 13  
P3: 8

## Anti-pattern verdict

**Pass with reservations.** It does not look like an AI-generated marketing page. The product register is mostly familiar and restrained. The main tells are product-level: repeated card containers, repeated tiny uppercase eyebrows, and two large topic catalogs that ask users to scan instead of helping them choose.

## Per-target scorecard

Scores are `Accessibility / Performance / Theming / Responsive / Anti-patterns`, each out of 4.

| Target | Score | Assessment |
|---|---:|---|
| `src/components/layout/AppLayout.tsx` | 16/20 | Strong shell and keyboard handling. Mobile navigation is intentionally minimal, but the hidden-sheet model is more complex than the current empty More menu needs. |
| `src/app/globals.css` + `tailwind.config.ts` | 14/20 | Good base states and reduced-motion support. Token ownership is split and component styles are card/button heavy. |
| `src/app/home/page.tsx` | 14/20 | Clear recommendation first. Topic discovery becomes a 33-card scan with only one select filter. |
| `src/app/topic/[slug]/page.tsx` | 12/20 | Best learning surface, but confirmation is self-attestation, prose is dense, and repeated form contracts have accessibility debt. |
| `src/app/progress/page.tsx` | 14/20 | Useful weak-spots section. The mastery map repeats the full catalog and has little visual prioritization at 0%. |
| `src/app/settings/page.tsx` | 17/20 | Clear groups, good labels, and usable controls. Destructive and import/export feedback can be more explicit. |
| `src/app/page.tsx` + `src/app/onboarding/page.tsx` | 15/20 | Friendly entry flow with accessible buttons. Diagnostic progress starts at 0% for question 1 and has no back step. |
| `src/app/review/page.tsx` | 17/20 | Focused and simple. Empty state is clear, though the page intentionally removes global navigation. |
| `src/app/not-found.tsx` | 16/20 | Minimal, readable recovery path. It only explains missing topics, not general route recovery. |
| `src/app/design-system/page.tsx` | 13/20 | Useful reference surface, but it demonstrates the same repeated eyebrow/card patterns it should help prevent. |

## Findings by target

### 1. App shell and navigation

Files: `src/app/layout.tsx`, `src/components/layout/AppLayout.tsx`, `src/lib/navigation.ts`

What works:

- Persistent desktop navigation and fixed mobile navigation are easy to locate.
- Skip link, landmarks, `aria-current`, `Escape` close, focus restoration, `inert`, and reduced-motion handling are present.
- The mobile label `Learn` correctly represents the home/topic surface.

Findings:

- **[P2] Empty More-menu architecture.** `moreNavigation` is currently empty, while `AppLayout` still carries the full bottom-sheet focus-trap implementation. This adds interaction code without giving mobile users another destination. It also leaves the closed sheet logic difficult to reason about during future navigation changes.
  - Location: `src/lib/navigation.ts:17`, `src/components/layout/AppLayout.tsx:117-218`
  - Recommendation: keep the shell, but simplify or defer the sheet until a real More destination exists. `$impeccable distill`
- **[P3] Navigation surface has two visual systems.** Desktop uses left-nav pills; mobile uses bottom-nav pills. Both work, but active-state hierarchy and spacing should be checked as one component rather than tuned independently.
  - Location: `src/components/layout/AppLayout.tsx:145-222`, `src/app/globals.css:94-114`
  - Recommendation: define one navigation state vocabulary and tune desktop/mobile variants from it. `$impeccable polish`

### 2. Global styles and theme tokens

Files: `src/app/globals.css`, `tailwind.config.ts`

What works:

- Primary, secondary, disabled, focus, reduced-motion, and high-contrast states exist.
- Touch targets use `min-h-11` consistently.
- Dark surfaces, white text, blue information states, red actions, and lime mastery states are coherent.

Findings:

- **[P2] Two sources of truth for colors.** CSS variables are declared in `globals.css`, while the same values are repeated as Tailwind literals in `tailwind.config.ts`. A token change can update one layer and silently leave the other stale.
  - Location: `src/app/globals.css:5-23`, `tailwind.config.ts:12-37`
  - Impact: theme changes become risky and visual drift accumulates across repeated components.
  - Recommendation: keep one semantic token source and expose aliases from it. `$impeccable colorize`
- **[P2] Card is the default answer across the product.** `.card` adds surface, border, radius, shadow, and transition; most routes then stack several cards in sequence. This makes sections visually equal when the learning flow needs a clearer primary/secondary hierarchy.
  - Location: `src/app/globals.css:69-72`, used throughout `src/app/*` and `src/components/shared/*`
  - Recommendation: reserve cards for decision boundaries; use dividers, open sections, and inline panels for supporting content. `$impeccable distill`
- **[P3] Motion duration exceeds the product register.** `ProgressBar` uses a 500ms transition while `DESIGN.md` defines 100-150ms micro transitions and 200-300ms standard transitions.
  - Location: `src/components/shared/ProgressBar.tsx:28`
  - Recommendation: align progress movement with the shared motion scale. `$impeccable animate`

### 3. Home and topic discovery

File: `src/app/home/page.tsx`

What works:

- The recommendation is above the map and has a clear primary action.
- Onboarding and review due states are visible without blocking the learner.
- Browser QA at 375px showed no horizontal overflow.

Findings:

- **[P1] Topic map is a long scan.** The page renders all 33 topics as similarly weighted cards. The only discovery control is a family select. Users who know the topic name, want a deep-dive, or return to a specific weak spot must scan a long list.
  - Location: `src/app/home/page.tsx:90-129`
  - Impact: high cognitive load and weak findability on mobile; the page behaves like a catalog instead of a next-action surface.
  - Recommendation: add search or grouped collapsible families, keep the recommendation prominent, and show progress states with stronger prioritization. `$impeccable clarify` then `$impeccable layout`
- **[P2] Progress is duplicated visually.** The suggestion, the topic map, and topic-card status all repeat similar title, mastery, time, and readiness information.
  - Location: `src/app/home/page.tsx:78-125`
  - Recommendation: let the suggestion own the next action; reduce repeated metadata in the map. `$impeccable distill`
- **[P3] Repeated eyebrow pattern.** `Home`, `Review due`, `Today’s suggestion`, and `Explore` all use tiny uppercase tracked labels. This is readable, but repeated too often and weakens hierarchy.
  - Location: `src/app/home/page.tsx:45,69,80,93`
  - Recommendation: keep one contextual label, use normal-case section headings for the rest. `$impeccable quieter`

### 4. Topic template

File: `src/app/topic/[slug]/page.tsx`

What works:

- The learn, practice, and confirm stages are visible and navigable.
- The recently added knowledge check has an actual submit action and persisted feedback.
- Code, source attribution, retrieval practice, and mini-project notes stay inside the lesson context.
- Clean browser navigation after a fresh dev restart produced no console errors.

Findings:

- **[P1] Confirm stage is still self-attestation, not understanding checking.** The learner sees the answer, then clicks `I can explain this`. No answer field, prompt response, or validation exists.
  - Location: `src/app/topic/[slug]/page.tsx:310-333`
  - Impact: the final mastery gate can be completed without demonstrating retrieval, which conflicts with the product goal of durable understanding.
  - Recommendation: add a short response or structured choice before reveal, then provide feedback and preserve the answer. `$impeccable shape` then `$impeccable clarify`
- **[P1] Reusable typed challenge has duplicate IDs when repeated.** `ChallengeAnswerForm` renders `id="typed-answer"` for every free-text/code challenge. The topic page can render up to three practice challenges.
  - Location: `src/components/shared/ChallengeAnswerForm.tsx:98-106`, mounted from `src/app/topic/[slug]/page.tsx:276-301`
  - Impact: labels and assistive technology can target the wrong textarea; HTML IDs are not unique.
  - Recommendation: derive the ID from `challenge.slug` and make the challenge a native form. `$impeccable harden`
- **[P2] Lesson prose is too wide for focused reading.** Section text sits in a `max-w-3xl` page without a narrower prose measure.
  - Location: `src/app/topic/[slug]/page.tsx:210-221,365-369`
  - Impact: long explanations become harder to track, especially on desktop where the content width approaches 768px.
  - Recommendation: cap explanatory copy near 65-75ch while allowing code and diagrams to use wider measures. `$impeccable typeset`
- **[P2] Dense nested panels compete with the lesson.** Each lesson section, practice note, retrieval checkpoint, mini-project, challenge prompt, and feedback block gets its own boundary.
  - Location: `src/app/topic/[slug]/page.tsx:242-263`, `src/components/shared/LessonExtras.tsx:50-133`
  - Recommendation: use one primary surface per act and reserve borders for input, feedback, or true decision boundaries. `$impeccable distill`
- **[P2] Generic `aria-label` is used for a non-landmark wrapper.** The `LessonExtras` root is a plain `div`; its label does not create a meaningful region in all assistive technology.
  - Location: `src/components/shared/LessonExtras.tsx:45-47`
  - Recommendation: use a labelled `section` or remove the label if the child sections already provide the needed structure. `$impeccable harden`

### 5. Progress page

File: `src/app/progress/page.tsx`

What works:

- Mastery has numeric context plus a native progressbar.
- Weak spots are prioritized separately from recent activity.
- Links expose topic title, family, and mastery in accessible names.

Findings:

- **[P1] Mastery map repeats the full 33-topic catalog.** It creates a second long scan after Home, while the weak-spots section already provides prioritization.
  - Location: `src/app/progress/page.tsx:29-40`
  - Impact: progress becomes a duplicate directory instead of a compact view of change and next action.
  - Recommendation: group by family, collapse untouched families, or prioritize only started topics with an explicit “show all” control. `$impeccable layout`
- **[P2] Zero-state map has low information density.** At 0%, every topic has the same visual bar and weight, so the map does not help a new learner decide what matters.
  - Location: `src/app/progress/page.tsx:36-40`
  - Recommendation: show “not started”, “in progress”, and “mastered” as explicit states and use weak spots/recommendation as the default view. `$impeccable clarify`
- **[P3] Activity labels expose raw topic IDs.** Recent activity renders `event.topicId`, which is less readable than the topic title.
  - Location: `src/app/progress/page.tsx:52`
  - Recommendation: resolve IDs to titles before display. `$impeccable clarify`

### 6. Settings

File: `src/app/settings/page.tsx`

What works:

- Form controls have explicit labels and 44px minimum heights.
- Accessibility settings are discoverable and represented as switches.
- Import/export and reset are grouped under Data.

Findings:

- **[P2] Destructive reset feedback is browser-native only.** The confirmation uses `window.confirm`, and the result of reset is not announced in the page status region.
  - Location: `src/app/settings/page.tsx:35-40,208-213`
  - Impact: keyboard and screen-reader users get a weaker recovery/confirmation experience than the export/import path.
  - Recommendation: use an inline confirmation state and announce completion or cancellation. `$impeccable harden`
- **[P3] Import is visually a label, not an obvious file-control state.** The hidden file input is valid, but there is no selected filename, progress, or error recovery beyond a text message.
  - Location: `src/app/settings/page.tsx:203-213`
  - Recommendation: show selected file and import result inline. `$impeccable polish`

### 7. Onboarding and diagnostic

Files: `src/app/page.tsx`, `src/app/onboarding/page.tsx`

What works:

- The four-question flow is short and keyboard reachable.
- Name entry is a real form with a labelled input.
- The onboarding alias avoids a second implementation.

Findings:

- **[P2] Diagnostic progress starts at 0% on question 1.** The visual progress value uses `questionIndex`, while the visible copy says `Question 1 of 4`.
  - Location: `src/app/page.tsx:208-209`
  - Impact: the first state communicates no progress after the learner has already started.
  - Recommendation: represent the current question as completed progress or label the bar as remaining progress. `$impeccable clarify`
- **[P2] No back action during diagnostic.** Selecting an option immediately advances, with no way to revise the previous answer.
  - Location: `src/app/page.tsx:67-89,205-229`
  - Impact: a mistaken click forces the learner to continue with a possibly wrong profile signal.
  - Recommendation: add a previous action and preserve the selected answer per question. `$impeccable onboard`
- **[P3] Identical feature-card trio uses numbered markers.** The three cards are visually uniform and use `01/02/03`, which reads as decorative scaffolding rather than a required sequence.
  - Location: `src/app/page.tsx:179-191`
  - Recommendation: use one compact benefit list or vary the hierarchy around the primary diagnostic action. `$impeccable quieter`

### 8. Review page

File: `src/app/review/page.tsx`

What works:

- Focused review intentionally removes navigation noise.
- The answer remains hidden until the learner requests it.
- Empty state provides a direct return to Home.

Findings:

- **[P2] Review completion has no next learning action.** `Your next session is ready` only offers `Back to home`, even though the system knows the queue is empty.
  - Location: `src/app/review/page.tsx:42-50`
  - Recommendation: link directly to the next recommended topic or show why the learner should return later. `$impeccable clarify`

### 9. Not-found page

File: `src/app/not-found.tsx`

What works:

- Clear error title and direct recovery link.
- Small, focused surface with no distracting chrome.

Finding:

- **[P3] Recovery copy assumes every 404 is a topic error.** Missing settings, progress, or malformed routes receive topic-specific language.
  - Location: `src/app/not-found.tsx:11`
  - Recommendation: use route-neutral copy, optionally include the attempted path. `$impeccable clarify`

### 10. Design-system showcase

File: `src/app/design-system/page.tsx`

Findings:

- **[P2] Showcase demonstrates incomplete disclosure semantics.** `Accordion` exposes `aria-expanded` but does not connect the button to a labelled content panel with `aria-controls`.
  - Location: `src/components/shared/Accordion.tsx:15-35`
  - Recommendation: add a stable content ID and `aria-controls`, or use native `<details>`. `$impeccable harden`
- **[P3] Showcase repeats production anti-patterns.** It uses multiple identical cards and repeated tracked uppercase labels, so it documents the visual language without documenting when not to use it.
  - Location: `src/app/design-system/page.tsx:17-95`
  - Recommendation: add usage guidance and negative examples for hierarchy, density, and non-card sections. `$impeccable document`

## Shared component audit

| File | Status | Finding |
|---|---|---|
| `src/components/shared/ProgressBar.tsx` | Good with polish | Native progress semantics and visible percentage. 500ms motion is slower than the product register. |
| `src/components/shared/CodeBlock.tsx` | Needs hardening | Copy action has no `.catch()` or user-facing failure state if clipboard permission is denied. Location: lines 14-18. `$impeccable harden` |
| `src/components/shared/ChallengeAnswerForm.tsx` | Needs priority fix | Duplicate `typed-answer` IDs, plus explicit button handling instead of a native form. Locations: lines 98-111. `$impeccable harden` |
| `src/components/shared/SourceAttribution.tsx` | Good with polish | Long source links are readable and wrap at 375px. Repeated `new URL()` parsing is avoidable but low impact. |
| `src/components/shared/MasteryBadge.tsx` | Good | Text label carries the state, so color is not the only signal. |
| `src/components/shared/Accordion.tsx` | Needs hardening | Missing `aria-controls` relationship. It is currently demo-only but should be safe before reuse. |
| `src/components/shared/SearchBar.tsx` | Unused / future debt | Not mounted anywhere. It also uses a fixed `search-input` ID, unsafe for multiple instances. Remove until needed or make the ID instance-safe. |
| `src/components/shared/KnowledgeCheckForm.tsx` | Good | Native form submit, radio group, disabled state, live result, and persisted answer feedback are present. |
| `src/components/shared/LessonExtras.tsx` | Needs polish | Root wrapper is not a landmark; static heading IDs are not instance-safe; nested panel density is high. |

## Systemic patterns

1. **Catalog overload:** Home and Progress both render the complete 33-topic set.
2. **Card dominance:** most sections use the same surface treatment, flattening importance.
3. **Eyebrow repetition:** tiny uppercase tracked labels appear across nearly every route and component.
4. **Token duplication:** CSS variables and Tailwind literals duplicate the same theme values.
5. **Flow validation gap:** learning content has a checked quiz, but the final confirm stage remains self-reported.
6. **Repeated-form contract debt:** IDs and native form semantics are not consistently instance-safe.

## Positive findings to preserve

- Local-first progress with export/import support.
- Strong baseline focus-visible treatment and 44px controls.
- Reduced-motion and high-contrast settings are present.
- Topic stage tabs expose current state and locked states.
- Knowledge-check feedback uses a live status region and preserves reasoning.
- Clean 375px browser checks showed no horizontal overflow.
- Fresh browser navigation after a clean dev restart showed zero console errors.
- Typecheck, lint, and test suite pass: 63 tests passed, 1 skipped.

## Recommended action order

1. **[P1] `$impeccable shape`**: design a real confirm-stage response and feedback loop.
2. **[P1] `$impeccable harden`**: make repeated challenge IDs unique and native form semantics consistent.
3. **[P1] `$impeccable layout`**: reduce Home/Progress catalog scanning with grouping, search, and explicit prioritization.
4. **[P2] `$impeccable colorize`**: consolidate theme token ownership.
5. **[P2] `$impeccable typeset`**: cap lesson prose measure and reduce dense reading blocks.
6. **[P2] `$impeccable clarify`**: fix diagnostic progress, activity titles, reset feedback, and review completion copy.
7. **[P2] `$impeccable harden`**: finish Accordion, clipboard failure, and reusable landmark semantics.
8. **[P3] `$impeccable quieter`**: reduce repeated eyebrows and decorative numbered cards.
9. **[P3] `$impeccable polish`**: final cross-route consistency pass.

This report intentionally recommends UI/UX refinement only. It does not recommend changing the app’s route architecture, learning data model, or platform structure.

## Execution status

Implemented in the current UI pass:

- [x] Confirm-stage response fields with persisted responses, reveal gating, and feedback.
- [x] Instance-safe challenge, search, lesson-extension, and accordion IDs with native form semantics.
- [x] Search and result counts for the Home and Progress topic maps.
- [x] Diagnostic progress/back navigation and selected-answer persistence.
- [x] Activity title resolution, reset feedback, empty-review next action, route-neutral 404 copy, clipboard failure feedback, and faster progress motion.
- [x] Shared theme channel tokens, lesson reading measure, and reduced repeated production eyebrows.
- [x] Cached canonical content catalog for repeated recommendation/source lookups.
- [x] Design-system surface guidance with positive/negative card and disclosure usage examples.
- [x] Reduced outer card nesting on Progress so the mastery map and activity sections read as an open hierarchy.
- [x] Removed decorative numbered onboarding cards in favor of open supporting copy.
- [x] Removed the unreachable mobile More-sheet surface and unified desktop/mobile active navigation state styling.
- [x] Progress now defaults to started topics, exposes an explicit Show all topics action, and explains the untouched zero state.
- [x] Settings now uses inline reset confirmation and shows selected import filenames with specific import errors.
- [x] Reduced nested topic and lesson-extension panels, and made source URL parsing and reusable lesson IDs instance-safe.
- [x] Final cross-route browser pass completed at 375px and 1280px with zero console errors and no horizontal overflow.

All recommendations in this audit are now implemented within the requested UI/UX scope. Route architecture, learning data, and platform structure remain unchanged.
