# Progression and Mastery Specification

## Local-first state

Release 1 stores version-aware learner progress through a storage adapter backed by browser persistence. The domain must not import Zustand or `localStorage` directly.

Persist:

- topic lesson completion;
- in-lesson check responses;
- topic quiz attempts;
- module and cumulative review attempts;
- mastery percentage;
- missed objective IDs;
- review items and due dates;
- last activity;
- content version used for each attempt;
- optional confidence response;
- exported schema version.

## Topic completion

A required topic is mastered when:

1. the learner marks the lesson complete;
2. required in-lesson checks have been attempted;
3. the topic quiz reaches at least 80%.

Optional topics never block module completion.

## Module and track completion

- A module completes when all required topics are mastered and its module review reaches 80%.
- A track completes when all required modules are complete and its cumulative review reaches 80%.
- Orientation, recap, supplement, and legacy topics do not block completion unless explicitly marked required.

## Prerequisites

Required prerequisite edges use a soft gate:

- show the prerequisite and current mastery;
- recommend review below 80%;
- allow the learner to continue after an explicit confirmation.

Recommended cross-track prerequisites never block entry.

## Retry and review

- Attempts are unlimited.
- A failed attempt creates or updates objective-level review items.
- Correctly answering an item in review raises confidence but should not instantly erase all history.
- Keep deterministic rules in Release 1; adaptive scheduling is deferred.

## Legacy progress

Perform a clean reset for the new curriculum. Preserve the prior export as a legacy record but do not award new mastery automatically. A future recognition assessment may grant credit.
