import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "app-router-and-layouts",
  "lesson": {
    "slug": "app-router-and-layouts",
    "title": "App Router & Layouts",
    "topicFamily": "nextjs-foundations",
    "level": "beginner",
    "prerequisites": [
      "components-and-jsx"
    ],
    "learningObjectives": [
      "Translate an App Router folder tree into URL segments and visible UI",
      "Place shared UI in root and nested layouts without resetting it on navigation",
      "Create dynamic segments and read the asynchronous `params` value used by Next.js 15",
      "Assign loading, missing, expected-error, and uncaught-error states to the boundary that owns them"
    ],
    "whyMatters": "The App Router turns folders and special files into a route tree. Once that tree is clear, you can place shared UI, page content, loading feedback, missing-resource UI, and error recovery close to the segment that owns each concern. This makes navigation behavior easier to predict and test.",
    "estimatedMinutes": 34,
    "sections": [
      {
        "id": "app-router-structure",
        "type": "concept",
        "title": "File-system based routing",
        "content": "Folders inside `app` define route segments. A segment becomes publicly reachable when it has a `page.tsx`. A `layout.tsx` wraps pages and nested layouts below that segment. The required root layout is `app/layout.tsx` and includes `<html>` and `<body>`.\n\nSpecial files give nearby states an owner: `loading.tsx` provides immediate loading UI, `not-found.tsx` handles a missing resource after `notFound()`, and `error.tsx` provides a Client Component error boundary for uncaught exceptions in its child segment. Read the tree from the root down: each folder adds a segment, each layout wraps descendants, and the leaf page supplies route content."
      },
      {
        "id": "layout-example",
        "type": "code-example",
        "title": "Root layout and nested layouts",
        "content": "Layouts receive `children`, which is the page or nested layout below them. In Next.js 15, a shared layout is preserved on navigation, remains interactive, and does not rerender. Keep segment-specific data in the page or a child Server Component when it must update for each navigation.",
        "code": "// app/layout.tsx\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body>\n        <Header />\n        <main>{children}</main>\n      </body>\n    </html>\n  );\n}\n\n// app/dashboard/layout.tsx\nexport default function DashboardLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <section className=\"dashboard\">\n      <Sidebar />\n      <div>{children}</div>\n    </section>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/layout.tsx"
      },
      {
        "id": "loading-error",
        "type": "code-example",
        "title": "Loading and error UI",
        "content": "`loading.tsx` creates route-segment loading UI backed by Suspense. `error.tsx` must be a Client Component; it catches uncaught exceptions in nested child content and can call `reset()` to attempt a rerender. It does not catch ordinary event-handler errors, and an error in a layout is handled by a boundary above that layout. Show a calm generic message to users and send technical details to monitoring.",
        "code": "// app/dashboard/loading.tsx\nexport default function Loading() {\n  return <DashboardSkeleton aria-label=\"Loading dashboard\" />;\n}\n\n// app/dashboard/error.tsx\n'use client';\n\nimport { useEffect } from 'react';\n\nexport default function Error({ error, reset }: {\n  error: Error & { digest?: string };\n  reset: () => void;\n}) {\n  useEffect(() => {\n    reportError(error);\n  }, [error]);\n\n  return (\n    <div role=\"alert\">\n      <h2>We could not load this part of the dashboard.</h2>\n      <button onClick={reset}>Try again</button>\n    </div>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/dashboard/loading.tsx + error.tsx"
      },
      {
        "id": "dynamic-routes",
        "type": "code-example",
        "title": "Dynamic routes and params",
        "content": "Wrap a folder name in square brackets, such as `[slug]`, when one segment value comes from data. In Next.js 15.5.20, `params` is a Promise, so await it before reading the value. `generateStaticParams` can provide known parameter values for prerendering, but it does not by itself describe every caching or fallback decision.",
        "code": "// app/posts/[slug]/page.tsx\nexport default async function PostPage({\n  params,\n}: {\n  params: Promise<{ slug: string }>;\n}) {\n  const { slug } = await params;\n  const post = await getPost(slug);\n\n  if (!post) notFound();\n  return <article>{post.content}</article>;\n}\n\nexport async function generateStaticParams() {\n  const posts = await getAllPosts();\n  return posts.map((post) => ({ slug: post.slug }));\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/posts/[slug]/page.tsx"
      },
      {
        "id": "router-question",
        "type": "question",
        "title": "Check your understanding",
        "content": "",
        "questions": [
          {
            "id": "q7",
            "question": "A user moves from `/dashboard/overview` to `/dashboard/settings`, and both pages share `app/dashboard/layout.tsx`. What happens to that shared layout in Next.js 15?",
            "options": [
              "The shared layout is preserved while the nested page content changes",
              "The shared layout always unmounts and starts from new state",
              "`loading.tsx` permanently replaces the shared layout",
              "The old page remains mounted and the new page is added beside it"
            ],
            "correctAnswer": "The shared layout is preserved while the nested page content changes",
            "expectedReasoning": "Next.js preserves shared layouts across navigation, so layout state and interactivity can continue while the child page changes. The second option describes a template-like reset, not layout behavior. The third confuses temporary loading UI with the wrapper. The fourth does not match normal page replacement for a route segment.",
            "commonMisconceptions": [
              "Treating layouts and templates as identical lifecycle boundaries",
              "Assuming a loading fallback permanently replaces shared UI",
              "Expecting layout code to rerun for every child navigation"
            ]
          }
        ]
      },
      {
        "id": "router-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Read the App Router as a nested ownership tree. Pages expose route content; layouts preserve shared UI; dynamic folders supply parameterized segments; loading, not-found, and error files handle different non-happy paths. Place each boundary at the smallest segment that can explain and recover from the state, then test the visible result through navigation."
      }
    ],
    "retrievalPrompt": "For `page.tsx`, `layout.tsx`, `loading.tsx`, `not-found.tsx`, and `error.tsx`, explain what state each file owns and name one state it should not own.",
    "reflectionPrompt": "Draw one route in your project as folders and special files. Which UI must persist, which content changes, and where should slow, missing, and failed states appear?",
    "masteryCriteria": [
      "Can map a folder tree to public routes and nested UI",
      "Can explain why shared layouts are preserved across navigation",
      "Can use Promise-based dynamic params in the pinned Next.js version",
      "Can distinguish expected errors, missing resources, uncaught exceptions, and loading states"
    ],
    "nextTopics": [
      "server-vs-client-components"
    ],
    "metadata": {
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/15/app/getting-started/layouts-and-pages",
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
        "https://nextjs.org/docs/15/app/getting-started/error-handling",
        "https://nextjs.org/docs/15/app/api-reference/file-conventions/dynamic-routes",
        "https://nextjs.org/docs/15/app/api-reference/functions/not-found",
        "https://nextjs.org/docs/15/app/api-reference/functions/redirect",
        "https://nextjs.org/docs/app/building-your-application/routing"
      ]
    },
    "diagram": {
      "title": "Route tree and segment boundaries",
      "kind": "tree",
      "nodes": [
        {
          "id": "root",
          "label": "Root layout",
          "role": "Persistent application shell"
        },
        {
          "id": "segment",
          "label": "Route segment",
          "role": "URL and layout boundary"
        },
        {
          "id": "page",
          "label": "Page",
          "role": "Route content"
        },
        {
          "id": "states",
          "label": "Loading/error/not-found",
          "role": "Recovery surfaces"
        }
      ],
      "edges": [
        {
          "from": "root",
          "to": "segment"
        },
        {
          "from": "segment",
          "to": "page"
        },
        {
          "from": "page",
          "to": "states"
        }
      ]
    },
    "chunks": [
      {
        "id": "app-router-and-layouts-retrieval-1",
        "title": "Pick the special file",
        "concept": "A route segment owns its page, shared layout, and nearby loading or recovery files.",
        "prediction": {
          "prompt": "Which file should keep a dashboard sidebar present across child-page navigation?",
          "options": [
            "layout.tsx",
            "loading.tsx"
          ],
          "correctAnswer": "layout.tsx",
          "feedbackCorrect": "The layout is the persistent shared wrapper for nested routes.",
          "feedbackWrong": "`loading.tsx` is a temporary fallback while child content is pending."
        },
        "synthesis": "Match URL segments, shared UI, and recovery states to the route tree."
      }
    ],
    "miniProject": {
      "title": "Map a dashboard route tree",
      "scenario": "Map a dashboard with a persistent sidebar, a dynamic project page, a slow activity panel, a missing project state, and retryable uncaught failures.",
      "acceptance": [
        "Folders and special files match the intended URLs",
        "Shared layout UI is separated from replaceable page content",
        "Loading, not-found, expected-error, and uncaught-error states have distinct owners"
      ],
      "rubric": [
        {
          "dimension": "Route model",
          "evidence": "Folders and special files match the intended URL tree."
        },
        {
          "dimension": "Persistence",
          "evidence": "Only shared shell concerns persist across nested navigation."
        },
        {
          "dimension": "Recovery",
          "evidence": "Loading and not-found/error states are user-facing and scoped."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-design-route-recovery",
      "title": "Design Route Recovery and Streaming States",
      "level": 8,
      "topicFamily": "nextjs-foundations",
      "scenario": "Design recovery for `/dashboard/projects/[id]`. The project may be missing, a rename form may fail validation, the activity panel may load slowly, and the page may throw an unexpected rendering error.",
      "constraints": [
        "Create a four-row state table before choosing a Next.js boundary",
        "Keep expected validation feedback separate from uncaught exceptions",
        "Place route-level and nested loading UI at the smallest useful boundary",
        "Name one user-visible smoke check for every state"
      ],
      "acceptanceCriteria": [
        "A missing project calls `notFound()` and renders the owning `not-found.tsx`",
        "Rename validation returns field or form feedback instead of throwing into `error.tsx`",
        "An uncaught child-render error reaches the nearest useful `error.tsx` and offers `reset()`",
        "The activity panel can show a nested Suspense fallback without hiding the rest of the page",
        "The plan handles event-handler failures explicitly instead of assigning them to a render error boundary"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Label each state: missing resource, expected user-correctable error, slow work, or uncaught exception."
        },
        {
          "stage": 2,
          "text": "Map missing data to `notFound()`, expected validation to returned UI state, and uncaught child rendering to `error.tsx`."
        },
        {
          "stage": 3,
          "text": "Use `loading.tsx` for segment loading and a nested Suspense fallback when only the activity panel is slow."
        }
      ],
      "expectedReasoning": "The four states have different owners. Missing data is an expected route outcome, validation is an expected action outcome, slow work needs progressive loading, and an uncaught render exception needs an error boundary. Smaller boundaries preserve usable UI and make recovery tests more specific.",
      "commonWrongPaths": [
        "Throwing expected validation failures so they replace the route with `error.tsx`",
        "Using one page-wide spinner for an independently slow panel",
        "Assuming `reset()` guarantees success without fixing or retrying the failed work",
        "Expecting an error boundary to catch ordinary async event-handler failures"
      ],
      "answerExplanation": "Use `notFound()` for the missing project, structured action state for rename validation, nested Suspense for the activity panel, and the nearest useful `error.tsx` for uncaught rendering failures. Each smoke check should observe the message, fallback, or retry control that the user actually receives.",
      "followUpVariation": "The dashboard layout itself now throws. Which higher boundary can recover, and when would `global-error.tsx` be required?",
      "checkType": "free-text",
      "prompt": "Map the missing, expected, uncaught, and slow states to Next.js boundaries and smoke checks.",
      "freeTextKeywords": [
        "notFound",
        "error.tsx",
        "reset",
        "loading",
        "Suspense"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/error-handling",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/error-handling",
        "https://nextjs.org/docs/15/app/getting-started/fetching-data#streaming",
        "https://nextjs.org/docs/15/app/api-reference/functions/not-found"
      ]
    }
  ],
  "qa": [
    {
      "id": "learn-react-qa-extra-4",
      "category": "nextjs",
      "level": "intermediate",
      "question": "What is the difference between redirect and next/link navigation?",
      "answer": "`<Link>` is the main choice for a user-visible link. It supports client-side navigation and can prefetch. `redirect()` is control flow for Server Components, Server Functions, and Route Handlers when code decides that another location should be shown. `redirect()` throws a framework redirect error, so call it outside a `try` block that would accidentally catch it.",
      "followUp": "For a successful form submission, why should `redirect()` usually run after the mutation and outside the `try` block?",
      "tags": [
        "learn-react-bridge",
        "navigation"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/api-reference/functions/redirect",
      "topicId": "app-router-and-layouts",
      "topicFamily": "nextjs-foundations",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/api-reference/functions/redirect",
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
        "https://nextjs.org/docs/app/api-reference/functions/redirect"
      ]
    },
    {
      "id": "expansion-qa-route-recovery",
      "topicId": "app-router-and-layouts",
      "topicFamily": "nextjs-foundations",
      "question": "How should a Next.js App Router flow separate missing, expected, uncaught, and slow states?",
      "answer": "Start by classifying the state. Use `notFound()` plus `not-found.tsx` for a missing resource. Return expected validation or request failures as deliberate UI state. Use `error.tsx` for uncaught exceptions in child rendering and offer `reset()` when retry is meaningful. Use `loading.tsx` or a nested Suspense fallback for pending work. Event-handler failures still need explicit handling.",
      "followUp": "Which part of the route can remain useful if only one nested panel is slow or failed?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-route-recovery",
        "route-recovery",
        "not-found",
        "error-boundary",
        "streaming"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/error-handling",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/error-handling",
        "https://nextjs.org/docs/15/app/getting-started/fetching-data#streaming",
        "https://nextjs.org/docs/15/app/getting-started/fetching-data"
      ]
    },
    {
      "id": "loop-qa-app-router-and-layouts-1",
      "topicId": "app-router-and-layouts",
      "topicFamily": "nextjs-foundations",
      "question": "How does the App Router help you decide where shared UI and recovery states belong?",
      "answer": "The folder tree is also an ownership tree. A layout owns shared UI for descendants, a page owns route content, and loading, not-found, and error files own distinct nearby states. Placing each file near the smallest segment it serves keeps unrelated parts of the screen available.",
      "followUp": "Draw one route and mark which component is preserved, which page changes, and where each fallback appears.",
      "category": "nextjs",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "app-router-and-layouts"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/layouts-and-pages",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/layouts-and-pages",
        "https://nextjs.org/docs/15/app/getting-started/error-handling"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-route-failure-boundaries",
      "topicId": "app-router-and-layouts",
      "topicFamily": "nextjs-foundations",
      "title": "Assign Each Route Failure to Its Owning Boundary",
      "summary": "Classify missing, expected, pending, and uncaught states before assigning them to route files or component boundaries.",
      "rationale": "These states need different user experiences. A missing record is not the same as invalid form input, a slow panel, or a rendering bug. Clear ownership produces smaller fallbacks and more useful recovery.",
      "tradeOffs": "Several small boundaries require deliberate placement and smoke tests. The benefit is that one local problem does not have to replace the whole route.",
      "appliesWhen": "A route reads possibly missing data, accepts mutations, contains independently slow work, or can encounter an uncaught rendering exception.",
      "doesNotApplyWhen": "The condition is ordinary domain branching that can be rendered directly and needs no route-level recovery behavior.",
      "example": "Use `notFound()` for a missing booking, returned form state for an invalid date, nested Suspense for slow reviews, and `error.tsx` for an uncaught child-render exception.",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/error-handling",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/error-handling",
        "https://nextjs.org/docs/15/app/getting-started/fetching-data#streaming"
      ],
      "tags": [
        "expansion-route-recovery",
        "route-recovery",
        "streaming",
        "error-boundary"
      ]
    }
  ],
  "meta": {
    "topicFamily": "nextjs-foundations",
    "level": "beginner",
    "title": "App Router & Layouts"
  }
};
