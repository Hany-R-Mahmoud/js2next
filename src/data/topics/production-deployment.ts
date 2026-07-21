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
      "Build and run the application in a production-like environment before release",
      "Match the deployment target to the Next.js runtime features the application uses",
      "Use image, font, and metadata APIs with explicit user-facing goals",
      "Keep secrets server-only and understand that `NEXT_PUBLIC_` values are frozen at build time",
      "Define smoke checks, field signals, and a practical rollback decision"
    ],
    "whyMatters": "A release crosses boundaries that development mode does not fully exercise: the production build, runtime configuration, cache behavior, network conditions, and real user devices. Production readiness means gathering evidence at each boundary and having a clear response when that evidence shows a problem.",
    "estimatedMinutes": 44,
    "sections": [
      {
        "id": "build-output",
        "type": "concept",
        "title": "Build output and deployment",
        "content": "`next build` creates the production build and reports build-time failures. Run that build with `next start` in a production-like environment before release. Whether a route is prerendered, rendered on request, or revalidated depends on the route APIs and cache choices, so inspect the build output and test the behavior instead of assigning one mode to every route.\n\nChoose a deployment target that supports the features you use. A Node.js server or Docker deployment supports the full Next.js feature set described for that runtime. A static export can run on any static host, but features that require a server at request time are not available. Managed platforms may add integrations, but application smoke checks and rollback ownership remain your responsibility."
      },
      {
        "id": "images-fonts",
        "type": "code-example",
        "title": "Images, fonts, and performance",
        "content": "Use `next/image` to serve appropriately sized images and reserve layout space with known dimensions or `fill`. Mark only the real above-the-fold LCP image as high priority in Next.js 15. Use `next/font` to self-host selected font files and apply its generated class. Then measure: an API helps, but the chosen source size, responsive `sizes`, and page layout still determine the result.",
        "code": "import Image from 'next/image';\nimport hero from '@/public/hero.jpg';\nimport { Bricolage_Grotesque } from 'next/font/google';\n\nconst display = Bricolage_Grotesque({\n  subsets: ['latin'],\n  display: 'swap',\n});\n\nexport default function Page() {\n  return (\n    <main className={display.className}>\n      <Image\n        src={hero}\n        alt=\"Students working through a lesson\"\n        priority\n        placeholder=\"blur\"\n        sizes=\"100vw\"\n      />\n      <h1>Learn step by step</h1>\n    </main>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/page.tsx"
      },
      {
        "id": "seo-metadata",
        "type": "code-example",
        "title": "SEO with the Metadata API",
        "content": "The Metadata API lets a Server Component page or layout export static `metadata` or an async `generateMetadata` function. Give each important route a useful title and description, and add canonical or social fields when the product needs them. Metadata supports discovery and sharing, but it does not replace accessible headings, meaningful content, or search-quality fundamentals.",
        "code": "import type { Metadata } from 'next';\n\nexport const metadata: Metadata = {\n  metadataBase: new URL('https://learn.example.com'),\n  title: 'React and Next.js lessons',\n  description: 'Patient, practical lessons for modern React and Next.js.',\n  alternates: { canonical: '/' },\n  openGraph: {\n    title: 'React and Next.js lessons',\n    description: 'Patient, practical lessons for modern React and Next.js.',\n    images: ['/og-image.png'],\n  },\n};\n\nexport default function HomePage() {\n  return <main><h1>React and Next.js lessons</h1></main>;\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/page.tsx"
      },
      {
        "id": "env-vars",
        "type": "concept",
        "title": "Environment variables and security",
        "content": "Environment variables are server-only by default. Keep secrets such as database URLs, signing keys, and private API credentials out of `NEXT_PUBLIC_` variables and out of client props. Next.js loads `.env*` files, and `.env*.local` files should remain uncommitted; production systems should use the deployment platform’s secret store.\n\nA variable prefixed with `NEXT_PUBLIC_` is inlined into browser JavaScript during `next build`. It is public and frozen to the build-time value, so promoting the same artifact to another environment does not change it. If the browser needs environment-specific runtime configuration, design an explicit public server endpoint or initialization response rather than exposing a secret."
      },
      {
        "id": "production-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Release from evidence. Build and run production mode, verify runtime configuration, smoke the critical success and failure paths, measure performance on representative devices, and confirm error and Web Vitals signals arrive. Record an owner and threshold for rollback or mitigation. Optimization is not a checklist guess: observe the bottleneck, change one cause, and compare the same measurement again."
      }
    ],
    "retrievalPrompt": "Describe the release path from `next build` to production monitoring. At each step, name one failure the step can reveal and one recovery action.",
    "reflectionPrompt": "For one important route, list its build assumption, runtime secrets, critical user flow, performance signal, error signal, and rollback trigger.",
    "masteryCriteria": [
      "Can run and smoke-test a production-like build",
      "Can explain which deployment targets support the route’s runtime features",
      "Can reserve image space, load fonts deliberately, and provide route metadata",
      "Can distinguish server-only variables from build-time public variables",
      "Can diagnose performance from measurements and define a release recovery plan"
    ],
    "nextTopics": [
      "architecture-decisions"
    ],
    "metadata": {
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/15/app/getting-started/deploying",
        "https://nextjs.org/docs/15/app/getting-started/images",
        "https://nextjs.org/docs/15/app/getting-started/fonts",
        "https://nextjs.org/docs/15/app/getting-started/metadata-and-og-images",
        "https://nextjs.org/docs/15/app/guides/environment-variables",
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://nextjs.org/docs/15/app/guides/authentication",
        "https://web.dev/articles/vitals",
        "https://nextjs.org/docs/15/app/api-reference/components/image"
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
        "concept": "A releasable artifact has build, runtime, user-flow, performance, and recovery evidence.",
        "prediction": {
          "prompt": "Which evidence is stronger before release?",
          "options": [
            "A successful production build plus critical success and failure smoke flows",
            "A development-mode screenshot alone"
          ],
          "correctAnswer": "A successful production build plus critical success and failure smoke flows",
          "feedbackCorrect": "This evidence crosses build and runtime boundaries and observes real route behavior.",
          "feedbackWrong": "Development mode does not prove production build, configuration, cache, or recovery behavior."
        },
        "synthesis": "Build, configure, smoke, measure, observe, and recover."
      }
    ],
    "miniProject": {
      "title": "Write a deployment smoke plan",
      "scenario": "Write a release plan for one authenticated, data-backed route and its primary image.",
      "acceptance": [
        "The target runtime and server-only configuration are explicit",
        "Success, denied, empty, and unexpected-failure smoke flows are named",
        "Performance and error signals have owners, thresholds, and a rollback response"
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
      "scenario": "A 500-row expandable inventory feels slow on a representative low-end phone. Details should load only after expansion, and every row must remain usable by keyboard and screen-reader users. Measure first, then improve the largest confirmed cost.",
      "constraints": [
        "Keep all 500 records available because pagination is outside the product scope",
        "Record a baseline trace and a named device or CPU/network profile",
        "Fetch detail data only for an expanded row",
        "Preserve semantic buttons, focus behavior, and expanded-state announcements"
      ],
      "acceptanceCriteria": [
        "The report identifies the measured bottleneck before choosing virtualization, memoization, or data changes",
        "A before/after trace uses the same scenario and shows improvement against a documented budget",
        "Expanding one row exposes independent pending, success, and failure states without blocking other rows",
        "Keyboard and assistive-technology checks cover expansion, focus, and dynamic status feedback"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Record a React Profiler trace and a browser Performance trace for initial render, scroll, and one expansion."
        },
        {
          "stage": 2,
          "text": "If DOM size and list rendering dominate, windowing may help. If unchanged rows rerender, inspect props and context before considering `memo`."
        },
        {
          "stage": 3,
          "text": "Give each row its own detail request state and keep the disclosure button semantic with `aria-expanded` and `aria-controls` where appropriate."
        }
      ],
      "expectedReasoning": "The correct optimization follows the evidence. Windowing addresses excessive mounted rows; `memo` may skip eligible rerenders when props and context are unchanged; lazy detail loading reduces unnecessary data work. These mechanisms solve different costs. Accessibility behavior and a repeated trace are part of the result, not follow-up polish.",
      "commonWrongPaths": [
        "Adding `useMemo` or `memo` everywhere without a trace showing repeated render work",
        "Virtualizing before checking whether network, image, or main-thread work is the actual bottleneck",
        "Fetching all detail payloads before the user expands a row",
        "Replacing semantic buttons with clickable non-interactive elements"
      ],
      "answerExplanation": "Measure one repeatable flow, identify the dominant cost, and choose the matching change. A large mounted list may need windowing; repeated unchanged row work may justify `memo`; detail data should remain lazy. Repeat the same trace and accessibility checks so the team can see both improvement and preserved behavior.",
      "followUpVariation": "The list becomes fast, but searching still blocks input. Which trace would show whether filtering or rendering owns the remaining delay?",
      "sourceLink": "https://react.dev/reference/react/Profiler",
      "sourceLinks": [
        "https://react.dev/reference/react/Profiler",
        "https://react.dev/reference/react/memo",
        "https://web.dev/articles/vitals",
        "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/",
        "https://nextjs.org/docs/app/guides/production-checklist"
      ]
    },
    {
      "slug": "design-auth-flow",
      "title": "Design an Auth Flow Architecture",
      "level": 8,
      "topicFamily": "production",
      "scenario": "Design authentication and authorization for a Next.js application with email/password and OAuth sign-in, admin and member roles, protected reads and mutations, and session continuity across tabs.",
      "constraints": [
        "Describe the trust boundaries and request flow, not only a library name",
        "Use a maintained authentication library unless a documented requirement justifies custom session code",
        "Keep session material server-managed and enforce authorization close to the protected data",
        "Treat cross-tab messages as UI synchronization, never as proof of authorization",
        "Include tests for success, expiry, denial, tampering, and concurrent refresh behavior"
      ],
      "acceptanceCriteria": [
        "The flow identifies credential/OAuth verification, session creation, secure cookie settings, and logout",
        "Server Actions, Route Handlers, and data access check both identity and permission for protected work",
        "Client UI receives only a safe user projection and handles expired sessions without exposing tokens",
        "Any refresh policy has bounded retries and one clear owner for concurrent refreshes",
        "Cross-tab login/logout feedback is tested separately from server authorization"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Draw browser, auth provider, session store or verifier, data access layer, and protected resource as separate boundaries."
        },
        {
          "stage": 2,
          "text": "Use HttpOnly, Secure, and appropriate SameSite cookie settings; keep authorization checks close to the data source."
        },
        {
          "stage": 3,
          "text": "If BroadcastChannel announces login or logout, the next protected request must still prove the server session and role."
        }
      ],
      "expectedReasoning": "Authentication establishes identity; authorization decides whether that identity may perform a specific action. Middleware or request-boundary redirects can improve navigation, but protected Server Functions, Route Handlers, and data reads must verify the session and permission close to the resource. HttpOnly cookies reduce client token exposure, while cross-tab events only refresh UI state.",
      "commonWrongPaths": [
        "Relying on hidden buttons or client redirects as authorization",
        "Storing long-lived session or access tokens in localStorage",
        "Trusting a role sent by the client without checking server-side data",
        "Allowing several simultaneous refresh attempts without a bounded coordination policy"
      ],
      "answerExplanation": "Use a maintained auth solution, create and verify the server-managed session, and centralize protected data access with authorization checks. Send the client a minimal safe view of the user. Cross-tab messages can prompt the UI to refresh, but every protected request must independently pass server checks.",
      "followUpVariation": "A mobile client will use the same backend. Which session transport changes, and which server authorization checks stay identical?",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/authentication",
        "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
        "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
        "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
        "https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel",
        "https://nextjs.org/docs/app/guides/authentication",
        "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/authentication"
    },
    {
      "slug": "investigate-slow-page",
      "title": "Investigate a Slow Page Load",
      "level": 9,
      "topicFamily": "production",
      "scenario": "Users report that a product page is slow on mobile. It includes a hero image, product data, many reviews, related products, and a recently viewed widget. Diagnose from browser traces, field data, and server logs before reading implementation details.",
      "constraints": [
        "Use one reproducible device, network, and navigation scenario",
        "Write at least three competing hypotheses and the evidence that would support or reject each one",
        "Include server response time, network waterfall, LCP, INP or long-task evidence, and layout stability where relevant",
        "Prioritize experiments by expected user impact, confidence, effort, and risk"
      ],
      "acceptanceCriteria": [
        "Every hypothesis names a measurement and an observable signature",
        "The plan distinguishes server delay, transfer delay, main-thread work, image work, and rendering cost",
        "One change is tested at a time and compared with the same baseline scenario",
        "The conclusion includes low-end devices, slow networks, error paths, and field monitoring after release"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start with the waterfall and server logs: is time spent before the first byte, in sequential requests, or transferring large resources?"
        },
        {
          "stage": 2,
          "text": "Use the Performance panel to find the LCP element, long main-thread tasks, hydration work, and layout shifts."
        },
        {
          "stage": 3,
          "text": "Possible fixes include right-sized images, parallel server reads, a smaller client graph, review pagination or windowing, and a Suspense boundary—but only choose a fix supported by evidence."
        }
      ],
      "expectedReasoning": "A slow page can have several independent causes. TTFB and server logs test backend delay; the waterfall tests sequential or oversized resources; LCP attribution tests the main content image or text; long tasks and INP test responsiveness; DOM and React traces test rendering or hydration work. The plan should rank hypotheses, run the smallest useful experiment, and compare the same scenario.",
      "commonWrongPaths": [
        "Adding a spinner and calling the page faster without changing the measured delay",
        "Assuming the database is responsible before checking network and main-thread evidence",
        "Changing images, data fetching, and rendering together so the result cannot identify the cause",
        "Using one desktop Lighthouse run as a substitute for representative field data"
      ],
      "answerExplanation": "Build a hypothesis table from evidence. For example, a late large hero may dominate LCP, sequential server reads may delay the response, or review hydration may create long tasks. Apply one targeted change, repeat the trace, and then confirm field signals after release.",
      "followUpVariation": "The lab trace improves but field INP remains poor. Which real interactions and device segments should you investigate next?",
      "sourceLink": "https://nextjs.org/docs/15/app/guides/production-checklist",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://web.dev/articles/vitals",
        "https://web.dev/articles/optimize-lcp",
        "https://web.dev/articles/optimize-inp",
        "https://nextjs.org/docs/app/guides/production-checklist"
      ]
    }
  ],
  "qa": [
    {
      "id": "qa-5",
      "question": "Why is my page loading slowly after deployment but fine in dev?",
      "answer": "Development and production exercise different bundling, caching, image, font, and runtime paths. Reproduce the deployed route with a named device and network profile. Check server timing and the waterfall first, then identify the LCP element, long tasks or INP-related interaction work, layout shifts, client JavaScript, and hydration. Compare with field data when available, change one likely cause, and repeat the same measurement.",
      "followUp": "Which measurement would separate a slow server response from a large LCP image or a long client-side task?",
      "category": "performance",
      "level": "advanced",
      "tags": [
        "production",
        "performance",
        "optimization"
      ],
      "topicId": "production-deployment",
      "topicFamily": "production",
      "sourceLink": "https://nextjs.org/docs/15/app/guides/production-checklist",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://web.dev/articles/vitals"
      ]
    },
    {
      "id": "loop-qa-production-deployment-1",
      "topicId": "production-deployment",
      "topicFamily": "production",
      "question": "What evidence turns a working development route into a releasable production route?",
      "answer": "Use a successful production build, production-like runtime configuration, critical success and failure smoke flows, representative performance measurements, and confirmed error and Web Vitals reporting. Also name the person or system that will respond and the condition for rollback.",
      "followUp": "Which one of those checks is missing for your most important route today?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "production-deployment"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/production-checklist",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://nextjs.org/docs/15/app/getting-started/deploying"
      ]
    },
    {
      "id": "loop-qa-production-deployment-2",
      "topicId": "production-deployment",
      "topicFamily": "production",
      "question": "What is the practical difference between a server-only environment variable and a `NEXT_PUBLIC_` variable?",
      "answer": "Server-only variables are read in the server environment and can hold secrets when they are not passed to the client. A `NEXT_PUBLIC_` variable is inlined into browser JavaScript during `next build`, so it is public and frozen to the build-time value. Runtime public configuration needs an explicit public server response, not a secret variable.",
      "followUp": "If one Docker image is promoted from staging to production, which public values are frozen and which server values can be supplied at runtime?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "production-deployment"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/environment-variables",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/environment-variables"
      ]
    }
  ],
  "practices": [
    {
      "id": "bp-8",
      "title": "Never Expose Secrets to the Client",
      "summary": "Keep secrets in server-only environment variables or a deployment secret store; treat every `NEXT_PUBLIC_` value as public build output.",
      "rationale": "Next.js inlines `NEXT_PUBLIC_` values into browser JavaScript during the build. Anyone who receives the bundle can inspect them, and the values remain frozen when that artifact is promoted.",
      "tradeOffs": "Browser code cannot directly read server secrets. When the browser needs safe runtime configuration, expose a small public value through a deliberate server response.",
      "appliesWhen": "The value grants access, signs data, connects to a private service, or otherwise must stay confidential.",
      "doesNotApplyWhen": "The value is intentionally public and safe to ship, such as a public analytics identifier or public site origin.",
      "example": "`DATABASE_URL` stays server-only. `NEXT_PUBLIC_ANALYTICS_ID` is public and fixed when `next build` runs.",
      "sourceLink": "https://nextjs.org/docs/15/app/guides/environment-variables",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/environment-variables",
        "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html",
        "https://nextjs.org/docs/app/building-your-application/configuring/environment-variables",
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
      "summary": "Enforce authentication and permission checks at the server boundary closest to the protected data or mutation.",
      "rationale": "Client UI and request-boundary redirects can be bypassed or become stale. A protected read, Server Function, or Route Handler must verify the current session and the exact permission before accessing the resource.",
      "tradeOffs": "Authorization appears in server data paths as well as navigation. Centralizing checks in a data access layer or policy helper reduces duplication while keeping the check close to the resource.",
      "appliesWhen": "A user-specific or role-specific read, write, route handler, or Server Function protects non-public data or capability.",
      "doesNotApplyWhen": "The resource and operation are intentionally public and have no permission distinction.",
      "example": "A layout may redirect unauthenticated users early, but `updateInvoice` still verifies the session and invoice permission immediately before the write.",
      "sourceLink": "https://nextjs.org/docs/15/app/guides/authentication#authorization",
      "nextVersion": "15.5.20",
      "tags": [
        "production",
        "security",
        "auth"
      ],
      "topicId": "production-deployment",
      "topicFamily": "production",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/authentication#authorization",
        "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
        "https://nextjs.org/docs/app/guides/authentication"
      ]
    }
  ],
  "meta": {
    "topicFamily": "production",
    "level": "advanced",
    "title": "Production & Deployment"
  }
};
