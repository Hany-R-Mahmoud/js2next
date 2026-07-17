---
schemaVersion: '1.0'
id: JS-21
slug: inheritance-patterns-and-es6-classes
trackId: javascript
moduleId: JS-M07
order: 3
title: Inheritance Patterns and ES6 Classes
required: true
optional: false
advanced: false
contentType: core
difficulty: 3
estimatedMinutes: 30
requiredPrerequisiteTopicIds:
- JS-20
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Inheritance Patterns and ES6 Classes

> **Why this matters:** This topic turns inheritance patterns and es6 classes from isolated terminology into a practical tool for reading, writing, and reviewing code. It belongs to the **Object-Oriented JavaScript** module.

## Learning objectives

- [JS-21-LO1] Explain constructor-function inheritance using a new example and justify the result.
- [JS-21-LO2] Explain `object.create` inheritance using a new example and justify the result.
- [JS-21-LO3] Apply es6 class syntax and comparison using a new example and justify the result.

## Mental model

Draw a decision map: **Constructor-function inheritance** → **`Object.create` inheritance** → **ES6 class syntax and comparison**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Constructor-function inheritance

Constructor inheritance initializes parent-owned fields and links child and parent prototypes for shared methods.

_Knowledge check: `JS-21-Q01`_

## `Object.create` inheritance

Direct delegation builds one prototype object from another and creates instances that follow that chain.

_Knowledge check: `JS-21-Q02`_

## ES6 class syntax and comparison

Class syntax provides constructors, methods, static methods, extends, and super while still using prototype delegation underneath.

_Knowledge check: `JS-21-Q03`_

## Worked example

```js
class Assessment {
  constructor(id) { this.id = id; }
  describe() { return this.id; }
}
class ModuleReview extends Assessment {
  constructor(id, moduleId) {
    super(id);
    this.moduleId = moduleId;
  }
}
```

`extends` links prototypes and `super` initializes parent-owned state.

## Common mistakes

- Memorizing syntax without predicting the underlying value or execution order.
- Mutating shared data when the task expects a new value or explicit ownership.
- Treating browser APIs and language features as the same layer.
- Choosing an abstraction from habit rather than required operations.

## Summary

