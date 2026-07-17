---
schemaVersion: '1.0'
id: JS-12
slug: memory-management-and-references
trackId: javascript
moduleId: JS-M04
order: 4
title: Memory Management and References
required: true
optional: false
advanced: false
contentType: core
difficulty: 2
estimatedMinutes: 25
requiredPrerequisiteTopicIds:
- JS-11
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Memory Management and References

> **Why this matters:** This topic turns memory management and references from isolated terminology into a practical tool for reading, writing, and reviewing code. It belongs to the **How JavaScript Works** module.

## Learning objectives

- [JS-12-LO1] Compare primitives versus objects using a new example and justify the result.
- [JS-12-LO2] Explain stack and heap mental model using a new example and justify the result.
- [JS-12-LO3] Explain references using a new example and justify the result.
- [JS-12-LO4] Explain garbage collection using a new example and justify the result.

## Mental model

Draw a decision map: **Primitives versus objects** → **Stack and heap mental model** → **References** → **Garbage collection**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Primitives versus objects

Assigning a primitive copies its value. Assigning an object copies a reference to the same object, so mutations are visible through every reference.

_Knowledge check: `JS-12-Q01`_

## Stack and heap mental model

Stack versus heap is a teaching model, not a language guarantee. Use it to reason about execution lifetime and managed objects, but focus on references, reachability, and value semantics.

_Knowledge check: `JS-12-Q02`_

## References

Object variables hold references. Equality checks identity rather than structural similarity, and shallow copies may still share nested objects.

_Knowledge check: `JS-12-Q03`_

## Garbage collection

Garbage collection reclaims values that are no longer reachable. Event listeners, timers, caches, and closures can accidentally retain references and extend lifetimes.

_Knowledge check: `JS-12-Q03`_

## Worked example

```js
const original = { profile: { level: 1 } };
const shallow = { ...original };
shallow.profile.level = 2;

console.log(original.profile.level); // 2
```

The outer object is copied but the nested reference is shared.

## Common mistakes

- Memorizing syntax without predicting the underlying value or execution order.
- Mutating shared data when the task expects a new value or explicit ownership.
- Treating browser APIs and language features as the same layer.
- Choosing an abstraction from habit rather than required operations.

## Summary

- Memory Management and References connects Primitives versus objects, Stack and heap mental model, References.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: JS-12-Q01, JS-12-Q02, JS-12-Q03
- Topic quiz: `JS-12-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### JS-12-Q01

Which statement best explains “Primitives versus objects” in the context of Memory Management and References?

1. An execution context contains the information required to run a unit of code, including bindings, scope relationships, and a this binding. Function calls create additional contexts.
2. Functions are first-class values: they can be stored, passed, and returned. Referring to a function is different from invoking it.
3. A function can return a configured function that remembers creation-time context. This supports factories and reusable behavior.
4. Assigning a primitive copies its value. Assigning an object copies a reference to the same object, so mutations are visible through every reference.

**Correct answer:** Assigning a primitive copies its value. Assigning an object copies a reference to the same object, so mutations are visible through every reference.

**Explanation:** Primitives versus objects is best understood as follows: Assigning a primitive copies its value. Assigning an object copies a reference to the same object, so mutations are visible through every reference.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-12-Q02

Which statement best explains “Stack and heap mental model” in the context of Memory Management and References?

1. Functions are first-class values: they can be stored, passed, and returned. Referring to a function is different from invoking it.
2. Stack versus heap is a teaching model, not a language guarantee. Use it to reason about execution lifetime and managed objects, but focus on references, reachability, and value semantics.
3. An execution context contains the information required to run a unit of code, including bindings, scope relationships, and a this binding. Function calls create additional contexts.
4. A function can return a configured function that remembers creation-time context. This supports factories and reusable behavior.

**Correct answer:** Stack versus heap is a teaching model, not a language guarantee. Use it to reason about execution lifetime and managed objects, but focus on references, reachability, and value semantics.

**Explanation:** Stack and heap mental model is best understood as follows: Stack versus heap is a teaching model, not a language guarantee. Use it to reason about execution lifetime and managed objects, but focus on references, reachability, and value semantics.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-12-Q03

Which statement best explains “References” in the context of Memory Management and References?

1. A function can return a configured function that remembers creation-time context. This supports factories and reusable behavior.
2. Object variables hold references. Equality checks identity rather than structural similarity, and shallow copies may still share nested objects.
3. Functions are first-class values: they can be stored, passed, and returned. Referring to a function is different from invoking it.
4. An execution context contains the information required to run a unit of code, including bindings, scope relationships, and a this binding. Function calls create additional contexts.

**Correct answer:** Object variables hold references. Equality checks identity rather than structural similarity, and shallow copies may still share nested objects.

**Explanation:** References is best understood as follows: Object variables hold references. Equality checks identity rather than structural similarity, and shallow copies may still share nested objects.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-12-Q04

A learner must use Memory Management and References in a new situation. Which approach best demonstrates transferable understanding?

1. Add more state and abstraction immediately, before identifying the smallest requirement.
2. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
3. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
4. Apply Primitives versus objects deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Correct answer:** Apply Primitives versus objects deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### JS-12-Q05

What is the most accurate explanation of the following Memory Management and References example?

```js
const original = { profile: { level: 1 } };
const shallow = { ...original };
shallow.profile.level = 2;

console.log(original.profile.level); // 2
```

1. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
2. The snippet guarantees that all values are immutable and all operations are asynchronous.
3. The snippet removes the need to understand the data flowing through the program.
4. The outer object is copied but the nested reference is shared.

**Correct answer:** The outer object is copied but the nested reference is shared.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### JS-12-Q06

Which response best addresses this common mistake: “Memorizing syntax without predicting the underlying value or execution order.”?

1. The statement is unrelated to program behavior and cannot cause defects.
2. The statement is correct only when variable names are short.
3. The statement is always correct, so no further reasoning about Memory Management and References is needed.
4. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### JS-12-Q07

Which sequence is most reliable when solving a problem involving Memory Management and References?

1. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
2. Optimize first, then decide what the code is supposed to do.
3. Start with a framework abstraction and avoid checking the underlying language behavior.
4. First identify the requirement, then apply the relevant rule from Primitives versus objects, inspect the result, and only then refactor or optimize.

**Correct answer:** First identify the requirement, then apply the relevant rule from Primitives versus objects, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### JS-12-Q08

Which guideline shows the best judgment about when to use Memory Management and References?

1. Choose based only on line count, without considering readability, correctness, or future change.
2. Use Memory Management and References in every file because more abstraction is always better.
3. Use Memory Management and References when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
4. Avoid Memory Management and References completely because all abstractions reduce maintainability.

**Correct answer:** Use Memory Management and References when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Memory Management: Primitives vs. Objects — Coverage research only; no transcript wording is canonical.
- Memory Management: Garbage Collection — Coverage research only; no transcript wording is canonical.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — Technical verification and freshness review.
- [MDN DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) — Technical verification and freshness review.
- [MDN Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — Technical verification and freshness review.
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
