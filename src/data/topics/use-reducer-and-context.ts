import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "use-reducer-and-context",
  "lesson": {
    "slug": "use-reducer-and-context",
    "title": "useReducer & Context",
    "topicFamily": "state-behavior",
    "level": "intermediate",
    "prerequisites": [
      "state-and-events"
    ],
    "learningObjectives": [
      "Choose a reducer when named actions make related state transitions easier to review",
      "Write a pure reducer with immutable updates and an explicit action model",
      "Use context for deliberate subtree-wide access without treating it as automatic global state",
      "Combine reducer and context while keeping provider scope and consumer contracts explicit"
    ],
    "whyMatters": "Reducers make transition rules explicit; context changes how selected values reach descendants. They solve different problems. Combining them can clarify a coordinated subtree, but only when state ownership, provider scope, invalid actions, and consumer update behavior remain visible.",
    "estimatedMinutes": 34,
    "sections": [
      {
        "id": "reducer-pattern",
        "type": "concept",
        "title": "Reducers centralize transition rules",
        "content": "A reducer receives current state and an action and returns next state. Actions describe events that happened; the reducer decides the state transition. Use a reducer when several related transitions are easier to understand as one explicit model—not merely because a component has several state variables.\n\nReducers must be pure: do not mutate state, read changing external values, write storage, call APIs, or generate time-dependent values inside them. The same inputs must produce the same result. Side effects belong at event or synchronization boundaries."
      },
      {
        "id": "usereducer-code",
        "type": "code-example",
        "title": "Model actions as a discriminated union",
        "content": "Typed actions make valid transitions visible and let TypeScript check that every action is handled.",
        "code": "type State = { count: number; step: number };\ntype Action =\n  | { type: 'increment' }\n  | { type: 'decrement' }\n  | { type: 'setStep'; step: number }\n  | { type: 'reset' };\n\nfunction assertNever(value: never): never {\n  throw new Error(`Unhandled action: ${JSON.stringify(value)}`);\n}\n\nfunction reducer(state: State, action: Action): State {\n  switch (action.type) {\n    case 'increment':\n      return { ...state, count: state.count + state.step };\n    case 'decrement':\n      return { ...state, count: Math.max(0, state.count - state.step) };\n    case 'setStep':\n      return { ...state, step: action.step };\n    case 'reset':\n      return { count: 0, step: 1 };\n    default:\n      return assertNever(action);\n  }\n}\n\nfunction Stepper() {\n  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });\n  return <button onClick={() => dispatch({ type: 'increment' })}>{state.count}</button>;\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/state/Stepper.tsx"
      },
      {
        "id": "context",
        "type": "concept",
        "title": "Context changes access, not ownership",
        "content": "Context lets a descendant read the value from the closest matching provider above it without every intermediate component forwarding a prop. It is appropriate for data intentionally shared across a subtree, such as theme, locale, authenticated identity, or coordinated feature state.\n\nContext is not automatically global, and it does not replace ordinary props or composition. Scope the provider to the consumers that coordinate. When the provider value changes, consumers that read that context receive the new value and render again. Split contexts or stabilize provider design only when measurement and responsibility justify it."
      },
      {
        "id": "context-reducer-code",
        "type": "code-example",
        "title": "Provide state and dispatch with guarded consumers",
        "content": "Separate state and dispatch contexts so consumers declare which capability they need. Guard custom hooks so using them outside the provider fails immediately and clearly.",
        "code": "const TasksStateContext = createContext<readonly Task[] | null>(null);\nconst TasksDispatchContext = createContext<Dispatch<Action> | null>(null);\n\nfunction TasksProvider({ children }: { children: React.ReactNode }) {\n  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);\n\n  return (\n    <TasksStateContext.Provider value={tasks}>\n      <TasksDispatchContext.Provider value={dispatch}>\n        {children}\n      </TasksDispatchContext.Provider>\n    </TasksStateContext.Provider>\n  );\n}\n\nfunction useTasks() {\n  const value = useContext(TasksStateContext);\n  if (value === null) throw new Error('useTasks must be used within TasksProvider');\n  return value;\n}\n\nfunction useTasksDispatch() {\n  const value = useContext(TasksDispatchContext);\n  if (value === null) throw new Error('useTasksDispatch must be used within TasksProvider');\n  return value;\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/state/TaskProvider.tsx"
      },
      {
        "id": "reducer-question",
        "type": "question",
        "title": "Check your understanding",
        "content": "",
        "questions": [
          {
            "id": "q5",
            "question": "Which reducer follows React’s reducer contract?",
            "options": [
              "One that returns a new state value using only `state` and `action`",
              "One that mutates `state.items` and returns the same object",
              "One that writes the new state to `localStorage` before returning",
              "One that calls `Date.now()` to create missing action data"
            ],
            "correctAnswer": "One that returns a new state value using only `state` and `action`",
            "expectedReasoning": "A reducer must be pure and update state immutably. In development Strict Mode, React may call reducers and initializers twice to expose accidental impurities; one result is ignored. Storage, network calls, and time-dependent values belong outside the reducer.",
            "commonMisconceptions": [
              "Assuming mutation is safe if the reducer eventually returns state",
              "Putting persistence or ID generation inside the transition function"
            ]
          }
        ]
      },
      {
        "id": "reducer-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "`useState` and `useReducer` are two ways to own local state; choose the one that makes transitions clearer. Context is a separate access mechanism. Combine reducer and context only when descendants genuinely share the state and dispatch boundary. Keep reducers pure, providers narrow, consumers guarded, and derived views outside stored state."
      }
    ],
    "retrievalPrompt": "Explain separately what a reducer changes and what context changes. Then describe why reducer purity and provider scope are testable correctness properties.",
    "reflectionPrompt": "Find a provider or component with several related updates. Would named actions clarify the transitions, and is every current context consumer inside the narrowest useful provider?",
    "masteryCriteria": [
      "Can model related transitions with typed actions and a pure reducer",
      "Can explain when useState is clearer than useReducer",
      "Can create guarded context consumers and choose provider scope deliberately",
      "Can keep derived filters outside reducer state and side effects outside the reducer"
    ],
    "nextTopics": [
      "use-effect-and-custom-hooks"
    ],
    "metadata": {
      "reactVersion": "19.2",
      "lastUpdated": "2026-07-20",
      "sources": [
        "https://react.dev/reference/react/useReducer",
        "https://react.dev/reference/react/useContext",
        "https://react.dev/learn/extracting-state-logic-into-a-reducer",
        "https://react.dev/learn/passing-data-deeply-with-context",
        "https://react.dev/learn/scaling-up-with-reducer-and-context"
      ]
    },
    "diagram": {
      "title": "Action to shared consumer",
      "kind": "flow",
      "nodes": [
        {
          "id": "action",
          "label": "User action",
          "role": "Intent"
        },
        {
          "id": "reducer",
          "label": "Reducer",
          "role": "Pure transition"
        },
        {
          "id": "provider",
          "label": "Context provider",
          "role": "Shared access boundary"
        },
        {
          "id": "consumer",
          "label": "Consumer render",
          "role": "Reads current state"
        }
      ],
      "edges": [
        {
          "from": "action",
          "to": "reducer"
        },
        {
          "from": "reducer",
          "to": "provider"
        },
        {
          "from": "provider",
          "to": "consumer"
        }
      ]
    },
    "chunks": [
      {
        "id": "use-reducer-and-context-retrieval-1",
        "title": "Keep transitions pure and access deliberate",
        "concept": "Reducers calculate next state; context supplies a value to descendants. Neither boundary should hide external side effects.",
        "prediction": {
          "prompt": "Which responsibility belongs inside the reducer?",
          "options": [
            "Writing the next tasks to browser storage",
            "Returning the next tasks for a dispatched action"
          ],
          "correctAnswer": "Returning the next tasks for a dispatched action",
          "feedbackCorrect": "The reducer owns a deterministic state transition.",
          "feedbackWrong": "Persistence is an external side effect and needs a separate owner."
        },
        "synthesis": "Reducer answers “how does state change?”; context answers “who can read or dispatch?”"
      }
    ],
    "miniProject": {
      "title": "Design a shared cart state",
      "scenario": "Design shared cart state for a product list, header count, and checkout view.",
      "acceptance": [
        "Typed actions cover add, remove, quantity change, and clear transitions",
        "The reducer is pure and rejects or exhaustively handles invalid actions",
        "Provider scope includes only the coordinated cart subtree and consumers use guarded hooks"
      ],
      "rubric": [
        {
          "dimension": "Reducer",
          "evidence": "The action model is complete and pure."
        },
        {
          "dimension": "Ownership",
          "evidence": "Context scope matches the consumers that coordinate."
        },
        {
          "dimension": "Recovery",
          "evidence": "Unknown or invalid actions are handled deliberately."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "build-todo-list",
      "title": "Build a Todo List",
      "level": 3,
      "topicFamily": "state-behavior",
      "scenario": "Build a shared task board whose header shows the remaining count while the list can add, toggle, delete, and filter tasks.",
      "constraints": [
        "Use `useReducer` with a typed action union for task transitions",
        "Expose task state and dispatch through a provider scoped to the task-board subtree",
        "Keep the active filter local or derived; do not store a filtered copy of the task array"
      ],
      "acceptanceCriteria": [
        "Adding, toggling, and deleting tasks use immutable reducer transitions",
        "The header and list read the same task source of truth",
        "All, Active, and Completed views are derived from tasks plus the selected filter",
        "Using a task context hook outside the provider throws a clear error"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Define `Task`, `State`, and a discriminated `Action` union before writing the reducer."
        },
        {
          "stage": 2,
          "text": "Return new arrays for add, toggle, and delete. Keep ID creation in the event boundary and pass the ID in the action."
        },
        {
          "stage": 3,
          "text": "Provide state and dispatch, guard custom consumer hooks, and calculate the visible array during render."
        }
      ],
      "expectedReasoning": "The reducer owns deterministic task transitions. The provider owns one shared task source for the coordinated subtree. Filter selection and the visible list are separate concerns; the visible list is derived rather than stored. External work and ID generation remain outside the reducer.",
      "commonWrongPaths": [
        "Generating IDs or writing storage inside the reducer",
        "Storing both the full task list and a filtered task list"
      ],
      "answerExplanation": "Use typed event actions whose payloads contain any generated IDs. Return immutable task arrays from the reducer. Place the provider around the task-board feature, expose guarded state and dispatch hooks, and derive `visibleTasks` from tasks and the selected filter during render.",
      "followUpVariation": "Split a frequently changing draft input away from task context. Which components actually need that draft?",
      "sourceLink": "https://react.dev/learn/scaling-up-with-reducer-and-context",
      "sourceLinks": [
        "https://react.dev/reference/react/useReducer"
      ]
    }
  ],
  "qa": [
    {
      "id": "loop-qa-use-reducer-and-context-1",
      "topicId": "use-reducer-and-context",
      "topicFamily": "state-behavior",
      "question": "What separate problems do a reducer and context solve?",
      "answer": "A reducer centralizes how state transitions in response to actions. Context lets descendants read a provided value without intermediate prop forwarding. Combining them does not change who owns the state; the provider remains the owner.",
      "followUp": "Could composition or ordinary props keep this boundary simpler?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "use-reducer-and-context"
      ],
      "sourceLink": "https://react.dev/learn/scaling-up-with-reducer-and-context"
    },
    {
      "id": "loop-qa-use-reducer-and-context-2",
      "topicId": "use-reducer-and-context",
      "topicFamily": "state-behavior",
      "question": "When is `useReducer` clearer than several `useState` calls?",
      "answer": "When several related transitions benefit from named actions and one reviewable transition function. The number of state variables alone is not the deciding factor; a simple independent value is often clearer with `useState`.",
      "followUp": "Name one action and show the exact state invariant it preserves.",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "use-reducer-and-context"
      ],
      "sourceLink": "https://react.dev/learn/scaling-up-with-reducer-and-context"
    },
    {
      "id": "loop-qa-use-reducer-and-context-3",
      "topicId": "use-reducer-and-context",
      "topicFamily": "state-behavior",
      "question": "How do you verify a reducer-and-context boundary?",
      "answer": "Replay reducer actions to prove deterministic immutable transitions, test an invalid or unhandled action policy, verify consumers fail clearly outside the provider, and confirm the provider is scoped only to components that coordinate.",
      "followUp": "Which consumer re-renders when the provided state value changes, and is that behavior acceptable?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "use-reducer-and-context"
      ],
      "sourceLink": "https://react.dev/learn/scaling-up-with-reducer-and-context"
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "state-behavior",
    "level": "intermediate",
    "title": "useReducer & Context"
  }
};
