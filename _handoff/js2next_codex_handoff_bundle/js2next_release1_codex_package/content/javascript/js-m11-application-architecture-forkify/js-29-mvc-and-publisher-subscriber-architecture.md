---
schemaVersion: '1.0'
id: JS-29
slug: mvc-and-publisher-subscriber-architecture
trackId: javascript
moduleId: JS-M11
order: 2
title: MVC and Publisher–Subscriber Architecture
required: true
optional: false
advanced: false
contentType: core
difficulty: 4
estimatedMinutes: 25
requiredPrerequisiteTopicIds:
- JS-28
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# MVC and Publisher–Subscriber Architecture

> **Why this matters:** This topic turns mvc and publisher–subscriber architecture from isolated terminology into a practical tool for reading, writing, and reviewing code. It belongs to the **Application Architecture: Forkify** module.

## Learning objectives

- [JS-29-LO1] Explain model, view, and controller responsibilities using a new example and justify the result.
- [JS-29-LO2] Explain separation of concerns using a new example and justify the result.
- [JS-29-LO3] Trace and explain publisher–subscriber event flow using a new example and justify the result.

## Mental model

Draw a decision map: **Model, view, and controller responsibilities** → **Separation of concerns** → **Publisher–subscriber event flow**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Model, view, and controller responsibilities

Model owns data, view renders, and controller coordinates input.

_Knowledge check: `JS-29-Q01`_

## Separation of concerns

Separate code by responsibility so one kind of change causes minimal unrelated edits. Good boundaries reduce coupling without creating empty abstractions.

_Knowledge check: `JS-29-Q02`_

## Publisher–subscriber event flow

Publisher–subscriber communication lets one part announce an event without directly knowing every consumer. Subscribers respond through a documented event and payload contract.

_Knowledge check: `JS-29-Q03`_

## Worked example

```js
class ProgressModel {
  complete(topicId) { /* update data */ }
}
class ProgressView {
  bindComplete(handler) { /* publish intent */ }
  render(state) { /* display state */ }
}
class ProgressController {
  constructor(model, view) {
    view.bindComplete(id => model.complete(id));
  }
}
```

The view publishes intent, the controller coordinates, and the model owns data.

## Common mistakes

- Memorizing syntax without predicting the underlying value or execution order.
- Mutating shared data when the task expects a new value or explicit ownership.
- Treating browser APIs and language features as the same layer.
- Choosing an abstraction from habit rather than required operations.

## Summary

