---
schemaVersion: '1.0'
id: JS-02
slug: introduction-to-javascript
trackId: javascript
moduleId: JS-M01
order: 2
title: Introduction to JavaScript
required: true
optional: false
advanced: false
contentType: core
difficulty: 1
estimatedMinutes: 15
requiredPrerequisiteTopicIds: []
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Introduction to JavaScript

> **Why this matters:** Introduction to JavaScript is part of the mental model learners need before making reliable implementation decisions. It belongs to the **Orientation and Foundations** module.

## Learning objectives

- [JS-02-LO1] Explain what javascript is using a new example and justify the result.
- [JS-02-LO2] Explain javascript's role in the web using a new example and justify the result.
- [JS-02-LO3] Explain where javascript runs using a new example and justify the result.

## Mental model

Draw a decision map: **What JavaScript is** → **JavaScript's role in the web** → **Where JavaScript runs**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## What JavaScript is

JavaScript is a general-purpose programming language standardized through ECMAScript. It is dynamically typed, supports multiple programming styles, and treats functions as values. A host runtime supplies capabilities beyond the language itself.

_Knowledge check: `JS-02-Q01`_

## JavaScript's role in the web

HTML describes structure, CSS describes presentation, and JavaScript expresses behavior and application logic. It responds to events, changes the document, communicates with servers, and coordinates state.

_Knowledge check: `JS-02-Q02`_

## Where JavaScript runs

JavaScript runs inside an engine embedded in a host environment. Browsers expose the DOM, timers, networking, and storage; server runtimes expose different APIs. Language features are portable, but host APIs depend on the environment.

_Knowledge check: `JS-02-Q03`_

## Worked example

```js
const platform = 'JS2Next';
console.log(`${platform} runs JavaScript in the browser.`);
```

A value is created, interpolated into a string, and passed to a host-provided console API.

## Common mistakes

- Memorizing syntax without predicting the underlying value or execution order.
- Mutating shared data when the task expects a new value or explicit ownership.
- Treating browser APIs and language features as the same layer.
- Choosing an abstraction from habit rather than required operations.

## Summary

- Introduction to JavaScript connects What JavaScript is, JavaScript's role in the web, Where JavaScript runs.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: JS-02-Q01, JS-02-Q02, JS-02-Q03
- Topic quiz: `JS-02-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### JS-02-Q01

Which statement best explains “What JavaScript is” in the context of Introduction to JavaScript?

1. JavaScript is a general-purpose programming language standardized through ECMAScript. It is dynamically typed, supports multiple programming styles, and treats functions as values. A host runtime supplies…
2. In object.method(), the object before the dot provides this for that call. Detaching the method changes the call form and may lose the intended receiver.
3. Variables are not permanently bound to one type. Each value still has a definite runtime type, but a variable may refer to different kinds of values over time. Clear data boundaries and validation are therefore…
4. Array filter returns a new array containing only elements whose predicate is truthy.

**Correct answer:** JavaScript is a general-purpose programming language standardized through ECMAScript. It is dynamically typed, supports multiple programming styles, and treats functions as values. A host runtime supplies…

**Explanation:** What JavaScript is is best understood as follows: JavaScript is a general-purpose programming language standardized through ECMAScript. It is dynamically typed, supports multiple programming styles, and treats functions as values. A host runtime supplies…

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-02-Q02

Which statement best explains “JavaScript's role in the web” in the context of Introduction to JavaScript?

1. HTML describes structure, CSS describes presentation, and JavaScript expresses behavior and application logic. It responds to events, changes the document, communicates with servers, and coordinates state.
2. In object.method(), the object before the dot provides this for that call. Detaching the method changes the call form and may lose the intended receiver.
3. Array filter returns a new array containing only elements whose predicate is truthy.
4. Variables are not permanently bound to one type. Each value still has a definite runtime type, but a variable may refer to different kinds of values over time. Clear data boundaries and validation are therefore…

**Correct answer:** HTML describes structure, CSS describes presentation, and JavaScript expresses behavior and application logic. It responds to events, changes the document, communicates with servers, and coordinates state.

**Explanation:** JavaScript's role in the web is best understood as follows: HTML describes structure, CSS describes presentation, and JavaScript expresses behavior and application logic. It responds to events, changes the document, communicates with servers, and coordinates state.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-02-Q03

Which statement best explains “Where JavaScript runs” in the context of Introduction to JavaScript?

1. JavaScript runs inside an engine embedded in a host environment. Browsers expose the DOM, timers, networking, and storage; server runtimes expose different APIs. Language features are portable, but host APIs depend…
2. Array filter returns a new array containing only elements whose predicate is truthy.
3. Variables are not permanently bound to one type. Each value still has a definite runtime type, but a variable may refer to different kinds of values over time. Clear data boundaries and validation are therefore…
4. In object.method(), the object before the dot provides this for that call. Detaching the method changes the call form and may lose the intended receiver.

**Correct answer:** JavaScript runs inside an engine embedded in a host environment. Browsers expose the DOM, timers, networking, and storage; server runtimes expose different APIs. Language features are portable, but host APIs depend…

**Explanation:** Where JavaScript runs is best understood as follows: JavaScript runs inside an engine embedded in a host environment. Browsers expose the DOM, timers, networking, and storage; server runtimes expose different APIs. Language features are portable, but host APIs depend…

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-02-Q04

A learner must use Introduction to JavaScript in a new situation. Which approach best demonstrates transferable understanding?

1. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
2. Apply What JavaScript is deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
3. Add more state and abstraction immediately, before identifying the smallest requirement.
4. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.

**Correct answer:** Apply What JavaScript is deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### JS-02-Q05

What is the most accurate explanation of the following Introduction to JavaScript example?

```js
const platform = 'JS2Next';
console.log(`${platform} runs JavaScript in the browser.`);
```

1. The snippet guarantees that all values are immutable and all operations are asynchronous.
2. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
3. The snippet removes the need to understand the data flowing through the program.
4. A value is created, interpolated into a string, and passed to a host-provided console API.

**Correct answer:** A value is created, interpolated into a string, and passed to a host-provided console API.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### JS-02-Q06

Which response best addresses this common mistake: “Memorizing syntax without predicting the underlying value or execution order.”?

1. The statement is correct only when variable names are short.
2. The statement is unrelated to program behavior and cannot cause defects.
3. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
4. The statement is always correct, so no further reasoning about Introduction to JavaScript is needed.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### JS-02-Q07

Which sequence is most reliable when solving a problem involving Introduction to JavaScript?

1. Start with a framework abstraction and avoid checking the underlying language behavior.
2. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
3. First identify the requirement, then apply the relevant rule from What JavaScript is, inspect the result, and only then refactor or optimize.
4. Optimize first, then decide what the code is supposed to do.

**Correct answer:** First identify the requirement, then apply the relevant rule from What JavaScript is, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### JS-02-Q08

Which guideline shows the best judgment about when to use Introduction to JavaScript?

1. Use Introduction to JavaScript when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
2. Choose based only on line count, without considering readability, correctness, or future change.
3. Avoid Introduction to JavaScript completely because all abstractions reduce maintainability.
4. Use Introduction to JavaScript in every file because more abstraction is always better.

**Correct answer:** Use Introduction to JavaScript when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- A Brief Introduction to JavaScript — Coverage research only; no transcript wording is canonical.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — Technical verification and freshness review.
- [MDN DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) — Technical verification and freshness review.
- [MDN Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — Technical verification and freshness review.
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
