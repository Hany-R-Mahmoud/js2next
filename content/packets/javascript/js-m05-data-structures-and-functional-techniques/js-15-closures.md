---
schemaVersion: '1.0'
id: JS-15
slug: closures
trackId: javascript
moduleId: JS-M05
order: 3
title: Closures
required: true
optional: false
advanced: false
contentType: core
difficulty: 2
estimatedMinutes: 20
requiredPrerequisiteTopicIds:
- JS-14
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Closures

> **Why this matters:** Closures is part of the mental model learners need before making reliable implementation decisions. It belongs to the **Data Structures and Functional Techniques** module.

## Learning objectives

- [JS-15-LO1] Explain lexical environment using a new example and justify the result.
- [JS-15-LO2] Explain retained variables using a new example and justify the result.
- [JS-15-LO3] Explain practical closure patterns using a new example and justify the result.

## Mental model

Draw a decision map: **Lexical environment** → **Retained variables** → **Practical closure patterns**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Lexical environment

A closure keeps access to the lexical environment in which a function was created, even after the outer call has returned.

_Knowledge check: `JS-15-Q01`_

## Retained variables

Closures retain bindings rather than frozen copies. Later calls observe the current value of a captured binding.

_Knowledge check: `JS-15-Q02`_

## Practical closure patterns

Closures support factories, private state, memoization, and event handlers. Use them when remembered context clarifies the API, not to hide arbitrary mutable state.

_Knowledge check: `JS-15-Q03`_

## Worked example

```js
function createAttemptCounter() {
  let attempts = 0;
  return () => ++attempts;
}
const nextAttempt = createAttemptCounter();
console.log(nextAttempt());
console.log(nextAttempt());
```

The returned function retains access to the `attempts` binding.

## Common mistakes

- Thinking a closure stores a frozen copy instead of retaining access to a binding.
- Hiding mutable state without a clear public API.
- Memorizing syntax without predicting the underlying value or execution order.
- Mutating shared data when the task expects a new value or explicit ownership.

## Summary

- Closures connects Lexical environment, Retained variables, Practical closure patterns.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: JS-15-Q01, JS-15-Q02, JS-15-Q03
- Topic quiz: `JS-15-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### JS-15-Q01

Which statement best explains “Lexical environment” in the context of Closures?

1. A callback is a function supplied so another function can invoke it at the appropriate time or for each value. Understand whether it runs now or later.
2. A retrospective compares outcomes with goals, identifies successful decisions and accidental complexity, and records lessons that should influence the next project.
3. A closure keeps access to the lexical environment in which a function was created, even after the outer call has returned.
4. AI tools can accelerate explanation and review, but generated output is an untrusted proposal. Supply exact context, ask for assumptions, run the result, compare with documentation, and explain it independently.

**Correct answer:** A closure keeps access to the lexical environment in which a function was created, even after the outer call has returned.

**Explanation:** Lexical environment is best understood as follows: A closure keeps access to the lexical environment in which a function was created, even after the outer call has returned.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-15-Q02

Which statement best explains “Retained variables” in the context of Closures?

1. AI tools can accelerate explanation and review, but generated output is an untrusted proposal. Supply exact context, ask for assumptions, run the result, compare with documentation, and explain it independently.
2. A retrospective compares outcomes with goals, identifies successful decisions and accidental complexity, and records lessons that should influence the next project.
3. A callback is a function supplied so another function can invoke it at the appropriate time or for each value. Understand whether it runs now or later.
4. Closures retain bindings rather than frozen copies. Later calls observe the current value of a captured binding.

**Correct answer:** Closures retain bindings rather than frozen copies. Later calls observe the current value of a captured binding.

**Explanation:** Retained variables is best understood as follows: Closures retain bindings rather than frozen copies. Later calls observe the current value of a captured binding.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-15-Q03

Which statement best explains “Practical closure patterns” in the context of Closures?

1. Closures support factories, private state, memoization, and event handlers. Use them when remembered context clarifies the API, not to hide arbitrary mutable state.
2. A retrospective compares outcomes with goals, identifies successful decisions and accidental complexity, and records lessons that should influence the next project.
3. AI tools can accelerate explanation and review, but generated output is an untrusted proposal. Supply exact context, ask for assumptions, run the result, compare with documentation, and explain it independently.
4. A callback is a function supplied so another function can invoke it at the appropriate time or for each value. Understand whether it runs now or later.

**Correct answer:** Closures support factories, private state, memoization, and event handlers. Use them when remembered context clarifies the API, not to hide arbitrary mutable state.

**Explanation:** Practical closure patterns is best understood as follows: Closures support factories, private state, memoization, and event handlers. Use them when remembered context clarifies the API, not to hide arbitrary mutable state.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-15-Q04

A learner must use Closures in a new situation. Which approach best demonstrates transferable understanding?

1. Apply Lexical environment deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
2. Add more state and abstraction immediately, before identifying the smallest requirement.
3. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
4. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.

**Correct answer:** Apply Lexical environment deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### JS-15-Q05

What is the most accurate explanation of the following Closures example?

```js
function createAttemptCounter() {
  let attempts = 0;
  return () => ++attempts;
}
const nextAttempt = createAttemptCounter();
console.log(nextAttempt());
console.log(nextAttempt());
```

1. The returned function retains access to the `attempts` binding.
2. The snippet guarantees that all values are immutable and all operations are asynchronous.
3. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
4. The snippet removes the need to understand the data flowing through the program.

**Correct answer:** The returned function retains access to the `attempts` binding.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### JS-15-Q06

Which response best addresses this common mistake: “Thinking a closure stores a frozen copy instead of retaining access to a binding.”?

1. The statement is unrelated to program behavior and cannot cause defects.
2. The statement is correct only when variable names are short.
3. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
4. The statement is always correct, so no further reasoning about Closures is needed.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### JS-15-Q07

Which sequence is most reliable when solving a problem involving Closures?

1. First identify the requirement, then apply the relevant rule from Lexical environment, inspect the result, and only then refactor or optimize.
2. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
3. Optimize first, then decide what the code is supposed to do.
4. Start with a framework abstraction and avoid checking the underlying language behavior.

**Correct answer:** First identify the requirement, then apply the relevant rule from Lexical environment, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### JS-15-Q08

Which guideline shows the best judgment about when to use Closures?

1. Avoid Closures completely because all abstractions reduce maintainability.
2. Use Closures in every file because more abstraction is always better.
3. Use Closures when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
4. Choose based only on line count, without considering readability, correctness, or future change.

**Correct answer:** Use Closures when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Closures — Coverage research only; no transcript wording is canonical.
- More Closure Examples — Optional coverage reference; learner-facing wording must be original.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — Technical verification and freshness review.
- [MDN DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) — Technical verification and freshness review.
- [MDN Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — Technical verification and freshness review.
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
