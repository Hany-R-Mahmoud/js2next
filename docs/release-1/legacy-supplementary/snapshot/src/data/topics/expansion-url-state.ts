import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "expansion-url-state",
  "lesson": {
    "slug": "expansion-url-state",
    "title": "Shareable UI State with URL Search Params",
    "topicFamily": "nextjs-data",
    "level": "intermediate",
    "prerequisites": [
      "app-router-and-layouts"
    ],
    "learningObjectives": [
      "Separate shareable state from ephemeral UI state",
      "Read and update search params at the route boundary",
      "Keep filters bookmarkable without duplicating server state",
      "Choose a reset behavior users can predict"
    ],
    "whyMatters": "Search, filters, and pagination become easier to share, reload, and debug when their state has a URL representation.",
    "estimatedMinutes": 20,
    "sections": [
      {
        "id": "expansion-url-state-model",
        "type": "concept",
        "title": "Choose the owner",
        "content": "Put shareable filters, sorting, and pagination in the URL. Keep transient input, open menus, and draft text local until the product needs a shareable representation."
      },
      {
        "id": "expansion-url-state-code",
        "type": "code-example",
        "title": "Read a filter",
        "content": "Treat URL state as input to the route, not as a second hidden store.",
        "code": "const query = searchParams.get('query') ?? '';\nconst page = Number(searchParams.get('page') ?? '1');",
        "codeLanguage": "typescript",
        "codeFilePath": "Page or search-params boundary"
      },
      {
        "id": "expansion-url-state-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-url-state-check",
            "question": "Which state belongs in search params by default?",
            "options": [
              "Whether a tooltip is open",
              "A shareable product filter",
              "An uncontrolled input draft",
              "A WebSocket instance"
            ],
            "correctAnswer": "A shareable product filter",
            "expectedReasoning": "A filter benefits from links, refreshes, and browser history; the other values are ephemeral or external resources."
          }
        ]
      },
      {
        "id": "expansion-url-state-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "URL state is a public contract. Keep its names stable, parse defaults deliberately, and avoid copying it into another state store unless synchronization has a clear owner."
      }
    ],
    "retrievalPrompt": "Which UI values should survive a refresh or be shareable as a link?",
    "reflectionPrompt": "Pick one filter in your project. What should the URL show, and what should reset when the user changes it?",
    "masteryCriteria": [
      "Can distinguish shareable and ephemeral state",
      "Can parse a missing search param safely",
      "Can explain URL state as a product contract",
      "Can avoid duplicating URL state in a second store"
    ],
    "nextTopics": [
      "server-data-fetching"
    ],
    "metadata": {
      "nextVersion": "Next.js 15.5.20",
      "lastUpdated": "2026-07-15",
      "sources": [
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating"
      ]
    },
    "diagram": {
      "title": "URL state as a product contract",
      "kind": "flow",
      "nodes": [
        {
          "id": "contract",
          "label": "Shareable requirement",
          "role": "Refresh, link, history"
        },
        {
          "id": "params",
          "label": "Search params",
          "role": "Public view state"
        },
        {
          "id": "parse",
          "label": "Typed defaults",
          "role": "Invalid-input recovery"
        },
        {
          "id": "navigate",
          "label": "Navigation update",
          "role": "Single owner"
        }
      ],
      "edges": [
        {
          "from": "contract",
          "to": "params"
        },
        {
          "from": "params",
          "to": "parse"
        },
        {
          "from": "parse",
          "to": "navigate"
        }
      ]
    },
    "chunks": [
      {
        "id": "expansion-url-state-retrieval-1",
        "title": "Choose the owner",
        "concept": "A shareable filter must survive refresh and browser history, so the URL owns it instead of a hidden second store.",
        "prediction": {
          "prompt": "Where should a shareable product filter live?",
          "options": [
            "URL search params",
            "Only component state"
          ],
          "correctAnswer": "URL search params",
          "feedbackCorrect": "The URL makes the view reproducible and shareable.",
          "feedbackWrong": "Local state disappears on refresh and is invisible to links."
        },
        "synthesis": "Treat URL keys, defaults, and dependent resets as a public product contract."
      }
    ],
    "miniProject": {
      "title": "Design a shareable catalog view",
      "scenario": "Specify query, sort, and page search parameters with invalid-value defaults and reset behavior.",
      "acceptance": [
        "A copied URL restores the view",
        "Back/forward behavior is predictable",
        "Changing filters handles dependent pagination"
      ],
      "rubric": [
        {
          "dimension": "Ownership",
          "evidence": "The URL is the single owner of shareable view state."
        },
        {
          "dimension": "Parsing",
          "evidence": "Missing and invalid values have explicit safe defaults."
        },
        {
          "dimension": "Navigation",
          "evidence": "Updates preserve a coherent history and reset contract."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-design-url-filter-state",
      "title": "Design Shareable Filter State",
      "level": 5,
      "topicFamily": "nextjs-data",
      "scenario": "A catalog filter works until refresh, back-button navigation, or a teammate needs to share the exact view with a link.",
      "constraints": [
        "Keep the filter in the URL",
        "Define defaults for missing and invalid values",
        "Do not duplicate the filter in a second global store"
      ],
      "acceptanceCriteria": [
        "A copied URL restores the same filter",
        "Back and forward navigation restore prior filters",
        "Invalid values fall back to a documented default",
        "Changing the filter resets pagination deliberately"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Name the URL keys before writing components."
        },
        {
          "stage": 2,
          "text": "Parse at the route boundary and choose a default for invalid values."
        },
        {
          "stage": 3,
          "text": "Treat pagination reset as part of the filter contract."
        }
      ],
      "expectedReasoning": "Shareable state belongs in the URL because navigation, refresh, and collaboration are part of its behavior. A single owner prevents synchronization drift.",
      "commonWrongPaths": [
        "Keeping the filter only in useState",
        "Writing every transient UI value to the URL",
        "Changing filters while leaving an impossible page number"
      ],
      "answerExplanation": "Parse search params into typed route inputs, update them through navigation, and reset dependent pagination when the filter changes.",
      "followUpVariation": "Add a sort key and document which combinations are stable links.",
      "checkType": "free-text",
      "prompt": "Explain why URL search params are the owner for this filter and how you handle invalid input.",
      "freeTextKeywords": [
        "URL",
        "shareable",
        "default",
        "pagination"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating"
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-url-state",
      "topicId": "expansion-url-state",
      "topicFamily": "nextjs-data",
      "question": "When should a filter live in the URL?",
      "answer": "When users should be able to refresh, bookmark, navigate back to, or share that exact filtered view.",
      "followUp": "Which values should remain local instead?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "expansion",
        "url-state",
        "search-params"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating"
    },
    {
      "id": "loop-qa-expansion-url-state-1",
      "topicId": "expansion-url-state",
      "topicFamily": "nextjs-data",
      "question": "What problem does Shareable UI State with URL Search Params help you solve?",
      "answer": "Search, filters, and pagination become easier to share, reload, and debug when their state has a URL representation.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-url-state"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating"
    },
    {
      "id": "loop-qa-expansion-url-state-2",
      "topicId": "expansion-url-state",
      "topicFamily": "nextjs-data",
      "question": "How would you explain the core idea of Shareable UI State with URL Search Params to a teammate?",
      "answer": "Which UI values should survive a refresh or be shareable as a link? A strong explanation should connect the model to: Separate shareable state from ephemeral UI state; Read and update search params at the route boundary.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-url-state"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating"
    }
  ],
  "practices": [
    {
      "id": "bp-7",
      "title": "Use URL Search Params for Shareable Filters",
      "summary": "Store filter, sort, search, and pagination state in the URL when the view should be shareable or restorable.",
      "rationale": "URL state is shareable (bookmark a filtered view), survives refresh, works with browser back/forward, and is SEO-friendly. React state is ephemeral and invisible to the browser.",
      "tradeOffs": "URL manipulation is more verbose than setState. Reading/writing searchParams requires `useSearchParams` (Client) or the `searchParams` prop (Server). For very frequent updates (e.g., typing in a search box), debounce before updating the URL.",
      "appliesWhen": "State should be shareable via URL, should persist across navigation, or should be reflected in browser history.",
      "doesNotApplyWhen": "State is ephemeral and meaningless outside the current session (e.g., dropdown open state, animation progress, modal visibility). Keep that state local.",
      "example": "`/products?category=electronics&sort=price_asc&page=2` — all filter state is in the URL, shareable and bookmarkable.",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
      "tags": [
        "routing",
        "state",
        "architecture"
      ],
      "topicId": "expansion-url-state",
      "topicFamily": "nextjs-data"
    },
    {
      "id": "expansion-keep-shareable-state-in-url",
      "topicId": "expansion-url-state",
      "topicFamily": "nextjs-data",
      "title": "Keep Shareable Filters in the URL",
      "summary": "Represent filters, sorting, and pagination in search params when users need links, refreshes, or browser history.",
      "rationale": "A single URL owner makes the view reproducible and avoids synchronization drift between route state and a client store.",
      "tradeOffs": "URL keys become a public contract and need stable defaults, parsing, and reset rules.",
      "appliesWhen": "The state describes a view users may revisit or share.",
      "doesNotApplyWhen": "The value is transient interaction state such as an open menu or draft text.",
      "example": "Use `?query=react&page=2` for a catalog view; keep the filter popover’s open state local.",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
      "nextVersion": "Next.js 15.5.20",
      "tags": [
        "expansion",
        "url-state",
        "navigation"
      ]
    }
  ],
  "meta": {
    "topicFamily": "nextjs-data",
    "level": "intermediate",
    "title": "Shareable UI State with URL Search Params"
  }
};
