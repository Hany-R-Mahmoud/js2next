import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "expansion-client-server-state",
  "lesson": {
    "slug": "expansion-client-server-state",
    "title": "Client State, Server State, and Query Caches",
    "topicFamily": "nextjs-data",
    "level": "advanced",
    "prerequisites": [
      "expansion-url-state",
      "server-data-fetching"
    ],
    "learningObjectives": [
      "Classify local UI state, URL state, and remote server state",
      "Design query keys that include every variable affecting a request",
      "Model loading, error, fetching, and success states without hiding stale data",
      "Invalidate or update cached data deliberately after a mutation"
    ],
    "whyMatters": "Remote data has ownership, freshness, and failure behavior that local UI state does not. Clear boundaries prevent duplicated caches, stale screens, and untestable synchronization effects.",
    "estimatedMinutes": 30,
    "sections": [
      {
        "id": "expansion-client-server-state-model",
        "type": "concept",
        "title": "Name the owner",
        "content": "Keep ephemeral interaction state local, keep shareable view state in the URL, and let a server-state cache own remote data, freshness, loading, and error transitions."
      },
      {
        "id": "expansion-client-server-state-code",
        "type": "code-example",
        "title": "Make the query identity explicit",
        "content": "Every input that changes the result belongs in the query key. A mutation must also describe how the affected cache becomes current again.",
        "code": "const query = useQuery({\n  queryKey: ['projects', { ownerId, page }],\n  queryFn: () => fetchProjects({ ownerId, page }),\n});\n\n// after a successful write\nqueryClient.invalidateQueries({ queryKey: ['projects', { ownerId }] });",
        "codeLanguage": "tsx",
        "codeFilePath": "Client query boundary"
      },
      {
        "id": "expansion-client-server-state-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-client-server-state-check",
            "question": "Which design is safest when a project list depends on ownerId and page?",
            "options": [
              "Use one global key called projects",
              "Include ownerId and page in the query key and invalidate the affected family after writes",
              "Copy the fetched list into local state and never refetch",
              "Use a random key so every render fetches"
            ],
            "correctAnswer": "Include ownerId and page in the query key and invalidate the affected family after writes",
            "expectedReasoning": "The key identifies the data variant. Invalidation makes the cache policy explicit after a mutation without maintaining a second hand-written copy."
          }
        ]
      },
      {
        "id": "expansion-client-server-state-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "A query cache is a server-state boundary, not a replacement for every state store. Define ownership, query identity, freshness, and mutation invalidation before adding synchronization effects."
      }
    ],
    "retrievalPrompt": "What belongs in a query key, and what should happen to related cached data after a mutation?",
    "reflectionPrompt": "Choose one remote-data screen. Which values are local, URL-owned, or server-owned, and what event makes its cache stale?",
    "masteryCriteria": [
      "Can classify state by ownership",
      "Can build a complete query key",
      "Can distinguish stale data from loading and error states",
      "Can explain invalidation after a mutation"
    ],
    "nextTopics": [
      "deep-dive-nextjs-data"
    ],
    "metadata": {
      "lastUpdated": "2026-07-15",
      "sources": [
        "https://tanstack.com/query/latest/docs/framework/react/overview",
        "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys",
        "https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations",
        "https://nextjs.org/docs/app/getting-started/fetching-data"
      ]
    },
    "diagram": {
      "title": "Remote data identity and freshness",
      "kind": "flow",
      "nodes": [
        {
          "id": "identity",
          "label": "Query identity",
          "role": "Every result-changing input"
        },
        {
          "id": "cache",
          "label": "Query cache",
          "role": "Remote data owner"
        },
        {
          "id": "mutation",
          "label": "Mutation",
          "role": "Protected write"
        },
        {
          "id": "refresh",
          "label": "Invalidate or update",
          "role": "Freshness policy"
        }
      ],
      "edges": [
        {
          "from": "identity",
          "to": "cache"
        },
        {
          "from": "cache",
          "to": "mutation"
        },
        {
          "from": "mutation",
          "to": "refresh"
        },
        {
          "from": "refresh",
          "to": "cache"
        }
      ]
    },
    "chunks": [
      {
        "id": "expansion-client-server-state-retrieval-1",
        "title": "Name every query-key input",
        "concept": "If owner, filter, or page changes the result, it belongs in the query key so the cache can distinguish variants.",
        "prediction": {
          "prompt": "What belongs in the key for a paged project list?",
          "options": [
            "Only the word projects",
            "Projects plus owner, filter, and page"
          ],
          "correctAnswer": "Projects plus owner, filter, and page",
          "feedbackCorrect": "The key expresses data identity.",
          "feedbackWrong": "One key would conflate different server results."
        },
        "synthesis": "Let the cache own remote data and make freshness transitions explicit."
      }
    ],
    "miniProject": {
      "title": "Design a query cache boundary",
      "scenario": "Choose the key, loading states, mutation invalidation, and retry behavior for a shared project list.",
      "acceptance": [
        "All result-changing inputs are in the key",
        "The cache is not mirrored into unrelated local state",
        "Mutation freshness is explicit"
      ],
      "rubric": [
        {
          "dimension": "Identity",
          "evidence": "The query key distinguishes every result variant."
        },
        {
          "dimension": "Freshness",
          "evidence": "Invalidation or precise updates match the mutation scope."
        },
        {
          "dimension": "UX",
          "evidence": "Initial, background, error, and retry states are differentiated."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-design-query-cache-boundary",
      "title": "Design a Query Cache Boundary",
      "level": 6,
      "topicFamily": "nextjs-data",
      "scenario": "A dashboard fetches the same project data in several components. After an edit, one card updates while another shows stale data, and changing the owner or page can display the wrong result.",
      "constraints": [
        "Name the owner of remote data",
        "Include all result-changing inputs in the query key",
        "Define loading, stale, error, and retry behavior",
        "Invalidate or update affected cache entries after a successful mutation"
      ],
      "acceptanceCriteria": [
        "The query key includes owner and page",
        "The design does not mirror the query cache into a second source of truth",
        "A mutation makes the affected project queries current",
        "The UI distinguishes initial loading from background refresh and recoverable error"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write the data identity as a tuple before choosing components."
        },
        {
          "stage": 2,
          "text": "Treat owner and page as part of the cache key, not incidental closure values."
        },
        {
          "stage": 3,
          "text": "Choose invalidation or a precise cache update and explain the freshness trade-off."
        }
      ],
      "expectedReasoning": "Remote data needs one explicit cache owner. Query keys identify variants, and mutation invalidation or updates prevent components from drifting apart.",
      "commonWrongPaths": [
        "Using one key for every project variant",
        "Copying query data into local state without a synchronization contract",
        "Showing a blank screen during every background refetch",
        "Assuming a successful mutation automatically updates every cache entry"
      ],
      "answerExplanation": "Define a key such as projects + ownerId + page, render stale data with an explicit fetching state when appropriate, and invalidate or update the affected query family after the write.",
      "followUpVariation": "Add a filter and decide whether it belongs in the key and which queries the mutation invalidates.",
      "checkType": "free-text",
      "prompt": "Explain the query key, state ownership, and mutation freshness policy for this dashboard.",
      "freeTextKeywords": [
        "server",
        "queryKey",
        "invalidate",
        "cache"
      ],
      "sourceLink": "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys",
      "sourceLinks": [
        "https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-query-key",
      "topicId": "expansion-client-server-state",
      "topicFamily": "nextjs-data",
      "question": "What belongs in a TanStack Query query key?",
      "answer": "Every variable that changes the result belongs in the key, such as an owner id, filter, or page. The key lets the cache distinguish data variants and refetch the correct one.",
      "followUp": "What can go wrong when a result-changing variable is omitted?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-client-server-state",
        "query-cache",
        "tanstack-query"
      ],
      "sourceLink": "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys"
    },
    {
      "id": "expansion-qa-query-invalidation",
      "topicId": "expansion-client-server-state",
      "topicFamily": "nextjs-data",
      "question": "Why should a mutation invalidate related queries?",
      "answer": "A successful write can make cached reads stale. Invalidation marks the affected query family for refresh so separate consumers do not keep presenting old server state.",
      "followUp": "When might a precise cache update be preferable to invalidation?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-client-server-state",
        "query-cache",
        "mutations"
      ],
      "sourceLink": "https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations"
    },
    {
      "id": "loop-qa-expansion-client-server-state-1",
      "topicId": "expansion-client-server-state",
      "topicFamily": "nextjs-data",
      "question": "What problem does Client State, Server State, and Query Caches help you solve?",
      "answer": "Remote data has ownership, freshness, and failure behavior that local UI state does not. Clear boundaries prevent duplicated caches, stale screens, and untestable synchronization effects.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-client-server-state"
      ],
      "sourceLink": "https://tanstack.com/query/latest/docs/framework/react/overview"
    }
  ],
  "practices": [
    {
      "id": "expansion-keep-server-state-in-cache",
      "topicId": "expansion-client-server-state",
      "topicFamily": "nextjs-data",
      "title": "Keep Server State in a Query Cache",
      "summary": "Let a server-state cache own remote data, freshness, loading, and error transitions instead of mirroring the response into unrelated local state.",
      "rationale": "Remote data has identity and freshness rules. A dedicated cache can coordinate consumers and expose invalidation semantics without hand-written synchronization effects.",
      "tradeOffs": "A cache library adds concepts and configuration. Use it where shared remote data, retries, or invalidation justify the boundary; keep simple one-off reads simple.",
      "appliesWhen": "Several components consume the same remote data or mutations must refresh related reads.",
      "doesNotApplyWhen": "The value is purely local UI state or a simple server render with no client cache requirement.",
      "example": "Use a query key containing project owner and page, then invalidate the project query family after a successful edit.",
      "sourceLink": "https://tanstack.com/query/latest/docs/framework/react/overview",
      "sourceLinks": [
        "https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations"
      ],
      "tags": [
        "expansion-client-server-state",
        "query-cache",
        "server-state"
      ]
    }
  ],
  "meta": {
    "topicFamily": "nextjs-data",
    "level": "advanced",
    "title": "Client State, Server State, and Query Caches"
  }
};
