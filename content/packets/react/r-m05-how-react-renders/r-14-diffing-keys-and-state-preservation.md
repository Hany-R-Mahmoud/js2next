---
schemaVersion: '1.0'
id: R-14
slug: diffing-keys-and-state-preservation
trackId: react
moduleId: R-M05
order: 3
title: Diffing, Keys, and State Preservation
required: true
optional: false
advanced: false
contentType: core
difficulty: 3
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- R-13
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Diffing, Keys, and State Preservation

> **Why this matters:** Diffing, Keys, and State Preservation is part of the mental model learners need before making reliable implementation decisions. It belongs to the **How React Renders** module.

## Learning objectives

- [R-14-LO1] Explain diffing rules using a new example and justify the result.
- [R-14-LO2] Explain the `key` prop using a new example and justify the result.
- [R-14-LO3] Explain preserving and resetting state using a new example and justify the result.

## Mental model

Draw a decision map: **Diffing rules** → **The `key` prop** → **Preserving and resetting state**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Diffing rules

Different element types replace a subtree; matching types are updated. Position and keys determine identity and state preservation.

_Knowledge check: `R-14-Q01`_

## The `key` prop

Keys give siblings stable identity across insertion, removal, and reordering. Use data identifiers rather than indexes for changing lists.

_Knowledge check: `R-14-Q02`_

## Preserving and resetting state

State is preserved when the same type remains at the same logical position. A changed key or type creates a new instance and resets local state.

_Knowledge check: `R-14-Q03`_

## Worked example

```jsx
function TopicTabs({ topics }) {
  return topics.map(topic => <TopicTab key={topic.id} topic={topic} />);
}
```

Stable keys preserve the correct instance when order changes.

## Common mistakes

- Using array indexes as keys for a reorderable list.
- Expecting `key` to arrive as an ordinary prop.
- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.

## Summary

- Diffing, Keys, and State Preservation connects Diffing rules, The `key` prop, Preserving and resetting state.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-14-Q01, R-14-Q02, R-14-Q03
- Topic quiz: `R-14-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-14-Q01

Which statement best explains “Diffing rules” in the context of Diffing, Keys, and State Preservation?

1. Place state in the lowest component that owns all consumers and updates. Move it upward or into a shared mechanism only when ownership demands it.
2. React assumes comfort with JavaScript values, functions, arrays, objects, modules, and asynchronous code. Missing prerequisites are review signals, not barriers; revisit the smallest required concept and return.
3. useState is simplest for independent values; useReducer helps when transitions are related, numerous, or benefit from centralized testing.
4. Different element types replace a subtree; matching types are updated. Position and keys determine identity and state preservation.

**Correct answer:** Different element types replace a subtree; matching types are updated. Position and keys determine identity and state preservation.

**Explanation:** Diffing rules is best understood as follows: Different element types replace a subtree; matching types are updated. Position and keys determine identity and state preservation.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-14-Q02

Which statement best explains “The `key` prop” in the context of Diffing, Keys, and State Preservation?

1. useState is simplest for independent values; useReducer helps when transitions are related, numerous, or benefit from centralized testing.
2. React assumes comfort with JavaScript values, functions, arrays, objects, modules, and asynchronous code. Missing prerequisites are review signals, not barriers; revisit the smallest required concept and return.
3. Keys give siblings stable identity across insertion, removal, and reordering. Use data identifiers rather than indexes for changing lists.
4. Place state in the lowest component that owns all consumers and updates. Move it upward or into a shared mechanism only when ownership demands it.

**Correct answer:** Keys give siblings stable identity across insertion, removal, and reordering. Use data identifiers rather than indexes for changing lists.

**Explanation:** The `key` prop is best understood as follows: Keys give siblings stable identity across insertion, removal, and reordering. Use data identifiers rather than indexes for changing lists.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-14-Q03

Which statement best explains “Preserving and resetting state” in the context of Diffing, Keys, and State Preservation?

1. useState is simplest for independent values; useReducer helps when transitions are related, numerous, or benefit from centralized testing.
2. Place state in the lowest component that owns all consumers and updates. Move it upward or into a shared mechanism only when ownership demands it.
3. State is preserved when the same type remains at the same logical position. A changed key or type creates a new instance and resets local state.
4. React assumes comfort with JavaScript values, functions, arrays, objects, modules, and asynchronous code. Missing prerequisites are review signals, not barriers; revisit the smallest required concept and return.

**Correct answer:** State is preserved when the same type remains at the same logical position. A changed key or type creates a new instance and resets local state.

**Explanation:** Preserving and resetting state is best understood as follows: State is preserved when the same type remains at the same logical position. A changed key or type creates a new instance and resets local state.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-14-Q04

A learner must use Diffing, Keys, and State Preservation in a new situation. Which approach best demonstrates transferable understanding?

1. Apply Diffing rules deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
2. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
3. Add more state and abstraction immediately, before identifying the smallest requirement.
4. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.

**Correct answer:** Apply Diffing rules deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-14-Q05

What is the most accurate explanation of the following Diffing, Keys, and State Preservation example?

```jsx
function TopicTabs({ topics }) {
  return topics.map(topic => <TopicTab key={topic.id} topic={topic} />);
}
```

1. Stable keys preserve the correct instance when order changes.
2. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
3. The snippet removes the need to understand the data flowing through the program.
4. The snippet guarantees that all values are immutable and all operations are asynchronous.

**Correct answer:** Stable keys preserve the correct instance when order changes.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-14-Q06

Which response best addresses this common mistake: “Using array indexes as keys for a reorderable list.”?

1. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
2. The statement is correct only when variable names are short.
3. The statement is unrelated to program behavior and cannot cause defects.
4. The statement is always correct, so no further reasoning about Diffing, Keys, and State Preservation is needed.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-14-Q07

Which sequence is most reliable when solving a problem involving Diffing, Keys, and State Preservation?

1. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
2. Optimize first, then decide what the code is supposed to do.
3. Start with a framework abstraction and avoid checking the underlying language behavior.
4. First identify the requirement, then apply the relevant rule from Diffing rules, inspect the result, and only then refactor or optimize.

**Correct answer:** First identify the requirement, then apply the relevant rule from Diffing rules, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-14-Q08

Which guideline shows the best judgment about when to use Diffing, Keys, and State Preservation?

1. Use Diffing, Keys, and State Preservation when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
2. Choose based only on line count, without considering readability, correctness, or future change.
3. Use Diffing, Keys, and State Preservation in every file because more abstraction is always better.
4. Avoid Diffing, Keys, and State Preservation completely because all abstractions reduce maintainability.

**Correct answer:** Use Diffing, Keys, and State Preservation when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- How Diffing Works — Coverage research only; no transcript wording is canonical.
- The Key Prop — Coverage research only; no transcript wording is canonical.
- Diffing Rules in Practice — Optional coverage reference; learner-facing wording must be original.
- Resetting State With the Key Prop — Optional coverage reference; learner-facing wording must be original.
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
