# Assessment Policy v2 — Skill-Aligned Challenges

## Core rule

The assessment format follows the skill being measured.

- **Conceptual topics:** mental models, comparisons, and realistic decision scenarios.
- **Workflow topics:** requirements, debugging evidence, logs, configuration, project structures, and development decisions.
- **Hybrid topics:** a concise conceptual foundation plus practical code reasoning.
- **Coding topics:** code reading, output prediction, debugging, implementation choice, and edge-case reasoning.

A topic is not assessed with theoretical MCQs merely because the platform supports MCQs. Single-choice remains the response mechanism for Release 1, but the prompt may contain realistic code and the learner must reason about that code.

## Topic assessment structure

Every topic keeps eight questions:

- `Q01–Q03`: in-lesson checks;
- `Q04–Q08`: end-of-topic quiz/challenge.

### Coding profile

- At least four of the five topic-quiz questions display code.
- No topic-quiz item should be a pure definition recall question.
- Include code reading, diagnosis, fix selection, verification, and engineering judgment.

### Hybrid profile

- At least three topic-quiz questions display code.
- Include mental-model transfer and implementation consequences.

### Workflow profile

- At least four topic-quiz questions use realistic workflow or decision scenarios.
- Include at least one code, configuration, command, log, route tree, or comparable artifact where the topic supports it.

### Conceptual profile

- Use conceptual, comparison, and scenario questions.
- Do not force irrelevant code snippets.
- Avoid vocabulary-only trivia.

## Code-question rules

- Code must be original and independent from source-course projects.
- Prefer day-to-day project situations.
- Use only behavior already taught or explicitly introduced in the question.
- The answer must be derivable by reading and reasoning; no code runner is required.
- Do not use trick syntax, unspecified behavior, or hidden environmental assumptions.
- Distractors must represent plausible developer mistakes.
- Explanations must trace the relevant value, state, call order, render cycle, request flow, or boundary.

## Release 1 constraints

- Single-choice answers only.
- Display-only code; no execution or automated code grading.
- Unlimited retries and 80% mastery remain unchanged.
- Every question remains `draft` and `pending-human-review` until editorial approval.
