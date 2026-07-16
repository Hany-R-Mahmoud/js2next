import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "production-deployment",
  "lesson": {
    "slug": "production-deployment",
    "title": "Production & Deployment",
    "topicFamily": "production",
    "level": "advanced",
    "prerequisites": [
      "server-data-fetching"
    ],
    "learningObjectives": [
      "Understand Next.js build output and deployment targets",
      "Optimize images, fonts, and bundles for production",
      "Implement SEO best practices with metadata API",
      "Configure environment variables securely",
      "Set up basic observability and error tracking"
    ],
    "whyMatters": "A working dev server is not a production app. Image optimization, font loading, metadata for SEO, environment variable safety, and performance monitoring are not optional polish — they directly affect user experience, search rankings, and security.",
    "estimatedMinutes": 30,
    "sections": [
      {
        "id": "build-output",
        "type": "concept",
        "title": "Build output and deployment",
        "content": "`next build` produces an optimized production build. Static routes are pre-rendered at build time. Dynamic routes are rendered on demand (SSR) or incrementally regenerated (ISR). The output can be deployed to Vercel (zero-config), any Node.js server, or as a static export. Each deployment target has trade-offs in supported features."
      },
      {
        "id": "images-fonts",
        "type": "code-example",
        "title": "Images, fonts, and performance",
        "content": "Use next/image for automatic optimization, lazy loading, and preventing layout shift. Use next/font for zero-layout-shift font loading.",
        "code": "import Image from 'next/image';\nimport { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google';\n\nconst bricolage = Bricolage_Grotesque({ subsets: ['latin'] });\nconst jetbrains = JetBrains_Mono({ subsets: ['latin'] });\n\nexport default function Page() {\n  return (\n    <>\n      <Image\n        src=\"/hero.jpg\"\n        alt=\"Hero image\"\n        width={1200}\n        height={600}\n        priority\n        placeholder=\"blur\"\n      />\n      <h1 className={bricolage.className}>Welcome</h1>\n    </>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/page.tsx"
      },
      {
        "id": "seo-metadata",
        "type": "code-example",
        "title": "SEO with the Metadata API",
        "content": "Export a metadata object or generateMetadata function from any page or layout.",
        "code": "import { Metadata } from 'next';\n\nexport const metadata: Metadata = {\n  title: 'Learn React & Next.js',\n  description: 'Interactive lessons, challenges, and best practices for modern frontend development.',\n  openGraph: {\n    title: 'Learn React & Next.js',\n    description: 'Master modern frontend development interactively.',\n    images: ['/og-image.png'],\n  },\n};\n\nexport default function HomePage() {\n  return <main>...</main>;\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/page.tsx"
      },
      {
        "id": "env-vars",
        "type": "concept",
        "title": "Environment variables and security",
        "content": "Use `.env.local` for secrets — never commit it. Prefix server-only variables with no special prefix or with a private convention. Variables prefixed with `NEXT_PUBLIC_` are inlined at build time and visible in the browser — only use them for non-sensitive config. Server Components, Route Handlers, and Server Actions have access to all environment variables. Client Components can only access `NEXT_PUBLIC_` variables."
      },
      {
        "id": "production-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Production readiness is not about adding features — it is about removing failure modes. Optimize the critical rendering path (images, fonts, bundle size). Make metadata precise and complete (SEO, social sharing). Keep secrets on the server (environment variables, `NEXT_PUBLIC_` discipline). Know your caching strategy. Monitor errors and performance. These are not afterthoughts; they are the difference between a demo and a deployed product."
      }
    ],
    "retrievalPrompt": "What is the difference between a server-only environment variable and a NEXT_PUBLIC_ variable? Where can each be accessed?",
    "reflectionPrompt": "Run Lighthouse on your current project. What is the biggest performance opportunity? Is it images, JavaScript bundle size, or something else?",
    "masteryCriteria": [
      "Understands Next.js build output and deployment targets",
      "Can use next/image and next/font for optimized loading",
      "Can implement SEO with the Metadata API",
      "Can securely configure environment variables",
      "Understands the importance of caching strategy and monitoring"
    ],
    "nextTopics": [
      "architecture-decisions"
    ],
    "metadata": {
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-01",
      "sources": [
        "https://nextjs.org/docs/app/building-your-application/deploying",
        "https://nextjs.org/docs/15/app/api-reference/components/image",
        "https://nextjs.org/docs/15/app/getting-started/fonts",
        "https://nextjs.org/docs/15/app/guides/environment-variables",
        "https://nextjs.org/docs/15/app/guides/production-checklist"
      ]
    },
    "diagram": {
      "title": "From build to observed release",
      "kind": "flow",
      "nodes": [
        {
          "id": "build",
          "label": "Production build",
          "role": "Artifact evidence"
        },
        {
          "id": "config",
          "label": "Runtime configuration",
          "role": "Public versus server-only"
        },
        {
          "id": "smoke",
          "label": "Critical smoke",
          "role": "Routes and failures"
        },
        {
          "id": "observe",
          "label": "Observe and recover",
          "role": "Signals and rollback"
        }
      ],
      "edges": [
        {
          "from": "build",
          "to": "config"
        },
        {
          "from": "config",
          "to": "smoke"
        },
        {
          "from": "smoke",
          "to": "observe"
        }
      ]
    },
    "chunks": [
      {
        "id": "production-deployment-retrieval-1",
        "title": "Find the release evidence",
        "concept": "A local development render does not prove that the built artifact, runtime configuration, cache, and failure path work after deployment.",
        "prediction": {
          "prompt": "Which evidence belongs before release?",
          "options": [
            "Only a local screenshot",
            "A production-like build and critical smoke flow"
          ],
          "correctAnswer": "A production-like build and critical smoke flow",
          "feedbackCorrect": "Release evidence crosses build and runtime boundaries.",
          "feedbackWrong": "Development mode exercises only part of the deployment contract."
        },
        "synthesis": "Ship from evidence: build, configure, smoke, observe, and recover."
      }
    ],
    "miniProject": {
      "title": "Write a deployment smoke plan",
      "scenario": "Create a release checklist for one data-backed Next.js route.",
      "acceptance": [
        "Server-only configuration is protected",
        "Success and failure smoke flows are named",
        "A measurable rollback trigger is recorded"
      ],
      "rubric": [
        {
          "dimension": "Runtime",
          "evidence": "Build and runtime assumptions match the target."
        },
        {
          "dimension": "Reliability",
          "evidence": "Freshness, errors, and smoke evidence are explicit."
        },
        {
          "dimension": "Recovery",
          "evidence": "Rollback owner and trigger are actionable."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "optimize-list-performance",
      "title": "Optimize a Slow List",
      "level": 7,
      "topicFamily": "app-quality",
      "scenario": "A list of 500 items with expandable details is slow to render and unresponsive during scrolling. Each item has an \"Expand\" button that shows details fetched from an API.",
      "constraints": [
        "Cannot paginate (client requirement)",
        "Detail fetching must be lazy (only when expanded)",
        "Must pass accessibility audit (keyboard navigation, ARIA labels)"
      ],
      "acceptanceCriteria": [
        "Initial render of 500 items completes under 500ms",
        "Expanding an item fetches its details without blocking the UI",
        "Scrolling is smooth (60fps target)",
        "Keyboard navigation works: Tab through items, Enter to expand"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Consider virtualization: only render items visible in the viewport."
        },
        {
          "stage": 2,
          "text": "Each expandable item should manage its own loading state independently."
        },
        {
          "stage": 3,
          "text": "Use React.memo where profiling shows unchanged relevant props and context allow work to be skipped."
        }
      ],
      "expectedReasoning": "Virtualize the list (render ~20 items instead of 500). Each item is a separate component with its own state for expansion and detail loading. React.memo may skip work when an item’s relevant props and context are unchanged; it is not a universal render guarantee.",
      "commonWrongPaths": [
        "Trying to optimize with useMemo on the whole list instead of virtualizing",
        "Fetching details for all items at once"
      ],
      "answerExplanation": "Use a virtualization library or a simple custom virtualizer that calculates which items are in the viewport. Each item component manages its own expand/fetch state. windowing reduces DOM nodes from 500 to ~20.",
      "followUpVariation": "How would you add drag-and-drop reordering on top of this virtualized list?",
      "sourceLink": "https://nextjs.org/docs/app/guides/production-checklist"
    },
    {
      "slug": "design-auth-flow",
      "title": "Design an Auth Flow Architecture",
      "level": 8,
      "topicFamily": "production",
      "scenario": "Design an authentication flow for a Next.js app that supports: email/password login, OAuth (Google/GitHub), protected routes, role-based access (admin/user), and session persistence across tabs.",
      "constraints": [
        "Describe the architecture, not just the library choice",
        "Specify which parts run on server vs client",
        "Handle token refresh transparently",
        "Keep auth state synchronized across browser tabs",
        "Explain how you would test this"
      ],
      "acceptanceCriteria": [
        "Clear diagram or description of the auth flow from login to protected resource access",
        "Server/client boundary is clearly specified",
        "Token refresh strategy is explained",
        "Cross-tab sync mechanism is described",
        "Testing approach covers unit, integration, and E2E scenarios"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Use request-boundary checks for redirects, but enforce authentication and authorization inside Server Actions and Route Handlers."
        },
        {
          "stage": 2,
          "text": "The BroadcastChannel API can synchronize state across tabs."
        },
        {
          "stage": 3,
          "text": "Keep session handling on the server; if a client API wrapper refreshes tokens, define its race and retry behavior explicitly."
        }
      ],
      "expectedReasoning": "Use a request-boundary check for early redirects, then authenticate and authorize again inside every Server Action or Route Handler that protects data. Keep session cookies httpOnly and define the client-side session view separately. If tabs need synchronization, BroadcastChannel can publish login/logout events, but it is not an authorization boundary.",
      "commonWrongPaths": [
        "Relying only on client-side route protection (bypassable)",
        "Storing access tokens in localStorage (XSS vulnerable)",
        "Not handling token refresh race conditions (multiple simultaneous refreshes)"
      ],
      "answerExplanation": "Server: request-boundary checks may redirect early, but Server Actions and Route Handlers authenticate and authorize the request before reading or mutating data. Keep session cookies httpOnly. Client code may read a safe user projection and publish tab events, but it never replaces server authorization. Treat token refresh as a separately designed session concern with bounded retries and race handling.",
      "followUpVariation": "How would the architecture change for a mobile app using the same backend?",
      "sourceLinks": [
        "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
        "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html",
        "https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel"
      ],
      "sourceLink": "https://nextjs.org/docs/app/guides/authentication"
    },
    {
      "slug": "investigate-slow-page",
      "title": "Investigate a Slow Page Load",
      "level": 9,
      "topicFamily": "production",
      "scenario": "Users report a product detail page takes 8+ seconds to become interactive. The page shows: product info, reviews (1000+), related products (50), and a \"recently viewed\" widget. You have access to Chrome DevTools and server logs.",
      "constraints": [
        "Diagnose without looking at the source code first",
        "List at least 3 possible causes with evidence you would look for",
        "Propose fixes for each cause",
        "Prioritize fixes by impact and effort"
      ],
      "acceptanceCriteria": [
        "At least 3 distinct hypotheses with diagnostic steps",
        "Each hypothesis linked to specific metrics (LCP, TBT, CLS, etc.)",
        "Fixes are actionable and correctly prioritized",
        "Edge cases considered (slow network, low-end devices)"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Check the Network tab: what is the waterfall? Are there blocking requests?"
        },
        {
          "stage": 2,
          "text": "Check the Performance tab: what is the main thread doing during load?"
        },
        {
          "stage": 3,
          "text": "Consider: large JS bundle, render-blocking data fetching, unoptimized images, client-side hydration of static content."
        }
      ],
      "expectedReasoning": "Hypothesis 1: All 1000 reviews are fetched client-side and hydrated (large JS payload). Hypothesis 2: Product images are not optimized (large LCP). Hypothesis 3: related products fetch blocks the main waterfall. Fixes: paginate reviews, use next/image, fetch related products in parallel or on the server.",
      "commonWrongPaths": [
        "Jumping to \"add a loading spinner\" without diagnosing root cause",
        "Assuming the problem is always the database query"
      ],
      "answerExplanation": "Most likely: reviews are client-side fetched and rendered (1000 DOM nodes, hydration cost). Fix: fetch reviews on the server, paginate or virtualize. Second: unoptimized images — LCP >4s. Fix: next/image with priority. Third: sequential data fetching blocking the waterfall — fix by parallelizing or using Suspense boundaries.",
      "followUpVariation": "After fixing, the page loads fast on desktop but is still slow on mobile. What additional diagnostics would you run?",
      "sourceLink": "https://nextjs.org/docs/app/guides/production-checklist"
    }
  ],
  "qa": [
    {
      "id": "qa-5",
      "question": "Why is my page loading slowly after deployment but fine in dev?",
      "answer": "Development and production-like builds can differ in bundling, image/font handling, caching, server behavior, and hydration cost. Measure the deployed or production-like build: (1) LCP and image transfer/decoding cost, (2) JavaScript transfer and long tasks, (3) server waterfalls and client-side fetching, and (4) hydration cost for heavy components. Use the browser Performance panel, Lighthouse, and bundle analysis to connect each fix to evidence.",
      "followUp": "Which measurements would distinguish an image bottleneck from a JavaScript or server waterfall bottleneck?",
      "category": "performance",
      "level": "advanced",
      "tags": [
        "production",
        "performance",
        "optimization"
      ],
      "topicId": "production-deployment",
      "topicFamily": "production",
      "sourceLink": "https://nextjs.org/docs/15/app/guides/production-checklist"
    },
    {
      "id": "loop-qa-production-deployment-1",
      "topicId": "production-deployment",
      "topicFamily": "production",
      "question": "What problem does Production & Deployment help you solve?",
      "answer": "A working dev server is not a production app. Image optimization, font loading, metadata for SEO, environment variable safety, and performance monitoring are not optional polish — they directly affect user experience, search rankings, and security.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "production-deployment"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/deploying"
    },
    {
      "id": "loop-qa-production-deployment-2",
      "topicId": "production-deployment",
      "topicFamily": "production",
      "question": "How would you explain the core idea of Production & Deployment to a teammate?",
      "answer": "What is the difference between a server-only environment variable and a NEXT_PUBLIC_ variable? Where can each be accessed? A strong explanation should connect the model to: Understand Next.js build output and deployment targets; Optimize images, fonts, and bundles for production.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "production-deployment"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/deploying"
    }
  ],
  "practices": [
    {
      "id": "bp-8",
      "title": "Never Expose Secrets to the Client",
      "summary": "Environment variables without NEXT_PUBLIC_ prefix are server-only. Only prefix variables that must be exposed to the browser.",
      "rationale": "Server-only variables (database URLs, API keys, secrets) remain on the server. NEXT_PUBLIC_ variables are inlined at build time and visible in the client bundle. Exposing a secret can compromise your entire backend.",
      "tradeOffs": "Client-side code cannot access server-only env vars. If you need config on the client, you must either prefix it or fetch it from an API route.",
      "appliesWhen": "The value is a secret (API key, token, connection string, private URL).",
      "doesNotApplyWhen": "The value is safe for public exposure (public API URL, feature flags, analytics IDs).",
      "example": "`DATABASE_URL=postgres://...` — server-only. `NEXT_PUBLIC_API_URL=https://api.example.com` — exposed to browser.",
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/configuring/environment-variables",
      "sourceLinks": [
        "https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html"
      ],
      "tags": [
        "security",
        "environment",
        "production"
      ],
      "topicId": "production-deployment",
      "topicFamily": "production"
    },
    {
      "id": "bp-11",
      "title": "Enforce Authorization on the Server",
      "summary": "Treat hidden UI and client state as hints only; enforce identity and permissions at the server boundary protecting the resource.",
      "rationale": "Clients are untrusted and can be bypassed, while server operations can reject unauthorized reads and mutations.",
      "tradeOffs": "Denied paths need explicit server logic and tests in addition to client navigation behavior.",
      "appliesWhen": "A route, action, handler, or data source protects a user or role-specific capability.",
      "doesNotApplyWhen": "The content and operation are genuinely public.",
      "example": "A request-boundary redirect improves navigation, but the Server Action or Route Handler still checks authorization before accessing data.",
      "sourceLink": "https://nextjs.org/docs/app/guides/authentication",
      "nextVersion": "15.5.20",
      "tags": [
        "production",
        "security",
        "auth"
      ],
      "topicId": "production-deployment",
      "topicFamily": "production"
    }
  ],
  "meta": {
    "topicFamily": "production",
    "level": "advanced",
    "title": "Production & Deployment"
  }
};
