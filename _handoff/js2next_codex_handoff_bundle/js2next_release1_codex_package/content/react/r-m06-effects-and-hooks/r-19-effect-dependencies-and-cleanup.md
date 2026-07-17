---
schemaVersion: '1.0'
id: R-19
slug: effect-dependencies-and-cleanup
trackId: react
moduleId: R-M06
order: 2
title: Effect Dependencies and Cleanup
required: true
optional: false
advanced: false
contentType: core
difficulty: 3
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- R-18
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Effect Dependencies and Cleanup

> **Why this matters:** This topic turns effect dependencies and cleanup from isolated terminology into a practical tool for reading, writing, and reviewing code. It belongs to the **Effects and Hooks** module.

## Learning objectives

- [R-19-LO1] Explain dependency arrays using a new example and justify the result.
- [R-19-LO2] Explain stale dependencies using a new example and justify the result.
- [R-19-LO3] Explain cleanup functions using a new example and justify the result.
- [R-19-LO4] Explain avoiding leaks and races using a new example and justify the result.

## Mental model

Draw a decision map: **Dependency arrays** → **Stale dependencies** → **Cleanup functions** → **Avoiding leaks and races**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Dependency arrays

An Effect's dependency list includes every reactive value used by its code. React reruns the Effect when a dependency changes.

_Knowledge check: `R-19-Q01`_

## Stale dependencies

Omitting a reactive dependency can make an Effect read values captured by an older render.

_Knowledge check: `R-19-Q02`_

## Cleanup functions

Cleanup reverses setup by unsubscribing, removing listeners, aborting work, or clearing timers before rerun and on unmount.

_Knowledge check: `R-19-Q03`_

## Avoiding leaks and races

Long-lived subscriptions and overlapping async work require cleanup or cancellation so stale work does not update current state.

_Knowledge check: `R-19-Q03`_

## Worked example

```jsx
function Search({ query }) {
  useEffect(() => {
    const controller = new AbortController();
    loadResults(query, controller.signal);
    return () => controller.abort();
  }, [query]);
  return null;
}
```

Complete dependencies and abort cleanup prevent stale overlapping work.

## Common mistakes

- Suppressing the dependency linter instead of fixing the data flow.
- Using an Effect for render-time derivation.
- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.

## Summary

- Effect Dependencies and Cleanup connects Dependency arrays, Stale dependencies, Cleanup functions.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-19-Q01, R-19-Q02, R-19-Q03
- Topic quiz: `R-19-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-19-Q01

Which statement best explains “Dependency arrays” in the context of Effect Dependencies and Cleanup?

1. A component treats props as immutable snapshots for a render. Mutating them creates hidden coupling with the owner.
2. An Effect's dependency list includes every reactive value used by its code. React reruns the Effect when a dependency changes.
3. Class components use instance state, this, and lifecycle methods. They matter for legacy code but are not the preferred model for new teaching.
4. A Redux store holds the application state tree and coordinates dispatch, reducers, subscriptions, and middleware.

**Correct answer:** An Effect's dependency list includes every reactive value used by its code. React reruns the Effect when a dependency changes.

**Explanation:** Dependency arrays is best understood as follows: An Effect's dependency list includes every reactive value used by its code. React reruns the Effect when a dependency changes.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-19-Q02

Which statement best explains “Stale dependencies” in the context of Effect Dependencies and Cleanup?

1. A Redux store holds the application state tree and coordinates dispatch, reducers, subscriptions, and middleware.
2. Class components use instance state, this, and lifecycle methods. They matter for legacy code but are not the preferred model for new teaching.
3. A component treats props as immutable snapshots for a render. Mutating them creates hidden coupling with the owner.
4. Omitting a reactive dependency can make an Effect read values captured by an older render.

**Correct answer:** Omitting a reactive dependency can make an Effect read values captured by an older render.

**Explanation:** Stale dependencies is best understood as follows: Omitting a reactive dependency can make an Effect read values captured by an older render.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-19-Q03

Which statement best explains “Cleanup functions” in the context of Effect Dependencies and Cleanup?

1. A Redux store holds the application state tree and coordinates dispatch, reducers, subscriptions, and middleware.
2. Cleanup reverses setup by unsubscribing, removing listeners, aborting work, or clearing timers before rerun and on unmount.
3. A component treats props as immutable snapshots for a render. Mutating them creates hidden coupling with the owner.
4. Class components use instance state, this, and lifecycle methods. They matter for legacy code but are not the preferred model for new teaching.

**Correct answer:** Cleanup reverses setup by unsubscribing, removing listeners, aborting work, or clearing timers before rerun and on unmount.

**Explanation:** Cleanup functions is best understood as follows: Cleanup reverses setup by unsubscribing, removing listeners, aborting work, or clearing timers before rerun and on unmount.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-19-Q04

A learner must use Effect Dependencies and Cleanup in a new situation. Which approach best demonstrates transferable understanding?

1. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
2. Add more state and abstraction immediately, before identifying the smallest requirement.
3. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
4. Apply Dependency arrays deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Correct answer:** Apply Dependency arrays deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-19-Q05

What is the most accurate explanation of the following Effect Dependencies and Cleanup example?

```jsx
function Search({ query }) {
  useEffect(() => {
    const controller = new AbortController();
    loadResults(query, controller.signal);
    return () => controller.abort();
  }, [query]);
  return null;
}
```

1. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
2. The snippet removes the need to understand the data flowing through the program.
3. Complete dependencies and abort cleanup prevent stale overlapping work.
4. The snippet guarantees that all values are immutable and all operations are asynchronous.

**Correct answer:** Complete dependencies and abort cleanup prevent stale overlapping work.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-19-Q06

Which response best addresses this common mistake: “Suppressing the dependency linter instead of fixing the data flow.”?

1. The statement is always correct, so no further reasoning about Effect Dependencies and Cleanup is needed.
2. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
3. The statement is unrelated to program behavior and cannot cause defects.
4. The statement is correct only when variable names are short.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-19-Q07

Which sequence is most reliable when solving a problem involving Effect Dependencies and Cleanup?

1. First identify the requirement, then apply the relevant rule from Dependency arrays, inspect the result, and only then refactor or optimize.
2. Start with a framework abstraction and avoid checking the underlying language behavior.
3. Optimize first, then decide what the code is supposed to do.
4. Copy an unrelated implementation, hide the assumptions, and test only the happy path.

**Correct answer:** First identify the requirement, then apply the relevant rule from Dependency arrays, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-19-Q08

Which guideline shows the best judgment about when to use Effect Dependencies and Cleanup?

1. Use Effect Dependencies and Cleanup when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
2. Choose based only on line count, without considering readability, correctness, or future change.
3. Use Effect Dependencies and Cleanup in every file because more abstraction is always better.
4. Avoid Effect Dependencies and Cleanup completely because all abstractions reduce maintainability.

**Correct answer:** Use Effect Dependencies and Cleanup when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- The useEffect Dependency Array — Coverage research only; no transcript wording is canonical.
- The useEffect Cleanup Function — Coverage research only; no transcript wording is canonical.
- Cleaning Up Data Fetching — Optional coverage reference; learner-facing wording must be original.
- One More Effect: Listening to a Keypress — Optional coverage reference; learner-facing wording must be original.
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
