import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "deep-dive-architecture-decisions",
  "lesson": {
    "slug": "deep-dive-architecture-decisions",
    "title": "Deep Dive: Architecture & Trade-off Decisions",
    "topicFamily": "architecture",
    "level": "expert",
    "prerequisites": [
      "deep-dive-production-concerns"
    ],
    "learningObjectives": [
      "Choose state ownership deliberately",
      "Separate feature and shared boundaries",
      "Record decisions with trade-offs"
    ],
    "whyMatters": "Architecture is the repeated practice of making boundaries and trade-offs explicit as the product changes.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "deep-dive-architecture-decisions-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "Keep feature state close to the feature, extract shared primitives when duplication hurts, and document why a dependency or boundary exists."
      },
      {
        "id": "deep-dive-architecture-decisions-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "A useful decision names context, constraints, chosen boundary, alternatives, and the cost accepted. Avoid a global store unless the data is truly cross-cutting and independently owned."
      },
      {
        "id": "deep-dive-architecture-decisions-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "Premature global abstractions couple unrelated features and make testing and migration harder. Small local boundaries preserve replaceability until repetition proves a shared seam."
      },
      {
        "id": "deep-dive-architecture-decisions-example",
        "type": "code-example",
        "title": "Decision record shape",
        "content": "Apply the model in a small, reviewable example.",
        "code": "Context: two apps share visual primitives.\nDecision: extract packages/ui, keep domain state local.\nTrade-off: monorepo tooling cost.",
        "codeLanguage": "text",
        "codeFilePath": "Illustrative snippet"
      },
      {
        "id": "deep-dive-architecture-decisions-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-architecture-decisions-question",
            "question": "What is the strongest reason to delay a global store?",
            "options": [
              "Global stores are always slow",
              "It couples components and reduces independent reuse",
              "React forbids them",
              "They cannot persist"
            ],
            "correctAnswer": "It couples components and reduces independent reuse",
            "expectedReasoning": "The main cost is coupling and testability, not an absolute performance rule."
          }
        ]
      },
      {
        "id": "deep-dive-architecture-decisions-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "A useful decision names context, constraints, chosen boundary, alternatives, and the cost accepted. Avoid a global store unless the data is truly cross-cutting and independently owned.\n\nDecision clue: Premature global abstractions couple unrelated features and make testing and migration harder. Small local boundaries preserve replaceability until repetition proves a shared seam."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-architecture-decisions-prediction",
        "title": "Predict the boundary",
        "concept": "A useful decision names context, constraints, chosen boundary, alternatives, and the cost accepted. Avoid a global store unless the data is truly cross-cutting and independently owned.",
        "prediction": {
          "prompt": "What is the strongest reason to delay a global store?",
          "options": [
            "Global stores are always slow",
            "It couples components and reduces independent reuse",
            "React forbids them",
            "They cannot persist"
          ],
          "correctAnswer": "It couples components and reduces independent reuse",
          "feedbackCorrect": "Correct. Your prediction matches the model. Now explain why it stays true under change.",
          "feedbackWrong": "Revisit the model: The main cost is coupling and testability, not an absolute performance rule."
        },
        "synthesis": "The main cost is coupling and testability, not an absolute performance rule."
      },
      {
        "id": "deep-dive-architecture-decisions-failure-mode",
        "title": "Name the failure mode",
        "concept": "Premature global abstractions couple unrelated features and make testing and migration harder. Small local boundaries preserve replaceability until repetition proves a shared seam.",
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
        "synthesis": "Use this clue in review: Premature global abstractions couple unrelated features and make testing and migration harder. Small local boundaries preserve replaceability until repetition proves a shared seam."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Architecture & Trade-off Decisions",
      "scenario": "Apply the lesson to a small feature. Explain the boundary before writing code, then name how you would verify it.",
      "acceptance": [
        "Choose state ownership deliberately",
        "Separate feature and shared boundaries",
        "Record decisions with trade-offs",
        "Name one failure state and one observable test."
      ],
      "rubric": [
        {
          "dimension": "Model",
          "evidence": "The implementation demonstrates: Choose state ownership deliberately."
        },
        {
          "dimension": "Boundary",
          "evidence": "The explanation identifies the ownership or lifecycle boundary for architecture & trade-off decisions."
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
          "role": "Architecture & Trade-off Decisions"
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
    "retrievalPrompt": "Explain the core model of Architecture & Trade-off Decisions and name one failure mode it prevents.",
    "reflectionPrompt": "Find one place in a real frontend project where this architecture & trade-off decisions decision could be made more explicit.",
    "masteryCriteria": [
      "Choose state ownership deliberately",
      "Separate feature and shared boundaries",
      "Record decisions with trade-offs"
    ],
    "nextTopics": [],
    "metadata": {
      "lastUpdated": "2026-07-14",
      "sources": [
        "https://react.dev/learn/sharing-state-between-components"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-arch-5",
      "title": "Deep Challenge: Choose state location",
      "level": 5,
      "topicFamily": "architecture",
      "scenario": "A dashboard date-range filter must be shareable with teammates via a link.",
      "constraints": [
        "Pick one primary location",
        "Justify the trade-off"
      ],
      "acceptanceCriteria": [
        "URL chosen",
        "Trade-off mentioned"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Shareable with teammates means it belongs in the link."
        },
        {
          "stage": 2,
          "text": "sessionStorage alone does not share across users."
        }
      ],
      "expectedReasoning": "The URL is shareable and history-friendly.",
      "commonWrongPaths": [
        "Global module state"
      ],
      "answerExplanation": "Search params make the view shareable and preserve back/forward behavior. Ephemeral hover state can stay in React state.",
      "followUpVariation": "When would server-stored preferences beat the URL?",
      "checkType": "choice",
      "prompt": "What is the best primary home for the date range?",
      "options": [
        "Module-level let variable",
        "URL search params",
        "CSS custom properties only",
        "Only sessionStorage with no URL"
      ],
      "correctIndex": 1,
      "sourceLink": "https://react.dev/learn/sharing-state-between-components"
    },
    {
      "slug": "learn-react-ch-arch-8",
      "title": "Deep Challenge: Defend an architecture under change",
      "level": 8,
      "topicFamily": "architecture",
      "scenario": "You chose feature folders. Leadership wants a shared design-system package and a second Next app for admin.",
      "constraints": [
        "Keep feature velocity",
        "Share UI primitives"
      ],
      "acceptanceCriteria": [
        "Extract primitives",
        "Apps import the package",
        "Avoid a god shared store"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Use packages/ui for primitives."
        },
        {
          "stage": 2,
          "text": "Keep apps/web and apps/admin boundaries."
        },
        {
          "stage": 3,
          "text": "Do not force all business state into one global store."
        }
      ],
      "expectedReasoning": "Use app boundaries plus a shared UI package; keep domain features local.",
      "commonWrongPaths": [
        "One mega Redux store for both apps on day one"
      ],
      "answerExplanation": "Extract presentational primitives while keeping domain features local. The trade-off is monorepo tooling cost.",
      "followUpVariation": "When should a domain package be extracted instead of briefly duplicating code?",
      "checkType": "free-text",
      "prompt": "Outline a structure and one trade-off.",
      "freeTextKeywords": [
        "package",
        "feature",
        "app"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components"
    },
    {
      "slug": "learn-react-ch-capstone-10",
      "title": "Deep Challenge: Capstone: feature design review",
      "level": 10,
      "topicFamily": "architecture",
      "scenario": "Design a Learning Notes feature: create notes, list notes, filter by tag, and share the filter link.",
      "constraints": [
        "Server owns the authoritative list",
        "Filter is shareable",
        "Client code is limited to needed interactivity"
      ],
      "acceptanceCriteria": [
        "Server fetch list",
        "URL filter",
        "Accessible form fields",
        "Mutation and revalidation",
        "Test cases listed"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Use an async server page and searchParams."
        },
        {
          "stage": 2,
          "text": "Use a Server Action for mutation and targeted revalidation."
        },
        {
          "stage": 3,
          "text": "List empty, validation-error, and filter tests."
        }
      ],
      "expectedReasoning": "The design is a vertical slice with clear boundaries and observable tests.",
      "commonWrongPaths": [
        "All-client fetch with hidden secrets"
      ],
      "answerExplanation": "The server page reads notes and URL filters; a client form submits the mutation; the list is revalidated; labels and empty/error states are tested.",
      "followUpVariation": "Add optimistic creation with rollback on failure.",
      "checkType": "free-text",
      "prompt": "Write a short design covering routes, server/client split, state locations, and acceptance tests.",
      "freeTextKeywords": [
        "server",
        "url",
        "revalidat",
        "test",
        "label"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components"
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-architecture-decisions-question",
      "question": "What is the strongest reason to delay a global store?",
      "answer": "It couples components and reduces independent reuse",
      "followUp": "The main cost is coupling and testability, not an absolute performance rule.",
      "category": "architecture",
      "level": "expert",
      "topicId": "deep-dive-architecture-decisions",
      "topicFamily": "architecture",
      "tags": [
        "learn-react-bridge",
        "architecture"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components"
    },
    {
      "id": "loop-qa-deep-dive-architecture-decisions-1",
      "topicId": "deep-dive-architecture-decisions",
      "topicFamily": "architecture",
      "question": "What problem does Deep Dive: Architecture & Trade-off Decisions help you solve?",
      "answer": "Architecture is the repeated practice of making boundaries and trade-offs explicit as the product changes.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "architecture",
      "level": "expert",
      "tags": [
        "topic-loop",
        "deep-dive-architecture-decisions"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components"
    },
    {
      "id": "loop-qa-deep-dive-architecture-decisions-2",
      "topicId": "deep-dive-architecture-decisions",
      "topicFamily": "architecture",
      "question": "How would you explain the core idea of Deep Dive: Architecture & Trade-off Decisions to a teammate?",
      "answer": "Explain the core model of Architecture & Trade-off Decisions and name one failure mode it prevents. A strong explanation should connect the model to: Choose state ownership deliberately; Separate feature and shared boundaries.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "architecture",
      "level": "expert",
      "tags": [
        "topic-loop",
        "deep-dive-architecture-decisions"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components"
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "architecture",
    "level": "expert",
    "title": "Deep Dive: Architecture & Trade-off Decisions"
  }
};
