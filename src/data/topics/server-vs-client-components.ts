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
      "Explain which code runs in the server and client module graphs",
      "Add a Client Component boundary only when interactivity or a browser capability requires it",
      "Pass values across the boundary using React-supported serialization",
      "Compose server-rendered content with small client-owned interactive areas"
    ],
    "whyMatters": "Server and Client Components let one UI use two environments. Server Components can read server-side resources without putting that access code in the browser bundle. Client Components add state, events, Effects, and browser APIs. A clear boundary keeps sensitive work on the server and sends only the data and JavaScript the interaction needs.",
    "estimatedMinutes": 36,
    "sections": [
      {
        "id": "rsc-basics",
        "type": "concept",
        "title": "What are Server Components?",
        "content": "In the App Router, pages and layouts are Server Components by default. They can await data, use server-only modules, and prepare UI without sending their component implementation to the browser as client JavaScript. They cannot use client state, Effects, event handlers, or browser APIs.\n\nA file beginning with `'use client'` defines an entry into the client module graph. That component and the modules it imports are available to the browser. Client Components can use state, events, Effects, and browser APIs. Next.js can still use them to produce initial HTML, then React hydrates them so interaction works in the browser. The labels describe module capabilities, not simply whether the user sees HTML from the server."
      },
      {
        "id": "boundary-rules",
        "type": "concept",
        "title": "The boundary rules",
        "content": "A Server Component may import and render a Client Component. Put `'use client'` at the smallest useful entry point; descendants imported by that entry do not each need the directive. A Client Component must not directly import server-only implementation code. To interleave server-rendered content, let a Server Component create that content and pass it to a Client Component as `children` or another React-node prop.\n\nValues passed from server to a boundary Client Component must be serializable by React. This includes common primitives, arrays, plain objects made from supported values, and several supported built-ins such as `Date`, `Map`, and `Set`. Ordinary functions and arbitrary class instances do not cross. A function marked as a Server Function with `'use server'` is a deliberate exception and must still validate and authorize client-controlled arguments."
      },
      {
        "id": "composition-pattern",
        "type": "code-example",
        "title": "Composing Server and Client",
        "content": "If the browser needs to sort and filter product fields, pass a small serializable data shape to a Client Component. Keep the database query and private model on the server, then map the result to the fields the client actually needs.",
        "code": "// app/products/page.tsx — Server Component\nimport ProductExplorer from './ProductExplorer';\nimport { db } from '@/lib/db';\n\nexport default async function ProductsPage() {\n  const rows = await db.product.findMany();\n  const products = rows.map(({ id, name, priceInCents }) => ({\n    id,\n    name,\n    priceInCents,\n  }));\n\n  return <ProductExplorer products={products} />;\n}\n\n// app/products/ProductExplorer.tsx — Client Component\n'use client';\n\ntype Product = { id: string; name: string; priceInCents: number };\n\nexport default function ProductExplorer({ products }: { products: Product[] }) {\n  const [query, setQuery] = useState('');\n  const visible = products.filter((product) =>\n    product.name.toLowerCase().includes(query.toLowerCase())\n  );\n\n  return (\n    <>\n      <label>Search <input value={query} onChange={(e) => setQuery(e.target.value)} /></label>\n      <ProductList products={visible} />\n    </>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/products/page.tsx + app/products/ProductExplorer.tsx"
      },
      {
        "id": "decision-guide",
        "type": "concept",
        "title": "When to use which",
        "content": "Choose from capabilities, one step at a time. Use a Server Component for server data access, secrets, private modules, or UI that needs no browser interaction. Use a Client Component for state, event handlers, Effects, browser APIs, or a custom Hook that depends on them.\n\nThen place the boundary. A single interactive control does not require the whole page to enter the client graph. Keep the server-owned page above it, pass the smallest serializable data or rendered slot, and let the client area own only its interaction. A wider boundary can be reasonable for a highly interactive subtree; the goal is an understandable boundary, not the smallest possible file at any cost."
      },
      {
        "id": "rsc-question",
        "type": "question",
        "title": "Check your understanding",
        "content": "",
        "questions": [
          {
            "id": "q8",
            "question": "A Server Component creates an ordinary `onSave` callback and passes it to a boundary Client Component. The callback is not marked `use server`. What happens?",
            "options": [
              "React serializes the function body and runs it in the browser",
              "The boundary rejects the prop because an ordinary function is not serializable",
              "The callback silently becomes a Server Function",
              "The Client Component can call it only during its first render"
            ],
            "correctAnswer": "The boundary rejects the prop because an ordinary function is not serializable",
            "expectedReasoning": "Ordinary functions cannot be serialized from the server module graph to a boundary Client Component. Define browser event logic in the client graph, pass data instead, or deliberately use an async Server Function marked with `use server` for a server mutation. React does not send arbitrary function source, does not silently add a directive, and does not make the function valid only during first render.",
            "commonMisconceptions": [
              "Assuming React serializes any JavaScript value",
              "Treating every server-defined function as a Server Function",
              "Confusing a rendered server slot with importing server implementation into the client graph"
            ]
          }
        ]
      },
      {
        "id": "rsc-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "The boundary is a data-and-capability contract. Server Components own server-only access and prepare UI or serializable data. Client Components own browser interaction. Compose them by passing supported values or server-rendered slots, and keep authorization at the server operation even when a Client Component starts the action."
      }
    ],
    "retrievalPrompt": "For a database query, a product card, a sort control, and an `onClick` handler, name the owning environment and describe the value that crosses the boundary.",
    "reflectionPrompt": "Choose one Client Component in your project. Which exact requirement needs the client? Could static content and server data remain above a smaller client boundary?",
    "masteryCriteria": [
      "Can explain that `use client` defines a module-graph boundary",
      "Can choose Server or Client Components from required capabilities",
      "Can identify ordinary functions and class instances that cannot cross as props",
      "Can pass serializable data or server-rendered slots to a Client Component",
      "Can diagnose common hydration mismatches without hiding the warning"
    ],
    "nextTopics": [
      "server-data-fetching"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/15/app/getting-started/server-and-client-components",
        "https://nextjs.org/docs/15/app/api-reference/directives/use-client",
        "https://react.dev/reference/rsc/use-client",
        "https://react.dev/reference/rsc/use-server",
        "https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html",
        "https://nextjs.org/docs/app/building-your-application/rendering/server-components"
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
        "concept": "The client boundary follows the capability that needs the browser, not the size of the page.",
        "prediction": {
          "prompt": "A server-rendered product page needs one quantity selector with local state. Where should that state live?",
          "options": [
            "In a focused Client Component for the selector",
            "By marking the entire page `use client`"
          ],
          "correctAnswer": "In a focused Client Component for the selector",
          "feedbackCorrect": "The interactive requirement can be isolated while data access and static UI stay server-owned.",
          "feedbackWrong": "A page-wide client boundary would move unrelated imports and UI into the client graph."
        },
        "synthesis": "Keep server access above the boundary and browser interaction inside it."
      }
    ],
    "miniProject": {
      "title": "Split a product page",
      "scenario": "Split a product page into server-owned data and a client-owned quantity and add-to-cart interaction.",
      "acceptance": [
        "Database access and private fields remain on the server",
        "Only a documented, serializable product view crosses to the client",
        "The client area shows pending, success, and recoverable failure feedback"
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
      "scenario": "Build a product catalog whose database read stays in a Server Component while search and price sorting respond immediately in the browser.",
      "constraints": [
        "Fetch products in the Server Component and map them to an explicit client-safe product type",
        "Pass only serializable fields needed for display, search, and sorting",
        "Keep query and sort state inside one focused Client Component"
      ],
      "acceptanceCriteria": [
        "The initial catalog is produced without a second client-side data request",
        "Typing filters by product name and changing sort order updates the derived list",
        "Database clients, secrets, and private product fields do not enter the client module graph",
        "The explanation identifies the exact `use client` boundary and transfer shape"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start with an async Server Component that reads the database and creates a small product DTO."
        },
        {
          "stage": 2,
          "text": "Pass that array to a Client Component; do not pass the database model or an ordinary callback."
        },
        {
          "stage": 3,
          "text": "Keep only `query` and `sort` as state. Derive the visible list during render."
        }
      ],
      "expectedReasoning": "The server owns privileged data access and chooses which fields may cross. The client owns interaction and can derive filtered and sorted views from the serializable array. Passing data, rather than opaque rendered children, gives the client the fields it needs without moving the database query into the browser graph.",
      "commonWrongPaths": [
        "Marking the page `use client` and trying to import the database module",
        "Passing an ORM model instance or ordinary server callback as a prop",
        "Copying the filtered list into Effect state instead of deriving it during render"
      ],
      "answerExplanation": "Create a server-owned product DTO array, pass it to the focused client catalog, and derive the visible list from props plus client state. This keeps private access server-side while giving the browser exactly the data needed for responsive interaction.",
      "followUpVariation": "The catalog now has server pagination. Which query values should move into the URL and server data request?",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/server-and-client-components",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/server-and-client-components",
        "https://react.dev/reference/rsc/use-client",
        "https://react.dev/learn/you-might-not-need-an-effect"
      ]
    }
  ],
  "qa": [
    {
      "id": "qa-2",
      "question": "When should I use Server Components vs Client Components?",
      "answer": "Begin with the capability. Use a Server Component for server data, private modules, and UI that needs no browser interaction. Add a Client Component when you need state, event handlers, Effects, or browser APIs. Then place `use client` at a useful entry point so unrelated server work stays outside the client module graph. A larger client subtree can be appropriate when its interaction is genuinely shared.",
      "followUp": "Which exact browser capability requires your proposed client boundary, and what data must cross into it?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "rsc",
        "architecture",
        "performance"
      ],
      "topicId": "server-vs-client-components",
      "topicFamily": "rsc-client",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/server-and-client-components",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/server-and-client-components",
        "https://react.dev/reference/rsc/use-client"
      ]
    },
    {
      "id": "qa-4",
      "question": "How do I fix \"Functions cannot be passed directly to Client Components\" error?",
      "answer": "The message means an ordinary function is crossing from the server graph to a boundary Client Component. Move browser event logic into a Client Component, or pass serializable data so the client can create its own handler. For a server mutation, an async function deliberately marked `use server` may cross as a Server Function. That is not a shortcut around security: validate its arguments and authorize the operation on every call.",
      "followUp": "Is this function browser interaction or a protected server mutation, and which boundary should own it?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "rsc",
        "serialization",
        "debugging"
      ],
      "topicId": "server-vs-client-components",
      "topicFamily": "rsc-client",
      "sourceLink": "https://react.dev/reference/rsc/use-client",
      "sourceLinks": [
        "https://react.dev/reference/rsc/use-client",
        "https://react.dev/reference/rsc/use-server"
      ]
    },
    {
      "id": "qa-8",
      "question": "How do I debug a \"Hydration failed because the initial UI does not match\" error?",
      "answer": "Hydration expects the client’s first render to match the server HTML. Check for time or random values during render, invalid HTML nesting, data that differs between environments, browser-only branches such as `typeof window`, and extensions that alter the page. Fix the shared initial output first. If a value is intentionally client-only, render a stable placeholder and update it after hydration. `suppressHydrationWarning` is a narrow escape hatch for an unavoidable one-level difference; it does not repair the mismatch.",
      "followUp": "What is the first differing node, and which input made the server and client render different values there?",
      "category": "debugging",
      "level": "intermediate",
      "tags": [
        "hydration",
        "debugging",
        "ssr"
      ],
      "topicId": "server-vs-client-components",
      "topicFamily": "rsc-client",
      "sourceLink": "https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html",
      "sourceLinks": [
        "https://react.dev/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html",
        "https://nextjs.org/docs/messages/react-hydration-error",
        "https://react.dev/reference/react-dom/client/hydrateRoot"
      ]
    }
  ],
  "practices": [
    {
      "id": "bp-1",
      "title": "Keep Server Components as the Default",
      "summary": "Keep server-capable UI in the server graph until a specific interaction or browser API requires a client boundary.",
      "rationale": "This protects server-only modules and avoids sending unrelated component code to the browser. It also makes the data transfer between environments visible for review.",
      "tradeOffs": "A server boundary cannot use client state, Effects, event handlers, or browser APIs. Splitting a component can add files and props, so choose a boundary that remains understandable.",
      "appliesWhen": "The component reads server data, uses private modules, or renders UI without browser interaction.",
      "doesNotApplyWhen": "The subtree genuinely needs shared client state, events, Effects, or browser APIs at that boundary.",
      "example": "Keep a product page and database read server-owned, then render a small Client Component for the quantity selector.",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/server-and-client-components",
      "tags": [
        "rsc",
        "architecture",
        "performance"
      ],
      "topicId": "server-vs-client-components",
      "topicFamily": "rsc-client",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/server-and-client-components",
        "https://react.dev/reference/rsc/use-client",
        "https://nextjs.org/docs/app/building-your-application/rendering/server-components"
      ]
    },
    {
      "id": "bp-3",
      "title": "Push Client Components to the Leaves",
      "summary": "Place `use client` around the smallest coherent interactive subtree, not automatically around the whole page.",
      "rationale": "The directive defines a client module-graph entry. A focused entry keeps unrelated imports and server data access outside that graph.",
      "tradeOffs": "Very small boundaries can create noisy component plumbing. Prefer the smallest coherent interaction boundary rather than splitting every button into its own file.",
      "appliesWhen": "Most of the page is server-rendered and a clear leaf or subtree needs browser interaction.",
      "doesNotApplyWhen": "Interaction and client state genuinely coordinate across the whole subtree, making a higher client boundary easier to understand.",
      "example": "A server-rendered article can contain a client-owned reaction toolbar without moving the article body into the client graph.",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/server-and-client-components#reducing-js-bundle-size",
      "tags": [
        "rsc",
        "performance",
        "architecture"
      ],
      "topicId": "server-vs-client-components",
      "topicFamily": "rsc-client",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/server-and-client-components#reducing-js-bundle-size",
        "https://react.dev/reference/rsc/use-client",
        "https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns"
      ]
    }
  ],
  "meta": {
    "topicFamily": "rsc-client",
    "level": "intermediate",
    "title": "Server vs Client Components"
  }
};