- MVC and Publisher–Subscriber Architecture connects Model, view, and controller responsibilities, Separation of concerns, Publisher–subscriber event flow.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: JS-29-Q01, JS-29-Q02, JS-29-Q03
- Topic quiz: `JS-29-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### JS-29-Q01

Which statement best explains “Model, view, and controller responsibilities” in the context of MVC and Publisher–Subscriber Architecture?

1. Closures retain bindings rather than frozen copies. Later calls observe the current value of a captured binding.
2. Garbage collection reclaims values that are no longer reachable. Event listeners, timers, caches, and closures can accidentally retain references and extend lifetimes.
3. Choose a data structure by the dominant operations: ordered iteration, lookup, uniqueness, insertion, deletion, and serialization. No structure is universally best.
4. Model owns data, view renders, and controller coordinates input.

**Correct answer:** Model owns data, view renders, and controller coordinates input.

**Explanation:** Model, view, and controller responsibilities is best understood as follows: Model owns data, view renders, and controller coordinates input.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-29-Q02

Which statement best explains “Separation of concerns” in the context of MVC and Publisher–Subscriber Architecture?

1. Separate code by responsibility so one kind of change causes minimal unrelated edits. Good boundaries reduce coupling without creating empty abstractions.
2. Closures retain bindings rather than frozen copies. Later calls observe the current value of a captured binding.
3. Garbage collection reclaims values that are no longer reachable. Event listeners, timers, caches, and closures can accidentally retain references and extend lifetimes.
4. Choose a data structure by the dominant operations: ordered iteration, lookup, uniqueness, insertion, deletion, and serialization. No structure is universally best.

**Correct answer:** Separate code by responsibility so one kind of change causes minimal unrelated edits. Good boundaries reduce coupling without creating empty abstractions.

**Explanation:** Separation of concerns is best understood as follows: Separate code by responsibility so one kind of change causes minimal unrelated edits. Good boundaries reduce coupling without creating empty abstractions.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-29-Q03

Which statement best explains “Publisher–subscriber event flow” in the context of MVC and Publisher–Subscriber Architecture?

1. Choose a data structure by the dominant operations: ordered iteration, lookup, uniqueness, insertion, deletion, and serialization. No structure is universally best.
2. Closures retain bindings rather than frozen copies. Later calls observe the current value of a captured binding.
3. Garbage collection reclaims values that are no longer reachable. Event listeners, timers, caches, and closures can accidentally retain references and extend lifetimes.
4. Publisher–subscriber communication lets one part announce an event without directly knowing every consumer. Subscribers respond through a documented event and payload contract.

**Correct answer:** Publisher–subscriber communication lets one part announce an event without directly knowing every consumer. Subscribers respond through a documented event and payload contract.

**Explanation:** Publisher–subscriber event flow is best understood as follows: Publisher–subscriber communication lets one part announce an event without directly knowing every consumer. Subscribers respond through a documented event and payload contract.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### JS-29-Q04

A learner must use MVC and Publisher–Subscriber Architecture in a new situation. Which approach best demonstrates transferable understanding?

1. Add more state and abstraction immediately, before identifying the smallest requirement.
2. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
3. Apply Model, view, and controller responsibilities deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
4. Skip the underlying model and rely on memorized syntax, even when the result is unclear.

**Correct answer:** Apply Model, view, and controller responsibilities deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### JS-29-Q05

What is the most accurate explanation of the following MVC and Publisher–Subscriber Architecture example?

```js
class ProgressModel {
  complete(topicId) { /* update data */ }
}
class ProgressView {
  bindComplete(handler) { /* publish intent */ }
  render(state) { /* display state */ }
}
class ProgressController {
  constructor(model, view) {
    view.bindComplete(id => model.complete(id));
  }
}
```

1. The snippet guarantees that all values are immutable and all operations are asynchronous.
2. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
3. The view publishes intent, the controller coordinates, and the model owns data.
4. The snippet removes the need to understand the data flowing through the program.

**Correct answer:** The view publishes intent, the controller coordinates, and the model owns data.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### JS-29-Q06

Which response best addresses this common mistake: “Memorizing syntax without predicting the underlying value or execution order.”?

1. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
2. The statement is correct only when variable names are short.
3. The statement is always correct, so no further reasoning about MVC and Publisher–Subscriber Architecture is needed.
4. The statement is unrelated to program behavior and cannot cause defects.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### JS-29-Q07

Which sequence is most reliable when solving a problem involving MVC and Publisher–Subscriber Architecture?

1. First identify the requirement, then apply the relevant rule from Model, view, and controller responsibilities, inspect the result, and only then refactor or optimize.
2. Start with a framework abstraction and avoid checking the underlying language behavior.
3. Optimize first, then decide what the code is supposed to do.
4. Copy an unrelated implementation, hide the assumptions, and test only the happy path.

**Correct answer:** First identify the requirement, then apply the relevant rule from Model, view, and controller responsibilities, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### JS-29-Q08

Which guideline shows the best judgment about when to use MVC and Publisher–Subscriber Architecture?

1. Avoid MVC and Publisher–Subscriber Architecture completely because all abstractions reduce maintainability.
2. Choose based only on line count, without considering readability, correctness, or future change.
3. Use MVC and Publisher–Subscriber Architecture when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
4. Use MVC and Publisher–Subscriber Architecture in every file because more abstraction is always better.

**Correct answer:** Use MVC and Publisher–Subscriber Architecture when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- The MVC Architecture — Coverage research only; no transcript wording is canonical.
- Event Handlers in MVC: Publisher-Subscriber Pattern — Coverage research only; no transcript wording is canonical.
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — Technical verification and freshness review.
- [MDN DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) — Technical verification and freshness review.
- [MDN Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) — Technical verification and freshness review.
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
