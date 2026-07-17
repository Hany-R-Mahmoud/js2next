---
schemaVersion: '1.0'
id: N-01
slug: server-side-rendering-and-hydration
trackId: nextjs
moduleId: N-M01
order: 1
title: Server-Side Rendering and Hydration
required: true
optional: false
advanced: false
contentType: core
difficulty: 2
estimatedMinutes: 20
requiredPrerequisiteTopicIds: []
recommendedPrerequisiteTopicIds:
- R-12
- R-13
- R-18
- R-24
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Server-Side Rendering and Hydration

> **Why this matters:** Server-Side Rendering and Hydration is part of the mental model learners need before making reliable implementation decisions. It belongs to the **Rendering Foundations** module.

## Learning objectives

- [N-01-LO1] Compare client-side versus server-side rendering using a new example and justify the result.
- [N-01-LO2] Trace and explain ssr request flow using a new example and justify the result.
- [N-01-LO3] Explain hydration and interactivity using a new example and justify the result.

## Mental model

Draw a decision map: **Client-side versus server-side rendering** → **SSR request flow** → **Hydration and interactivity**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Client-side versus server-side rendering

Client-side rendering creates much of the UI in the browser; server-side rendering creates HTML on a server or during prerendering. Modern applications often combine both.

_Knowledge check: `N-01-Q01`_

## SSR request flow

The server receives a request, resolves data, renders HTML, and returns it so content can appear before all client JavaScript is ready.

_Knowledge check: `N-01-Q02`_

## Hydration and interactivity

Hydration connects React behavior to matching server-rendered HTML. The first client render must agree with server output.

_Knowledge check: `N-01-Q03`_

## Worked example

```jsx
// Server output:
<div id="root"><button>Continue</button></div>

// Client entry:
hydrateRoot(document.getElementById('root'), <App />);
```

HTML appears first and hydration attaches React behavior to the matching tree.

## Common mistakes

- Marking a large route tree as client code when only a small interaction needs it.
- Confusing React Server Components with server-side rendering.
- Assuming cached data is fresh without an explicit policy and invalidation path.
- Placing security-sensitive validation only in the client or middleware layer.

## Summary

- Server-Side Rendering and Hydration connects Client-side versus server-side rendering, SSR request flow, Hydration and interactivity.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: N-01-Q01, N-01-Q02, N-01-Q03
- Topic quiz: `N-01-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### N-01-Q01

Which statement best explains “Client-side versus server-side rendering” in the context of Server-Side Rendering and Hydration?

1. Client-side rendering creates much of the UI in the browser; server-side rendering creates HTML on a server or during prerendering. Modern applications often combine both.
2. Next.js can use RSC to assemble the tree and SSR to emit initial HTML, then hydrate client boundaries in the browser.
3. Next.js adds routing, server rendering, data conventions, asset optimization, build tooling, and deployment integration around React.
4. A Suspense boundary defines where fallback UI can appear while a child waits.

**Correct answer:** Client-side rendering creates much of the UI in the browser; server-side rendering creates HTML on a server or during prerendering. Modern applications often combine both.

**Explanation:** Client-side versus server-side rendering is best understood as follows: Client-side rendering creates much of the UI in the browser; server-side rendering creates HTML on a server or during prerendering. Modern applications often combine both.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-01-Q02

Which statement best explains “SSR request flow” in the context of Server-Side Rendering and Hydration?

1. A Suspense boundary defines where fallback UI can appear while a child waits.
2. Next.js adds routing, server rendering, data conventions, asset optimization, build tooling, and deployment integration around React.
3. Next.js can use RSC to assemble the tree and SSR to emit initial HTML, then hydrate client boundaries in the browser.
4. The server receives a request, resolves data, renders HTML, and returns it so content can appear before all client JavaScript is ready.

**Correct answer:** The server receives a request, resolves data, renders HTML, and returns it so content can appear before all client JavaScript is ready.

**Explanation:** SSR request flow is best understood as follows: The server receives a request, resolves data, renders HTML, and returns it so content can appear before all client JavaScript is ready.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-01-Q03

Which statement best explains “Hydration and interactivity” in the context of Server-Side Rendering and Hydration?

1. Next.js can use RSC to assemble the tree and SSR to emit initial HTML, then hydrate client boundaries in the browser.
2. Hydration connects React behavior to matching server-rendered HTML. The first client render must agree with server output.
3. A Suspense boundary defines where fallback UI can appear while a child waits.
4. Next.js adds routing, server rendering, data conventions, asset optimization, build tooling, and deployment integration around React.

**Correct answer:** Hydration connects React behavior to matching server-rendered HTML. The first client render must agree with server output.

**Explanation:** Hydration and interactivity is best understood as follows: Hydration connects React behavior to matching server-rendered HTML. The first client render must agree with server output.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-01-Q04

A learner must use Server-Side Rendering and Hydration in a new situation. Which approach best demonstrates transferable understanding?

1. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
2. Add more state and abstraction immediately, before identifying the smallest requirement.
3. Apply Client-side versus server-side rendering deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
4. Skip the underlying model and rely on memorized syntax, even when the result is unclear.

**Correct answer:** Apply Client-side versus server-side rendering deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### N-01-Q05

What is the most accurate explanation of the following Server-Side Rendering and Hydration example?

```jsx
// Server output:
<div id="root"><button>Continue</button></div>

