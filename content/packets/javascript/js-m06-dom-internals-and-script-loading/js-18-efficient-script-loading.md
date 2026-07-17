---
schemaVersion: '1.0'
id: JS-18
slug: efficient-script-loading
trackId: javascript
moduleId: JS-M06
order: 2
title: Efficient Script Loading
required: true
optional: false
advanced: false
contentType: core
difficulty: 2
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- JS-17
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Efficient Script Loading

> **Why this matters:** The ideas in efficient script loading recur throughout later JavaScript work, reducing memorization and debugging later. It belongs to the **DOM Internals and Script Loading** module.

## Learning objectives

- [JS-18-LO1] Explain normal scripts using a new example and justify the result.
- [JS-18-LO2] Explain `defer` using a new example and justify the result.
- [JS-18-LO3] Explain `async` using a new example and justify the result.
- [JS-18-LO4] Choose and justify execution-order trade-offs using a new example and justify the result.

## Mental model

Draw a decision map: **Normal scripts** → **`defer`** → **`async`** → **Execution-order trade-offs**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Normal scripts

A classic script without async or defer blocks HTML parsing while it is fetched and executed.

_Knowledge check: `JS-18-Q01`_

## `defer`

A deferred external script downloads in parallel, executes after parsing, and preserves document order among deferred scripts.

_Knowledge check: `JS-18-Q02`_

## `async`

An async external script downloads in parallel and executes as soon as it is ready, without preserving order relative to other async scripts.

_Knowledge check: `JS-18-Q03`_

## Execution-order trade-offs

Choose script loading based on parser blocking, DOM readiness, dependency order, and independence rather than download speed alone.

_Knowledge check: `JS-18-Q03`_

## Worked example

```html
<script src="analytics.js" async></script>
<script src="application.js" defer></script>
```

The independent script can execute when ready; the application script waits for parsed HTML and preserves deferred order.

## Common mistakes

- Memorizing syntax without predicting the underlying value or execution order.
- Mutating shared data when the task expects a new value or explicit ownership.
- Treating browser APIs and language features as the same layer.
- Choosing an abstraction from habit rather than required operations.

## Summary

- Efficient Script Loading connects Normal scripts, `defer`, `async`.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: JS-18-Q01, JS-18-Q02, JS-18-Q03
- Topic quiz: `JS-18-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### JS-18-Q01

Which statement best explains “Normal scripts” in the context of Efficient Script Loading?

1. Requests contain a method, URL, headers, and optional body; responses contain status, headers, and body. Network success and application success differ.
2. Turn a problem into observable inputs, outputs, constraints, and smaller transformations. Describe behavior before syntax, then identify the smallest step that can be tested independently.
3. Architecture planning identifies data, responsibilities, boundaries, and communication paths. The goal is to reduce costly ambiguity about ownership and change, not predict every future file.
4. A classic script without async or defer blocks HTML parsing while it is fetched and executed.

**Correct answer:** A classic script without async or defer blocks HTML parsing while it is fetched and executed.

**Explanation:** Normal scripts is best understood as follows: A classic script without async or defer blocks HTML parsing while it is fetched and executed.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-18-Q02

Which statement best explains “`defer`” in the context of Efficient Script Loading?

1. Turn a problem into observable inputs, outputs, constraints, and smaller transformations. Describe behavior before syntax, then identify the smallest step that can be tested independently.
2. A deferred external script downloads in parallel, executes after parsing, and preserves document order among deferred scripts.
3. Requests contain a method, URL, headers, and optional body; responses contain status, headers, and body. Network success and application success differ.
4. Architecture planning identifies data, responsibilities, boundaries, and communication paths. The goal is to reduce costly ambiguity about ownership and change, not predict every future file.

**Correct answer:** A deferred external script downloads in parallel, executes after parsing, and preserves document order among deferred scripts.

**Explanation:** `defer` is best understood as follows: A deferred external script downloads in parallel, executes after parsing, and preserves document order among deferred scripts.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-18-Q03

Which statement best explains “`async`” in the context of Efficient Script Loading?

1. Architecture planning identifies data, responsibilities, boundaries, and communication paths. The goal is to reduce costly ambiguity about ownership and change, not predict every future file.
2. Requests contain a method, URL, headers, and optional body; responses contain status, headers, and body. Network success and application success differ.
3. Turn a problem into observable inputs, outputs, constraints, and smaller transformations. Describe behavior before syntax, then identify the smallest step that can be tested independently.
4. An async external script downloads in parallel and executes as soon as it is ready, without preserving order relative to other async scripts.

**Correct answer:** An async external script downloads in parallel and executes as soon as it is ready, without preserving order relative to other async scripts.

**Explanation:** `async` is best understood as follows: An async external script downloads in parallel and executes as soon as it is ready, without preserving order relative to other async scripts.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-18-Q04

A learner must use Efficient Script Loading in a new situation. Which approach best demonstrates transferable understanding?

1. Add more state and abstraction immediately, before identifying the smallest requirement.
2. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
3. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
4. Apply Normal scripts deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Correct answer:** Apply Normal scripts deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### JS-18-Q05

What is the most accurate explanation of the following Efficient Script Loading example?

```html
<script src="analytics.js" async></script>
<script src="application.js" defer></script>
```

1. The snippet removes the need to understand the data flowing through the program.
2. The independent script can execute when ready; the application script waits for parsed HTML and preserves deferred order.
3. The snippet guarantees that all values are immutable and all operations are asynchronous.
4. The snippet is valid only because JavaScript ignores variable scope and evaluation order.

**Correct answer:** The independent script can execute when ready; the application script waits for parsed HTML and preserves deferred order.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### JS-18-Q06

Which response best addresses this common mistake: “Memorizing syntax without predicting the underlying value or execution order.”?

1. The statement is correct only when variable names are short.
2. The statement is unrelated to program behavior and cannot cause defects.
3. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
4. The statement is always correct, so no further reasoning about Efficient Script Loading is needed.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### JS-18-Q07

Which sequence is most reliable when solving a problem involving Efficient Script Loading?

1. Optimize first, then decide what the code is supposed to do.
2. First identify the requirement, then apply the relevant rule from Normal scripts, inspect the result, and only then refactor or optimize.
3. Start with a framework abstraction and avoid checking the underlying language behavior.
4. Copy an unrelated implementation, hide the assumptions, and test only the happy path.

**Correct answer:** First identify the requirement, then apply the relevant rule from Normal scripts, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### JS-18-Q08

Which guideline shows the best judgment about when to use Efficient Script Loading?

1. Avoid Efficient Script Loading completely because all abstractions reduce maintainability.
2. Use Efficient Script Loading when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
3. Choose based only on line count, without considering readability, correctness, or future change.
4. Use Efficient Script Loading in every file because more abstraction is always better.

**Correct answer:** Use Efficient Script Loading when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Efficient Script Loading: defer and async — Coverage research only; no transcript wording is canonical.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — Technical verification and freshness review.
- [MDN DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) — Technical verification and freshness review.
- [MDN Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — Technical verification and freshness review.
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
