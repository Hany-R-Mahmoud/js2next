---
schemaVersion: '1.0'
id: JS-24
slug: promises-and-the-fetch-api
trackId: javascript
moduleId: JS-M09
order: 2
title: Promises and the Fetch API
required: true
optional: false
advanced: false
contentType: core
difficulty: 3
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- JS-23
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Promises and the Fetch API

> **Why this matters:** Promises and the Fetch API is part of the mental model learners need before making reliable implementation decisions. It belongs to the **Asynchronous JavaScript** module.

## Learning objectives

- [JS-24-LO1] Explain promise states using a new example and justify the result.
- [JS-24-LO2] Apply fetching data using a new example and justify the result.
- [JS-24-LO3] Explain success and failure paths using a new example and justify the result.

## Mental model

Draw a decision map: **Promise states** → **Fetching data** → **Success and failure paths**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Promise states

A Promise begins pending and settles once as fulfilled or rejected. then, catch, and finally schedule reactions asynchronously.

_Knowledge check: `JS-24-Q01`_

## Fetching data

fetch returns a Promise for a Response. Check response status, parse the body, and model loading and error states explicitly.

_Knowledge check: `JS-24-Q02`_

## Success and failure paths

Design successful and failed outcomes deliberately. A resolved network request may still contain an HTTP error or invalid data.

_Knowledge check: `JS-24-Q03`_

## Worked example

```js
fetch('/api/progress')
  .then(response => {
    if (!response.ok) throw new Error('Unable to load progress');
    return response.json();
  })
  .then(progress => console.log(progress))
  .catch(error => console.error(error));
```

Each handler returns the value for the next promise and one catch handles earlier rejection.

## Common mistakes

- Forgetting to return from a `then` handler.
- Assuming `fetch` rejects for every HTTP error response.
- Memorizing syntax without predicting the underlying value or execution order.
- Mutating shared data when the task expects a new value or explicit ownership.

## Summary

- Promises and the Fetch API connects Promise states, Fetching data, Success and failure paths.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: JS-24-Q01, JS-24-Q02, JS-24-Q03
- Topic quiz: `JS-24-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### JS-24-Q01

Which statement best explains “Promise states” in the context of Promises and the Fetch API?

1. Promise reactions use the microtask queue; timers and many events use task queues. Microtasks run after the stack clears and before the next task.
2. AI tools can accelerate explanation and review, but generated output is an untrusted proposal. Supply exact context, ask for assumptions, run the result, compare with documentation, and explain it independently.
3. Browser APIs perform work outside the JavaScript call stack and queue callbacks or promise reactions when results are ready.
4. A Promise begins pending and settles once as fulfilled or rejected. then, catch, and finally schedule reactions asynchronously.

**Correct answer:** A Promise begins pending and settles once as fulfilled or rejected. then, catch, and finally schedule reactions asynchronously.

**Explanation:** Promise states is best understood as follows: A Promise begins pending and settles once as fulfilled or rejected. then, catch, and finally schedule reactions asynchronously.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-24-Q02

Which statement best explains “Fetching data” in the context of Promises and the Fetch API?

1. Promise reactions use the microtask queue; timers and many events use task queues. Microtasks run after the stack clears and before the next task.
2. AI tools can accelerate explanation and review, but generated output is an untrusted proposal. Supply exact context, ask for assumptions, run the result, compare with documentation, and explain it independently.
3. Browser APIs perform work outside the JavaScript call stack and queue callbacks or promise reactions when results are ready.
4. fetch returns a Promise for a Response. Check response status, parse the body, and model loading and error states explicitly.

**Correct answer:** fetch returns a Promise for a Response. Check response status, parse the body, and model loading and error states explicitly.

**Explanation:** Fetching data is best understood as follows: fetch returns a Promise for a Response. Check response status, parse the body, and model loading and error states explicitly.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-24-Q03

Which statement best explains “Success and failure paths” in the context of Promises and the Fetch API?

1. Design successful and failed outcomes deliberately. A resolved network request may still contain an HTTP error or invalid data.
2. Promise reactions use the microtask queue; timers and many events use task queues. Microtasks run after the stack clears and before the next task.
3. AI tools can accelerate explanation and review, but generated output is an untrusted proposal. Supply exact context, ask for assumptions, run the result, compare with documentation, and explain it independently.
4. Browser APIs perform work outside the JavaScript call stack and queue callbacks or promise reactions when results are ready.

**Correct answer:** Design successful and failed outcomes deliberately. A resolved network request may still contain an HTTP error or invalid data.

**Explanation:** Success and failure paths is best understood as follows: Design successful and failed outcomes deliberately. A resolved network request may still contain an HTTP error or invalid data.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-24-Q04

A learner must use Promises and the Fetch API in a new situation. Which approach best demonstrates transferable understanding?

1. Apply Promise states deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
2. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
3. Add more state and abstraction immediately, before identifying the smallest requirement.
4. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.

**Correct answer:** Apply Promise states deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### JS-24-Q05

What is the most accurate explanation of the following Promises and the Fetch API example?

```js
fetch('/api/progress')
  .then(response => {
    if (!response.ok) throw new Error('Unable to load progress');
    return response.json();
  })
  .then(progress => console.log(progress))
  .catch(error => console.error(error));
```

1. The snippet removes the need to understand the data flowing through the program.
2. Each handler returns the value for the next promise and one catch handles earlier rejection.
3. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
4. The snippet guarantees that all values are immutable and all operations are asynchronous.

**Correct answer:** Each handler returns the value for the next promise and one catch handles earlier rejection.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### JS-24-Q06

Which response best addresses this common mistake: “Forgetting to return from a `then` handler.”?

1. The statement is unrelated to program behavior and cannot cause defects.
2. The statement is correct only when variable names are short.
3. The statement is always correct, so no further reasoning about Promises and the Fetch API is needed.
4. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### JS-24-Q07

Which sequence is most reliable when solving a problem involving Promises and the Fetch API?

1. Optimize first, then decide what the code is supposed to do.
2. First identify the requirement, then apply the relevant rule from Promise states, inspect the result, and only then refactor or optimize.
3. Start with a framework abstraction and avoid checking the underlying language behavior.
4. Copy an unrelated implementation, hide the assumptions, and test only the happy path.

**Correct answer:** First identify the requirement, then apply the relevant rule from Promise states, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### JS-24-Q08

Which guideline shows the best judgment about when to use Promises and the Fetch API?

1. Use Promises and the Fetch API in every file because more abstraction is always better.
2. Use Promises and the Fetch API when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
3. Choose based only on line count, without considering readability, correctness, or future change.
4. Avoid Promises and the Fetch API completely because all abstractions reduce maintainability.

**Correct answer:** Use Promises and the Fetch API when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Promises and the Fetch API — Coverage research only; no transcript wording is canonical.
- Consuming Promises — Optional coverage reference; learner-facing wording must be original.
- Chaining Promises — Optional coverage reference; learner-facing wording must be original.
- Handling Rejected Promises — Optional coverage reference; learner-facing wording must be original.
- Consuming Promises with Async/Await — Optional coverage reference; learner-facing wording must be original.
- Error Handling With try...catch — Optional coverage reference; learner-facing wording must be original.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — Technical verification and freshness review.
- [MDN DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) — Technical verification and freshness review.
- [MDN Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — Technical verification and freshness review.
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