- Inheritance Patterns and ES6 Classes connects Constructor-function inheritance, `Object.create` inheritance, ES6 class syntax and comparison.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: JS-21-Q01, JS-21-Q02, JS-21-Q03
- Topic quiz: `JS-21-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### JS-21-Q01

Which statement best explains “Constructor-function inheritance” in the context of Inheritance Patterns and ES6 Classes?

1. An execution context contains the information required to run a unit of code, including bindings, scope relationships, and a this binding. Function calls create additional contexts.
2. In object.method(), the object before the dot provides this for that call. Detaching the method changes the call form and may lose the intended receiver.
3. Constructor inheritance initializes parent-owned fields and links child and parent prototypes for shared methods.
4. Stack versus heap is a teaching model, not a language guarantee. Use it to reason about execution lifetime and managed objects, but focus on references, reachability, and value semantics.

**Correct answer:** Constructor inheritance initializes parent-owned fields and links child and parent prototypes for shared methods.

**Explanation:** Constructor-function inheritance is best understood as follows: Constructor inheritance initializes parent-owned fields and links child and parent prototypes for shared methods.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-21-Q02

Which statement best explains “`Object.create` inheritance” in the context of Inheritance Patterns and ES6 Classes?

1. Direct delegation builds one prototype object from another and creates instances that follow that chain.
2. An execution context contains the information required to run a unit of code, including bindings, scope relationships, and a this binding. Function calls create additional contexts.
3. Stack versus heap is a teaching model, not a language guarantee. Use it to reason about execution lifetime and managed objects, but focus on references, reachability, and value semantics.
4. In object.method(), the object before the dot provides this for that call. Detaching the method changes the call form and may lose the intended receiver.

**Correct answer:** Direct delegation builds one prototype object from another and creates instances that follow that chain.

**Explanation:** `Object.create` inheritance is best understood as follows: Direct delegation builds one prototype object from another and creates instances that follow that chain.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-21-Q03

Which statement best explains “ES6 class syntax and comparison” in the context of Inheritance Patterns and ES6 Classes?

1. In object.method(), the object before the dot provides this for that call. Detaching the method changes the call form and may lose the intended receiver.
2. An execution context contains the information required to run a unit of code, including bindings, scope relationships, and a this binding. Function calls create additional contexts.
3. Stack versus heap is a teaching model, not a language guarantee. Use it to reason about execution lifetime and managed objects, but focus on references, reachability, and value semantics.
4. Class syntax provides constructors, methods, static methods, extends, and super while still using prototype delegation underneath.

**Correct answer:** Class syntax provides constructors, methods, static methods, extends, and super while still using prototype delegation underneath.

**Explanation:** ES6 class syntax and comparison is best understood as follows: Class syntax provides constructors, methods, static methods, extends, and super while still using prototype delegation underneath.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-21-Q04

A learner must use Inheritance Patterns and ES6 Classes in a new situation. Which approach best demonstrates transferable understanding?

1. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
2. Apply Constructor-function inheritance deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
3. Add more state and abstraction immediately, before identifying the smallest requirement.
4. Skip the underlying model and rely on memorized syntax, even when the result is unclear.

**Correct answer:** Apply Constructor-function inheritance deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### JS-21-Q05

What is the most accurate explanation of the following Inheritance Patterns and ES6 Classes example?

```js
class Assessment {
  constructor(id) { this.id = id; }
  describe() { return this.id; }
}
class ModuleReview extends Assessment {
  constructor(id, moduleId) {
    super(id);
    this.moduleId = moduleId;
  }
}
```

1. The snippet removes the need to understand the data flowing through the program.
2. The snippet guarantees that all values are immutable and all operations are asynchronous.
3. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
4. `extends` links prototypes and `super` initializes parent-owned state.

**Correct answer:** `extends` links prototypes and `super` initializes parent-owned state.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### JS-21-Q06

Which response best addresses this common mistake: “Memorizing syntax without predicting the underlying value or execution order.”?

1. The statement is unrelated to program behavior and cannot cause defects.
2. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
3. The statement is always correct, so no further reasoning about Inheritance Patterns and ES6 Classes is needed.
4. The statement is correct only when variable names are short.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### JS-21-Q07

Which sequence is most reliable when solving a problem involving Inheritance Patterns and ES6 Classes?

1. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
2. Optimize first, then decide what the code is supposed to do.
3. Start with a framework abstraction and avoid checking the underlying language behavior.
4. First identify the requirement, then apply the relevant rule from Constructor-function inheritance, inspect the result, and only then refactor or optimize.

**Correct answer:** First identify the requirement, then apply the relevant rule from Constructor-function inheritance, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### JS-21-Q08

Which guideline shows the best judgment about when to use Inheritance Patterns and ES6 Classes?

1. Choose based only on line count, without considering readability, correctness, or future change.
2. Use Inheritance Patterns and ES6 Classes when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
3. Use Inheritance Patterns and ES6 Classes in every file because more abstraction is always better.
4. Avoid Inheritance Patterns and ES6 Classes completely because all abstractions reduce maintainability.

**Correct answer:** Use Inheritance Patterns and ES6 Classes when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Inheritance Between "Classes": Constructor Functions — Coverage research only; no transcript wording is canonical.
- Inheritance Between "Classes": Object.create — Coverage research only; no transcript wording is canonical.
- ES6 Classes Summary — Coverage research only; no transcript wording is canonical.
- Inheritance Between "Classes": ES6 Classes — Optional coverage reference; learner-facing wording must be original.
- Encapsulation: Private Class Fields and Methods — Optional coverage reference; learner-facing wording must be original.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — Technical verification and freshness review.
- [MDN DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) — Technical verification and freshness review.
- [MDN Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — Technical verification and freshness review.
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