// Client entry:
hydrateRoot(document.getElementById('root'), <App />);
```

1. The snippet removes the need to understand the data flowing through the program.
2. HTML appears first and hydration attaches React behavior to the matching tree.
3. The snippet guarantees that all values are immutable and all operations are asynchronous.
4. The snippet is valid only because JavaScript ignores variable scope and evaluation order.

**Correct answer:** HTML appears first and hydration attaches React behavior to the matching tree.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### N-01-Q06

Which response best addresses this common mistake: “Marking a large route tree as client code when only a small interaction needs it.”?

1. The statement is always correct, so no further reasoning about Server-Side Rendering and Hydration is needed.
2. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
3. The statement is correct only when variable names are short.
4. The statement is unrelated to program behavior and cannot cause defects.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### N-01-Q07

Which sequence is most reliable when solving a problem involving Server-Side Rendering and Hydration?

1. Optimize first, then decide what the code is supposed to do.
2. First identify the requirement, then apply the relevant rule from Client-side versus server-side rendering, inspect the result, and only then refactor or optimize.
3. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
4. Start with a framework abstraction and avoid checking the underlying language behavior.

**Correct answer:** First identify the requirement, then apply the relevant rule from Client-side versus server-side rendering, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### N-01-Q08

Which guideline shows the best judgment about when to use Server-Side Rendering and Hydration?

1. Use Server-Side Rendering and Hydration in every file because more abstraction is always better.
2. Use Server-Side Rendering and Hydration when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
3. Avoid Server-Side Rendering and Hydration completely because all abstractions reduce maintainability.
4. Choose based only on line count, without considering readability, correctness, or future change.

**Correct answer:** Use Server-Side Rendering and Hydration when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- An Overview of Server-Side Rendering (SSR) — Coverage research only; no transcript wording is canonical.
- The Missing Piece: Hydration — Coverage research only; no transcript wording is canonical.
- [Next.js App Router](https://nextjs.org/docs/app) — Technical verification and freshness review.
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — Technical verification and freshness review.
- [Next.js Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data) — Technical verification and freshness review.
- [Next.js Caching and Revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating) — Technical verification and freshness review.
- [Next.js Server Actions and Mutations](https://nextjs.org/docs/app/getting-started/updating-data) — Technical verification and freshness review.
- [Next.js loading.js and Streaming](https://nextjs.org/docs/app/api-reference/file-conventions/loading) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
