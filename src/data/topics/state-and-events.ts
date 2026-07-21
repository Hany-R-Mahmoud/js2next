import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "state-and-events",
  "lesson": {
    "slug": "state-and-events",
    "title": "State & Events in React",
    "topicFamily": "state-behavior",
    "level": "beginner",
    "prerequisites": [
      "components-and-jsx"
    ],
    "learningObjectives": [
      "Choose state only for information that must persist between renders and can change",
      "Explain state snapshots and queued updates inside an event handler",
      "Use functional updaters and immutable values for dependent transitions",
      "Place one source of truth at the closest owner shared by its consumers"
    ],
    "whyMatters": "State gives a component memory across renders, while events describe what happened. Predictable interfaces keep one owner for each fact, derive redundant values during render, and express state transitions without relying on a stale render snapshot.",
    "estimatedMinutes": 32,
    "sections": [
      {
        "id": "state-vs-props",
        "type": "concept",
        "title": "State is owned memory; props are inputs",
        "content": "State is information a component asks React to retain between renders. Props are the inputs chosen by a parent for the current render. Local variables are recalculated on every render, while refs retain a mutable value without requesting a render.\n\nStore a value in state only if it can change over time and the rendered output needs to respond. If a value can be calculated entirely from current props and state, derive it during render. Keeping one source of truth removes synchronization bugs."
      },
      {
        "id": "usestate-basics",
        "type": "code-example",
        "title": "Express transitions through the setter",
        "content": "A state setter queues another render. When the next value depends on previous state, pass an updater function. Return a new object or array instead of mutating the current state value.",
        "code": "function Quantity() {\n  const [count, setCount] = useState(0);\n\n  function increment() {\n    setCount(current => current + 1);\n  }\n\n  function decrement() {\n    setCount(current => Math.max(0, current - 1));\n  }\n\n  return (\n    <div>\n      <button onClick={decrement} disabled={count === 0}>−</button>\n      <output aria-live=\"polite\">{count}</output>\n      <button onClick={increment}>+</button>\n    </div>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/state/Counter.tsx"
      },
      {
        "id": "state-batching",
        "type": "concept",
        "title": "Handlers read one render snapshot",
        "content": "During one render, the state variables visible to its event handlers are fixed. Calling a setter queues work; it does not change the variable inside the running handler. React batches queued updates and processes them after the event handler finishes.\n\nPassing a value such as `setCount(count + 1)` queues a replacement calculated from this render’s snapshot. Passing `setCount(current => current + 1)` queues a function that React applies to the pending state in order. Use the updater whenever the transition depends on previous state."
      },
      {
        "id": "lifting-state",
        "type": "code-example",
        "title": "Lift one source of truth to the common owner",
        "content": "When siblings must coordinate, move the shared fact to their closest common parent. The parent passes the current value down and event callbacks back up. A controlled child reflects those props instead of keeping a competing copy.",
        "code": "function Accordion() {\n  const [openId, setOpenId] = useState<string | null>(null);\n\n  return sections.map(item => (\n    <Panel\n      key={item.id}\n      title={item.title}\n      isOpen={openId === item.id}\n      onToggle={() =>\n        setOpenId(current => current === item.id ? null : item.id)\n      }\n    >\n      {item.content}\n    </Panel>\n  ));\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/state/Accordion.tsx"
      },
      {
        "id": "state-question",
        "type": "question",
        "title": "Check your understanding",
        "content": "",
        "questions": [
          {
            "id": "q4",
            "question": "Starting from `count === 0`, a click handler runs `setCount(count + 1); setCount(current => current + 1); alert(count);`. What happens?",
            "options": [
              "The next render shows 1 and the alert shows 0",
              "The next render shows 2 and the alert shows 0",
              "The next render shows 2 and the alert shows 2",
              "The next render shows 1 and the alert shows 1"
            ],
            "correctAnswer": "The next render shows 2 and the alert shows 0",
            "expectedReasoning": "The first call queues replacement state 1 from the current snapshot. The updater then receives pending state 1 and returns 2. The current handler still reads the snapshot value 0, so the alert shows 0. React renders with 2 after the handler finishes.",
            "commonMisconceptions": [
              "Expecting a setter to mutate the state variable inside the current handler",
              "Assuming a functional updater ignores replacements already queued before it"
            ]
          }
        ]
      },
      {
        "id": "state-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Choose the smallest owner that must remember a changing fact. Keep state minimal, derive redundant values during render, and send events to the owner that can perform the transition. Inside a handler, reason from its render snapshot and use functional updaters for transitions that depend on queued previous state."
      }
    ],
    "retrievalPrompt": "Explain why a state variable does not change inside the current handler, when a functional updater is required, and how to choose the owner of state shared by two components.",
    "reflectionPrompt": "Find one state value in your code that could be derived from props or other state. What synchronization path disappears if you remove it?",
    "masteryCriteria": [
      "Can distinguish props, local variables, refs, and state by lifetime and ownership",
      "Can predict queued state updates from a render snapshot",
      "Can write dependent updates with functional updaters and immutable values",
      "Can lift state without creating a second source of truth"
    ],
    "nextTopics": [
      "use-reducer-and-context"
    ],
    "metadata": {
      "reactVersion": "19.2",
      "lastUpdated": "2026-07-20",
      "sources": [
        "https://react.dev/learn/responding-to-events",
        "https://react.dev/learn/state-a-components-memory",
        "https://react.dev/learn/state-as-a-snapshot",
        "https://react.dev/learn/queueing-a-series-of-state-updates",
        "https://react.dev/learn/choosing-the-state-structure"
      ]
    },
    "diagram": {
      "title": "An event becomes a new render",
      "kind": "flow",
      "nodes": [
        {
          "id": "event",
          "label": "User event",
          "role": "Handler reads current snapshot"
        },
        {
          "id": "queue",
          "label": "Update queue",
          "role": "Setter schedules work"
        },
        {
          "id": "render",
          "label": "Next render",
          "role": "State snapshot changes"
        },
        {
          "id": "commit",
          "label": "Commit",
          "role": "UI reflects the result"
        }
      ],
      "edges": [
        {
          "from": "event",
          "to": "queue"
        },
        {
          "from": "queue",
          "to": "render"
        },
        {
          "from": "render",
          "to": "commit"
        }
      ]
    },
    "chunks": [
      {
        "id": "state-and-events-retrieval-1",
        "title": "Queue dependent updates",
        "concept": "Repeated value replacements read one render snapshot; updater functions compose over pending state.",
        "prediction": {
          "prompt": "Which sequence reliably increments by three in one handler?",
          "options": [
            "`setCount(count + 1)` three times",
            "`setCount(current => current + 1)` three times"
          ],
          "correctAnswer": "`setCount(current => current + 1)` three times",
          "feedbackCorrect": "React applies each updater to the pending result of the previous updater.",
          "feedbackWrong": "Each value replacement calculates from the same snapshot and requests the same next value."
        },
        "synthesis": "Use an updater when the next state is a function of pending previous state."
      }
    ],
    "miniProject": {
      "title": "Build a predictable counter",
      "scenario": "Build a controlled quantity selector shared by an item row and a cart summary.",
      "acceptance": [
        "One owner stores the quantity and both consumers receive the same value",
        "Increment and decrement transitions use previous state safely and never go below zero",
        "Availability and milestone labels are derived rather than separately stored"
      ],
      "rubric": [
        {
          "dimension": "State",
          "evidence": "Transitions are correct for repeated and boundary values."
        },
        {
          "dimension": "Derivation",
          "evidence": "Milestone output is computed from the source count."
        },
        {
          "dimension": "Interaction",
          "evidence": "Controls and feedback are observable and keyboard-usable."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "implement-counter",
      "title": "Implement a Counter Component",
      "level": 2,
      "topicFamily": "state-behavior",
      "scenario": "Build a typed counter with increment, decrement, reset, and a milestone label derived from the current count.",
      "constraints": [
        "Use TypeScript and keep one numeric state value",
        "The count must never go below 0",
        "Do not store the milestone label or boolean in separate state"
      ],
      "acceptanceCriteria": [
        "Increment and decrement use transitions based on previous state",
        "Reset sets the count to 0 and decrement is clamped at 0",
        "The UI shows `Milestone: 10!`, `Milestone: 20!`, and so on only at positive multiples of 10",
        "Rapid clicks cannot lose increments"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Store only `count`. Write down which other displayed values can be calculated from it."
        },
        {
          "stage": 2,
          "text": "Use functional updaters for increment and decrement; clamp decrement with `Math.max`."
        },
        {
          "stage": 3,
          "text": "Derive `const milestone = count > 0 && count % 10 === 0` during render."
        }
      ],
      "expectedReasoning": "The count is the only independent changing fact. Each dependent transition uses the queued previous count. The milestone is a pure projection of current count, so storing it would create a second synchronization problem.",
      "commonWrongPaths": [
        "Calling `setCount(count + 1)` repeatedly and assuming each call sees a changed variable",
        "Storing a milestone boolean and trying to keep it synchronized with count"
      ],
      "answerExplanation": "Use one `useState<number>(0)`. Increment with `setCount(current => current + 1)`, decrement with `setCount(current => Math.max(0, current - 1))`, and reset with `setCount(0)`. Derive the milestone expression while rendering; no Effect or duplicate state is needed.",
      "followUpVariation": "Add a step-size prop. Which component should own the step when two counters must share it?",
      "sourceLink": "https://react.dev/learn/queueing-a-series-of-state-updates",
      "sourceLinks": [
        "https://react.dev/reference/react/useState"
      ]
    }
  ],
  "qa": [
    {
      "id": "qa-11",
      "question": "Why does a state variable not change immediately after its setter is called?",
      "answer": "The setter queues a future render. The running handler keeps the state snapshot from the render that created it, while React processes queued replacements and updater functions after the handler finishes.",
      "followUp": "How are a queued replacement and a queued updater processed differently?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "useState",
        "batching",
        "closure"
      ],
      "topicId": "state-and-events",
      "topicFamily": "state-behavior",
      "sourceLink": "https://react.dev/learn/state-as-a-snapshot",
      "sourceLinks": [
        "https://react.dev/reference/react/useState"
      ]
    },
    {
      "id": "loop-qa-state-and-events-1",
      "topicId": "state-and-events",
      "topicFamily": "state-behavior",
      "question": "What should become state, and what should remain derived?",
      "answer": "State should represent an independent fact that changes over time and must affect rendering. Values fully determined by current props and state should be calculated during render so the UI has one source of truth.",
      "followUp": "Which state value in your feature can be deleted and derived instead?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "state-and-events"
      ],
      "sourceLink": "https://react.dev/learn/state-a-components-memory"
    },
    {
      "id": "loop-qa-state-and-events-2",
      "topicId": "state-and-events",
      "topicFamily": "state-behavior",
      "question": "How do state snapshots and functional updaters work together?",
      "answer": "A handler reads one render snapshot. A functional updater does not change that snapshot; it tells React how to calculate the next state from the pending previous state when queued updates are processed.",
      "followUp": "Predict the result of mixing a replacement update and an updater in one handler.",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "state-and-events"
      ],
      "sourceLink": "https://react.dev/learn/state-a-components-memory"
    }
  ],
  "practices": [
    {
      "id": "bp-4",
      "title": "Use an Updater for a Previous-State Transition",
      "summary": "Pass `current => next` when the next state is calculated from previous state.",
      "rationale": "Handlers read a render snapshot, and React may queue several updates before rendering. Updaters are applied in queue order to pending state, so dependent transitions compose correctly.",
      "tradeOffs": "An updater is unnecessary when replacing state with a value that does not depend on previous state, such as `setOpen(true)` or `setCount(0)`.",
      "appliesWhen": "Incrementing, toggling, appending, removing, or otherwise calculating from previous state.",
      "doesNotApplyWhen": "Replacing state with a fixed or externally supplied value independent of the previous state.",
      "example": "`setCount(current => current + 1)` expresses a dependent transition; `setCount(0)` expresses a reset.",
      "sourceLink": "https://react.dev/learn/queueing-a-series-of-state-updates",
      "sourceLinks": [
        "https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state"
      ],
      "tags": [
        "useState",
        "closure",
        "batching"
      ],
      "topicId": "state-and-events",
      "topicFamily": "state-behavior"
    },
    {
      "id": "bp-5",
      "title": "Derive Redundant Values During Render",
      "summary": "Calculate values from current props and state instead of storing synchronized copies.",
      "rationale": "A redundant state value creates another owner and another update path. Render-time derivation is recalculated from the same inputs and cannot drift behind them.",
      "tradeOffs": "An actually expensive pure calculation may justify measured memoization, but memoization is not a reason to duplicate the value in state.",
      "appliesWhen": "The value is completely determined by current props or state.",
      "doesNotApplyWhen": "The value can change independently or must preserve user input that is not derivable from the current inputs.",
      "example": "`const isMilestone = count > 0 && count % 10 === 0` belongs in render, not in a second state variable.",
      "sourceLink": "https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state",
      "tags": [
        "state",
        "performance",
        "architecture"
      ],
      "topicId": "state-and-events",
      "topicFamily": "state-behavior"
    }
  ],
  "meta": {
    "topicFamily": "state-behavior",
    "level": "beginner",
    "title": "State & Events in React"
  }
};
