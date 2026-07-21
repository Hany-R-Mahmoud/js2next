import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "use-effect-and-custom-hooks",
  "lesson": {
    "slug": "use-effect-and-custom-hooks",
    "title": "useEffect & Custom Hooks",
    "topicFamily": "state-behavior",
    "level": "intermediate",
    "prerequisites": [
      "use-reducer-and-context"
    ],
    "learningObjectives": [
      "Decide whether work belongs in render, an event handler, or an Effect",
      "Describe an Effect as one setup and cleanup process synchronized to reactive inputs",
      "List every reactive dependency and diagnose avoidable re-runs",
      "Pair subscriptions, connections, timers, and listeners with matching cleanup",
      "Extract a focused custom Hook that shares behavior without sharing component state"
    ],
    "whyMatters": "Effects connect React to systems that React does not control, such as a browser event, timer, network connection, or third-party widget. A clear setup-and-cleanup model makes those connections easier to reason about. Custom Hooks then let several components reuse that model without copying the synchronization code.",
    "estimatedMinutes": 38,
    "sections": [
      {
        "id": "effect-purpose",
        "type": "concept",
        "title": "What useEffect is for",
        "content": "`useEffect` lets a component synchronize with an external system after React commits an update. An external system is something outside React state and rendering: for example a chat connection, DOM event listener, timer, browser API, or non-React widget.\n\nStart by asking what caused the work. If a value can be calculated from current props and state, calculate it during render. If a user action caused the work, handle it in that event handler. Use an Effect when the component must keep an external system synchronized while it is on screen or while a reactive input has a particular value."
      },
      {
        "id": "dependency-array",
        "type": "concept",
        "title": "The dependency array",
        "content": "The dependency array describes the reactive inputs used by the setup code. Reactive inputs include props, state, and variables or functions declared inside the component. React compares each dependency with its previous value using `Object.is`. After the first setup, a changed dependency causes React to run the old cleanup and then the new setup.\n\nAn empty array means the Effect reads no reactive values. Omitting the array runs the Effect after every commit. Do not hide a dependency to control timing; change the code so the dependency is genuinely unnecessary. A configured `exhaustive-deps` lint rule helps find missing values. If an object or function is recreated on every render, first consider moving its creation inside the Effect or outside the component before adding memoization."
      },
      {
        "id": "cleanup",
        "type": "code-example",
        "title": "Cleanup: prevent memory leaks",
        "content": "Think of each Effect as one independent process. Setup acquires or starts something; cleanup stops or undoes that same thing. React runs cleanup before setup with changed dependencies and once more when the component is removed. This symmetry prevents old connections, listeners, and timers from staying active.",
        "code": "useEffect(() => {\n  const connection = createConnection({ serverUrl, roomId });\n  connection.connect();\n\n  return () => {\n    connection.disconnect();\n  };\n}, [serverUrl, roomId]);\n\nuseEffect(() => {\n  function handleKeyDown(event: KeyboardEvent) {\n    if (event.key === 'Escape') closeDialog();\n  }\n\n  window.addEventListener('keydown', handleKeyDown);\n  return () => window.removeEventListener('keydown', handleKeyDown);\n}, [closeDialog]);",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/effects/cleanup.tsx"
      },
      {
        "id": "anti-patterns",
        "type": "concept",
        "title": "Common effect anti-patterns",
        "content": "Common mistakes become easier to fix when you name the owner of the work:\n1. Derived data in Effect state: calculate it during render so one render has one source of truth.\n2. Logic caused by a click or submit: keep it in that event handler, where the cause is still known.\n3. A missing dependency: include it, then reshape unstable objects or functions if they cause unnecessary synchronization.\n4. Setup without matching cleanup: stop the old subscription, listener, timer, request, or connection.\n5. An Effect that updates one of its own dependencies: check whether the state is redundant or whether an updater removes the read dependency."
      },
      {
        "id": "custom-hooks",
        "type": "code-example",
        "title": "Custom hooks: extract reusable logic",
        "content": "A custom Hook is a function whose name starts with `use` and that can call other Hooks. It shares stateful behavior, not one shared state value: every component call receives its own Hook state and Effect lifecycle. Give the Hook a small, meaningful API so the component says what it needs while the Hook owns how synchronization works.",
        "code": "type ChatOptions = { serverUrl: string; roomId: string };\n\nfunction useChatRoom({ serverUrl, roomId }: ChatOptions) {\n  const [status, setStatus] = useState<'connecting' | 'connected'>('connecting');\n\n  useEffect(() => {\n    setStatus('connecting');\n    const connection = createConnection({ serverUrl, roomId });\n    connection.onConnected(() => setStatus('connected'));\n    connection.connect();\n\n    return () => connection.disconnect();\n  }, [serverUrl, roomId]);\n\n  return status;\n}\n\nfunction ChatRoom(props: ChatOptions) {\n  const status = useChatRoom(props);\n  return <p aria-live=\"polite\">{status}</p>;\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/effects/custom-hooks.tsx"
      },
      {
        "id": "effect-question",
        "type": "question",
        "title": "Check your understanding",
        "content": "",
        "questions": [
          {
            "id": "q6",
            "question": "A chat component changes `roomId` from `general` to `travel`. Its Effect depends on `[serverUrl, roomId]` and returns a disconnect cleanup. What sequence should you expect?",
            "options": [
              "Connect to `travel`; the old `general` connection stays active",
              "Disconnect `general`, then connect to `travel`",
              "Do nothing because Effects only run on the first mount",
              "Disconnect `travel`, then reconnect to `general`"
            ],
            "correctAnswer": "Disconnect `general`, then connect to `travel`",
            "expectedReasoning": "The changed `roomId` makes React replace the old synchronization process. React first calls the cleanup created with the old `general` values, then runs setup with `travel`. The first option leaks the old connection. The third confuses a dependency list with mount-only behavior. The fourth reverses the old and new values.",
            "commonMisconceptions": [
              "Thinking cleanup runs only when a component unmounts",
              "Treating a dependency array as a manual scheduling switch",
              "Forgetting that cleanup closes over the values used by its setup"
            ]
          }
        ]
      },
      {
        "id": "effect-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "First choose the owner: render for calculation, an event handler for a user-caused action, or an Effect for ongoing synchronization with an external system. Then model one setup-and-cleanup process and list every reactive input. When several components need the same behavior, move that behavior into a focused custom Hook while keeping each component instance independent."
      }
    ],
    "retrievalPrompt": "For one derived value, one button click, and one chat connection, say whether the work belongs in render, an event handler, or an Effect. Explain the reason for each choice.",
    "reflectionPrompt": "Choose one Effect in your project. Write down the external system, every reactive input, the setup, and the matching cleanup. If no external system exists, can the work move to render or an event handler?",
    "masteryCriteria": [
      "Can explain why an Effect is needed before writing one",
      "Can trace setup, cleanup, and setup again when a dependency changes",
      "Includes every reactive value used by the Effect",
      "Can remove derived-state and event-response Effects that have a clearer owner",
      "Can design a small custom Hook with a clear input and output contract"
    ],
    "nextTopics": [
      "app-router-and-layouts"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://react.dev/reference/react/useEffect",
        "https://react.dev/learn/synchronizing-with-effects",
        "https://react.dev/learn/you-might-not-need-an-effect",
        "https://react.dev/learn/reusing-logic-with-custom-hooks",
        "https://react.dev/reference/eslint-plugin-react-hooks/lints/exhaustive-deps"
      ]
    },
    "diagram": {
      "title": "Synchronize after commit",
      "kind": "flow",
      "nodes": [
        {
          "id": "render",
          "label": "Render",
          "role": "Pure calculation"
        },
        {
          "id": "commit",
          "label": "Commit",
          "role": "UI is applied"
        },
        {
          "id": "effect",
          "label": "Effect setup",
          "role": "External synchronization"
        },
        {
          "id": "cleanup",
          "label": "Cleanup",
          "role": "Before replacement or unmount"
        }
      ],
      "edges": [
        {
          "from": "render",
          "to": "commit"
        },
        {
          "from": "commit",
          "to": "effect"
        },
        {
          "from": "effect",
          "to": "cleanup",
          "label": "dependency changes"
        }
      ]
    },
    "chunks": [
      {
        "id": "use-effect-and-custom-hooks-retrieval-1",
        "title": "Reject unnecessary Effects",
        "concept": "An Effect is a synchronization process with reactive inputs; derived values remain render calculations.",
        "prediction": {
          "prompt": "A component needs `visibleRows = rows.filter(matchesQuery)`. Where should that calculation live?",
          "options": [
            "During render",
            "In an Effect that copies the result into state"
          ],
          "correctAnswer": "During render",
          "feedbackCorrect": "The result is fully determined by current inputs, so render is the direct owner.",
          "feedbackWrong": "Effect state creates a second source of truth and an extra render without synchronizing any external system."
        },
        "synthesis": "Name the external system and the setup/cleanup pair before keeping an Effect."
      }
    ],
    "miniProject": {
      "title": "Extract a subscription hook",
      "scenario": "Refactor a chat panel that copies a filtered member list into Effect state and also opens a room connection.",
      "acceptance": [
        "The filtered member list is derived during render",
        "A custom Hook owns connection setup, status, and cleanup",
        "Changing room or server disconnects the old connection before starting the new one"
      ],
      "rubric": [
        {
          "dimension": "Lifecycle",
          "evidence": "Setup and cleanup remain paired across changes and unmount."
        },
        {
          "dimension": "Dependencies",
          "evidence": "Inputs are complete and intentional."
        },
        {
          "dimension": "API",
          "evidence": "The hook returns a small, documented state shape."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "loop-use-effect-and-custom-hooks",
      "title": "Apply useEffect & Custom Hooks",
      "level": 2,
      "topicFamily": "state-behavior",
      "scenario": "A chat screen currently uses one Effect to copy filtered members into state and to open a room connection. Refactor it so each job has a clear owner, then explain the user-visible behavior when the room changes.",
      "constraints": [
        "Calculate filtered members from current members and query during render",
        "Extract connection behavior into `useChatRoom(serverUrl, roomId)`",
        "Return cleanup that disconnects the exact connection created by setup"
      ],
      "acceptanceCriteria": [
        "Typing a filter does not create derived Effect state or reconnect the room",
        "Changing `roomId` disconnects the old room before connecting the new room",
        "The UI exposes a clear connecting or connected state"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write two columns: pure calculation and external synchronization. Put each current line of code in one column."
        },
        {
          "stage": 2,
          "text": "The visible member list can be calculated directly from `members` and `query`; it does not need its own setter."
        },
        {
          "stage": 3,
          "text": "Inside the custom Hook, create one connection per setup and return a cleanup that disconnects that same connection."
        }
      ],
      "expectedReasoning": "Filtering is fully determined by current render inputs, so render owns it. The chat connection is external and must follow `serverUrl` and `roomId`, so an Effect owns setup and cleanup. A custom Hook gives that synchronization a reusable name without sharing state between component instances.",
      "commonWrongPaths": [
        "Keeping filtered members in state and synchronizing them through another Effect",
        "Using an empty dependency array even though the room can change",
        "Creating a new connection in cleanup instead of disconnecting the setup connection"
      ],
      "answerExplanation": "Derive the list during render. Let `useChatRoom` own one connection process whose dependencies are `serverUrl` and `roomId`. On a room change, React runs the old cleanup and then the new setup, so the old room does not remain subscribed.",
      "followUpVariation": "Add a retry button for a failed connection. Which work belongs to the event handler, and which lifecycle still belongs to the Effect?",
      "sourceLink": "https://react.dev/reference/react/useEffect",
      "sourceLinks": [
        "https://react.dev/reference/react/useEffect",
        "https://react.dev/learn/you-might-not-need-an-effect",
        "https://react.dev/learn/reusing-logic-with-custom-hooks"
      ]
    }
  ],
  "qa": [
    {
      "id": "qa-3",
      "question": "My useEffect runs twice in development. Is this a bug?",
      "answer": "Usually this is a development check, not a second production mount. With Strict Mode enabled, React runs an extra setup, cleanup, and setup cycle before the first real setup. The check helps reveal missing cleanup. Make cleanup undo the setup: disconnect the connection, remove the listener, or clear the timer. Do not use a ref just to hide the extra run, because that leaves the underlying cleanup problem in place.",
      "followUp": "If setup runs, cleanup runs, and setup runs again, what user-visible behavior would prove that cleanup is complete?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "useEffect",
        "strict-mode",
        "debugging"
      ],
      "topicId": "use-effect-and-custom-hooks",
      "topicFamily": "state-behavior",
      "sourceLink": "https://react.dev/reference/react/StrictMode",
      "sourceLinks": [
        "https://react.dev/reference/react/StrictMode",
        "https://react.dev/reference/react/useEffect#my-effect-runs-twice-when-the-component-mounts"
      ]
    },
    {
      "id": "loop-qa-use-effect-and-custom-hooks-1",
      "topicId": "use-effect-and-custom-hooks",
      "topicFamily": "state-behavior",
      "question": "How do you decide whether code belongs in render, an event handler, or an Effect?",
      "answer": "Use render for values calculated from current props and state. Use an event handler for work caused by a specific user action. Use an Effect when rendered UI must stay synchronized with an external system. This choice keeps one clear owner and avoids extra state or hidden timing.",
      "followUp": "Pick one current Effect and name the external system it synchronizes. If there is none, where should the code move?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "use-effect-and-custom-hooks"
      ],
      "sourceLink": "https://react.dev/learn/you-might-not-need-an-effect",
      "sourceLinks": [
        "https://react.dev/learn/you-might-not-need-an-effect",
        "https://react.dev/reference/react/useEffect"
      ]
    },
    {
      "id": "loop-qa-use-effect-and-custom-hooks-2",
      "topicId": "use-effect-and-custom-hooks",
      "topicFamily": "state-behavior",
      "question": "What does a dependency array say about an Effect?",
      "answer": "It lists every reactive value the setup reads. React uses those values to decide when the old synchronization must be cleaned up and replaced. The list is a description of the code, not a preference about when the Effect should run.",
      "followUp": "If a newly created object makes the Effect run too often, how could you reshape the code without hiding the dependency?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "use-effect-and-custom-hooks"
      ],
      "sourceLink": "https://react.dev/reference/react/useEffect#specifying-reactive-dependencies",
      "sourceLinks": [
        "https://react.dev/reference/react/useEffect#specifying-reactive-dependencies",
        "https://react.dev/reference/eslint-plugin-react-hooks/lints/exhaustive-deps"
      ]
    }
  ],
  "practices": [
    {
      "id": "bp-6",
      "title": "Clean Up Effects that Acquire External Resources",
      "summary": "When setup acquires or starts an external resource, return cleanup that stops or undoes that same resource.",
      "rationale": "Cleanup runs before changed dependencies start a replacement process and when the component is removed. This prevents stale listeners, timers, subscriptions, and connections from continuing after their owner has changed.",
      "tradeOffs": "Cleanup adds lifecycle code, and not every Effect needs it. The useful test is concrete: did setup acquire, subscribe, schedule, or connect something that must be released or stopped?",
      "appliesWhen": "Setup adds an event listener, starts a timer, opens a connection, subscribes to data, or begins work that can become obsolete.",
      "doesNotApplyWhen": "There is no corresponding resource or process to stop. Do not add cleanup that performs unrelated work.",
      "example": "`useEffect(() => { const id = setInterval(tick, 1000); return () => clearInterval(id); }, [tick])` pairs one interval with its cleanup.",
      "sourceLink": "https://react.dev/reference/react/useEffect",
      "tags": [
        "useEffect",
        "cleanup",
        "memory"
      ],
      "topicId": "use-effect-and-custom-hooks",
      "topicFamily": "state-behavior",
      "sourceLinks": [
        "https://react.dev/reference/react/useEffect",
        "https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed"
      ]
    }
  ],
  "meta": {
    "topicFamily": "state-behavior",
    "level": "intermediate",
    "title": "useEffect & Custom Hooks"
  }
};
