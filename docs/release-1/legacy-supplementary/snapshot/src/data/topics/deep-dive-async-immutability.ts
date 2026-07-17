import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "deep-dive-async-immutability",
  "lesson": {
    "slug": "deep-dive-async-immutability",
    "title": "Deep Dive: Async JavaScript, Immutability & Modules",
    "topicFamily": "foundations",
    "level": "beginner",
    "prerequisites": [],
    "learningObjectives": [
      "Trace promise settlement and microtask order",
      "Update nested data without mutation",
      "Choose clear module boundaries"
    ],
    "whyMatters": "React state updates and data fetching depend on promises, immutable references, and module boundaries.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "deep-dive-async-immutability-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "JavaScript schedules asynchronous work through the event loop. Immutability means creating new values instead of changing existing references, which lets React detect state changes predictably."
      },
      {
        "id": "deep-dive-async-immutability-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "A Promise moves from pending to fulfilled or rejected. async functions return Promises. Shallow copies protect the root object; every nested object that changes needs its own new reference."
      },
      {
        "id": "deep-dive-async-immutability-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "Mutating a nested object while preserving its parent reference can make an update invisible to reference-based comparison and can leave async results out of order."
      },
      {
        "id": "deep-dive-async-immutability-example",
        "type": "code-example",
        "title": "Immutable nested update",
        "content": "Apply the model in a small, reviewable example.",
        "code": "const next = { ...state, user: { ...state.user, age: 31 } };",
        "codeLanguage": "typescript",
        "codeFilePath": "Illustrative snippet"
      },
      {
        "id": "deep-dive-async-immutability-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-async-immutability-question",
            "question": "What does fetch(url) resolve to before json() is called?",
            "options": [
              "Parsed JSON",
              "A Response object",
              "undefined",
              "A rejected Promise"
            ],
            "correctAnswer": "A Response object",
            "expectedReasoning": "fetch resolves to a Response; the body must be read separately with json(), text(), or another body method."
          }
        ]
      },
      {
        "id": "deep-dive-async-immutability-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "A Promise moves from pending to fulfilled or rejected. async functions return Promises. Shallow copies protect the root object; every nested object that changes needs its own new reference.\n\nDecision clue: Mutating a nested object while preserving its parent reference can make an update invisible to reference-based comparison and can leave async results out of order."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-async-immutability-prediction",
        "title": "Predict the boundary",
        "concept": "A Promise moves from pending to fulfilled or rejected. async functions return Promises. Shallow copies protect the root object; every nested object that changes needs its own new reference.",
        "prediction": {
          "prompt": "What does fetch(url) resolve to before json() is called?",
          "options": [
            "Parsed JSON",
            "A Response object",
            "undefined",
            "A rejected Promise"
          ],
          "correctAnswer": "A Response object",
          "feedbackCorrect": "Correct. Your prediction matches the model. Now explain why it stays true under change.",
          "feedbackWrong": "Revisit the model: fetch resolves to a Response; the body must be read separately with json(), text(), or another body method."
        },
        "synthesis": "fetch resolves to a Response; the body must be read separately with json(), text(), or another body method."
      },
      {
        "id": "deep-dive-async-immutability-failure-mode",
        "title": "Name the failure mode",
        "concept": "Mutating a nested object while preserving its parent reference can make an update invisible to reference-based comparison and can leave async results out of order.",
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
        "synthesis": "Use this clue in review: Mutating a nested object while preserving its parent reference can make an update invisible to reference-based comparison and can leave async results out of order."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Async JavaScript, Immutability & Modules",
      "scenario": "Apply the lesson to a small feature. Explain the boundary before writing code, then name how you would verify it.",
      "acceptance": [
        "Trace promise settlement and microtask order",
        "Update nested data without mutation",
        "Choose clear module boundaries",
        "Name one failure state and one observable test."
      ],
      "rubric": [
        {
          "dimension": "Model",
          "evidence": "The implementation demonstrates: Trace promise settlement and microtask order."
        },
        {
          "dimension": "Boundary",
          "evidence": "The explanation identifies the ownership or lifecycle boundary for async javascript, immutability & modules."
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
          "role": "Async JavaScript, Immutability & Modules"
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
    "retrievalPrompt": "Explain the core model of Async JavaScript, Immutability & Modules and name one failure mode it prevents.",
    "reflectionPrompt": "Find one place in a real frontend project where this async javascript, immutability & modules decision could be made more explicit.",
    "masteryCriteria": [
      "Trace promise settlement and microtask order",
      "Update nested data without mutation",
      "Choose clear module boundaries"
    ],
    "nextTopics": [
      "deep-dive-react-mental-model"
    ],
    "metadata": {
      "lastUpdated": "2026-07-14",
      "sources": [
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
        "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide",
        "https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-js-1",
      "title": "Deep Challenge: Trace the microtask order",
      "level": 1,
      "topicFamily": "foundations",
      "scenario": "You are debugging log order in a React data loader's unit test.",
      "constraints": [
        "No running code in your head beyond the event loop model"
      ],
      "acceptanceCriteria": [
        "Correct order selected",
        "Reason mentions microtasks"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Sync code runs to completion first."
        },
        {
          "stage": 2,
          "text": "Promise then callbacks are microtasks."
        },
        {
          "stage": 3,
          "text": "Order: A, C, then B."
        }
      ],
      "expectedReasoning": "Sync logs A and C; the microtask logs B.",
      "commonWrongPaths": [
        "Assuming promises run immediately before the next sync line"
      ],
      "answerExplanation": "The call stack runs A and C. After it clears, the microtask queue runs B.",
      "followUpVariation": "Add setTimeout(() => console.log('D'), 0)—where does D go?",
      "checkType": "choice",
      "prompt": "What is the console order?\n\nconsole.log('A');\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');",
      "options": [
        "A B C",
        "A C B",
        "B A C",
        "C B A"
      ],
      "correctIndex": 1,
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide"
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-async-immutability-question",
      "question": "What does fetch(url) resolve to before json() is called?",
      "answer": "A Response object",
      "followUp": "fetch resolves to a Response; the body must be read separately with json(), text(), or another body method.",
      "category": "debugging",
      "level": "beginner",
      "topicId": "deep-dive-async-immutability",
      "topicFamily": "foundations",
      "tags": [
        "learn-react-bridge",
        "foundations"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch"
    },
    {
      "id": "loop-qa-deep-dive-async-immutability-1",
      "topicId": "deep-dive-async-immutability",
      "topicFamily": "foundations",
      "question": "What problem does Deep Dive: Async JavaScript, Immutability & Modules help you solve?",
      "answer": "React state updates and data fetching depend on promises, immutable references, and module boundaries.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "deep-dive-async-immutability"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function"
    },
    {
      "id": "loop-qa-deep-dive-async-immutability-2",
      "topicId": "deep-dive-async-immutability",
      "topicFamily": "foundations",
      "question": "How would you explain the core idea of Deep Dive: Async JavaScript, Immutability & Modules to a teammate?",
      "answer": "Explain the core model of Async JavaScript, Immutability & Modules and name one failure mode it prevents. A strong explanation should connect the model to: Trace promise settlement and microtask order; Update nested data without mutation.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "deep-dive-async-immutability"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function"
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "foundations",
    "level": "beginner",
    "title": "Deep Dive: Async JavaScript, Immutability & Modules"
  }
};
