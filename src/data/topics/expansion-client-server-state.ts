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
      "Classify ephemeral client state, shareable URL state, and authoritative remote data",
      "Design query keys from every input that changes the returned data",
      "Distinguish initial loading, background fetching, stale data, failure, and success",
      "Make related cached reads current after a successful mutation"
    ],
    "whyMatters": "A query cache solves remote-data coordination, not every state problem. Clear ownership prevents a form draft, URL filter, server result, and second hand-written copy from drifting apart while helping several consumers share freshness and failure behavior.",
    "estimatedMinutes": 40,
    "sections": [
      {
        "id": "expansion-client-server-state-model",
        "type": "concept",
        "title": "Name the owner",
        "content": "Classify a value before choosing a store. A menu’s open state is temporary interaction and usually stays local. A filter that must survive reload, sharing, or browser history belongs in the URL. Authoritative projects remain server data. A Server Component may be enough for a simple server-rendered read. A client query cache becomes useful when mounted client consumers need shared remote data, background refresh, retries, or mutation invalidation. It does not replace local state or make every feature require a new dependency.\n\nRemote data has an identity and freshness policy. A query key names one result variant. The cache can then distinguish current data from a first load, background fetch, failure, and invalidation after a write."
      },
      {
        "id": "expansion-client-server-state-code",
        "type": "code-example",
        "title": "Make the query identity explicit",
        "content": "The key includes every variable used by the request. After an authorized edit succeeds, invalidating the owner’s project prefix marks each affected page and filter stale without maintaining a second copy in component state.",
        "code": "const projects = useQuery({\n  queryKey: ['projects', { ownerId, status, page }],\n  queryFn: () => fetchProjects({ ownerId, status, page }),\n});\n\nconst editProject = useMutation({\n  mutationFn: saveProject,\n  onSuccess: () => {\n    queryClient.invalidateQueries({\n      queryKey: ['projects', { ownerId }],\n    });\n  },\n});",
        "codeLanguage": "tsx",
        "codeFilePath": "app/projects/ProjectDashboard.tsx"
      },
      {
        "id": "expansion-client-server-state-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-client-server-state-check",
            "question": "A project request changes when ownerId, status, or page changes. Which query identity is complete?",
            "options": [
              "['projects', { ownerId, status, page }]",
              "['projects'] for every possible result",
              "['projects', Math.random()] on every render",
              "A local copy of the result with no query key"
            ],
            "correctAnswer": "['projects', { ownerId, status, page }]",
            "expectedReasoning": "Every request variable that changes the result belongs in the key, so the cache can reuse and refresh the correct variant. One broad key conflates results, a random key prevents useful identity, and an unrelated local copy creates another owner."
          }
        ]
      },
      {
        "id": "expansion-client-server-state-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Choose a query cache only when remote-data behavior needs that client boundary. Give each result a complete key, state when it becomes stale, and connect successful writes to precise invalidation or a careful cache update. Keep transient interaction local, shareable view state in the URL, server authorization at the mutation boundary, and cached remote data in one cache owner."
      }
    ],
    "retrievalPrompt": "Classify a project dashboard’s menu state, URL filters, project rows, query identity, freshness, mutation, invalidation, and retry owner.",
    "reflectionPrompt": "Choose one client cache in your project. Which requirement justifies it, which values define its keys, and what exact write makes each entry stale?",
    "masteryCriteria": [
      "Can choose local, URL, server-rendered, or client-cache ownership from lifetime and consumer needs",
      "Can include every result-changing variable in a query key",
      "Can preserve useful stale data during a visible background refresh",
      "Can invalidate or update the affected query family only after a successful write"
    ],
    "nextTopics": [
      "deep-dive-nextjs-data"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://tanstack.com/query/latest/docs/framework/react/overview",
        "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys",
        "https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations",
        "https://nextjs.org/docs/app/getting-started/fetching-data",
        "https://tanstack.com/query/latest/docs/framework/react/guides/background-fetching-indicators",
        "https://nextjs.org/docs/15/app/getting-started/fetching-data"
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
        "concept": "Query keys describe remote data identity; they are not arbitrary refresh switches.",
        "prediction": {
          "prompt": "The project list request uses owner, filter, and page. What must the key include?",
          "options": [
            "Owner, filter, and page",
            "Only a generic projects label",
            "A new random value on every render"
          ],
          "correctAnswer": "Owner, filter, and page",
          "feedbackCorrect": "Those variables define which server result the cache is storing.",
          "feedbackWrong": "An incomplete key conflates results, while a random key discards stable identity and reuse."
        },
        "synthesis": "Write the request variables first, then express the same identity in the key."
      }
    ],
    "miniProject": {
      "title": "Design a query cache boundary",
      "scenario": "Design a project dashboard with a URL-owned status filter, paged client queries, protected edits, and background refresh.",
      "acceptance": [
        "Local, URL, and remote values each have one named owner",
        "Every request-changing variable is present in the query key",
        "Initial loading, stale data with background fetching, error, success, and retry are distinguishable",
        "A successful edit invalidates or precisely updates only the affected project data"
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
      "scenario": "A dashboard fetches projects in a table, summary, and editor. Changing owner, status, or page sometimes shows the wrong cached result, and a successful edit updates only one local copy.",
      "constraints": [
        "Keep one owner for remote project data",
        "Include every result-changing request variable in the key",
        "Define initial, background, error, retry, and stale-data behavior",
        "Refresh affected reads only after an authorized mutation succeeds"
      ],
      "acceptanceCriteria": [
        "The state inventory separates local interaction, URL state, and remote data",
        "The query key contains ownerId, status, and page for the paged list",
        "Table and summary read from the cache boundary rather than mirrored component copies",
        "A successful edit invalidates or updates the smallest affected query family",
        "Background refresh may preserve visible data while exposing fetching and retry state"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write a state table with value, lifetime, consumers, and authoritative owner."
        },
        {
          "stage": 2,
          "text": "Compare the query function parameters with the key; every result-changing parameter belongs in both."
        },
        {
          "stage": 3,
          "text": "After success, choose a prefix invalidation or precise update and explain why it reaches every stale consumer."
        }
      ],
      "expectedReasoning": "The URL owns shareable filters, components own temporary interaction, and one query cache coordinates remote projects. Complete keys prevent result collisions. A protected successful write creates staleness, so targeted invalidation or a precise update restores consistency without a second hand-written store.",
      "commonWrongPaths": [
        "Using one projects key for every owner, filter, and page",
        "Copying query data into several component states",
        "Blanking useful data during every background refetch",
        "Assuming a successful mutation updates every related cache entry automatically"
      ],
      "answerExplanation": "Classify ownership, make request identity complete, share remote data through one cache, and connect a successful write to the exact cached reads it makes stale.",
      "followUpVariation": "Add an optimistic row title. Define rollback behavior and explain which server response remains authoritative.",
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
        "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys",
        "https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations",
        "https://tanstack.com/query/latest/docs/framework/react/guides/background-fetching-indicators"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-query-key",
      "topicId": "expansion-client-server-state",
      "topicFamily": "nextjs-data",
      "question": "What belongs in a TanStack Query query key?",
      "answer": "Include every variable that the query function uses to change its result, such as owner id, status, and page. A complete key gives each result variant a stable identity, so the cache can reuse, refetch, and invalidate the intended data.",
      "followUp": "Compare one query function with its key. Which result-changing argument, if any, is missing?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-client-server-state",
        "query-cache",
        "tanstack-query"
      ],
      "sourceLink": "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys",
      "sourceLinks": [
        "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys"
      ]
    },
    {
      "id": "expansion-qa-query-invalidation",
      "topicId": "expansion-client-server-state",
      "topicFamily": "nextjs-data",
      "question": "Why should a mutation invalidate related queries?",
      "answer": "A successful write can make one or more cached reads stale. Invalidation marks the matching queries stale and lets active consumers refetch according to the cache rules. A precise update may be appropriate when the mutation response contains the complete authoritative replacement.",
      "followUp": "Which query prefix represents every project view made stale by your mutation?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-client-server-state",
        "query-cache",
        "mutations"
      ],
      "sourceLink": "https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations",
      "sourceLinks": [
        "https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations"
      ]
    },
    {
      "id": "loop-qa-expansion-client-server-state-1",
      "topicId": "expansion-client-server-state",
      "topicFamily": "nextjs-data",
      "question": "When is a client query cache unnecessary for a server read?",
      "answer": "When a Server Component can perform the read and the screen does not need mounted client consumers, background refresh, retry coordination, or client mutation invalidation. Keep the simpler server-rendered boundary until a concrete client-cache requirement appears.",
      "followUp": "Which user behavior in your feature would justify adding a client cache?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-client-server-state"
      ],
      "sourceLink": "https://tanstack.com/query/latest/docs/framework/react/overview",
      "sourceLinks": [
        "https://tanstack.com/query/latest/docs/framework/react/overview",
        "https://nextjs.org/docs/15/app/getting-started/fetching-data"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-keep-server-state-in-cache",
      "topicId": "expansion-client-server-state",
      "topicFamily": "nextjs-data",
      "title": "Keep Server State in a Query Cache",
      "summary": "When client consumers need coordinated remote data, let one query cache own its identity, freshness, loading, failure, and invalidation.",
      "rationale": "Remote data can change outside a component and has request and staleness rules. One cache owner coordinates consumers without Effects that copy the same response among local stores.",
      "tradeOffs": "A cache library adds configuration and concepts. Prefer a simple Server Component read when background client behavior, shared mounted consumers, or mutation invalidation do not justify that boundary.",
      "appliesWhen": "Several mounted client consumers share remote data or client mutations need coordinated freshness, retry, or background refresh.",
      "doesNotApplyWhen": "The value is local interaction state, URL-owned view state, or a simple server-rendered read with no client-cache requirement.",
      "example": "Cache projects by owner, status, and page, then invalidate the affected owner’s project family after a successful protected edit.",
      "sourceLink": "https://tanstack.com/query/latest/docs/framework/react/overview",
      "sourceLinks": [
        "https://tanstack.com/query/latest/docs/framework/react/overview",
        "https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations",
        "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys",
        "https://nextjs.org/docs/15/app/getting-started/fetching-data"
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
