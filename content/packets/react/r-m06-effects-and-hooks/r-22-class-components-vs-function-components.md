---
schemaVersion: '1.0'
id: R-22
slug: class-components-vs-function-components
trackId: react
moduleId: R-M06
order: 5
title: Class Components vs. Function Components
required: false
optional: true
advanced: true
contentType: optional_legacy
difficulty: 3
estimatedMinutes: 15
requiredPrerequisiteTopicIds: []
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Class Components vs. Function Components

> **Why this matters:** The ideas in class components vs. function components recur throughout later React work, reducing memorization and debugging later. It belongs to the **Effects and Hooks** module.

## Learning objectives

- [R-22-LO1] Explain historical class-component model using a new example and justify the result.
- [R-22-LO2] Trace and explain lifecycle methods using a new example and justify the result.
- [R-22-LO3] Explain why function components are preferred using a new example and justify the result.

## Mental model

Draw a decision map: **Historical class-component model** → **Lifecycle methods** → **Why function components are preferred**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Historical class-component model

Class components use instance state, this, and lifecycle methods. They matter for legacy code but are not the preferred model for new teaching.

_Knowledge check: `R-22-Q01`_

## Lifecycle methods

Class lifecycle methods split setup, update, and teardown by timing; Effects group setup and cleanup around one synchronization concern.

_Knowledge check: `R-22-Q02`_

## Why function components are preferred

Function components compose logic through Hooks, avoid this binding, and align with current React features.

_Knowledge check: `R-22-Q03`_

## Worked example

```jsx
function Weather({ city }) {
  const [forecast, setForecast] = useState(null);
  useEffect(() => {
    loadForecast(city).then(setForecast);
  }, [city]);
  return forecast ? <Forecast data={forecast} /> : <p>Loading…</p>;
}
```

A function component expresses memory and synchronization with Hooks.

## Common mistakes

- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.
- Using global state before identifying the real owner and consumers.
- Optimizing renders without a measured user-facing problem.

## Summary

- Class Components vs. Function Components connects Historical class-component model, Lifecycle methods, Why function components are preferred.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-22-Q01, R-22-Q02, R-22-Q03
- Topic quiz: `R-22-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-22-Q01

Which statement best explains “Historical class-component model” in the context of Class Components vs. Function Components?

1. Before adding context, consider moving the consumer closer to the owner or passing a configured element through intermediate components.
2. Redux reducers calculate next state from current state and an action. They must be predictable and side-effect free.
3. Class components use instance state, this, and lifecycle methods. They matter for legacy code but are not the preferred model for new teaching.
4. Code splitting emits separate bundles loaded on demand, often at route or feature boundaries.

**Correct answer:** Class components use instance state, this, and lifecycle methods. They matter for legacy code but are not the preferred model for new teaching.

**Explanation:** Historical class-component model is best understood as follows: Class components use instance state, this, and lifecycle methods. They matter for legacy code but are not the preferred model for new teaching.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-22-Q02

Which statement best explains “Lifecycle methods” in the context of Class Components vs. Function Components?

1. Before adding context, consider moving the consumer closer to the owner or passing a configured element through intermediate components.
2. Class lifecycle methods split setup, update, and teardown by timing; Effects group setup and cleanup around one synchronization concern.
3. Code splitting emits separate bundles loaded on demand, often at route or feature boundaries.
4. Redux reducers calculate next state from current state and an action. They must be predictable and side-effect free.

**Correct answer:** Class lifecycle methods split setup, update, and teardown by timing; Effects group setup and cleanup around one synchronization concern.

**Explanation:** Lifecycle methods is best understood as follows: Class lifecycle methods split setup, update, and teardown by timing; Effects group setup and cleanup around one synchronization concern.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-22-Q03

Which statement best explains “Why function components are preferred” in the context of Class Components vs. Function Components?

1. Before adding context, consider moving the consumer closer to the owner or passing a configured element through intermediate components.
2. Function components compose logic through Hooks, avoid this binding, and align with current React features.
3. Redux reducers calculate next state from current state and an action. They must be predictable and side-effect free.
4. Code splitting emits separate bundles loaded on demand, often at route or feature boundaries.

**Correct answer:** Function components compose logic through Hooks, avoid this binding, and align with current React features.

**Explanation:** Why function components are preferred is best understood as follows: Function components compose logic through Hooks, avoid this binding, and align with current React features.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-22-Q04

A learner must use Class Components vs. Function Components in a new situation. Which approach best demonstrates transferable understanding?

1. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
2. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
3. Apply Historical class-component model deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
4. Add more state and abstraction immediately, before identifying the smallest requirement.

**Correct answer:** Apply Historical class-component model deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-22-Q05

What is the most accurate explanation of the following Class Components vs. Function Components example?

```jsx
function Weather({ city }) {
  const [forecast, setForecast] = useState(null);
  useEffect(() => {
    loadForecast(city).then(setForecast);
  }, [city]);
  return forecast ? <Forecast data={forecast} /> : <p>Loading…</p>;
}
```

1. A function component expresses memory and synchronization with Hooks.
2. The snippet guarantees that all values are immutable and all operations are asynchronous.
3. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
4. The snippet removes the need to understand the data flowing through the program.

**Correct answer:** A function component expresses memory and synchronization with Hooks.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-22-Q06

Which response best addresses this common mistake: “Mutating props or state instead of producing the next value.”?

1. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
2. The statement is always correct, so no further reasoning about Class Components vs. Function Components is needed.
3. The statement is correct only when variable names are short.
4. The statement is unrelated to program behavior and cannot cause defects.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-22-Q07

Which sequence is most reliable when solving a problem involving Class Components vs. Function Components?

1. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
2. Optimize first, then decide what the code is supposed to do.
3. Start with a framework abstraction and avoid checking the underlying language behavior.
4. First identify the requirement, then apply the relevant rule from Historical class-component model, inspect the result, and only then refactor or optimize.

**Correct answer:** First identify the requirement, then apply the relevant rule from Historical class-component model, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-22-Q08

Which guideline shows the best judgment about when to use Class Components vs. Function Components?

1. Avoid Class Components vs. Function Components completely because all abstractions reduce maintainability.
2. Use Class Components vs. Function Components when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
3. Use Class Components vs. Function Components in every file because more abstraction is always better.
4. Choose based only on line count, without considering readability, correctness, or future change.

**Correct answer:** Use Class Components vs. Function Components when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Class Components vs. Function Components — Coverage research only; no transcript wording is canonical.
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
