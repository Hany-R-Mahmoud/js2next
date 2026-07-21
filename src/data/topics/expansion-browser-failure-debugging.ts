import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "expansion-browser-failure-debugging",
  "lesson": {
    "slug": "expansion-browser-failure-debugging",
    "title": "Debug Browser Events and Stale Requests",
    "topicFamily": "app-quality",
    "level": "intermediate",
    "prerequisites": [
      "async-js-promises"
    ],
    "learningObjectives": [
      "Trace an event from its target through the handlers that observe it",
      "Separate network failure, HTTP error responses, cancellation, and usable success",
      "Keep the newest request authoritative when responses arrive out of order",
      "Provide visible loading, failure, retry, and replacement states"
    ],
    "whyMatters": "Browser bugs often look random only because several timelines are hidden. Naming the event path, request identity, HTTP status, cancellation, and current UI owner turns a guess into a testable explanation.",
    "estimatedMinutes": 34,
    "sections": [
      {
        "id": "expansion-browser-failure-events",
        "type": "concept",
        "title": "Trace the event",
        "content": "An event starts at a target and can travel through ancestors. `event.target` is the element where the event began; `event.currentTarget` is the element whose listener is currently running. A delegated handler on a stable parent can serve many child controls, but it must inspect the target carefully and ignore clicks that do not match its contract. Log the event type, target, currentTarget, and handler order before moving code.\n\nStopping propagation changes which later listeners can observe the event, so use it only when the interaction contract requires that boundary. It should not be the first repair for a handler whose ownership is unclear."
      },
      {
        "id": "expansion-browser-failure-fetch",
        "type": "concept",
        "title": "Classify the request",
        "content": "`fetch` rejects for failures such as an invalid request setup, a network problem, or cancellation. It usually resolves when the server returns an HTTP response, even if that response is 404 or 500. Check `response.ok` or `response.status` before reading the response as success. Keep network failure, HTTP failure, cancellation, and successful data as separate outcomes because each has a different message or recovery path.\n\nRapid input creates another outcome: obsolete success. Request A can begin first and finish after request B. Give each request an identity or abort the previous controller, and update the screen only if the completion still belongs to the current input."
      },
      {
        "id": "expansion-browser-failure-code",
        "type": "code-example",
        "title": "Prevent stale results",
        "content": "This Effect creates one controller for the current query. Cleanup cancels the replaced request. The status check handles HTTP failure, while the cancellation branch avoids presenting expected replacement as a user-facing server error.",
        "code": "useEffect(() => {\n  const controller = new AbortController();\n  const requestedQuery = query;\n\n  async function runSearch() {\n    setStatus('loading');\n    try {\n      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {\n        signal: controller.signal,\n      });\n      if (!response.ok) throw new Error(`Search failed: ${response.status}`);\n      const items = await response.json();\n      if (requestedQuery === query) {\n        setResults(items);\n        setStatus('success');\n      }\n    } catch (error) {\n      if (controller.signal.aborted) return;\n      setStatus('error');\n    }\n  }\n\n  runSearch();\n  return () => controller.abort();\n}, [query]);",
        "codeLanguage": "typescript",
        "codeFilePath": "app/search/SearchResults.tsx"
      },
      {
        "id": "expansion-browser-failure-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-browser-failure-check",
            "question": "The response for `re` arrives after the response for the current query `react`. What should control the displayed result?",
            "options": [
              "Only a response that still belongs to the current query",
              "Whichever request started first",
              "Whichever response has the larger body",
              "Both responses written into the same state without an identity check"
            ],
            "correctAnswer": "Only a response that still belongs to the current query",
            "expectedReasoning": "Network completion order does not define UI authority. The current input owns the view, so the older request must be cancelled or ignored. Starting first, response size, and unguarded writes do not preserve that ownership."
          }
        ]
      },
      {
        "id": "expansion-browser-failure-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Debug from observable boundaries. For events, record target, currentTarget, propagation, and listener order. For requests, record query identity, start, response status, cancellation, and state update. Then make one current owner explicit, distinguish failure classes, and give the user a clear retry or replacement path."
      }
    ],
    "retrievalPrompt": "Trace a delegated click and a rapid search request. Name the event target, currentTarget, response status, winning request, cancellation outcome, and user recovery path.",
    "reflectionPrompt": "Choose an autocomplete or filter in your project. How can you prove that an old response cannot replace results for the current input?",
    "masteryCriteria": [
      "Can distinguish event.target from event.currentTarget while tracing bubbling",
      "Can explain why fetch may resolve for a 404 or 500 response",
      "Can cancel or ignore obsolete work without showing cancellation as a server failure",
      "Can design a retryable error state that preserves useful context"
    ],
    "nextTopics": [
      "deep-dive-app-quality"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling",
        "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
        "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
        "https://developer.mozilla.org/en-US/docs/Web/API/Event/target",
        "https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget",
        "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status",
        "https://react.dev/reference/react/useEffect#fetching-data-with-effects"
      ]
    },
    "diagram": {
      "title": "Keep the current request authoritative",
      "kind": "flow",
      "nodes": [
        {
          "id": "input",
          "label": "Changing input",
          "role": "New query or event"
        },
        {
          "id": "request",
          "label": "Request identity",
          "role": "Associate work with input"
        },
        {
          "id": "response",
          "label": "HTTP response",
          "role": "Check status explicitly"
        },
        {
          "id": "recovery",
          "label": "Retry or replace",
          "role": "Obsolete work cannot win"
        }
      ],
      "edges": [
        {
          "from": "input",
          "to": "request"
        },
        {
          "from": "request",
          "to": "response"
        },
        {
          "from": "response",
          "to": "recovery"
        }
      ]
    },
    "chunks": [
      {
        "id": "expansion-browser-failure-debugging-retrieval-1",
        "title": "Separate fetch failure modes",
        "concept": "Promise settlement, HTTP status, cancellation, and request authority are separate facts.",
        "prediction": {
          "prompt": "A search fetch resolves with status 500. Which handling is accurate?",
          "options": [
            "Check response.ok and show a recoverable HTTP failure",
            "Treat it as successful data because the Promise resolved",
            "Report it as an AbortController cancellation"
          ],
          "correctAnswer": "Check response.ok and show a recoverable HTTP failure",
          "feedbackCorrect": "A response arrived, but its status says the HTTP operation did not succeed.",
          "feedbackWrong": "Promise resolution does not make every HTTP status a successful application result, and cancellation is a different outcome."
        },
        "synthesis": "Classify the outcome before choosing the message or recovery action."
      }
    ],
    "miniProject": {
      "title": "Debug stale search results",
      "scenario": "Build a small autocomplete trace where quick typing starts overlapping requests and one request returns an HTTP error.",
      "acceptance": [
        "The trace records each request id, query, start, status, and completion",
        "Only the request for the current query may update results",
        "HTTP failure is visible and retryable, while replacement cancellation is quiet",
        "A retry uses the current query rather than an obsolete captured value"
      ],
      "rubric": [
        {
          "dimension": "Authority",
          "evidence": "The current query owns the rendered result."
        },
        {
          "dimension": "Diagnosis",
          "evidence": "Network, HTTP, and cancellation failure modes are separated."
        },
        {
          "dimension": "Recovery",
          "evidence": "The user can retry or continue with a newer query."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-debug-stale-search-results",
      "title": "Debug Stale Search Results",
      "level": 4,
      "topicFamily": "app-quality",
      "scenario": "A product search starts one request per query. Typing quickly lets an older response replace current results, a 500 response is parsed as success, and cancellation leaves the spinner running.",
      "constraints": [
        "Keep the newest query as the only result owner",
        "Distinguish HTTP failure, network failure, and cancellation",
        "Preserve useful current input and offer retry for real failure"
      ],
      "acceptanceCriteria": [
        "A trace reproduces the out-of-order response before the repair",
        "Cleanup aborts replaced work or a request identity check ignores it",
        "Every response is checked before its body becomes successful data",
        "Cancellation cannot leave loading active or appear as a server error",
        "Retry starts a request for the current query"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Log a request number and query at start and completion so the race is visible."
        },
        {
          "stage": 2,
          "text": "Create one AbortController per request and abort it when that request is replaced."
        },
        {
          "stage": 3,
          "text": "Check response.ok, then handle an aborted signal separately from a failure the user can retry."
        }
      ],
      "expectedReasoning": "The input, not completion order, owns the view. One controller or request token connects work to that input. HTTP status is checked explicitly, expected cancellation does not become an error, and a real failure keeps enough context for a current-query retry.",
      "commonWrongPaths": [
        "Rendering every successful completion without checking its query",
        "Assuming fetch rejects for every non-2xx status",
        "Using one already-aborted controller for later requests",
        "Treating replacement cancellation as a server outage"
      ],
      "answerExplanation": "First make the response order observable. Then associate work with one query, abort or ignore obsolete completions, check HTTP status, and model cancellation and retryable failure separately.",
      "followUpVariation": "Add a 250 ms debounce. Explain why debounce reduces requests but does not replace request authority.",
      "checkType": "free-text",
      "prompt": "Explain how you keep stale search results from winning and how the UI handles failure.",
      "freeTextKeywords": [
        "abort",
        "obsolete",
        "response",
        "retry"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
      "sourceLinks": [
        "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
        "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status",
        "https://react.dev/reference/react/useEffect#fetching-data-with-effects"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-fetch-failure",
      "topicId": "expansion-browser-failure-debugging",
      "topicFamily": "app-quality",
      "question": "Why is response.ok needed after fetch() resolves?",
      "answer": "`fetch` can resolve after receiving a 404 or 500 response. Resolution means a response arrived, not that the application operation succeeded. Check `response.ok` or `response.status`, then show a recoverable HTTP failure instead of treating an error body as successful data.",
      "followUp": "How will your UI distinguish an expected cancellation from an HTTP failure the user can retry?",
      "category": "debugging",
      "level": "intermediate",
      "tags": [
        "expansion",
        "fetch",
        "debugging"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
      "sourceLinks": [
        "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
        "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status"
      ]
    },
    {
      "id": "loop-qa-expansion-browser-failure-debugging-1",
      "topicId": "expansion-browser-failure-debugging",
      "topicFamily": "app-quality",
      "question": "How do target and currentTarget help debug a delegated event handler?",
      "answer": "`target` identifies where the event began. `currentTarget` identifies the element whose listener is running now. Logging both shows whether the handler observed the intended child through its stable ancestor or matched an unrelated click.",
      "followUp": "What target-matching rule makes your delegated handler safe for nested elements?",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-browser-failure-debugging"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling",
      "sourceLinks": [
        "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling",
        "https://developer.mozilla.org/en-US/docs/Web/API/Event/target",
        "https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget"
      ]
    },
    {
      "id": "loop-qa-expansion-browser-failure-debugging-2",
      "topicId": "expansion-browser-failure-debugging",
      "topicFamily": "app-quality",
      "question": "Why does debouncing search input not completely solve stale response races?",
      "answer": "Debouncing may start fewer requests, but two requests can still overlap and finish out of order. The current query still needs authority through cancellation or a request identity check before a completion updates the view.",
      "followUp": "Which log fields would prove that an obsolete response was ignored?",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-browser-failure-debugging"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling",
      "sourceLinks": [
        "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling",
        "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
        "https://react.dev/reference/react/useEffect#fetching-data-with-effects"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-ignore-obsolete-responses",
      "topicId": "expansion-browser-failure-debugging",
      "topicFamily": "app-quality",
      "title": "Keep Obsolete Responses from Winning",
      "summary": "Associate async work with the input that started it, then abort or ignore a completion after that input is replaced.",
      "rationale": "Request completion order is independent from input order. A current owner prevents old data from silently replacing the view the user asked for.",
      "tradeOffs": "Cancellation needs cleanup, and a server may already have done work before noticing it. An identity check is still useful when an API cannot be cancelled.",
      "appliesWhen": "Changing search, autocomplete, filters, route input, or selection can start overlapping replaceable work.",
      "doesNotApplyWhen": "Every independent result remains useful and is intentionally appended, such as separately identified upload completions.",
      "example": "Create a controller for `react`, abort the previous `re` request on cleanup, and update results only while `react` is still the current query.",
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
      "tags": [
        "expansion",
        "async",
        "debugging"
      ],
      "sourceLinks": [
        "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
        "https://react.dev/reference/react/useEffect#fetching-data-with-effects"
      ]
    }
  ],
  "meta": {
    "topicFamily": "app-quality",
    "level": "intermediate",
    "title": "Debug Browser Events and Stale Requests"
  }
};
