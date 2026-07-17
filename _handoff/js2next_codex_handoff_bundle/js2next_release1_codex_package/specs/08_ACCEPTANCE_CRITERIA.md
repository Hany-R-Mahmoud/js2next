# Acceptance Criteria

## Inventory

- Exactly 3 tracks: JavaScript, React, Next.js.
- Exactly 27 modules.
- Exactly 79 topic packets.
- Every topic ID and question ID is unique.
- Every required topic has at least 3 in-lesson checks and 5 topic-quiz questions.
- Exactly 27 module review sets.
- Exactly 3 cumulative review sets.
- Every question and prerequisite reference resolves.

## Content authority

- New packets are the only learning content loaded by the new runtime.
- Legacy instructional files are outside the runtime import graph.
- No transcript passage is copied into learner content.
- Every packet remains draft until human approval.
- A publication manifest cannot include `pending-human-review` content.

## Learner flow

- Track, module, topic, subtopic, topic quiz, module review, cumulative review, review, and progress routes work.
- A learner receives explanations after submission.
- Topic mastery occurs only at 80% or higher.
- Retries are unlimited and prior attempts remain recorded.
- Optional content does not block progression.
- Failed prerequisites show a soft warning, not an unrecoverable lock.
- Code snippets render, but no execution controls or evaluators exist.

## Persistence

- Progress survives refresh in the same browser.
- Export produces a schema-versioned JSON document.
- Import validates before replacing state.
- Invalid or future-version exports fail safely.
- Legacy progress is not counted as new mastery.

## Quality gates

- `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` pass.
- New validators run in CI.
- Critical E2E flows run in CI.
- Keyboard navigation, focus order, labels, reduced motion, contrast, and responsive layouts are verified.
- No secrets, user data, or external network dependency is introduced.
- The migration is reversible.
