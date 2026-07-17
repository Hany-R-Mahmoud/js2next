---
schemaVersion: '1.0'
id: R-24
slug: routing-and-single-page-applications
trackId: react
moduleId: R-M07
order: 2
title: Routing and Single-Page Applications
required: true
optional: false
advanced: false
contentType: core
difficulty: 4
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- R-23
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Routing and Single-Page Applications

> **Why this matters:** This topic turns routing and single-page applications from isolated terminology into a practical tool for reading, writing, and reviewing code. It belongs to the **Complex State, Routing, and Styling** module.

## Learning objectives

- [R-24-LO1] Apply client-side routing using a new example and justify the result.
- [R-24-LO2] Explain routes and navigation using a new example and justify the result.
- [R-24-LO3] Explain spa mental model using a new example and justify the result.

## Mental model

Draw a decision map: **Client-side routing** → **Routes and navigation** → **SPA mental model**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Client-side routing

Client-side routing maps URLs to UI without requesting a full document for every navigation.

_Knowledge check: `R-24-Q01`_

## Routes and navigation

Routes represent user-visible resources and tasks. Use links for navigation and parameters for identity while preserving browser history.

_Knowledge check: `R-24-Q02`_

## SPA mental model

A single-page application updates views on the client after an application shell loads, requiring deliberate loading, errors, metadata, and accessibility.

_Knowledge check: `R-24-Q03`_

## Worked example

```jsx
<Routes>
  <Route path="/tracks" element={<TracksPage />} />
  <Route path="/tracks/:trackId" element={<TrackPage />} />
</Routes>
```

Routes map URLs to UI and a parameter identifies a track.

## Common mistakes

- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.
- Using global state before identifying the real owner and consumers.
- Optimizing renders without a measured user-facing problem.

## Summary

- Routing and Single-Page Applications connects Client-side routing, Routes and navigation, SPA mental model.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-24-Q01, R-24-Q02, R-24-Q03
- Topic quiz: `R-24-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-24-Q01

Which statement best explains “Client-side routing” in the context of Routing and Single-Page Applications?

1. Client-side routing maps URLs to UI without requesting a full document for every navigation.
2. Components divide an interface into reusable, composable units. A useful component owns one coherent responsibility and accepts explicit inputs.
3. Start from the data model and static component tree, identify minimal state, choose its owner, and add upward communication through callbacks.
4. React updates host nodes according to reconciliation. A component render does not imply every descendant DOM node is replaced.

**Correct answer:** Client-side routing maps URLs to UI without requesting a full document for every navigation.

**Explanation:** Client-side routing is best understood as follows: Client-side routing maps URLs to UI without requesting a full document for every navigation.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-24-Q02

Which statement best explains “Routes and navigation” in the context of Routing and Single-Page Applications?

1. Components divide an interface into reusable, composable units. A useful component owns one coherent responsibility and accepts explicit inputs.
2. React updates host nodes according to reconciliation. A component render does not imply every descendant DOM node is replaced.
3. Routes represent user-visible resources and tasks. Use links for navigation and parameters for identity while preserving browser history.
4. Start from the data model and static component tree, identify minimal state, choose its owner, and add upward communication through callbacks.

**Correct answer:** Routes represent user-visible resources and tasks. Use links for navigation and parameters for identity while preserving browser history.

**Explanation:** Routes and navigation is best understood as follows: Routes represent user-visible resources and tasks. Use links for navigation and parameters for identity while preserving browser history.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-24-Q03

Which statement best explains “SPA mental model” in the context of Routing and Single-Page Applications?

1. Start from the data model and static component tree, identify minimal state, choose its owner, and add upward communication through callbacks.
2. A single-page application updates views on the client after an application shell loads, requiring deliberate loading, errors, metadata, and accessibility.
3. Components divide an interface into reusable, composable units. A useful component owns one coherent responsibility and accepts explicit inputs.
4. React updates host nodes according to reconciliation. A component render does not imply every descendant DOM node is replaced.

**Correct answer:** A single-page application updates views on the client after an application shell loads, requiring deliberate loading, errors, metadata, and accessibility.

**Explanation:** SPA mental model is best understood as follows: A single-page application updates views on the client after an application shell loads, requiring deliberate loading, errors, metadata, and accessibility.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-24-Q04

A learner must use Routing and Single-Page Applications in a new situation. Which approach best demonstrates transferable understanding?

1. Apply Client-side routing deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
2. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
3. Add more state and abstraction immediately, before identifying the smallest requirement.
4. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.

**Correct answer:** Apply Client-side routing deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-24-Q05

What is the most accurate explanation of the following Routing and Single-Page Applications example?

```jsx
<Routes>
  <Route path="/tracks" element={<TracksPage />} />
  <Route path="/tracks/:trackId" element={<TrackPage />} />
</Routes>
```

1. The snippet removes the need to understand the data flowing through the program.
2. Routes map URLs to UI and a parameter identifies a track.
3. The snippet is valid only because JavaScript ignores variable scope and evaluation order.
4. The snippet guarantees that all values are immutable and all operations are asynchronous.

**Correct answer:** Routes map URLs to UI and a parameter identifies a track.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-24-Q06

Which response best addresses this common mistake: “Mutating props or state instead of producing the next value.”?

1. The statement is always correct, so no further reasoning about Routing and Single-Page Applications is needed.
2. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
3. The statement is unrelated to program behavior and cannot cause defects.
4. The statement is correct only when variable names are short.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-24-Q07

Which sequence is most reliable when solving a problem involving Routing and Single-Page Applications?

1. Optimize first, then decide what the code is supposed to do.
2. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
3. First identify the requirement, then apply the relevant rule from Client-side routing, inspect the result, and only then refactor or optimize.
4. Start with a framework abstraction and avoid checking the underlying language behavior.

**Correct answer:** First identify the requirement, then apply the relevant rule from Client-side routing, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-24-Q08

Which guideline shows the best judgment about when to use Routing and Single-Page Applications?

1. Avoid Routing and Single-Page Applications completely because all abstractions reduce maintainability.
2. Choose based only on line count, without considering readability, correctness, or future change.
3. Use Routing and Single-Page Applications in every file because more abstraction is always better.
4. Use Routing and Single-Page Applications when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Correct answer:** Use Routing and Single-Page Applications when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Routing and Single-Page Applications (SPAs) — Coverage research only; no transcript wording is canonical.
- Implementing Main Pages and Routes — Optional coverage reference; learner-facing wording must be original.
- Linking Between Routes With <Link /> and <NavLink /> — Optional coverage reference; learner-facing wording must be original.
- Nested Routes and Index Route — Optional coverage reference; learner-facing wording must be original.
- Dynamic Routes With URL Parameters — Optional coverage reference; learner-facing wording must be original.
- Programmatic Navigation with useNavigate — Optional coverage reference; learner-facing wording must be original.
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
