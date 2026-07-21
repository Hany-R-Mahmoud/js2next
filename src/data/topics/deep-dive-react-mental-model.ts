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
      "Describe render and commit as separate parts of a React update",
      "Treat props and state as read-only snapshots for one render",
      "Use keys and component position to reason about state preservation",
      "Derive values during render and use functional updaters for queued transitions"
    ],
    "whyMatters": "React becomes easier to predict when you treat each render as a calculation from one snapshot. That model explains why setters do not change the current variables, why repeated list keys matter, and why derived values usually do not need their own state.",
    "estimatedMinutes": 42,
    "sections": [
      {
        "id": "deep-dive-react-mental-model-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "A component function is a recipe for UI. During render, React calls components and calculates the next tree from their props, state, and context. During commit, React applies the necessary changes to the host environment, such as the browser DOM. Keep render pure: given the same inputs, it should describe the same result and should not change values outside the component.\n\nProps and state are snapshots for one render. Calling a setter requests another render; it does not replace the state variable inside the event handler that is already running. React preserves component state by where that component appears in the tree, including its type and key."
      },
      {
        "id": "deep-dive-react-mental-model-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "Each render receives fixed values. Multiple setters may be queued and processed together. If the next value depends on the queued previous value, pass an updater such as `setCount(current => current + 1)`. React will apply queued updaters in order during the next render. Do not mutate objects or arrays from the snapshot; replace the changed path.\n\nA value completely determined by current props and state, such as a filtered list or full name, belongs in the render calculation. In a list, a stable key tells React which item is the same logical child between renders. An index key is unsafe when insertion, deletion, or reordering can change which item occupies that position."
      },
      {
        "id": "deep-dive-react-mental-model-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "Separating render from commit lets React calculate before changing the screen. Snapshot values keep one event handler internally consistent even when it queues updates. Functional updaters express a transition from the queued value rather than reusing a stale snapshot. Stable identity lets React connect the right state to the right child. Redundant state creates a second value that can fall out of sync with the inputs that already determine it."
      },
      {
        "id": "deep-dive-react-mental-model-example",
        "type": "code-example",
        "title": "State update with a functional updater",
        "content": "All three updater functions are queued from one click. Each receives the result of the previous updater, so the next render shows three more. The `count` variable in the current handler remains its snapshot value.",
        "code": "function Counter() {\n  const [count, setCount] = useState(0);\n\n  function addThree() {\n    setCount(current => current + 1);\n    setCount(current => current + 1);\n    setCount(current => current + 1);\n  }\n\n  return <button onClick={addThree}>Count: {count}</button>;\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "Counter.tsx"
      },
      {
        "id": "deep-dive-react-mental-model-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-react-mental-model-question",
            "question": "A list of editable rows is reordered. Which key best preserves each row’s local input state with the same logical item?",
            "options": [
              "The item’s stable database ID",
              "The item’s current array index",
              "A new random value on every render",
              "No key, because React reads the row text"
            ],
            "correctAnswer": "The item’s stable database ID",
            "expectedReasoning": "A stable item ID keeps identity attached to the same logical record across reordering. An index follows the position, so state can move to a different item. A random key changes every render and resets the child. Omitting keys does not let React infer identity from displayed text."
          }
        ]
      },
      {
        "id": "deep-dive-react-mental-model-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Render calculates UI from a fixed snapshot; commit applies the result. Setters queue future state, so use an updater when the next value depends on queued previous state. Keep derived values in the calculation, preserve snapshots with immutable updates, and give list items stable keys so state follows the intended identity."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-react-mental-model-prediction",
        "title": "Predict the boundary",
        "concept": "A state setter queues another render; it does not rewrite the current render snapshot.",
        "prediction": {
          "prompt": "An event calls `setScore(score + 1)` three times while `score` is 0. What value is requested each time?",
          "options": [
            "1 each time",
            "1, then 2, then 3"
          ],
          "correctAnswer": "1 each time",
          "feedbackCorrect": "Every call reads the same `score` snapshot. Use three functional updaters to apply three transitions.",
          "feedbackWrong": "The variable in this handler does not change after the setter. All three expressions read the current render’s 0."
        },
        "synthesis": "Choose a replacement value for independent updates and an updater function for queued transitions."
      },
      {
        "id": "deep-dive-react-mental-model-failure-mode",
        "title": "Name the failure mode",
        "concept": "State is tied to tree position, component type, and key.",
        "prediction": {
          "prompt": "A row receives a different random key on every render. What happens to its local state?",
          "options": [
            "It resets because React sees a new component identity",
            "It is preserved because the row renders in a list",
            "It moves to the nearest row"
          ],
          "correctAnswer": "It resets because React sees a new component identity",
          "feedbackCorrect": "A changing key tells React the old child was removed and a new one was added.",
          "feedbackWrong": "Keys participate in identity. A fresh key prevents React from matching the new child to the previous one."
        },
        "synthesis": "Use stable data IDs and change a key deliberately only when resetting state is the goal."
      }
    ],
    "miniProject": {
      "title": "Practice lab: React Mental Model",
      "scenario": "Build an editable, filterable task list and explain each render snapshot, derived value, and item identity.",
      "acceptance": [
        "The visible list is derived from tasks and query during render",
        "Task objects are replaced rather than mutated",
        "Stable task IDs are used as keys and state follows the task during reordering",
        "A multi-step counter or task transition uses functional updaters where previous queued state matters"
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
    "retrievalPrompt": "Trace a click from its render snapshot through queued state updates, the next render, and the commit. Then explain whether child state is preserved from its type, position, and key.",
    "reflectionPrompt": "Choose one component with surprising state behavior. Mark the render snapshot, every queued update, derived values, and the component position or key that controls preservation.",
    "masteryCriteria": [
      "Can separate render calculations from DOM commit work",
      "Can explain why state variables keep their current-render values inside an event handler",
      "Uses functional updaters when the next value depends on queued previous state",
      "Keeps derived values out of redundant state",
      "Uses stable keys to preserve the intended list-item identity"
    ],
    "nextTopics": [
      "deep-dive-state-and-effects"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://react.dev/learn/render-and-commit",
        "https://react.dev/learn/state-as-a-snapshot",
        "https://react.dev/learn/queueing-a-series-of-state-updates",
        "https://react.dev/learn/preserving-and-resetting-state",
        "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key",
        "https://react.dev/learn/thinking-in-react",
        "https://react.dev/reference/rules/components-and-hooks-must-be-pure"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-react-2",
      "title": "Deep Challenge: Complete a controlled input",
      "level": 2,
      "topicFamily": "react-mental-model",
      "scenario": "Complete a controlled email field that trims only on submit, preserves what the learner is typing, and shows a clear validation message.",
      "constraints": [
        "Use one state value as the input `value` and update it from `onChange`",
        "Keep the current render snapshot read-only",
        "Use a visible label and connect validation feedback to the field"
      ],
      "acceptanceCriteria": [
        "Typing updates the field without switching between controlled and uncontrolled behavior",
        "Submit reads the latest state and validates a trimmed value",
        "Invalid input keeps the typed value and presents a recoverable message"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "A controlled field gets both `value={email}` and an `onChange` that calls `setEmail`."
        },
        {
          "stage": 2,
          "text": "Do not mutate a variable from a previous render; request the next value through the setter."
        },
        {
          "stage": 3,
          "text": "Perform submit-specific trimming in the submit handler so typing remains predictable."
        }
      ],
      "expectedReasoning": "State owns the displayed value. Each change requests a new render with a new snapshot. Submit is the event that owns normalization and validation, while feedback remains associated with the field so the user can recover.",
      "commonWrongPaths": [
        "Passing `value` without `onChange`, which makes the field read-only",
        "Mutating the state variable directly",
        "Keeping a second independent copy of the same email value"
      ],
      "answerExplanation": "Bind the field to one state value and use its setter in `onChange`. Read the current value in submit, validate the normalized form, and keep feedback visible without creating another writable copy.",
      "followUpVariation": "Add a Reset button. Which event owns the reset, and what next snapshot should it request?",
      "starterCode": "function Search() {\n  // your state here\n  return <input /* ... */ />;\n}",
      "checkType": "code-contains",
      "prompt": "Complete the component so the input is controlled:",
      "requiredSnippets": [
        "useState",
        "value=",
        "onChange"
      ],
      "sourceLink": "https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable",
      "sourceLinks": [
        "https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable",
        "https://react.dev/learn/state-as-a-snapshot",
        "https://react.dev/learn/thinking-in-react"
      ]
    },
    {
      "slug": "learn-react-ch-react-3",
      "title": "Deep Challenge: Build a filterable list",
      "level": 3,
      "topicFamily": "react-mental-model",
      "scenario": "Build a filterable task list whose visible rows are calculated from current tasks and query, and whose edit state stays with the correct task after sorting.",
      "constraints": [
        "Store tasks and query, but not a second visible-tasks state value",
        "Update task objects and arrays immutably",
        "Use each task’s stable ID as its key"
      ],
      "acceptanceCriteria": [
        "Typing a query immediately derives the matching rows",
        "Editing or toggling one task replaces only the changed data path",
        "Sorting does not move a row’s local state to a different task",
        "The explanation traces render, queued update, and commit in order"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Calculate `visibleTasks` with `filter` during render from `tasks` and `query`."
        },
        {
          "stage": 2,
          "text": "Use `map` to return a new object only for the task whose ID matches."
        },
        {
          "stage": 3,
          "text": "A key should come from task data and remain stable when the array order changes."
        }
      ],
      "expectedReasoning": "Tasks and query already determine the visible list, so redundant visible state is unnecessary. Immutable replacement makes the changed snapshot explicit. Stable task IDs let React match each row to the same logical task after filtering or sorting.",
      "commonWrongPaths": [
        "Synchronizing a second visible list through an Effect",
        "Mutating a task object inside the existing array",
        "Using the array index or a random value as the key"
      ],
      "answerExplanation": "Keep the minimal state, derive the view, replace changed data, and use stable identity. Each rule follows directly from the render-snapshot model.",
      "followUpVariation": "Add a category filter to the URL. Which state should remain local and which state should become shareable?",
      "starterCode": "function List({ items, query }: { items: {id:string;name:string}[]; query: string }) {\n  // ...\n}",
      "checkType": "code-contains",
      "prompt": "Write a sketch that filters items by query without useEffect:",
      "requiredSnippets": [
        "filter",
        "key=",
        ".id"
      ],
      "sourceLink": "https://react.dev/learn/thinking-in-react",
      "sourceLinks": [
        "https://react.dev/learn/thinking-in-react",
        "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key",
        "https://react.dev/learn/updating-arrays-in-state"
      ]
    }
  ],
  "qa": [
    {
      "id": "qa-1",
      "question": "Why does my component re-render when props haven't changed?",
      "answer": "`React.memo` can skip rendering a component when its props are unchanged according to shallow `Object.is` comparison, but it is a performance optimization, not a correctness rule. It does not stop renders caused by the component’s own state or a context it reads. Profile a meaningful slow interaction first, keep rendering pure, and stabilize object or function props only when the measurement shows that the skipped work is valuable.",
      "followUp": "Which measured render is expensive, and which prop changes identity even though its meaning stays the same?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "rendering",
        "performance",
        "memoization"
      ],
      "topicId": "deep-dive-react-mental-model",
      "topicFamily": "react-mental-model",
      "sourceLink": "https://react.dev/reference/react/memo",
      "sourceLinks": [
        "https://react.dev/reference/react/memo",
        "https://react.dev/reference/react/useMemo",
        "https://react.dev/reference/react/useCallback"
      ]
    },
    {
      "id": "learn-react-deep-dive-react-mental-model-question",
      "question": "Why does a stable database ID make a better list key than an array index when rows can reorder?",
      "answer": "The ID stays with the same logical item, so React can preserve that row’s state with the item. An index stays with a position; after insertion, deletion, or sorting, that position may represent a different item.",
      "followUp": "When would changing a key deliberately be useful instead of harmful?",
      "category": "react",
      "level": "beginner",
      "topicId": "deep-dive-react-mental-model",
      "topicFamily": "react-mental-model",
      "tags": [
        "learn-react-bridge",
        "react-mental-model"
      ],
      "sourceLink": "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key",
      "sourceLinks": [
        "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key",
        "https://react.dev/learn/preserving-and-resetting-state",
        "https://react.dev/learn/thinking-in-react"
      ]
    },
    {
      "id": "learn-react-qa-extra-3",
      "category": "debugging",
      "level": "intermediate",
      "question": "React says “Too many re-renders”. What should I inspect first?",
      "answer": "State variables behave like snapshots. A setter requests another render, but the event handler already running still sees the values from the render that created it. If the next value depends on the queued previous value, use a functional updater. If later code truly needs the next value immediately, calculate it in a local variable and pass that value to both the setter and the later operation.",
      "followUp": "Is your next value an independent replacement, or a transition that depends on queued previous state?",
      "tags": [
        "learn-react-bridge",
        "debugging"
      ],
      "sourceLink": "https://react.dev/learn/state-as-a-snapshot",
      "topicId": "deep-dive-react-mental-model",
      "topicFamily": "react-mental-model",
      "sourceLinks": [
        "https://react.dev/learn/state-as-a-snapshot",
        "https://react.dev/learn/queueing-a-series-of-state-updates",
        "https://react.dev/reference/react/useState"
      ]
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "react-mental-model",
    "level": "beginner",
    "title": "Deep Dive: React Mental Model"
  }
};
