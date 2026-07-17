---
schemaVersion: '1.0'
id: JS-13
slug: choosing-the-right-data-structure
trackId: javascript
moduleId: JS-M05
order: 1
title: Choosing the Right Data Structure
required: true
optional: false
advanced: false
contentType: core
difficulty: 2
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- JS-12
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Choosing the Right Data Structure

> **Why this matters:** Learners frequently use choosing the right data structure without a clear model of why it behaves as it does; this lesson makes that model explicit. It belongs to the **Data Structures and Functional Techniques** module.

## Learning objectives

- [JS-13-LO1] Explain arrays and objects using a new example and justify the result.
- [JS-13-LO2] Explain sets and maps using a new example and justify the result.
- [JS-13-LO3] Choose and justify selection criteria and trade-offs using a new example and justify the result.

## Mental model

Draw a decision map: **Arrays and objects** → **Sets and maps** → **Selection criteria and trade-offs**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Arrays and objects

Arrays model ordered sequences; objects model records with named properties. Choose the shape that matches the data and operations.

_Knowledge check: `JS-13-Q01`_

## Sets and maps

A Set models unique values and membership. A Map models an explicit key-value collection with flexible keys and predictable iteration.

_Knowledge check: `JS-13-Q02`_

## Selection criteria and trade-offs

Choose a data structure by the dominant operations: ordered iteration, lookup, uniqueness, insertion, deletion, and serialization. No structure is universally best.

_Knowledge check: `JS-13-Q03`_

## Worked example

```js
const topics = [
  { id: 'js-15', title: 'Closures' },
  { id: 'js-24', title: 'Promises' },
];
const byId = new Map(topics.map(topic => [topic.id, topic]));
const tags = new Set(['js', 'async', 'js']);

console.log(byId.get('js-24').title, tags.size);
```

An array stores order, a Map provides keyed lookup, and a Set enforces uniqueness.

## Common mistakes

- Memorizing syntax without predicting the underlying value or execution order.
- Mutating shared data when the task expects a new value or explicit ownership.
- Treating browser APIs and language features as the same layer.
- Choosing an abstraction from habit rather than required operations.

## Summary

- Choosing the Right Data Structure connects Arrays and objects, Sets and maps, Selection criteria and trade-offs.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: JS-13-Q01, JS-13-Q02, JS-13-Q03
- Topic quiz: `JS-13-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### JS-13-Q01

Which statement best explains “Arrays and objects” in the context of Choosing the Right Data Structure?

1. Arrays model ordered sequences; objects model records with named properties. Choose the shape that matches the data and operations.
2. Exports define a module's public API; imports declare required values. Narrow APIs and acyclic dependencies improve maintainability.
3. Array filter returns a new array containing only elements whose predicate is truthy.
4. AJAX is the practice of exchanging data without replacing the whole page. An API defines endpoints, inputs, outputs, status codes, and error behavior.

**Correct answer:** Arrays model ordered sequences; objects model records with named properties. Choose the shape that matches the data and operations.

**Explanation:** Arrays and objects is best understood as follows: Arrays model ordered sequences; objects model records with named properties. Choose the shape that matches the data and operations.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-13-Q02

Which statement best explains “Sets and maps” in the context of Choosing the Right Data Structure?

1. A Set models unique values and membership. A Map models an explicit key-value collection with flexible keys and predictable iteration.
2. Array filter returns a new array containing only elements whose predicate is truthy.
3. AJAX is the practice of exchanging data without replacing the whole page. An API defines endpoints, inputs, outputs, status codes, and error behavior.
4. Exports define a module's public API; imports declare required values. Narrow APIs and acyclic dependencies improve maintainability.

**Correct answer:** A Set models unique values and membership. A Map models an explicit key-value collection with flexible keys and predictable iteration.

**Explanation:** Sets and maps is best understood as follows: A Set models unique values and membership. A Map models an explicit key-value collection with flexible keys and predictable iteration.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-13-Q03

Which statement best explains “Selection criteria and trade-offs” in the context of Choosing the Right Data Structure?

1. Array filter returns a new array containing only elements whose predicate is truthy.
2. Choose a data structure by the dominant operations: ordered iteration, lookup, uniqueness, insertion, deletion, and serialization. No structure is universally best.
3. AJAX is the practice of exchanging data without replacing the whole page. An API defines endpoints, inputs, outputs, status codes, and error behavior.
4. Exports define a module's public API; imports declare required values. Narrow APIs and acyclic dependencies improve maintainability.

**Correct answer:** Choose a data structure by the dominant operations: ordered iteration, lookup, uniqueness, insertion, deletion, and serialization. No structure is universally best.

**Explanation:** Selection criteria and trade-offs is best understood as follows: Choose a data structure by the dominant operations: ordered iteration, lookup, uniqueness, insertion, deletion, and serialization. No structure is universally best.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-13-Q04

A learner must use Choosing the Right Data Structure in a new situation. Which approach best demonstrates transferable understanding?

1. Add more state and abstraction immediately, before identifying the smallest requirement.
2. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
3. Apply Arrays and objects deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
4. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.

**Correct answer:** Apply Arrays and objects deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### JS-13-Q05

What is the most accurate explanation of the following Choosing the Right Data Structure example?

```js
const topics = [
  { id: 'js-15', title: 'Closures' },
  { id: 'js-24', title: 'Promises' },
];
const byId = new Map(topics.map(topic => [topic.id, topic]));
const tags = new Set(['js', 'async', 'js']);

