import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "expansion-ecosystem-comparisons",
  "lesson": {
    "slug": "expansion-ecosystem-comparisons",
    "title": "Choose State and Routing Tools Deliberately",
    "topicFamily": "architecture",
    "level": "advanced",
    "prerequisites": [
      "expansion-client-server-state",
      "expansion-url-state"
    ],
    "learningObjectives": [
      "Classify local interaction, URL, remote server, and shared client state before choosing a library",
      "Compare Next App Router, React Router, Redux Toolkit, and a query cache by the responsibility each would own",
      "Prefer an existing platform boundary when it already satisfies the product contract",
      "Record benefits, costs, migration work, and a measurable trigger for revisiting the decision"
    ],
    "whyMatters": "A library can be excellent and still be the wrong owner for a value. Starting with lifetime, consumers, navigation, freshness, and trust prevents two routers or stores from competing for the same truth and keeps a future migration understandable.",
    "estimatedMinutes": 40,
    "sections": [
      {
        "id": "expansion-ecosystem-comparisons-model",
        "type": "concept",
        "title": "Compare responsibilities",
        "content": "First name the responsibility. Temporary interaction such as a modal usually stays local. A filter that must survive reload, sharing, and browser history belongs in the URL. Authoritative remote projects belong to the server and, when client coordination requires it, one query cache. Shared client-owned workflow state may justify a client store when lifting or composition no longer gives it a clear owner.\n\nNext App Router already owns routes, layouts, navigation, and server/client rendering in this application. React Router has its own routing and data APIs and may be right for a different application or a deliberate isolated boundary, but adding it beside Next without a route-ownership contract creates competing URL identities. Compare actual capabilities, integration cost, bundle and client boundaries, testing, migration, and exit cost."
      },
      {
        "id": "expansion-ecosystem-comparisons-code",
        "type": "code-example",
        "title": "Record the decision",
        "content": "A decision record starts with the state or route requirement, not the tool name. It records one owner, why existing capabilities do or do not fit, accepted costs, and evidence that would reopen the choice.",
        "code": "type ToolDecision = {\n  requirement: string;\n  owner: 'local' | 'url' | 'server' | 'query-cache' | 'client-store';\n  chosenBoundary: string;\n  consideredAlternatives: string[];\n  acceptedCosts: string[];\n  reviewTrigger: string;\n};",
        "codeLanguage": "typescript",
        "codeFilePath": "docs/decisions/021-state-and-routing-owner.ts"
      },
      {
        "id": "expansion-ecosystem-comparisons-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-ecosystem-comparisons-check",
            "question": "A catalog filter must be shareable, survive refresh, and support browser Back. Which owner should be evaluated first?",
            "options": [
              "URL search parameters in the existing Next route model",
              "A new Redux slice that must synchronize with the URL",
              "A module variable that resets on reload",
              "A second router with no ownership boundary"
            ],
            "correctAnswer": "URL search parameters in the existing Next route model",
            "expectedReasoning": "The requirements are navigation, sharing, refresh, and history, which the URL already owns. The other choices either lose those behaviors or add a second source that must be synchronized without a distinct requirement."
          }
        ]
      },
      {
        "id": "expansion-ecosystem-comparisons-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Choose ownership before libraries. Use local state for local interaction, URL state for navigation, server or query-cache state for remote data, and a client store only for a distinct shared client lifecycle. Keep one route model unless an explicit isolation or migration contract justifies another, and record the evidence that would change the decision."
      }
    ],
    "retrievalPrompt": "Classify a shareable filter, modal state, project list, and multi-step client draft, then compare the smallest suitable owner and tool for each.",
    "reflectionPrompt": "Choose one proposed dependency. Which requirement is unmet today, which existing boundary was evaluated, and what measurable signal would justify the added tool?",
    "masteryCriteria": [
      "Can classify values by owner, lifetime, consumers, and trust boundary",
      "Can compare tools without treating popularity or app size as a requirement",
      "Can avoid duplicate URL, remote-data, or client-state ownership",
      "Can write a reversible decision with migration and removal costs"
    ],
    "nextTopics": [
      "deep-dive-architecture-decisions"
    ],
    "metadata": {
      "nextVersion": "15.5.20",
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/app",
        "https://redux-toolkit.js.org/introduction/getting-started",
        "https://reactrouter.com/home",
        "https://nextjs.org/docs/15/app",
        "https://tanstack.com/query/latest/docs/framework/react/overview"
      ]
    },
    "diagram": {
      "title": "Requirement to tool decision",
      "kind": "flow",
      "nodes": [
        {
          "id": "need",
          "label": "Product requirement",
          "role": "Shareability, freshness, or interaction"
        },
        {
          "id": "owner",
          "label": "Current owner",
          "role": "URL, server, local, or client"
        },
        {
          "id": "compare",
          "label": "Tool comparison",
          "role": "Platform and library trade-offs"
        },
        {
          "id": "record",
          "label": "Decision record",
          "role": "Rejected alternatives and trigger"
        }
      ],
      "edges": [
        {
          "from": "need",
          "to": "owner"
        },
        {
          "from": "owner",
          "to": "compare"
        },
        {
          "from": "compare",
          "to": "record"
        }
      ]
    },
    "chunks": [
      {
        "id": "expansion-ecosystem-comparisons-retrieval-1",
        "title": "Choose ownership before libraries",
        "concept": "Tool choice follows a product responsibility and one accountable owner.",
        "prediction": {
          "prompt": "Several client components need the same remote projects and mutation freshness. Which boundary should be evaluated before a general client store?",
          "options": [
            "One server-state query cache",
            "Duplicate local arrays in each component",
            "A second router"
          ],
          "correctAnswer": "One server-state query cache",
          "feedbackCorrect": "The requirement is shared remote-data identity and freshness, which a query cache is designed to own.",
          "feedbackWrong": "Duplicated arrays or an unrelated router do not provide one remote-data freshness contract."
        },
        "synthesis": "Match the tool’s responsibility to the state’s real owner."
      }
    ],
    "miniProject": {
      "title": "Write an ecosystem decision record",
      "scenario": "Write a decision for a dashboard with shareable filters, cached server projects, local menus, and a multi-step client draft used across distant components.",
      "acceptance": [
        "Every value has one owner based on lifetime and consumers",
        "Next App Router and URL capabilities are evaluated before another router or store",
        "Redux Toolkit, a smaller client store, and local composition are compared for the draft",
        "The chosen boundary includes integration cost, migration plan, exit cost, and a measurable review trigger"
      ],
      "rubric": [
        {
          "dimension": "Ownership",
          "evidence": "No value is writable in two route or state systems."
        },
        {
          "dimension": "Comparison",
          "evidence": "Each candidate is evaluated for the responsibility it actually provides."
        },
        {
          "dimension": "Reversibility",
          "evidence": "The record identifies migration steps and evidence for changing or removing the tool."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-review-ecosystem-choice",
      "title": "Review an Ecosystem Tool Proposal",
      "level": 8,
      "topicFamily": "architecture",
      "scenario": "A Next.js dashboard already uses URL search parameters for filters and a query cache for remote projects. A proposal adds Redux for the same filters and React Router around part of the same route tree because “the app is getting large.” Review the proposal.",
      "constraints": [
        "Classify every value and route responsibility before naming a tool",
        "Keep one writable owner for URL and remote data",
        "Compare platform capabilities with each proposed library capability",
        "Record a distinct requirement and measurable trigger for any added boundary"
      ],
      "acceptanceCriteria": [
        "Shareable filters remain URL-owned unless a new requirement disproves that fit",
        "Remote project data remains server/query-cache owned rather than copied into Redux",
        "React Router is rejected for the same route tree unless an explicit isolation or migration contract exists",
        "Any Redux use is tied to distinct shared client-owned state",
        "The decision records integration, testing, bundle, migration, and exit costs"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Create rows for filter, projects, modal, and draft with lifetime, consumers, and current owner."
        },
        {
          "stage": 2,
          "text": "Ask which specific capability the existing Next route and query boundaries cannot provide."
        },
        {
          "stage": 3,
          "text": "Write the review trigger as observable evidence, not “when the app feels bigger.”"
        }
      ],
      "expectedReasoning": "App size is not a state or routing requirement. The URL already owns shareable filters, and a query cache owns remote freshness. A client store or router is justified only by a distinct responsibility that can be named, integrated, tested, and later migrated.",
      "commonWrongPaths": [
        "Adding Redux because the application has many files",
        "Keeping writable filter copies in both URL and store",
        "Copying remote query data into a second client cache",
        "Running two routers over the same URLs without an ownership contract"
      ],
      "answerExplanation": "Keep existing owners where they fit, reject duplicate writable boundaries, and approve a new library only for a distinct unmet requirement with explicit costs and a review trigger.",
      "followUpVariation": "A separately deployed admin application needs its own routing tree but shares UI primitives. Re-evaluate routing and shared-package boundaries without sharing app state by default.",
      "checkType": "free-text",
      "prompt": "Review each proposed owner, library capability, duplication risk, cost, and the evidence that would change the decision.",
      "freeTextKeywords": [
        "owner",
        "URL",
        "server",
        "router",
        "trade-off"
      ],
      "sourceLink": "https://nextjs.org/docs/app",
      "sourceLinks": [
        "https://nextjs.org/docs/app",
        "https://redux-toolkit.js.org/introduction/getting-started",
        "https://reactrouter.com/home",
        "https://nextjs.org/docs/15/app",
        "https://tanstack.com/query/latest/docs/framework/react/overview"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-tool-ownership",
      "topicId": "expansion-ecosystem-comparisons",
      "topicFamily": "architecture",
      "question": "How should you decide whether to add Redux or another client store?",
      "answer": "Identify shared client-owned state whose lifetime and consumers are not served clearly by local state, composition, the URL, or a server-state cache. Then compare a store’s API, subscriptions, testing, bundle, migration, and ownership cost. Application size alone does not define that requirement.",
      "followUp": "Which concrete shared client value cannot be owned clearly by the boundaries already in your app?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "expansion-ecosystem-comparisons",
        "redux",
        "state-ownership"
      ],
      "sourceLink": "https://redux-toolkit.js.org/introduction/getting-started",
      "sourceLinks": [
        "https://redux-toolkit.js.org/introduction/getting-started"
      ]
    },
    {
      "id": "expansion-qa-next-router-choice",
      "topicId": "expansion-ecosystem-comparisons",
      "topicFamily": "architecture",
      "question": "Why can adding React Router beside Next App Router be risky?",
      "answer": "Both systems can own URL matching, navigation, data APIs, and route identity. Using them over the same application tree can split history and loading behavior. Add a second router only for a deliberate isolated application or migration boundary with one clear owner for each URL.",
      "followUp": "Which URLs, navigation events, and data loaders would belong exclusively to the proposed second boundary?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-ecosystem-comparisons",
        "react-router",
        "next-app-router"
      ],
      "sourceLink": "https://nextjs.org/docs/app",
      "sourceLinks": [
        "https://nextjs.org/docs/app",
        "https://nextjs.org/docs/15/app",
        "https://reactrouter.com/home"
      ]
    },
    {
      "id": "loop-qa-expansion-ecosystem-comparisons-1",
      "topicId": "expansion-ecosystem-comparisons",
      "topicFamily": "architecture",
      "question": "What information should appear before a library name in a state or routing decision?",
      "answer": "Record the product requirement, value lifetime, consumers, trust boundary, current owner, and missing capability. Then compare candidate tools, accepted costs, migration path, exit cost, and the evidence that would reopen the choice.",
      "followUp": "Which proposed tool in your project currently lacks a named missing capability?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-ecosystem-comparisons"
      ],
      "sourceLink": "https://nextjs.org/docs/app",
      "sourceLinks": [
        "https://nextjs.org/docs/app",
        "https://nextjs.org/docs/15/app"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-record-tool-ownership",
      "topicId": "expansion-ecosystem-comparisons",
      "topicFamily": "architecture",
      "title": "Record Tool Ownership Before Adding Libraries",
      "summary": "Before adding a state, data, or routing library, name the requirement and one owner, then compare existing capabilities and migration costs.",
      "rationale": "Ownership-first decisions prevent duplicate stores, caches, and route identities while giving the team a clear reason to revisit a choice later.",
      "tradeOffs": "A short decision record slows the first implementation and may preserve a simpler local solution. It reduces hidden synchronization and makes later adoption or removal safer.",
      "appliesWhen": "A proposal adds or replaces a state store, server-state cache, router, or framework-level boundary.",
      "doesNotApplyWhen": "A tool is a truly internal implementation detail with no new owner, runtime boundary, or user-visible contract.",
      "example": "Keep shareable filters in Next search params and remote projects in one query cache; evaluate a client store only for a separate cross-tree draft lifecycle.",
      "sourceLink": "https://nextjs.org/docs/app",
      "sourceLinks": [
        "https://nextjs.org/docs/app",
        "https://redux-toolkit.js.org/introduction/getting-started",
        "https://reactrouter.com/home",
        "https://nextjs.org/docs/15/app"
      ],
      "tags": [
        "expansion-ecosystem-comparisons",
        "architecture",
        "tooling"
      ]
    }
  ],
  "meta": {
    "topicFamily": "architecture",
    "level": "advanced",
    "title": "Choose State and Routing Tools Deliberately"
  }
};
