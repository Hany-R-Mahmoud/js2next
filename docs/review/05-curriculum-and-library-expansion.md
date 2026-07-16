# Curriculum and Library Expansion

## Curriculum spine

- Stage 0: web and JavaScript foundations.
  - Values, references, mutation, immutability.
  - Closures and lexical scope.
  - Event loop, promises, async/await.
  - Modules and package boundaries.
  - DOM, events, forms, HTTP, and browser storage.
- Stage 1: TypeScript for React developers.
  - Inference and narrowing.
  - Unions and discriminated unions.
  - Generics.
  - Component props and event types.
  - API response types.
  - Runtime validation versus compile-time types.
- Stage 2: React mental model.
  - Components, JSX, render/commit.
  - Props, state, events, keys, identity.
  - Controlled inputs.
  - State ownership and lifting.
  - Reducers and context.
  - Refs and effects.
  - “You might not need an Effect.”
- Stage 3: application quality.
  - Forms and validation.
  - Loading, empty, error, and optimistic states.
  - Accessibility and keyboard interaction.
  - Testing user-visible behavior.
  - Debugging hydration and race conditions.
  - Component boundaries and maintainability.
- Stage 4: Next.js foundations.
  - App Router file conventions.
  - Layouts, pages, route groups, dynamic segments.
  - Navigation, prefetching, loading, and error UI.
  - Metadata, images, fonts, and configuration.
- Stage 5: server/client architecture.
  - Server Components and Client Components.
  - Serializable props.
  - Client boundaries and composition.
  - Server data access.
  - Route handlers and Server Actions.
- Stage 6: data work.
  - Fetching, caching, revalidation, and invalidation.
  - URL state.
  - Server state versus client state.
  - TanStack Query when client cache/server synchronization is needed.
  - Error and retry strategy.
- Stage 7: production.
  - Authentication, sessions, authorization.
  - Secrets and environment variables.
  - Security boundaries and CSRF/XSS basics.
  - Performance budgets, Web Vitals, image/font strategy.
  - Observability, logging, and deployment.
- Stage 8: architecture and interviews.
  - Feature organization.
  - State-placement decisions.
  - API and data contracts.
  - Migration planning.
  - Dependency trade-offs.
  - Pull-request review.
  - Incident/debugging interview.
  - System-design-lite for frontend.

## Lesson contract

- Every lesson should include:
  - Why it matters in daily frontend work.
  - Prerequisites.
  - Plain-language model.
  - Precise technical model.
  - Causal explanation.
  - Small code example.
  - Prediction question before explanation.
  - Common misconception.
  - At least one transfer task.
  - Retrieval prompt.
  - Reflection prompt.
  - Mastery criteria.
  - Source, version, and verification date.
- Every lesson should avoid:
  - Undefined “best practice” claims.
  - Versionless Next.js caching advice.
  - Passive reading as the only activity.
  - A correct answer shown before a genuine attempt.

## Challenge ladder

- Level 1: trace JavaScript or React output.
- Level 2: complete a small component.
- Level 3: build from acceptance criteria.
- Level 4: debug a defect.
- Level 5: choose state/data ownership.
- Level 6: integrate server and client concerns.
- Level 7: meet performance and accessibility constraints.
- Level 8: design an architecture and defend trade-offs.
- Level 9: investigate a production failure from symptoms.
- Level 10: capstone feature with written technical review.
- Add at least three variants per level:
  - Familiar context.
  - Novel context.
  - Interview/work context.

## Daily packages

- 15-minute package:
  - One retrieval question.
  - One short explanation.
  - One prediction.
  - One review card.
- 30-minute package:
  - One lesson chunk.
  - One prediction.
  - One mini challenge.
  - One reflection.
- 60-minute package:
  - Review queue.
  - New lesson.
  - Challenge attempt.
  - Transfer task.
  - Interview explanation.
- Weekly rhythm:
  - Day 1: new concept.
  - Day 2: retrieval and small variation.
  - Day 3: adjacent concept.
  - Day 4: mixed/interleaved challenge.
  - Day 5: debugging scenario.
  - Day 6: project slice.
  - Day 7: review, reflection, and next-path recommendation.
- Use spacing and retrieval as product mechanics, not decorative labels:
  - [Retrieval practice research](https://doi.org/10.1126/science.1152408).
  - [Distributed practice meta-analysis](https://doi.org/10.1037/0033-2909.132.3.354).
  - [Effective learning techniques review](https://doi.org/10.1177/1529100612453266).

## Libraries and tools to add

- Tier 0: browser/framework fundamentals.
  - TypeScript.
  - Native `fetch`.
  - URL/search params.
  - Web APIs.
- Tier 1: requested baseline.
  - React Hook Form for form state and field ergonomics.
  - Zod for runtime schemas and validation at boundaries.
  - TanStack Query for client/server-state synchronization when native Next.js fetching is insufficient.
  - Zustand only for truly client-owned global state; avoid making every server response global state.
- Tier 2: quality.
  - Vitest for pure logic and fast tests.
  - React Testing Library for user-visible component behavior.
  - Playwright for critical browser flows.
  - MSW for deterministic network behavior in tests and lessons.
  - ESLint and formatting with generated output excluded.
- Tier 3: optional production tools.
  - Storybook for component states and accessibility review.
  - Sentry or another error platform as an optional production topic, not a runtime dependency of the learning prototype.
  - Bundle analyzer and Lighthouse/Web Vitals workflows.
- Official references:
  - [React Hook Form](https://react-hook-form.com/).
  - [Zod](https://zod.dev/).
  - [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/installation).
  - [Vitest](https://vitest.dev/guide/).
  - [Playwright](https://playwright.dev/docs/intro).
  - [MSW](https://mswjs.io/docs/).
  - [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Source and ambiguity rules

- For every framework lesson:
  - Link official docs.
  - Record current version/date.
  - State when behavior is version-sensitive.
  - Add a “do not confuse with” note for common near-misses.
- For every recommendation:
  - State the default.
  - State why.
  - State trade-offs.
  - State when not to apply it.
- For conflicts:
  - Show both claims.
  - Identify the version/context that changes the answer.
  - Prefer current primary docs.
  - Mark unresolved questions instead of merging them into false certainty.
