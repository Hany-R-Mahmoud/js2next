---
schemaVersion: '1.0'
id: N-07
slug: static-dynamic-and-partial-pre-rendering
trackId: nextjs
moduleId: N-M04
order: 2
title: Static, Dynamic, and Partial Pre-Rendering
required: true
optional: false
advanced: false
contentType: core
difficulty: 3
estimatedMinutes: 20
requiredPrerequisiteTopicIds:
- N-06
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Static, Dynamic, and Partial Pre-Rendering

> **Why this matters:** Learners frequently use static, dynamic, and partial pre-rendering without a clear model of why it behaves as it does; this lesson makes that model explicit. It belongs to the **Streaming, Rendering Strategies, and Caching** module.

## Learning objectives

- [N-07-LO1] Explain static rendering using a new example and justify the result.
- [N-07-LO2] Explain dynamic rendering using a new example and justify the result.
- [N-07-LO3] Explain partial pre-rendering using a new example and justify the result.
- [N-07-LO4] Explain choosing a strategy using a new example and justify the result.

## Mental model

Draw a decision map: **Static rendering** → **Dynamic rendering** → **Partial pre-rendering** → **Choosing a strategy**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Static rendering

Static rendering produces reusable output ahead of requests and suits data that does not depend on request-specific information.

_Knowledge check: `N-07-Q01`_

## Dynamic rendering

Dynamic rendering produces output at request time for request-specific, personalized, or uncached data.

_Knowledge check: `N-07-Q02`_

## Partial pre-rendering

Partial prerendering combines a static shell with dynamic regions behind Suspense boundaries. APIs must be version-pinned because the model evolves.

_Knowledge check: `N-07-Q03`_

## Choosing a strategy

Choose rendering per region based on freshness, personalization, latency, cacheability, and cost.

_Knowledge check: `N-07-Q03`_

## Worked example

```tsx
export default async function Page() {
  return (
    <>
      <StaticCourseIntro />
      <Suspense fallback={<p>Loading your progress…</p>}>
        <PersonalProgress />
      </Suspense>
    </>
  );
}
```

Static and request-time regions can coexist behind a boundary.

## Common mistakes

- Marking a large route tree as client code when only a small interaction needs it.
- Confusing React Server Components with server-side rendering.
- Assuming cached data is fresh without an explicit policy and invalidation path.
- Placing security-sensitive validation only in the client or middleware layer.

## Summary

