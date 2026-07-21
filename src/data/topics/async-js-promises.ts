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
      "Distinguish synchronous execution, host tasks, and promise microtasks in the browser model",
      "Chain promises by returning values or promises and handle rejection at the correct boundary",
      "Use async/await without losing errors or parallelism",
      "Prevent stale async results from committing after their owning request is obsolete"
    ],
    "whyMatters": "Promises separate starting asynchronous work from observing its eventual result. Correct code must model fulfillment, rejection, HTTP failure, cancellation, and out-of-order completion explicitly. The same mechanics underlie browser fetches and asynchronous React event or synchronization code.",
    "estimatedMinutes": 34,
    "sections": [
      {
        "id": "event-loop",
        "type": "concept",
        "title": "The event loop",
        "content": "JavaScript runs synchronous code on the current execution stack. Browser APIs can arrange work such as network I/O and timers without blocking that stack. When the current task finishes and the stack is empty, the browser drains queued microtasks before moving to the next task. Promise reaction handlers are microtasks; a `setTimeout` callback is scheduled as a task.\n\nThis ordering is a browser-host model, not a promise that every JavaScript host uses identical queues. Microtasks can also enqueue more microtasks, so the browser continues draining them before the next task. Use the model to predict observable order, not to build fragile timing tricks."
      },
      {
        "id": "promise-basics",
        "type": "code-example",
        "title": "Consume promises and classify failures",
        "content": "A promise is pending until it becomes fulfilled with a value or rejected with a reason. Most application code consumes promises returned by APIs. `fetch` rejects for request failures such as a network error, but an HTTP 404 or 500 still produces a `Response`; check `response.ok` yourself.",
        "code": "function loadUser(id: string) {\n  return fetch(`/api/users/${id}`)\n    .then(response => {\n      if (!response.ok) {\n        throw new Error(`Request failed: ${response.status}`);\n      }\n      return response.json() as Promise<User>;\n    });\n}\n\nloadUser('42')\n  .then(user => console.log(user.name))\n  .catch(error => console.error(error))\n  .finally(() => console.log('request observed'));",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/async/promise-basics.js"
      },
      {
        "id": "promise-chaining",
        "type": "concept",
        "title": "Chaining and error propagation",
        "content": "Every call to `.then`, `.catch`, or `.finally` returns a new promise. Return the next value or promise from a handler so the following handler waits for it. Thrown errors and rejected promises skip fulfillment handlers until a rejection handler receives them. A `.catch` can recover by returning a value, or keep the chain rejected by throwing again.\n\nDo not start a dependent promise inside `.then` without returning it. That detaches the operation from the chain, so downstream completion and error handling no longer represent the whole workflow."
      },
      {
        "id": "async-await",
        "type": "code-example",
        "title": "async/await is promise control flow",
        "content": "Calling an `async` function always returns a promise. `await` pauses that async function until the awaited value settles; it does not block the browser thread. Use `try`/`catch` where the function can add recovery or context, and otherwise let rejection propagate to a caller that owns the policy.",
        "code": "async function loadUser(id: string): Promise<User> {\n  const response = await fetch(`/api/users/${id}`);\n\n  if (!response.ok) {\n    throw new Error(`Request failed: ${response.status}`);\n  }\n\n  return response.json() as Promise<User>;\n}\n\nasync function showUser(id: string) {\n  try {\n    const user = await loadUser(id);\n    console.log(user.name);\n  } catch (error) {\n    console.error('Could not show user', error);\n  }\n}",
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
            "question": "What is the browser log order for `console.log('A'); setTimeout(() => console.log('D'), 0); Promise.resolve().then(() => console.log('B')); console.log('C');`?",
            "options": [
              "A, B, C, D",
              "A, C, B, D",
              "A, C, D, B",
              "D, A, C, B"
            ],
            "correctAnswer": "A, C, B, D",
            "expectedReasoning": "`A` and `C` are synchronous. The fulfilled-promise handler is a microtask, so `B` runs after the current task finishes. The timer callback is a later task, so `D` runs after the microtask queue is drained.",
            "commonMisconceptions": [
              "Assuming a zero-delay timer runs immediately",
              "Assuming a `.then` handler runs synchronously because the promise is already fulfilled"
            ]
          }
        ]
      },
      {
        "id": "async-react",
        "type": "concept",
        "title": "Place async work at an owning boundary",
        "content": "Start user-initiated work in an event handler. Use an Effect only when a Client Component must synchronize with an external system; framework data APIs or a client cache may be a better owner for application data. Do not make a Client Component function itself `async`.\n\nWhichever boundary owns the operation must represent pending, success, empty, and failure states. It must also decide what happens if the component unmounts or a newer request makes the current operation obsolete."
      },
      {
        "id": "race-conditions",
        "type": "code-example",
        "title": "Abort obsolete fetches and ignore expected cancellation",
        "content": "A later request is not guaranteed to finish later. Cleanup can abort the request owned by the previous synchronization. The error path should ignore the expected abort while still surfacing real failures.",
        "code": "function SearchResults({ query }: { query: string }) {\n  const [results, setResults] = useState<SearchResult[]>([]);\n  const [error, setError] = useState<string | null>(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n\n    async function run() {\n      try {\n        setError(null);\n        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {\n          signal: controller.signal,\n        });\n        if (!response.ok) throw new Error(`Search failed: ${response.status}`);\n        setResults(await response.json());\n      } catch (error) {\n        if (error instanceof DOMException && error.name === 'AbortError') return;\n        setError(error instanceof Error ? error.message : 'Unknown search error');\n      }\n    }\n\n    void run();\n    return () => controller.abort();\n  }, [query]);\n\n  if (error) return <p role=\"alert\">{error}</p>;\n  return <ResultsList results={results} />;\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/async/UserProfile.tsx"
      },
      {
        "id": "async-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Promise code is correct when its ownership is visible: every dependent operation is returned or awaited, failures reach the boundary that can handle them, HTTP status is classified explicitly, and obsolete work cannot commit stale results. Use task and microtask ordering to explain behavior, not to replace explicit state and cancellation."
      }
    ],
    "retrievalPrompt": "Explain why promise handlers run after the current synchronous stack, why `fetch` needs an explicit HTTP-status check, and how an obsolete request can be prevented from committing stale data.",
    "reflectionPrompt": "Pick one async feature. Where are operation ownership, error classification, cancellation, and loading completion represented?",
    "masteryCriteria": [
      "Can predict browser ordering for synchronous code, promise microtasks, and timer tasks",
      "Can build a promise chain that returns each dependent operation",
      "Can distinguish transport rejection from an HTTP error response",
      "Can prevent an obsolete request from updating current UI state"
    ],
    "nextTopics": [
      "components-and-jsx"
    ],
    "metadata": {
      "reactVersion": "19.2",
      "lastUpdated": "2026-07-20",
      "sources": [
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises",
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
        "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide",
        "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
        "https://react.dev/learn/synchronizing-with-effects#fetching-data"
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
        "title": "Separate a Response from its body",
        "concept": "`fetch` fulfills with a `Response`. Reading JSON is another asynchronous step, and an HTTP error response still needs an explicit status check.",
        "prediction": {
          "prompt": "Immediately after `const response = await fetch(url)`, what value do you have?",
          "options": [
            "Parsed JSON",
            "A Response object"
          ],
          "correctAnswer": "A Response object",
          "feedbackCorrect": "Check `response.ok`, then await a body reader such as `response.json()`.",
          "feedbackWrong": "`fetch` does not parse JSON for you, and HTTP error statuses do not automatically reject the promise."
        },
        "synthesis": "Model transport, HTTP status, body parsing, and application validation as distinct boundaries."
      }
    ],
    "miniProject": {
      "title": "Design a resilient search request",
      "scenario": "Implement a type-ahead search that cannot display stale results from an obsolete query.",
      "acceptance": [
        "The final visible result belongs to the latest query",
        "HTTP errors and expected cancellation take different paths",
        "Pending, empty, failure, and success states are observable"
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
        "Do not rely on throttling or debouncing as the correctness mechanism",
        "Cancel the obsolete fetch or ignore its result at the owner boundary",
        "Preserve real HTTP and parsing failures instead of treating every error as cancellation"
      ],
      "acceptanceCriteria": [
        "Typing `react` quickly cannot leave results for an earlier partial query on screen",
        "Cleanup prevents an obsolete request from committing state",
        "A non-2xx response becomes an explicit error state"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "List the requests in start order and then in possible completion order. They do not have to match."
        },
        {
          "stage": 2,
          "text": "Give each synchronization run an ownership token: an `AbortController` or an `ignore` flag closed over by that run."
        },
        {
          "stage": 3,
          "text": "Abort in cleanup, pass the signal to `fetch`, ignore only `AbortError`, and check `response.ok` before parsing."
        }
      ],
      "expectedReasoning": "A query change starts a new operation before older operations are guaranteed to finish. The previous run’s cleanup must revoke its authority to commit. Debouncing can reduce requests but does not prove that an older response cannot arrive last.",
      "commonWrongPaths": [
        "Debouncing input and assuming fewer requests removes the race",
        "Catching every error as an abort and hiding HTTP or parsing failures"
      ],
      "answerExplanation": "Create one `AbortController` per request-owning Effect, pass its signal to `fetch`, and abort it in cleanup. Ignore only the expected abort exception. Check `response.ok` before parsing and route other failures to the visible error state. An `ignore` flag is an alternative when the underlying operation cannot be cancelled.",
      "followUpVariation": "Keep the correctness guard, then add caching. Which layer should own cancellation, cache identity, and stale-result policy?",
      "sourceLink": "https://react.dev/learn/synchronizing-with-effects#fetching-data",
      "sourceLinks": [
        "https://react.dev/learn/synchronizing-with-effects"
      ]
    }
  ],
  "qa": [
    {
      "id": "loop-qa-async-js-promises-1",
      "topicId": "async-js-promises",
      "topicFamily": "foundations",
      "question": "What does a promise represent, and what does it not guarantee?",
      "answer": "A promise represents the eventual outcome of an operation and lets code observe fulfillment or rejection. It does not guarantee completion order relative to other operations, make HTTP error statuses reject `fetch`, or provide first-class cancellation.",
      "followUp": "Which layer owns HTTP classification and cancellation in your example?",
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
      "question": "Why does a promise handler run before a zero-delay timer in the browser example?",
      "answer": "After the current task and synchronous stack finish, the browser drains promise microtasks before taking the next task. The timer callback is a task, so it runs after the queued promise handler.",
      "followUp": "Which parts of this explanation are ECMAScript language behavior and which belong to the browser host?",
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
      "question": "How do you prove that a request-driven UI cannot display stale results?",
      "answer": "Tie each request to an owner, revoke the previous owner in cleanup by aborting or ignoring it, and test completions out of order. Also verify that real HTTP and parsing failures remain visible.",
      "followUp": "What test would fail if debouncing reduced requests but did not remove the race?",
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
