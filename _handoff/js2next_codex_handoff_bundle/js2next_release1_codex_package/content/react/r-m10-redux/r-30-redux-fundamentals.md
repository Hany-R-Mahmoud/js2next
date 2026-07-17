---
schemaVersion: '1.0'
id: R-30
slug: redux-fundamentals
trackId: react
moduleId: R-M10
order: 1
title: Redux Fundamentals
required: true
optional: false
advanced: false
contentType: core
difficulty: 5
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- R-29
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Redux Fundamentals

> **Why this matters:** Learners frequently use redux fundamentals without a clear model of why it behaves as it does; this lesson makes that model explicit. It belongs to the **Redux** module.

## Learning objectives

- [R-30-LO1] Explain store using a new example and justify the result.
- [R-30-LO2] Explain reducers using a new example and justify the result.
- [R-30-LO3] Explain actions using a new example and justify the result.
- [R-30-LO4] Trace and explain unidirectional state flow using a new example and justify the result.

## Mental model

Draw a decision map: **Store** → **Reducers** → **Actions** → **Unidirectional state flow**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Store

A Redux store holds the application state tree and coordinates dispatch, reducers, subscriptions, and middleware.

_Knowledge check: `R-30-Q01`_

## Reducers

Redux reducers calculate next state from current state and an action. They must be predictable and side-effect free.

_Knowledge check: `R-30-Q02`_

## Actions

Redux actions are plain event descriptions with a type and optional payload.

_Knowledge check: `R-30-Q03`_

## Unidirectional state flow

UI dispatches an action, reducers calculate state, and subscribed UI reads the new state.

_Knowledge check: `R-30-Q03`_

## Worked example

```js
const initialState = { score: 0 };
function reducer(state = initialState, action) {
  if (action.type === 'score/recorded') {
    return { ...state, score: action.payload };
  }
  return state;
}
```

An action describes an event and the reducer calculates the next state.

## Common mistakes

- Putting every local input into Redux.
- Performing side effects inside a reducer.
- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.

## Summary

- Redux Fundamentals connects Store, Reducers, Actions.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-30-Q01, R-30-Q02, R-30-Q03
- Topic quiz: `R-30-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-30-Q01

Which statement best explains “Store” in the context of Redux Fundamentals?

1. memo can skip a component render when props compare equal. It is an optimization, not a correctness mechanism.
2. Use children for the primary nested region and named element props when multiple distinct content regions need clear contracts.
3. A Redux store holds the application state tree and coordinates dispatch, reducers, subscriptions, and middleware.
4. Values calculable from props and state should usually be derived during render rather than stored separately. Duplicate state creates synchronization bugs.

**Correct answer:** A Redux store holds the application state tree and coordinates dispatch, reducers, subscriptions, and middleware.

**Explanation:** Store is best understood as follows: A Redux store holds the application state tree and coordinates dispatch, reducers, subscriptions, and middleware.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-30-Q02

Which statement best explains “Reducers” in the context of Redux Fundamentals?

1. Use children for the primary nested region and named element props when multiple distinct content regions need clear contracts.
2. Values calculable from props and state should usually be derived during render rather than stored separately. Duplicate state creates synchronization bugs.
3. memo can skip a component render when props compare equal. It is an optimization, not a correctness mechanism.
4. Redux reducers calculate next state from current state and an action. They must be predictable and side-effect free.

**Correct answer:** Redux reducers calculate next state from current state and an action. They must be predictable and side-effect free.

**Explanation:** Reducers is best understood as follows: Redux reducers calculate next state from current state and an action. They must be predictable and side-effect free.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-30-Q03

Which statement best explains “Actions” in the context of Redux Fundamentals?

1. Use children for the primary nested region and named element props when multiple distinct content regions need clear contracts.
2. Redux actions are plain event descriptions with a type and optional payload.
3. memo can skip a component render when props compare equal. It is an optimization, not a correctness mechanism.
4. Values calculable from props and state should usually be derived during render rather than stored separately. Duplicate state creates synchronization bugs.

**Correct answer:** Redux actions are plain event descriptions with a type and optional payload.

**Explanation:** Actions is best understood as follows: Redux actions are plain event descriptions with a type and optional payload.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-30-Q04

A learner must use Redux Fundamentals in a new situation. Which approach best demonstrates transferable understanding?

1. Apply Store deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
2. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
3. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
4. Add more state and abstraction immediately, before identifying the smallest requirement.

**Correct answer:** Apply Store deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-30-Q05

What is the most accurate explanation of the following Redux Fundamentals example?

```js
const initialState = { score: 0 };
function reducer(state = initialState, action) {
  if (action.type === 'score/recorded') {
    return { ...state, score: action.payload };
  }
  return state;
}
```

1. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
2. The snippet removes the need to understand the data flowing through the program.
3. An action describes an event and the reducer calculates the next state.
4. The snippet guarantees that all values are immutable and all operations are asynchronous.

**Correct answer:** An action describes an event and the reducer calculates the next state.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-30-Q06

Which response best addresses this common mistake: “Putting every local input into Redux.”?

1. The statement is correct only when variable names are short.
2. The statement is unrelated to program behavior and cannot cause defects.
3. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
4. The statement is always correct, so no further reasoning about Redux Fundamentals is needed.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-30-Q07

Which sequence is most reliable when solving a problem involving Redux Fundamentals?

1. Optimize first, then decide what the code is supposed to do.
2. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
3. Start with a framework abstraction and avoid checking the underlying language behavior.
4. First identify the requirement, then apply the relevant rule from Store, inspect the result, and only then refactor or optimize.

**Correct answer:** First identify the requirement, then apply the relevant rule from Store, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-30-Q08

Which guideline shows the best judgment about when to use Redux Fundamentals?

1. Choose based only on line count, without considering readability, correctness, or future change.
2. Use Redux Fundamentals in every file because more abstraction is always better.
3. Avoid Redux Fundamentals completely because all abstractions reduce maintainability.
4. Use Redux Fundamentals when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Correct answer:** Use Redux Fundamentals when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Introduction to Redux — Coverage research only; no transcript wording is canonical.
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
