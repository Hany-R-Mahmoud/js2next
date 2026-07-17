---
schemaVersion: '1.0'
id: JS-03
slug: values-data-types-and-boolean-logic
trackId: javascript
moduleId: JS-M01
order: 3
title: Values, Data Types, and Boolean Logic
required: true
optional: false
advanced: false
contentType: core
difficulty: 1
estimatedMinutes: 25
requiredPrerequisiteTopicIds:
- JS-02
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Values, Data Types, and Boolean Logic

> **Why this matters:** This topic turns values, data types, and boolean logic from isolated terminology into a practical tool for reading, writing, and reviewing code. It belongs to the **Orientation and Foundations** module.

## Learning objectives

- [JS-03-LO1] Explain primitive data types using a new example and justify the result.
- [JS-03-LO2] Explain dynamic typing using a new example and justify the result.
- [JS-03-LO3] Explain boolean values and logical reasoning using a new example and justify the result.

## Mental model

Draw a decision map: **Primitive data types** → **Dynamic typing** → **Boolean values and logical reasoning**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Primitive data types

Primitive values include string, number, bigint, boolean, undefined, symbol, and null. They represent atomic values and are copied by value. Objects, arrays, and functions are reference-based values.

_Knowledge check: `JS-03-Q01`_

## Dynamic typing

Variables are not permanently bound to one type. Each value still has a definite runtime type, but a variable may refer to different kinds of values over time. Clear data boundaries and validation are therefore important.

_Knowledge check: `JS-03-Q02`_

## Boolean values and logical reasoning

Boolean reasoning combines propositions with NOT, AND, and OR. Translate requirements into smaller conditions, then inspect how short-circuiting affects both the result and which expressions execute.

_Knowledge check: `JS-03-Q03`_

## Worked example

```js
const lessons = 12;
const title = 'JavaScript';
const isPublished = false;

console.log(typeof lessons, typeof title, typeof isPublished);
```

Each value has a runtime type even though variables are not permanently restricted to that type.

## Common mistakes

- Memorizing syntax without predicting the underlying value or execution order.
- Mutating shared data when the task expects a new value or explicit ownership.
- Treating browser APIs and language features as the same layer.
- Choosing an abstraction from habit rather than required operations.

## Summary

- Values, Data Types, and Boolean Logic connects Primitive data types, Dynamic typing, Boolean values and logical reasoning.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: JS-03-Q01, JS-03-Q02, JS-03-Q03
- Topic quiz: `JS-03-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### JS-03-Q01

Which statement best explains “Primitive data types” in the context of Values, Data Types, and Boolean Logic?

1. Primitive values include string, number, bigint, boolean, undefined, symbol, and null. They represent atomic values and are copied by value. Objects, arrays, and functions are reference-based values.
2. Objects can delegate missing property lookup to another object through a prototype link. Shared methods live on prototypes rather than being copied.
3. Use a minimal failing case, logs, breakpoints, stack traces, and binary isolation to locate where observed behavior diverges from expected behavior.
4. Publisher–subscriber communication lets one part announce an event without directly knowing every consumer. Subscribers respond through a documented event and payload contract.

**Correct answer:** Primitive values include string, number, bigint, boolean, undefined, symbol, and null. They represent atomic values and are copied by value. Objects, arrays, and functions are reference-based values.

**Explanation:** Primitive data types is best understood as follows: Primitive values include string, number, bigint, boolean, undefined, symbol, and null. They represent atomic values and are copied by value. Objects, arrays, and functions are reference-based values.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-03-Q02

Which statement best explains “Dynamic typing” in the context of Values, Data Types, and Boolean Logic?

1. Objects can delegate missing property lookup to another object through a prototype link. Shared methods live on prototypes rather than being copied.
2. Variables are not permanently bound to one type. Each value still has a definite runtime type, but a variable may refer to different kinds of values over time. Clear data boundaries and validation are therefore…
3. Publisher–subscriber communication lets one part announce an event without directly knowing every consumer. Subscribers respond through a documented event and payload contract.
4. Use a minimal failing case, logs, breakpoints, stack traces, and binary isolation to locate where observed behavior diverges from expected behavior.

**Correct answer:** Variables are not permanently bound to one type. Each value still has a definite runtime type, but a variable may refer to different kinds of values over time. Clear data boundaries and validation are therefore…

**Explanation:** Dynamic typing is best understood as follows: Variables are not permanently bound to one type. Each value still has a definite runtime type, but a variable may refer to different kinds of values over time. Clear data boundaries and validation are therefore…

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-03-Q03

Which statement best explains “Boolean values and logical reasoning” in the context of Values, Data Types, and Boolean Logic?

1. Objects can delegate missing property lookup to another object through a prototype link. Shared methods live on prototypes rather than being copied.
2. Use a minimal failing case, logs, breakpoints, stack traces, and binary isolation to locate where observed behavior diverges from expected behavior.
3. Publisher–subscriber communication lets one part announce an event without directly knowing every consumer. Subscribers respond through a documented event and payload contract.
4. Boolean reasoning combines propositions with NOT, AND, and OR. Translate requirements into smaller conditions, then inspect how short-circuiting affects both the result and which expressions execute.

**Correct answer:** Boolean reasoning combines propositions with NOT, AND, and OR. Translate requirements into smaller conditions, then inspect how short-circuiting affects both the result and which expressions execute.

**Explanation:** Boolean values and logical reasoning is best understood as follows: Boolean reasoning combines propositions with NOT, AND, and OR. Translate requirements into smaller conditions, then inspect how short-circuiting affects both the result and which expressions execute.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-03-Q04

A learner must use Values, Data Types, and Boolean Logic in a new situation. Which approach best demonstrates transferable understanding?

1. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
2. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
3. Apply Primitive data types deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
4. Add more state and abstraction immediately, before identifying the smallest requirement.

**Correct answer:** Apply Primitive data types deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### JS-03-Q05

What is the most accurate explanation of the following Values, Data Types, and Boolean Logic example?

```js
const lessons = 12;
const title = 'JavaScript';
const isPublished = false;

