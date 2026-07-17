# Assessment Experience Update

## Learner-facing language

- Conceptual profile: label Q04–Q08 as **Topic Review**.
- Workflow profile: label Q04–Q08 as **Developer Scenario Challenge**.
- Hybrid profile: label Q04–Q08 as **Concept + Code Challenge**.
- Coding profile: label Q04–Q08 as **Code Challenge**.

The response control remains single-choice. The challenge label describes the skill being assessed, not a new answer type.

## Required rendering

- Render `question.code` with the existing syntax-highlighted code component.
- Preserve whitespace and horizontal scrolling on small screens.
- Long choices must wrap without truncation.
- Show the question's `assessmentMode` as an optional small badge.
- After submission show the explanation and selected-choice feedback.
- Do not reveal the correct answer before submission.
- No code editor, runner, or fake Run button is required.

## Accessibility

- Code blocks must be keyboard-scrollable.
- Every choice remains a native radio input or equivalent accessible control.
- Feedback must not depend on color alone.
- Focus moves to the result summary after submission and returns predictably on retry.
