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
      "Navigate the Next.js App Router directory structure",
      "Create layouts that persist across navigations",
      "Build pages with dynamic route segments",
      "Implement loading and error UI for route segments"
    ],
    "whyMatters": "The App Router is the backbone of a Next.js application. Layouts, pages, loading states, and error boundaries are defined by the file system, not by imperative routing configuration. Understanding this convention unlocks composition, parallel routes, and partial rendering.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "app-router-structure",
        "type": "concept",
        "title": "File-system based routing",
        "content": "In the App Router, folders define routes, and files define UI. A `page.tsx` file makes a route publicly accessible. A `layout.tsx` wraps child pages and persists across navigations. `loading.tsx` shows while the page loads. `error.tsx` catches errors in the subtree. This convention means the file tree IS the route tree."
      },
      {
        "id": "layout-example",
        "type": "code-example",
        "title": "Root layout and nested layouts",
        "content": "Layouts wrap pages and persist state across navigations. They receive children as a prop.",
        "code": "// app/layout.tsx\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body>\n        <Header />\n        <main>{children}</main>\n        <Footer />\n      </body>\n    </html>\n  );\n}\n\n// app/dashboard/layout.tsx\nexport default function DashboardLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <div className=\"dashboard\">\n      <Sidebar />\n      <div className=\"content\">{children}</div>\n    </div>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/layout.tsx"
      },
      {
        "id": "loading-error",
        "type": "code-example",
        "title": "Loading and error UI",
        "content": "loading.tsx uses React Suspense under the hood. error.tsx must be a Client Component and receives reset as a prop.",
        "code": "// app/dashboard/loading.tsx\nexport default function Loading() {\n  return <DashboardSkeleton />;\n}\n\n// app/dashboard/error.tsx\n'use client';\nexport default function Error({\n  error, reset\n}: {\n  error: Error & { digest?: string };\n  reset: () => void;\n}) {\n  return (\n    <div role=\"alert\">\n      <h2>Something went wrong</h2>\n      <p>{error.message}</p>\n      <button onClick={reset}>Try again</button>\n    </div>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/dashboard/loading.tsx + error.tsx"
      },
      {
        "id": "dynamic-routes",
        "type": "code-example",
        "title": "Dynamic routes and params",
        "content": "Use [param] folder names for dynamic segments. Access params in page, layout, route handler, and generateMetadata.",
        "code": "// app/posts/[slug]/page.tsx\nexport default async function PostPage({\n  params\n}: {\n  params: Promise<{ slug: string }>\n}) {\n  const { slug } = await params;\n  const post = await getPost(slug);\n  return <article>{post.content}</article>;\n}\n\n// Generates static paths at build time:\nexport async function generateStaticParams() {\n  const posts = await getAllPosts();\n  return posts.map(post => ({ slug: post.slug }));\n}",
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
            "question": "What happens to a layout component when navigating between two pages that share that layout?",
            "options": [
              "The layout unmounts and remounts",
              "The layout re-renders but does not unmount",
              "The layout can persist across the navigation, but may still re-render",
              "The layout is replaced by a completely new instance"
            ],
            "correctAnswer": "The layout can persist across the navigation, but may still re-render",
            "expectedReasoning": "Layouts in the App Router can persist across navigations between pages that share the same segment. React may preserve the layout instance and its state, while the page content changes, but persistence does not mean the layout can never re-render when its inputs or tree change.",
            "commonMisconceptions": [
              "Thinking the entire tree re-renders on navigation",
              "Expecting layout state to reset between pages"
            ]
          }
        ]
      },
      {
        "id": "router-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "The App Router maps your file system to your application's route tree. layout.tsx provides persistent wrapping UI. page.tsx is the unique content for each route. loading.tsx and error.tsx handle the two most important non-happy-path states. Dynamic segments via [param] give you parameterized routes. Together, these conventions eliminate most routing boilerplate."
      }
    ],
    "retrievalPrompt": "Name all the special files in Next.js App Router and what each one does.",
    "reflectionPrompt": "Think about your current project's navigation structure. Would nested layouts simplify any of your current component patterns?",
    "masteryCriteria": [
      "Can create and nest layouts in the App Router",
      "Understands which files create routes vs provide UI wrappers",
      "Can implement loading and error states per route segment",
      "Can use dynamic route segments with params"
    ],
    "nextTopics": [
      "server-vs-client-components"
    ],
    "metadata": {
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-01",
      "sources": [
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
        "concept": "Layouts persist around nested routes; loading and error files own route-scoped recovery states.",
        "prediction": {
          "prompt": "Which file provides a persistent wrapper for nested routes?",
          "options": [
            "layout.tsx",
            "loading.tsx"
          ],
          "correctAnswer": "layout.tsx",
          "feedbackCorrect": "The layout wraps the nested segment.",
          "feedbackWrong": "loading.tsx is a loading UI boundary, not the persistent wrapper."
        },
        "synthesis": "Let the route tree own navigation, persistence, and recovery boundaries."
      }
    ],
    "miniProject": {
      "title": "Map a dashboard route tree",
      "scenario": "Design a dashboard with a persistent shell, nested settings route, loading UI, and not-found path.",
      "acceptance": [
        "Segment ownership is explicit",
        "Persistent and replaceable UI are separated",
        "Each critical route has a recovery state"
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
      "scenario": "A dynamic dashboard must handle a missing resource, an expected mutation failure, an uncaught render exception, and a slow nested data dependency.",
      "constraints": [
        "Classify expected and uncaught failures separately",
        "Place notFound and error.tsx at the correct segment",
        "Use reset for retry and loading/Suspense for slow work",
        "Name one user-visible smoke assertion per state"
      ],
      "acceptanceCriteria": [
        "Missing data uses notFound at the owning route segment",
        "Expected failures return deliberate UI feedback",
        "Uncaught render failures reach an error boundary with reset retry",
        "Slow nested work streams without removing explicit error recovery",
        "Event-handler failures are not incorrectly assigned to render error boundaries"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Make a four-row failure matrix before choosing files."
        },
        {
          "stage": 2,
          "text": "Separate notFound, expected action results, uncaught render errors, and slow rendering."
        },
        {
          "stage": 3,
          "text": "Use loading.tsx for route loading and nested Suspense for a component-level slow dependency."
        }
      ],
      "expectedReasoning": "Next.js route conventions own different failure classes. notFound handles an expected missing resource, an action result handles an expected user-correctable failure, error.tsx catches uncaught render failures and exposes reset, and loading.tsx or Suspense provides progressive loading. Error boundaries do not replace event-handler error handling.",
      "commonWrongPaths": [
        "Throwing every expected validation error into error.tsx",
        "Using a page-wide spinner for every nested dependency",
        "Assuming streaming removes the need for an error boundary",
        "Expecting render error boundaries to catch ordinary click-handler failures"
      ],
      "answerExplanation": "Use the smallest route or component boundary that owns the state: notFound for missing resources, explicit action/data states for expected failures, error.tsx for uncaught render failures with reset, and loading.tsx or Suspense for slow work. Test each state through the user-visible route.",
      "followUpVariation": "The slow child also fails after streaming begins. Where should its recovery boundary live?",
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
        "https://nextjs.org/docs/15/app/getting-started/fetching-data",
        "https://nextjs.org/docs/app/api-reference/functions/not-found"
      ]
    }
  ],
  "qa": [
    {
      "id": "learn-react-qa-extra-4",
      "category": "nextjs",
      "level": "intermediate",
      "question": "What is the difference between redirect and next/link navigation?",
      "answer": "next/link supports user-driven client navigation. redirect() is server-side control flow, such as sending a user elsewhere after an authorization check.",
      "followUp": "When does redirect throw?",
      "tags": [
        "learn-react-bridge",
        "navigation"
      ],
      "sourceLink": "https://nextjs.org/docs/app/api-reference/functions/redirect",
      "topicId": "app-router-and-layouts",
      "topicFamily": "nextjs-foundations"
    },
    {
      "id": "expansion-qa-route-recovery",
      "topicId": "app-router-and-layouts",
      "topicFamily": "nextjs-foundations",
      "question": "How should a Next.js App Router flow separate missing, expected, uncaught, and slow states?",
      "answer": "Use notFound for an expected missing resource, return deliberate validation or action feedback for expected failures, place error.tsx where it can catch uncaught render failures and offer reset, and use loading.tsx or nested Suspense for slow work. Event-handler failures still need their own handling.",
      "followUp": "Why is a single page-wide spinner a poor model for a slow nested dependency?",
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
        "https://nextjs.org/docs/15/app/getting-started/fetching-data"
      ]
    },
    {
      "id": "loop-qa-app-router-and-layouts-1",
      "topicId": "app-router-and-layouts",
      "topicFamily": "nextjs-foundations",
      "question": "What problem does App Router & Layouts help you solve?",
      "answer": "The App Router is the backbone of a Next.js application. Layouts, pages, loading states, and error boundaries are defined by the file system, not by imperative routing configuration. Understanding this convention unlocks composition, parallel routes, and partial rendering.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "nextjs",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "app-router-and-layouts"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/routing"
    }
  ],
  "practices": [
    {
      "id": "expansion-route-failure-boundaries",
      "topicId": "app-router-and-layouts",
      "topicFamily": "nextjs-foundations",
      "title": "Assign Each Route Failure to Its Owning Boundary",
      "summary": "Use notFound, explicit expected-error UI, error.tsx/reset, and loading or Suspense according to the state each boundary owns.",
      "rationale": "Failure boundaries are not interchangeable. A precise mapping keeps expected user-correctable errors visible while preserving recovery for uncaught render failures and slow nested work.",
      "tradeOffs": "More boundaries require deliberate placement and smoke coverage, but a single global fallback hides ownership and recovery behavior.",
      "appliesWhen": "A route has missing resources, mutations, uncaught rendering risk, or independently slow dependencies.",
      "doesNotApplyWhen": "The state is pure domain logic with no route or rendering boundary.",
      "example": "Map a missing booking to notFound, a rejected form to returned field errors, an uncaught render error to error.tsx with reset, and a slow review panel to nested Suspense.",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/error-handling",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/fetching-data"
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
