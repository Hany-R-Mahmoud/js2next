---
schemaVersion: '1.0'
id: JS-05
slug: functions-working-together
trackId: javascript
moduleId: JS-M01
order: 5
title: Functions Working Together
required: true
optional: false
advanced: false
contentType: core
difficulty: 1
estimatedMinutes: 25
requiredPrerequisiteTopicIds:
- JS-04
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Functions Working Together

> **Why this matters:** The ideas in functions working together recur throughout later JavaScript work, reducing memorization and debugging later. It belongs to the **Orientation and Foundations** module.

## Learning objectives

- [JS-05-LO1] Explain functions calling functions using a new example and justify the result.
- [JS-05-LO2] Explain function inputs and outputs using a new example and justify the result.
- [JS-05-LO3] Apply function review and composition using a new example and justify the result.

## Mental model

Draw a decision map: **Functions calling functions** → **Function inputs and outputs** → **Function review and composition**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Functions calling functions

Functions can delegate to other functions, turning a large operation into named, testable transformations. The caller coordinates the sequence while each helper owns one responsibility.

_Knowledge check: `JS-05-Q01`_

## Function inputs and outputs

Parameters define what a function needs; return values define what it produces. Explicit inputs and outputs reduce hidden dependencies and make functions easier to compose and test.

_Knowledge check: `JS-05-Q02`_

## Function review and composition

Composition builds larger behavior from smaller functions whose outputs can become later inputs. Even without a composition utility, the principle encourages narrow responsibilities and predictable data flow.

_Knowledge check: `JS-05-Q03`_

## Worked example

```js
function normalizeScore(score) {
  return Math.max(0, Math.min(100, score));
}
function describeScore(score) {
  const safe = normalizeScore(score);
  return safe >= 80 ? 'mastered' : 'keep practicing';
}
console.log(describeScore(87));
```

One function delegates validation to another and uses the returned value.

## Common mistakes

- Memorizing syntax without predicting the underlying value or execution order.
- Mutating shared data when the task expects a new value or explicit ownership.
- Treating browser APIs and language features as the same layer.
- Choosing an abstraction from habit rather than required operations.

## Summary

