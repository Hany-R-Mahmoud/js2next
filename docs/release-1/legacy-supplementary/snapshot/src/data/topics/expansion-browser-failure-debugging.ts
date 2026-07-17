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
      "Trace event propagation before changing handlers",
      "Separate network failure from an HTTP error response",
      "Abort or ignore obsolete requests",
      "Expose recoverable loading and error states"
    ],
    "whyMatters": "Most frontend failures become easier when you can name the event path, request lifecycle, and exact observable failure instead of guessing from the final screen.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "expansion-browser-failure-events",
        "type": "concept",
        "title": "Trace the event",
        "content": "Start with the target, bubbling path, and listener that actually ran. Event delegation is useful when a stable ancestor owns repeated targets, but it must preserve the target identity you need."
      },
      {
        "id": "expansion-browser-failure-fetch",
        "type": "concept",
        "title": "Classify the request",
        "content": "fetch() rejects for a network-level failure, not merely because the server returned 404 or 500. Inspect response.ok and status before treating a response as usable."
      },
      {
        "id": "expansion-browser-failure-code",
        "type": "code-example",
        "title": "Prevent stale results",
        "content": "Cancel work when the query changes, and still keep a visible recovery path for failure.",
        "code": "const controller = new AbortController();\nconst response = await fetch(`/api/search?q=${query}`, { signal: controller.signal });\nif (!response.ok) throw new Error(`Search failed: ${response.status}`);",
        "codeLanguage": "typescript",
        "codeFilePath": "Search request boundary"
      },
      {
        "id": "expansion-browser-failure-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-browser-failure-check",
            "question": "What should a search UI do when an older response arrives after a newer query?",
            "options": [
              "Always display the older response",
              "Abort or ignore the obsolete response and keep the newer request authoritative",
              "Reload the entire page",
              "Hide the error permanently"
            ],
            "correctAnswer": "Abort or ignore the obsolete response and keep the newer request authoritative",
            "expectedReasoning": "Request order can differ from input order; the current query must own the displayed result."
          }
        ]
      },
      {
        "id": "expansion-browser-failure-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Debug from observable boundaries: event target and propagation, request status and response body, cancellation or invalidation, then loading/error recovery."
      }
    ],
    "retrievalPrompt": "How do you distinguish a network failure, an HTTP error response, and an obsolete response?",
    "reflectionPrompt": "Choose one search or autocomplete flow. Which request wins when typing changes quickly, and how can the user recover from failure?",
    "masteryCriteria": [
      "Can trace bubbling and delegated handlers",
      "Can explain fetch rejection versus HTTP status",
      "Can prevent obsolete results from winning",
      "Can expose a retryable error state"
    ],
    "nextTopics": [
      "deep-dive-app-quality"
    ],
    "metadata": {
      "lastUpdated": "2026-07-15",
      "sources": [
        "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling",
        "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
        "https://developer.mozilla.org/en-US/docs/Web/API/AbortController"
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
        "concept": "fetch() can resolve for a 404 or 500, while an abort is a replacement outcome rather than a user-facing server failure.",
        "prediction": {
          "prompt": "What should happen after fetch resolves with a 500 response?",
          "options": [
            "Treat it as success because the Promise resolved",
            "Check response.ok/status and show recoverable failure"
          ],
          "correctAnswer": "Check response.ok/status and show recoverable failure",
          "feedbackCorrect": "HTTP status is part of the response contract.",
          "feedbackWrong": "Promise resolution only means a response arrived."
        },
        "synthesis": "Track request identity, status, cancellation, and retry as separate observable states."
      }
    ],
    "miniProject": {
      "title": "Debug stale search results",
      "scenario": "Design a search flow where newer input wins, HTTP failures are visible, and retry is possible.",
      "acceptance": [
        "Obsolete responses cannot overwrite current input",
        "Non-2xx responses are handled",
        "Abort and retry outcomes are distinguishable"
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
      "scenario": "A search box renders an older response after the user has already typed a newer query, and the UI gives no useful recovery when the request fails.",
      "constraints": [
        "Keep the latest query authoritative",
        "Distinguish HTTP failure from network failure",
        "Show loading and retryable error states"
      ],
      "acceptanceCriteria": [
        "Obsolete responses cannot overwrite the latest query",
        "Abort or ignore logic is explained",
        "Non-2xx responses are handled explicitly",
        "The user can retry after a failure"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Record which query each response belongs to before changing rendering."
        },
        {
          "stage": 2,
          "text": "fetch resolves for HTTP errors; inspect response.ok and status."
        },
        {
          "stage": 3,
          "text": "Abort on cleanup or ignore a response that no longer matches the current query."
        }
      ],
      "expectedReasoning": "Input order and response order can differ. The current request owns the view, while explicit status checks and recovery states prevent silent failure.",
      "commonWrongPaths": [
        "Rendering every response as it arrives",
        "Assuming fetch rejects on 404 or 500",
        "Showing a spinner forever after AbortError"
      ],
      "answerExplanation": "Associate each response with its query, abort or invalidate obsolete work, check response.ok, and render an actionable retry state for failures.",
      "followUpVariation": "Add debounce without changing which response is authoritative.",
      "checkType": "free-text",
      "prompt": "Explain how you keep stale search results from winning and how the UI handles failure.",
      "freeTextKeywords": [
        "abort",
        "obsolete",
        "response",
        "retry"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/API/AbortController"
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-fetch-failure",
      "topicId": "expansion-browser-failure-debugging",
      "topicFamily": "app-quality",
      "question": "Why is response.ok needed after fetch() resolves?",
      "answer": "fetch() resolves when an HTTP response is received, including 404 or 500 responses. Check response.ok or status before treating the body as a successful result.",
      "followUp": "How should a stale response be handled?",
      "category": "debugging",
      "level": "intermediate",
      "tags": [
        "expansion",
        "fetch",
        "debugging"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"
    },
    {
      "id": "loop-qa-expansion-browser-failure-debugging-1",
      "topicId": "expansion-browser-failure-debugging",
      "topicFamily": "app-quality",
      "question": "What problem does Debug Browser Events and Stale Requests help you solve?",
      "answer": "Most frontend failures become easier when you can name the event path, request lifecycle, and exact observable failure instead of guessing from the final screen.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-browser-failure-debugging"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling"
    },
    {
      "id": "loop-qa-expansion-browser-failure-debugging-2",
      "topicId": "expansion-browser-failure-debugging",
      "topicFamily": "app-quality",
      "question": "How would you explain the core idea of Debug Browser Events and Stale Requests to a teammate?",
      "answer": "How do you distinguish a network failure, an HTTP error response, and an obsolete response? A strong explanation should connect the model to: Trace event propagation before changing handlers; Separate network failure from an HTTP error response.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-browser-failure-debugging"
      ],
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling"
    }
  ],
  "practices": [
    {
      "id": "expansion-ignore-obsolete-responses",
      "topicId": "expansion-browser-failure-debugging",
      "topicFamily": "app-quality",
      "title": "Keep Obsolete Responses from Winning",
      "summary": "When inputs change during an async request, abort or ignore responses that no longer match the current input.",
      "rationale": "Network completion order is independent from input order; rendering every response can show data for a query the user has already replaced.",
      "tradeOffs": "Cancellation needs cleanup, and ignored work may still consume server resources when cancellation is not supported.",
      "appliesWhen": "Search, autocomplete, filters, or any request is keyed by changing input.",
      "doesNotApplyWhen": "Every response is independently useful and can be appended without replacing current state.",
      "example": "Abort the previous search request on cleanup and ignore AbortError while preserving a retryable error state for other failures.",
      "sourceLink": "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
      "tags": [
        "expansion",
        "async",
        "debugging"
      ]
    }
  ],
  "meta": {
    "topicFamily": "app-quality",
    "level": "intermediate",
    "title": "Debug Browser Events and Stale Requests"
  }
};
