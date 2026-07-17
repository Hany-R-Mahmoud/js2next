# Assessment Specification

## Question model

Release 1 uses `single-choice` MCQs. The model stores `correctChoiceIds` as an array but JSON Schema restricts it to exactly one item. This preserves a future path to multi-select without enabling it now.

A question includes:

- stable ID and version;
- track, module, topic, and objective associations;
- prompt;
- optional display-only code;
- three to six choices;
- one correct choice;
- explanation;
- hint;
- per-choice feedback;
- difficulty and cognitive level;
- draft/review/publish status.

## Required assessment coverage

Every topic:

- three in-lesson checks;
- five-question topic quiz.

Every module:

- module review with a balanced set of questions from its required topics.

Every track:

- cumulative review mixing transfer, debugging, explanation, and trade-off items.

## Supported MCQ styles

- Concept recognition.
- Predicting an output or render.
- Identifying a bug or misconception.
- Selecting the correct implementation.
- Selecting the best refactor.
- Ordering or tracing operations.
- Architecture and trade-off reasoning.
- Scenario-based transfer.

## Scoring and feedback

- Score = correct answers / submitted questions × 100.
- Mastery threshold = 80%.
- Unlimited attempts.
- Explanations appear after submission.
- Choice-level feedback may appear immediately or in the result view.
- Missed objectives enter the local review queue.
- A failure does not permanently lock content.
- Store every local attempt; never overwrite the prior attempt.
- Randomize question order; keep choice order stable initially to simplify review and accessibility testing.

## Quality rules

Reject a question when:

- more than one answer could reasonably be correct;
- the correct choice is signaled by length or grammar;
- distractors are nonsense;
- it tests source-course trivia rather than transferable knowledge;
- it depends on code execution;
- it uses unverified version-specific behavior;
- feedback merely says “wrong” without correction;
- the question does not map to a learning objective.
