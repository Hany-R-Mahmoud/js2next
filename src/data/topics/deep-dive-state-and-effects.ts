import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "deep-dive-state-and-effects",
  "lesson": {
    "slug": "deep-dive-state-and-effects",
    "title": "Deep Dive: State, Effects & Custom Hooks",
    "topicFamily": "state-behavior",
    "level": "intermediate",
    "prerequisites": [
      "deep-dive-react-mental-model"
    ],
    "learningObjectives": [
      "Choose the closest owner for state and derive values instead of synchronizing copies",
      "Use Effects only to synchronize with systems outside React",
      "Model one Effect as setup, cleanup, and reactive inputs",
      "Prevent stale async results and extract focused custom Hooks"
    ],
    "whyMatters": "State is easier to maintain when every value has one owner. Effects are easier to maintain when each one represents a single synchronization process. Keeping those boundaries separate avoids extra renders, stale data, and cleanup that is difficult to verify.",
    "estimatedMinutes": 42,
    "sections": [
      {
        "id": "deep-dive-state-and-effects-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "Give each state value one owner. Keep it in the closest component that must coordinate every reader and writer. Pass it down, lift it when siblings must agree, and derive values such as filtered rows during render instead of storing another copy.\n\nAn Effect is for synchronizing the committed UI with an external system: a connection, subscription, browser event, timer, non-React widget, or request whose lifetime follows rendered values. A custom Hook can give repeated stateful behavior a clear name, but every call still has its own state and Effect lifecycle."
      },
      {
        "id": "deep-dive-state-and-effects-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "After React commits, an Effect runs its setup. If a listed reactive dependency changes, React first runs the previous cleanup and then runs setup with the new snapshot. Cleanup also runs when the component is removed. List every prop, state value, function, or object from component scope that setup reads. The dependency list describes the process; it is not a manual timing control.\n\nFor a request that can become obsolete, cleanup may abort it or mark that setup inactive. This prevents an older result from replacing data for a newer input. Aborting also releases work when the API supports it; ignoring an obsolete result is still needed for APIs that cannot be cancelled."
      },
      {
        "id": "deep-dive-state-and-effects-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "Derived Effect state adds a render with an old value and creates two writable sources that can disagree. Event-specific logic in an Effect loses the event that caused it. Missing dependencies keep a process synchronized to an old snapshot. Missing cleanup leaves old work active.\n\nThe repair is to choose the cause and owner: calculate during render, respond in the event handler, or synchronize one external process in an Effect. Extract a custom Hook only after that boundary is clear; extraction shares the behavior, not one global state value."
      },
      {
        "id": "deep-dive-state-and-effects-example",
        "type": "code-example",
        "title": "Effect cleanup for a request",
        "content": "This Effect starts one request for the current `userId`. Cleanup aborts that request before a different ID starts or the component is removed. The abort path is not shown as a user-facing error.",
        "code": "useEffect(() => {\n  const controller = new AbortController();\n\n  async function loadProfile() {\n    setStatus('pending');\n    try {\n      const response = await fetch(`/api/users/${userId}`, {\n        signal: controller.signal,\n      });\n      if (!response.ok) throw new Error(`HTTP ${response.status}`);\n      setProfile(await response.json());\n      setStatus('success');\n    } catch (error) {\n      if (!controller.signal.aborted) setStatus('error');\n    }\n  }\n\n  loadProfile();\n  return () => controller.abort();\n}, [userId]);",
        "codeLanguage": "typescript",
        "codeFilePath": "Profile.tsx"
      },
      {
        "id": "deep-dive-state-and-effects-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-state-and-effects-question",
            "question": "Which value should normally be calculated during render rather than stored and synchronized by an Effect?",
            "options": [
              "A filtered list determined by `items` and `query`",
              "A WebSocket connection that follows `roomId`",
              "A window event listener that must be removed",
              "A third-party map instance synchronized to coordinates"
            ],
            "correctAnswer": "A filtered list determined by `items` and `query`",
            "expectedReasoning": "The filtered list is fully determined by current React inputs, so render is its direct owner. The connection, listener, and map are external systems whose setup and cleanup follow rendered values. Storing the filtered list would add redundant state and another synchronization path."
          }
        ]
      },
      {
        "id": "deep-dive-state-and-effects-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Choose one owner for state, derive what current inputs already determine, and keep user-caused work in its event handler. Use an Effect only for an external process. Describe that process with setup, cleanup, and every reactive input. Prevent obsolete async work from committing, then extract a focused custom Hook when another component needs the same behavior."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-state-and-effects-prediction",
        "title": "Predict the boundary",
        "concept": "Render owns derivation; events own user-caused actions; Effects own ongoing external synchronization.",
        "prediction": {
          "prompt": "A user clicks Save and the app must send the submitted form once. Where does the request usually begin?",
          "options": [
            "In the submit event handler",
            "In an Effect watching a `shouldSave` flag",
            "During render"
          ],
          "correctAnswer": "In the submit event handler",
          "feedbackCorrect": "The submit event is the known cause, so the handler is the clearest owner.",
          "feedbackWrong": "Do not convert a known event into state just so an Effect can rediscover it. Rendering must remain pure."
        },
        "synthesis": "Name the cause before choosing the boundary."
      },
      {
        "id": "deep-dive-state-and-effects-failure-mode",
        "title": "Name the failure mode",
        "concept": "Every Effect is one synchronization process with symmetrical setup and cleanup.",
        "prediction": {
          "prompt": "`userId` changes while an older profile request is pending. What should happen before the new setup?",
          "options": [
            "Cleanup should abort or deactivate the old request",
            "Both responses should update the same state in arrival order",
            "Remove `userId` from the dependencies"
          ],
          "correctAnswer": "Cleanup should abort or deactivate the old request",
          "feedbackCorrect": "The old process no longer represents the committed `userId`, so it must not publish a later result.",
          "feedbackWrong": "Arrival order is not request intent. Keep the dependency and stop or ignore obsolete work."
        },
        "synthesis": "Cleanup makes a changed external process safe to replace."
      }
    ],
    "miniProject": {
      "title": "Practice lab: State, Effects & Custom Hooks",
      "scenario": "Refactor a profile search that stores a filtered list in Effect state and sometimes displays a late response for the previous user.",
      "acceptance": [
        "The filtered list is calculated from current profiles and query during render",
        "The request Effect depends on the selected user and prevents obsolete results from committing",
        "Pending, empty, success, and recoverable failure states are distinguishable",
        "Repeated request behavior is extracted into a focused Hook with explicit inputs and outputs"
      ],
      "rubric": [
        {
          "dimension": "Model",
          "evidence": "The implementation demonstrates: Choose state ownership."
        },
        {
          "dimension": "Boundary",
          "evidence": "The explanation identifies the ownership or lifecycle boundary for state, effects & custom hooks."
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
          "role": "State, Effects & Custom Hooks"
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
    "retrievalPrompt": "For a filtered list, a button request, a room subscription, and a repeated online-status behavior, choose render, event handler, Effect, or custom Hook and explain each boundary.",
    "reflectionPrompt": "Review one state value and one Effect. Identify the owner, any redundant copy, the external system, every reactive input, and the matching cleanup.",
    "masteryCriteria": [
      "Can choose state ownership from the components that must coordinate",
      "Calculates derived values during render",
      "Uses Effects for external synchronization rather than event handling or derivation",
      "Includes dependencies and cleanup that match the setup process",
      "Can prevent an obsolete request from committing and extract reusable behavior into a focused Hook"
    ],
    "nextTopics": [
      "deep-dive-app-quality"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://react.dev/learn/sharing-state-between-components",
        "https://react.dev/learn/you-might-not-need-an-effect",
        "https://react.dev/learn/separating-events-from-effects",
        "https://react.dev/reference/react/useEffect",
        "https://react.dev/learn/reusing-logic-with-custom-hooks",
        "https://developer.mozilla.org/en-US/docs/Web/API/AbortController"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-eff-4",
      "title": "Deep Challenge: Debug the stale effect",
      "level": 4,
      "topicFamily": "state-behavior",
      "scenario": "A profile page reads `userId` in an Effect with an empty dependency array. After navigation, the old request can finish last and replace the new profile. Diagnose the two stale-data paths and repair the process.",
      "constraints": [
        "Keep `userId` as a reactive dependency",
        "Stop or ignore work created by the previous setup",
        "Do not hide the issue with a remount key or a disabled lint rule"
      ],
      "acceptanceCriteria": [
        "Changing `userId` starts a request for the new user",
        "Cleanup prevents the previous request from committing after replacement",
        "Abort is not reported as an ordinary request failure",
        "The explanation separates a stale closure from an out-of-order response"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "List every reactive value read by setup. `userId` describes which external request this process represents."
        },
        {
          "stage": 2,
          "text": "On a dependency change, React can run the previous cleanup before the new setup."
        },
        {
          "stage": 3,
          "text": "Use an `AbortController` signal or an `ignore` flag so the old setup cannot publish a late result."
        }
      ],
      "expectedReasoning": "The empty list captures the first user ID, so navigation does not create a new process. Even after adding the dependency, responses can arrive out of order unless cleanup aborts or deactivates the old setup. The robust Effect depends on `userId`, creates one cancellation mechanism, and cleans it up before replacement.",
      "commonWrongPaths": [
        "Suppressing the dependency warning",
        "Using a component key only to force a remount",
        "Starting the new request without preventing the old result from committing"
      ],
      "answerExplanation": "Include `userId`, create one cancellation or ignore mechanism per setup, and activate it in cleanup. This repairs both the stale snapshot and the late-response race while keeping the process tied to the committed user.",
      "followUpVariation": "Move the data read to a Server Component. Which client Effect disappears, and which loading or error boundary still communicates progress and recovery?",
      "checkType": "free-text",
      "prompt": "Why can this Effect show stale data, and what is a robust fix?",
      "freeTextKeywords": [
        "userId",
        "depend",
        "stale"
      ],
      "sourceLink": "https://react.dev/reference/react/useEffect#fetching-data-with-effects",
      "sourceLinks": [
        "https://react.dev/reference/react/useEffect#fetching-data-with-effects",
        "https://react.dev/reference/react/useEffect#specifying-reactive-dependencies",
        "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
        "https://react.dev/learn/you-might-not-need-an-effect"
      ]
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-state-and-effects-question",
      "question": "Which value should usually be computed during render rather than stored in state?",
      "answer": "Calculate the filtered list during render because `items` and `query` already determine it. A WebSocket, browser listener, or third-party widget is outside React and may need an Effect to keep setup and cleanup synchronized with current inputs.",
      "followUp": "What are the complete inputs to your derived value, and is any external system involved?",
      "category": "react",
      "level": "intermediate",
      "topicId": "deep-dive-state-and-effects",
      "topicFamily": "state-behavior",
      "tags": [
        "learn-react-bridge",
        "state-behavior"
      ],
      "sourceLink": "https://react.dev/learn/you-might-not-need-an-effect",
      "sourceLinks": [
        "https://react.dev/learn/you-might-not-need-an-effect",
        "https://react.dev/learn/synchronizing-with-effects"
      ]
    },
    {
      "id": "loop-qa-deep-dive-state-and-effects-1",
      "topicId": "deep-dive-state-and-effects",
      "topicFamily": "state-behavior",
      "question": "How do state ownership and Effect ownership differ?",
      "answer": "A state owner stores the smallest source of truth needed by its React consumers. An Effect owner synchronizes committed React values with one external process. Derived values do not need another state owner, and user-caused actions usually remain in their event handlers.",
      "followUp": "Which current state value is a source of truth, and which one can be derived?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-state-and-effects"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components",
      "sourceLinks": [
        "https://react.dev/learn/sharing-state-between-components",
        "https://react.dev/learn/you-might-not-need-an-effect"
      ]
    },
    {
      "id": "loop-qa-deep-dive-state-and-effects-2",
      "topicId": "deep-dive-state-and-effects",
      "topicFamily": "state-behavior",
      "question": "What does a well-designed custom Hook share?",
      "answer": "It shares a stateful behavior and a clear input/output contract. Each component call still receives independent Hook state and Effect lifecycle. The Hook should hide a coherent mechanism, such as subscription setup and cleanup, without hiding important policy or accepting a bag of unrelated options.",
      "followUp": "Can you name the Hook after one behavior and describe its inputs and outputs in one sentence?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-state-and-effects"
      ],
      "sourceLink": "https://react.dev/learn/reusing-logic-with-custom-hooks",
      "sourceLinks": [
        "https://react.dev/learn/reusing-logic-with-custom-hooks"
      ]
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "state-behavior",
    "level": "intermediate",
    "title": "Deep Dive: State, Effects & Custom Hooks"
  }
};
