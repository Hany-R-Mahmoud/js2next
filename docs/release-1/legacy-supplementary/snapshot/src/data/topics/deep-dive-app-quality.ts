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
      "Build accessible form flows",
      "Handle loading and error states",
      "Test observable behavior"
    ],
    "whyMatters": "A feature is not complete when it renders; users need clear states, keyboard access, recovery paths, and confidence that behavior stays correct.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "deep-dive-app-quality-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "Use native controls first, label inputs, expose validation and status changes, and test what a user can see and do."
      },
      {
        "id": "deep-dive-app-quality-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "A robust async UI models idle, pending, success, empty, and error states. Tests should query roles and labels and assert outcomes instead of component internals."
      },
      {
        "id": "deep-dive-app-quality-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "Missing labels and failure states block real users. Testing implementation details makes tests brittle while missing regressions in the actual interaction contract."
      },
      {
        "id": "deep-dive-app-quality-example",
        "type": "code-example",
        "title": "Accessible field",
        "content": "Apply the model in a small, reviewable example.",
        "code": "<label htmlFor=\"email\">Email</label>\n<input id=\"email\" name=\"email\" type=\"email\" required />",
        "codeLanguage": "tsx",
        "codeFilePath": "Illustrative snippet"
      },
      {
        "id": "deep-dive-app-quality-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-app-quality-question",
            "question": "What is the strongest default for a form control?",
            "options": [
              "A clickable div with custom handlers",
              "A native input with a visible label",
              "Placeholder text only",
              "An icon with a tooltip"
            ],
            "correctAnswer": "A native input with a visible label",
            "expectedReasoning": "Native controls provide keyboard, semantics, and validation behavior; a label keeps the relationship explicit."
          }
        ]
      },
      {
        "id": "deep-dive-app-quality-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "A robust async UI models idle, pending, success, empty, and error states. Tests should query roles and labels and assert outcomes instead of component internals.\n\nDecision clue: Missing labels and failure states block real users. Testing implementation details makes tests brittle while missing regressions in the actual interaction contract."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-app-quality-prediction",
        "title": "Predict the boundary",
        "concept": "A robust async UI models idle, pending, success, empty, and error states. Tests should query roles and labels and assert outcomes instead of component internals.",
        "prediction": {
          "prompt": "What is the strongest default for a form control?",
          "options": [
            "A clickable div with custom handlers",
            "A native input with a visible label",
            "Placeholder text only",
            "An icon with a tooltip"
          ],
          "correctAnswer": "A native input with a visible label",
          "feedbackCorrect": "Correct. Your prediction matches the model. Now explain why it stays true under change.",
          "feedbackWrong": "Revisit the model: Native controls provide keyboard, semantics, and validation behavior; a label keeps the relationship explicit."
        },
        "synthesis": "Native controls provide keyboard, semantics, and validation behavior; a label keeps the relationship explicit."
      },
      {
        "id": "deep-dive-app-quality-failure-mode",
        "title": "Name the failure mode",
        "concept": "Missing labels and failure states block real users. Testing implementation details makes tests brittle while missing regressions in the actual interaction contract.",
        "prediction": {
          "prompt": "Which design move best prevents the failure described above?",
          "options": [
            "Make the boundary explicit",
            "Add another duplicated state value",
            "Hide the failure from the user"
          ],
          "correctAnswer": "Make the boundary explicit",
          "feedbackCorrect": "Correct. Explicit boundaries make the cause, ownership, and recovery path inspectable.",
          "feedbackWrong": "Prefer the smallest explicit boundary that owns the behavior and its recovery path."
        },
        "synthesis": "Use this clue in review: Missing labels and failure states block real users. Testing implementation details makes tests brittle while missing regressions in the actual interaction contract."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Forms, Accessibility, Errors & Testing",
      "scenario": "Apply the lesson to a small feature. Explain the boundary before writing code, then name how you would verify it.",
      "acceptance": [
        "Build accessible form flows",
        "Handle loading and error states",
        "Test observable behavior",
        "Name one failure state and one observable test."
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
    "retrievalPrompt": "Explain the core model of Forms, Accessibility, Errors & Testing and name one failure mode it prevents.",
    "reflectionPrompt": "Find one place in a real frontend project where this forms, accessibility, errors & testing decision could be made more explicit.",
    "masteryCriteria": [
      "Build accessible form flows",
      "Handle loading and error states",
      "Test observable behavior"
    ],
    "nextTopics": [
      "deep-dive-nextjs-foundations"
    ],
    "metadata": {
      "lastUpdated": "2026-07-14",
      "sources": [
        "https://www.w3.org/WAI/ARIA/apg/",
        "https://www.w3.org/TR/WCAG22/",
        "https://testing-library.com/docs/react-testing-library/intro/"
      ]
    }
  },
  "challenges": [
    {
      "slug": "loop-deep-dive-app-quality",
      "title": "Apply Deep Dive: Forms, Accessibility, Errors & Testing",
      "level": 2,
      "topicFamily": "app-quality",
      "scenario": "Use the model from Deep Dive: Forms, Accessibility, Errors & Testing in a small project decision, then explain the boundary you chose.",
      "constraints": [
        "State the owner or boundary explicitly",
        "Include one failure or recovery case",
        "Keep the explanation tied to observable behavior"
      ],
      "acceptanceCriteria": [
        "Build accessible form flows",
        "Handle loading and error states",
        "Test observable behavior"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start with the first learning objective: Build accessible form flows."
        },
        {
          "stage": 2,
          "text": "Separate the model, the boundary that owns it, and the evidence a user or test can observe."
        },
        {
          "stage": 3,
          "text": "Use this retrieval prompt: Explain the core model of Forms, Accessibility, Errors & Testing and name one failure mode it prevents."
        }
      ],
      "expectedReasoning": "Build accessible form flows · Handle loading and error states · Test observable behavior",
      "commonWrongPaths": [
        "Adding a second owner without a requirement",
        "Describing success without a failure or recovery state"
      ],
      "answerExplanation": "A good response names the model, its owner, and an observable way to verify it. A feature is not complete when it renders; users need clear states, keyboard access, recovery paths, and confidence that behavior stays correct.",
      "followUpVariation": "Apply the same boundary to a different feature in the project.",
      "sourceLink": "https://www.w3.org/WAI/ARIA/apg/"
    }
  ],
  "qa": [
    {
      "id": "qa-10",
      "question": "What are the accessibility requirements for a React application?",
      "answer": "Minimum bar: (1) Semantic HTML — use button for buttons, nav for navigation, main for main content. (2) All interactive elements are keyboard accessible (Tab, Enter, Escape). (3) Images have meaningful alt text (or alt=\"\" for decorative). (4) Form inputs have associated labels. (5) WCAG AA contrast is at least 4.5:1 for normal text and 3:1 for large text; meaningful non-text controls and graphics have their own 3:1 non-text contrast requirement. (6) Focus is visible and managed (trapped in modals, restored on close). (7) Page has a lang attribute and meaningful title. Use automated checks such as eslint-plugin-jsx-a11y and axe as supplements to keyboard, screen-reader, and manual interaction checks, not as proof of full conformance.",
      "followUp": "How do you test that a modal dialog is truly accessible?",
      "category": "accessibility",
      "level": "intermediate",
      "tags": [
        "a11y",
        "accessibility",
        "wcag"
      ],
      "sourceLinks": [
        "https://www.w3.org/WAI/ARIA/apg/"
      ],
      "topicId": "deep-dive-app-quality",
      "topicFamily": "app-quality",
      "sourceLink": "https://www.w3.org/TR/WCAG22/"
    },
    {
      "id": "learn-react-deep-dive-app-quality-question",
      "question": "What is the strongest default for a form control?",
      "answer": "A native input with a visible label",
      "followUp": "Native controls provide keyboard, semantics, and validation behavior; a label keeps the relationship explicit.",
      "category": "accessibility",
      "level": "intermediate",
      "topicId": "deep-dive-app-quality",
      "topicFamily": "app-quality",
      "tags": [
        "learn-react-bridge",
        "app-quality"
      ],
      "sourceLink": "https://www.w3.org/WAI/ARIA/apg/"
    },
    {
      "id": "loop-qa-deep-dive-app-quality-1",
      "topicId": "deep-dive-app-quality",
      "topicFamily": "app-quality",
      "question": "What problem does Deep Dive: Forms, Accessibility, Errors & Testing help you solve?",
      "answer": "A feature is not complete when it renders; users need clear states, keyboard access, recovery paths, and confidence that behavior stays correct.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-app-quality"
      ],
      "sourceLink": "https://www.w3.org/WAI/ARIA/apg/"
    }
  ],
  "practices": [
    {
      "id": "bp-10",
      "title": "Use Semantic HTML Before ARIA",
      "summary": "Prefer native buttons, links, labels, and form controls before recreating their behavior with ARIA and custom elements.",
      "rationale": "Native controls provide keyboard, role, and browser behavior that custom widgets must otherwise reproduce and test.",
      "tradeOffs": "A design system may still need carefully implemented custom patterns for widgets without a native equivalent.",
      "appliesWhen": "Building interactive controls and form flows.",
      "doesNotApplyWhen": "No native element matches the required widget; follow the relevant APG pattern and test it manually.",
      "example": "Use `<button>` for an action and `<a>` for navigation; do not make a clickable `<div>` by default.",
      "sourceLink": "https://www.w3.org/WAI/ARIA/apg/",
      "tags": [
        "app-quality",
        "accessibility"
      ],
      "topicId": "deep-dive-app-quality",
      "topicFamily": "app-quality"
    }
  ],
  "meta": {
    "topicFamily": "app-quality",
    "level": "intermediate",
    "title": "Deep Dive: Forms, Accessibility, Errors & Testing"
  }
};
