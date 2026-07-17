import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "server-vs-client-components",
  "lesson": {
    "slug": "server-vs-client-components",
    "title": "Server vs Client Components",
    "topicFamily": "rsc-client",
    "level": "intermediate",
    "prerequisites": [
      "app-router-and-layouts",
      "state-and-events"
    ],
    "learningObjectives": [
      "Distinguish Server Components from Client Components",
      "Understand the RSC boundary and serializable props",
      "Decide when to use each type of component",
      "Compose Server and Client Components effectively"
    ],
    "whyMatters": "The Server/Client split is the defining architecture of modern Next.js. Choosing wrong means shipping unnecessary JavaScript to the browser or losing access to server-only capabilities. Understanding the boundary — and the serialization contract — prevents the most common Next.js production bugs.",
    "estimatedMinutes": 30,
    "sections": [
      {
        "id": "rsc-basics",
        "type": "concept",
        "title": "What are Server Components?",
        "content": "By default, a component in the App Router is a Server Component. Server-only code stays on the server and is not sent to the browser as component JavaScript; Server Components can access databases, filesystems, and backend services directly, but cannot use client hooks, event handlers, or browser APIs. Their output is serialized and sent to the client as an RSC payload.\n\nClient Components are explicitly marked with `'use client'`. They may render on the server for the initial response and then hydrate in the browser. They can use hooks, event handlers, and browser APIs, but cannot directly access databases or other server-only resources."
      },
      {
        "id": "boundary-rules",
        "type": "concept",
        "title": "The boundary rules",
        "content": "Server Components can render Client Components — that's how interactivity enters the tree. Client Components can render Server Components ONLY if those Server Components are passed as children or props (the 'slot' pattern). You cannot import a Server Component into a Client Component file and use it directly.\n\nProps passed from Server to Client Components must be serializable: strings, numbers, booleans, arrays, plain objects. Functions and class instances do not cross the boundary; React also supports passing Promises for the Client Component to read with `use`."
      },
      {
        "id": "composition-pattern",
        "type": "code-example",
        "title": "Composing Server and Client",
        "content": "Use the children/slot pattern to interleave Server and Client Components without losing server-only capabilities.",
        "code": "// Server Component — runs on server, has DB access\nimport { db } from '@/lib/db';\n\nexport default async function PostFeed() {\n  const posts = await db.post.findMany();\n  return (\n    <PostFeedClient>\n      {posts.map(post => (\n        <PostCard key={post.id} post={post} />\n      ))}\n    </PostFeedClient>\n  );\n}\n\n// Client Component — handles interactivity\n'use client';\nexport default function PostFeedClient({\n  children\n}: {\n  children: React.ReactNode\n}) {\n  const [sort, setSort] = useState<'new' | 'top'>('new');\n  return (\n    <div>\n      <SortToggle value={sort} onChange={setSort} />\n      <div className=\"grid\">{children}</div>\n    </div>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/posts/PostFeed.tsx + PostFeedClient.tsx"
      },
      {
        "id": "decision-guide",
        "type": "concept",
        "title": "When to use which",
        "content": "Use Server Components when: data fetching, accessing backend resources, keeping large dependencies off the client, or when the component has no interactivity.\n\nUse Client Components when: you need event listeners (onClick, onChange), hooks (useState, useEffect), browser-only APIs (window, localStorage), or custom hooks that depend on any of the above.\n\nDefault to Server. Push Client Components as far down the tree as possible — make only the interactive leaves Client Components, not entire pages."
      },
      {
        "id": "rsc-question",
        "type": "question",
        "title": "Check your understanding",
        "content": "",
        "questions": [
          {
            "id": "q8",
            "question": "A Server Component passes a callback function `onSave` as a prop to a Client Component. What happens?",
            "options": [
              "It works fine — the callback is serialized and sent to the client",
              "It throws an error — functions are not serializable",
              "It works but the callback runs on the server, not the client",
              "Next.js automatically wraps it in a Server Action"
            ],
            "correctAnswer": "It throws an error — functions are not serializable",
            "expectedReasoning": "Functions are not serializable and cannot be passed as props from Server to Client Components. The RSC boundary requires all props to be serializable. If you need a callback in a Client Component, define it in a Client Component (or in a parent Client Component) and pass it down. Server Actions are the exception — they're created with 'use server' and are serializable by Next.js.",
            "commonMisconceptions": [
              "Thinking any value can cross the boundary",
              "Confusing Server Actions with regular functions"
            ]
          }
        ]
      },
      {
        "id": "rsc-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "The Server/Client split is not an all-or-nothing choice. It's a composition pattern. Server Components fetch data, Client Components add interactivity. The children pattern lets you compose them. The serialization boundary ensures you think deliberately about what data crosses from server to client. This architecture reduces client-side JavaScript, improves performance, and keeps secrets on the server — but only if you respect the boundary."
      }
    ],
    "retrievalPrompt": "What three things make a component a Client Component? What three capabilities does a Server Component have that a Client Component does not?",
    "reflectionPrompt": "Audit your current project: which components are Client Components that could be Server Components? What would change if you moved them?",
    "masteryCriteria": [
      "Can distinguish Server from Client Components by their capabilities",
      "Understands the RSC serialization boundary and its constraints",
      "Can compose Server and Client Components using the children pattern",
      "Makes informed decisions about which component type to use for a given need"
    ],
    "nextTopics": [
      "server-data-fetching"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-01",
      "sources": [
        "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
        "https://react.dev/reference/rsc/use-client"
      ]
    },
    "diagram": {
      "title": "Server data to client interaction",
      "kind": "layers",
      "nodes": [
        {
          "id": "server",
          "label": "Server Component",
          "role": "Data and secret boundary"
        },
        {
          "id": "props",
          "label": "Serializable props",
          "role": "Explicit transfer contract"
        },
        {
          "id": "client",
          "label": "Client island",
          "role": "Hooks, events, browser APIs"
        }
      ],
      "edges": [
        {
          "from": "server",
          "to": "props"
        },
        {
          "from": "props",
          "to": "client"
        }
      ]
    },
    "chunks": [
      {
        "id": "server-vs-client-components-retrieval-1",
        "title": "Keep the island small",
        "concept": "One interactive button does not require moving the entire page and its data fetching into the client graph.",
        "prediction": {
          "prompt": "Where should a like button’s local state live?",
          "options": [
            "In a small Client Component island",
            "By marking the entire data page client-only"
          ],
          "correctAnswer": "In a small Client Component island",
          "feedbackCorrect": "The boundary follows the interactive requirement.",
          "feedbackWrong": "A broad client boundary moves unrelated code and data into the browser."
        },
        "synthesis": "Place server data and client interaction on the smallest boundary that satisfies the contract."
      }
    ],
    "miniProject": {
      "title": "Split a product page",
      "scenario": "Design a server-rendered product page with a client-owned quantity selector and mutation feedback.",
      "acceptance": [
        "Server-only data access stays server-side",
        "Props crossing the boundary are serializable",
        "The client island has explicit pending/error behavior"
      ],
      "rubric": [
        {
          "dimension": "Boundary",
          "evidence": "The client graph contains only the required interaction."
        },
        {
          "dimension": "Data",
          "evidence": "Server data and mutation ownership are explicit."
        },
        {
          "dimension": "Recovery",
          "evidence": "The user can understand and retry a failed action."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "integrate-rsc-data",
      "title": "Integrate RSC Data with Client Interactivity",
      "level": 6,
      "topicFamily": "rsc-client",
      "scenario": "Build a product listing page with server-fetched products and client-side sorting/filtering. Products come from a Server Component, but sorting happens in the browser.",
      "constraints": [
        "Products must be fetched on the server (Server Component)",
        "Sorting and search filtering happen on the client without refetching",
        "Pass serializable product data from the Server Component to a Client Component"
      ],
      "acceptanceCriteria": [
        "Products display on the initial rendered page without a client-side data fetch",
        "Clicking sort by price reorders products without page reload",
        "Search input filters products by name in real-time",
        "The architecture correctly separates server-rendered content from client interactivity"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Create a Server Component that fetches and maps products to JSX."
        },
        {
          "stage": 2,
          "text": "Create a Client Component that receives the serializable product data."
        },
        {
          "stage": 3,
          "text": "The Client Component manages sort/filter state and derives the visible product data."
        }
      ],
      "expectedReasoning": "The Server Component fetches products and passes serializable product data. The Client Component holds sort/filter state and derives the visible product data. If a Server Component renders product JSX as children, the client cannot reliably inspect arbitrary product fields to sort those elements.",
      "commonWrongPaths": [
        "Passing non-serializable values across the boundary",
        "Moving the entire page to a Client Component"
      ],
      "answerExplanation": "The Server Component fetches products and passes a serializable data prop to a Client Component. The Client Component owns the sort/filter state and derives the visible list. Keep server-rendered data and client interactivity separate without assuming the client can inspect product fields hidden inside pre-rendered children.",
      "followUpVariation": "What if sorting should happen on the server (for pagination)? How would the architecture change?",
      "sourceLink": "https://react.dev/reference/rsc/use-client"
    }
  ],
  "qa": [
    {
      "id": "qa-2",
      "question": "When should I use Server Components vs Client Components?",
      "answer": "Default to Server Components. Only add 'use client' when you need: event listeners (onClick, etc.), hooks (useState, useEffect, etc.), browser APIs (window, localStorage), or custom hooks that depend on those. Push Client Components as deep as possible — make only the interactive leaf nodes Client Components, not entire pages. This minimizes the JavaScript sent to the browser.",
      "followUp": "Can a Server Component pass a callback function to a Client Component? Why or why not?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "rsc",
        "architecture",
        "performance"
      ],
      "topicId": "server-vs-client-components",
      "topicFamily": "rsc-client",
      "sourceLink": "https://react.dev/reference/rsc/use-client"
    },
    {
      "id": "qa-4",
      "question": "How do I fix \"Functions cannot be passed directly to Client Components\" error?",
      "answer": "This error occurs when a Server Component tries to pass a function (like an event handler) as a prop to a Client Component. Functions are not serializable and cannot cross the RSC boundary. Solutions: (1) Move the function definition into the Client Component or its parent Client Component. (2) Use a Server Action (marked with 'use server') — these ARE serializable. (3) Restructure: pass data as props and let the Client Component define its own event handlers.",
      "followUp": "What types ARE serializable across the RSC boundary?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "rsc",
        "serialization",
        "debugging"
      ],
      "topicId": "server-vs-client-components",
      "topicFamily": "rsc-client",
      "sourceLink": "https://react.dev/reference/rsc/use-client"
    },
    {
      "id": "qa-8",
      "question": "How do I debug a \"Hydration failed because the initial UI does not match\" error?",
      "answer": "This means the HTML rendered on the server does not match what React expects on the client during hydration. Common causes: (1) Using browser-only APIs (window, localStorage) during render without checking typeof window. (2) Using Date.now() or Math.random() during render. (3) Invalid HTML nesting (div inside p, etc.). (4) Using different data on server vs client. Fix: wrap browser-only code in useEffect (runs after hydration) or use the `suppressHydrationWarning` prop for intentional differences like timestamps.",
      "followUp": "What is the difference between suppressing a hydration warning and actually fixing the mismatch?",
      "category": "debugging",
      "level": "intermediate",
      "tags": [
        "hydration",
        "debugging",
        "ssr"
      ],
      "topicId": "server-vs-client-components",
      "topicFamily": "rsc-client",
      "sourceLink": "https://react.dev/reference/react-dom/client/hydrateRoot"
    }
  ],
  "practices": [
    {
      "id": "bp-1",
      "title": "Keep Server Components as the Default",
      "summary": "Every component in the App Router is a Server Component by default. Only opt into Client Components explicitly.",
      "rationale": "Server Components reduce client-side JavaScript, improve initial page load, and enable direct backend access. They are the foundation of Next.js performance.",
      "tradeOffs": "You lose access to browser APIs, hooks, and interactivity in Server Components. You must restructure components to isolate client-only code into Client Component leaves.",
      "appliesWhen": "The component has no event handlers, no hooks (useState, useEffect, etc.), and no browser-only API calls.",
      "doesNotApplyWhen": "The component needs: user interaction (onClick, onChange), state or effects, browser APIs (window, localStorage), or custom hooks that depend on the above.",
      "example": "A blog post content display should be a Server Component. A like button within that post should be a Client Component nested inside.",
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
      "tags": [
        "rsc",
        "architecture",
        "performance"
      ],
      "topicId": "server-vs-client-components",
      "topicFamily": "rsc-client"
    },
    {
      "id": "bp-3",
      "title": "Push Client Components to the Leaves",
      "summary": "Make as few components Client Components as possible. Push interactivity down to the smallest possible leaf nodes.",
      "rationale": "The more code is on the client, the larger the JavaScript bundle, the slower the hydration, and the worse the performance. Server-only code stays on the server.",
      "tradeOffs": "Requires deliberate component decomposition. You may need to split a single \"smart\" component into a Server parent (data fetching) and Client leaf (interactivity). This adds file count but reduces bundle size.",
      "appliesWhen": "Most of your component tree is static content, and only specific interactive elements need client-side JavaScript.",
      "doesNotApplyWhen": "The entire component tree is interactive (e.g., a real-time collaborative editor). In that case, use a Client boundary at the appropriate level without forcing unnecessary splits.",
      "example": "A product listing page is a Server Component. Each product card's \"Add to Cart\" button is a separate Client Component.",
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns",
      "tags": [
        "rsc",
        "performance",
        "architecture"
      ],
      "topicId": "server-vs-client-components",
      "topicFamily": "rsc-client"
    }
  ],
  "meta": {
    "topicFamily": "rsc-client",
    "level": "intermediate",
    "title": "Server vs Client Components"
  }
};
