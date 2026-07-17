---
schemaVersion: '1.0'
id: R-20
slug: rules-of-hooks-and-usestate-recap
trackId: react
moduleId: R-M06
order: 3
title: Rules of Hooks and `useState` Recap
required: true
optional: false
advanced: false
contentType: core
difficulty: 3
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- R-19
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Rules of Hooks and `useState` Recap

> **Why this matters:** This topic turns rules of hooks and `usestate` recap from isolated terminology into a practical tool for reading, writing, and reviewing code. It belongs to the **Effects and Hooks** module.

## Learning objectives

- [R-20-LO1] Explain rules of hooks using a new example and justify the result.
- [R-20-LO2] Apply state initialization and updates using a new example and justify the result.
- [R-20-LO3] Choose and justify when to use state using a new example and justify the result.

## Mental model

Draw a decision map: **Rules of Hooks** → **State initialization and updates** → **When to use state**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Rules of Hooks

Call Hooks at the top level of React components or custom Hooks, never conditionally or inside ordinary functions.

_Knowledge check: `R-20-Q01`_

## State initialization and updates

Use lazy initialization for expensive initial state and updater functions for transitions based on previous state.

_Knowledge check: `R-20-Q02`_

## When to use state

Use state for changing information that affects rendering, ordinary variables for render calculations, and refs for mutable non-rendered values.

_Knowledge check: `R-20-Q03`_

## Worked example

```jsx
function Preferences() {
  const [settings, setSettings] = useState(() => readSettings());
  return <button onClick={() =>
    setSettings(current => ({ ...current, compact: !current.compact }))
  }>Toggle</button>;
}
```

Lazy initialization runs once and the updater creates the next object.

## Common mistakes

- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.
- Using global state before identifying the real owner and consumers.
- Optimizing renders without a measured user-facing problem.

## Summary

- Rules of Hooks and `useState` Recap connects Rules of Hooks, State initialization and updates, When to use state.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-20-Q01, R-20-Q02, R-20-Q03
- Topic quiz: `R-20-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-20-Q01

Which statement best explains “Rules of Hooks” in the context of Rules of Hooks and `useState` Recap?

1. Call Hooks at the top level of React components or custom Hooks, never conditionally or inside ordinary functions.
2. A component boundary defines ownership of markup, behavior, and dependencies. Good boundaries minimize reasons to change.
3. Lifting state moves shared state to the closest common parent, giving siblings one source of truth through props and callbacks.
4. Redux actions are plain event descriptions with a type and optional payload.

**Correct answer:** Call Hooks at the top level of React components or custom Hooks, never conditionally or inside ordinary functions.

**Explanation:** Rules of Hooks is best understood as follows: Call Hooks at the top level of React components or custom Hooks, never conditionally or inside ordinary functions.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-20-Q02

Which statement best explains “State initialization and updates” in the context of Rules of Hooks and `useState` Recap?

1. A component boundary defines ownership of markup, behavior, and dependencies. Good boundaries minimize reasons to change.
2. Lifting state moves shared state to the closest common parent, giving siblings one source of truth through props and callbacks.
3. Use lazy initialization for expensive initial state and updater functions for transitions based on previous state.
4. Redux actions are plain event descriptions with a type and optional payload.

**Correct answer:** Use lazy initialization for expensive initial state and updater functions for transitions based on previous state.

**Explanation:** State initialization and updates is best understood as follows: Use lazy initialization for expensive initial state and updater functions for transitions based on previous state.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-20-Q03

Which statement best explains “When to use state” in the context of Rules of Hooks and `useState` Recap?

1. Use state for changing information that affects rendering, ordinary variables for render calculations, and refs for mutable non-rendered values.
2. Redux actions are plain event descriptions with a type and optional payload.
3. Lifting state moves shared state to the closest common parent, giving siblings one source of truth through props and callbacks.
4. A component boundary defines ownership of markup, behavior, and dependencies. Good boundaries minimize reasons to change.

**Correct answer:** Use state for changing information that affects rendering, ordinary variables for render calculations, and refs for mutable non-rendered values.

**Explanation:** When to use state is best understood as follows: Use state for changing information that affects rendering, ordinary variables for render calculations, and refs for mutable non-rendered values.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-20-Q04

A learner must use Rules of Hooks and `useState` Recap in a new situation. Which approach best demonstrates transferable understanding?

1. Apply Rules of Hooks deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
2. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
3. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
4. Add more state and abstraction immediately, before identifying the smallest requirement.

**Correct answer:** Apply Rules of Hooks deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-20-Q05

What is the most accurate explanation of the following Rules of Hooks and `useState` Recap example?

```jsx
function Preferences() {
  const [settings, setSettings] = useState(() => readSettings());
  return <button onClick={() =>
    setSettings(current => ({ ...current, compact: !current.compact }))
  }>Toggle</button>;
}
```

1. The snippet removes the need to understand the data flowing through the program.
2. Lazy initialization runs once and the updater creates the next object.
3. The snippet guarantees that all values are immutable and all operations are asynchronous.
4. The snippet is valid only because JavaScript ignores variable scope and evaluation order.

**Correct answer:** Lazy initialization runs once and the updater creates the next object.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-20-Q06

Which response best addresses this common mistake: “Mutating props or state instead of producing the next value.”?

1. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
2. The statement is always correct, so no further reasoning about Rules of Hooks and `useState` Recap is needed.
3. The statement is correct only when variable names are short.
4. The statement is unrelated to program behavior and cannot cause defects.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-20-Q07

Which sequence is most reliable when solving a problem involving Rules of Hooks and `useState` Recap?

1. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
2. Optimize first, then decide what the code is supposed to do.
3. Start with a framework abstraction and avoid checking the underlying language behavior.
4. First identify the requirement, then apply the relevant rule from Rules of Hooks, inspect the result, and only then refactor or optimize.

**Correct answer:** First identify the requirement, then apply the relevant rule from Rules of Hooks, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-20-Q08

Which guideline shows the best judgment about when to use Rules of Hooks and `useState` Recap?

1. Use Rules of Hooks and `useState` Recap in every file because more abstraction is always better.
2. Choose based only on line count, without considering readability, correctness, or future change.
3. Use Rules of Hooks and `useState` Recap when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
4. Avoid Rules of Hooks and `useState` Recap completely because all abstractions reduce maintainability.

**Correct answer:** Use Rules of Hooks and `useState` Recap when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- React Hooks and Their Rules — Coverage research only; no transcript wording is canonical.
- useState Summary — Coverage research only; no transcript wording is canonical.
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
