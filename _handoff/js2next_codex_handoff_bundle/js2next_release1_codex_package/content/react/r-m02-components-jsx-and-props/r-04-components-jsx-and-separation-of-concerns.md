---
schemaVersion: '1.0'
id: R-04
slug: components-jsx-and-separation-of-concerns
trackId: react
moduleId: R-M02
order: 1
title: Components, JSX, and Separation of Concerns
required: true
optional: false
advanced: false
contentType: core
difficulty: 1
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- R-03
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Components, JSX, and Separation of Concerns

> **Why this matters:** The ideas in components, jsx, and separation of concerns recur throughout later React work, reducing memorization and debugging later. It belongs to the **Components, JSX, and Props** module.

## Learning objectives

- [R-04-LO1] Explain components as building blocks using a new example and justify the result.
- [R-04-LO2] Apply jsx syntax and purpose using a new example and justify the result.
- [R-04-LO3] Explain react's separation-of-concerns model using a new example and justify the result.

## Mental model

Draw a decision map: **Components as building blocks** → **JSX syntax and purpose** → **React's separation-of-concerns model**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Components as building blocks

Components divide an interface into reusable, composable units. A useful component owns one coherent responsibility and accepts explicit inputs.

_Knowledge check: `R-04-Q01`_

## JSX syntax and purpose

JSX is JavaScript syntax for describing element trees. Expressions appear in braces, attributes use React-oriented names, and JSX compiles to element creation calls.

_Knowledge check: `R-04-Q02`_

## React's separation-of-concerns model

React often colocates JSX with the state and behavior that determine it. Concerns are separated by component responsibility rather than file type alone.

_Knowledge check: `R-04-Q03`_

## Worked example

```jsx
function TopicCard({ topic }) {
  return (
    <article>
      <h2>{topic.title}</h2>
      <p>{topic.summary}</p>
    </article>
  );
}
```

JSX describes an element tree and the function supplies a reusable boundary.

## Common mistakes

- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.
- Using global state before identifying the real owner and consumers.
- Optimizing renders without a measured user-facing problem.

## Summary

- Components, JSX, and Separation of Concerns connects Components as building blocks, JSX syntax and purpose, React's separation-of-concerns model.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-04-Q01, R-04-Q02, R-04-Q03
- Topic quiz: `R-04-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-04-Q01

Which statement best explains “Components as building blocks” in the context of Components, JSX, and Separation of Concerns?

1. A library provides focused capabilities while an application chooses broader structure; a framework supplies more conventions and lifecycle.
2. Ref values persist for the component instance but changes are invisible to rendering.
3. Components divide an interface into reusable, composable units. A useful component owns one coherent responsibility and accepts explicit inputs.
4. UI dispatches an action, reducers calculate state, and subscribed UI reads the new state.

**Correct answer:** Components divide an interface into reusable, composable units. A useful component owns one coherent responsibility and accepts explicit inputs.

**Explanation:** Components as building blocks is best understood as follows: Components divide an interface into reusable, composable units. A useful component owns one coherent responsibility and accepts explicit inputs.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-04-Q02

Which statement best explains “JSX syntax and purpose” in the context of Components, JSX, and Separation of Concerns?

1. A library provides focused capabilities while an application chooses broader structure; a framework supplies more conventions and lifecycle.
2. UI dispatches an action, reducers calculate state, and subscribed UI reads the new state.
3. Ref values persist for the component instance but changes are invisible to rendering.
4. JSX is JavaScript syntax for describing element trees. Expressions appear in braces, attributes use React-oriented names, and JSX compiles to element creation calls.

**Correct answer:** JSX is JavaScript syntax for describing element trees. Expressions appear in braces, attributes use React-oriented names, and JSX compiles to element creation calls.

**Explanation:** JSX syntax and purpose is best understood as follows: JSX is JavaScript syntax for describing element trees. Expressions appear in braces, attributes use React-oriented names, and JSX compiles to element creation calls.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-04-Q03

Which statement best explains “React's separation-of-concerns model” in the context of Components, JSX, and Separation of Concerns?

1. UI dispatches an action, reducers calculate state, and subscribed UI reads the new state.
2. Ref values persist for the component instance but changes are invisible to rendering.
3. A library provides focused capabilities while an application chooses broader structure; a framework supplies more conventions and lifecycle.
4. React often colocates JSX with the state and behavior that determine it. Concerns are separated by component responsibility rather than file type alone.

**Correct answer:** React often colocates JSX with the state and behavior that determine it. Concerns are separated by component responsibility rather than file type alone.

**Explanation:** React's separation-of-concerns model is best understood as follows: React often colocates JSX with the state and behavior that determine it. Concerns are separated by component responsibility rather than file type alone.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-04-Q04

A learner must use Components, JSX, and Separation of Concerns in a new situation. Which approach best demonstrates transferable understanding?

1. Apply Components as building blocks deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
2. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
3. Add more state and abstraction immediately, before identifying the smallest requirement.
4. Skip the underlying model and rely on memorized syntax, even when the result is unclear.

**Correct answer:** Apply Components as building blocks deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-04-Q05

What is the most accurate explanation of the following Components, JSX, and Separation of Concerns example?

```jsx
function TopicCard({ topic }) {
  return (
    <article>
      <h2>{topic.title}</h2>
      <p>{topic.summary}</p>
    </article>
  );
}
```

1. The snippet guarantees that all values are immutable and all operations are asynchronous.
2. JSX describes an element tree and the function supplies a reusable boundary.
3. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
4. The snippet removes the need to understand the data flowing through the program.

**Correct answer:** JSX describes an element tree and the function supplies a reusable boundary.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-04-Q06

Which response best addresses this common mistake: “Mutating props or state instead of producing the next value.”?

1. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
2. The statement is unrelated to program behavior and cannot cause defects.
3. The statement is always correct, so no further reasoning about Components, JSX, and Separation of Concerns is needed.
4. The statement is correct only when variable names are short.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-04-Q07

Which sequence is most reliable when solving a problem involving Components, JSX, and Separation of Concerns?

1. Optimize first, then decide what the code is supposed to do.
2. Start with a framework abstraction and avoid checking the underlying language behavior.
3. First identify the requirement, then apply the relevant rule from Components as building blocks, inspect the result, and only then refactor or optimize.
4. Copy an unrelated implementation, hide the assumptions, and test only the happy path.

**Correct answer:** First identify the requirement, then apply the relevant rule from Components as building blocks, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-04-Q08

Which guideline shows the best judgment about when to use Components, JSX, and Separation of Concerns?

1. Use Components, JSX, and Separation of Concerns in every file because more abstraction is always better.
2. Avoid Components, JSX, and Separation of Concerns completely because all abstractions reduce maintainability.
3. Use Components, JSX, and Separation of Concerns when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
4. Choose based only on line count, without considering readability, correctness, or future change.

**Correct answer:** Use Components, JSX, and Separation of Concerns when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Components as Building Blocks — Coverage research only; no transcript wording is canonical.
- What is JSX? — Coverage research only; no transcript wording is canonical.
- Separation of Concerns — Coverage research only; no transcript wording is canonical.
- Creating And Reusing a Component — Optional coverage reference; learner-facing wording must be original.
- The Rules of JSX — Optional coverage reference; learner-facing wording must be original.
- Rendering Lists — Optional coverage reference; learner-facing wording must be original.
- Conditional Rendering With && — Optional coverage reference; learner-facing wording must be original.
- Conditional Rendering With Ternaries — Optional coverage reference; learner-facing wording must be original.
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
