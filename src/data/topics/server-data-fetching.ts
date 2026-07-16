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
      "Fetch data in Server Components without useEffect",
      "Understand Next.js caching and revalidation strategies",
      "Use route handlers for API endpoints",
      "Implement Server Actions for mutations",
      "Handle loading, error, and empty states gracefully"
    ],
    "whyMatters": "Data fetching in Next.js shifts from client-side effects to server-side async components. Understanding the caching model — what gets cached, for how long, and how to invalidate — is the difference between a fast app and one that serves stale data or makes redundant requests.",
    "estimatedMinutes": 35,
    "sections": [
      {
        "id": "server-fetch",
        "type": "concept",
        "title": "Direct data access in Server Components",
        "content": "A Server Component can be declared `async` when it performs asynchronous work. You can `await` a database query, a fetch call, or any promise directly in that component. The route still needs an explicit loading strategy, such as `loading.tsx` or a Suspense boundary, while the data is pending."
      },
      {
        "id": "caching",
        "type": "code-example",
        "title": "Caching and revalidation",
        "content": "In the locked Next.js 15 runtime, do not assume every fetch is cached. Choose explicit cache behavior, then use revalidation APIs for invalidation.",
        "code": "// Explicitly cached\nconst cached = await fetch('https://api.example.com/data', {\n  cache: 'force-cache'\n});\n\n// Revalidated every 60 seconds (ISR)\nconst revalidated = await fetch('https://api.example.com/data', {\n  next: { revalidate: 60 }\n});\n\n// Never cached (dynamic)\nconst dynamic = await fetch('https://api.example.com/data', {\n  cache: 'no-store'\n});\n\n// Tag-based revalidation\nconst tagged = await fetch('https://api.example.com/data', {\n  next: { tags: ['posts'] }\n});\n// Next.js 15 invalidation:\nrevalidateTag('posts');",
        "codeLanguage": "typescript",
        "codeFilePath": "app/posts/data-fetching.ts"
      },
      {
        "id": "route-handlers",
        "type": "code-example",
        "title": "Route handlers",
        "content": "Route handlers in route.ts files are the App Router equivalent of Pages Router API Routes. They support GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS; they do not replace every server endpoint design.",
        "code": "// app/api/posts/route.ts\nexport async function GET(request: Request) {\n  const { searchParams } = new URL(request.url);\n  const limit = searchParams.get('limit') || '10';\n  const posts = await fetchPosts(Number(limit));\n  return Response.json(posts);\n}\n\nexport async function POST(request: Request) {\n  const body = await request.json();\n  const post = await createPost(body);\n  return Response.json(post, { status: 201 });\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/api/posts/route.ts"
      },
      {
        "id": "server-actions",
        "type": "code-example",
        "title": "Server Actions",
        "content": "Server Actions are async functions marked with `'use server'` that can be called from Client Components. Treat submitted FormData as untrusted: parse and validate it, authorize the operation, then mutate. Use targeted invalidation when cached data needs refreshing.",
        "code": "// app/actions.ts\n'use server';\nimport { revalidatePath } from 'next/cache';\n\nexport async function createPost(formData: FormData) {\n  const rawTitle = formData.get('title');\n  if (typeof rawTitle !== 'string' || rawTitle.trim().length < 1) {\n    throw new Error('Title is required');\n  }\n  const user = await requireUser();\n  const post = await db.post.create({ data: { title: rawTitle.trim(), authorId: user.id } });\n  revalidatePath('/posts');\n  return post;\n}\n\n// Client Component usage:\n'use client';\nimport { createPost } from './actions';\n\nexport function PostForm() {\n  return (\n    <form action={createPost}>\n      <input name=\"title\" />\n      <button type=\"submit\">Create</button>\n    </form>\n  );\n}",
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
            "question": "You call `revalidatePath('/posts')` after a mutation. What must you verify?",
            "options": [
              "The /posts page immediately reloads in the browser",
              "The result depends on context: a Server Function can update the viewed UI immediately; a Route Handler marks the path for later revalidation",
              "All cached data across the entire app is cleared",
              "The client-side router cache is cleared"
            ],
            "correctAnswer": "The result depends on context: a Server Function can update the viewed UI immediately; a Route Handler marks the path for later revalidation",
            "expectedReasoning": "revalidatePath behavior depends on where it runs. In a Server Function, the viewed UI can update immediately; in a Route Handler, the path is marked for revalidation on a later visit. Do not collapse server cache behavior and the client Router Cache into one rule.",
            "commonMisconceptions": [
              "Thinking revalidatePath triggers an immediate rebuild",
              "Confusing server cache with client router cache"
            ]
          }
        ]
      },
      {
        "id": "data-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Next.js data fetching can place data at the Server Component level instead of loading it through client Effects and state. This can reduce client-side loading work and bundle pressure, but the result depends on route and rendering choices. The trade-off is that you must understand the caching model — when data is fresh, when it is stale, and how to invalidate it. Server Actions add a co-located mutation boundary for supported server-side operations."
      }
    ],
    "retrievalPrompt": "Explain explicit force-cache, no-store, time-based revalidation, and tag-based invalidation in the locked Next.js 15 runtime.",
    "reflectionPrompt": "How would your current app's data fetching change if you moved it from client-side effects to Server Components? What would become simpler? What would become harder?",
    "masteryCriteria": [
      "Can fetch data in Server Components using async/await",
      "Can distinguish explicit caching, dynamic fetching, time-based revalidation, and tag-based invalidation",
      "Can create route handlers for GET/POST/PUT/DELETE",
      "Can implement Server Actions for form mutations",
      "Can use revalidatePath and revalidateTag for cache invalidation"
    ],
    "nextTopics": [
      "production-deployment"
    ],
    "metadata": {
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-01",
      "sources": [
        "https://nextjs.org/docs/15/app/getting-started/fetching-data",
        "https://nextjs.org/docs/15/app/guides/caching",
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
        "concept": "A cache policy must state what becomes stale after a mutation and which path or tag owns the refresh.",
        "prediction": {
          "prompt": "What should a CMS webhook invalidate after a post edit?",
          "options": [
            "The affected path or tag",
            "Every cache and browser tab globally"
          ],
          "correctAnswer": "The affected path or tag",
          "feedbackCorrect": "Targeted invalidation protects unrelated cache policy.",
          "feedbackWrong": "Global invalidation hides the actual ownership boundary."
        },
        "synthesis": "Freshness is a contract between read identity, cache policy, and mutation invalidation."
      }
    ],
    "miniProject": {
      "title": "Design a notes mutation flow",
      "scenario": "Map a server-rendered notes list, create action, validation error, and targeted revalidation path.",
      "acceptance": [
        "The authoritative data owner is named",
        "Cache intent is version-specific and explicit",
        "Success and failure outcomes are observable"
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
      "scenario": "Use the model from Server Data Fetching in a small project decision, then explain the boundary you chose.",
      "constraints": [
        "State the owner or boundary explicitly",
        "Include one failure or recovery case",
        "Keep the explanation tied to observable behavior"
      ],
      "acceptanceCriteria": [
        "Can fetch data in Server Components using async/await",
        "Can distinguish explicit caching, dynamic fetching, time-based revalidation, and tag-based invalidation",
        "Can create route handlers for GET/POST/PUT/DELETE"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start with the first learning objective: Fetch data in Server Components without useEffect."
        },
        {
          "stage": 2,
          "text": "Separate the model, the boundary that owns it, and the evidence a user or test can observe."
        },
        {
          "stage": 3,
          "text": "Use this retrieval prompt: Explain explicit force-cache, no-store, time-based revalidation, and tag-based invalidation in the locked Next.js 15 runtime."
        }
      ],
      "expectedReasoning": "Can fetch data in Server Components using async/await · Can distinguish explicit caching, dynamic fetching, time-based revalidation, and tag-based invalidation · Can create route handlers for GET/POST/PUT/DELETE · Can implement Server Actions for form mutations · Can use revalidatePath and revalidateTag for cache invalidation",
      "commonWrongPaths": [
        "Adding a second owner without a requirement",
        "Describing success without a failure or recovery state"
      ],
      "answerExplanation": "A good response names the model, its owner, and an observable way to verify it. Data fetching in Next.js shifts from client-side effects to server-side async components. Understanding the caching model — what gets cached, for how long, and how to invalidate — is the difference between a fast app and one that serves stale data or makes redundant requests.",
      "followUpVariation": "Apply the same boundary to a different feature in the project.",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/fetching-data"
    }
  ],
  "qa": [
    {
      "id": "qa-7",
      "question": "What is the difference between revalidatePath and revalidateTag?",
      "answer": "`revalidatePath(path)` targets cached data for a route path, while `revalidateTag(tag)` targets cached data associated with a tag. Prefer tags when the same data appears across routes and paths when the cache is route-specific. The visible timing depends on the Next.js cache model and where the function runs, so do not promise that every invalidation behaves as an immediate browser reload or as a single fixed next-request result.",
      "followUp": "Can you use both simultaneously? When would that be useful?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "caching",
        "revalidation",
        "data-fetching"
      ],
      "topicId": "server-data-fetching",
      "topicFamily": "nextjs-data",
      "sourceLink": "https://nextjs.org/docs/15/app/guides/caching"
    },
    {
      "id": "loop-qa-server-data-fetching-1",
      "topicId": "server-data-fetching",
      "topicFamily": "nextjs-data",
      "question": "What problem does Server Data Fetching help you solve?",
      "answer": "Data fetching in Next.js shifts from client-side effects to server-side async components. Understanding the caching model — what gets cached, for how long, and how to invalidate — is the difference between a fast app and one that serves stale data or makes redundant requests.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "server-data-fetching"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/fetching-data"
    },
    {
      "id": "loop-qa-server-data-fetching-2",
      "topicId": "server-data-fetching",
      "topicFamily": "nextjs-data",
      "question": "How would you explain the core idea of Server Data Fetching to a teammate?",
      "answer": "Explain explicit force-cache, no-store, time-based revalidation, and tag-based invalidation in the locked Next.js 15 runtime. A strong explanation should connect the model to: Fetch data in Server Components without useEffect; Understand Next.js caching and revalidation strategies.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "server-data-fetching"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/fetching-data"
    }
  ],
  "practices": [
    {
      "id": "bp-2",
      "title": "Fetch Data Where You Need It (Colocation)",
      "summary": "Fetch data in the Server Component that uses it, not in a top-level layout. Use Suspense boundaries for granular loading states.",
      "rationale": "Co-locating data fetching with the consuming component eliminates prop drilling of data, makes components self-contained, and enables independent Suspense boundaries for each data dependency.",
      "tradeOffs": "Multiple fetch calls from different components can cause waterfall requests if not parallelized. Use `Promise.all` or the `preload` pattern for related data. React `cache()` can memoize calls to the same cached function within its supported request scope; it is not a universal duplicate-request guarantee.",
      "appliesWhen": "Data is specific to a component or a subtree of components.",
      "doesNotApplyWhen": "Data is truly global (user session, feature flags) — fetch in root layout. Or when you need to coordinate multiple fetches across distant components.",
      "example": "A ProductPage Server Component fetches product data. A nested Reviews Server Component fetches reviews independently. Each has its own Suspense boundary.",
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/data-fetching/patterns",
      "tags": [
        "data-fetching",
        "architecture",
        "suspense"
      ],
      "topicId": "server-data-fetching",
      "topicFamily": "nextjs-data"
    },
    {
      "id": "bp-9",
      "title": "Make Cache Intent Explicit",
      "summary": "Name the cache and invalidation behavior a data dependency needs, then verify it against the pinned Next.js version.",
      "rationale": "Implicit or version-sensitive cache behavior can create production freshness bugs and staging/production drift.",
      "tradeOffs": "Explicit options add code and require understanding the cache model.",
      "appliesWhen": "Data freshness, revalidation, or production behavior matters.",
      "doesNotApplyWhen": "A throwaway prototype has no meaningful cache or freshness requirement.",
      "example": "Document whether a request is cached, dynamic, time-revalidated, or tag-invalidated before shipping it.",
      "sourceLink": "https://nextjs.org/docs/app/guides/caching-without-cache-components",
      "nextVersion": "15.5.20",
      "tags": [
        "nextjs-data",
        "caching",
        "production"
      ],
      "topicId": "server-data-fetching",
      "topicFamily": "nextjs-data"
    }
  ],
  "meta": {
    "topicFamily": "nextjs-data",
    "level": "intermediate",
    "title": "Server Data Fetching"
  }
};
