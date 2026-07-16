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
      "Compare local state, Zustand, Redux, URL state, and server-state caches by ownership",
      "Distinguish Next App Router from a client-side routing library",
      "Choose the smallest tool boundary that fits the product contract",
      "Write a migration decision with trade-offs instead of copying ecosystem defaults"
    ],
    "whyMatters": "Libraries solve different boundaries. Choosing by popularity can create duplicate stores, competing routers, or unnecessary client code; choosing by ownership makes the architecture explainable.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "expansion-ecosystem-comparisons-model",
        "type": "concept",
        "title": "Compare responsibilities",
        "content": "URL state belongs to navigation, server state belongs to a cache or server boundary, and local UI state belongs near the interaction. Redux or Zustand can coordinate client-owned state; Next App Router owns the app’s route model here."
      },
      {
        "id": "expansion-ecosystem-comparisons-code",
        "type": "code-example",
        "title": "Record the decision",
        "content": "A tool decision should name the owner, the reason, and the cost of adding another boundary.",
        "code": "type Decision = {\n  owner: 'url' | 'server-cache' | 'client-store' | 'local';\n  tool: 'Next App Router' | 'TanStack Query' | 'Zustand' | 'Redux';\n  reason: string;\n  rejectedAlternative: string;\n};",
        "codeLanguage": "typescript",
        "codeFilePath": "Architecture decision record"
      },
      {
        "id": "expansion-ecosystem-comparisons-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-ecosystem-comparisons-check",
            "question": "A shareable filter must survive refresh and browser history. Which owner should be evaluated first?",
            "options": [
              "A new global Redux slice",
              "URL search params in the existing Next route model",
              "A random module variable",
              "A second client-side router"
            ],
            "correctAnswer": "URL search params in the existing Next route model",
            "expectedReasoning": "The product contract is navigation and shareability. A new global store or router duplicates ownership unless a separate requirement justifies it."
          }
        ]
      },
      {
        "id": "expansion-ecosystem-comparisons-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Map state and navigation responsibilities first. Add Redux, React Router, or another library only when its specific boundary and trade-off are clearer than the existing platform capabilities."
      }
    ],
    "retrievalPrompt": "What requirement would justify adding another state store or router to a Next.js app?",
    "reflectionPrompt": "Choose one feature. Which values are local, URL-owned, server-owned, or shared client state, and which existing boundary should remain the single owner?",
    "masteryCriteria": [
      "Can compare state ownership across tools",
      "Can explain Next App Router versus client routing",
      "Can reject duplicate boundaries",
      "Can record a migration trade-off"
    ],
    "nextTopics": [
      "deep-dive-architecture-decisions"
    ],
    "metadata": {
      "lastUpdated": "2026-07-15",
      "sources": [
        "https://nextjs.org/docs/app",
        "https://redux-toolkit.js.org/introduction/getting-started",
        "https://reactrouter.com/home"
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
        "concept": "A shareable filter belongs to the URL first; adding Redux or a second router requires a distinct unmet requirement.",
        "prediction": {
          "prompt": "What should be evaluated first for a shareable filter?",
          "options": [
            "URL search params in the current route model",
            "A new global store by default"
          ],
          "correctAnswer": "URL search params in the current route model",
          "feedbackCorrect": "The product contract identifies the owner before the tool.",
          "feedbackWrong": "A global store would duplicate navigation ownership without evidence."
        },
        "synthesis": "Choose the smallest boundary that fits the requirement, then record why another tool was rejected."
      }
    ],
    "miniProject": {
      "title": "Write an ecosystem decision record",
      "scenario": "Compare Next App Router, URL state, server cache, Zustand, Redux Toolkit, and React Router for one feature.",
      "acceptance": [
        "Each value has one proposed owner",
        "The platform capability is compared with library alternatives",
        "A migration trigger is measurable"
      ],
      "rubric": [
        {
          "dimension": "Ownership",
          "evidence": "State, route, and server data are not assigned duplicate owners."
        },
        {
          "dimension": "Trade-off",
          "evidence": "The cost and benefit of each candidate are explicit."
        },
        {
          "dimension": "Reversibility",
          "evidence": "The decision names evidence that would justify change."
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
      "scenario": "A team proposes Redux for a shareable filter and React Router beside Next App Router. The feature already has URL search params, a persisted learner store, and a server-state cache boundary.",
      "constraints": [
        "Name the state or routing owner first",
        "Avoid duplicate sources of truth",
        "Compare a platform capability with a library capability",
        "Record when an additional tool would become justified"
      ],
      "acceptanceCriteria": [
        "The filter remains owned by the URL",
        "The proposal identifies whether Redux adds a distinct client-state need",
        "The routing choice does not create competing route identity",
        "Trade-offs and migration triggers are documented"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Classify each value before discussing libraries."
        },
        {
          "stage": 2,
          "text": "Ask what requirement Next App Router and the current stores cannot satisfy."
        },
        {
          "stage": 3,
          "text": "Write a reversible decision and one measurable trigger for revisiting it."
        }
      ],
      "expectedReasoning": "Tool choice follows ownership and requirements. Adding Redux or a second router without a distinct boundary creates synchronization and identity costs.",
      "commonWrongPaths": [
        "Adding Redux because the app is growing",
        "Putting URL filters in both search params and a store",
        "Running two routers without a route-ownership contract",
        "Treating library popularity as architecture evidence"
      ],
      "answerExplanation": "Keep the filter in the URL and Next App Router. Add a client store only for distinct shared client state, and add another router only after a concrete route-model requirement and migration plan exist.",
      "followUpVariation": "A separate admin app needs a different routing tree but shares UI primitives. Re-evaluate the boundary without duplicating domain state by default.",
      "checkType": "free-text",
      "prompt": "Explain whether Redux or React Router should be added and what evidence would change the decision.",
      "freeTextKeywords": [
        "URL",
        "owner",
        "router",
        "trade-off"
      ],
      "sourceLink": "https://nextjs.org/docs/app",
      "sourceLinks": [
        "https://redux-toolkit.js.org/introduction/getting-started",
        "https://reactrouter.com/home"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-tool-ownership",
      "topicId": "expansion-ecosystem-comparisons",
      "topicFamily": "architecture",
      "question": "How should you decide whether to add Redux or another client store?",
      "answer": "First identify shared client-owned state that existing local, URL, or server-state boundaries do not serve well. Add a store only when its distinct ownership, benefits, and migration cost are explicit.",
      "followUp": "Why is a growing app alone not enough evidence?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "expansion-ecosystem-comparisons",
        "redux",
        "state-ownership"
      ],
      "sourceLink": "https://redux-toolkit.js.org/introduction/getting-started"
    },
    {
      "id": "expansion-qa-next-router-choice",
      "topicId": "expansion-ecosystem-comparisons",
      "topicFamily": "architecture",
      "question": "Why can adding React Router beside Next App Router be risky?",
      "answer": "It can create competing route identity, data-loading models, navigation semantics, and ownership of URLs. A second router needs a concrete boundary and an explicit integration contract.",
      "followUp": "What separate requirement might justify it?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-ecosystem-comparisons",
        "react-router",
        "next-app-router"
      ],
      "sourceLink": "https://nextjs.org/docs/app"
    },
    {
      "id": "loop-qa-expansion-ecosystem-comparisons-1",
      "topicId": "expansion-ecosystem-comparisons",
      "topicFamily": "architecture",
      "question": "What problem does Choose State and Routing Tools Deliberately help you solve?",
      "answer": "Libraries solve different boundaries. Choosing by popularity can create duplicate stores, competing routers, or unnecessary client code; choosing by ownership makes the architecture explainable.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-ecosystem-comparisons"
      ],
      "sourceLink": "https://nextjs.org/docs/app"
    }
  ],
  "practices": [
    {
      "id": "expansion-record-tool-ownership",
      "topicId": "expansion-ecosystem-comparisons",
      "topicFamily": "architecture",
      "title": "Record Tool Ownership Before Adding Libraries",
      "summary": "Name the state or route owner and rejected alternatives before adding another ecosystem tool.",
      "rationale": "Explicit ownership prevents duplicate stores, competing routers, and synchronization code that exists only because a library was added without a distinct requirement.",
      "tradeOffs": "Writing a short decision record slows the first implementation. It makes later migration safer and gives the team a concrete trigger for revisiting the choice.",
      "appliesWhen": "A feature proposal introduces a new state, data, routing, or framework library.",
      "doesNotApplyWhen": "The tool is an internal implementation detail with no competing ownership or user-visible contract.",
      "example": "Keep a shareable filter in Next URL search params; add a client store only for a separate shared client-state requirement.",
      "sourceLink": "https://nextjs.org/docs/app",
      "sourceLinks": [
        "https://redux-toolkit.js.org/introduction/getting-started",
        "https://reactrouter.com/home"
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
