---
schemaVersion: '1.0'
id: N-05
slug: wild-oasis-website-planning
trackId: nextjs
moduleId: N-M03
order: 1
title: Wild Oasis Website Planning
required: true
optional: false
advanced: false
contentType: case_study
difficulty: 3
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- N-04
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Wild Oasis Website Planning

> **Why this matters:** Wild Oasis Website Planning is part of the mental model learners need before making reliable implementation decisions. It belongs to the **Project Planning** module.

## Learning objectives

- [N-05-LO1] Explain routes and layouts using a new example and justify the result.
- [N-05-LO2] Explain feature planning using a new example and justify the result.
- [N-05-LO3] Choose and justify server/client responsibility planning using a new example and justify the result.

## Mental model

Draw a decision map: **Routes and layouts** → **Feature planning** → **Server/client responsibility planning**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Routes and layouts

Plan routes around tasks and resources, using nested layouts for persistent shared UI and route-level loading or error boundaries.

_Knowledge check: `N-05-Q01`_

## Feature planning

Translate user-visible outcomes into routes, data needs, interactions, errors, and acceptance conditions before implementation.

_Knowledge check: `N-05-Q02`_

## Server/client responsibility planning

Default to Server Components for data and noninteractive UI, then add narrow Client Components at interaction boundaries.

_Knowledge check: `N-05-Q03`_

## Worked example

```text
app/
  tracks/
    [track]/
      layout.tsx
      page.tsx
      [module]/
        page.tsx
        loading.tsx
        error.tsx
```

The route tree exposes URLs, shared layouts, and loading/error boundaries before coding.

## Common mistakes

- Marking a large route tree as client code when only a small interaction needs it.
- Confusing React Server Components with server-side rendering.
- Assuming cached data is fresh without an explicit policy and invalidation path.
- Placing security-sensitive validation only in the client or middleware layer.

## Summary

- Wild Oasis Website Planning connects Routes and layouts, Feature planning, Server/client responsibility planning.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: N-05-Q01, N-05-Q02, N-05-Q03
- Topic quiz: `N-05-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### N-05-Q01

Which statement best explains “Routes and layouts” in the context of Wild Oasis Website Planning?

1. Client Components can submit to or invoke a Server Action while the function itself executes on the server.
2. Dynamic rendering produces output at request time for request-specific, personalized, or uncached data.
3. Plan routes around tasks and resources, using nested layouts for persistent shared UI and route-level loading or error boundaries.
4. Hydration connects React behavior to matching server-rendered HTML. The first client render must agree with server output.

**Correct answer:** Plan routes around tasks and resources, using nested layouts for persistent shared UI and route-level loading or error boundaries.

**Explanation:** Routes and layouts is best understood as follows: Plan routes around tasks and resources, using nested layouts for persistent shared UI and route-level loading or error boundaries.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-05-Q02

Which statement best explains “Feature planning” in the context of Wild Oasis Website Planning?

1. Translate user-visible outcomes into routes, data needs, interactions, errors, and acceptance conditions before implementation.
2. Dynamic rendering produces output at request time for request-specific, personalized, or uncached data.
3. Hydration connects React behavior to matching server-rendered HTML. The first client render must agree with server output.
4. Client Components can submit to or invoke a Server Action while the function itself executes on the server.

**Correct answer:** Translate user-visible outcomes into routes, data needs, interactions, errors, and acceptance conditions before implementation.

**Explanation:** Feature planning is best understood as follows: Translate user-visible outcomes into routes, data needs, interactions, errors, and acceptance conditions before implementation.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-05-Q03

Which statement best explains “Server/client responsibility planning” in the context of Wild Oasis Website Planning?

1. Dynamic rendering produces output at request time for request-specific, personalized, or uncached data.
2. Default to Server Components for data and noninteractive UI, then add narrow Client Components at interaction boundaries.
3. Hydration connects React behavior to matching server-rendered HTML. The first client render must agree with server output.
4. Client Components can submit to or invoke a Server Action while the function itself executes on the server.

**Correct answer:** Default to Server Components for data and noninteractive UI, then add narrow Client Components at interaction boundaries.

**Explanation:** Server/client responsibility planning is best understood as follows: Default to Server Components for data and noninteractive UI, then add narrow Client Components at interaction boundaries.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-05-Q04

A learner must use Wild Oasis Website Planning in a new situation. Which approach best demonstrates transferable understanding?

1. Apply Routes and layouts deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
2. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
3. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
4. Add more state and abstraction immediately, before identifying the smallest requirement.

**Correct answer:** Apply Routes and layouts deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### N-05-Q05

What is the most accurate explanation of the following Wild Oasis Website Planning example?

```text
app/
  tracks/
    [track]/
      layout.tsx
      page.tsx
      [module]/
        page.tsx
        loading.tsx
        error.tsx
```

1. The snippet guarantees that all values are immutable and all operations are asynchronous.
2. The snippet removes the need to understand the data flowing through the program.
3. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
4. The route tree exposes URLs, shared layouts, and loading/error boundaries before coding.

**Correct answer:** The route tree exposes URLs, shared layouts, and loading/error boundaries before coding.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### N-05-Q06

Which response best addresses this common mistake: “Marking a large route tree as client code when only a small interaction needs it.”?

1. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
2. The statement is unrelated to program behavior and cannot cause defects.
3. The statement is always correct, so no further reasoning about Wild Oasis Website Planning is needed.
4. The statement is correct only when variable names are short.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### N-05-Q07

Which sequence is most reliable when solving a problem involving Wild Oasis Website Planning?

1. Optimize first, then decide what the code is supposed to do.
2. First identify the requirement, then apply the relevant rule from Routes and layouts, inspect the result, and only then refactor or optimize.
3. Start with a framework abstraction and avoid checking the underlying language behavior.
4. Copy an unrelated implementation, hide the assumptions, and test only the happy path.

**Correct answer:** First identify the requirement, then apply the relevant rule from Routes and layouts, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### N-05-Q08

Which guideline shows the best judgment about when to use Wild Oasis Website Planning?

1. Avoid Wild Oasis Website Planning completely because all abstractions reduce maintainability.
2. Choose based only on line count, without considering readability, correctness, or future change.
3. Use Wild Oasis Website Planning when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
4. Use Wild Oasis Website Planning in every file because more abstraction is always better.

**Correct answer:** Use Wild Oasis Website Planning when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Project Planning: "The Wild Oasis" Customer Website — Coverage research only; no transcript wording is canonical.
- Project Organization — Optional coverage reference; learner-facing wording must be original.
- Styling With Tailwind CSS — Optional coverage reference; learner-facing wording must be original.
- Building the Home Page — Optional coverage reference; learner-facing wording must be original.
- [Next.js App Router](https://nextjs.org/docs/app) — Technical verification and freshness review.
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — Technical verification and freshness review.
- [Next.js Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data) — Technical verification and freshness review.
- [Next.js Caching and Revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating) — Technical verification and freshness review.
- [Next.js Server Actions and Mutations](https://nextjs.org/docs/app/getting-started/updating-data) — Technical verification and freshness review.
- [Next.js loading.js and Streaming](https://nextjs.org/docs/app/api-reference/file-conventions/loading) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
