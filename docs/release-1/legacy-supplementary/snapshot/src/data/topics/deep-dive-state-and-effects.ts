import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "deep-dive-state-and-effects",
  "lesson": {
    "slug": "deep-dive-state-and-effects",
    "title": "Deep Dive: State, Effects & Custom Hooks",
    "topicFamily": "state-behavior",
    "level": "intermediate",
    "prerequisites": [
      "deep-dive-react-mental-model"
    ],
    "learningObjectives": [
      "Choose state ownership",
      "Use Effects only for synchronization",
      "Extract repeated behavior into hooks"
    ],
    "whyMatters": "Most React complexity comes from unclear state ownership and Effects that are used for derivation or event handling.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "deep-dive-state-and-effects-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "Keep state at the lowest owner that needs it, derive values during render, and use Effects to synchronize with systems outside React."
      },
      {
        "id": "deep-dive-state-and-effects-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "An Effect runs after commit and re-runs when reactive dependencies change. Cleanup runs before the next setup and on unmount, making it the boundary for subscriptions and request cancellation."
      },
      {
        "id": "deep-dive-state-and-effects-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "An Effect used to derive state adds an extra render and creates synchronization paths that can disagree. A functional updater or a reducer makes transitions explicit instead."
      },
      {
        "id": "deep-dive-state-and-effects-example",
        "type": "code-example",
        "title": "Effect cleanup for a request",
        "content": "Apply the model in a small, reviewable example.",
        "code": "useEffect(() => {\n  const controller = new AbortController();\n  load(query, controller.signal);\n  return () => controller.abort();\n}, [query]);",
        "codeLanguage": "typescript",
        "codeFilePath": "Illustrative snippet"
      },
      {
        "id": "deep-dive-state-and-effects-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-state-and-effects-question",
            "question": "Which value should usually be computed during render rather than stored in state?",
            "options": [
              "A WebSocket connection",
              "A filtered list derived from items and query",
              "A browser subscription",
              "An external widget instance"
            ],
            "correctAnswer": "A filtered list derived from items and query",
            "expectedReasoning": "Filtering is pure derivation. The other cases synchronize with an external system and need lifecycle management."
          }
        ]
      },
      {
        "id": "deep-dive-state-and-effects-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "An Effect runs after commit and re-runs when reactive dependencies change. Cleanup runs before the next setup and on unmount, making it the boundary for subscriptions and request cancellation.\n\nDecision clue: An Effect used to derive state adds an extra render and creates synchronization paths that can disagree. A functional updater or a reducer makes transitions explicit instead."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-state-and-effects-prediction",
        "title": "Predict the boundary",
        "concept": "An Effect runs after commit and re-runs when reactive dependencies change. Cleanup runs before the next setup and on unmount, making it the boundary for subscriptions and request cancellation.",
        "prediction": {
          "prompt": "Which value should usually be computed during render rather than stored in state?",
          "options": [
            "A WebSocket connection",
            "A filtered list derived from items and query",
            "A browser subscription",
            "An external widget instance"
          ],
          "correctAnswer": "A filtered list derived from items and query",
          "feedbackCorrect": "Correct. Your prediction matches the model. Now explain why it stays true under change.",
          "feedbackWrong": "Revisit the model: Filtering is pure derivation. The other cases synchronize with an external system and need lifecycle management."
        },
        "synthesis": "Filtering is pure derivation. The other cases synchronize with an external system and need lifecycle management."
      },
      {
        "id": "deep-dive-state-and-effects-failure-mode",
        "title": "Name the failure mode",
        "concept": "An Effect used to derive state adds an extra render and creates synchronization paths that can disagree. A functional updater or a reducer makes transitions explicit instead.",
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
        "synthesis": "Use this clue in review: An Effect used to derive state adds an extra render and creates synchronization paths that can disagree. A functional updater or a reducer makes transitions explicit instead."
      }
    ],
    "miniProject": {
      "title": "Practice lab: State, Effects & Custom Hooks",
      "scenario": "Apply the lesson to a small feature. Explain the boundary before writing code, then name how you would verify it.",
      "acceptance": [
        "Choose state ownership",
        "Use Effects only for synchronization",
        "Extract repeated behavior into hooks",
        "Name one failure state and one observable test."
      ],
      "rubric": [
        {
          "dimension": "Model",
          "evidence": "The implementation demonstrates: Choose state ownership."
        },
        {
          "dimension": "Boundary",
          "evidence": "The explanation identifies the ownership or lifecycle boundary for state, effects & custom hooks."
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
          "role": "State, Effects & Custom Hooks"
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
    "retrievalPrompt": "Explain the core model of State, Effects & Custom Hooks and name one failure mode it prevents.",
    "reflectionPrompt": "Find one place in a real frontend project where this state, effects & custom hooks decision could be made more explicit.",
    "masteryCriteria": [
      "Choose state ownership",
      "Use Effects only for synchronization",
      "Extract repeated behavior into hooks"
    ],
    "nextTopics": [
      "deep-dive-app-quality"
    ],
    "metadata": {
      "lastUpdated": "2026-07-14",
      "sources": [
        "https://react.dev/learn/you-might-not-need-an-effect",
        "https://react.dev/learn/synchronizing-with-effects"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-eff-4",
      "title": "Deep Challenge: Debug the stale effect",
      "level": 4,
      "topicFamily": "state-behavior",
      "scenario": "A profile page fetches /api/users/:id but shows the previous user after navigation.",
      "constraints": [
        "Explain the root cause",
        "Propose a fix"
      ],
      "acceptanceCriteria": [
        "Mentions a missing dependency or stale closure",
        "Mentions cleanup or abort"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Look at the dependency array."
        },
        {
          "stage": 2,
          "text": "userId is read inside but not listed."
        },
        {
          "stage": 3,
          "text": "Also consider aborting in-flight requests on change."
        }
      ],
      "expectedReasoning": "The empty dependency array captures the initial userId; include userId and clean up or abort the previous request.",
      "commonWrongPaths": [
        "Blaming React keys only"
      ],
      "answerExplanation": "Include userId in the dependency list and abort or ignore an older request when the id changes.",
      "followUpVariation": "How would Server Components change this design?",
      "checkType": "free-text",
      "prompt": "Why can this Effect show stale data, and what is a robust fix?",
      "freeTextKeywords": [
        "userId",
        "depend",
        "stale"
      ],
      "sourceLink": "https://react.dev/learn/you-might-not-need-an-effect"
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-state-and-effects-question",
      "question": "Which value should usually be computed during render rather than stored in state?",
      "answer": "A filtered list derived from items and query",
      "followUp": "Filtering is pure derivation. The other cases synchronize with an external system and need lifecycle management.",
      "category": "react",
      "level": "intermediate",
      "topicId": "deep-dive-state-and-effects",
      "topicFamily": "state-behavior",
      "tags": [
        "learn-react-bridge",
        "state-behavior"
      ],
      "sourceLink": "https://react.dev/learn/you-might-not-need-an-effect"
    },
    {
      "id": "loop-qa-deep-dive-state-and-effects-1",
      "topicId": "deep-dive-state-and-effects",
      "topicFamily": "state-behavior",
      "question": "What problem does Deep Dive: State, Effects & Custom Hooks help you solve?",
      "answer": "Most React complexity comes from unclear state ownership and Effects that are used for derivation or event handling.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-state-and-effects"
      ],
      "sourceLink": "https://react.dev/learn/you-might-not-need-an-effect"
    },
    {
      "id": "loop-qa-deep-dive-state-and-effects-2",
      "topicId": "deep-dive-state-and-effects",
      "topicFamily": "state-behavior",
      "question": "How would you explain the core idea of Deep Dive: State, Effects & Custom Hooks to a teammate?",
      "answer": "Explain the core model of State, Effects & Custom Hooks and name one failure mode it prevents. A strong explanation should connect the model to: Choose state ownership; Use Effects only for synchronization.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-state-and-effects"
      ],
      "sourceLink": "https://react.dev/learn/you-might-not-need-an-effect"
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "state-behavior",
    "level": "intermediate",
    "title": "Deep Dive: State, Effects & Custom Hooks"
  }
};
