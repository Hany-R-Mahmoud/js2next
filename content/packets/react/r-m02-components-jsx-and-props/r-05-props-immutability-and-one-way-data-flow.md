---
schemaVersion: '1.0'
id: R-05
slug: props-immutability-and-one-way-data-flow
trackId: react
moduleId: R-M02
order: 2
title: Props, Immutability, and One-Way Data Flow
required: true
optional: false
advanced: false
contentType: core
difficulty: 1
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- R-04
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Props, Immutability, and One-Way Data Flow

> **Why this matters:** Props, Immutability, and One-Way Data Flow is part of the mental model learners need before making reliable implementation decisions. It belongs to the **Components, JSX, and Props** module.

## Learning objectives

- [R-05-LO1] Explain passing data with props using a new example and justify the result.
- [R-05-LO2] Explain read-only props using a new example and justify the result.
- [R-05-LO3] Trace and explain parent-to-child data flow using a new example and justify the result.

## Mental model

Draw a decision map: **Passing data with props** → **Read-only props** → **Parent-to-child data flow**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Passing data with props

Props are inputs supplied by a parent. They can contain values, objects, functions, or elements and form the child's public data contract.

_Knowledge check: `R-05-Q01`_

## Read-only props

A component treats props as immutable snapshots for a render. Mutating them creates hidden coupling with the owner.

_Knowledge check: `R-05-Q02`_

## Parent-to-child data flow

Data normally flows down through props. Children communicate intent upward by invoking callbacks supplied by parents.

_Knowledge check: `R-05-Q03`_

## Worked example

```jsx
function Track({ title, onSelect }) {
  return <button onClick={() => onSelect(title)}>{title}</button>;
}
```

The child receives read-only data and communicates intent through a callback.

## Common mistakes

- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.
- Using global state before identifying the real owner and consumers.
- Optimizing renders without a measured user-facing problem.

## Summary

- Props, Immutability, and One-Way Data Flow connects Passing data with props, Read-only props, Parent-to-child data flow.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-05-Q01, R-05-Q02, R-05-Q03
- Topic quiz: `R-05-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-05-Q01

Which statement best explains “Passing data with props” in the context of Props, Immutability, and One-Way Data Flow?

1. Props are inputs supplied by a parent. They can contain values, objects, functions, or elements and form the child's public data contract.
2. Evaluate alternatives by complexity, clarity, testability, performance, team understanding, and likely change rather than searching for a universally perfect pattern.
3. TanStack Query identifies remote data by query keys, caches results, tracks freshness, refetches, and coordinates mutation invalidation.
4. Compare scope, update complexity, async behavior, debugging needs, ecosystem cost, and team familiarity.

**Correct answer:** Props are inputs supplied by a parent. They can contain values, objects, functions, or elements and form the child's public data contract.

**Explanation:** Passing data with props is best understood as follows: Props are inputs supplied by a parent. They can contain values, objects, functions, or elements and form the child's public data contract.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-05-Q02

Which statement best explains “Read-only props” in the context of Props, Immutability, and One-Way Data Flow?

1. A component treats props as immutable snapshots for a render. Mutating them creates hidden coupling with the owner.
2. TanStack Query identifies remote data by query keys, caches results, tracks freshness, refetches, and coordinates mutation invalidation.
3. Compare scope, update complexity, async behavior, debugging needs, ecosystem cost, and team familiarity.
4. Evaluate alternatives by complexity, clarity, testability, performance, team understanding, and likely change rather than searching for a universally perfect pattern.

**Correct answer:** A component treats props as immutable snapshots for a render. Mutating them creates hidden coupling with the owner.

**Explanation:** Read-only props is best understood as follows: A component treats props as immutable snapshots for a render. Mutating them creates hidden coupling with the owner.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-05-Q03

Which statement best explains “Parent-to-child data flow” in the context of Props, Immutability, and One-Way Data Flow?

1. Data normally flows down through props. Children communicate intent upward by invoking callbacks supplied by parents.
2. Evaluate alternatives by complexity, clarity, testability, performance, team understanding, and likely change rather than searching for a universally perfect pattern.
3. TanStack Query identifies remote data by query keys, caches results, tracks freshness, refetches, and coordinates mutation invalidation.
4. Compare scope, update complexity, async behavior, debugging needs, ecosystem cost, and team familiarity.

**Correct answer:** Data normally flows down through props. Children communicate intent upward by invoking callbacks supplied by parents.

**Explanation:** Parent-to-child data flow is best understood as follows: Data normally flows down through props. Children communicate intent upward by invoking callbacks supplied by parents.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-05-Q04

A learner must use Props, Immutability, and One-Way Data Flow in a new situation. Which approach best demonstrates transferable understanding?

1. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
2. Apply Passing data with props deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
3. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
4. Add more state and abstraction immediately, before identifying the smallest requirement.

**Correct answer:** Apply Passing data with props deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-05-Q05

What is the most accurate explanation of the following Props, Immutability, and One-Way Data Flow example?

```jsx
function Track({ title, onSelect }) {
  return <button onClick={() => onSelect(title)}>{title}</button>;
}
```

1. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
2. The child receives read-only data and communicates intent through a callback.
3. The snippet removes the need to understand the data flowing through the program.
4. The snippet guarantees that all values are immutable and all operations are asynchronous.

**Correct answer:** The child receives read-only data and communicates intent through a callback.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-05-Q06

Which response best addresses this common mistake: “Mutating props or state instead of producing the next value.”?

1. The statement is unrelated to program behavior and cannot cause defects.
2. The statement is correct only when variable names are short.
3. The statement is always correct, so no further reasoning about Props, Immutability, and One-Way Data Flow is needed.
4. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-05-Q07

Which sequence is most reliable when solving a problem involving Props, Immutability, and One-Way Data Flow?

1. Start with a framework abstraction and avoid checking the underlying language behavior.
2. Optimize first, then decide what the code is supposed to do.
3. First identify the requirement, then apply the relevant rule from Passing data with props, inspect the result, and only then refactor or optimize.
4. Copy an unrelated implementation, hide the assumptions, and test only the happy path.

**Correct answer:** First identify the requirement, then apply the relevant rule from Passing data with props, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-05-Q08

Which guideline shows the best judgment about when to use Props, Immutability, and One-Way Data Flow?

1. Avoid Props, Immutability, and One-Way Data Flow completely because all abstractions reduce maintainability.
2. Use Props, Immutability, and One-Way Data Flow in every file because more abstraction is always better.
3. Choose based only on line count, without considering readability, correctness, or future change.
4. Use Props, Immutability, and One-Way Data Flow when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Correct answer:** Use Props, Immutability, and One-Way Data Flow when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Props, Immutability, and One-Way Data Flow — Coverage research only; no transcript wording is canonical.
- Passing and Receiving Props — Optional coverage reference; learner-facing wording must be original.
- Destructuring Props — Optional coverage reference; learner-facing wording must be original.
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
