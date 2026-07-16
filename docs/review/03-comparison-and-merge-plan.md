# Comparison and Merge Plan

## Decision

- Merge into one product.
- Choose `learn-react` as target architecture.
- Port `learn-next` content and selected visual tokens.
- Keep one app shell, one learner profile, one mastery algorithm, one route vocabulary, and one source policy.
- Preserve local-first behavior in the first merged release.

## Current implementation correction

- The comparison below is the original merge decision record. The active implementation now lives in `learn-next` and has completed the first foundation slice.
- Canonical mastery is normalized to `0–1` internally, with percentage formatting only at UI boundaries.
- Challenge progress now uses `challenge:<slug>` IDs, while URL slugs remain human-readable route addresses.
- Local export and import now accept the unified profile plus legacy `learn-react` v1 and older learner-state envelopes.

## Capability comparison

- Content breadth:
  - Winner: `learn-next`.
  - Reason: 11 lessons, 12 Q&A entries, 8 practice cards, and more explicit production scenarios.
- Content structure:
  - Winner: `learn-react`.
  - Reason: per-topic schema includes chunks, predictions, diagrams, mini-projects, retrieval, reflection, mistakes, and sources.
- Lesson pedagogy:
  - Winner: `learn-react`.
  - Reason: outline → diagnostic → teach → depth → complete loop.
- Challenge breadth:
  - Tie.
  - Both have 10 levels.
- Challenge quality:
  - Winner: `learn-react`.
  - Reason: answer checking, attempts, hints, reveal state, confidence, mastery, and review updates.
- Progress persistence:
  - Winner: `learn-react`.
  - Reason: profile-wide persisted progress, review schedule, export/import/reset.
- Next.js-specific practical content:
  - Slight winner: `learn-next`.
  - Reason: richer production, caching, deployment, performance, and architecture scenarios.
- Engineering verification:
  - Winner: `learn-react`.
  - Reason: typecheck and 14 tests pass.
- Desktop visual simplicity:
  - Winner: `learn-next`.
  - Reason: focused sidebar/dashboard and warm light theme.
- Responsive/accessibility baseline:
  - Winner: `learn-react`.
  - Reason: skip link, header/mobile nav, semantic labels, reduced motion, and consistent controls.

## Schema conflicts to resolve first

- Lesson model:
  - `learn-next`: `Lesson.sections` with concept, code, question, synthesis, and diagram sections.
  - `learn-react`: `Topic.content.chunks` plus diagnostic, depth, practices, projects, and sources.
  - Decision: use the existing learn-next `Lesson` runtime contract as the first canonical route-facing model; preserve learn-react's richer topic/chunk fields through an explicit normalized content layer before deleting either source shape. `Topic` is source material from learn-react, not the current runtime type.
- Mastery scale:
  - Historical `learn-next`: mastery appears to use `0–100`.
  - `learn-react`: mastery uses `0–1`.
  - Decision: use `0–1` everywhere; format percentages only at the UI boundary.
- Challenge identity:
  - Historical `learn-next`: `slug`.
  - `learn-react`: `id`.
  - Decision: canonical `id` plus optional stable `slug` for URLs.
- Challenge submission:
  - `learn-next`: free-form approach text.
  - `learn-react`: typed answer plus check type.
  - Decision: keep typed `checkType`; add an optional reasoning textarea to every challenge.
- Learning styles:
  - `learn-next`: visual, verbal, active, reflective.
  - `learn-react`: visual, causal, socratic, concise, detailed.
  - Decision: separate `explanationStyle` from `practiceMode`; do not pretend self-reported learning styles are strong evidence of better learning.
- Profile fields:
  - Merge strengths, weaknesses, goals, confidence, review schedule, mistake log, streak, accessibility, and content language.
- Versioning:
  - Add a profile migration function before changing persisted shape.
  - Never silently reinterpret old mastery values.

## Merge sequence

- Phase 1: freeze and inventory.
  - Record commit/version of each project.
  - Copy neither `node_modules` nor `.next`.
  - Preserve both source trees outside the target until tests pass.
- Phase 2: establish canonical types.
  - Keep `learn-next/src/types/index.ts` for the current route-facing `Lesson`, challenge, QA, and practice contracts; use learn-react's richer fields as normalization input rather than silently replacing the live model.
  - Add stable `contentVersion`, source metadata, challenge `slug`, and migration version.
- Phase 3: port content.
  - Convert every `learn-next` lesson into a canonical topic.
  - Port challenge metadata and preserve level order.
  - Deduplicate QA and best practices by concept, not only by title.
  - Add source/date/version fields to every technical claim.
- Phase 4: unify learner engine.
  - Keep `learn-react` persistence and mastery functions.
  - Add lesson completion and challenge completion events to one event path.
  - Keep localStorage first; add export/import compatibility for both old keys.
- Phase 5: unify routes and shell.
  - Keep the working learn-next route model while the normalized layer lands: `/`, `/dashboard`, `/curriculum`, `/lesson/[slug]`, `/challenge/[slug]`, `/qa`, and `/best-practices`.
  - Add onboarding and review routes only when their learner-state ownership and persistence contracts are implemented; do not create route aliases that split identity.
  - Add a `/challenges` list route if needed; do not keep duplicate slug route conventions.
- Phase 6: merge visual language.
  - Keep ReactPath layout, skip link, mobile nav, and reusable components.
  - Import Learn Next warm paper palette as the default light theme.
  - Keep dark mode as a deliberate theme, not an accidental OS-only state.
- Phase 7: verification gate.
  - Schema tests for all imported content.
  - Mastery/recommendation tests.
  - E2E onboarding → lesson → challenge → review flow.
  - Keyboard and accessibility smoke.
  - Build, typecheck, lint, and browser smoke.

## Merge acceptance criteria

- One install and one dev command.
- Every imported lesson is reachable from the curriculum.
- Every challenge updates progress or explicitly says it is unscored practice.
- Refreshing mid-lesson preserves position.
- Wrong answers create useful feedback and review scheduling.
- The user can export and re-import merged progress.
- No content ID collisions.
- No source link without a source label and review date.
- No generated `.next` files in lint scope.
- Core user flow works at desktop and mobile widths.
