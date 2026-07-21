import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "server-data-fetching",
  "lesson": {
    "slug": "server-data-fetching",
    "title": "Server Data Fetching",
    "topicFamily": "nextjs-data",
    "level": "intermediate",
    "prerequisites": [
      "server-vs-client-components"
    ],
    "learningObjectives": [
      "Read data directly in an async Server Component and provide loading, empty, and failure UI",
      "Separate request memoization, the Data Cache, route rendering, and the client Router Cache",
      "Choose explicit `fetch` cache and revalidation behavior for Next.js 15.5.20",
      "Build Route Handlers and Server Functions that validate and authorize untrusted input",
      "Invalidate the smallest path or tag that became stale after a successful mutation"
    ],
    "whyMatters": "Server data fetching can place the read close to the UI that uses it and keep credentials out of the browser. The difficult part is freshness: a request, a rendered route, and a previously visited client segment can have different cache behavior. Naming each layer and its owner prevents stale data and unnecessary requests.",
    "estimatedMinutes": 42,
    "sections": [
      {
        "id": "server-fetch",
        "type": "concept",
        "title": "Direct data access in Server Components",
        "content": "A Server Component can be `async` and await `fetch`, an ORM, or a database query directly. This keeps credentials and server-only modules out of the browser and avoids a client Effect whose only job is initial loading. Still design the full user state: pending work needs `loading.tsx` or Suspense, an empty result needs useful UI, a missing resource may call `notFound()`, and an unexpected exception needs the route error boundary.\n\nCo-locating a read with its consumer is useful, but avoid accidental waterfalls. Start independent work before awaiting it, or use `Promise.all` when the results can load together."
      },
      {
        "id": "caching",
        "type": "code-example",
        "title": "Caching and revalidation",
        "content": "In Next.js 15.5.20, `fetch` responses are not cached by default, although a route may still be prerendered and its output cached. Choose cache behavior from the freshness requirement instead of assuming one global default. Request memoization during a render, the persistent Data Cache, route-output caching, and the browser Router Cache are related but distinct layers.",
        "code": "// Fresh on each request; also opts this route into dynamic rendering.\nconst live = await fetch(url, { cache: 'no-store' });\n\n// Store this response in the Data Cache.\nconst stable = await fetch(url, { cache: 'force-cache' });\n\n// Cache, but allow time-based refresh and targeted invalidation.\nconst posts = await fetch(url, {\n  next: { revalidate: 60, tags: ['posts'] },\n});\n\n// Next.js 15.5.20: call from a Server Function or Route Handler.\nrevalidateTag('posts');",
        "codeLanguage": "typescript",
        "codeFilePath": "app/posts/data-fetching.ts"
      },
      {
        "id": "route-handlers",
        "type": "code-example",
        "title": "Route handlers",
        "content": "A `route.ts` file creates an HTTP endpoint with Web `Request` and `Response` APIs. Route Handlers are useful for webhooks, public APIs, or clients that need an HTTP boundary. Treat path, query, headers, and body as untrusted. Parse input, authenticate and authorize protected work, return deliberate status codes, and avoid exposing internal error details.",
        "code": "// app/api/posts/route.ts\nexport async function GET(request: Request) {\n  const rawLimit = new URL(request.url).searchParams.get('limit') ?? '10';\n  const limit = Number(rawLimit);\n\n  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {\n    return Response.json({ error: 'limit must be between 1 and 50' }, { status: 400 });\n  }\n\n  return Response.json(await fetchPosts(limit));\n}\n\nexport async function POST(request: Request) {\n  const user = await requireUser();\n  const body: unknown = await request.json();\n  const input = parsePostInput(body);\n\n  if (!input.ok) {\n    return Response.json({ errors: input.errors }, { status: 400 });\n  }\n\n  const post = await createPost({ ...input.data, authorId: user.id });\n  return Response.json(post, { status: 201 });\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/api/posts/route.ts"
      },
      {
        "id": "server-actions",
        "type": "code-example",
        "title": "Server Actions",
        "content": "A function marked `use server` is a Server Function. Forms can call it without building a separate client fetch wrapper. Its arguments are client-controlled, so validate fields, verify the session, authorize the exact operation, mutate, and then refresh the affected cache. Return expected validation failures as structured state; reserve thrown errors for unexpected failures.",
        "code": "// app/posts/actions.ts\n'use server';\n\nimport { revalidatePath } from 'next/cache';\n\ntype ActionState = { message: string; errors?: { title?: string } };\n\nexport async function createPost(\n  _previous: ActionState,\n  formData: FormData,\n): Promise<ActionState> {\n  const rawTitle = formData.get('title');\n  const title = typeof rawTitle === 'string' ? rawTitle.trim() : '';\n\n  if (!title) return { message: 'Please check the title.', errors: { title: 'Enter a title.' } };\n\n  const user = await requireUser();\n  await db.post.create({ data: { title, authorId: user.id } });\n  revalidatePath('/posts');\n  return { message: 'Post created.' };\n}\n\n// app/posts/PostForm.tsx\n'use client';\n\nexport function PostForm() {\n  const [state, formAction, pending] = useActionState(createPost, { message: '' });\n  return (\n    <form action={formAction}>\n      <input name=\"title\" aria-describedby=\"title-error\" />\n      <p id=\"title-error\">{state.errors?.title}</p>\n      <button disabled={pending}>{pending ? 'Creating…' : 'Create post'}</button>\n      <p aria-live=\"polite\">{state.message}</p>\n    </form>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/actions.ts + PostForm.tsx"
      },
      {
        "id": "data-question",
        "type": "question",
        "title": "Check your understanding",
        "content": "",
        "questions": [
          {
            "id": "q9",
            "question": "A mutation calls `revalidatePath('/posts')`. Which statement is accurate for Next.js 15.5.20?",
            "options": [
              "It deletes every cache entry in the application",
              "Its visible timing depends on context: a Server Function can refresh viewed UI, while a Route Handler marks the path for revalidation on a later visit",
              "It forces every open browser tab to reload immediately",
              "It changes only the browser HTTP cache and never server caches"
            ],
            "correctAnswer": "Its visible timing depends on context: a Server Function can refresh viewed UI, while a Route Handler marks the path for revalidation on a later visit",
            "expectedReasoning": "`revalidatePath` targets a path, and Next.js 15 documents different timing for Server Functions and Route Handlers. It is not a global cache deletion or cross-tab reload command, and it operates on Next.js cache behavior rather than only the browser HTTP cache.",
            "commonMisconceptions": [
              "Collapsing Data Cache, route output, and client Router Cache into one cache",
              "Assuming every invalidation triggers an immediate browser reload",
              "Using path-wide invalidation when a shared data tag is the clearer identity"
            ]
          }
        ]
      },
      {
        "id": "data-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Place the read at a server boundary that can protect credentials and render the required states. State cache intent explicitly for the pinned Next.js version. For writes, validate and authorize untrusted input, mutate once, and invalidate the path or tag that represents the changed data. Verify freshness through visible behavior rather than assuming every cache layer changed at the same time."
      }
    ],
    "retrievalPrompt": "In Next.js 15.5.20, compare uncached `fetch`, `force-cache`, time revalidation, tag invalidation, and route-output caching. Say which layer each choice changes.",
    "reflectionPrompt": "Choose one read and one mutation. Who owns the authoritative data, what can be cached, what becomes stale after the mutation, and which visible state proves refresh succeeded?",
    "masteryCriteria": [
      "Can fetch with async/await in a Server Component without adding a client Effect",
      "Can state that Next.js 15 fetch responses are not cached by default",
      "Can distinguish request, data, route-output, and client router cache behavior",
      "Can validate and authorize Route Handler or Server Function input",
      "Can choose path or tag invalidation from the affected data identity"
    ],
    "nextTopics": [
      "production-deployment"
    ],
    "metadata": {
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/15/app/getting-started/fetching-data",
        "https://nextjs.org/docs/15/app/getting-started/updating-data",
        "https://nextjs.org/docs/15/app/getting-started/caching-and-revalidating",
        "https://nextjs.org/docs/15/app/guides/caching",
        "https://nextjs.org/docs/15/app/getting-started/route-handlers-and-middleware",
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidatePath",
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidateTag",
        "https://nextjs.org/docs/15/app/guides/forms"
      ]
    },
    "diagram": {
      "title": "Data freshness loop",
      "kind": "flow",
      "nodes": [
        {
          "id": "read",
          "label": "Read boundary",
          "role": "Where data is fetched"
        },
        {
          "id": "cache",
          "label": "Cache intent",
          "role": "Freshness and identity"
        },
        {
          "id": "mutate",
          "label": "Mutation",
          "role": "Protected write"
        },
        {
          "id": "invalidate",
          "label": "Targeted invalidation",
          "role": "Refresh affected data"
        }
      ],
      "edges": [
        {
          "from": "read",
          "to": "cache"
        },
        {
          "from": "cache",
          "to": "mutate"
        },
        {
          "from": "mutate",
          "to": "invalidate"
        },
        {
          "from": "invalidate",
          "to": "read"
        }
      ]
    },
    "chunks": [
      {
        "id": "server-data-fetching-retrieval-1",
        "title": "Name the cache contract",
        "concept": "Freshness connects a read identity, an explicit cache policy, a protected mutation, and targeted invalidation.",
        "prediction": {
          "prompt": "A post appears on both `/posts` and `/dashboard`. Which invalidation identity is usually clearer after an edit?",
          "options": [
            "A shared `posts` data tag",
            "An unrelated global cache clear"
          ],
          "correctAnswer": "A shared `posts` data tag",
          "feedbackCorrect": "A data tag can identify the shared cached data across routes.",
          "feedbackWrong": "A global clear hides ownership and refreshes unrelated work."
        },
        "synthesis": "Invalidate the identity that actually became stale, then observe the refreshed UI."
      }
    ],
    "miniProject": {
      "title": "Design a notes mutation flow",
      "scenario": "Design a server-rendered notes list and create form with explicit cache intent, validation, authorization, and targeted refresh.",
      "acceptance": [
        "The read owner and pending, empty, and error UI are named",
        "Cache behavior is explicit for Next.js 15.5.20",
        "The mutation validates, authorizes, writes, and refreshes only affected data"
      ],
      "rubric": [
        {
          "dimension": "Ownership",
          "evidence": "Reads and writes have one authoritative boundary."
        },
        {
          "dimension": "Freshness",
          "evidence": "The invalidation target matches the affected data."
        },
        {
          "dimension": "Recovery",
          "evidence": "Validation, authorization, and retry states are included."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "loop-server-data-fetching",
      "title": "Apply Server Data Fetching",
      "level": 2,
      "topicFamily": "nextjs-data",
      "scenario": "Build a project notes page. The initial list is server-rendered, notes may be empty, signed-in members can create a note, and a successful mutation must refresh the list without globally clearing unrelated data.",
      "constraints": [
        "Read notes in an async Server Component and provide pending, empty, and unexpected-error UI",
        "Choose and document one explicit Next.js 15.5.20 cache policy for the notes read",
        "Validate note text and authorize project membership inside the Server Function",
        "Invalidate the smallest path or tag that represents the changed notes"
      ],
      "acceptanceCriteria": [
        "The initial HTML includes the list or a useful empty state without a client Effect fetch",
        "Invalid input returns visible, accessible feedback and does not write",
        "An unauthorized request is rejected at the server operation",
        "A successful create makes the new note observable through targeted refresh"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Draw the flow as read → render states → submit → validate/authorize → write → invalidate."
        },
        {
          "stage": 2,
          "text": "Write down the freshness promise. Should notes be live, explicitly cached, or revalidated for a short interval?"
        },
        {
          "stage": 3,
          "text": "If the same notes appear on several routes, a data tag may express ownership better than one route path."
        }
      ],
      "expectedReasoning": "The Server Component owns the read and route states. The Server Function treats submitted data as untrusted and enforces membership at the write boundary. The cache choice states how fresh the list may be, and targeted invalidation connects the successful mutation to the read identity that changed.",
      "commonWrongPaths": [
        "Adding a client Effect for an initial read already owned by the Server Component",
        "Assuming default `fetch` caching without checking Next.js 15 behavior",
        "Trusting hidden UI instead of authorizing the Server Function",
        "Clearing unrelated caches because the affected data identity was not named"
      ],
      "answerExplanation": "Keep the read server-owned, represent pending/empty/failure states, and document the cache contract. In the Server Function, validate and authorize before writing. After success, revalidate the notes path or shared notes tag so the refreshed UI follows the same data identity.",
      "followUpVariation": "A webhook can edit notes without a user viewing the page. Would path or tag invalidation better connect the webhook to every route that displays the note?",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/fetching-data",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/fetching-data",
        "https://nextjs.org/docs/15/app/getting-started/updating-data",
        "https://nextjs.org/docs/15/app/getting-started/caching-and-revalidating"
      ]
    }
  ],
  "qa": [
    {
      "id": "qa-7",
      "question": "What is the difference between revalidatePath and revalidateTag?",
      "answer": "`revalidatePath` targets route output associated with a page or layout path. `revalidateTag` targets cached data that was labeled with a tag, so it can cover the same data used by several routes. Choose from ownership: use a path for route-specific freshness and a tag for shared data identity. In Next.js 15, timing also depends on whether invalidation runs in a Server Function or Route Handler.",
      "followUp": "Which routes read the changed data, and can one tag name that shared identity more precisely than several paths?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "caching",
        "revalidation",
        "data-fetching"
      ],
      "topicId": "server-data-fetching",
      "topicFamily": "nextjs-data",
      "sourceLink": "https://nextjs.org/docs/15/app/api-reference/functions/revalidatePath",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidatePath",
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidateTag",
        "https://nextjs.org/docs/15/app/guides/caching"
      ]
    },
    {
      "id": "loop-qa-server-data-fetching-1",
      "topicId": "server-data-fetching",
      "topicFamily": "nextjs-data",
      "question": "What changes when initial data is read in a Server Component instead of a client Effect?",
      "answer": "The server can read protected resources and include data in the rendered response without shipping an initial-fetch Effect. The route still needs loading, empty, missing, and error behavior. You also need an explicit freshness model because request data and route output may use different cache layers.",
      "followUp": "Which user-visible state appears while the server read is pending, and which boundary owns it?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "server-data-fetching"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/fetching-data",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/fetching-data",
        "https://nextjs.org/docs/15/app/getting-started/error-handling"
      ]
    },
    {
      "id": "loop-qa-server-data-fetching-2",
      "topicId": "server-data-fetching",
      "topicFamily": "nextjs-data",
      "question": "How do you describe cache intent clearly in Next.js 15.5.20?",
      "answer": "Say what is cached, how stale it may become, and how a mutation refreshes it. A `fetch` response is not cached by default in Next.js 15, while route output may still be prerendered and cached. Use explicit `no-store`, `force-cache`, time revalidation, or tags according to the data requirement.",
      "followUp": "What observation would prove that the chosen freshness window and invalidation behavior match the product requirement?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "server-data-fetching"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/fetching-data",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/fetching-data",
        "https://nextjs.org/docs/15/app/guides/caching"
      ]
    }
  ],
  "practices": [
    {
      "id": "bp-2",
      "title": "Fetch Data Where You Need It (Colocation)",
      "summary": "Read server data near the component that uses it, while starting independent work early enough to avoid a waterfall.",
      "rationale": "Colocation makes data ownership and UI states visible. Next.js request memoization can combine matching GET or HEAD fetches during one render pass, but unrelated sequential awaits can still delay the route.",
      "tradeOffs": "Several colocated reads may need coordination. Start independent promises together, use `Promise.all`, or use a preload pattern when one parent can safely initiate shared work.",
      "appliesWhen": "A Server Component owns the data and its loading, empty, missing, or error presentation.",
      "doesNotApplyWhen": "A higher boundary genuinely needs one coordinated snapshot for policy, transaction, or aggregation reasons.",
      "example": "Let `ProductDetails` and `Reviews` own their reads, start both requests before awaiting, and give slow reviews a nested Suspense fallback.",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/fetching-data",
      "tags": [
        "data-fetching",
        "architecture",
        "suspense"
      ],
      "topicId": "server-data-fetching",
      "topicFamily": "nextjs-data",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/fetching-data",
        "https://nextjs.org/docs/15/app/getting-started/fetching-data#parallel-and-sequential-data-fetching",
        "https://nextjs.org/docs/app/building-your-application/data-fetching/patterns"
      ]
    },
    {
      "id": "bp-9",
      "title": "Make Cache Intent Explicit",
      "summary": "Document whether each read is uncached, explicitly cached, time-revalidated, or tag-invalidated for Next.js 15.5.20.",
      "rationale": "Request data, rendered routes, and client navigation can use different cache layers. Naming the layer and freshness promise prevents accidental stale or unnecessarily repeated work.",
      "tradeOffs": "Explicit policies add review work and tests. That cost is useful when stale or overly dynamic data would affect users or infrastructure.",
      "appliesWhen": "The feature has a freshness promise, shared data, on-demand mutation, or production cache behavior that matters.",
      "doesNotApplyWhen": "A short-lived local experiment has no meaningful freshness or reuse requirement.",
      "example": "Record: “posts use `force-cache` with tag `posts`; create and edit actions call `revalidateTag('posts')`; a smoke test confirms both list routes refresh.”",
      "sourceLink": "https://nextjs.org/docs/15/app/guides/caching",
      "nextVersion": "15.5.20",
      "tags": [
        "nextjs-data",
        "caching",
        "production"
      ],
      "topicId": "server-data-fetching",
      "topicFamily": "nextjs-data",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/caching",
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidateTag",
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidatePath",
        "https://nextjs.org/docs/app/guides/caching-without-cache-components"
      ]
    }
  ],
  "meta": {
    "topicFamily": "nextjs-data",
    "level": "intermediate",
    "title": "Server Data Fetching"
  }
};
