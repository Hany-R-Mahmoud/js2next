---
schemaVersion: '1.0'
id: R-27
slug: wasted-renders-and-memoization
trackId: react
moduleId: R-M09
order: 1
title: Wasted Renders and Memoization
required: true
optional: false
advanced: false
contentType: core
difficulty: 5
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- R-26
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Wasted Renders and Memoization

> **Why this matters:** Wasted Renders and Memoization is part of the mental model learners need before making reliable implementation decisions. It belongs to the **Performance and Advanced Effects** module.

## Learning objectives

- [R-27-LO1] Explain identifying wasted renders using a new example and justify the result.
- [R-27-LO2] Explain `memo` using a new example and justify the result.
- [R-27-LO3] Explain `usememo` using a new example and justify the result.
- [R-27-LO4] Explain `usecallback` using a new example and justify the result.

## Mental model

Draw a decision map: **Identifying wasted renders** → **`memo`** → **`useMemo`** → **`useCallback`**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Identifying wasted renders

A render is wasteful only when measured cost matters and it produces no useful change. Profile realistic interactions before optimizing.

_Knowledge check: `R-27-Q01`_

## `memo`

memo can skip a component render when props compare equal. It is an optimization, not a correctness mechanism.

_Knowledge check: `R-27-Q02`_

## `useMemo`

useMemo caches a calculation result between renders until dependencies change. Use it only for measured cost or identity-sensitive optimization.

_Knowledge check: `R-27-Q03`_

## `useCallback`

useCallback caches a function definition when function identity matters to a consumer or dependency.

_Knowledge check: `R-27-Q03`_

## Worked example

```jsx
const FilteredTopics = memo(function FilteredTopics({ topics, query }) {
  const visible = useMemo(() => filterTopics(topics, query), [topics, query]);
  return visible.map(topic => <TopicCard key={topic.id} topic={topic} />);
});
```

Memoization is applied where measured calculation and stable props can skip work.

## Common mistakes

- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.
- Using global state before identifying the real owner and consumers.
- Optimizing renders without a measured user-facing problem.

## Summary

- Wasted Renders and Memoization connects Identifying wasted renders, `memo`, `useMemo`.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-27-Q01, R-27-Q02, R-27-Q03
- Topic quiz: `R-27-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-27-Q01

Which statement best explains “Identifying wasted renders” in the context of Wasted Renders and Memoization?

1. A render is wasteful only when measured cost matters and it produces no useful change. Profile realistic interactions before optimizing.
2. JSX must produce one root value, tags must close, JavaScript expressions use braces, DOM property names follow React conventions, and lists require stable keys.
3. Assess maintenance, documentation, accessibility, bundle impact, compatibility, escape hatches, and whether the tool solves a stable problem.
4. The children prop is a composition slot: callers provide nested content while a wrapper controls stable layout or behavior.

**Correct answer:** A render is wasteful only when measured cost matters and it produces no useful change. Profile realistic interactions before optimizing.

**Explanation:** Identifying wasted renders is best understood as follows: A render is wasteful only when measured cost matters and it produces no useful change. Profile realistic interactions before optimizing.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-27-Q02

Which statement best explains “`memo`” in the context of Wasted Renders and Memoization?

1. Assess maintenance, documentation, accessibility, bundle impact, compatibility, escape hatches, and whether the tool solves a stable problem.
2. JSX must produce one root value, tags must close, JavaScript expressions use braces, DOM property names follow React conventions, and lists require stable keys.
3. memo can skip a component render when props compare equal. It is an optimization, not a correctness mechanism.
4. The children prop is a composition slot: callers provide nested content while a wrapper controls stable layout or behavior.

**Correct answer:** memo can skip a component render when props compare equal. It is an optimization, not a correctness mechanism.

**Explanation:** `memo` is best understood as follows: memo can skip a component render when props compare equal. It is an optimization, not a correctness mechanism.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-27-Q03

Which statement best explains “`useMemo`” in the context of Wasted Renders and Memoization?

1. The children prop is a composition slot: callers provide nested content while a wrapper controls stable layout or behavior.
2. Assess maintenance, documentation, accessibility, bundle impact, compatibility, escape hatches, and whether the tool solves a stable problem.
3. JSX must produce one root value, tags must close, JavaScript expressions use braces, DOM property names follow React conventions, and lists require stable keys.
4. useMemo caches a calculation result between renders until dependencies change. Use it only for measured cost or identity-sensitive optimization.

**Correct answer:** useMemo caches a calculation result between renders until dependencies change. Use it only for measured cost or identity-sensitive optimization.

**Explanation:** `useMemo` is best understood as follows: useMemo caches a calculation result between renders until dependencies change. Use it only for measured cost or identity-sensitive optimization.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-27-Q04

A learner must use Wasted Renders and Memoization in a new situation. Which approach best demonstrates transferable understanding?

1. Add more state and abstraction immediately, before identifying the smallest requirement.
2. Apply Identifying wasted renders deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
3. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
4. Skip the underlying model and rely on memorized syntax, even when the result is unclear.

**Correct answer:** Apply Identifying wasted renders deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-27-Q05

What is the most accurate explanation of the following Wasted Renders and Memoization example?

```jsx
const FilteredTopics = memo(function FilteredTopics({ topics, query }) {
  const visible = useMemo(() => filterTopics(topics, query), [topics, query]);
  return visible.map(topic => <TopicCard key={topic.id} topic={topic} />);
});
```

1. Memoization is applied where measured calculation and stable props can skip work.
2. The snippet removes the need to understand the data flowing through the program.
3. The snippet guarantees that all values are immutable and all operations are asynchronous.
4. The snippet is valid only because JavaScript ignores variable scope and evaluation order.

**Correct answer:** Memoization is applied where measured calculation and stable props can skip work.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-27-Q06

Which response best addresses this common mistake: “Mutating props or state instead of producing the next value.”?

1. The statement is correct only when variable names are short.
2. The statement is unrelated to program behavior and cannot cause defects.
3. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
4. The statement is always correct, so no further reasoning about Wasted Renders and Memoization is needed.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-27-Q07

Which sequence is most reliable when solving a problem involving Wasted Renders and Memoization?

1. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
2. First identify the requirement, then apply the relevant rule from Identifying wasted renders, inspect the result, and only then refactor or optimize.
3. Optimize first, then decide what the code is supposed to do.
4. Start with a framework abstraction and avoid checking the underlying language behavior.

**Correct answer:** First identify the requirement, then apply the relevant rule from Identifying wasted renders, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-27-Q08

Which guideline shows the best judgment about when to use Wasted Renders and Memoization?

1. Avoid Wasted Renders and Memoization completely because all abstractions reduce maintainability.
2. Choose based only on line count, without considering readability, correctness, or future change.
3. Use Wasted Renders and Memoization in every file because more abstraction is always better.
4. Use Wasted Renders and Memoization when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Correct answer:** Use Wasted Renders and Memoization when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Performance Optimization and Wasted Renders — Coverage research only; no transcript wording is canonical.
- Understanding memo — Coverage research only; no transcript wording is canonical.
- Understanding useMemo and useCallback — Coverage research only; no transcript wording is canonical.
- The Profiler Developer Tool — Optional coverage reference; learner-facing wording must be original.
- memo in Practice — Optional coverage reference; learner-facing wording must be original.
- useMemo in Practice — Optional coverage reference; learner-facing wording must be original.
- useCallback in Practice — Optional coverage reference; learner-facing wording must be original.
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
