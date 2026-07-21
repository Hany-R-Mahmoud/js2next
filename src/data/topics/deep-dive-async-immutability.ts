import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "deep-dive-async-immutability",
  "lesson": {
    "slug": "deep-dive-async-immutability",
    "title": "Deep Dive: Async JavaScript, Immutability & Modules",
    "topicFamily": "foundations",
    "level": "beginner",
    "prerequisites": [],
    "learningObjectives": [
      "Trace synchronous work, Promise reactions, and later tasks in execution order",
      "Handle both network failures and unsuccessful HTTP responses from fetch",
      "Update nested data without mutating objects or arrays already in use",
      "Use module exports to create a clear boundary instead of a shared mutable hiding place"
    ],
    "whyMatters": "Async work completes later, objects can share references, and modules connect distant files. A clear model for scheduling, identity, and boundaries helps you predict results instead of relying on timing or accidental mutation.",
    "estimatedMinutes": 40,
    "sections": [
      {
        "id": "deep-dive-async-immutability-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "JavaScript runs the current synchronous call stack first. An `async` function returns a Promise immediately, and code after an `await` continues later as a Promise reaction. Promise reactions use the microtask queue, which is drained after the current stack is empty and before the browser takes the next task such as a timer callback.\n\nImmutability solves a different problem: identity. If existing code still refers to an object or array, do not change that value in place. Create a new value for every changed path so a reader can compare old and new snapshots. Modules add a third boundary: export the small public contract and keep implementation details private."
      },
      {
        "id": "deep-dive-async-immutability-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "`async` always returns a Promise. `await value` pauses only that async function, not the whole JavaScript thread; its continuation is queued when the awaited Promise settles. `fetch` rejects for some request or network failures, but an HTTP response such as 404 still resolves to a `Response`, so check `response.ok` or `status` before reading it as success.\n\nFor an immutable nested update, copy the outer object and each object or array on the path to the changed field. Unchanged branches may safely keep their old references. An ES module executes in its own scope and exposes only named or default exports; avoid exporting mutable state that unrelated callers can change."
      },
      {
        "id": "deep-dive-async-immutability-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "A timer does not interrupt the current stack, and a resolved Promise callback does not run in the middle of the current function. That is why synchronous output comes first and Promise reactions usually run before a ready timer. A delayed response can also arrive after a newer request, so compare request identity or cancel obsolete work before committing results.\n\nMutation is hard to trace because an old reference can appear to change later. Copying the changed path preserves earlier snapshots. A narrow module API then keeps callers from depending on internal data shape or mutable implementation details."
      },
      {
        "id": "deep-dive-async-immutability-example",
        "type": "code-example",
        "title": "Immutable nested update",
        "content": "This example checks the HTTP result and returns a new nested state path. The original `state`, `profile`, and `contact` objects remain unchanged.",
        "code": "type ProfileState = {\n  profile: { contact: { email: string }; status: 'idle' | 'saved' }\n};\n\nexport async function saveEmail(\n  state: ProfileState,\n  email: string\n): Promise<ProfileState> {\n  const response = await fetch('/api/profile', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ email }),\n  });\n\n  if (!response.ok) {\n    throw new Error(`Save failed: ${response.status}`);\n  }\n\n  return {\n    ...state,\n    profile: {\n      ...state.profile,\n      contact: { ...state.profile.contact, email },\n      status: 'saved',\n    },\n  };\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "profile-state.ts"
      },
      {
        "id": "deep-dive-async-immutability-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-async-immutability-question",
            "question": "What order is logged by `console.log(\"A\"); Promise.resolve().then(() => console.log(\"B\")); setTimeout(() => console.log(\"C\"), 0); console.log(\"D\");`?",
            "options": [
              "A, D, B, C",
              "A, B, D, C",
              "A, D, C, B",
              "B, A, D, C"
            ],
            "correctAnswer": "A, D, B, C",
            "expectedReasoning": "The current stack logs A and D first. The resolved Promise reaction is a microtask, so B runs after the stack and before the next timer task. C runs in that later task. The other choices either interrupt synchronous work or run the timer before an already queued microtask."
          }
        ]
      },
      {
        "id": "deep-dive-async-immutability-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Trace scheduling and data separately. Finish the current stack, then run queued Promise reactions before the next task. Treat an HTTP response as success only after checking it. When committing data, create new values along the changed path. Put the request and transformation behind a small module contract so timing and mutation rules have one clear owner."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-async-immutability-prediction",
        "title": "Predict the boundary",
        "concept": "The current stack finishes before Promise microtasks, and Promise microtasks finish before the next task.",
        "prediction": {
          "prompt": "A click handler queues a resolved Promise callback and a zero-delay timer, then logs `done`. What runs first?",
          "options": [
            "The `done` log",
            "The Promise callback",
            "The timer callback"
          ],
          "correctAnswer": "The `done` log",
          "feedbackCorrect": "The current handler must finish before queued callbacks run. The Promise microtask then runs before the timer task.",
          "feedbackWrong": "Queued work does not interrupt the current stack. Finish the handler first, then drain microtasks, then take the timer task."
        },
        "synthesis": "Draw three columns—current stack, microtasks, and later tasks—when timing feels unclear."
      },
      {
        "id": "deep-dive-async-immutability-failure-mode",
        "title": "Name the failure mode",
        "concept": "A robust async update separates transport, HTTP, parsing, and state-identity failures.",
        "prediction": {
          "prompt": "`fetch` resolves with status 404. Which step prevents the UI from treating it as saved?",
          "options": [
            "Check `response.ok` and enter the failure path",
            "Assume every resolved Promise is an HTTP success",
            "Mutate the existing state before inspecting the response"
          ],
          "correctAnswer": "Check `response.ok` and enter the failure path",
          "feedbackCorrect": "A resolved `fetch` Promise can still carry an unsuccessful HTTP status.",
          "feedbackWrong": "Separate Promise settlement from HTTP success, and do not commit state until the result is accepted."
        },
        "synthesis": "Check the boundary result first, then create the next immutable snapshot."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Async JavaScript, Immutability & Modules",
      "scenario": "Build a small profile save module and UI model that can show pending, saved, validation failure, HTTP failure, and a newer request replacing an older one.",
      "acceptance": [
        "The request helper checks `response.ok` and returns a documented result or error",
        "The caller does not let an older response replace a newer submitted email",
        "Every changed nested path receives a new object while unchanged branches may be reused",
        "The module exports a small request function instead of shared mutable state"
      ],
      "rubric": [
        {
          "dimension": "Model",
          "evidence": "The implementation demonstrates: Trace promise settlement and microtask order."
        },
        {
          "dimension": "Boundary",
          "evidence": "The explanation identifies the ownership or lifecycle boundary for async javascript, immutability & modules."
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
          "role": "Async JavaScript, Immutability & Modules"
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
    "retrievalPrompt": "Trace one async request from the current call stack to its Promise reaction, then show an immutable state update and name what the module exposes to its caller.",
    "reflectionPrompt": "Choose one async update in your project. Mark the pending, success, and failure paths, every object reference that changes, and the module responsible for the request.",
    "masteryCriteria": [
      "Can predict the order of synchronous logs, Promise reactions, and timer callbacks",
      "Checks `response.ok` before treating an HTTP response as success",
      "Creates new objects or arrays along every changed path",
      "Keeps one clear owner for mutable data",
      "Can explain a module in terms of its public inputs, outputs, and hidden implementation"
    ],
    "nextTopics": [
      "deep-dive-react-mental-model"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
        "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide",
        "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status",
        "https://react.dev/learn/updating-objects-in-state",
        "https://react.dev/learn/updating-arrays-in-state",
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-js-1",
      "title": "Deep Challenge: Trace the microtask order",
      "level": 1,
      "topicFamily": "foundations",
      "scenario": "Trace a save handler that logs synchronously, awaits a request Promise, queues a timer, and then returns a new profile object. Explain both the callback order and which object references change.",
      "constraints": [
        "Label each step as current stack, Promise microtask, or later task",
        "Check an HTTP response before calling the save successful",
        "Do not mutate the original profile or nested contact object"
      ],
      "acceptanceCriteria": [
        "The trace finishes synchronous work before the awaited continuation",
        "A ready Promise reaction is placed before a ready timer task",
        "The error path covers both request rejection and an unsuccessful HTTP status",
        "The returned profile and contact are new objects and the input remains unchanged"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write the current call stack first; queued callbacks cannot interrupt it."
        },
        {
          "stage": 2,
          "text": "Code after `await` continues as a Promise reaction when the awaited value settles."
        },
        {
          "stage": 3,
          "text": "Copy the outer profile and the nested contact object before replacing the email."
        }
      ],
      "expectedReasoning": "Synchronous statements finish first. The awaited continuation runs through the microtask queue, and a timer runs as a later task. The request result needs an HTTP status check. The update creates new identities along the changed path so earlier snapshots remain reliable.",
      "commonWrongPaths": [
        "Assuming `await` blocks all JavaScript until the request finishes",
        "Treating every resolved `fetch` call as a successful HTTP response",
        "Copying only the outer object and mutating the old nested contact object"
      ],
      "answerExplanation": "Trace the scheduler before tracing the data. Finish the stack, resume Promise work through microtasks, then handle later tasks. Accept the response only after its status is checked, and return new objects for every changed path.",
      "followUpVariation": "Start two saves and resolve the older one last. How will the caller prevent the older result from replacing the newer choice?",
      "checkType": "choice",
      "prompt": "What is the console order?\n\nconsole.log('A');\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');",
      "options": [
        "A B C",
        "A C B",
        "B A C",
        "C B A"
      ],
      "correctIndex": 1,
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide",
      "sourceLinks": [
        "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide",
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
        "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status",
        "https://react.dev/learn/updating-objects-in-state"
      ]
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-async-immutability-question",
      "question": "What does fetch(url) resolve to before json() is called?",
      "answer": "The order is A, D, B, C. A and D run on the current stack. The resolved Promise queues B as a microtask, which runs after the stack is empty. The zero-delay timer queues C as a later task, so it follows the already queued microtask.",
      "followUp": "Where would code after an `await Promise.resolve()` appear in the same trace?",
      "category": "debugging",
      "level": "beginner",
      "topicId": "deep-dive-async-immutability",
      "topicFamily": "foundations",
      "tags": [
        "learn-react-bridge",
        "foundations"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide",
      "sourceLinks": [
        "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide",
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
        "https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch"
      ]
    },
    {
      "id": "loop-qa-deep-dive-async-immutability-1",
      "topicId": "deep-dive-async-immutability",
      "topicFamily": "foundations",
      "question": "Why does `await` not block the whole JavaScript environment?",
      "answer": "Calling an async function returns a Promise to its caller. When that function reaches `await`, only that function pauses. Other work can run. After the awaited Promise settles, the remaining function body is queued as Promise work and continues when the current stack is empty.",
      "followUp": "Which values from before the `await` could be stale when the function resumes?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "deep-dive-async-immutability"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
      "sourceLinks": [
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"
      ]
    },
    {
      "id": "loop-qa-deep-dive-async-immutability-2",
      "topicId": "deep-dive-async-immutability",
      "topicFamily": "foundations",
      "question": "How do immutability and module boundaries make async code easier to review?",
      "answer": "Immutable updates preserve earlier snapshots and make changed identity visible. A focused module keeps request, status checking, parsing, and transformation behind a small public function. Together they make it clearer when data may change, who is allowed to change it, and which result a caller receives.",
      "followUp": "Which mutable value in your current async flow could become a returned value with one owner?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "deep-dive-async-immutability"
      ],
      "sourceLink": "https://react.dev/learn/updating-objects-in-state",
      "sourceLinks": [
        "https://react.dev/learn/updating-objects-in-state",
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules"
      ]
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "foundations",
    "level": "beginner",
    "title": "Deep Dive: Async JavaScript, Immutability & Modules"
  }
};
