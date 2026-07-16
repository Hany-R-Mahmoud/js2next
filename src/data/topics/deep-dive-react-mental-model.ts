import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "deep-dive-react-mental-model",
  "lesson": {
    "slug": "deep-dive-react-mental-model",
    "title": "Deep Dive: React Mental Model",
    "topicFamily": "react-mental-model",
    "level": "beginner",
    "prerequisites": [
      "deep-dive-async-immutability"
    ],
    "learningObjectives": [
      "Keep render pure",
      "Separate props from state",
      "Use stable keys and one-way data flow"
    ],
    "whyMatters": "Props, state, keys, and composition become easier when a component is treated as a function of its inputs.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "deep-dive-react-mental-model-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "A component returns a description of UI. React re-runs it when inputs change, compares the returned tree, and commits the necessary host updates."
      },
      {
        "id": "deep-dive-react-mental-model-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "Render is a pure calculation; commit applies the result. Props flow down, events flow up through callbacks, and keys preserve identity among siblings."
      },
      {
        "id": "deep-dive-react-mental-model-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "Stable identity tells React which list item survived across renders. Derived values should be computed from source state instead of stored as a second value that can drift."
      },
      {
        "id": "deep-dive-react-mental-model-example",
        "type": "code-example",
        "title": "State update with a functional updater",
        "content": "Apply the model in a small, reviewable example.",
        "code": "setCount((current) => current + 1);",
        "codeLanguage": "typescript",
        "codeFilePath": "Illustrative snippet"
      },
      {
        "id": "deep-dive-react-mental-model-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-react-mental-model-question",
            "question": "Where should a network request that loads after mount live?",
            "options": [
              "The component body",
              "An Effect or event handler with explicit cleanup/error handling",
              "A key prop",
              "CSS"
            ],
            "correctAnswer": "An Effect or event handler with explicit cleanup/error handling",
            "expectedReasoning": "Render must stay pure; external synchronization belongs in an Effect or in the event that initiated it."
          }
        ]
      },
      {
        "id": "deep-dive-react-mental-model-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Render is a pure calculation; commit applies the result. Props flow down, events flow up through callbacks, and keys preserve identity among siblings.\n\nDecision clue: Stable identity tells React which list item survived across renders. Derived values should be computed from source state instead of stored as a second value that can drift."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-react-mental-model-prediction",
        "title": "Predict the boundary",
        "concept": "Render is a pure calculation; commit applies the result. Props flow down, events flow up through callbacks, and keys preserve identity among siblings.",
        "prediction": {
          "prompt": "Where should a network request that loads after mount live?",
          "options": [
            "The component body",
            "An Effect or event handler with explicit cleanup/error handling",
            "A key prop",
            "CSS"
          ],
          "correctAnswer": "An Effect or event handler with explicit cleanup/error handling",
          "feedbackCorrect": "Correct. Your prediction matches the model. Now explain why it stays true under change.",
          "feedbackWrong": "Revisit the model: Render must stay pure; external synchronization belongs in an Effect or in the event that initiated it."
        },
        "synthesis": "Render must stay pure; external synchronization belongs in an Effect or in the event that initiated it."
      },
      {
        "id": "deep-dive-react-mental-model-failure-mode",
        "title": "Name the failure mode",
        "concept": "Stable identity tells React which list item survived across renders. Derived values should be computed from source state instead of stored as a second value that can drift.",
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
        "synthesis": "Use this clue in review: Stable identity tells React which list item survived across renders. Derived values should be computed from source state instead of stored as a second value that can drift."
      }
    ],
    "miniProject": {
      "title": "Practice lab: React Mental Model",
      "scenario": "Apply the lesson to a small feature. Explain the boundary before writing code, then name how you would verify it.",
      "acceptance": [
        "Keep render pure",
        "Separate props from state",
        "Use stable keys and one-way data flow",
        "Name one failure state and one observable test."
      ],
      "rubric": [
        {
          "dimension": "Model",
          "evidence": "The implementation demonstrates: Keep render pure."
        },
        {
          "dimension": "Boundary",
          "evidence": "The explanation identifies the ownership or lifecycle boundary for react mental model."
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
          "role": "React Mental Model"
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
    "retrievalPrompt": "Explain the core model of React Mental Model and name one failure mode it prevents.",
    "reflectionPrompt": "Find one place in a real frontend project where this react mental model decision could be made more explicit.",
    "masteryCriteria": [
      "Keep render pure",
      "Separate props from state",
      "Use stable keys and one-way data flow"
    ],
    "nextTopics": [
      "deep-dive-state-and-effects"
    ],
    "metadata": {
      "lastUpdated": "2026-07-14",
      "sources": [
        "https://react.dev/learn/thinking-in-react"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-react-2",
      "title": "Deep Challenge: Complete a controlled input",
      "level": 2,
      "topicFamily": "react-mental-model",
      "scenario": "A search box must be controlled by React state.",
      "constraints": [
        "Use value + onChange",
        "No defaultValue"
      ],
      "acceptanceCriteria": [
        "Includes useState",
        "value bound",
        "onChange updates state"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "const [q, setQ] = useState('')"
        },
        {
          "stage": 2,
          "text": "value={q}"
        },
        {
          "stage": 3,
          "text": "onChange={(e) => setQ(e.target.value)}"
        }
      ],
      "expectedReasoning": "Controlled components read from state and write via onChange.",
      "commonWrongPaths": [
        "Using only defaultValue (uncontrolled)"
      ],
      "answerExplanation": "State owns the value; the input reflects it; onChange updates state as the single source of truth.",
      "followUpVariation": "Debounce the query before filtering a large list.",
      "starterCode": "function Search() {\n  // your state here\n  return <input /* ... */ />;\n}",
      "checkType": "code-contains",
      "prompt": "Complete the component so the input is controlled:",
      "requiredSnippets": [
        "useState",
        "value=",
        "onChange"
      ],
      "sourceLink": "https://react.dev/learn/thinking-in-react"
    },
    {
      "slug": "learn-react-ch-react-3",
      "title": "Deep Challenge: Build a filterable list",
      "level": 3,
      "topicFamily": "react-mental-model",
      "scenario": "Product wants a client-side filter by name.",
      "constraints": [
        "Stable keys",
        "Derive the filtered list during render"
      ],
      "acceptanceCriteria": [
        "Filter during render",
        "key={item.id}"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "const visible = items.filter(...)"
        },
        {
          "stage": 2,
          "text": "Do not copy query into effect state"
        },
        {
          "stage": 3,
          "text": "key={item.id}"
        }
      ],
      "expectedReasoning": "Derived data belongs during render; stable keys come from data ids.",
      "commonWrongPaths": [
        "Using useEffect to set filtered state"
      ],
      "answerExplanation": "Filtering is pure derivation and needs no Effect. Keys must be stable identities.",
      "followUpVariation": "Move query into the URL for shareable filters.",
      "starterCode": "function List({ items, query }: { items: {id:string;name:string}[]; query: string }) {\n  // ...\n}",
      "checkType": "code-contains",
      "prompt": "Write a sketch that filters items by query without useEffect:",
      "requiredSnippets": [
        "filter",
        "key=",
        ".id"
      ],
      "sourceLink": "https://react.dev/learn/thinking-in-react"
    }
  ],
  "qa": [
    {
      "id": "qa-1",
      "question": "Why does my component re-render when props haven't changed?",
      "answer": "When a parent renders, React normally evaluates its child elements again. React.memo can skip a child render when its props are equal, subject to the component’s own context and state dependencies. Treat memoization as an evidence-based optimization: profile first, then verify that the comparison cost and skipped work are worthwhile.",
      "followUp": "When is React.memo actually worth using, and when is it unnecessary optimization?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "rendering",
        "performance",
        "memoization"
      ],
      "topicId": "deep-dive-react-mental-model",
      "topicFamily": "react-mental-model",
      "sourceLink": "https://react.dev/reference/react/memo"
    },
    {
      "id": "learn-react-deep-dive-react-mental-model-question",
      "question": "Where should a network request that loads after mount live?",
      "answer": "An Effect or event handler with explicit cleanup/error handling",
      "followUp": "Render must stay pure; external synchronization belongs in an Effect or in the event that initiated it.",
      "category": "react",
      "level": "beginner",
      "topicId": "deep-dive-react-mental-model",
      "topicFamily": "react-mental-model",
      "tags": [
        "learn-react-bridge",
        "react-mental-model"
      ],
      "sourceLink": "https://react.dev/learn/thinking-in-react"
    },
    {
      "id": "learn-react-qa-extra-3",
      "category": "debugging",
      "level": "intermediate",
      "question": "React says “Too many re-renders”. What should I inspect first?",
      "answer": "Look for an unconditional state update during render, such as setX(1) in the component body or onClick={handler()} invoking the handler immediately.",
      "followUp": "How does Strict Mode effect setup differ from an infinite render loop?",
      "tags": [
        "learn-react-bridge",
        "debugging"
      ],
      "sourceLink": "https://react.dev/reference/react/useState",
      "topicId": "deep-dive-react-mental-model",
      "topicFamily": "react-mental-model"
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "react-mental-model",
    "level": "beginner",
    "title": "Deep Dive: React Mental Model"
  }
};
