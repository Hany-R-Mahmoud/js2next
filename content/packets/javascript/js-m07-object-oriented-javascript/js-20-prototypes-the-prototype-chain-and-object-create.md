---
schemaVersion: '1.0'
id: JS-20
slug: prototypes-the-prototype-chain-and-object-create
trackId: javascript
moduleId: JS-M07
order: 2
title: Prototypes, the Prototype Chain, and `Object.create`
required: true
optional: false
advanced: false
contentType: core
difficulty: 3
estimatedMinutes: 20
requiredPrerequisiteTopicIds:
- JS-19
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Prototypes, the Prototype Chain, and `Object.create`

> **Why this matters:** Prototypes, the Prototype Chain, and `Object.create` is part of the mental model learners need before making reliable implementation decisions. It belongs to the **Object-Oriented JavaScript** module.

## Learning objectives

- [JS-20-LO1] Explain prototypal inheritance using a new example and justify the result.
- [JS-20-LO2] Explain prototype lookup using a new example and justify the result.
- [JS-20-LO3] Explain delegation with `object.create` using a new example and justify the result.

## Mental model

Draw a decision map: **Prototypal inheritance** → **Prototype lookup** → **Delegation with `Object.create`**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Prototypal inheritance

Objects can delegate missing property lookup to another object through a prototype link. Shared methods live on prototypes rather than being copied.

_Knowledge check: `JS-20-Q01`_

## Prototype lookup

Property lookup checks the object, then follows the prototype chain until a match is found or the chain ends.

_Knowledge check: `JS-20-Q02`_

## Delegation with `Object.create`

Object.create(proto) creates an object that delegates to proto. Initialization is separate unless wrapped in a factory.

_Knowledge check: `JS-20-Q03`_

## Worked example

```js
const progressBehavior = {
  record(score) {
    this.score = Math.max(this.score, score);
  },
};
const progress = Object.create(progressBehavior);
progress.score = 0;
progress.record(88);
```

The object delegates a missing method to its prototype.

## Common mistakes

- Memorizing syntax without predicting the underlying value or execution order.
- Mutating shared data when the task expects a new value or explicit ownership.
- Treating browser APIs and language features as the same layer.
- Choosing an abstraction from habit rather than required operations.

## Summary

