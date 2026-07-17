---
schemaVersion: '1.0'
id: N-11
slug: server-actions
trackId: nextjs
moduleId: N-M05
order: 3
title: Server Actions
required: true
optional: false
advanced: false
contentType: core
difficulty: 4
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- N-10
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Server Actions

> **Why this matters:** This topic turns server actions from isolated terminology into a practical tool for reading, writing, and reviewing code. It belongs to the **Server and Client Architecture** module.

## Learning objectives

- [N-11-LO1] Explain server-only mutations using a new example and justify the result.
- [N-11-LO2] Explain `use server` using a new example and justify the result.
- [N-11-LO3] Explain forms and mutations using a new example and justify the result.
- [N-11-LO4] Explain interaction with client components using a new example and justify the result.

## Mental model

Draw a decision map: **Server-only mutations** → **`use server`** → **Forms and mutations** → **Interaction with client components**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Server-only mutations

A Server Action is a server function used for a mutation, often through forms or client invocation.

_Knowledge check: `N-11-Q01`_

## `use server`

The directive marks server functions, not ordinary Server Components.

_Knowledge check: `N-11-Q02`_

## Forms and mutations

Forms can invoke Server Actions while preserving progressive enhancement. Validate authorization and input on the server.

_Knowledge check: `N-11-Q03`_

## Interaction with client components

Client Components can submit to or invoke a Server Action while the function itself executes on the server.

_Knowledge check: `N-11-Q03`_

## Worked example

```tsx
'use server';
export async function recordAnswer(formData: FormData) {
  const questionId = String(formData.get('questionId'));
  await saveAttempt({ questionId });
  revalidateTag(`question:${questionId}`);
}
```

The server action performs a mutation and revalidates affected data.

## Common mistakes

- Marking a large route tree as client code when only a small interaction needs it.
- Confusing React Server Components with server-side rendering.
- Assuming cached data is fresh without an explicit policy and invalidation path.
- Placing security-sensitive validation only in the client or middleware layer.

## Summary

- Server Actions connects Server-only mutations, `use server`, Forms and mutations.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: N-11-Q01, N-11-Q02, N-11-Q03
- Topic quiz: `N-11-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### N-11-Q01

Which statement best explains “Server-only mutations” in the context of Server Actions?

1. A Server Action is a server function used for a mutation, often through forms or client invocation.
2. Use middleware for lightweight redirects, locale routing, or coarse gates. In newer Next.js versions the feature may be called Proxy; Release 1 targets Next 15.5.20 terminology.
3. Next.js can use RSC to assemble the tree and SSR to emit initial HTML, then hydrate client boundaries in the browser.
4. Server Components execute in the server environment; Client Components opt into state, effects, events, and browser APIs.

**Correct answer:** A Server Action is a server function used for a mutation, often through forms or client invocation.

**Explanation:** Server-only mutations is best understood as follows: A Server Action is a server function used for a mutation, often through forms or client invocation.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-11-Q02

Which statement best explains “`use server`” in the context of Server Actions?

1. Next.js can use RSC to assemble the tree and SSR to emit initial HTML, then hydrate client boundaries in the browser.
2. Server Components execute in the server environment; Client Components opt into state, effects, events, and browser APIs.
3. The directive marks server functions, not ordinary Server Components.
4. Use middleware for lightweight redirects, locale routing, or coarse gates. In newer Next.js versions the feature may be called Proxy; Release 1 targets Next 15.5.20 terminology.

**Correct answer:** The directive marks server functions, not ordinary Server Components.

**Explanation:** `use server` is best understood as follows: The directive marks server functions, not ordinary Server Components.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-11-Q03

Which statement best explains “Forms and mutations” in the context of Server Actions?

1. Server Components execute in the server environment; Client Components opt into state, effects, events, and browser APIs.
2. Use middleware for lightweight redirects, locale routing, or coarse gates. In newer Next.js versions the feature may be called Proxy; Release 1 targets Next 15.5.20 terminology.
3. Forms can invoke Server Actions while preserving progressive enhancement. Validate authorization and input on the server.
4. Next.js can use RSC to assemble the tree and SSR to emit initial HTML, then hydrate client boundaries in the browser.

**Correct answer:** Forms can invoke Server Actions while preserving progressive enhancement. Validate authorization and input on the server.

**Explanation:** Forms and mutations is best understood as follows: Forms can invoke Server Actions while preserving progressive enhancement. Validate authorization and input on the server.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### N-11-Q04

A learner must use Server Actions in a new situation. Which approach best demonstrates transferable understanding?

1. Apply Server-only mutations deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
2. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
3. Add more state and abstraction immediately, before identifying the smallest requirement.
4. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.

**Correct answer:** Apply Server-only mutations deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### N-11-Q05

What is the most accurate explanation of the following Server Actions example?

```tsx
'use server';
export async function recordAnswer(formData: FormData) {
  const questionId = String(formData.get('questionId'));
  await saveAttempt({ questionId });
  revalidateTag(`question:${questionId}`);
}
```

1. The snippet removes the need to understand the data flowing through the program.
2. The snippet guarantees that all values are immutable and all operations are asynchronous.
3. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
4. The server action performs a mutation and revalidates affected data.

**Correct answer:** The server action performs a mutation and revalidates affected data.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### N-11-Q06

Which response best addresses this common mistake: “Marking a large route tree as client code when only a small interaction needs it.”?

1. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
2. The statement is correct only when variable names are short.
3. The statement is unrelated to program behavior and cannot cause defects.
4. The statement is always correct, so no further reasoning about Server Actions is needed.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### N-11-Q07

Which sequence is most reliable when solving a problem involving Server Actions?

1. First identify the requirement, then apply the relevant rule from Server-only mutations, inspect the result, and only then refactor or optimize.
2. Optimize first, then decide what the code is supposed to do.
3. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
4. Start with a framework abstraction and avoid checking the underlying language behavior.

**Correct answer:** First identify the requirement, then apply the relevant rule from Server-only mutations, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### N-11-Q08

Which guideline shows the best judgment about when to use Server Actions?

1. Avoid Server Actions completely because all abstractions reduce maintainability.
2. Choose based only on line count, without considering readability, correctness, or future change.
3. Use Server Actions in every file because more abstraction is always better.
4. Use Server Actions when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Correct answer:** Use Server Actions when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- What are Server Actions? — Coverage research only; no transcript wording is canonical.
- Authentication With NextAuth (Auth.js) — Optional coverage reference; learner-facing wording must be original.
- Setting Up NextAuth — Optional coverage reference; learner-facing wording must be original.
- Mutations With Server Actions + Modern React Hooks — Optional coverage reference; learner-facing wording must be original.
- [Next.js App Router](https://nextjs.org/docs/app) — Technical verification and freshness review.
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — Technical verification and freshness review.
- [Next.js Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data) — Technical verification and freshness review.
- [Next.js Caching and Revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating) — Technical verification and freshness review.
- [Next.js Server Actions and Mutations](https://nextjs.org/docs/app/getting-started/updating-data) — Technical verification and freshness review.
- [Next.js loading.js and Streaming](https://nextjs.org/docs/app/api-reference/file-conventions/loading) — Technical verification and freshness review.

## Publication note

This packet is implementation-ready but remains a **draft pending human review**. Codex must import and preview it, but must not automatically publish it.