- Static, Dynamic, and Partial Pre-Rendering connects Static rendering, Dynamic rendering, Partial pre-rendering.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: N-07-Q01, N-07-Q02, N-07-Q03
- Topic quiz: `N-07-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### N-07-Q01

Which statement best explains “Static rendering” in the context of Static, Dynamic, and Partial Pre-Rendering?

1. Static rendering produces reusable output ahead of requests and suits data that does not depend on request-specific information.
2. A redirect changes the client's URL; a rewrite serves a different destination while preserving the visible URL.
3. The RSC payload describes the rendered server tree and client boundaries; it is not ordinary HTML.
4. Server Components can render Client Components and pass serializable data or server-rendered children across the boundary.

**Correct answer:** Static rendering produces reusable output ahead of requests and suits data that does not depend on request-specific information.

**Explanation:** Static rendering is best understood as follows: Static rendering produces reusable output ahead of requests and suits data that does not depend on request-specific information.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-07-Q02

Which statement best explains “Dynamic rendering” in the context of Static, Dynamic, and Partial Pre-Rendering?

1. A redirect changes the client's URL; a rewrite serves a different destination while preserving the visible URL.
2. Server Components can render Client Components and pass serializable data or server-rendered children across the boundary.
3. The RSC payload describes the rendered server tree and client boundaries; it is not ordinary HTML.
4. Dynamic rendering produces output at request time for request-specific, personalized, or uncached data.

**Correct answer:** Dynamic rendering produces output at request time for request-specific, personalized, or uncached data.

**Explanation:** Dynamic rendering is best understood as follows: Dynamic rendering produces output at request time for request-specific, personalized, or uncached data.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-07-Q03

Which statement best explains “Partial pre-rendering” in the context of Static, Dynamic, and Partial Pre-Rendering?

1. A redirect changes the client's URL; a rewrite serves a different destination while preserving the visible URL.
2. Server Components can render Client Components and pass serializable data or server-rendered children across the boundary.
3. Partial prerendering combines a static shell with dynamic regions behind Suspense boundaries. APIs must be version-pinned because the model evolves.
4. The RSC payload describes the rendered server tree and client boundaries; it is not ordinary HTML.

**Correct answer:** Partial prerendering combines a static shell with dynamic regions behind Suspense boundaries. APIs must be version-pinned because the model evolves.

**Explanation:** Partial pre-rendering is best understood as follows: Partial prerendering combines a static shell with dynamic regions behind Suspense boundaries. APIs must be version-pinned because the model evolves.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-07-Q04

A learner must use Static, Dynamic, and Partial Pre-Rendering in a new situation. Which approach best demonstrates transferable understanding?

1. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
2. Apply Static rendering deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
3. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
4. Add more state and abstraction immediately, before identifying the smallest requirement.

**Correct answer:** Apply Static rendering deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### N-07-Q05

What is the most accurate explanation of the following Static, Dynamic, and Partial Pre-Rendering example?

```tsx
export default async function Page() {
  return (
    <>
      <StaticCourseIntro />
      <Suspense fallback={<p>Loading your progress…</p>}>
        <PersonalProgress />
      </Suspense>
    </>
  );
}
```

1. Static and request-time regions can coexist behind a boundary.
2. The snippet guarantees that all values are immutable and all operations are asynchronous.
3. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
4. The snippet removes the need to understand the data flowing through the program.

**Correct answer:** Static and request-time regions can coexist behind a boundary.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### N-07-Q06

Which response best addresses this common mistake: “Marking a large route tree as client code when only a small interaction needs it.”?

1. The statement is unrelated to program behavior and cannot cause defects.
2. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
3. The statement is correct only when variable names are short.
4. The statement is always correct, so no further reasoning about Static, Dynamic, and Partial Pre-Rendering is needed.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### N-07-Q07

Which sequence is most reliable when solving a problem involving Static, Dynamic, and Partial Pre-Rendering?

1. Start with a framework abstraction and avoid checking the underlying language behavior.
2. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
3. Optimize first, then decide what the code is supposed to do.
4. First identify the requirement, then apply the relevant rule from Static rendering, inspect the result, and only then refactor or optimize.

**Correct answer:** First identify the requirement, then apply the relevant rule from Static rendering, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### N-07-Q08

Which guideline shows the best judgment about when to use Static, Dynamic, and Partial Pre-Rendering?

1. Use Static, Dynamic, and Partial Pre-Rendering when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
2. Use Static, Dynamic, and Partial Pre-Rendering in every file because more abstraction is always better.
3. Avoid Static, Dynamic, and Partial Pre-Rendering completely because all abstractions reduce maintainability.
4. Choose based only on line count, without considering readability, correctness, or future change.

**Correct answer:** Use Static, Dynamic, and Partial Pre-Rendering when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Different Types of SSR: Static vs. Dynamic Rendering — Coverage research only; no transcript wording is canonical.
- Partial Pre-Rendering — Coverage research only; no transcript wording is canonical.
- Analyzing Rendering in Our App — Optional coverage reference; learner-facing wording must be original.
- Making Dynamic Pages Static With generateStaticParams — Optional coverage reference; learner-facing wording must be original.
- Static Site Generation (SSG) — Optional coverage reference; learner-facing wording must be original.
- [Next.js App Router](https://nextjs.org/docs/app) — Technical verification and freshness review.
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — Technical verification and freshness review.
- [Next.js Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data) — Technical verification and freshness review.
- [Next.js Caching and Revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating) — Technical verification and freshness review.
- [Next.js Server Actions and Mutations](https://nextjs.org/docs/app/getting-started/updating-data) — Technical verification and freshness review.
- [Next.js loading.js and Streaming](https://nextjs.org/docs/app/api-reference/file-conventions/loading) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
