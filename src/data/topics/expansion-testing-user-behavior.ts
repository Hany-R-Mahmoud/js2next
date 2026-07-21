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
      "Choose a unit, component, integration, or end-to-end boundary from the risk being tested",
      "Interact through accessible roles, names, labels, and visible text",
      "Test asynchronous pending, success, rejection, and retry behavior",
      "Keep assertions focused on public outcomes so safe refactors do not break the test"
    ],
    "whyMatters": "A useful test explains which user-visible promise would fail. By exercising the public interface and choosing the smallest boundary that observes the risk, the suite catches meaningful regressions without depending on private state or component structure.",
    "estimatedMinutes": 38,
    "sections": [
      {
        "id": "expansion-testing-user-behavior-model",
        "type": "concept",
        "title": "Test the contract",
        "content": "Start with the promise at risk. A pure validation function can be checked directly with a fast unit test. A component test can render a form, perform the same action a user performs, and observe pending, error, or success UI. An end-to-end test is useful when the risk crosses the real browser, route, server, session, or deployment boundary.\n\nChoose the smallest boundary that can observe the promise, then add a higher layer only when integration itself is the risk. Query the interface through roles, accessible names, labels, and visible content. These queries both resemble use and reveal missing accessible contracts."
      },
      {
        "id": "expansion-testing-user-behavior-code",
        "type": "code-example",
        "title": "Query like a user",
        "content": "The test finds the control through its accessible role and name, performs a real user-style click, and awaits the visible status. A rejection test can use the same public flow and assert an actionable error plus retry.",
        "code": "const user = userEvent.setup();\nrender(<SaveForm save={async () => ({ ok: true })} />);\n\nawait user.click(screen.getByRole('button', { name: 'Save project' }));\nexpect(await screen.findByRole('status')).toHaveTextContent('Project saved');",
        "codeLanguage": "tsx",
        "codeFilePath": "app/projects/SaveForm.test.tsx"
      },
      {
        "id": "expansion-testing-user-behavior-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-testing-user-behavior-check",
            "question": "Which component test best protects the accessible save behavior?",
            "options": [
              "Click the Save project button by role and name, then await the visible success or error status",
              "Read a private isSaved state variable",
              "Assert that an internal helper named saveInternal was called",
              "Require the entire markup snapshot to keep the same line count"
            ],
            "correctAnswer": "Click the Save project button by role and name, then await the visible success or error status",
            "expectedReasoning": "The first option tests the public action and result, including the accessible contract. State variables, helper names, and snapshot line counts may change while behavior remains correct, so they make the test brittle without protecting the user promise."
          }
        ]
      },
      {
        "id": "expansion-testing-user-behavior-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Write the user promise first, choose the smallest boundary that observes its risk, interact through the public interface, and assert the meaningful result. Keep a focused set of end-to-end tests for critical cross-boundary journeys, and make asynchronous failure and recovery as testable as success."
      }
    ],
    "retrievalPrompt": "For a save form, assign validation, rendered pending/error/success behavior, and the deployed critical journey to the smallest reliable test boundaries.",
    "reflectionPrompt": "Choose a test that breaks during harmless refactors. Which private detail can be replaced with an observable user action or outcome?",
    "masteryCriteria": [
      "Can select a test boundary by product risk and integration surface",
      "Can prefer role, accessible name, label, or visible text queries",
      "Can wait for asynchronous outcomes without arbitrary sleeps",
      "Can test failure and retry while avoiding private state, helper names, and oversized snapshots"
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
        "concept": "Different risks need different observation boundaries; more browser coverage is not automatically more useful.",
        "prediction": {
          "prompt": "An email-normalization function has no UI or network dependency. Which boundary gives the clearest failure?",
          "options": [
            "A focused unit test",
            "Only a deployed end-to-end browser journey",
            "A full-page snapshot"
          ],
          "correctAnswer": "A focused unit test",
          "feedbackCorrect": "The pure input/output rule can be observed directly, quickly, and precisely.",
          "feedbackWrong": "A wider or snapshot boundary adds unrelated setup without improving evidence for this pure rule."
        },
        "synthesis": "Match test scope to the smallest boundary that can fail the contract."
      }
    ],
    "miniProject": {
      "title": "Build a tested save flow",
      "scenario": "Design tests for an account form with pure validation, an accessible pending state, server rejection, success, and one critical deployed journey.",
      "acceptance": [
        "Pure normalization and validation have focused input/output tests",
        "The component test uses role/name or label queries and awaits visible state transitions",
        "Server rejection preserves useful input and exposes an actionable retry path",
        "One end-to-end journey covers the highest-risk browser-to-server integration"
      ],
      "rubric": [
        {
          "dimension": "Contract",
          "evidence": "Every assertion protects an outcome a user or assistive technology can perceive."
        },
        {
          "dimension": "Boundary",
          "evidence": "Unit, component, and end-to-end responsibilities do not duplicate without a stated risk."
        },
        {
          "dimension": "Recovery",
          "evidence": "Pending, rejection, correction, retry, and success are observable."
        }
      ]
    },
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://testing-library.com/docs/react-testing-library/intro/",
        "https://testing-library.com/docs/queries/about/",
        "https://playwright.dev/docs/intro",
        "https://playwright.dev/docs/best-practices"
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-design-test-boundary",
      "title": "Design a Test Boundary for a Save Flow",
      "level": 6,
      "topicFamily": "app-quality",
      "scenario": "A project form validates a name, shows pending feedback, can receive a server field error, and announces success. Existing tests inspect state and a large snapshot, yet they miss that the submit control has no accessible name.",
      "constraints": [
        "Test pure rules separately from rendered interaction",
        "Use queries that reflect accessible user behavior",
        "Cover pending, server rejection, correction, retry, and success",
        "Reserve end-to-end coverage for a named cross-boundary risk"
      ],
      "acceptanceCriteria": [
        "A unit test owns pure name validation and normalization",
        "A component test finds the control by role and accessible name",
        "Async assertions wait for meaningful pending, error, and success UI",
        "Tests do not read private state or require internal helper names",
        "One critical browser-to-server journey and its reason are documented"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write the visible sequence: enter name, submit, pending, rejection or success, correct, retry."
        },
        {
          "stage": 2,
          "text": "Use getByRole or getByLabelText for immediate UI and findByRole for an async result."
        },
        {
          "stage": 3,
          "text": "Move pure validation cases to a focused unit test; keep one deployed journey for the real integration risk."
        }
      ],
      "expectedReasoning": "The suite should protect the public behavior at the smallest useful boundaries. Accessible queries expose the missing name, asynchronous assertions cover real state changes, and one end-to-end journey verifies the integration that a component test cannot.",
      "commonWrongPaths": [
        "Reading a private state variable as the primary assertion",
        "Using a snapshot as the only behavior evidence",
        "Testing only success and ignoring a recoverable server rejection",
        "Using a test id when a stable role and name already describe the control"
      ],
      "answerExplanation": "Unit-test the pure rule, component-test the public form flow with accessible queries and async outcomes, and keep a focused end-to-end test for the critical deployed boundary.",
      "followUpVariation": "The status message is announced but visually unchanged. Add an assertion that protects its accessible role without coupling to its wrapper markup.",
      "checkType": "free-text",
      "prompt": "Describe the unit, component, and end-to-end responsibilities, plus the public queries and async assertions.",
      "freeTextKeywords": [
        "role",
        "label",
        "behavior",
        "error",
        "end-to-end"
      ],
      "sourceLink": "https://testing-library.com/docs/queries/about/",
      "sourceLinks": [
        "https://testing-library.com/docs/queries/about/",
        "https://testing-library.com/docs/react-testing-library/intro/",
        "https://playwright.dev/docs/intro",
        "https://playwright.dev/docs/best-practices"
      ]
    }
  ],
  "qa": [
    {
      "id": "qa-6",
      "question": "How do I test React components properly?",
      "answer": "Start from risk. Test pure reducers, parsers, and validation as focused functions. Render components when the contract is interaction and visible state; use accessible queries, user-style actions, and async assertions. Use a smaller set of end-to-end tests for critical journeys whose risk crosses the real browser, routing, server, session, or deployment boundary.",
      "followUp": "Which provider behavior must be real for this test, and which dependency can be supplied through a small test wrapper?",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "testing",
        "vitest",
        "react-testing-library"
      ],
      "topicId": "expansion-testing-user-behavior",
      "topicFamily": "app-quality",
      "sourceLink": "https://testing-library.com/docs/react-testing-library/intro/",
      "sourceLinks": [
        "https://testing-library.com/docs/react-testing-library/intro/",
        "https://playwright.dev/docs/best-practices"
      ]
    },
    {
      "id": "learn-react-qa-extra-2",
      "category": "testing",
      "level": "intermediate",
      "question": "What should I test in a React component?",
      "answer": "Test what a user can do and perceive: accessible controls, rendered data, pending feedback, errors, recovery, and success. Avoid private state, method names, and DOM structure unless that structure is itself the public accessibility contract.",
      "followUp": "What visible outcome would remain stable if the component changed from local state to a reducer?",
      "tags": [
        "learn-react-bridge",
        "testing"
      ],
      "sourceLink": "https://testing-library.com/docs/react-testing-library/intro/",
      "topicId": "expansion-testing-user-behavior",
      "topicFamily": "app-quality",
      "sourceLinks": [
        "https://testing-library.com/docs/react-testing-library/intro/"
      ]
    },
    {
      "id": "expansion-qa-testing-query",
      "topicId": "expansion-testing-user-behavior",
      "topicFamily": "app-quality",
      "question": "Why prefer role and label queries in component tests?",
      "answer": "Role, accessible-name, and label queries resemble how users and assistive technology find controls. They protect a meaningful public contract and can expose accessibility regressions. A test id is a useful fallback when no semantic or visible query fits the element.",
      "followUp": "Which current test id can be replaced by a role and accessible name?",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "expansion-testing-user-behavior",
        "testing-library",
        "accessibility"
      ],
      "sourceLink": "https://testing-library.com/docs/queries/about/",
      "sourceLinks": [
        "https://testing-library.com/docs/queries/about/"
      ]
    },
    {
      "id": "expansion-qa-testing-layers",
      "topicId": "expansion-testing-user-behavior",
      "topicFamily": "app-quality",
      "question": "How should unit, component, and end-to-end tests divide responsibility?",
      "answer": "Use unit tests for pure input/output rules, component tests for rendered interaction and state transitions, and end-to-end tests for selected critical journeys across real application boundaries. Add a layer because of a distinct risk, not to repeat the same assertion everywhere.",
      "followUp": "Which server-rejection behavior can a component test cover, and which deployed integration still needs end-to-end evidence?",
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
        "https://testing-library.com/docs/react-testing-library/intro/",
        "https://playwright.dev/docs/intro",
        "https://playwright.dev/docs/best-practices"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-test-visible-behavior",
      "topicId": "expansion-testing-user-behavior",
      "topicFamily": "app-quality",
      "title": "Test Observable Behavior",
      "summary": "Interact through the public interface and assert the accessible, visible result instead of private component state.",
      "rationale": "Behavior-focused tests survive internal refactors and can catch broken labels, controls, pending feedback, failures, retry, and success that users experience.",
      "tradeOffs": "A public test may need realistic providers and asynchronous setup. Keep that setup at the smallest boundary that observes the risk rather than replacing it with private shortcuts.",
      "appliesWhen": "Testing a rendered component or a user journey whose contract is interaction and observable UI.",
      "doesNotApplyWhen": "The target is a pure rule with no rendered contract; verify its input and output directly.",
      "example": "Enter a project name by label, click Save project by role and name, await a status or alert, correct a field error, and retry without inspecting isSaving state.",
      "sourceLink": "https://testing-library.com/docs/react-testing-library/intro/",
      "sourceLinks": [
        "https://testing-library.com/docs/react-testing-library/intro/",
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
