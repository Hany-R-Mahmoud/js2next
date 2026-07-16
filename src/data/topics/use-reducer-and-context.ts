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
      "Recognize when useState is insufficient and useReducer is appropriate",
      "Write reducer functions following the dispatch/action/reducer pattern",
      "Use Context to avoid prop drilling",
      "Combine context and reducers for scalable state management"
    ],
    "whyMatters": "As components grow, scattered useState calls become hard to reason about. Reducers centralize state update logic. Context eliminates prop drilling. Together, they form the foundation of lightweight, library-free state management that scales from small apps to production systems.",
    "estimatedMinutes": 30,
    "sections": [
      {
        "id": "reducer-pattern",
        "type": "concept",
        "title": "The reducer pattern",
        "content": "A reducer is a pure function that takes the current state and an action, and returns the next state: `(state, action) => nextState`. The action describes what happened — it's usually an object with a `type` string and optional payload. This pattern comes from functional programming and is the foundation of Redux."
      },
      {
        "id": "usereducer-code",
        "type": "code-example",
        "title": "useReducer in practice",
        "content": "Instead of multiple useState calls with interdependent update logic, useReducer gives you a single state object and a dispatch function.",
        "code": "type State = { count: number; step: number };\ntype Action = { type: 'inc' } | { type: 'dec' } | { type: 'reset' } | { type: 'setStep'; payload: number };\n\nfunction reducer(state: State, action: Action): State {\n  switch (action.type) {\n    case 'inc': return { ...state, count: state.count + state.step };\n    case 'dec': return { ...state, count: state.count - state.step };\n    case 'reset': return { ...state, count: 0 };\n    case 'setStep': return { ...state, step: action.payload };\n    default: return state;\n  }\n}\n\nfunction Stepper() {\n  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });\n  return (\n    <>\n      <p>Count: {state.count}</p>\n      <button onClick={() => dispatch({ type: 'inc' })}>+</button>\n      <button onClick={() => dispatch({ type: 'dec' })}>-</button>\n      <input value={state.step} onChange={e =>\n        dispatch({ type: 'setStep', payload: Number(e.target.value) })\n      } />\n    </>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/state/Stepper.tsx"
      },
      {
        "id": "context",
        "type": "concept",
        "title": "Context: avoid prop drilling",
        "content": "Context lets a parent component provide data to the entire tree below it, without passing props through every level. Use context when data is truly \"global\" to a subtree — theme, auth user, locale. Do not use context to avoid passing props one or two levels; that is normal and fine."
      },
      {
        "id": "context-reducer-code",
        "type": "code-example",
        "title": "Context + Reducer = scalable state",
        "content": "Combine createContext with useReducer to create a lightweight state management system without external libraries.",
        "code": "const TasksContext = createContext<TasksContextType | null>(null);\n\nfunction TasksProvider({ children }: { children: React.ReactNode }) {\n  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);\n  return (\n    <TasksContext.Provider value={{ tasks, dispatch }}>\n      {children}\n    </TasksContext.Provider>\n  );\n}\n\nfunction TaskList() {\n  const { tasks, dispatch } = useContext(TasksContext)!;\n  return tasks.map(task => (\n    <TaskItem key={task.id} task={task} onComplete={() =>\n      dispatch({ type: 'toggle', id: task.id })\n    } />\n  ));\n}",
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
            "question": "Why must a reducer be a pure function?",
            "options": [
              "React will call it multiple times and expects consistent results",
              "It is a convention but not strictly required",
              "To enable time-travel debugging in development",
              "Both A and C"
            ],
            "correctAnswer": "Both A and C",
            "expectedReasoning": "Reducers must be pure because React can call reducer and initializer logic more than once in development with Strict Mode enabled, and expects the same output for the same input. Purity also enables features like time-travel debugging where actions can be replayed deterministically.",
            "commonMisconceptions": [
              "Thinking purity is just a convention",
              "Putting side effects (API calls, localStorage) inside reducers"
            ]
          }
        ]
      },
      {
        "id": "reducer-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "useState for simple values. useReducer when multiple state values change together or when the next state depends on the previous state in complex ways. Context when data is needed by many components at different levels. Context + Reducer when you need both. This pattern scales well without external libraries, and migrating to Zustand or Redux later is straightforward because the mental model is identical."
      }
    ],
    "retrievalPrompt": "What are three signs that you should use useReducer instead of multiple useState calls?",
    "reflectionPrompt": "Find a component in your codebase with 3+ useState calls. Would refactoring to useReducer make the update logic clearer? Why or why not?",
    "masteryCriteria": [
      "Can write a reducer function following the (state, action) -> state pattern",
      "Knows when to use useReducer vs useState",
      "Can create Context providers and consume them with useContext",
      "Can combine Context with useReducer for scalable state"
    ],
    "nextTopics": [
      "use-effect-and-custom-hooks"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-01",
      "sources": [
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
        "title": "Choose the boundary",
        "concept": "A reducer centralizes transitions; context supplies a deliberately shared state and dispatch boundary.",
        "prediction": {
          "prompt": "Which responsibility belongs in the reducer?",
          "options": [
            "Reading window width directly",
            "Returning the next state for an action"
          ],
          "correctAnswer": "Returning the next state for an action",
          "feedbackCorrect": "Reducers stay pure and describe state transitions.",
          "feedbackWrong": "External subscriptions do not belong inside a reducer."
        },
        "synthesis": "Use reducer for transitions and context for access, not as a reason to globalize unrelated state."
      }
    ],
    "miniProject": {
      "title": "Design a shared cart state",
      "scenario": "Model add, remove, and clear actions for a cart consumed by a header and checkout view.",
      "acceptance": [
        "Actions and state transitions are explicit",
        "Only the needed subtree receives context",
        "Invalid transitions have a deliberate outcome"
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
      "scenario": "Create a todo list with add, toggle, delete, and filter capabilities. The todo items must persist in localStorage.",
      "constraints": [
        "Use useReducer for state management",
        "Persist todos to localStorage from a Client Component with hydration-safe initialization",
        "Validate parsed storage data before using it as application state",
        "Filter buttons: All, Active, Completed"
      ],
      "acceptanceCriteria": [
        "Can add new todos by typing and pressing Enter",
        "Can toggle todo completion by clicking the checkbox",
        "Can delete a todo",
        "Filter buttons show only matching todos",
        "Todos survive page refresh"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Define a Todo type and a reducer with actions: ADD, TOGGLE, DELETE."
        },
        {
          "stage": 2,
          "text": "Keep browser storage behind a Client Component boundary and initialize after hydration or with a validated browser-only loader."
        },
        {
          "stage": 3,
          "text": "Use a useEffect to sync validated state to localStorage whenever todos change."
        }
      ],
      "expectedReasoning": "Reducer centralizes state logic. A Client Component loads and validates browser storage without reading localStorage during the server render, then writes state in an Effect. Filter is derived state computed during render from the full todo list.",
      "commonWrongPaths": [
        "Trying to store the filtered list instead of deriving it",
        "Not handling the initial localStorage read (null case)"
      ],
      "answerExplanation": "The reducer handles ADD, TOGGLE, and DELETE actions. Keep storage access in a Client Component, avoid reading localStorage during the server render, and validate the parsed value before adopting it. A useEffect syncs validated todos to localStorage. The filter is `const filtered = todos.filter(t => filter === \"all\" ? true : filter === \"active\" ? !t.done : t.done)`.",
      "followUpVariation": "Add drag-and-drop reordering and a \"Clear Completed\" button.",
      "sourceLink": "https://react.dev/reference/react/useReducer"
    }
  ],
  "qa": [
    {
      "id": "loop-qa-use-reducer-and-context-1",
      "topicId": "use-reducer-and-context",
      "topicFamily": "state-behavior",
      "question": "What problem does useReducer & Context help you solve?",
      "answer": "As components grow, scattered useState calls become hard to reason about. Reducers centralize state update logic. Context eliminates prop drilling. Together, they form the foundation of lightweight, library-free state management that scales from small apps to production systems.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
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
      "question": "How would you explain the core idea of useReducer & Context to a teammate?",
      "answer": "What are three signs that you should use useReducer instead of multiple useState calls? A strong explanation should connect the model to: Recognize when useState is insufficient and useReducer is appropriate; Write reducer functions following the dispatch/action/reducer pattern.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
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
      "question": "What evidence shows that you can apply useReducer & Context?",
      "answer": "Can write a reducer function following the (state, action) -> state pattern · Knows when to use useReducer vs useState · Can create Context providers and consume them with useContext",
      "followUp": "What failure case would you test before calling this skill reliable?",
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
