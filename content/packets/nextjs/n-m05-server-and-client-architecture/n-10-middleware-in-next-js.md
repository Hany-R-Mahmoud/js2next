---
schemaVersion: '1.0'
id: N-10
slug: middleware-in-next-js
trackId: nextjs
moduleId: N-M05
order: 2
title: Middleware in Next.js
required: true
optional: false
advanced: false
contentType: core
difficulty: 4
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- N-09
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Middleware in Next.js

> **Why this matters:** Middleware in Next.js is part of the mental model learners need before making reliable implementation decisions. It belongs to the **Server and Client Architecture** module.

## Learning objectives

- [N-10-LO1] Trace and explain request interception using a new example and justify the result.
- [N-10-LO2] Explain redirects and rewrites using a new example and justify the result.
- [N-10-LO3] Explain common middleware use cases using a new example and justify the result.

## Mental model

Draw a decision map: **Request interception** → **Redirects and rewrites** → **Common middleware use cases**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Request interception

Middleware runs before matching route handling and can inspect or modify requests and responses.

_Knowledge check: `N-10-Q01`_

## Redirects and rewrites

A redirect changes the client's URL; a rewrite serves a different destination while preserving the visible URL.

_Knowledge check: `N-10-Q02`_

## Common middleware use cases

Use middleware for lightweight redirects, locale routing, or coarse gates. In newer Next.js versions the feature may be called Proxy; Release 1 targets Next 15.5.20 terminology.

_Knowledge check: `N-10-Q03`_

## Worked example

```ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/learn-next') {
    return NextResponse.redirect(new URL('/js2next', request.url));
  }
  return NextResponse.next();
}
```

For the pinned Next 15 project, middleware intercepts and redirects a request.

## Common mistakes

- Marking a large route tree as client code when only a small interaction needs it.
- Confusing React Server Components with server-side rendering.
- Assuming cached data is fresh without an explicit policy and invalidation path.
- Placing security-sensitive validation only in the client or middleware layer.

## Summary

- Middleware in Next.js connects Request interception, Redirects and rewrites, Common middleware use cases.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: N-10-Q01, N-10-Q02, N-10-Q03
- Topic quiz: `N-10-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### N-10-Q01

Which statement best explains “Request interception” in the context of Middleware in Next.js?

1. Middleware runs before matching route handling and can inspect or modify requests and responses.
2. Server execution can protect secrets, keep data access close to its source, reduce client JavaScript, and support streaming or caching.
3. Forms can invoke Server Actions while preserving progressive enhancement. Validate authorization and input on the server.
4. Use props for server-to-client data, URLs for shareable navigation state, server mutations for persistence, and client state for interaction.

**Correct answer:** Middleware runs before matching route handling and can inspect or modify requests and responses.

**Explanation:** Request interception is best understood as follows: Middleware runs before matching route handling and can inspect or modify requests and responses.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-10-Q02

Which statement best explains “Redirects and rewrites” in the context of Middleware in Next.js?

1. A redirect changes the client's URL; a rewrite serves a different destination while preserving the visible URL.
2. Forms can invoke Server Actions while preserving progressive enhancement. Validate authorization and input on the server.
3. Use props for server-to-client data, URLs for shareable navigation state, server mutations for persistence, and client state for interaction.
4. Server execution can protect secrets, keep data access close to its source, reduce client JavaScript, and support streaming or caching.

**Correct answer:** A redirect changes the client's URL; a rewrite serves a different destination while preserving the visible URL.

**Explanation:** Redirects and rewrites is best understood as follows: A redirect changes the client's URL; a rewrite serves a different destination while preserving the visible URL.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-10-Q03

Which statement best explains “Common middleware use cases” in the context of Middleware in Next.js?

1. Use middleware for lightweight redirects, locale routing, or coarse gates. In newer Next.js versions the feature may be called Proxy; Release 1 targets Next 15.5.20 terminology.
2. Use props for server-to-client data, URLs for shareable navigation state, server mutations for persistence, and client state for interaction.
3. Forms can invoke Server Actions while preserving progressive enhancement. Validate authorization and input on the server.
4. Server execution can protect secrets, keep data access close to its source, reduce client JavaScript, and support streaming or caching.

**Correct answer:** Use middleware for lightweight redirects, locale routing, or coarse gates. In newer Next.js versions the feature may be called Proxy; Release 1 targets Next 15.5.20 terminology.

**Explanation:** Common middleware use cases is best understood as follows: Use middleware for lightweight redirects, locale routing, or coarse gates. In newer Next.js versions the feature may be called Proxy; Release 1 targets Next 15.5.20 terminology.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-10-Q04

A learner must use Middleware in Next.js in a new situation. Which approach best demonstrates transferable understanding?

1. Add more state and abstraction immediately, before identifying the smallest requirement.
2. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
3. Apply Request interception deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
4. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.

**Correct answer:** Apply Request interception deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### N-10-Q05

What is the most accurate explanation of the following Middleware in Next.js example?

```ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/learn-next') {
    return NextResponse.redirect(new URL('/js2next', request.url));
  }
  return NextResponse.next();
}
```

1. For the pinned Next 15 project, middleware intercepts and redirects a request.
2. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
3. The snippet removes the need to understand the data flowing through the program.
4. The snippet guarantees that all values are immutable and all operations are asynchronous.

**Correct answer:** For the pinned Next 15 project, middleware intercepts and redirects a request.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### N-10-Q06

Which response best addresses this common mistake: “Marking a large route tree as client code when only a small interaction needs it.”?

1. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
2. The statement is correct only when variable names are short.
3. The statement is always correct, so no further reasoning about Middleware in Next.js is needed.
4. The statement is unrelated to program behavior and cannot cause defects.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### N-10-Q07

Which sequence is most reliable when solving a problem involving Middleware in Next.js?

1. Optimize first, then decide what the code is supposed to do.
2. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
3. First identify the requirement, then apply the relevant rule from Request interception, inspect the result, and only then refactor or optimize.
4. Start with a framework abstraction and avoid checking the underlying language behavior.

**Correct answer:** First identify the requirement, then apply the relevant rule from Request interception, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### N-10-Q08

Which guideline shows the best judgment about when to use Middleware in Next.js?

1. Avoid Middleware in Next.js completely because all abstractions reduce maintainability.
2. Choose based only on line count, without considering readability, correctness, or future change.
3. Use Middleware in Next.js when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.
4. Use Middleware in Next.js in every file because more abstraction is always better.

**Correct answer:** Use Middleware in Next.js when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- What is Middleware in Next.js? — Coverage research only; no transcript wording is canonical.
- Creating an API Endpoint With Route Handlers — Optional coverage reference; learner-facing wording must be original.
- [Next.js App Router](https://nextjs.org/docs/app) — Technical verification and freshness review.
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — Technical verification and freshness review.
- [Next.js Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data) — Technical verification and freshness review.
- [Next.js Caching and Revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating) — Technical verification and freshness review.
- [Next.js Server Actions and Mutations](https://nextjs.org/docs/app/getting-started/updating-data) — Technical verification and freshness review.
- [Next.js loading.js and Streaming](https://nextjs.org/docs/app/api-reference/file-conventions/loading) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
