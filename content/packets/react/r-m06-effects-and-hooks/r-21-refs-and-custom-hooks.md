---
schemaVersion: '1.0'
id: R-21
slug: refs-and-custom-hooks
trackId: react
moduleId: R-M06
order: 4
title: Refs and Custom Hooks
required: true
optional: false
advanced: false
contentType: core
difficulty: 3
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- R-20
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Refs and Custom Hooks

> **Why this matters:** Learners frequently use refs and custom hooks without a clear model of why it behaves as it does; this lesson makes that model explicit. It belongs to the **Effects and Hooks** module.

## Learning objectives

- [R-21-LO1] Explain mutable refs using a new example and justify the result.
- [R-21-LO2] Explain dom refs using a new example and justify the result.
- [R-21-LO3] Explain persisting values using a new example and justify the result.
- [R-21-LO4] Explain extracting reusable hook logic using a new example and justify the result.

## Mental model

Draw a decision map: **Mutable refs** → **DOM refs** → **Persisting values** → **Extracting reusable hook logic**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Mutable refs

A ref is a stable object whose current property can change without causing a render.

_Knowledge check: `R-21-Q01`_

## DOM refs

DOM refs provide imperative access after commit for focus, measurement, scrolling, or non-React integration.

_Knowledge check: `R-21-Q02`_

## Persisting values

Ref values persist for the component instance but changes are invisible to rendering.

_Knowledge check: `R-21-Q03`_

## Extracting reusable hook logic

A custom Hook packages reusable stateful logic. Calls share logic, not the same state instance.

_Knowledge check: `R-21-Q03`_

## Worked example

```jsx
function SearchInput() {
  const inputRef = useRef(null);
  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
  );
}
```

The ref supplies imperative DOM access from an event handler.

## Common mistakes

- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.
- Using global state before identifying the real owner and consumers.
- Optimizing renders without a measured user-facing problem.

## Summary

- Refs and Custom Hooks connects Mutable refs, DOM refs, Persisting values.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-21-Q01, R-21-Q02, R-21-Q03
- Topic quiz: `R-21-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-21-Q01

Which statement best explains “Mutable refs” in the context of Refs and Custom Hooks?

1. Function components compose logic through Hooks, avoid this binding, and align with current React features.
2. A ref is a stable object whose current property can change without causing a render.
3. Routes represent user-visible resources and tasks. Use links for navigation and parameters for identity while preserving browser history.
4. Start from the data model and static component tree, identify minimal state, choose its owner, and add upward communication through callbacks.

**Correct answer:** A ref is a stable object whose current property can change without causing a render.

**Explanation:** Mutable refs is best understood as follows: A ref is a stable object whose current property can change without causing a render.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-21-Q02

Which statement best explains “DOM refs” in the context of Refs and Custom Hooks?

1. DOM refs provide imperative access after commit for focus, measurement, scrolling, or non-React integration.
2. Function components compose logic through Hooks, avoid this binding, and align with current React features.
3. Routes represent user-visible resources and tasks. Use links for navigation and parameters for identity while preserving browser history.
4. Start from the data model and static component tree, identify minimal state, choose its owner, and add upward communication through callbacks.

**Correct answer:** DOM refs provide imperative access after commit for focus, measurement, scrolling, or non-React integration.

**Explanation:** DOM refs is best understood as follows: DOM refs provide imperative access after commit for focus, measurement, scrolling, or non-React integration.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-21-Q03

Which statement best explains “Persisting values” in the context of Refs and Custom Hooks?

1. Routes represent user-visible resources and tasks. Use links for navigation and parameters for identity while preserving browser history.
2. Start from the data model and static component tree, identify minimal state, choose its owner, and add upward communication through callbacks.
3. Ref values persist for the component instance but changes are invisible to rendering.
4. Function components compose logic through Hooks, avoid this binding, and align with current React features.

**Correct answer:** Ref values persist for the component instance but changes are invisible to rendering.

**Explanation:** Persisting values is best understood as follows: Ref values persist for the component instance but changes are invisible to rendering.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-21-Q04

A learner must use Refs and Custom Hooks in a new situation. Which approach best demonstrates transferable understanding?

1. Apply Mutable refs deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
2. Add more state and abstraction immediately, before identifying the smallest requirement.
3. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
4. Skip the underlying model and rely on memorized syntax, even when the result is unclear.

**Correct answer:** Apply Mutable refs deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-21-Q05

What is the most accurate explanation of the following Refs and Custom Hooks example?

```jsx
function SearchInput() {
  const inputRef = useRef(null);
  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
  );
}
```

1. The snippet removes the need to understand the data flowing through the program.
2. The ref supplies imperative DOM access from an event handler.
3. The snippet guarantees that all values are immutable and all operations are asynchronous.
4. The snippet is valid only because JavaScript ignores variable scope and evaluation order.

**Correct answer:** The ref supplies imperative DOM access from an event handler.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-21-Q06

Which response best addresses this common mistake: “Mutating props or state instead of producing the next value.”?

1. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
2. The statement is always correct, so no further reasoning about Refs and Custom Hooks is needed.
3. The statement is correct only when variable names are short.
4. The statement is unrelated to program behavior and cannot cause defects.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-21-Q07

Which sequence is most reliable when solving a problem involving Refs and Custom Hooks?

1. Optimize first, then decide what the code is supposed to do.
2. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
3. First identify the requirement, then apply the relevant rule from Mutable refs, inspect the result, and only then refactor or optimize.
4. Start with a framework abstraction and avoid checking the underlying language behavior.

**Correct answer:** First identify the requirement, then apply the relevant rule from Mutable refs, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-21-Q08

Which guideline shows the best judgment about when to use Refs and Custom Hooks?

1. Use Refs and Custom Hooks when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
2. Choose based only on line count, without considering readability, correctness, or future change.
3. Use Refs and Custom Hooks in every file because more abstraction is always better.
4. Avoid Refs and Custom Hooks completely because all abstractions reduce maintainability.

**Correct answer:** Use Refs and Custom Hooks when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Introducing Another Hook: useRef — Coverage research only; no transcript wording is canonical.
- What are Custom Hooks? When to Create One? — Coverage research only; no transcript wording is canonical.
- Refs to Select DOM Elements — Optional coverage reference; learner-facing wording must be original.
- Refs to Persist Data Between Renders — Optional coverage reference; learner-facing wording must be original.
- Creating our First Custom Hook: useMovies — Optional coverage reference; learner-facing wording must be original.
- [React Learn](https://react.dev/learn) — Technical verification and freshness review.
- [React Managing State](https://react.dev/learn/managing-state) — Technical verification and freshness review.
- [React Escape Hatches](https://react.dev/learn/escape-hatches) — Technical verification and freshness review.
- [React API Reference](https://react.dev/reference/react) — Technical verification and freshness review.
- [Redux Essentials](https://redux.js.org/tutorials/essentials/part-1-overview-concepts) — Technical verification and freshness review.
- [TanStack Query Overview](https://tanstack.com/query/latest/docs/framework/react/overview) — Technical verification and freshness review.
- [Supabase Documentation](https://supabase.com/docs) — Technical verification and freshness review.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
