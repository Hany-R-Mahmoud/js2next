import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "deep-dive-nextjs-foundations",
  "lesson": {
    "slug": "deep-dive-nextjs-foundations",
    "title": "Deep Dive: Next.js App Router Foundations",
    "topicFamily": "nextjs-foundations",
    "level": "intermediate",
    "prerequisites": [
      "deep-dive-react-mental-model"
    ],
    "learningObjectives": [
      "Read an App Router folder tree as nested URL and UI segments",
      "Place shared UI in layouts and route-specific UI in pages",
      "Use loading, error, and not-found boundaries at the segment that owns recovery",
      "Choose dynamic segments and navigation behavior deliberately"
    ],
    "whyMatters": "In the App Router, folders and special files form both the URL tree and the user’s loading and recovery experience. A clear segment boundary keeps shared UI stable while each route owns the work and failures that belong to it.",
    "estimatedMinutes": 38,
    "sections": [
      {
        "id": "deep-dive-nextjs-foundations-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "The `app` folder is a tree. A folder is a route segment, but it becomes publicly reachable only when a `page.tsx` or `route.ts` file exposes it. A `layout.tsx` wraps the pages and nested layouts below that segment. During client navigation between children, the shared layout can preserve its UI and state.\n\nSpecial files define local behavior. `loading.tsx` provides an immediate fallback while the segment’s content streams. `error.tsx` provides a client-side recovery boundary for errors below it. `not-found.tsx` handles a missing resource after `notFound()` or an unmatched route. Place each file where its message and retry action make sense."
      },
      {
        "id": "deep-dive-nextjs-foundations-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "Pages and layouts are Server Components by default. A page receives route input such as `params` and `searchParams`; in Next.js 15 these values are Promises, so an async page awaits them before use. A folder such as `[projectId]` creates a dynamic segment whose value belongs to route identity. Route groups such as `(marketing)` organize routes without changing the URL, while private folders such as `_components` make implementation intent explicit.\n\n`loading.tsx` automatically wraps the segment page and descendants in a Suspense boundary. `error.tsx` must be a Client Component because it receives an error and a `reset` function. An error in a layout is caught by an error boundary in a parent segment, not by the boundary beside that same layout."
      },
      {
        "id": "deep-dive-nextjs-foundations-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "A route tree gives each level a clear job. Shared navigation belongs in a layout because sibling pages should not rebuild or own it. A slow data region belongs below a loading boundary so the rest of the route can stay usable. A recoverable error belongs at the smallest segment that can explain the failure and retry safely. Putting every concern in the root makes messages vague and turns a local problem into an app-wide interruption."
      },
      {
        "id": "deep-dive-nextjs-foundations-example",
        "type": "code-example",
        "title": "Route-scoped loading UI",
        "content": "This tree keeps dashboard navigation shared while the project page owns its loading and error experience. The dynamic project ID is route input, not duplicated client state.",
        "code": "app/\n  dashboard/\n    layout.tsx              // shared dashboard navigation\n    projects/\n      [projectId]/\n        page.tsx            // await params, render the project\n        loading.tsx         // project-specific fallback\n        error.tsx           // project retry UI\n        not-found.tsx       // missing project message",
        "codeLanguage": "text",
        "codeFilePath": "app/dashboard/projects/[projectId]/"
      },
      {
        "id": "deep-dive-nextjs-foundations-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-nextjs-foundations-question",
            "question": "A billing page and profile page share account navigation, but only billing has a slow request. Where is the clearest loading boundary?",
            "options": [
              "Put `layout.tsx` in the account segment and `loading.tsx` in the billing segment",
              "Put both the layout and loading UI only at the application root",
              "Replace both pages with one Route Handler",
              "Store the loading state in a module variable shared by every request"
            ],
            "correctAnswer": "Put `layout.tsx` in the account segment and `loading.tsx` in the billing segment",
            "expectedReasoning": "The account layout owns UI shared by both pages, while the billing segment owns its slow work and fallback. A root fallback would hide unrelated UI, a Route Handler does not replace page composition, and module state is not a request-safe loading boundary."
          }
        ]
      },
      {
        "id": "deep-dive-nextjs-foundations-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Read the App Router as nested ownership. Layouts own shared UI, pages own route output, dynamic folders describe route identity, and loading, error, and not-found files own local feedback. Place each boundary at the smallest segment that can give the user accurate context and a useful next action."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-nextjs-foundations-prediction",
        "title": "Predict the boundary",
        "concept": "A route segment owns a URL level, its page output, and the loading or recovery UI placed inside it.",
        "prediction": {
          "prompt": "Navigation moves between two child pages under the same layout. Which UI is intended to remain shared?",
          "options": [
            "The parent layout",
            "A separate root loading fallback",
            "An unrelated Route Handler"
          ],
          "correctAnswer": "The parent layout",
          "feedbackCorrect": "The layout wraps both children and provides their shared UI boundary.",
          "feedbackWrong": "A loading file supplies fallback UI and a Route Handler serves requests; neither replaces the shared layout."
        },
        "synthesis": "Place shared UI above the child pages that use it."
      },
      {
        "id": "deep-dive-nextjs-foundations-failure-mode",
        "title": "Name the failure mode",
        "concept": "Recovery is clearest when the boundary is close to the work it can explain and retry.",
        "prediction": {
          "prompt": "A project detail request fails while dashboard navigation can still work. Which scope is most helpful?",
          "options": [
            "A project-segment error boundary with retry",
            "An app-wide blank screen",
            "No visible error because the console has details"
          ],
          "correctAnswer": "A project-segment error boundary with retry",
          "feedbackCorrect": "The user keeps useful surrounding UI and receives a recovery action for the failed segment.",
          "feedbackWrong": "A local failure should not remove healthy UI or remain invisible to the user."
        },
        "synthesis": "Match the error message and retry action to the owning segment."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Next.js App Router Foundations",
      "scenario": "Design an account route with profile and billing children, a dynamic invoice page, and route-scoped feedback.",
      "acceptance": [
        "Shared account navigation lives in the account layout",
        "The invoice page awaits its dynamic route input",
        "Billing and invoice work have appropriately scoped loading UI",
        "Missing invoices and recoverable request failures produce different user outcomes"
      ],
      "rubric": [
        {
          "dimension": "Model",
          "evidence": "The implementation demonstrates: Organize route segments."
        },
        {
          "dimension": "Boundary",
          "evidence": "The explanation identifies the ownership or lifecycle boundary for next.js app router foundations."
        },
        {
          "dimension": "Verification",
          "evidence": "A failure state and an observable test are included."
        }
      ]
    },
    "diagram": {
      "title": "Model → boundary → observable outcome",
      "kind": "flow",
      "nodes": [
        {
          "id": "model",
          "label": "Core model",
          "role": "Next.js App Router Foundations"
        },
        {
          "id": "boundary",
          "label": "Explicit boundary",
          "role": "Where ownership and policy live"
        },
        {
          "id": "outcome",
          "label": "Observable outcome",
          "role": "What a learner or user can verify"
        }
      ],
      "edges": [
        {
          "from": "model",
          "to": "boundary",
          "label": "guides the decision"
        },
        {
          "from": "boundary",
          "to": "outcome",
          "label": "makes behavior testable"
        }
      ]
    },
    "retrievalPrompt": "Given a dashboard with account and billing pages, draw the segment tree and place the shared layout, page, loading, error, and not-found files. Explain which users each boundary affects.",
    "reflectionPrompt": "Choose one current route. Which UI is shared, which work can suspend, which failure is recoverable, and which folder should own each boundary?",
    "masteryCriteria": [
      "Can translate folders and special files into a route tree",
      "Can explain when a layout is shared across child navigation",
      "Places loading and error UI at a deliberate recovery scope",
      "Can use a dynamic segment without mixing route identity with local UI state"
    ],
    "nextTopics": [
      "deep-dive-rsc-boundaries"
    ],
    "metadata": {
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/app/building-your-application/routing",
        "https://nextjs.org/docs/app/getting-started/layouts-and-pages",
        "https://nextjs.org/docs/15/app/getting-started/project-structure",
        "https://nextjs.org/docs/15/app/getting-started/layouts-and-pages",
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating",
        "https://nextjs.org/docs/15/app/getting-started/loading-ui-and-streaming",
        "https://nextjs.org/docs/15/app/getting-started/error-handling"
      ]
    }
  },
  "challenges": [
    {
      "slug": "loop-deep-dive-nextjs-foundations",
      "title": "Apply Deep Dive: Next.js App Router Foundations",
      "level": 2,
      "topicFamily": "nextjs-foundations",
      "scenario": "A dashboard currently uses one root spinner and one root error message for projects, billing, and settings. Redesign the route tree so shared navigation remains available and each feature owns accurate loading and recovery UI.",
      "constraints": [
        "Keep shared dashboard navigation in a layout",
        "Use a dynamic project segment for project identity",
        "Give slow or fallible feature work a deliberate segment boundary"
      ],
      "acceptanceCriteria": [
        "The proposed tree names every `layout`, `page`, `loading`, `error`, and `not-found` file used",
        "A project failure does not remove healthy dashboard navigation",
        "A missing project is distinguished from a temporary request failure",
        "The explanation identifies which boundary can retry each failure"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Draw folders first. Mark the lowest common segment that owns dashboard navigation."
        },
        {
          "stage": 2,
          "text": "Put the project ID in `[projectId]`, then place project-specific fallback and recovery files beside its page."
        },
        {
          "stage": 3,
          "text": "Use `notFound()` for an absent resource and an error boundary with `reset()` for a retryable failure."
        }
      ],
      "expectedReasoning": "The shared layout belongs above its sibling pages. Each feature segment owns its slow work and recoverable failures. The dynamic project segment owns project identity, while missing data and temporary failure need different messages and actions.",
      "commonWrongPaths": [
        "Keeping every fallback at the root even when only one feature is affected",
        "Copying the dynamic project ID into unrelated global state",
        "Treating a missing project and a temporary server error as the same outcome"
      ],
      "answerExplanation": "Build the route tree from shared UI downward, then place feedback beside the work it describes. This preserves useful layout UI and gives each failure an accurate recovery path.",
      "followUpVariation": "Add a marketing route group that must not change public URLs. Where does the group belong, and which layout does it use?",
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/routing",
      "sourceLinks": [
        "https://nextjs.org/docs/app/building-your-application/routing",
        "https://nextjs.org/docs/15/app/getting-started/project-structure",
        "https://nextjs.org/docs/15/app/getting-started/layouts-and-pages",
        "https://nextjs.org/docs/15/app/getting-started/error-handling"
      ]
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-nextjs-foundations-question",
      "question": "Why place the billing loading file below the shared account layout?",
      "answer": "The account layout can remain useful while only the billing segment shows its fallback. This matches the feedback to the work that is actually pending instead of replacing unrelated route UI.",
      "followUp": "Which parent layout should remain visible if the billing request fails?",
      "category": "nextjs",
      "level": "intermediate",
      "topicId": "deep-dive-nextjs-foundations",
      "topicFamily": "nextjs-foundations",
      "tags": [
        "learn-react-bridge",
        "nextjs-foundations"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/routing",
      "sourceLinks": [
        "https://nextjs.org/docs/app/building-your-application/routing",
        "https://nextjs.org/docs/15/app/getting-started/layouts-and-pages",
        "https://nextjs.org/docs/15/app/getting-started/loading-ui-and-streaming"
      ]
    },
    {
      "id": "loop-qa-deep-dive-nextjs-foundations-1",
      "topicId": "deep-dive-nextjs-foundations",
      "topicFamily": "nextjs-foundations",
      "question": "How do special App Router files divide responsibility?",
      "answer": "`layout` owns shared UI, `page` exposes route UI, `loading` owns a segment fallback, `error` owns recoverable failures below it, `not-found` owns a missing-resource outcome, and `route` owns a request endpoint. Their folder level determines their scope.",
      "followUp": "Which one of your current root boundaries could move closer to the feature it describes?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-nextjs-foundations"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/routing",
      "sourceLinks": [
        "https://nextjs.org/docs/app/building-your-application/routing",
        "https://nextjs.org/docs/15/app/getting-started/project-structure",
        "https://nextjs.org/docs/15/app/getting-started/error-handling"
      ]
    },
    {
      "id": "loop-qa-deep-dive-nextjs-foundations-2",
      "topicId": "deep-dive-nextjs-foundations",
      "topicFamily": "nextjs-foundations",
      "question": "What makes a useful App Router segment boundary?",
      "answer": "It groups one level of route identity and the UI, work, loading, and recovery behavior that change together. Shared concerns stay in a parent layout; feature-specific concerns move down to the feature segment.",
      "followUp": "What user-visible behavior proves your chosen boundary is neither too broad nor too narrow?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-nextjs-foundations"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/routing",
      "sourceLinks": [
        "https://nextjs.org/docs/app/building-your-application/routing",
        "https://nextjs.org/docs/15/app/getting-started/layouts-and-pages"
      ]
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "nextjs-foundations",
    "level": "intermediate",
    "title": "Deep Dive: Next.js App Router Foundations"
  }
};
