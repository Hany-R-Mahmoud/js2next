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
      "Choose URL state when refresh, sharing, or browser history must reproduce a view",
      "Parse missing, repeated, and invalid search parameters at the route boundary",
      "Update search parameters without maintaining a second writable copy",
      "Define push, replace, debounce, and dependent reset behavior from the user flow"
    ],
    "whyMatters": "A URL can be a product contract for a view. When filters, sorting, search, and pagination live there, a copied link and browser navigation can reproduce the same state. Clear parsing and update rules keep that contract predictable.",
    "estimatedMinutes": 34,
    "sections": [
      {
        "id": "expansion-url-state-model",
        "type": "concept",
        "title": "Choose the owner",
        "content": "Put a value in the URL when another person, a refresh, or browser Back and Forward should reproduce it. Product filters, sorting, search, tabs with stable meaning, and pagination often fit. Keep transient interaction such as a menu being open, hover, animation progress, or an unsaved draft local unless the product explicitly needs a public representation.\n\nThe URL is the single owner. Parse it into application values and derive the view from those values. Do not keep an independent writable filter copy in component or global state, because two owners require synchronization and can disagree."
      },
      {
        "id": "expansion-url-state-code",
        "type": "code-example",
        "title": "Read a filter",
        "content": "In Next.js 15, a page awaits its `searchParams` prop. The parsing boundary validates defaults before data fetching uses them.",
        "code": "type CatalogParams = Promise<{ query?: string; page?: string; sort?: string }>;\n\nexport default async function CatalogPage({\n  searchParams,\n}: { searchParams: CatalogParams }) {\n  const raw = await searchParams;\n  const query = raw.query?.trim() ?? '';\n  const parsedPage = Number.parseInt(raw.page ?? '1', 10);\n  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;\n  const sort = raw.sort === 'price' ? 'price' : 'relevance';\n\n  const products = await getProducts({ query, page, sort });\n  return <Catalog products={products} />;\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/products/page.tsx"
      },
      {
        "id": "expansion-url-state-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-url-state-check",
            "question": "Which value is the strongest default candidate for URL search parameters?",
            "options": [
              "A product filter that teammates should share and restore",
              "Whether the filter popover is currently open",
              "The active WebSocket connection object",
              "A password draft before submission"
            ],
            "correctAnswer": "A product filter that teammates should share and restore",
            "expectedReasoning": "The product filter has public lifetime requirements: link sharing, reload, and history. Popover state is ephemeral, a WebSocket is an external resource rather than serializable view state, and sensitive unsaved input should not be placed in a URL."
          }
        ]
      },
      {
        "id": "expansion-url-state-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Treat search parameters as a stable public input: name keys clearly, parse defaults, reject or normalize invalid values, and define dependent resets such as returning to page 1 when a filter changes. Use navigation updates as the one writer. Keep transient and sensitive values local."
      }
    ],
    "retrievalPrompt": "For a catalog query, category, sort, and page, define URL keys, parsing defaults, invalid-value behavior, navigation history, and which transient controls remain local.",
    "reflectionPrompt": "Copy one filtered view URL, reload it, and use Back and Forward. Which value fails to reproduce, and where is its second owner?",
    "masteryCriteria": [
      "Can justify URL ownership from sharing and navigation requirements",
      "Parses route input into safe application values",
      "Updates one URL source of truth without a synchronization Effect",
      "Can explain when to reset page and whether an update should push or replace history"
    ],
    "nextTopics": [
      "server-data-fetching"
    ],
    "metadata": {
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
        "https://nextjs.org/docs/15/app/api-reference/file-conventions/page#searchparams-optional",
        "https://nextjs.org/docs/15/app/api-reference/functions/use-search-params",
        "https://nextjs.org/docs/15/app/api-reference/functions/use-router",
        "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams"
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
        "concept": "URL ownership follows reproducibility: link, refresh, and history should restore the same meaningful view.",
        "prediction": {
          "prompt": "A category changes while the URL still says `page=8`, but the new category has two pages. What should the update contract do?",
          "options": [
            "Reset page to 1 while updating the category",
            "Keep an impossible page and show a blank view"
          ],
          "correctAnswer": "Reset page to 1 while updating the category",
          "feedbackCorrect": "The dependent reset keeps the public URL in a valid, predictable state.",
          "feedbackWrong": "Changing one parameter can invalidate another; define that relationship in the update contract."
        },
        "synthesis": "Stable keys, safe defaults, and dependent resets are part of the URL API."
      }
    ],
    "miniProject": {
      "title": "Design a shareable catalog view",
      "scenario": "Design a shareable product catalog with query, category, sort, and page search parameters.",
      "acceptance": [
        "A copied URL and reload reproduce the same valid view",
        "Missing, repeated, malformed, and out-of-range values have documented behavior",
        "Filter changes reset dependent pagination deliberately",
        "Typing updates are debounced and use a stated push or replace history policy"
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
      "scenario": "A catalog filter works in local state but disappears on refresh, cannot be shared, and fights browser history. Redesign it with the URL as the one owner.",
      "constraints": [
        "Define stable keys for query, category, sort, and page",
        "Parse missing and invalid values at the route boundary",
        "Do not mirror the same writable values into a global store"
      ],
      "acceptanceCriteria": [
        "A copied URL restores the same valid catalog view",
        "Back and Forward restore prior filter states",
        "Typing and navigation use a documented debounce and push/replace policy",
        "Changing query, category, or sort resets page when the old page may be invalid"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write the URL examples and default table before writing components."
        },
        {
          "stage": 2,
          "text": "Read current params, create a new `URLSearchParams`, change the intended keys, and navigate to the result."
        },
        {
          "stage": 3,
          "text": "Use replace for rapid draft-like search updates when each keystroke should not create a history stop; document the product choice."
        }
      ],
      "expectedReasoning": "The URL already provides the required lifetime and navigation semantics. Parsing creates safe application input. One navigation writer avoids drift. Reset and history policy turn several parameters into a coherent public contract.",
      "commonWrongPaths": [
        "Keeping independent URL and global-store copies synchronized with Effects",
        "Writing passwords, transient popovers, or external resource objects into search params",
        "Preserving an invalid page after the result set changes"
      ],
      "answerExplanation": "Use the URL as the source of truth, parse it once, update it through navigation, and document dependencies between keys. This makes sharing, refresh, and history reliable without a second store.",
      "followUpVariation": "Add a saved server preference for sort order. Explain precedence when the URL explicitly supplies a different sort.",
      "checkType": "free-text",
      "prompt": "Explain why URL search params are the owner for this filter and how you handle invalid input.",
      "freeTextKeywords": [
        "URL",
        "shareable",
        "default",
        "pagination"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
        "https://nextjs.org/docs/15/app/api-reference/functions/use-search-params",
        "https://nextjs.org/docs/15/app/api-reference/functions/use-router",
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating#using-the-native-history-api",
        "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-url-state",
      "topicId": "expansion-url-state",
      "topicFamily": "nextjs-data",
      "question": "When should a filter live in the URL?",
      "answer": "Use the URL when users should be able to refresh, bookmark, share, or navigate back to the same meaningful view. Keep ephemeral, sensitive, and non-serializable interaction values local unless a separate product requirement gives them a public representation.",
      "followUp": "Which dependent parameter must reset when this filter changes?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "expansion",
        "url-state",
        "search-params"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
        "https://nextjs.org/docs/15/app/api-reference/functions/use-search-params",
        "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams"
      ]
    },
    {
      "id": "loop-qa-expansion-url-state-1",
      "topicId": "expansion-url-state",
      "topicFamily": "nextjs-data",
      "question": "How do you keep URL state from becoming a second source of truth?",
      "answer": "Treat the current search parameters as the owner, parse them into values, and derive the view. Update them through navigation. Do not copy the same writable filter into component or global state and then try to synchronize both directions.",
      "followUp": "Which Effect or setter can disappear when the URL becomes the owner?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-url-state"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
        "https://nextjs.org/docs/15/app/api-reference/functions/use-search-params"
      ]
    },
    {
      "id": "loop-qa-expansion-url-state-2",
      "topicId": "expansion-url-state",
      "topicFamily": "nextjs-data",
      "question": "What belongs in a URL-state parsing contract?",
      "answer": "Define accepted keys and values, missing defaults, repeated-value behavior, invalid-value recovery, sensitive-value exclusions, dependent resets, and whether updates push or replace browser history.",
      "followUp": "Which malformed URL will you test first, and what safe view should it produce?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-url-state"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
        "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams"
      ]
    }
  ],
  "practices": [
    {
      "id": "bp-7",
      "title": "Use URL Search Params for Shareable Filters",
      "summary": "Store filters, sorting, search, and pagination in search parameters when links, reloads, or browser history must reproduce the view.",
      "rationale": "The URL supplies the required public lifetime and navigation behavior. One route-owned value avoids synchronization between hidden client copies.",
      "tradeOffs": "URL keys become a public contract and need parsing, defaults, dependent resets, and history policy. Debounce frequent text updates and decide whether they should replace or push history.",
      "appliesWhen": "The state describes a view users should share, revisit, refresh, or navigate through.",
      "doesNotApplyWhen": "The value is transient, sensitive, or meaningless outside the current interaction, such as hover, a password draft, or an open menu.",
      "example": "`/products?category=electronics&sort=price&page=2` reproduces the catalog; changing category also resets page to 1.",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
      "tags": [
        "routing",
        "state",
        "architecture"
      ],
      "topicId": "expansion-url-state",
      "topicFamily": "nextjs-data",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
        "https://nextjs.org/docs/15/app/api-reference/functions/use-search-params",
        "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams"
      ]
    },
    {
      "id": "expansion-keep-shareable-state-in-url",
      "topicId": "expansion-url-state",
      "topicFamily": "nextjs-data",
      "title": "Keep Shareable Filters in the URL",
      "summary": "Use search parameters as the single owner of a shareable view, and derive route input from them.",
      "rationale": "A single public owner makes links, reloads, and browser navigation reproduce the same view without an Effect that synchronizes another store.",
      "tradeOffs": "The team must maintain stable key names and safe parsing. Rapid updates may need debounce and replace-history behavior.",
      "appliesWhen": "A user should be able to send or revisit a link that describes the current view.",
      "doesNotApplyWhen": "The value is short-lived interaction state with no sharing or restoration requirement.",
      "example": "Use `?query=react&page=2` for the view and keep the filter panel’s open state local.",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
      "nextVersion": "Next.js 15.5.20",
      "tags": [
        "expansion",
        "url-state",
        "navigation"
      ],
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating"
      ]
    }
  ],
  "meta": {
    "topicFamily": "nextjs-data",
    "level": "intermediate",
    "title": "Shareable UI State with URL Search Params"
  }
};