- Functions Working Together connects Functions calling functions, Function inputs and outputs, Function review and composition.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: JS-05-Q01, JS-05-Q02, JS-05-Q03
- Topic quiz: `JS-05-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### JS-05-Q01

Which statement best explains “Functions calling functions” in the context of Functions Working Together?

1. HTML describes structure, CSS describes presentation, and JavaScript expresses behavior and application logic. It responds to events, changes the document, communicates with servers, and coordinates state.
2. A Promise begins pending and settles once as fulfilled or rejected. then, catch, and finally schedule reactions asynchronously.
3. DOM APIs locate nodes by selector or relationship, then update text, attributes, classes, styles, or structure. Prefer focused updates and class changes over scattered inline mutations.
4. Functions can delegate to other functions, turning a large operation into named, testable transformations. The caller coordinates the sequence while each helper owns one responsibility.

**Correct answer:** Functions can delegate to other functions, turning a large operation into named, testable transformations. The caller coordinates the sequence while each helper owns one responsibility.

**Explanation:** Functions calling functions is best understood as follows: Functions can delegate to other functions, turning a large operation into named, testable transformations. The caller coordinates the sequence while each helper owns one responsibility.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-05-Q02

Which statement best explains “Function inputs and outputs” in the context of Functions Working Together?

1. HTML describes structure, CSS describes presentation, and JavaScript expresses behavior and application logic. It responds to events, changes the document, communicates with servers, and coordinates state.
2. A Promise begins pending and settles once as fulfilled or rejected. then, catch, and finally schedule reactions asynchronously.
3. DOM APIs locate nodes by selector or relationship, then update text, attributes, classes, styles, or structure. Prefer focused updates and class changes over scattered inline mutations.
4. Parameters define what a function needs; return values define what it produces. Explicit inputs and outputs reduce hidden dependencies and make functions easier to compose and test.

**Correct answer:** Parameters define what a function needs; return values define what it produces. Explicit inputs and outputs reduce hidden dependencies and make functions easier to compose and test.

**Explanation:** Function inputs and outputs is best understood as follows: Parameters define what a function needs; return values define what it produces. Explicit inputs and outputs reduce hidden dependencies and make functions easier to compose and test.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-05-Q03

Which statement best explains “Function review and composition” in the context of Functions Working Together?

1. HTML describes structure, CSS describes presentation, and JavaScript expresses behavior and application logic. It responds to events, changes the document, communicates with servers, and coordinates state.
2. Composition builds larger behavior from smaller functions whose outputs can become later inputs. Even without a composition utility, the principle encourages narrow responsibilities and predictable data flow.
3. DOM APIs locate nodes by selector or relationship, then update text, attributes, classes, styles, or structure. Prefer focused updates and class changes over scattered inline mutations.
4. A Promise begins pending and settles once as fulfilled or rejected. then, catch, and finally schedule reactions asynchronously.

**Correct answer:** Composition builds larger behavior from smaller functions whose outputs can become later inputs. Even without a composition utility, the principle encourages narrow responsibilities and predictable data flow.

**Explanation:** Function review and composition is best understood as follows: Composition builds larger behavior from smaller functions whose outputs can become later inputs. Even without a composition utility, the principle encourages narrow responsibilities and predictable data flow.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-05-Q04

A learner must use Functions Working Together in a new situation. Which approach best demonstrates transferable understanding?

1. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
2. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
3. Apply Functions calling functions deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
4. Add more state and abstraction immediately, before identifying the smallest requirement.

**Correct answer:** Apply Functions calling functions deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### JS-05-Q05

What is the most accurate explanation of the following Functions Working Together example?

```js
function normalizeScore(score) {
  return Math.max(0, Math.min(100, score));
}
function describeScore(score) {
  const safe = normalizeScore(score);
  return safe >= 80 ? 'mastered' : 'keep practicing';
}
console.log(describeScore(87));
```

1. The snippet guarantees that all values are immutable and all operations are asynchronous.
2. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
3. The snippet removes the need to understand the data flowing through the program.
4. One function delegates validation to another and uses the returned value.

**Correct answer:** One function delegates validation to another and uses the returned value.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### JS-05-Q06

Which response best addresses this common mistake: “Memorizing syntax without predicting the underlying value or execution order.”?

1. The statement is always correct, so no further reasoning about Functions Working Together is needed.
2. The statement is correct only when variable names are short.
3. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
4. The statement is unrelated to program behavior and cannot cause defects.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### JS-05-Q07

Which sequence is most reliable when solving a problem involving Functions Working Together?

1. First identify the requirement, then apply the relevant rule from Functions calling functions, inspect the result, and only then refactor or optimize.
2. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
3. Optimize first, then decide what the code is supposed to do.
4. Start with a framework abstraction and avoid checking the underlying language behavior.

**Correct answer:** First identify the requirement, then apply the relevant rule from Functions calling functions, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### JS-05-Q08

Which guideline shows the best judgment about when to use Functions Working Together?

1. Avoid Functions Working Together completely because all abstractions reduce maintainability.
2. Use Functions Working Together when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
3. Choose based only on line count, without considering readability, correctness, or future change.
4. Use Functions Working Together in every file because more abstraction is always better.

**Correct answer:** Use Functions Working Together when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Functions Calling Other Functions — Coverage research only; no transcript wording is canonical.
- Reviewing Functions — Coverage research only; no transcript wording is canonical.
- Functions — Optional coverage reference; learner-facing wording must be original.
- Function Declarations vs. Expressions — Optional coverage reference; learner-facing wording must be original.
- Arrow Functions — Optional coverage reference; learner-facing wording must be original.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — Technical verification and freshness review.
- [MDN DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) — Technical verification and freshness review.
- [MDN Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — Technical verification and freshness review.
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
