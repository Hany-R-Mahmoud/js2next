---
schemaVersion: '1.0'
id: R-03
slug: setting-up-a-react-project
trackId: react
moduleId: R-M01
order: 3
title: Setting Up a React Project
required: true
optional: false
advanced: false
contentType: core
difficulty: 1
estimatedMinutes: 15
requiredPrerequisiteTopicIds:
- R-02
recommendedPrerequisiteTopicIds: []
version: 1
status: draft
reviewStatus: pending-human-review
publicationStatus: unpublished
updatedAt: '2026-07-17'
---

# Setting Up a React Project

> **Why this matters:** Learners frequently use setting up a react project without a clear model of why it behaves as it does; this lesson makes that model explicit. It belongs to the **React Orientation** module.

## Learning objectives

- [R-03-LO1] Explain project setup options using a new example and justify the result.
- [R-03-LO2] Explain development environment choices using a new example and justify the result.

## Mental model

Draw a decision map: **Project setup options** → **Development environment choices**. Add branches where the learner must choose an alternative and label the evidence for the choice.

## Project setup options

A React project may use a client build tool or a full-stack framework. The choice affects routing, data loading, server rendering, deployment, and conventions.

_Knowledge check: `R-03-Q01`_

## Development environment choices

Choose an environment that supports the required runtime, testing, linting, formatting, and deployment workflow. Prefer documented conventions the team can maintain.

_Knowledge check: `R-03-Q02`_

## Worked example

```bash
npm create vite@latest js2next-lab -- --template react-ts
cd js2next-lab
npm install
npm run dev
```

A focused client build tool suits a learning app; a full-stack product may use a framework.

## Common mistakes

- Mutating props or state instead of producing the next value.
- Adding state or an Effect for a value that can be derived during render.
- Using global state before identifying the real owner and consumers.
- Optimizing renders without a measured user-facing problem.

## Summary

- Setting Up a React Project connects Project setup options, Development environment choices.
- Use the topic to make behavior and decisions explicit rather than memorizing isolated syntax.
- Verify understanding by explaining a new example and answering the topic quiz without looking back.

## Assessment

- In-lesson checks: R-03-Q01, R-03-Q02, R-03-Q03
- Topic quiz: `R-03-QUIZ`
- Mastery target: 80%
- Attempts: unlimited

### R-03-Q01

Which statement best explains “Project setup options” in the context of Setting Up a React Project?

1. Use children for the primary nested region and named element props when multiple distinct content regions need clear contracts.
2. A React project may use a client build tool or a full-stack framework. The choice affects routing, data loading, server rendering, deployment, and conventions.
3. During render, React calls components to calculate the next UI. Render must remain pure because React may repeat, pause, or discard the work.
4. Split where a region has a coherent responsibility, repeated pattern, independent state, or meaningful data boundary.

**Correct answer:** A React project may use a client build tool or a full-stack framework. The choice affects routing, data loading, server rendering, deployment, and conventions.

**Explanation:** Project setup options is best understood as follows: A React project may use a client build tool or a full-stack framework. The choice affects routing, data loading, server rendering, deployment, and conventions.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-03-Q02

Which statement best explains “Development environment choices” in the context of Setting Up a React Project?

1. Choose an environment that supports the required runtime, testing, linting, formatting, and deployment workflow. Prefer documented conventions the team can maintain.
2. Use children for the primary nested region and named element props when multiple distinct content regions need clear contracts.
3. Split where a region has a coherent responsibility, repeated pattern, independent state, or meaningful data boundary.
4. During render, React calls components to calculate the next UI. Render must remain pure because React may repeat, pause, or discard the work.

**Correct answer:** Choose an environment that supports the required runtime, testing, linting, formatting, and deployment workflow. Prefer documented conventions the team can maintain.

**Explanation:** Development environment choices is best understood as follows: Choose an environment that supports the required runtime, testing, linting, formatting, and deployment workflow. Prefer documented conventions the team can maintain.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-03-Q03

Which statement best explains “Project setup options” in the context of Setting Up a React Project?

1. Use children for the primary nested region and named element props when multiple distinct content regions need clear contracts.
2. A React project may use a client build tool or a full-stack framework. The choice affects routing, data loading, server rendering, deployment, and conventions.
3. Split where a region has a coherent responsibility, repeated pattern, independent state, or meaningful data boundary.
4. During render, React calls components to calculate the next UI. Render must remain pure because React may repeat, pause, or discard the work.

