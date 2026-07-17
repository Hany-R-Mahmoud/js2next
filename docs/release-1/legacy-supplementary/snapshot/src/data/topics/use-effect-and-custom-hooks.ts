import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "use-effect-and-custom-hooks",
  "lesson": {
    "slug": "use-effect-and-custom-hooks",
    "title": "useEffect & Custom Hooks",
    "topicFamily": "state-behavior",
    "level": "intermediate",
    "prerequisites": [
      "use-reducer-and-context"
    ],
    "learningObjectives": [
      "Understand when useEffect is necessary and when it is not",
      "Write effects with correct dependency arrays",
      "Clean up effects to prevent memory leaks",
      "Extract reusable logic into custom hooks",
      "Identify and avoid common effect anti-patterns"
    ],
    "whyMatters": "useEffect is the most misused hook in React. Developers overuse it, under-clean it, and write dependency arrays they do not understand. Mastering effects means knowing when not to use one — and when you must, getting the cleanup and dependencies right.",
    "estimatedMinutes": 35,
    "sections": [
      {
        "id": "effect-purpose",
        "type": "concept",
        "title": "What useEffect is for",
        "content": "useEffect synchronizes a component with an external system — the DOM, a browser API, a network request, a third-party library. It runs after React paints to the screen. It is NOT for deriving data from props/state (compute that during render), NOT for responding to user events (use event handlers), and NOT for resetting state when props change (use a key prop instead)."
      },
      {
        "id": "dependency-array",
        "type": "concept",
        "title": "The dependency array",
        "content": "The dependency array tells React: \"re-run this effect whenever any of these values change.\" An empty array `[]` means the Effect has no reactive dependencies; it is not a universal guarantee that work happens only once in every environment. Omitting the array entirely means \"run after every render\" — almost never what you want. Include every reactive value (props, state, derived values) that the Effect reads. When configured, the `eslint-plugin-react-hooks` exhaustive-deps rule can flag omissions; treat its output as a review aid and understand the synchronization you are declaring."
      },
      {
        "id": "cleanup",
        "type": "code-example",
        "title": "Cleanup: prevent memory leaks",
        "content": "Every effect that sets up a subscription, interval, or event listener must return a cleanup function. React calls cleanup before re-running the effect and when the component unmounts.",
        "code": "useEffect(() => {\n  const controller = new AbortController();\n  fetch(url, { signal: controller.signal })\n    .then(res => res.json())\n    .then(setData);\n\n  return () => controller.abort();\n}, [url]);\n\nuseEffect(() => {\n  function handleKeyDown(e: KeyboardEvent) {\n    if (e.key === 'Escape') closeModal();\n  }\n  window.addEventListener('keydown', handleKeyDown);\n  return () => window.removeEventListener('keydown', handleKeyDown);\n}, [closeModal]);",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/effects/cleanup.tsx"
      },
      {
        "id": "anti-patterns",
        "type": "concept",
        "title": "Common effect anti-patterns",
        "content": "1. Setting state in an effect when it could be computed during render (causes unnecessary re-renders).\n2. Using an effect to react to a prop change instead of using a key to reset state.\n3. Fetching data in effects without handling race conditions or cleanup.\n4. Chaining effects where one effect's state change triggers another effect.\n5. Infinite loops from missing or incorrect dependency arrays."
      },
      {
        "id": "custom-hooks",
        "type": "code-example",
        "title": "Custom hooks: extract reusable logic",
        "content": "A custom hook is a function whose name starts with `use` that calls other hooks. It lets you extract stateful logic, not just UI, into reusable functions.",
        "code": "function useDebounce<T>(value: T, delay: number): T {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(id);\n  }, [value, delay]);\n  return debounced;\n}\n\nfunction useLocalStorage<T>(key: string, initial: T) {\n  const [value, setValue] = useState<T>(() => {\n    const stored = localStorage.getItem(key);\n    return stored ? JSON.parse(stored) : initial;\n  });\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n  return [value, setValue] as const;\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/effects/custom-hooks.tsx"
      },
      {
        "id": "effect-question",
        "type": "question",
        "title": "Check your understanding",
        "content": "",
        "questions": [
          {
            "id": "q6",
            "question": "Which of these should NOT use useEffect?",
            "options": [
              "Subscribing to a WebSocket connection",
              "Computing a filtered list from state + a search query",
              "Setting document.title when a prop changes",
              "Focusing an input on mount"
            ],
            "correctAnswer": "Computing a filtered list from state + a search query",
            "expectedReasoning": "Filtering a list based on state is pure computation — it should happen during render, not in an effect. const filtered = items.filter(i => i.name.includes(query)). Using useEffect for this causes an unnecessary second render: first render shows the old filtered list, effect runs, state updates, second render shows the correct list.",
            "commonMisconceptions": [
              "Overusing useEffect for all \"side\" logic",
              "Not recognizing that derived values should be computed during render"
            ]
          }
        ]
      },
      {
        "id": "effect-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "useEffect is for synchronization with external systems, not for data transformation or event handling. Before writing an effect, ask: can I compute this during render? Can I handle this in an event handler? Is there a library hook that already does this? Custom hooks are the natural evolution: when you find yourself copying effects between components, extract the pattern."
      }
    ],
    "retrievalPrompt": "List three situations where you should NOT use useEffect, and explain why for each.",
    "reflectionPrompt": "Find all useEffect calls in your current project. For each, ask: is this truly synchronizing with an external system, or am I using it as a lifecycle method?",
    "masteryCriteria": [
      "Can identify when useEffect is needed vs when computation during render suffices",
      "Writes correct dependency arrays including all reactive values",
      "Always returns cleanup functions for subscriptions and listeners",
      "Can extract reusable logic into custom hooks",
      "Can identify and fix effect anti-patterns"
    ],
    "nextTopics": [
      "app-router-and-layouts"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-01",
      "sources": [
        "https://react.dev/learn/synchronizing-with-effects",
        "https://react.dev/learn/you-might-not-need-an-effect"
      ]
    },
    "diagram": {
      "title": "Synchronize after commit",
      "kind": "flow",
      "nodes": [
        {
          "id": "render",
          "label": "Render",
          "role": "Pure calculation"
        },
        {
          "id": "commit",
          "label": "Commit",
          "role": "UI is applied"
        },
        {
          "id": "effect",
          "label": "Effect setup",
          "role": "External synchronization"
        },
        {
          "id": "cleanup",
          "label": "Cleanup",
          "role": "Before replacement or unmount"
        }
      ],
      "edges": [
        {
          "from": "render",
          "to": "commit"
        },
        {
          "from": "commit",
          "to": "effect"
        },
        {
          "from": "effect",
          "to": "cleanup",
          "label": "dependency changes"
        }
      ]
    },
    "chunks": [
      {
        "id": "use-effect-and-custom-hooks-retrieval-1",
        "title": "Reject unnecessary Effects",
        "concept": "Pure derivation should happen during render; Effects are for synchronizing with systems outside React.",
        "prediction": {
          "prompt": "Where should a filtered array derived from props be computed?",
          "options": [
            "During render",
            "In an Effect that sets derived state"
          ],
          "correctAnswer": "During render",
          "feedbackCorrect": "No external system needs synchronization.",
          "feedbackWrong": "The extra Effect adds a second render and a synchronization path."
        },
        "synthesis": "Use Effects for external systems, and return cleanup for resources they acquire."
      }
    ],
    "miniProject": {
      "title": "Extract a subscription hook",
      "scenario": "Design a custom hook for a browser subscription with setup, cleanup, loading, and error behavior.",
      "acceptance": [
        "The external resource has matching cleanup",
        "Dependencies identify the resource inputs",
        "The hook exposes an observable state contract"
      ],
      "rubric": [
        {
          "dimension": "Lifecycle",
          "evidence": "Setup and cleanup remain paired across changes and unmount."
        },
        {
          "dimension": "Dependencies",
          "evidence": "Inputs are complete and intentional."
        },
        {
          "dimension": "API",
          "evidence": "The hook returns a small, documented state shape."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "loop-use-effect-and-custom-hooks",
      "title": "Apply useEffect & Custom Hooks",
      "level": 2,
      "topicFamily": "state-behavior",
      "scenario": "Use the model from useEffect & Custom Hooks in a small project decision, then explain the boundary you chose.",
      "constraints": [
        "State the owner or boundary explicitly",
        "Include one failure or recovery case",
        "Keep the explanation tied to observable behavior"
      ],
      "acceptanceCriteria": [
        "Can identify when useEffect is needed vs when computation during render suffices",
        "Writes correct dependency arrays including all reactive values",
        "Always returns cleanup functions for subscriptions and listeners"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start with the first learning objective: Understand when useEffect is necessary and when it is not."
        },
        {
          "stage": 2,
          "text": "Separate the model, the boundary that owns it, and the evidence a user or test can observe."
        },
        {
          "stage": 3,
          "text": "Use this retrieval prompt: List three situations where you should NOT use useEffect, and explain why for each."
        }
      ],
      "expectedReasoning": "Can identify when useEffect is needed vs when computation during render suffices · Writes correct dependency arrays including all reactive values · Always returns cleanup functions for subscriptions and listeners · Can extract reusable logic into custom hooks · Can identify and fix effect anti-patterns",
      "commonWrongPaths": [
        "Adding a second owner without a requirement",
        "Describing success without a failure or recovery state"
      ],
      "answerExplanation": "A good response names the model, its owner, and an observable way to verify it. useEffect is the most misused hook in React. Developers overuse it, under-clean it, and write dependency arrays they do not understand. Mastering effects means knowing when not to use one — and when you must, getting the cleanup and dependencies right.",
      "followUpVariation": "Apply the same boundary to a different feature in the project.",
      "sourceLink": "https://react.dev/learn/synchronizing-with-effects"
    }
  ],
  "qa": [
    {
      "id": "qa-3",
      "question": "My useEffect runs twice in development. Is this a bug?",
      "answer": "Usually not. When Strict Mode is enabled, React may re-run Effects an extra time in development to surface bugs caused by missing cleanup. If your effect sets up a subscription and returns a cleanup function, the extra setup/cleanup cycle tests that teardown before re-running. If it breaks, inspect the cleanup and the effect’s ownership of the external resource.",
      "followUp": "How do you know if an effect truly needs a cleanup function?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "useEffect",
        "strict-mode",
        "debugging"
      ],
      "topicId": "use-effect-and-custom-hooks",
      "topicFamily": "state-behavior",
      "sourceLink": "https://react.dev/reference/react/StrictMode"
    },
    {
      "id": "loop-qa-use-effect-and-custom-hooks-1",
      "topicId": "use-effect-and-custom-hooks",
      "topicFamily": "state-behavior",
      "question": "What problem does useEffect & Custom Hooks help you solve?",
      "answer": "useEffect is the most misused hook in React. Developers overuse it, under-clean it, and write dependency arrays they do not understand. Mastering effects means knowing when not to use one — and when you must, getting the cleanup and dependencies right.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "use-effect-and-custom-hooks"
      ],
      "sourceLink": "https://react.dev/learn/synchronizing-with-effects"
    },
    {
      "id": "loop-qa-use-effect-and-custom-hooks-2",
      "topicId": "use-effect-and-custom-hooks",
      "topicFamily": "state-behavior",
      "question": "How would you explain the core idea of useEffect & Custom Hooks to a teammate?",
      "answer": "List three situations where you should NOT use useEffect, and explain why for each. A strong explanation should connect the model to: Understand when useEffect is necessary and when it is not; Write effects with correct dependency arrays.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "use-effect-and-custom-hooks"
      ],
      "sourceLink": "https://react.dev/learn/synchronizing-with-effects"
    }
  ],
  "practices": [
    {
      "id": "bp-6",
      "title": "Clean Up Effects that Acquire External Resources",
      "summary": "An Effect that creates a subscription, connection, timer, or event listener should return the matching cleanup function.",
      "rationale": "Without cleanup, effects accumulate: event listeners stack, intervals keep firing, subscriptions leak memory. With React Strict Mode enabled in development, the extra setup/cleanup cycle helps surface missing cleanups.",
      "tradeOffs": "Adds boilerplate. But the cost of a memory leak (degraded performance, bugs that only appear after extended use) is far higher.",
      "appliesWhen": "The effect subscribes to anything external: event listeners, WebSocket connections, intervals, timeouts, fetch abortion, third-party library instances.",
      "doesNotApplyWhen": "The effect does not acquire an external resource, such as a one-off log or analytics event.",
      "example": "`useEffect(() => { const id = setInterval(tick, 1000); return () => clearInterval(id); }, [])` — always clear the interval.",
      "sourceLink": "https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed",
      "tags": [
        "useEffect",
        "cleanup",
        "memory"
      ],
      "topicId": "use-effect-and-custom-hooks",
      "topicFamily": "state-behavior"
    }
  ],
  "meta": {
    "topicFamily": "state-behavior",
    "level": "intermediate",
    "title": "useEffect & Custom Hooks"
  }
};
