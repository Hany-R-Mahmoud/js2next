---
schemaVersion: '1.0'
id: R-11
slug: composition-and-props-as-component-apis
trackId: react
moduleId: R-M04
order: 3
title: Composition and Props as Component APIs
required: true
optional: false
advanced: false
contentType: core
difficulty: 2
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- R-10
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Composition and Props as Component APIs

> **Why this matters:** This topic turns composition and props as component apis from isolated terminology into a practical tool for reading, writing, and reviewing code. It belongs to the **Component Design and Reusability** module.

## Learning objectives

- [R-11-LO1] Apply component composition using a new example and justify the result.
- [R-11-LO2] Apply avoiding prop drilling through composition using a new example and justify the result.
- [R-11-LO3] Apply designing a clear component api using a new example and justify the result.

## Mental model

Draw a decision map: **Component composition** → **Avoiding prop drilling through composition** → **Designing a clear component API**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Component composition

Composition builds behavior by nesting and combining components instead of relying on inheritance.

_Knowledge check: `R-11-Q01`_

## Avoiding prop drilling through composition

Before adding context, consider moving the consumer closer to the owner or passing a configured element through intermediate components.

_Knowledge check: `R-11-Q02`_

## Designing a clear component API

A clear component API uses intent-based names, sensible defaults, few contradictory options, and explicit composition points.

_Knowledge check: `R-11-Q03`_

## Worked example

```jsx
function Modal({ title, children, actions }) {
  return (
    <div role="dialog" aria-label={title}>
      <h2>{title}</h2>
      {children}
      <footer>{actions}</footer>
    </div>
  );
}
```

Named props and children form a clear component API.

## Common mistakes

- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.
- Using global state before identifying the real owner and consumers.
- Optimizing renders without a measured user-facing problem.

## Summary

- Composition and Props as Component APIs connects Component composition, Avoiding prop drilling through composition, Designing a clear component API.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-11-Q01, R-11-Q02, R-11-Q03
- Topic quiz: `R-11-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-11-Q01

Which statement best explains “Component composition” in the context of Composition and Props as Component APIs?

1. A component definition is the function or class. Each rendered position represents an instance with its own state identity.
2. Composition builds behavior by nesting and combining components instead of relying on inheritance.
3. Evaluate alternatives by complexity, clarity, testability, performance, team understanding, and likely change rather than searching for a universally perfect pattern.
4. Ref values persist for the component instance but changes are invisible to rendering.

**Correct answer:** Composition builds behavior by nesting and combining components instead of relying on inheritance.

**Explanation:** Component composition is best understood as follows: Composition builds behavior by nesting and combining components instead of relying on inheritance.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-11-Q02

Which statement best explains “Avoiding prop drilling through composition” in the context of Composition and Props as Component APIs?

1. Before adding context, consider moving the consumer closer to the owner or passing a configured element through intermediate components.
2. A component definition is the function or class. Each rendered position represents an instance with its own state identity.
3. Ref values persist for the component instance but changes are invisible to rendering.
4. Evaluate alternatives by complexity, clarity, testability, performance, team understanding, and likely change rather than searching for a universally perfect pattern.

**Correct answer:** Before adding context, consider moving the consumer closer to the owner or passing a configured element through intermediate components.

**Explanation:** Avoiding prop drilling through composition is best understood as follows: Before adding context, consider moving the consumer closer to the owner or passing a configured element through intermediate components.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-11-Q03

Which statement best explains “Designing a clear component API” in the context of Composition and Props as Component APIs?

1. A component definition is the function or class. Each rendered position represents an instance with its own state identity.
2. Ref values persist for the component instance but changes are invisible to rendering.
3. Evaluate alternatives by complexity, clarity, testability, performance, team understanding, and likely change rather than searching for a universally perfect pattern.
4. A clear component API uses intent-based names, sensible defaults, few contradictory options, and explicit composition points.

**Correct answer:** A clear component API uses intent-based names, sensible defaults, few contradictory options, and explicit composition points.

**Explanation:** Designing a clear component API is best understood as follows: A clear component API uses intent-based names, sensible defaults, few contradictory options, and explicit composition points.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-11-Q04

A learner must use Composition and Props as Component APIs in a new situation. Which approach best demonstrates transferable understanding?

1. Apply Component composition deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
2. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
3. Add more state and abstraction immediately, before identifying the smallest requirement.
4. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.

**Correct answer:** Apply Component composition deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-11-Q05

What is the most accurate explanation of the following Composition and Props as Component APIs example?

```jsx
function Modal({ title, children, actions }) {
  return (
    <div role="dialog" aria-label={title}>
      <h2>{title}</h2>
      {children}
      <footer>{actions}</footer>
    </div>
  );
}
```

1. The snippet removes the need to understand the data flowing through the program.
2. The snippet guarantees that all values are immutable and all operations are asynchronous.
3. Named props and children form a clear component API.
4. The snippet is valid only because JavaScript ignores variable scope and evaluation order.

**Correct answer:** Named props and children form a clear component API.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-11-Q06

Which response best addresses this common mistake: “Mutating props or state instead of producing the next value.”?

1. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
2. The statement is unrelated to program behavior and cannot cause defects.
3. The statement is correct only when variable names are short.
4. The statement is always correct, so no further reasoning about Composition and Props as Component APIs is needed.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-11-Q07

Which sequence is most reliable when solving a problem involving Composition and Props as Component APIs?

1. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
2. Start with a framework abstraction and avoid checking the underlying language behavior.
3. Optimize first, then decide what the code is supposed to do.
4. First identify the requirement, then apply the relevant rule from Component composition, inspect the result, and only then refactor or optimize.

**Correct answer:** First identify the requirement, then apply the relevant rule from Component composition, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-11-Q08

Which guideline shows the best judgment about when to use Composition and Props as Component APIs?

1. Choose based only on line count, without considering readability, correctness, or future change.
2. Use Composition and Props as Component APIs in every file because more abstraction is always better.
3. Avoid Composition and Props as Component APIs completely because all abstractions reduce maintainability.
4. Use Composition and Props as Component APIs when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Correct answer:** Use Composition and Props as Component APIs when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Component Composition — Coverage research only; no transcript wording is canonical.
- Props as a Component API — Coverage research only; no transcript wording is canonical.
- Fixing Prop Drilling With Composition (And Building a Layout) — Optional coverage reference; learner-facing wording must be original.
- Using Composition to Make a Reusable Box — Optional coverage reference; learner-facing wording must be original.
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
