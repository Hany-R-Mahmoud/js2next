import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "expansion-testing-user-behavior",
  "lesson": {
    "slug": "expansion-testing-user-behavior",
    "title": "Test User Behavior at the Right Boundary",
    "topicFamily": "app-quality",
    "level": "intermediate",
    "prerequisites": [
      "components-and-jsx",
      "expansion-typescript-react-boundaries"
    ],
    "learningObjectives": [
      "Choose unit, component, and end-to-end boundaries by risk",
      "Query rendered UI through accessible roles and labels",
      "Test async loading, success, and failure behavior",
      "Keep implementation details out of behavior-focused tests"
    ],
    "whyMatters": "A test suite is useful when it catches regressions users can experience. Testing the visible contract keeps refactors cheap while still protecting critical logic and flows.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "expansion-testing-user-behavior-model",
        "type": "concept",
        "title": "Test the contract",
        "content": "Use unit tests for pure logic, component tests for rendered behavior, and end-to-end tests for critical journeys. Choose the smallest boundary that observes the risk."
      },
      {
        "id": "expansion-testing-user-behavior-code",
        "type": "code-example",
        "title": "Query like a user",
        "content": "Prefer accessible, user-visible queries over component state or private implementation details.",
        "code": "render(<SaveButton />);\nawait user.click(screen.getByRole('button', { name: 'Save' }));\nexpect(screen.getByRole('status')).toHaveTextContent('Saved');",
        "codeLanguage": "tsx",
        "codeFilePath": "Component test"
      },
      {
        "id": "expansion-testing-user-behavior-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-testing-user-behavior-check",
            "question": "Which assertion best protects a user-facing save flow?",
            "options": [
              "The component state variable equals true",
              "The Save button is found by role, clicked, and a visible success status appears",
              "The component calls a private helper named saveInternal",
              "The snapshot has exactly 42 lines"
            ],
            "correctAnswer": "The Save button is found by role, clicked, and a visible success status appears",
            "expectedReasoning": "The behavior and accessible contract are observable. Private state and snapshot size are implementation details that can change without changing the user experience."
          }
        ]
      },
      {
        "id": "expansion-testing-user-behavior-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Map risk to boundary, interact through the public UI, assert observable outcomes, and add a small number of end-to-end journeys where integration risk is highest."
      }
    ],
    "retrievalPrompt": "When should a behavior be covered by a unit test, component test, or end-to-end test?",
    "reflectionPrompt": "Choose one critical flow. Which user-visible state proves success, which failure should be recoverable, and what is the smallest reliable test boundary?",
    "masteryCriteria": [
      "Can choose a test boundary by risk",
      "Can use role/label queries",
      "Can assert async recovery states",
      "Can explain why implementation-detail assertions are brittle"
    ],
    "nextTopics": [
      "deep-dive-app-quality"
    ],
    "diagram": {
      "title": "Test boundary ladder",
      "kind": "layers",
      "nodes": [
        {
          "id": "pure",
          "label": "Pure logic",
          "role": "Fast unit test"
        },
        {
          "id": "ui",
          "label": "Rendered behavior",
          "role": "Component test"
        },
        {
          "id": "journey",
          "label": "Critical journey",
          "role": "End-to-end test"
        }
      ],
      "edges": [
        {
          "from": "pure",
          "to": "ui",
          "label": "compose"
        },
        {
          "from": "ui",
          "to": "journey",
          "label": "integrate"
        }
      ]
    },
    "chunks": [
      {
        "id": "expansion-testing-user-behavior-chunk-1",
        "title": "Choose the boundary",
        "concept": "A validation function and a save form have different observable contracts.",
        "prediction": {
          "prompt": "Which test should own a pure email-validation rule?",
          "options": [
            "A focused unit test",
            "Only a full browser journey"
          ],
          "correctAnswer": "A focused unit test",
          "feedbackCorrect": "Pure logic is cheapest to verify directly.",
          "feedbackWrong": "Use the smallest boundary that observes the behavior."
        },
        "synthesis": "Layer tests by risk and observable contract."
      }
    ],
    "miniProject": {
      "title": "Build a tested save flow",
      "scenario": "Design a form with validation, pending, success, and server-rejection states.",
      "acceptance": [
        "Pure validation has focused tests",
        "The component test uses accessible queries",
        "A critical journey covers the deployed boundary"
      ],
      "rubric": [
        {
          "dimension": "Behavior",
          "evidence": "Tests prove pending, success, and recoverable failure outcomes."
        },
        {
          "dimension": "Accessibility",
          "evidence": "Controls are found by role or label and status is observable."
        },
        {
          "dimension": "Boundary",
          "evidence": "Unit, component, and E2E responsibilities are separated."
        }
      ]
    },
    "metadata": {
      "lastUpdated": "2026-07-15",
      "sources": [
        "https://testing-library.com/docs/react-testing-library/intro/",
        "https://testing-library.com/docs/queries/about/",
        "https://playwright.dev/docs/intro"
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-design-test-boundary",
      "title": "Design a Test Boundary for a Save Flow",
      "level": 6,
      "topicFamily": "app-quality",
      "scenario": "A save flow has validation, a pending state, a server rejection, and a success message. Existing tests inspect component state and a large snapshot but miss an inaccessible submit control.",
      "constraints": [
        "Protect the user-visible contract",
        "Cover pending, success, and recoverable failure",
        "Use accessible queries",
        "Keep unit coverage for pure validation separate from integration coverage"
      ],
      "acceptanceCriteria": [
        "The test interacts through the rendered control",
        "The assertions cover a meaningful success and failure outcome",
        "The test does not require private state or helper names",
        "The plan names one higher-level journey worth testing"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "List the states a user can observe before choosing assertions."
        },
        {
          "stage": 2,
          "text": "Find the control by its role and accessible name."
        },
        {
          "stage": 3,
          "text": "Keep validation logic unit-testable, then test the rendered async flow at the component boundary."
        }
      ],
      "expectedReasoning": "The public behavior is the contract. A focused component test can cover interaction and states, while pure validation and one critical end-to-end journey use separate boundaries.",
      "commonWrongPaths": [
        "Asserting a state variable directly",
        "Using a snapshot as the only regression signal",
        "Testing only success and ignoring server rejection",
        "Using a test id when a role and name are available"
      ],
      "answerExplanation": "Use role/name queries, simulate the user action, wait for pending/success/error UI, test pure validation separately, and reserve E2E coverage for the critical cross-boundary journey.",
      "followUpVariation": "The success message is announced through a status region; add the accessibility assertion without coupling to markup structure.",
      "checkType": "free-text",
      "prompt": "Describe the test layers, queries, and assertions you would use for this save flow.",
      "freeTextKeywords": [
        "role",
        "behavior",
        "pending",
        "error"
      ],
      "sourceLink": "https://testing-library.com/docs/queries/about/",
      "sourceLinks": [
        "https://testing-library.com/docs/react-testing-library/intro/",
        "https://playwright.dev/docs/intro"
      ]
    }
  ],
  "qa": [
    {
      "id": "qa-6",
      "question": "How do I test React components properly?",
      "answer": "Three useful layers: (1) Unit tests for pure logic (reducers, utility functions, validation). (2) Component tests with React Testing Library — test behavior, not implementation. Find elements by role/label/text, fire events, and assert on the resulting DOM. Avoid testing state directly. (3) E2E tests with Playwright for critical user flows. A behavior-first mix often favors integration coverage, with fewer unit and E2E tests, but the right balance depends on risk and architecture. Test what the user sees and does, not what the component stores internally.",
      "followUp": "How do you test a component that uses a context provider?",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "testing",
        "vitest",
        "react-testing-library"
      ],
      "topicId": "expansion-testing-user-behavior",
      "topicFamily": "app-quality",
      "sourceLink": "https://testing-library.com/docs/react-testing-library/intro/"
    },
    {
      "id": "learn-react-qa-extra-2",
      "category": "testing",
      "level": "intermediate",
      "question": "What should I test in a React component?",
      "answer": "Test user-visible behavior: rendered outcomes, interactions, and accessibility roles. Avoid coupling tests to implementation details such as state variable names.",
      "followUp": "How would you test a component that uses a context provider?",
      "tags": [
        "learn-react-bridge",
        "testing"
      ],
      "sourceLink": "https://testing-library.com/docs/react-testing-library/intro/",
      "topicId": "expansion-testing-user-behavior",
      "topicFamily": "app-quality"
    },
    {
      "id": "expansion-qa-testing-query",
      "topicId": "expansion-testing-user-behavior",
      "topicFamily": "app-quality",
      "question": "Why prefer role and label queries in component tests?",
      "answer": "They exercise the accessible, user-facing contract and fail when the UI becomes unusable, while private state and implementation names can change during a safe refactor.",
      "followUp": "When is a test id justified?",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "expansion-testing-user-behavior",
        "testing-library",
        "accessibility"
      ],
      "sourceLink": "https://testing-library.com/docs/queries/about/"
    },
    {
      "id": "expansion-qa-testing-layers",
      "topicId": "expansion-testing-user-behavior",
      "topicFamily": "app-quality",
      "question": "How should unit, component, and end-to-end tests divide responsibility?",
      "answer": "Use unit tests for pure logic, component tests for rendered interaction and state transitions, and end-to-end tests for a small set of critical cross-boundary journeys. Let product risk and integration cost guide the mix.",
      "followUp": "Which layer should cover a server rejection rendered in a form?",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "expansion-testing-user-behavior",
        "testing-layers",
        "vitest",
        "playwright"
      ],
      "sourceLink": "https://testing-library.com/docs/react-testing-library/intro/",
      "sourceLinks": [
        "https://playwright.dev/docs/intro"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-test-visible-behavior",
      "topicId": "expansion-testing-user-behavior",
      "topicFamily": "app-quality",
      "title": "Test Observable Behavior",
      "summary": "Interact through the public UI and assert on what a user can perceive instead of private component state.",
      "rationale": "Behavior-focused tests survive refactors and catch regressions in labels, keyboard access, loading, errors, and success states.",
      "tradeOffs": "A public query can require more setup than reading a state variable. That setup is the contract being protected.",
      "appliesWhen": "Testing a React component or user-facing flow.",
      "doesNotApplyWhen": "The target is pure domain logic with no rendered behavior; test that logic directly.",
      "example": "Click the Save button by role and name, then assert the status region announces success or a recoverable error.",
      "sourceLink": "https://testing-library.com/docs/react-testing-library/intro/",
      "sourceLinks": [
        "https://testing-library.com/docs/queries/about/"
      ],
      "tags": [
        "expansion-testing-user-behavior",
        "testing-library",
        "behavior"
      ]
    }
  ],
  "meta": {
    "topicFamily": "app-quality",
    "level": "intermediate",
    "title": "Test User Behavior at the Right Boundary"
  }
};
