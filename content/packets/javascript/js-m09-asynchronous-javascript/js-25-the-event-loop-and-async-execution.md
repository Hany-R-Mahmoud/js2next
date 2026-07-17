---
schemaVersion: '1.0'
id: JS-25
slug: the-event-loop-and-async-execution
trackId: javascript
moduleId: JS-M09
order: 3
title: The Event Loop and Async Execution
required: true
optional: false
advanced: false
contentType: core
difficulty: 3
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- JS-24
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# The Event Loop and Async Execution

> **Why this matters:** This topic turns the event loop and async execution from isolated terminology into a practical tool for reading, writing, and reviewing code. It belongs to the **Asynchronous JavaScript** module.

## Learning objectives

- [JS-25-LO1] Explain call stack using a new example and justify the result.
- [JS-25-LO2] Apply web apis using a new example and justify the result.
- [JS-25-LO3] Explain callback and microtask queues using a new example and justify the result.
- [JS-25-LO4] Trace and explain event-loop scheduling using a new example and justify the result.

## Mental model

Draw a decision map: **Call stack** → **Web APIs** → **Callback and microtask queues** → **Event-loop scheduling**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Call stack

The call stack records active execution contexts. Calls push frames and returns pop them. Long synchronous work blocks later JavaScript and delays queued work.

_Knowledge check: `JS-25-Q01`_

## Web APIs

Browser APIs perform work outside the JavaScript call stack and queue callbacks or promise reactions when results are ready.

_Knowledge check: `JS-25-Q02`_

## Callback and microtask queues

Promise reactions use the microtask queue; timers and many events use task queues. Microtasks run after the stack clears and before the next task.

_Knowledge check: `JS-25-Q03`_

## Event-loop scheduling

The event loop waits for the stack to clear, drains microtasks, then advances to another task. A zero-delay timer means no earlier than a future task.

_Knowledge check: `JS-25-Q03`_

## Worked example

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```

Synchronous logs run first, the microtask follows, and the timer runs in a later task.

## Common mistakes

- Memorizing syntax without predicting the underlying value or execution order.
- Mutating shared data when the task expects a new value or explicit ownership.
- Treating browser APIs and language features as the same layer.
- Choosing an abstraction from habit rather than required operations.

## Summary

- The Event Loop and Async Execution connects Call stack, Web APIs, Callback and microtask queues.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: JS-25-Q01, JS-25-Q02, JS-25-Q03
- Topic quiz: `JS-25-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### JS-25-Q01

Which statement best explains “Call stack” in the context of The Event Loop and Async Execution?

1. The call stack records active execution contexts. Calls push frames and returns pop them. Long synchronous work blocks later JavaScript and delays queued work.
2. Requests contain a method, URL, headers, and optional body; responses contain status, headers, and body. Network success and application success differ.
3. During bubbling, an event travels from its target toward ancestors. Ancestors can observe descendant events, enabling delegation.
4. JavaScript strongly prioritizes backward compatibility. Old code should continue to run, while new syntax or APIs may still require modern engines, transpilation, or feature checks.

**Correct answer:** The call stack records active execution contexts. Calls push frames and returns pop them. Long synchronous work blocks later JavaScript and delays queued work.

**Explanation:** Call stack is best understood as follows: The call stack records active execution contexts. Calls push frames and returns pop them. Long synchronous work blocks later JavaScript and delays queued work.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-25-Q02

Which statement best explains “Web APIs” in the context of The Event Loop and Async Execution?

1. Browser APIs perform work outside the JavaScript call stack and queue callbacks or promise reactions when results are ready.
2. During bubbling, an event travels from its target toward ancestors. Ancestors can observe descendant events, enabling delegation.
3. Requests contain a method, URL, headers, and optional body; responses contain status, headers, and body. Network success and application success differ.
4. JavaScript strongly prioritizes backward compatibility. Old code should continue to run, while new syntax or APIs may still require modern engines, transpilation, or feature checks.

**Correct answer:** Browser APIs perform work outside the JavaScript call stack and queue callbacks or promise reactions when results are ready.

**Explanation:** Web APIs is best understood as follows: Browser APIs perform work outside the JavaScript call stack and queue callbacks or promise reactions when results are ready.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-25-Q03

Which statement best explains “Callback and microtask queues” in the context of The Event Loop and Async Execution?

1. During bubbling, an event travels from its target toward ancestors. Ancestors can observe descendant events, enabling delegation.
2. Promise reactions use the microtask queue; timers and many events use task queues. Microtasks run after the stack clears and before the next task.
3. Requests contain a method, URL, headers, and optional body; responses contain status, headers, and body. Network success and application success differ.
4. JavaScript strongly prioritizes backward compatibility. Old code should continue to run, while new syntax or APIs may still require modern engines, transpilation, or feature checks.

**Correct answer:** Promise reactions use the microtask queue; timers and many events use task queues. Microtasks run after the stack clears and before the next task.

**Explanation:** Callback and microtask queues is best understood as follows: Promise reactions use the microtask queue; timers and many events use task queues. Microtasks run after the stack clears and before the next task.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-25-Q04

A learner must use The Event Loop and Async Execution in a new situation. Which approach best demonstrates transferable understanding?

1. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
2. Apply Call stack deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
3. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
4. Add more state and abstraction immediately, before identifying the smallest requirement.

**Correct answer:** Apply Call stack deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### JS-25-Q05

What is the most accurate explanation of the following The Event Loop and Async Execution example?

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```

1. The snippet guarantees that all values are immutable and all operations are asynchronous.
2. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
3. Synchronous logs run first, the microtask follows, and the timer runs in a later task.
4. The snippet removes the need to understand the data flowing through the program.

**Correct answer:** Synchronous logs run first, the microtask follows, and the timer runs in a later task.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### JS-25-Q06

Which response best addresses this common mistake: “Memorizing syntax without predicting the underlying value or execution order.”?

1. The statement is correct only when variable names are short.
2. The statement is unrelated to program behavior and cannot cause defects.
3. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
4. The statement is always correct, so no further reasoning about The Event Loop and Async Execution is needed.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### JS-25-Q07

Which sequence is most reliable when solving a problem involving The Event Loop and Async Execution?

1. First identify the requirement, then apply the relevant rule from Call stack, inspect the result, and only then refactor or optimize.
2. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
3. Optimize first, then decide what the code is supposed to do.
4. Start with a framework abstraction and avoid checking the underlying language behavior.

**Correct answer:** First identify the requirement, then apply the relevant rule from Call stack, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### JS-25-Q08

Which guideline shows the best judgment about when to use The Event Loop and Async Execution?

1. Use The Event Loop and Async Execution when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
2. Use The Event Loop and Async Execution in every file because more abstraction is always better.
3. Choose based only on line count, without considering readability, correctness, or future change.
4. Avoid The Event Loop and Async Execution completely because all abstractions reduce maintainability.

**Correct answer:** Use The Event Loop and Async Execution when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Asynchronous Behind the Scenes: The Event Loop — Coverage research only; no transcript wording is canonical.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — Technical verification and freshness review.
- [MDN DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) — Technical verification and freshness review.
- [MDN Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — Technical verification and freshness review.
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