console.log(byId.get('js-24').title, tags.size);
```

1. An array stores order, a Map provides keyed lookup, and a Set enforces uniqueness.
2. The snippet removes the need to understand the data flowing through the program.
3. The snippet guarantees that all values are immutable and all operations are asynchronous.
4. The snippet is valid only because JavaScript ignores variable scope and evaluation order.

**Correct answer:** An array stores order, a Map provides keyed lookup, and a Set enforces uniqueness.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### JS-13-Q06

Which response best addresses this common mistake: “Memorizing syntax without predicting the underlying value or execution order.”?

1. The statement is unrelated to program behavior and cannot cause defects.
2. The statement is correct only when variable names are short.
3. The statement is always correct, so no further reasoning about Choosing the Right Data Structure is needed.
4. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### JS-13-Q07

Which sequence is most reliable when solving a problem involving Choosing the Right Data Structure?

1. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
2. Start with a framework abstraction and avoid checking the underlying language behavior.
3. First identify the requirement, then apply the relevant rule from Arrays and objects, inspect the result, and only then refactor or optimize.
4. Optimize first, then decide what the code is supposed to do.

**Correct answer:** First identify the requirement, then apply the relevant rule from Arrays and objects, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### JS-13-Q08

Which guideline shows the best judgment about when to use Choosing the Right Data Structure?

1. Avoid Choosing the Right Data Structure completely because all abstractions reduce maintainability.
2. Use Choosing the Right Data Structure in every file because more abstraction is always better.
3. Use Choosing the Right Data Structure when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
4. Choose based only on line count, without considering readability, correctness, or future change.

**Correct answer:** Use Choosing the Right Data Structure when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Summary: Which Data Structure to Use? — Coverage research only; no transcript wording is canonical.
- Introduction to Arrays — Optional coverage reference; learner-facing wording must be original.
- Introduction to Objects — Optional coverage reference; learner-facing wording must be original.
- Sets — Optional coverage reference; learner-facing wording must be original.
- Maps: Fundamentals — Optional coverage reference; learner-facing wording must be original.
- Maps: Iteration — Optional coverage reference; learner-facing wording must be original.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — Technical verification and freshness review.
- [MDN DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) — Technical verification and freshness review.
- [MDN Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — Technical verification and freshness review.
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
