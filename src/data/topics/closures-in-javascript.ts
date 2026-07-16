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
      "Define what a closure is in precise terms",
      "Trace variable access through nested function scopes",
      "Identify closures in React hooks and event handlers",
      "Avoid common closure-related bugs in React"
    ],
    "whyMatters": "Closures are the invisible mechanism behind every useState, useEffect, and event handler in React. Without understanding closures, you cannot reliably predict when your components will see stale state or why your effects fire when they do.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "closure-definition",
        "type": "concept",
        "title": "What is a closure?",
        "content": "A closure is created when a function retains access to variables from its outer lexical scope, even after that outer function has finished executing. The function \"closes over\" the variables — hence the name.\n\nIn ordinary JavaScript, a closure retains access to a lexical binding. React adds an important distinction: each render creates a new snapshot of props and state, so a callback created during one render sees that render's values. Do not treat React state in a callback as a live read of the latest render."
      },
      {
        "id": "closure-example-basic",
        "type": "code-example",
        "title": "Basic closure example",
        "content": "Observe how `createCounter` returns a function that still has access to `count` long after `createCounter` has returned.",
        "code": "function createCounter() {\n  let count = 0;\n  return function increment() {\n    count += 1;\n    return count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\nconsole.log(counter()); // 3\n\n// createCounter's execution is done — but count lives on.\n// Why? Because increment() closes over count.",
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
            "question": "What value does `logCount()` print on the third call?",
            "options": [
              "0",
              "1",
              "2",
              "3",
              "undefined"
            ],
            "correctAnswer": "3",
            "expectedReasoning": "The closure keeps the same `count` binding. Each call increments before returning: first call returns 1, second returns 2, third returns 3.",
            "commonMisconceptions": [
              "Thinking count resets to 0 each call",
              "Forgetting the increment happens before the return"
            ]
          }
        ]
      },
      {
        "id": "closure-react",
        "type": "concept",
        "title": "Closures in React",
        "content": "Every React hook that uses a callback forms a closure. When you write `useEffect(() => { console.log(value) }, [])`, the function inside closes over `value` from the render it was created in. If `value` changes in a later render, that effect does not automatically see the new render's value.\n\nThis is the root cause of \"stale closure\" bugs: a callback keeps the values from a past render because its identity and dependencies have not been updated."
      },
      {
        "id": "closure-react-code",
        "type": "code-example",
        "title": "Stale closure in a React component",
        "content": "Click the button rapidly. What does the alert show? Does it always show the latest count?",
        "code": "function Counter() {\n  const [count, setCount] = useState(0);\n\n  function handleClick() {\n    setCount(count + 1);\n    setTimeout(() => {\n      alert(count); // Which count is this?\n    }, 5000);\n  }\n\n  return <button onClick={handleClick}>Increment</button>;\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/closures/StaleClosureCounter.tsx"
      },
      {
        "id": "closure-fix",
        "type": "concept",
        "title": "Fixing stale closures",
        "content": "Use the functional updater form `setCount(c => c + 1)` when the next state depends on the previous state. That fixes the state transition, but it does not rewrite values captured by an already-created timeout or promise callback. Use a ref for a latest-value read, or include the reactive value in an Effect's dependencies when synchronization is the goal.\n\nReact re-renders create new functions with new render snapshots. Choose the fix that matches the job: functional updater for a state transition, ref for a latest mutable read, and dependencies for external synchronization."
      },
      {
        "id": "closure-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Closures are not a React feature — they're a JavaScript feature that React relies on heavily. Every time you see a function inside a component, you're looking at a closure. The function remembers the props and state from its render.\n\nWhen debugging: if a callback or effect is seeing \"old\" data, check whether it's a stale closure. The fix is usually: (1) add the variable to the dependency array, (2) use a ref, or (3) use a functional updater."
      }
    ],
    "retrievalPrompt": "Explain what a closure is in one sentence. Then describe what happens when a React effect with an empty dependency array accesses a state variable that changes across renders.",
    "reflectionPrompt": "Think of a bug you have encountered or can imagine in a React app. Would understanding closures have helped you debug it faster? Why or why not?",
    "masteryCriteria": [
      "Can explain what a closure captures (live reference, not snapshot)",
      "Can trace variable values through nested closures",
      "Can identify a stale closure bug in React code",
      "Can fix a stale closure using ref, functional updater, or dependency array"
    ],
    "nextTopics": [
      "async-js-promises"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-01",
      "sources": [
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures",
        "https://react.dev/learn/state-as-a-snapshot"
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
        "title": "Separate the two problems",
        "concept": "A functional updater fixes a state transition, while a delayed callback may still hold an older render snapshot.",
        "prediction": {
          "prompt": "Which fix addresses a delayed callback that must read the latest value?",
          "options": [
            "Only use a functional updater",
            "Use an explicit latest-value strategy such as a ref"
          ],
          "correctAnswer": "Use an explicit latest-value strategy such as a ref",
          "feedbackCorrect": "The updater and the callback-read problem are different boundaries.",
          "feedbackWrong": "A functional updater changes the queued state transition, not an existing closure."
        },
        "synthesis": "Match the fix to the boundary: transition, latest read, or synchronization."
      }
    ],
    "miniProject": {
      "title": "Repair a delayed notification",
      "scenario": "Review a notification counter that reports stale values after rapid clicks.",
      "acceptance": [
        "The state transition remains correct under rapid input",
        "The delayed read has an explicit current-value strategy",
        "The trade-off is explained in a short note"
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
      "scenario": "A notification counter shows the wrong count after rapid clicks. The developer used a closure that captures a stale value.",
      "constraints": [
        "Do not remove the setTimeout",
        "The alert must show the correct count after 2 seconds"
      ],
      "acceptanceCriteria": [
        "Clicking \"Notify\" 3 times rapidly should alert \"You have 3 notifications\" after 2 seconds",
        "The solution must use the functional updater form of setCount and a current-value strategy for the delayed alert"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Look at what value `count` holds at the time setTimeout fires."
        },
        {
          "stage": 2,
          "text": "setCount can accept a function: `setCount(c => c + 1)`, but that alone does not update the timeout closure."
        },
        {
          "stage": 3,
          "text": "Use a ref or another explicit current-value strategy for the delayed alert; use the functional updater for the state transition."
        }
      ],
      "expectedReasoning": "Each click creates a new closure capturing `count` from that render. The functional updater fixes the state transition, but the timeout still reads its old closure. Keep the latest count in a ref (or pass a computed value deliberately) for the delayed alert.",
      "commonWrongPaths": [
        "Changing only setCount to the functional updater while leaving the delayed alert reading count",
        "Adding count to a useEffect dependency array unnecessarily"
      ],
      "answerExplanation": "Use the functional updater for the state transition and a ref for the delayed read. Updating only `setCount` does not change the `count` captured by an already-created timeout callback.",
      "followUpVariation": "What if we wanted to debounce the notification instead? How would the solution change?",
      "starterCode": "function NotificationCounter() {\n  const [count, setCount] = useState(0);\n  const countRef = useRef(0);\n\n  function handleNotify() {\n    countRef.current += 1;\n    setCount(() => countRef.current);\n    setTimeout(() => {\n      alert(`You have ${countRef.current} notifications`);\n    }, 2000);\n  }\n\n  return <button onClick={handleNotify}>Notify ({count})</button>;\n}",
      "sourceLink": "https://react.dev/learn/state-as-a-snapshot"
    }
  ],
  "qa": [
    {
      "id": "loop-qa-closures-in-javascript-1",
      "topicId": "closures-in-javascript",
      "topicFamily": "foundations",
      "question": "What problem does Closures in JavaScript help you solve?",
      "answer": "Closures are the invisible mechanism behind every useState, useEffect, and event handler in React. Without understanding closures, you cannot reliably predict when your components will see stale state or why your effects fire when they do.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
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
      "question": "How would you explain the core idea of Closures in JavaScript to a teammate?",
      "answer": "Explain what a closure is in one sentence. Then describe what happens when a React effect with an empty dependency array accesses a state variable that changes across renders. A strong explanation should connect the model to: Define what a closure is in precise terms; Trace variable access through nested function scopes.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
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
      "question": "What evidence shows that you can apply Closures in JavaScript?",
      "answer": "Can explain what a closure captures (live reference, not snapshot) · Can trace variable values through nested closures · Can identify a stale closure bug in React code",
      "followUp": "What failure case would you test before calling this skill reliable?",
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
