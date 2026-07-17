import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "async-js-promises",
  "lesson": {
    "slug": "async-js-promises",
    "title": "Async JavaScript & Promises",
    "topicFamily": "foundations",
    "level": "beginner",
    "prerequisites": [
      "closures-in-javascript"
    ],
    "learningObjectives": [
      "Understand the event loop and why async exists",
      "Chain promises and handle errors correctly",
      "Use async/await as syntactic abstraction over promises",
      "Apply async patterns to data fetching in React"
    ],
    "whyMatters": "Every API call, every `fetch`, every `useEffect` that loads data relies on async JavaScript. Misunderstanding promises leads to unhandled rejections, race conditions, and loading states that never resolve. React Server Components and streaming change the game, but promises remain the foundation.",
    "estimatedMinutes": 30,
    "sections": [
      {
        "id": "event-loop",
        "type": "concept",
        "title": "The event loop",
        "content": "JavaScript execution on a given agent processes synchronous work on a call stack. Browser APIs can arrange for network responses, timers, and other work to be reported later, so the current stack does not wait for them.\n\nPromise reactions are microtasks: after the current synchronous work finishes, the browser drains pending microtasks before it takes the next task. Timers such as `setTimeout` are tasks. Exact scheduling details depend on the host, so treat this as the browser model used by this example, not a universal rule for every JavaScript runtime."
      },
      {
        "id": "promise-basics",
        "type": "code-example",
        "title": "Promise structure",
        "content": "A Promise is an object representing the eventual completion or failure of an async operation. It has three states: pending, fulfilled, rejected.",
        "code": "const promise = new Promise((resolve, reject) => {\n  // async work here\n  if (/* success */) resolve(data);\n  else reject(new Error('something failed'));\n});\n\npromise\n  .then(data => console.log(data))\n  .catch(err => console.error(err))\n  .finally(() => console.log('done'));",
        "codeLanguage": "javascript",
        "codeFilePath": "examples/async/promise-basics.js"
      },
      {
        "id": "promise-chaining",
        "type": "concept",
        "title": "Chaining and error propagation",
        "content": "`.then()` returns a new promise, so you can chain them. Errors propagate down the chain until a `.catch()` handles them. A `.catch()` in the middle of a chain catches errors above it, then continues the chain — this is useful for fallback logic."
      },
      {
        "id": "async-await",
        "type": "code-example",
        "title": "Async/await",
        "content": "`async/await` is syntactic sugar over promises. An `async` function always returns a promise. `await` suspends the async function until the promise settles, allowing other work to run; synchronous work before and after the await still runs on its host execution path.",
        "code": "async function fetchUser(id: string) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    if (!res.ok) throw new Error('User not found');\n    return await res.json();\n  } catch (err) {\n    console.error(err);\n    return null;\n  }\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/async/fetchUser.ts"
      },
      {
        "id": "promise-question-1",
        "type": "question",
        "title": "Check your understanding",
        "content": "",
        "questions": [
          {
            "id": "q2",
            "question": "What is the order of logs?",
            "options": [
              "A, B, C",
              "A, C, B",
              "B, A, C",
              "C, A, B"
            ],
            "correctAnswer": "A, C, B",
            "expectedReasoning": "console.log('A') runs synchronously. The Promise.resolve().then() callback is a microtask, queued after the current synchronous code finishes. console.log('C') runs synchronously after the then() is registered. Then the microtask fires, logging 'B'. Order: A, C, B.",
            "commonMisconceptions": [
              "Thinking promises run immediately",
              "Not understanding microtask vs synchronous execution order"
            ]
          }
        ]
      },
      {
        "id": "async-react",
        "type": "concept",
        "title": "Async in React components",
        "content": "Client Components cannot be declared as async component functions. Instead, use `useEffect` for synchronization, event handlers for user-initiated async work, or React Server Components (which can be async) in Next.js App Router.\n\nIn Client Components, handle loading, error, and empty states for every async operation."
      },
      {
        "id": "race-conditions",
        "type": "code-example",
        "title": "Race conditions in React",
        "content": "If a component fetches data based on a changing prop, rapid prop changes can cause stale responses to overwrite newer ones.",
        "code": "function UserProfile({ userId }: { userId: string }) {\n  const [user, setUser] = useState<User | null>(null);\n\n  useEffect(() => {\n    let ignore = false;\n    fetchUser(userId).then(data => {\n      if (!ignore) setUser(data);\n    });\n    return () => { ignore = true; };\n  }, [userId]);\n\n  return user ? <div>{user.name}</div> : <LoadingSkeleton />;\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/async/UserProfile.tsx"
      },
      {
        "id": "async-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Async JavaScript is non-negotiable for React development. Server Components simplify this by making data fetching synchronous from the component's perspective, but the underlying promise mechanics still apply. When you write `const data = await db.query()` in a Server Component, you're using the same promise system — you're just not manually managing loading states because the framework handles them."
      }
    ],
    "retrievalPrompt": "What is the difference between a microtask and a host task? Give one example of each and explain which runs first in the browser model used here.",
    "reflectionPrompt": "In a React app you have built or used, where did async behavior cause the most confusion? Would the `ignore` flag pattern or React Suspense have helped?",
    "masteryCriteria": [
      "Can explain the event loop, microtasks, and host tasks",
      "Can chain promises and handle errors with .catch()",
      "Can write async functions with proper error handling",
      "Can prevent race conditions in React useEffect data fetching"
    ],
    "nextTopics": [
      "components-and-jsx"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-01",
      "sources": [
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises",
        "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide"
      ]
    },
    "diagram": {
      "title": "Async work across queues",
      "kind": "layers",
      "nodes": [
        {
          "id": "sync",
          "label": "Synchronous stack",
          "role": "Runs to completion"
        },
        {
          "id": "microtask",
          "label": "Promise reactions",
          "role": "Run after the stack clears"
        },
        {
          "id": "task",
          "label": "Host tasks and I/O",
          "role": "Scheduling depends on the host"
        }
      ],
      "edges": [
        {
          "from": "sync",
          "to": "microtask"
        },
        {
          "from": "microtask",
          "to": "task",
          "label": "host scheduling varies"
        }
      ]
    },
    "chunks": [
      {
        "id": "async-js-promises-retrieval-1",
        "title": "Predict the boundary",
        "concept": "fetch() resolves to a Response before its body is parsed, and Promise callbacks do not interrupt the current synchronous stack.",
        "prediction": {
          "prompt": "What does fetch(url) resolve to before response.json() runs?",
          "options": [
            "Parsed JSON",
            "A Response object"
          ],
          "correctAnswer": "A Response object",
          "feedbackCorrect": "Body parsing is a separate asynchronous step.",
          "feedbackWrong": "fetch resolves a Response; read the body explicitly."
        },
        "synthesis": "Name the value and queue at each async boundary before debugging order."
      }
    ],
    "miniProject": {
      "title": "Design a resilient search request",
      "scenario": "Map a search request from input to response, including HTTP failure, cancellation, and retry.",
      "acceptance": [
        "The response/body distinction is explicit",
        "Obsolete work cannot overwrite current input",
        "The user sees loading and recoverable failure states"
      ],
      "rubric": [
        {
          "dimension": "Scheduling",
          "evidence": "Synchronous, Promise, and host scheduling boundaries are named accurately."
        },
        {
          "dimension": "Failure",
          "evidence": "HTTP and network/cancellation outcomes are separated."
        },
        {
          "dimension": "Recovery",
          "evidence": "Retry or replacement behavior is observable."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "debug-race-condition",
      "title": "Debug the Race Condition",
      "level": 4,
      "topicFamily": "foundations",
      "scenario": "A user search component shows results for the wrong query when typing quickly. The last typed query sometimes shows results from an earlier query.",
      "constraints": [
        "Identify the root cause",
        "Fix the race condition without throttling user input",
        "Ensure the final query always shows its correct results"
      ],
      "acceptanceCriteria": [
        "Typing \"react\" quickly shows results for \"react\", not a partial query",
        "The fix uses the AbortController or ignore flag pattern",
        "No unnecessary API calls are cancelled before they start"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "What happens when the fetch for \"re\" completes after the fetch for \"react\"?"
        },
        {
          "stage": 2,
          "text": "You need to either cancel the old request or ignore its result."
        },
        {
          "stage": 3,
          "text": "useEffect cleanup functions run before the next effect. Use an AbortController or boolean flag."
        }
      ],
      "expectedReasoning": "When the user types \"react\", 5 fetches fire: \"r\", \"re\", \"rea\", \"reac\", \"react\". If \"reac\"'s response arrives after \"react\"'s, stale results overwrite correct ones. Fix: abort previous requests or ignore their responses.",
      "commonWrongPaths": [
        "Adding debounce without fixing the race condition (it reduces but does not fix)",
        "Using useRef without cleanup, leaving dangling requests"
      ],
      "answerExplanation": "Use an AbortController in useEffect: create it, pass signal to fetch, and abort in the cleanup return. Or use a boolean `ignore` flag set to true in cleanup, checked before setState.",
      "followUpVariation": "How would you implement this with React 19's `use()` hook and Suspense?",
      "sourceLink": "https://react.dev/learn/synchronizing-with-effects"
    }
  ],
  "qa": [
    {
      "id": "loop-qa-async-js-promises-1",
      "topicId": "async-js-promises",
      "topicFamily": "foundations",
      "question": "What problem does Async JavaScript & Promises help you solve?",
      "answer": "Every API call, every `fetch`, every `useEffect` that loads data relies on async JavaScript. Misunderstanding promises leads to unhandled rejections, race conditions, and loading states that never resolve. React Server Components and streaming change the game, but promises remain the foundation.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "async-js-promises"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises"
    },
    {
      "id": "loop-qa-async-js-promises-2",
      "topicId": "async-js-promises",
      "topicFamily": "foundations",
      "question": "How would you explain the core idea of Async JavaScript & Promises to a teammate?",
      "answer": "What is the difference between a microtask and a host task? Give one example of each and explain which runs first in the browser model used here. A strong explanation should connect the model to: Understand the event loop and why async exists; Chain promises and handle errors correctly.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "async-js-promises"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises"
    },
    {
      "id": "loop-qa-async-js-promises-3",
      "topicId": "async-js-promises",
      "topicFamily": "foundations",
      "question": "What evidence shows that you can apply Async JavaScript & Promises?",
      "answer": "Can explain the event loop, microtasks, and host tasks · Can chain promises and handle errors with .catch() · Can write async functions with proper error handling",
      "followUp": "What failure case would you test before calling this skill reliable?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "async-js-promises"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises"
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "foundations",
    "level": "beginner",
    "title": "Async JavaScript & Promises"
  }
};
