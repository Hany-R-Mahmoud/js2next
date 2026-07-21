import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "deep-dive-app-quality",
  "lesson": {
    "slug": "deep-dive-app-quality",
    "title": "Deep Dive: Forms, Accessibility, Errors & Testing",
    "topicFamily": "app-quality",
    "level": "intermediate",
    "prerequisites": [
      "deep-dive-state-and-effects"
    ],
    "learningObjectives": [
      "Build form controls from native semantics, labels, instructions, and connected errors",
      "Model pending, success, empty, validation, and unexpected failure states",
      "Test observable behavior through roles, names, focus, and user actions",
      "Combine automated checks with keyboard, screen-reader, and production evidence"
    ],
    "whyMatters": "A feature must remain understandable when someone uses a keyboard, a screen reader, a slow connection, invalid input, or a failing service. Clear semantics, recovery states, and behavior-focused tests make the same interaction easier for users and safer to change.",
    "estimatedMinutes": 44,
    "sections": [
      {
        "id": "deep-dive-app-quality-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "Start with the browser’s built-in contract. Use a native `button`, `input`, `select`, or link when it matches the interaction, and give every form control a programmatic label. Add instructions and errors as visible text, then connect them to the control when that relationship is not already clear. Preserve visible focus and a logical keyboard order.\n\nTreat loading and failure as normal states to design. A user should know what is happening, whether their action succeeded, what went wrong in language they can act on, and how to try again without losing useful work."
      },
      {
        "id": "deep-dive-app-quality-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "Prefer semantic HTML because it supplies roles, keyboard behavior, and platform accessibility mappings. ARIA can describe relationships or implement a widget without a native equivalent, but it does not add behavior automatically. For a field error, keep a visible message, set `aria-invalid` when invalid, and reference the message with `aria-describedby` when appropriate. Use `aria-live` carefully for status changes that need announcement without moving focus.\n\nIn tests, find controls by role and accessible name when possible, perform user-level actions, and assert the result a user can observe. Add focused unit tests for pure rules and integration or browser tests for boundaries and critical flows. Automated accessibility scans catch some rule violations, but keyboard, screen-reader, zoom, contrast, content, and real-device review still matter."
      },
      {
        "id": "deep-dive-app-quality-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "A clickable `div` does not automatically behave like a button. A placeholder disappears and is not a dependable label. An error at the top of a page may be missed if it is not related to the field. A spinner without status or recovery leaves the user unsure whether the action is still working.\n\nTests that inspect component state or private function calls can pass while the interaction is broken. Roles, names, focus, and visible outcomes exercise the public contract. They are strongest when combined with tests at the server boundary and a small number of production signals for failures that a local environment cannot reproduce."
      },
      {
        "id": "deep-dive-app-quality-example",
        "type": "code-example",
        "title": "Accessible field",
        "content": "The visible label names the field. The error is connected to the input, and `aria-invalid` communicates its current validation state. The submit button remains a native control.",
        "code": "<form onSubmit={handleSubmit}>\n  <label htmlFor=\"email\">Email address</label>\n  <input\n    id=\"email\"\n    name=\"email\"\n    type=\"email\"\n    value={email}\n    onChange={event => setEmail(event.target.value)}\n    aria-invalid={Boolean(error)}\n    aria-describedby={error ? 'email-error' : undefined}\n  />\n  {error && <p id=\"email-error\">{error}</p>}\n  <button type=\"submit\" disabled={status === 'pending'}>\n    {status === 'pending' ? 'Sending…' : 'Send'}\n  </button>\n  <p aria-live=\"polite\">{statusMessage}</p>\n</form>",
        "codeLanguage": "tsx",
        "codeFilePath": "ContactForm.tsx"
      },
      {
        "id": "deep-dive-app-quality-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-app-quality-question",
            "question": "Which is the strongest default for a text field that can show a validation error?",
            "options": [
              "A native input with a visible associated label and a connected visible error",
              "A clickable div with keyboard behavior added later",
              "An input whose placeholder is its only name",
              "An unlabeled input followed by an error color with no text"
            ],
            "correctAnswer": "A native input with a visible associated label and a connected visible error",
            "expectedReasoning": "The native input provides platform behavior, the label gives it a persistent accessible name, and the connected text explains recovery. A custom div must recreate control behavior. A placeholder is not a stable label. Color alone neither names the field nor explains the error and excludes users who cannot perceive that color difference."
          }
        ]
      },
      {
        "id": "deep-dive-app-quality-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Build the interaction from native semantics and clear names. Make instructions, progress, errors, success, focus, and retry behavior observable. Test the public contract with realistic actions, roles, and outcomes; test trustworthy rules at the server boundary; and combine automation with human accessibility review and production evidence."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-app-quality-prediction",
        "title": "Predict the boundary",
        "concept": "Semantic controls and accessible names create the interaction contract that both users and tests can follow.",
        "prediction": {
          "prompt": "A test needs to submit a form. Which query best reflects how a user identifies the control?",
          "options": [
            "`getByRole(\"button\", { name: \"Send\" })`",
            "A component instance lookup",
            "A private CSS class used only by the implementation"
          ],
          "correctAnswer": "`getByRole(\"button\", { name: \"Send\" })`",
          "feedbackCorrect": "Role and accessible name exercise the same public semantics a user relies on.",
          "feedbackWrong": "Implementation details can change without changing the interaction. Prefer the control’s role and accessible name."
        },
        "synthesis": "A testable accessible contract begins with the right element and name."
      },
      {
        "id": "deep-dive-app-quality-failure-mode",
        "title": "Name the failure mode",
        "concept": "Quality includes the complete state and recovery path, not only the successful render.",
        "prediction": {
          "prompt": "A request fails after submit. Which result gives the learner the clearest recovery path?",
          "options": [
            "Keep useful input, show a specific error, and provide retry or correction",
            "Clear the form and log the error only in the console",
            "Leave the pending spinner running indefinitely"
          ],
          "correctAnswer": "Keep useful input, show a specific error, and provide retry or correction",
          "feedbackCorrect": "The user can understand the state and recover without reconstructing their work.",
          "feedbackWrong": "Quality failures must be observable and recoverable in the interface, not hidden or left pending forever."
        },
        "synthesis": "For each failure, name what the user perceives and what action moves the flow forward."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Forms, Accessibility, Errors & Testing",
      "scenario": "Build and verify a contact form with client guidance, server validation, async submission states, accessible errors, and a recovery path.",
      "acceptance": [
        "Every field has a visible programmatic label and useful instructions",
        "Invalid fields expose connected text errors without relying on color alone",
        "Pending, success, server validation failure, and unexpected failure are distinguishable",
        "Tests use user actions, roles, names, focus, and visible outcomes",
        "A keyboard review and an automated accessibility scan are recorded as separate evidence"
      ],
      "rubric": [
        {
          "dimension": "Model",
          "evidence": "The implementation demonstrates: Build accessible form flows."
        },
        {
          "dimension": "Boundary",
          "evidence": "The explanation identifies the ownership or lifecycle boundary for forms, accessibility, errors & testing."
        },
        {
          "dimension": "Verification",
          "evidence": "A failure state and an observable test are included."
        }
      ]
    },
    "diagram": {
      "title": "Model → boundary → observable outcome",
      "kind": "flow",
      "nodes": [
        {
          "id": "model",
          "label": "Core model",
          "role": "Forms, Accessibility, Errors & Testing"
        },
        {
          "id": "boundary",
          "label": "Explicit boundary",
          "role": "Where ownership and policy live"
        },
        {
          "id": "outcome",
          "label": "Observable outcome",
          "role": "What a learner or user can verify"
        }
      ],
      "edges": [
        {
          "from": "model",
          "to": "boundary",
          "label": "guides the decision"
        },
        {
          "from": "boundary",
          "to": "outcome",
          "label": "makes behavior testable"
        }
      ]
    },
    "retrievalPrompt": "Design one form field and submission flow. Name its accessible control, label, instructions, error relationship, pending state, recovery action, and observable tests.",
    "reflectionPrompt": "Choose one critical flow. Complete it with only a keyboard, trigger every failure state, and list which behavior is covered by automation and which still needs human review.",
    "masteryCriteria": [
      "Uses native interactive elements and programmatic labels before adding ARIA",
      "Connects instructions and validation messages to the relevant control",
      "Keeps pending and error feedback perceivable and provides a recovery path",
      "Tests through accessible roles, names, and outcomes rather than implementation details",
      "Can explain why automated checks do not prove complete accessibility or production quality"
    ],
    "nextTopics": [
      "deep-dive-nextjs-foundations"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://www.w3.org/TR/WCAG22/",
        "https://www.w3.org/WAI/tutorials/forms/",
        "https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/",
        "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
        "https://testing-library.com/docs/guiding-principles",
        "https://testing-library.com/docs/queries/about/#priority",
        "https://www.w3.org/WAI/test-evaluate/",
        "https://www.w3.org/WAI/ARIA/apg/"
      ]
    }
  },
  "challenges": [
    {
      "slug": "loop-deep-dive-app-quality",
      "title": "Apply Deep Dive: Forms, Accessibility, Errors & Testing",
      "level": 2,
      "topicFamily": "app-quality",
      "scenario": "Improve a newsletter form that uses placeholder-only fields, a clickable `div` to submit, a spinner with no status text, and tests that inspect component state.",
      "constraints": [
        "Use native form controls and persistent visible labels",
        "Preserve useful input through validation and unexpected failures",
        "Test the flow through accessible names, user actions, and visible results"
      ],
      "acceptanceCriteria": [
        "Keyboard users can reach, understand, submit, and retry the form",
        "Field errors are visible, connected to their controls, and do not rely on color alone",
        "Pending, success, validation failure, and unexpected failure have clear messages",
        "Tests cover a successful submit and at least two recovery paths without reading private component state"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Replace the custom submit element with a real button and give each input a visible label."
        },
        {
          "stage": 2,
          "text": "Write the state table before the tests: pending, success, validation failure, unexpected failure, and retry."
        },
        {
          "stage": 3,
          "text": "Query by role and accessible name, perform the same actions as a user, and assert messages and focus."
        }
      ],
      "expectedReasoning": "Native elements provide a dependable starting contract. Labels and connected errors make the form understandable. Explicit async states keep failures recoverable. Tests that use the public accessibility contract verify behavior without coupling to component internals.",
      "commonWrongPaths": [
        "Adding ARIA roles to a div but forgetting keyboard and form behavior",
        "Clearing all user input when the server reports a correctable error",
        "Treating a clean automated scan as proof that the complete experience is accessible"
      ],
      "answerExplanation": "Repair semantics first, then connect validation and status communication, then test complete user paths. Automated checks are useful evidence, but keyboard and assistive-technology review cover behavior that rules alone cannot prove.",
      "followUpVariation": "The form opens inside a modal. Add a focus-entry, keyboard-dismissal, and focus-restoration test without changing the form’s field contract.",
      "sourceLink": "https://www.w3.org/WAI/tutorials/forms/",
      "sourceLinks": [
        "https://www.w3.org/WAI/tutorials/forms/",
        "https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/",
        "https://testing-library.com/docs/queries/about/#priority"
      ]
    }
  ],
  "qa": [
    {
      "id": "qa-10",
      "question": "What are the accessibility requirements for a React application?",
      "answer": "Begin with semantic HTML, an informative page title and language, visible focus, and a logical keyboard path. Give images appropriate alternative text and form controls programmatic labels. Meet the applicable WCAG 2.2 AA success criteria, including text and non-text contrast, and do not use color as the only signal. For custom widgets, follow the relevant ARIA Authoring Practices pattern and implement its keyboard and focus behavior. Use linting and automated scans to catch some defects, then add keyboard, zoom, screen-reader, content, and real-device checks. Automation is evidence, not proof of full conformance.",
      "followUp": "Which critical flow have you completed with only a keyboard and with a screen reader, including its failure and recovery state?",
      "category": "accessibility",
      "level": "intermediate",
      "tags": [
        "a11y",
        "accessibility",
        "wcag"
      ],
      "sourceLinks": [
        "https://www.w3.org/TR/WCAG22/",
        "https://www.w3.org/WAI/ARIA/apg/",
        "https://www.w3.org/WAI/test-evaluate/"
      ],
      "topicId": "deep-dive-app-quality",
      "topicFamily": "app-quality",
      "sourceLink": "https://www.w3.org/TR/WCAG22/"
    },
    {
      "id": "learn-react-deep-dive-app-quality-question",
      "question": "Why is a native input with a visible associated label the strongest default?",
      "answer": "The input supplies browser and platform behavior, and the label gives it a persistent accessible name that can also focus the control. A custom element must recreate behavior, a placeholder disappears, and an icon or color alone may not communicate the field or its state.",
      "followUp": "If the field is invalid, how will the user find the error and understand how to recover?",
      "category": "accessibility",
      "level": "intermediate",
      "topicId": "deep-dive-app-quality",
      "topicFamily": "app-quality",
      "tags": [
        "learn-react-bridge",
        "app-quality"
      ],
      "sourceLink": "https://www.w3.org/WAI/tutorials/forms/labels/",
      "sourceLinks": [
        "https://www.w3.org/WAI/tutorials/forms/labels/",
        "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby",
        "https://www.w3.org/WAI/ARIA/apg/"
      ]
    },
    {
      "id": "loop-qa-deep-dive-app-quality-1",
      "topicId": "deep-dive-app-quality",
      "topicFamily": "app-quality",
      "question": "What makes a UI test resilient and useful to a learner?",
      "answer": "A resilient test performs realistic actions through the public interface and checks results the user can perceive. Prefer roles and accessible names for controls, then assert visible text, focus, navigation, or other outcomes. Use lower-level queries only when the interface has no suitable semantic query, and avoid testing private component state or exact implementation calls.",
      "followUp": "Which current test would still pass if the control lost its accessible name or the error became invisible?",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-app-quality"
      ],
      "sourceLink": "https://testing-library.com/docs/guiding-principles",
      "sourceLinks": [
        "https://testing-library.com/docs/guiding-principles",
        "https://testing-library.com/docs/queries/about/#priority"
      ]
    }
  ],
  "practices": [
    {
      "id": "bp-10",
      "title": "Use Semantic HTML Before ARIA",
      "summary": "Use the native element that matches the interaction before adding ARIA or recreating the control with a generic element.",
      "rationale": "Native elements bring semantics, keyboard behavior, focus behavior, browser integration, and accessibility mappings. This reduces the custom behavior that the team must implement and verify.",
      "tradeOffs": "Some composite widgets have no complete native equivalent. In that case, follow the appropriate ARIA Authoring Practices pattern and test keyboard, focus, naming, state, and assistive-technology behavior.",
      "appliesWhen": "Building buttons, links, headings, landmarks, inputs, selects, text areas, and other interactions with an appropriate HTML element.",
      "doesNotApplyWhen": "No native element supplies the required widget semantics and interaction; a tested custom pattern is then justified.",
      "example": "Use `<button type=\"button\">Remove</button>` for an action and `<a href=\"/help\">Help</a>` for navigation. A clickable `<div>` supplies neither contract by default.",
      "sourceLink": "https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/",
      "tags": [
        "app-quality",
        "accessibility"
      ],
      "topicId": "deep-dive-app-quality",
      "topicFamily": "app-quality",
      "sourceLinks": [
        "https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/",
        "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button",
        "https://www.w3.org/WAI/ARIA/apg/"
      ]
    }
  ],
  "meta": {
    "topicFamily": "app-quality",
    "level": "intermediate",
    "title": "Deep Dive: Forms, Accessibility, Errors & Testing"
  }
};