console.log(typeof lessons, typeof title, typeof isPublished);
```

1. The snippet guarantees that all values are immutable and all operations are asynchronous.
2. Each value has a runtime type even though variables are not permanently restricted to that type.
3. The snippet removes the need to understand the data flowing through the program.
4. The snippet is valid only because JavaScript ignores variable scope and evaluation order.

**Correct answer:** Each value has a runtime type even though variables are not permanently restricted to that type.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### JS-03-Q06

Which response best addresses this common mistake: “Memorizing syntax without predicting the underlying value or execution order.”?

1. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
2. The statement is correct only when variable names are short.
3. The statement is always correct, so no further reasoning about Values, Data Types, and Boolean Logic is needed.
4. The statement is unrelated to program behavior and cannot cause defects.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### JS-03-Q07

Which sequence is most reliable when solving a problem involving Values, Data Types, and Boolean Logic?

1. Optimize first, then decide what the code is supposed to do.
2. First identify the requirement, then apply the relevant rule from Primitive data types, inspect the result, and only then refactor or optimize.
3. Start with a framework abstraction and avoid checking the underlying language behavior.
4. Copy an unrelated implementation, hide the assumptions, and test only the happy path.

**Correct answer:** First identify the requirement, then apply the relevant rule from Primitive data types, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### JS-03-Q08

Which guideline shows the best judgment about when to use Values, Data Types, and Boolean Logic?

1. Use Values, Data Types, and Boolean Logic when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
2. Use Values, Data Types, and Boolean Logic in every file because more abstraction is always better.
3. Choose based only on line count, without considering readability, correctness, or future change.
4. Avoid Values, Data Types, and Boolean Logic completely because all abstractions reduce maintainability.

**Correct answer:** Use Values, Data Types, and Boolean Logic when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Data Types — Coverage research only; no transcript wording is canonical.
- Boolean Logic — Coverage research only; no transcript wording is canonical.
- Values and Variables — Optional coverage reference; learner-facing wording must be original.
- let, const and var — Optional coverage reference; learner-facing wording must be original.
- Basic Operators — Optional coverage reference; learner-facing wording must be original.
- Type Conversion and Coercion — Optional coverage reference; learner-facing wording must be original.
- Truthy and Falsy Values — Optional coverage reference; learner-facing wording must be original.
- Logical Operators — Optional coverage reference; learner-facing wording must be original.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — Technical verification and freshness review.
- [MDN DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) — Technical verification and freshness review.
- [MDN Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — Technical verification and freshness review.
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
