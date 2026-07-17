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
      "Understand what state is and how it differs from props",
      "Use useState to manage local component state",
      "Handle user events and update state in response",
      "Lift state up when multiple components need to share it"
    ],
    "whyMatters": "State is memory for your component. Without state, a React app is a static HTML page. Understanding what should be state, where it should live, and how to update it determines whether your app behaves predictably or becomes a debugging nightmare.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "state-vs-props",
        "type": "concept",
        "title": "State vs Props",
        "content": "Props are passed to a component by its parent — like function arguments. State is managed within the component — like local variables that persist across renders and trigger re-renders when changed.\n\nThe key difference: a component can change its own state. It cannot change its own props. State belongs to the component; props come from above."
      },
      {
        "id": "usestate-basics",
        "type": "code-example",
        "title": "useState: the state hook",
        "content": "`useState` returns an array with two items: the current state value and a setter function. Call the setter to update state and trigger a re-render.",
        "code": "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n      <button onClick={() => setCount(0)}>Reset</button>\n    </div>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/state/Counter.tsx"
      },
      {
        "id": "state-batching",
        "type": "concept",
        "title": "State updates are batched and asynchronous",
        "content": "React batches multiple state updates from the same event handler into a single re-render. This means that reading state immediately after calling a setter will give you the old value. Use the functional updater form — `setCount(c => c + 1)` — when the new state depends on the previous state."
      },
      {
        "id": "lifting-state",
        "type": "code-example",
        "title": "Lifting state up",
        "content": "When two sibling components need to share state, \"lift\" the state to their closest common parent. The parent holds the state and passes it down as props, along with setter callbacks.",
        "code": "function Accordion() {\n  const [openIndex, setOpenIndex] = useState<number | null>(null);\n\n  return (\n    <div>\n      {panels.map((panel, i) => (\n        <Panel\n          key={panel.id}\n          title={panel.title}\n          isOpen={openIndex === i}\n          onToggle={() => setOpenIndex(openIndex === i ? null : i)}\n        />\n      ))}\n    </div>\n  );\n}",
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
            "question": "After clicking \"Increment\" once, what does the alert show?",
            "options": [
              "0",
              "1",
              "3",
              "undefined"
            ],
            "correctAnswer": "0",
            "expectedReasoning": "All three setCount calls use the same `count` value from the current render's closure (0). They all set the count to 0+1=1, not 0, then 1, then 2. React batches them into one update. The alert reads `count` from the current closure, which is still 0. This is the stale closure problem.",
            "commonMisconceptions": [
              "Thinking each setCount call uses the updated value",
              "Not knowing that state reads are from the current closure"
            ]
          }
        ]
      },
      {
        "id": "state-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "State is local, mutable memory for a component. But it's not directly mutable — you must use the setter. State updates are batched. When state is needed by multiple children, lift it up. When state is needed across distant parts of the tree, reach for context or a state management library. The question 'where should this state live?' is one of the most important architectural decisions you'll make in React."
      }
    ],
    "retrievalPrompt": "Explain why React batches state updates. What problem would occur if it didn't?",
    "reflectionPrompt": "In your own projects, do you have state that should be lifted up? What would change if you moved it?",
    "masteryCriteria": [
      "Can distinguish state from props",
      "Can use useState with proper update patterns",
      "Understands that state updates are asynchronous and batched",
      "Can lift state up to a common ancestor component"
    ],
    "nextTopics": [
      "use-reducer-and-context"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-01",
      "sources": [
        "https://react.dev/learn/state-a-components-memory"
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
        "title": "Predict repeated updates",
        "concept": "When the next value depends on the previous one, updater functions compose queued changes against the latest pending state.",
        "prediction": {
          "prompt": "What is the safest form for three increments in one handler?",
          "options": [
            "setCount(count + 1) three times",
            "setCount(current => current + 1) three times"
          ],
          "correctAnswer": "setCount(current => current + 1) three times",
          "feedbackCorrect": "Each updater receives the pending state.",
          "feedbackWrong": "The direct value can repeat the same captured snapshot."
        },
        "synthesis": "Events schedule state transitions; the next render exposes the updated snapshot."
      }
    ],
    "miniProject": {
      "title": "Build a predictable counter",
      "scenario": "Design a counter with increment, decrement, reset, and milestone feedback.",
      "acceptance": [
        "Previous-state updates remain correct under rapid clicks",
        "Derived milestone feedback is not duplicated in state",
        "Keyboard and button semantics are explicit"
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
      "scenario": "Build a counter that increments, decrements, and resets. Display a message when the count reaches milestones.",
      "constraints": [
        "Use TypeScript",
        "The count must not go below 0",
        "Show \"Milestone: 10!\" when reaching multiples of 10"
      ],
      "acceptanceCriteria": [
        "Increment button adds 1",
        "Decrement button subtracts 1 (min 0)",
        "Reset button sets count to 0",
        "Milestone message appears at 10, 20, 30... and disappears after 2 seconds"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Use useState<number>(0) for the count."
        },
        {
          "stage": 2,
          "text": "For the milestone, derive a boolean from the count: `count > 0 && count % 10 === 0`."
        },
        {
          "stage": 3,
          "text": "Use a useEffect with a timeout to clear the milestone message."
        }
      ],
      "expectedReasoning": "State for count, event handlers for increment/decrement/reset, derived state for milestone detection, useEffect for auto-clearing the message.",
      "commonWrongPaths": [
        "Storing milestone as separate state instead of deriving it",
        "Forgetting to clear the timeout in the useEffect cleanup"
      ],
      "answerExplanation": "The milestone should be derived during render (`count > 0 && count % 10 === 0`). The auto-clear uses useEffect with a timeout that resets a `showMilestone` state, with proper cleanup of the timeout.",
      "followUpVariation": "Add a step size input that changes how much each click increments/decrements by.",
      "sourceLink": "https://react.dev/reference/react/useState"
    }
  ],
  "qa": [
    {
      "id": "qa-11",
      "question": "Why does useState not update immediately after calling the setter?",
      "answer": "Calling a setter queues a future render; it does not change the state variable already captured by the current render. React may batch multiple updates, so code in the current handler still reads the old snapshot. If the next state depends on the previous state, use the functional updater: `setCount(prev => prev + 1)`.",
      "followUp": "What happens if you call setState multiple times in the same event handler?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "useState",
        "batching",
        "closure"
      ],
      "topicId": "state-and-events",
      "topicFamily": "state-behavior",
      "sourceLink": "https://react.dev/reference/react/useState"
    },
    {
      "id": "loop-qa-state-and-events-1",
      "topicId": "state-and-events",
      "topicFamily": "state-behavior",
      "question": "What problem does State & Events in React help you solve?",
      "answer": "State is memory for your component. Without state, a React app is a static HTML page. Understanding what should be state, where it should live, and how to update it determines whether your app behaves predictably or becomes a debugging nightmare.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
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
      "question": "How would you explain the core idea of State & Events in React to a teammate?",
      "answer": "Explain why React batches state updates. What problem would occur if it didn't? A strong explanation should connect the model to: Understand what state is and how it differs from props; Use useState to manage local component state.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
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
      "title": "Use the Functional Updater for State that Depends on Previous State",
      "summary": "Use `setCount(c => c + 1)` instead of `setCount(count + 1)` whenever the new state depends on the previous state value.",
      "rationale": "React batches state updates. Multiple calls to `setCount(count + 1)` in the same handler all read the same closure-captured `count`. The functional updater receives the most recent state as its argument, ensuring correct increment.",
      "tradeOffs": "Slightly more verbose. For simple updates that do not depend on previous state (e.g., `setOpen(true)`), the direct value is fine.",
      "appliesWhen": "The new state is computed from the previous state, especially if there could be multiple updates batched together.",
      "doesNotApplyWhen": "The new state is independent of the previous state (e.g., setting a fixed value, resetting to initial).",
      "example": "`setCount(count + 1)` may lose updates when called multiple times rapidly. `setCount(c => c + 1)` is the appropriate form when this transition depends on the previous count.",
      "sourceLink": "https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state",
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
      "title": "Derive State Instead of Storing It",
      "summary": "If a value can be computed from existing state or props during render, compute it — do not store it in a separate state variable.",
      "rationale": "Storing derived state creates a synchronization problem: you must keep the derived state in sync with the source state. This leads to bugs where they diverge. Computation during render is always consistent.",
      "tradeOffs": "For very expensive computations, memoization (useMemo) may be appropriate. But measure first — most derived computations are cheap enough.",
      "appliesWhen": "A value is fully determined by existing state or props.",
      "doesNotApplyWhen": "The value needs to persist independently, or the computation triggers a side effect. In these cases, it is not truly \"derived.\"",
      "example": "`const isFull = items.length >= maxItems` — derived from items and maxItems. Do not store `isFull` in state.",
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
