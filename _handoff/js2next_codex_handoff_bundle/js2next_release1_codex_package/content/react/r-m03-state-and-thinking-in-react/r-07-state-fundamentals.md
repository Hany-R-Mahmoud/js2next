---
schemaVersion: '1.0'
id: R-07
slug: state-fundamentals
trackId: react
moduleId: R-M03
order: 1
title: State Fundamentals
required: true
optional: false
advanced: false
contentType: core
difficulty: 2
estimatedMinutes: 20
requiredPrerequisiteTopicIds:
- R-05
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# State Fundamentals

> **Why this matters:** Learners frequently use state fundamentals without a clear model of why it behaves as it does; this lesson makes that model explicit. It belongs to the **State and Thinking in React** module.

## Learning objectives

- [R-07-LO1] Explain what state is using a new example and justify the result.
- [R-07-LO2] Apply how state updates work using a new example and justify the result.
- [R-07-LO3] Explain state guidelines using a new example and justify the result.
- [R-07-LO4] Compare state versus props using a new example and justify the result.

## Mental model

Draw a decision map: **What state is** → **How state updates work** → **State guidelines** → **State versus props**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## What state is

State is component memory that influences rendering. Each render receives a snapshot; a setter schedules a future render rather than mutating the current snapshot.

_Knowledge check: `R-07-Q01`_

## How state updates work

State setters enqueue transitions. When the next value depends on the previous one, an updater function lets queued changes compose correctly.

_Knowledge check: `R-07-Q02`_

## State guidelines

Store the minimum changing information. Avoid redundant or contradictory state and choose the nearest owner shared by every consumer.

_Knowledge check: `R-07-Q03`_

## State versus props

Props are parent-owned inputs; state is component or shared-owner memory. Do not copy props into state unless independent change is genuinely required.

_Knowledge check: `R-07-Q03`_

## Worked example

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(value => value + 1)}>{count}</button>;
}
```

State stores component memory and an updater derives the next value.

## Common mistakes

- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.
- Using global state before identifying the real owner and consumers.
- Optimizing renders without a measured user-facing problem.

## Summary

- State Fundamentals connects What state is, How state updates work, State guidelines.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-07-Q01, R-07-Q02, R-07-Q03
- Topic quiz: `R-07-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-07-Q01

Which statement best explains “What state is” in the context of State Fundamentals?

1. Client-side routing maps URLs to UI without requesting a full document for every navigation.
2. State is component memory that influences rendering. Each render receives a snapshot; a setter schedules a future render rather than mutating the current snapshot.
3. Use lazy initialization for expensive initial state and updater functions for transitions based on previous state.
4. A thunk can run async work, read state, and dispatch lifecycle actions through middleware.

**Correct answer:** State is component memory that influences rendering. Each render receives a snapshot; a setter schedules a future render rather than mutating the current snapshot.

**Explanation:** What state is is best understood as follows: State is component memory that influences rendering. Each render receives a snapshot; a setter schedules a future render rather than mutating the current snapshot.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-07-Q02

Which statement best explains “How state updates work” in the context of State Fundamentals?

1. State setters enqueue transitions. When the next value depends on the previous one, an updater function lets queued changes compose correctly.
2. Client-side routing maps URLs to UI without requesting a full document for every navigation.
3. Use lazy initialization for expensive initial state and updater functions for transitions based on previous state.
4. A thunk can run async work, read state, and dispatch lifecycle actions through middleware.

**Correct answer:** State setters enqueue transitions. When the next value depends on the previous one, an updater function lets queued changes compose correctly.

**Explanation:** How state updates work is best understood as follows: State setters enqueue transitions. When the next value depends on the previous one, an updater function lets queued changes compose correctly.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-07-Q03

Which statement best explains “State guidelines” in the context of State Fundamentals?

1. Use lazy initialization for expensive initial state and updater functions for transitions based on previous state.
2. Client-side routing maps URLs to UI without requesting a full document for every navigation.
3. A thunk can run async work, read state, and dispatch lifecycle actions through middleware.
4. Store the minimum changing information. Avoid redundant or contradictory state and choose the nearest owner shared by every consumer.

**Correct answer:** Store the minimum changing information. Avoid redundant or contradictory state and choose the nearest owner shared by every consumer.

**Explanation:** State guidelines is best understood as follows: Store the minimum changing information. Avoid redundant or contradictory state and choose the nearest owner shared by every consumer.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-07-Q04

A learner must use State Fundamentals in a new situation. Which approach best demonstrates transferable understanding?

1. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
2. Apply What state is deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
3. Add more state and abstraction immediately, before identifying the smallest requirement.
4. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.

**Correct answer:** Apply What state is deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-07-Q05

What is the most accurate explanation of the following State Fundamentals example?

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(value => value + 1)}>{count}</button>;
}
```

1. The snippet guarantees that all values are immutable and all operations are asynchronous.
2. State stores component memory and an updater derives the next value.
3. The snippet removes the need to understand the data flowing through the program.
4. The snippet is valid only because JavaScript ignores variable scope and evaluation order.

**Correct answer:** State stores component memory and an updater derives the next value.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-07-Q06

Which response best addresses this common mistake: “Mutating props or state instead of producing the next value.”?

1. The statement is always correct, so no further reasoning about State Fundamentals is needed.
2. The statement is correct only when variable names are short.
3. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
4. The statement is unrelated to program behavior and cannot cause defects.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-07-Q07

Which sequence is most reliable when solving a problem involving State Fundamentals?

1. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
2. Optimize first, then decide what the code is supposed to do.
3. First identify the requirement, then apply the relevant rule from What state is, inspect the result, and only then refactor or optimize.
4. Start with a framework abstraction and avoid checking the underlying language behavior.

**Correct answer:** First identify the requirement, then apply the relevant rule from What state is, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-07-Q08

Which guideline shows the best judgment about when to use State Fundamentals?

1. Choose based only on line count, without considering readability, correctness, or future change.
2. Use State Fundamentals when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
3. Avoid State Fundamentals completely because all abstractions reduce maintainability.
4. Use State Fundamentals in every file because more abstraction is always better.

**Correct answer:** Use State Fundamentals when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- What is State in React? — Coverage research only; no transcript wording is canonical.
- The Mechanics of State — Coverage research only; no transcript wording is canonical.
- More Thoughts About State + State Guidelines — Coverage research only; no transcript wording is canonical.
- State vs. Props — Coverage research only; no transcript wording is canonical.
- Creating a State Variable With useState — Optional coverage reference; learner-facing wording must be original.
- Updating State Based on Current State — Optional coverage reference; learner-facing wording must be original.
- Controlled Elements — Optional coverage reference; learner-facing wording must be original.
- Building a Form and Handling Submissions — Optional coverage reference; learner-facing wording must be original.
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