- Prototypes, the Prototype Chain, and `Object.create` connects Prototypal inheritance, Prototype lookup, Delegation with `Object.create`.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: JS-20-Q01, JS-20-Q02, JS-20-Q03
- Topic quiz: `JS-20-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### JS-20-Q01

Which statement best explains “Prototypal inheritance” in the context of Prototypes, the Prototype Chain, and `Object.create`?

1. Objects can delegate missing property lookup to another object through a prototype link. Shared methods live on prototypes rather than being copied.
2. The Temporal Dead Zone lasts from entering a scope until a lexical declaration is initialized. Reading the binding during that period throws a ReferenceError.
3. Start with user-visible outcomes and convert them into explicit behavior, inputs, edge cases, and acceptance conditions. Break large capabilities into end-to-end slices that can be implemented and verified independently.
4. An async external script downloads in parallel and executes as soon as it is ready, without preserving order relative to other async scripts.

**Correct answer:** Objects can delegate missing property lookup to another object through a prototype link. Shared methods live on prototypes rather than being copied.

**Explanation:** Prototypal inheritance is best understood as follows: Objects can delegate missing property lookup to another object through a prototype link. Shared methods live on prototypes rather than being copied.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-20-Q02

Which statement best explains “Prototype lookup” in the context of Prototypes, the Prototype Chain, and `Object.create`?

1. An async external script downloads in parallel and executes as soon as it is ready, without preserving order relative to other async scripts.
2. Start with user-visible outcomes and convert them into explicit behavior, inputs, edge cases, and acceptance conditions. Break large capabilities into end-to-end slices that can be implemented and verified independently.
3. The Temporal Dead Zone lasts from entering a scope until a lexical declaration is initialized. Reading the binding during that period throws a ReferenceError.
4. Property lookup checks the object, then follows the prototype chain until a match is found or the chain ends.

**Correct answer:** Property lookup checks the object, then follows the prototype chain until a match is found or the chain ends.

**Explanation:** Prototype lookup is best understood as follows: Property lookup checks the object, then follows the prototype chain until a match is found or the chain ends.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-20-Q03

Which statement best explains “Delegation with `Object.create`” in the context of Prototypes, the Prototype Chain, and `Object.create`?

1. Object.create(proto) creates an object that delegates to proto. Initialization is separate unless wrapped in a factory.
2. An async external script downloads in parallel and executes as soon as it is ready, without preserving order relative to other async scripts.
3. Start with user-visible outcomes and convert them into explicit behavior, inputs, edge cases, and acceptance conditions. Break large capabilities into end-to-end slices that can be implemented and verified independently.
4. The Temporal Dead Zone lasts from entering a scope until a lexical declaration is initialized. Reading the binding during that period throws a ReferenceError.

**Correct answer:** Object.create(proto) creates an object that delegates to proto. Initialization is separate unless wrapped in a factory.

**Explanation:** Delegation with `Object.create` is best understood as follows: Object.create(proto) creates an object that delegates to proto. Initialization is separate unless wrapped in a factory.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-20-Q04

A learner must use Prototypes, the Prototype Chain, and `Object.create` in a new situation. Which approach best demonstrates transferable understanding?

1. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
2. Apply Prototypal inheritance deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
3. Add more state and abstraction immediately, before identifying the smallest requirement.
4. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.

**Correct answer:** Apply Prototypal inheritance deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### JS-20-Q05

What is the most accurate explanation of the following Prototypes, the Prototype Chain, and `Object.create` example?

```js
const progressBehavior = {
  record(score) {
    this.score = Math.max(this.score, score);
  },
};
const progress = Object.create(progressBehavior);
progress.score = 0;
progress.record(88);
```

1. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
2. The snippet removes the need to understand the data flowing through the program.
3. The snippet guarantees that all values are immutable and all operations are asynchronous.
4. The object delegates a missing method to its prototype.

**Correct answer:** The object delegates a missing method to its prototype.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### JS-20-Q06

Which response best addresses this common mistake: “Memorizing syntax without predicting the underlying value or execution order.”?

1. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
2. The statement is unrelated to program behavior and cannot cause defects.
3. The statement is correct only when variable names are short.
4. The statement is always correct, so no further reasoning about Prototypes, the Prototype Chain, and `Object.create` is needed.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### JS-20-Q07

Which sequence is most reliable when solving a problem involving Prototypes, the Prototype Chain, and `Object.create`?

1. Optimize first, then decide what the code is supposed to do.
2. First identify the requirement, then apply the relevant rule from Prototypal inheritance, inspect the result, and only then refactor or optimize.
3. Start with a framework abstraction and avoid checking the underlying language behavior.
4. Copy an unrelated implementation, hide the assumptions, and test only the happy path.

**Correct answer:** First identify the requirement, then apply the relevant rule from Prototypal inheritance, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### JS-20-Q08

Which guideline shows the best judgment about when to use Prototypes, the Prototype Chain, and `Object.create`?

1. Use Prototypes, the Prototype Chain, and `Object.create` in every file because more abstraction is always better.
2. Use Prototypes, the Prototype Chain, and `Object.create` when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
3. Avoid Prototypes, the Prototype Chain, and `Object.create` completely because all abstractions reduce maintainability.
4. Choose based only on line count, without considering readability, correctness, or future change.

**Correct answer:** Use Prototypes, the Prototype Chain, and `Object.create` when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Prototypal Inheritance and The Prototype Chain — Coverage research only; no transcript wording is canonical.
- Object.create — Coverage research only; no transcript wording is canonical.
- Prototypes — Optional coverage reference; learner-facing wording must be original.
- Prototypal Inheritance on Built-In Objects — Optional coverage reference; learner-facing wording must be original.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — Technical verification and freshness review.
- [MDN DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) — Technical verification and freshness review.
- [MDN Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — Technical verification and freshness review.
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