**Correct answer:** A React project may use a client build tool or a full-stack framework. The choice affects routing, data loading, server rendering, deployment, and conventions.

**Explanation:** Project setup options is best understood as follows: A React project may use a client build tool or a full-stack framework. The choice affects routing, data loading, server rendering, deployment, and conventions.

**Hint:** Focus on what the concept changes, enables, or constrains—not only on its syntax.

### R-03-Q04

A learner must use Setting Up a React Project in a new situation. Which approach best demonstrates transferable understanding?

1. Treat the concept as isolated trivia and avoid connecting it to earlier prerequisites.
2. Apply Project setup options deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.
3. Skip the underlying model and rely on memorized syntax, even when the result is unclear.
4. Add more state and abstraction immediately, before identifying the smallest requirement.

**Correct answer:** Apply Project setup options deliberately, make the relevant inputs and assumptions explicit, and verify the observable result before adding more complexity.

**Explanation:** Transfer comes from using the concept with explicit assumptions and checking the resulting behavior, not from reproducing a memorized example.

**Hint:** Choose the option that would still work when the surrounding example changes.

### R-03-Q05

What is the most accurate explanation of the following Setting Up a React Project example?

```bash
npm create vite@latest js2next-lab -- --template react-ts
cd js2next-lab
npm install
npm run dev
```

1. A focused client build tool suits a learning app; a full-stack product may use a framework.
2. The snippet guarantees that all values are immutable and all operations are asynchronous.
3. The snippet removes the need to understand the data flowing through the program.
4. The snippet is valid only because JavaScript ignores variable scope and evaluation order.

**Correct answer:** A focused client build tool suits a learning app; a full-stack product may use a framework.

**Explanation:** The correct choice connects the example to the underlying model rather than treating the syntax as isolated trivia.

**Hint:** Trace data, control flow, ownership, or rendering step by step.

### R-03-Q06

Which response best addresses this common mistake: “Mutating props or state instead of producing the next value.”?

1. The statement is always correct, so no further reasoning about Setting Up a React Project is needed.
2. The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.
3. The statement is unrelated to program behavior and cannot cause defects.
4. The statement is correct only when variable names are short.

**Correct answer:** The statement is a misconception. A better approach is to reason from the concept's inputs, rules, and observable outcome, then verify the result.

**Explanation:** Good feedback names the misconception and replaces it with a usable reasoning process.

**Hint:** Look for the option that corrects both the belief and the learner's next action.

### R-03-Q07

Which sequence is most reliable when solving a problem involving Setting Up a React Project?

1. First identify the requirement, then apply the relevant rule from Project setup options, inspect the result, and only then refactor or optimize.
2. Optimize first, then decide what the code is supposed to do.
3. Copy an unrelated implementation, hide the assumptions, and test only the happy path.
4. Start with a framework abstraction and avoid checking the underlying language behavior.

**Correct answer:** First identify the requirement, then apply the relevant rule from Project setup options, inspect the result, and only then refactor or optimize.

**Explanation:** The reliable sequence starts from the requirement, applies a known rule, observes behavior, and improves the solution afterward.

**Hint:** Prefer a sequence that makes failures visible early.

### R-03-Q08

Which guideline shows the best judgment about when to use Setting Up a React Project?

1. Avoid Setting Up a React Project completely because all abstractions reduce maintainability.
2. Use Setting Up a React Project in every file because more abstraction is always better.
3. Choose based only on line count, without considering readability, correctness, or future change.
4. Use Setting Up a React Project when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Correct answer:** Use Setting Up a React Project when it makes intent, ownership, or data flow clearer; avoid adding it mechanically when a simpler, equally explicit solution is sufficient.

**Explanation:** Engineering judgment balances clarity and cost. The concept should serve the requirement rather than become an end in itself.

**Hint:** Choose the option that acknowledges both benefits and trade-offs.

## Research and verification sources

- Setting Up a New React Project: The Options — Coverage research only; no transcript wording is canonical.
- Setting Up a Project With Create-React-App — Optional coverage reference; learner-facing wording must be original.
- Creating Our First App With Vite: "WorldWise" — Optional coverage reference; learner-facing wording must be original.
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
