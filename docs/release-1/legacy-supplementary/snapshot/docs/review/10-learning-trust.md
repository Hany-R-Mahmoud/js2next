# Learning trust and adaptation review

- Audit date: 2026-07-15.
- Scope: `src/lib/content`, `src/lib/learning`, and learner persistence seams.

## Delivered

- `validateClaimCoverage` compares claim-backed content IDs with the canonical catalog, reports covered and uncovered IDs, calculates a ratio, and rejects duplicate or non-normalized claim IDs.
- `recommendNextContent` provides a pure adaptive selector: due review first, then lowest recorded mastery below 0.8, then unstarted lesson.
- `getChallengeLadderRubric` projects the existing challenge level, acceptance criteria, hints, expected reasoning, and common wrong paths without changing persisted profile or challenge schemas.

## Deliberate boundary

- `buildDailyPackage` now composes one deterministic lesson/challenge/QA/practice session from the adaptive recommendation. It is surfaced on the dashboard without persistence or a scheduler.
- No new rubric scoring algorithm added. Existing challenge data already supplies the rubric inputs; scoring remains the existing challenge evaluator's responsibility.

## Daily-package decision

- Keep `buildDailyPackage` deterministic and non-persistent in the current local-first phase.
- Defer reminders, scheduling, and cross-device package ownership until cadence, timezone, privacy, and sync requirements are explicit.
- This avoids creating a background-work contract that the current learner profile and product surfaces do not define.

## Evidence

- Focused tests cover claim normalization/coverage, due/weak/new recommendation ordering, and challenge-ladder rubric projection.
- Full catalog coverage now passes: every published lesson, challenge, QA, and practice identity has at least one claim record tied to its direct source.
- The ledger now contains 136 claim records with direct MDN, TanStack, React, Next.js, OWASP, TypeScript, Testing Library, Playwright, Redux Toolkit, React Router, and Zod provenance; the pinned-version statement/conflict review passes.

## Version review receipt

- The pinned Next.js `15.5.20` claims were checked against versioned Next.js 15 guides and references.
- All claims now have `high` or `medium` confidence; `needs-review` is reserved for a future version-mismatch queue and is guarded by tests.
- The remaining confidence-limited claims are intentionally framed as guidance or measurement practice, not universal framework behavior.
- A framework or library upgrade must update the relevant source URL, framework version, conflict note, and focused claim test before content changes ship.
