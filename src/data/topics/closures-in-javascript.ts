import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "closures-in-javascript",
  "lesson": {
    "slug": "closures-in-javascript",
    "title": "Closures in JavaScript",
    "topicFamily": "foundations",
    "level": "beginner",
    "prerequisites": [],
    "learningObjectives": [
      "Define a closure as a function together with access to its lexical environment",
      "Trace captured bindings across calls and distinguish separate closure instances",
      "Predict which render snapshot a React callback can read",
      "Choose an updater, ref, dependency, or explicit argument for the boundary being fixed"
    ],
    "whyMatters": "Closures determine what callbacks can read. In React, every render creates new props, state values, and handlers, so a delayed callback can legitimately retain an older render snapshot. A precise closure model prevents lost updates and “stale value” fixes that solve the wrong problem.",
    "estimatedMinutes": 28,
    "sections": [
      {
        "id": "closure-definition",
        "type": "concept",
        "title": "What is a closure?",
        "content": "A closure is a function together with access to the lexical environment where that function was created. JavaScript creates closures whenever it creates functions. Name lookup follows the function’s source-code nesting, not the place where the function is later called.\n\nA closure retains access to bindings. If a captured `let` binding changes, the closure can observe the changed binding. React adds a separate idea: each component render calls the component again and creates a new `const` binding for that render’s props and state. A handler created in that render closes over those particular bindings, so the handler reads that render’s snapshot."
      },
      {
        "id": "closure-example-basic",
        "type": "code-example",
        "title": "Trace one lexical environment",
        "content": "Each call to `createCounter` creates a new `count` binding. Repeated calls to one returned function share its binding; another counter has a different binding.",
        "code": "function createCounter() {\n  let count = 0;\n\n  return function increment() {\n    count += 1;\n    return count;\n  };\n}\n\nconst first = createCounter();\nconst second = createCounter();\n\nconsole.log(first());  // 1\nconsole.log(first());  // 2\nconsole.log(second()); // 1",
        "codeLanguage": "javascript",
        "codeFilePath": "examples/closures/createCounter.js"
      },
      {
        "id": "closure-question-1",
        "type": "question",
        "title": "Check your understanding",
        "content": "",
        "questions": [
          {
            "id": "q1",
            "question": "After the code example runs, what does a third call to `first()` return?",
            "options": [
              "1",
              "2",
              "3",
              "undefined"
            ],
            "correctAnswer": "3",
            "expectedReasoning": "`first` closes over one `count` binding. Its first two calls changed that binding from 0 to 1 and then 2. The third call changes the same binding to 3. Calls to `second` use a separate environment and do not reset `first`.",
            "commonMisconceptions": [
              "Assuming a local variable is recreated every time the returned function runs",
              "Assuming `second()` changes the binding captured by `first`"
            ]
          }
        ]
      },
      {
        "id": "closure-react",
        "type": "concept",
        "title": "Render snapshots are separate lexical bindings",
        "content": "A component render calculates JSX and creates event handlers from that render’s props and state. Calling a state setter requests another render; it does not change the state variable inside an already-running handler. A timer, promise callback, or subscription created by that handler therefore keeps reading the snapshot it closed over unless the program deliberately supplies another read strategy.\n\nThis is normal JavaScript behavior, not React “failing to update” a variable. First decide what the callback should mean: preserve the value at scheduling time, compute a state transition from the latest queued state, or read the latest value when the callback eventually runs."
      },
      {
        "id": "closure-react-code",
        "type": "code-example",
        "title": "A correct update can coexist with a stale read",
        "content": "The updater increments correctly, but the timeout still logs the `count` binding from the render that created `handleClick`.",
        "code": "function DelayedCount() {\n  const [count, setCount] = useState(0);\n\n  function handleClick() {\n    setCount(current => current + 1);\n\n    setTimeout(() => {\n      console.log(count); // snapshot from this render\n    }, 1000);\n  }\n\n  return <button onClick={handleClick}>Count: {count}</button>;\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/closures/StaleClosureCounter.tsx"
      },
      {
        "id": "closure-fix",
        "type": "concept",
        "title": "Match the remedy to the requirement",
        "content": "Use a functional updater when the next state depends on queued previous state: `setCount(current => current + 1)`. That fixes the transition, but it does not alter callbacks that already exist.\n\nIf a callback should preserve the value from the moment it was scheduled, pass that value as an argument or close over a deliberately named local value. If it must read the latest value when it runs, use an explicit latest-value channel such as a ref and keep that channel synchronized. If an Effect synchronizes with an external system, declare every reactive dependency and let React recreate the synchronization when those inputs change. These strategies solve different problems and are not interchangeable."
      },
      {
        "id": "closure-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Closures follow lexical scope. React render snapshots follow from creating new bindings on each component call. When a callback appears stale, identify the required time boundary before changing code: creation-time value, latest queued transition, latest mutable read, or renewed external synchronization. Then choose the smallest mechanism that expresses that requirement."
      }
    ],
    "retrievalPrompt": "Define a closure without using the word “remember.” Then explain why a callback created during one React render can read an older state value after a later render.",
    "reflectionPrompt": "Find one delayed callback, subscription, or event handler in your code. Does it need the value from creation time, the latest value, or only a correct state transition?",
    "masteryCriteria": [
      "Can explain that closures retain access to lexical bindings, not frozen copies of arbitrary objects",
      "Can trace two closure instances without mixing their environments",
      "Can predict a callback result from the render that created it",
      "Can choose a fix based on whether the job is a transition, latest read, or synchronization"
    ],
    "nextTopics": [
      "async-js-promises"
    ],
    "metadata": {
      "reactVersion": "19.2",
      "lastUpdated": "2026-07-20",
      "sources": [
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures",
        "https://react.dev/learn/state-as-a-snapshot",
        "https://react.dev/learn/queueing-a-series-of-state-updates",
        "https://react.dev/reference/react/useRef"
      ]
    },
    "diagram": {
      "title": "From render to callback value",
      "kind": "flow",
      "nodes": [
        {
          "id": "render",
          "label": "Render snapshot",
          "role": "Props and state for one render"
        },
        {
          "id": "callback",
          "label": "Callback closure",
          "role": "Captures the render binding"
        },
        {
          "id": "strategy",
          "label": "Choose a strategy",
          "role": "Updater, ref, or dependency"
        }
      ],
      "edges": [
        {
          "from": "render",
          "to": "callback"
        },
        {
          "from": "callback",
          "to": "strategy",
          "label": "debug the stale read"
        }
      ]
    },
    "chunks": [
      {
        "id": "closures-in-javascript-retrieval-1",
        "title": "Separate transition correctness from read timing",
        "concept": "A functional updater computes from the latest queued state; it does not rewrite the lexical bindings of an existing callback.",
        "prediction": {
          "prompt": "A timeout must read the latest committed value when it fires. Which strategy addresses that read requirement?",
          "options": [
            "Only switch the setter to a functional updater",
            "Read through an explicitly synchronized latest-value ref"
          ],
          "correctAnswer": "Read through an explicitly synchronized latest-value ref",
          "feedbackCorrect": "A ref can provide a deliberate latest-value channel without pretending the old closure changed.",
          "feedbackWrong": "The updater fixes how state is calculated. The timeout still has the bindings from the render that created it."
        },
        "synthesis": "Name the time boundary first; then choose updater, argument, ref, or dependency."
      }
    ],
    "miniProject": {
      "title": "Repair a delayed notification",
      "scenario": "Repair a notification counter whose delayed messages report values from the wrong time boundary.",
      "acceptance": [
        "Rapid updates do not lose state transitions",
        "The delayed read explicitly implements either scheduled-time or latest-time semantics",
        "A short note explains why the chosen semantics match the product requirement"
      ],
      "rubric": [
        {
          "dimension": "Closure model",
          "evidence": "The explanation distinguishes lexical binding from a React render snapshot."
        },
        {
          "dimension": "Correctness",
          "evidence": "Rapid updates and delayed output are both verified."
        },
        {
          "dimension": "Choice",
          "evidence": "Updater, ref, or dependency strategy is justified by the job."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "fix-stale-closure",
      "title": "Fix the Stale Closure",
      "level": 1,
      "topicFamily": "foundations",
      "scenario": "A notification counter increments correctly, but delayed messages read the count from the render that scheduled them. Product requires every delayed message to report the latest notification total when it fires.",
      "constraints": [
        "Keep the `setTimeout` boundary",
        "Use a functional state updater so rapid increments cannot lose transitions",
        "Use an explicit latest-value channel for the delayed read"
      ],
      "acceptanceCriteria": [
        "Three rapid clicks render a count of 3",
        "Every delayed message produced by those clicks reports 3 when it fires",
        "The explanation distinguishes transition correctness from callback read timing"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write down two questions separately: how is the next count calculated, and where does the timeout read its value?"
        },
        {
          "stage": 2,
          "text": "Use `setCount(current => current + 1)` for the transition. This does not change the timeout’s existing closure."
        },
        {
          "stage": 3,
          "text": "Keep a ref as the deliberate latest-value channel and update it along the same event path before the timeout reads it."
        }
      ],
      "expectedReasoning": "The state updater must derive from queued state, while the delayed callback needs a separate latest-value source. A ref can cross render boundaries without forcing another render. The implementation must keep the ref and state transitions coordinated for every update path.",
      "commonWrongPaths": [
        "Changing only the setter to a functional updater and leaving the timeout reading `count`",
        "Adding a dependency array even though this behavior belongs to an event and timeout, not external synchronization"
      ],
      "answerExplanation": "Use the functional updater for React state and a ref for the timeout’s latest read. The updater prevents lost increments; the ref gives callbacks created by older renders one deliberate place to read the latest total. Document that all count updates must also maintain that channel.",
      "followUpVariation": "Change the requirement so each message reports the total at scheduling time. Which local value should the callback capture instead?",
      "starterCode": "function NotificationCounter() {\n  const [count, setCount] = useState(0);\n\n  function handleNotify() {\n    setCount(count + 1);\n    setTimeout(() => {\n      alert(`You have ${count} notifications`);\n    }, 2000);\n  }\n\n  return <button onClick={handleNotify}>Notify ({count})</button>;\n}",
      "sourceLink": "https://react.dev/learn/state-as-a-snapshot"
    }
  ],
  "qa": [
    {
      "id": "loop-qa-closures-in-javascript-1",
      "topicId": "closures-in-javascript",
      "topicFamily": "foundations",
      "question": "What does a closure preserve, and why does that matter in a React callback?",
      "answer": "A closure preserves access to bindings in its lexical environment. A React callback is recreated during a render and closes over that render’s props and state bindings, so a delayed callback can read an older render snapshot even after state has triggered a newer render.",
      "followUp": "Is the callback supposed to preserve its scheduling-time value or read the latest value when it runs?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "closures-in-javascript"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures"
    },
    {
      "id": "loop-qa-closures-in-javascript-2",
      "topicId": "closures-in-javascript",
      "topicFamily": "foundations",
      "question": "Why does a functional state updater not automatically fix every stale callback?",
      "answer": "The updater changes how React calculates the next queued state. It does not mutate lexical bindings inside callbacks that were already created. A latest read needs a separate strategy; a scheduling-time read may need no fix at all.",
      "followUp": "Show one example where an updater is enough and one where a ref or explicit argument is required.",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "closures-in-javascript"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures"
    },
    {
      "id": "loop-qa-closures-in-javascript-3",
      "topicId": "closures-in-javascript",
      "topicFamily": "foundations",
      "question": "How do you choose among an updater, ref, dependency, and explicit argument?",
      "answer": "Use an updater for a transition based on previous state, a ref for an intentional latest mutable read, dependencies for synchronization that must be recreated when reactive inputs change, and an explicit argument or local binding when the callback should preserve a scheduling-time value.",
      "followUp": "Which choice makes the time semantics easiest for a reviewer to verify?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "closures-in-javascript"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures"
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "foundations",
    "level": "beginner",
    "title": "Closures in JavaScript"
  }
};
