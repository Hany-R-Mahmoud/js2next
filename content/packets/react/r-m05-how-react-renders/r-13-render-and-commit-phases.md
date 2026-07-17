---
schemaVersion: '1.0'
id: R-13
slug: render-and-commit-phases
trackId: react
moduleId: R-M05
order: 2
title: Render and Commit Phases
required: true
optional: false
advanced: false
contentType: core
difficulty: 3
estimatedMinutes: 25
requiredPrerequisiteTopicIds:
- R-12
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Render and Commit Phases

> **Why this matters:** The ideas in render and commit phases recur throughout later React work, reducing memorization and debugging later. It belongs to the **How React Renders** module.

## Learning objectives

- [R-13-LO1] Trace and explain render phase using a new example and justify the result.
- [R-13-LO2] Explain reconciliation work using a new example and justify the result.
- [R-13-LO3] Trace and explain commit phase using a new example and justify the result.
- [R-13-LO4] Apply dom updates using a new example and justify the result.

## Mental model

Draw a decision map: **Render phase** → **Reconciliation work** → **Commit phase** → **DOM updates**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Render phase

During render, React calls components to calculate the next UI. Render must remain pure because React may repeat, pause, or discard the work.

_Knowledge check: `R-13-Q01`_

## Reconciliation work

Reconciliation compares previous and next element trees using type, position, and keys to decide which instances are preserved or replaced.

_Knowledge check: `R-13-Q02`_

## Commit phase

During commit, React applies calculated DOM changes and updates refs. Commit is the point where host mutations become observable.

_Knowledge check: `R-13-Q03`_

## DOM updates

React updates host nodes according to reconciliation. A component render does not imply every descendant DOM node is replaced.

_Knowledge check: `R-13-Q03`_

## Worked example

```jsx
function Score({ value }) {
  const label = value >= 80 ? 'Mastered' : 'Developing';
  return <p>{label}</p>;
}
```

The component calculates output during render; React applies changes during commit.

## Common mistakes

- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.
- Using global state before identifying the real owner and consumers.
- Optimizing renders without a measured user-facing problem.

## Summary

- Render and Commit Phases connects Render phase, Reconciliation work, Commit phase.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-13-Q01, R-13-Q02, R-13-Q03
- Topic quiz: `R-13-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-13-Q01

Which statement best explains “Render phase” in the context of Render and Commit Phases?

1. React often colocates JSX with the state and behavior that determine it. Concerns are separated by component responsibility rather than file type alone.
2. Reuse may come from functions, custom Hooks, composition, configurable components, or domain abstractions.
3. During render, React calls components to calculate the next UI. Render must remain pure because React may repeat, pause, or discard the work.
4. A component boundary defines ownership of markup, behavior, and dependencies. Good boundaries minimize reasons to change.

**Correct answer:** During render, React calls components to calculate the next UI. Render must remain pure because React may repeat, pause, or discard the work.

**Explanation:** Render phase is best understood as follows: During render, React calls components to calculate the next UI. Render must remain pure because React may repeat, pause, or discard the work.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-13-Q02

Which statement best explains “Reconciliation work” in the context of Render and Commit Phases?

1. Reuse may come from functions, custom Hooks, composition, configurable components, or domain abstractions.
2. A component boundary defines ownership of markup, behavior, and dependencies. Good boundaries minimize reasons to change.
3. Reconciliation compares previous and next element trees using type, position, and keys to decide which instances are preserved or replaced.
4. React often colocates JSX with the state and behavior that determine it. Concerns are separated by component responsibility rather than file type alone.

**Correct answer:** Reconciliation compares previous and next element trees using type, position, and keys to decide which instances are preserved or replaced.

**Explanation:** Reconciliation work is best understood as follows: Reconciliation compares previous and next element trees using type, position, and keys to decide which instances are preserved or replaced.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-13-Q03

Which statement best explains “Commit phase” in the context of Render and Commit Phases?

1. Reuse may come from functions, custom Hooks, composition, configurable components, or domain abstractions.
2. During commit, React applies calculated DOM changes and updates refs. Commit is the point where host mutations become observable.
3. React often colocates JSX with the state and behavior that determine it. Concerns are separated by component responsibility rather than file type alone.
4. A component boundary defines ownership of markup, behavior, and dependencies. Good boundaries minimize reasons to change.

**Correct answer:** During commit, React applies calculated DOM changes and updates refs. Commit is the point where host mutations become observable.

**Explanation:** Commit phase is best understood as follows: During commit, React applies calculated DOM changes and updates refs. Commit is the point where host mutations become observable.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-13-Q04

A learner must use Render and Commit Phases in a new situation. Which approach best demonstrates transferable understanding?

1. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
2. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
3. Apply Render phase deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
4. Add more state and abstraction immediately, before identifying the smallest requirement.

**Correct answer:** Apply Render phase deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-13-Q05

What is the most accurate explanation of the following Render and Commit Phases example?

```jsx
function Score({ value }) {
  const label = value >= 80 ? 'Mastered' : 'Developing';
  return <p>{label}</p>;
}
```

1. The snippet guarantees that all values are immutable and all operations are asynchronous.
2. The component calculates output during render; React applies changes during commit.
3. The snippet removes the need to understand the data flowing through the program.
4. The snippet is valid only because JavaScript ignores variable scope and evaluation order.

**Correct answer:** The component calculates output during render; React applies changes during commit.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-13-Q06

Which response best addresses this common mistake: “Mutating props or state instead of producing the next value.”?

1. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
2. The statement is unrelated to program behavior and cannot cause defects.
3. The statement is correct only when variable names are short.
4. The statement is always correct, so no further reasoning about Render and Commit Phases is needed.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-13-Q07

Which sequence is most reliable when solving a problem involving Render and Commit Phases?

1. First identify the requirement, then apply the relevant rule from Render phase, inspect the result, and only then refactor or optimize.
2. Optimize first, then decide what the code is supposed to do.
3. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
4. Start with a framework abstraction and avoid checking the underlying language behavior.

**Correct answer:** First identify the requirement, then apply the relevant rule from Render phase, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-13-Q08

Which guideline shows the best judgment about when to use Render and Commit Phases?

1. Use Render and Commit Phases in every file because more abstraction is always better.
2. Choose based only on line count, without considering readability, correctness, or future change.
3. Use Render and Commit Phases when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
4. Avoid Render and Commit Phases completely because all abstractions reduce maintainability.

**Correct answer:** Use Render and Commit Phases when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- How Rendering Works: The Render Phase — Coverage research only; no transcript wording is canonical.
- How Rendering Works: The Commit Phase — Coverage research only; no transcript wording is canonical.
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
