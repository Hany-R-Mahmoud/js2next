---
schemaVersion: '1.0'
id: R-28
slug: code-splitting-and-pragmatic-optimization
trackId: react
moduleId: R-M09
order: 2
title: Code Splitting and Pragmatic Optimization
required: true
optional: false
advanced: false
contentType: core
difficulty: 5
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- R-27
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Code Splitting and Pragmatic Optimization

> **Why this matters:** This topic turns code splitting and pragmatic optimization from isolated terminology into a practical tool for reading, writing, and reviewing code. It belongs to the **Performance and Advanced Effects** module.

## Learning objectives

- [R-28-LO1] Apply lazy loading using a new example and justify the result.
- [R-28-LO2] Explain code splitting using a new example and justify the result.
- [R-28-LO3] Explain bundle size using a new example and justify the result.
- [R-28-LO4] Explain avoiding premature optimization using a new example and justify the result.

## Mental model

Draw a decision map: **Lazy loading** → **Code splitting** → **Bundle size** → **Avoiding premature optimization**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Lazy loading

Lazy loading defers code or resources until a feature is needed, reducing initial work while adding loading and error states.

_Knowledge check: `R-28-Q01`_

## Code splitting

Code splitting emits separate bundles loaded on demand, often at route or feature boundaries.

_Knowledge check: `R-28-Q02`_

## Bundle size

Bundle size affects download, parse, and execution time. Measure real user conditions and audit large dependencies.

_Knowledge check: `R-28-Q03`_

## Avoiding premature optimization

Begin with clear, correct code, profile a real bottleneck, change one factor, and measure again.

_Knowledge check: `R-28-Q03`_

## Worked example

```jsx
const AnalyticsPage = lazy(() => import('./AnalyticsPage'));
function App() {
  return (
    <Suspense fallback={<p>Loading analytics…</p>}>
      <AnalyticsPage />
    </Suspense>
  );
}
```

The feature bundle loads on demand and the boundary supplies fallback UI.

## Common mistakes

- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.
- Using global state before identifying the real owner and consumers.
- Optimizing renders without a measured user-facing problem.

## Summary

- Code Splitting and Pragmatic Optimization connects Lazy loading, Code splitting, Bundle size.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-28-Q01, R-28-Q02, R-28-Q03
- Topic quiz: `R-28-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-28-Q01

Which statement best explains “Lazy loading” in the context of Code Splitting and Pragmatic Optimization?

1. Lazy loading defers code or resources until a feature is needed, reducing initial work while adding loading and error states.
2. JSX is JavaScript syntax for describing element trees. Expressions appear in braces, attributes use React-oriented names, and JSX compiles to element creation calls.
3. Page, layout, feature, and reusable UI categories can clarify ownership and dependency direction, but they are team conventions rather than React rules.
4. React applications are composed from functions that describe UI from inputs. Components create local boundaries, can be nested, and expose a public API through props and composition.

**Correct answer:** Lazy loading defers code or resources until a feature is needed, reducing initial work while adding loading and error states.

**Explanation:** Lazy loading is best understood as follows: Lazy loading defers code or resources until a feature is needed, reducing initial work while adding loading and error states.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-28-Q02

Which statement best explains “Code splitting” in the context of Code Splitting and Pragmatic Optimization?

1. Page, layout, feature, and reusable UI categories can clarify ownership and dependency direction, but they are team conventions rather than React rules.
2. React applications are composed from functions that describe UI from inputs. Components create local boundaries, can be nested, and expose a public API through props and composition.
3. JSX is JavaScript syntax for describing element trees. Expressions appear in braces, attributes use React-oriented names, and JSX compiles to element creation calls.
4. Code splitting emits separate bundles loaded on demand, often at route or feature boundaries.

**Correct answer:** Code splitting emits separate bundles loaded on demand, often at route or feature boundaries.

**Explanation:** Code splitting is best understood as follows: Code splitting emits separate bundles loaded on demand, often at route or feature boundaries.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-28-Q03

Which statement best explains “Bundle size” in the context of Code Splitting and Pragmatic Optimization?

1. React applications are composed from functions that describe UI from inputs. Components create local boundaries, can be nested, and expose a public API through props and composition.
2. JSX is JavaScript syntax for describing element trees. Expressions appear in braces, attributes use React-oriented names, and JSX compiles to element creation calls.
3. Bundle size affects download, parse, and execution time. Measure real user conditions and audit large dependencies.
4. Page, layout, feature, and reusable UI categories can clarify ownership and dependency direction, but they are team conventions rather than React rules.

**Correct answer:** Bundle size affects download, parse, and execution time. Measure real user conditions and audit large dependencies.

**Explanation:** Bundle size is best understood as follows: Bundle size affects download, parse, and execution time. Measure real user conditions and audit large dependencies.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-28-Q04

A learner must use Code Splitting and Pragmatic Optimization in a new situation. Which approach best demonstrates transferable understanding?

1. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
2. Apply Lazy loading deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
3. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
4. Add more state and abstraction immediately, before identifying the smallest requirement.

**Correct answer:** Apply Lazy loading deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-28-Q05

What is the most accurate explanation of the following Code Splitting and Pragmatic Optimization example?

```jsx
const AnalyticsPage = lazy(() => import('./AnalyticsPage'));
function App() {
  return (
    <Suspense fallback={<p>Loading analytics…</p>}>
      <AnalyticsPage />
    </Suspense>
  );
}
```

1. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
2. The feature bundle loads on demand and the boundary supplies fallback UI.
3. The snippet guarantees that all values are immutable and all operations are asynchronous.
4. The snippet removes the need to understand the data flowing through the program.

**Correct answer:** The feature bundle loads on demand and the boundary supplies fallback UI.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-28-Q06

Which response best addresses this common mistake: “Mutating props or state instead of producing the next value.”?

1. The statement is unrelated to program behavior and cannot cause defects.
2. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
3. The statement is always correct, so no further reasoning about Code Splitting and Pragmatic Optimization is needed.
4. The statement is correct only when variable names are short.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-28-Q07

Which sequence is most reliable when solving a problem involving Code Splitting and Pragmatic Optimization?

1. First identify the requirement, then apply the relevant rule from Lazy loading, inspect the result, and only then refactor or optimize.
2. Start with a framework abstraction and avoid checking the underlying language behavior.
3. Optimize first, then decide what the code is supposed to do.
4. Copy an unrelated implementation, hide the assumptions, and test only the happy path.

**Correct answer:** First identify the requirement, then apply the relevant rule from Lazy loading, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-28-Q08

Which guideline shows the best judgment about when to use Code Splitting and Pragmatic Optimization?

1. Avoid Code Splitting and Pragmatic Optimization completely because all abstractions reduce maintainability.
2. Choose based only on line count, without considering readability, correctness, or future change.
3. Use Code Splitting and Pragmatic Optimization in every file because more abstraction is always better.
4. Use Code Splitting and Pragmatic Optimization when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Correct answer:** Use Code Splitting and Pragmatic Optimization when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Optimizing Bundle Size With Code Splitting — Coverage research only; no transcript wording is canonical.
- Don't Optimize Prematurely! — Coverage research only; no transcript wording is canonical.
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
