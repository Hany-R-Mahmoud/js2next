import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "deep-dive-production-concerns",
  "lesson": {
    "slug": "deep-dive-production-concerns",
    "title": "Deep Dive: Auth Concepts, Security, Performance & Deploy",
    "topicFamily": "production",
    "level": "advanced",
    "prerequisites": [
      "deep-dive-nextjs-data"
    ],
    "learningObjectives": [
      "Separate authentication, session management, and authorization",
      "Enforce validation and permission checks at every protected server operation",
      "Keep secrets server-only and treat public environment variables as shipped code",
      "Measure accessibility, performance, errors, and deployment recovery before release"
    ],
    "whyMatters": "Production quality is a chain of trust and evidence. A route can look polished while a direct request bypasses its UI, a secret reaches the browser, motion excludes a user, or a release has no useful failure signal or rollback decision.",
    "estimatedMinutes": 46,
    "sections": [
      {
        "id": "deep-dive-production-concerns-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "Authentication answers “who is making this request?” A session carries that identity between requests. Authorization answers “may this user perform this exact action on this exact resource?” The UI can hide unavailable actions for clarity, but the server operation that reads or changes protected data must enforce the permission.\n\nProduction readiness adds evidence: secrets stay server-only, public configuration is intentionally public, critical interactions work with keyboard and motion preferences, important pages meet a stated performance budget, errors are observable, and the team knows when and how to roll back."
      },
      {
        "id": "deep-dive-production-concerns-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "A Server Function, Route Handler, and data-access function can all be called with attacker-controlled input. Parse the input, obtain the current session, authorize the resource and action, then perform the operation. Avoid relying only on a layout or request redirect: those can improve navigation, but the protected operation remains the trustworthy enforcement point.\n\nEnvironment variables without `NEXT_PUBLIC_` are available to server code and remain secret only if they are not exposed in output or passed to the client. `NEXT_PUBLIC_` values are inlined into browser JavaScript at build time, so treat them as public and fixed for that build. Measure Core Web Vitals and route errors in production-like and field conditions; development behavior is not release evidence."
      },
      {
        "id": "deep-dive-production-concerns-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "A browser is an untrusted client. Hidden controls, client validation, and middleware-style redirects can all be bypassed by a direct request. Repeating a permission check at the protected data boundary prevents a stale UI or alternate caller from granting access.\n\nPerformance and accessibility also need explicit constraints. An autoplay carousel can create motion discomfort, keyboard traps, delayed largest content, and layout shifts even when it looks smooth on one developer device. A useful release decision combines user behavior, measurements, failure telemetry, and a recovery plan."
      },
      {
        "id": "deep-dive-production-concerns-example",
        "type": "code-example",
        "title": "Server-side authorization shape",
        "content": "This server operation validates identity and resource permission immediately before the write. A redirect in the UI may still help navigation, but it is not the enforcement shown here.",
        "code": "'use server';\n\nexport async function deleteProject(projectId: string) {\n  const session = await requireSession();\n  const project = await getProject(projectId);\n\n  if (!project || project.ownerId !== session.user.id) {\n    throw new Error('Not authorized');\n  }\n\n  await removeProject(project.id);\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/projects/actions.ts"
      },
      {
        "id": "deep-dive-production-concerns-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-production-concerns-question",
            "question": "A project page hides Delete for non-owners and redirects signed-out users in a parent layout. Where must the final delete permission still be enforced?",
            "options": [
              "Inside the server operation or data-access boundary that deletes the project",
              "Only in the button visibility condition",
              "Only in the parent layout redirect",
              "In a CSS selector that disables pointer events"
            ],
            "correctAnswer": "Inside the server operation or data-access boundary that deletes the project",
            "expectedReasoning": "The server operation is the trusted boundary that performs the protected write and can verify the current caller against the resource. UI hiding and navigation redirects improve experience but can be bypassed. CSS changes presentation, not permission."
          }
        ]
      },
      {
        "id": "deep-dive-production-concerns-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Establish identity, authorize the exact resource operation, and keep secrets on the server. Then define release evidence: accessible behavior, production-build smoke flows, Core Web Vitals, error reporting, ownership, and rollback conditions. Security and production readiness are not one check at the edge; they are explicit boundaries throughout the feature."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-production-concerns-prediction",
        "title": "Predict the boundary",
        "concept": "Authentication identifies a caller; authorization decides whether that caller may perform one protected operation.",
        "prediction": {
          "prompt": "A signed-in user submits another user’s project ID to a Server Function. What must happen?",
          "options": [
            "The server verifies resource permission and denies the write",
            "The server trusts the ID because the user is signed in",
            "The hidden UI button is enough"
          ],
          "correctAnswer": "The server verifies resource permission and denies the write",
          "feedbackCorrect": "A valid identity does not imply permission for every resource.",
          "feedbackWrong": "Authentication proves who called; authorization must still compare that caller with the requested operation and resource."
        },
        "synthesis": "Authorize as close as practical to the protected read or write."
      },
      {
        "id": "deep-dive-production-concerns-failure-mode",
        "title": "Name the failure mode",
        "concept": "A release decision needs user-facing constraints, measurements, ownership, and recovery.",
        "prediction": {
          "prompt": "A carousel meets visual design but ignores reduced-motion preference and delays the LCP image. Is it production-ready?",
          "options": [
            "No; accessibility and measured performance requirements are unmet",
            "Yes; visual approval is sufficient",
            "Yes; framework defaults guarantee both outcomes"
          ],
          "correctAnswer": "No; accessibility and measured performance requirements are unmet",
          "feedbackCorrect": "The interaction must respect the user preference and meet measured page goals.",
          "feedbackWrong": "Visual review and framework defaults do not replace accessibility behavior or representative measurements."
        },
        "synthesis": "Ship when the named constraints and recovery checks have evidence."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Auth Concepts, Security, Performance & Deploy",
      "scenario": "Prepare a protected project dashboard and an animated marketing route for production release.",
      "acceptance": [
        "Every protected read and write authenticates and authorizes at the server boundary",
        "Secrets remain server-only and public build-time values are documented as public",
        "Keyboard and reduced-motion behavior are verified on the animated route",
        "Production smoke flows, Web Vitals, error reporting, owner, and rollback trigger are named"
      ],
      "rubric": [
        {
          "dimension": "Model",
          "evidence": "The implementation demonstrates: Separate authentication from authorization."
        },
        {
          "dimension": "Boundary",
          "evidence": "The explanation identifies the ownership or lifecycle boundary for auth concepts, security, performance & deploy."
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
          "role": "Auth Concepts, Security, Performance & Deploy"
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
    "retrievalPrompt": "Trace one protected user action from sign-in through authorization, mutation, response, performance measurement, deployment signal, and rollback. Name the owner of every check.",
    "reflectionPrompt": "Choose one critical route. What can an unauthenticated or unauthorized caller attempt, which secrets and public values exist, and which production signals would trigger intervention?",
    "masteryCriteria": [
      "Can distinguish identity from permission for a specific operation",
      "Places authorization beside the protected data read or write",
      "Can explain why client UI and public environment variables are not security boundaries",
      "Defines accessible interaction, performance evidence, monitoring, and rollback checks"
    ],
    "nextTopics": [
      "deep-dive-architecture-decisions"
    ],
    "metadata": {
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/app/building-your-application/authentication",
        "https://nextjs.org/docs/15/app/guides/authentication",
        "https://nextjs.org/docs/15/app/guides/environment-variables",
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://nextjs.org/docs/15/app/getting-started/deploying",
        "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
        "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html",
        "https://web.dev/articles/vitals"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-prod-7",
      "title": "Deep Challenge: Perf + a11y constraint challenge",
      "level": 7,
      "topicFamily": "production",
      "scenario": "Marketing requests an autoplay product carousel as the homepage hero. Design safeguards that respect motion and keyboard users while protecting the page’s largest-content and layout budget.",
      "constraints": [
        "Respect `prefers-reduced-motion` and provide user control",
        "Keep controls keyboard-operable with visible focus and meaningful names",
        "Reserve media space and measure the real LCP element"
      ],
      "acceptanceCriteria": [
        "Reduced-motion users receive no automatic motion or a clearly reduced alternative",
        "Previous, next, pause, and slide content follow a documented keyboard and focus model",
        "The hero image has explicit sizing, responsive `sizes`, and no avoidable layout shift",
        "A production-like measurement and an observable fallback for script or media failure are included"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write behavior for motion-reduced, keyboard-only, and script-failure cases before choosing animation code."
        },
        {
          "stage": 2,
          "text": "Use native buttons, visible focus, clear names, and a pause control; do not move focus on every automatic slide."
        },
        {
          "stage": 3,
          "text": "Measure which element is actually LCP and reserve image dimensions so the layout remains stable."
        }
      ],
      "expectedReasoning": "The carousel is an interaction and performance decision, not only animation. Motion preference and keyboard behavior define accessibility. Explicit image space and representative measurement define performance. A static first slide provides a useful baseline and failure fallback.",
      "commonWrongPaths": [
        "Only reducing animation duration without honoring the motion preference",
        "Making slide containers clickable instead of providing named controls",
        "Assuming image optimization alone proves a good LCP result"
      ],
      "answerExplanation": "Start with a stable, meaningful hero. Add opt-in or controllable motion, semantic controls, and measured image behavior. Verify the full experience with keyboard, reduced-motion emulation, and a production-like performance profile.",
      "followUpVariation": "The carousel is removed after field data shows poor engagement. Which simpler hero preserves content and measurement goals?",
      "checkType": "free-text",
      "prompt": "List three concrete safeguards before shipping the carousel.",
      "freeTextKeywords": [
        "motion",
        "keyboard",
        "image"
      ],
      "sourceLink": "https://nextjs.org/docs/app/guides/production-checklist",
      "sourceLinks": [
        "https://nextjs.org/docs/app/guides/production-checklist",
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://nextjs.org/docs/15/app/api-reference/components/image",
        "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html",
        "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html",
        "https://web.dev/articles/vitals"
      ]
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-production-concerns-question",
      "question": "Where must authorization be enforced?",
      "answer": "Enforce authorization inside the server operation or data-access boundary that performs the protected read or write. UI conditions and redirects may improve navigation, but they cannot stop a caller from constructing a direct request.",
      "followUp": "What resource and action must this operation compare with the current user?",
      "category": "performance",
      "level": "advanced",
      "topicId": "deep-dive-production-concerns",
      "topicFamily": "production",
      "tags": [
        "learn-react-bridge",
        "production"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/authentication",
      "sourceLinks": [
        "https://nextjs.org/docs/app/building-your-application/authentication",
        "https://nextjs.org/docs/15/app/guides/authentication#authorization",
        "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
      ]
    },
    {
      "id": "loop-qa-deep-dive-production-concerns-1",
      "topicId": "deep-dive-production-concerns",
      "topicFamily": "production",
      "question": "What evidence belongs in a production-readiness review?",
      "answer": "Include a production build, representative success and failure smoke flows, server-side permission tests, secret and public-configuration review, keyboard and motion checks, measured Web Vitals, error reporting, an owner, and a rollback trigger.",
      "followUp": "Which missing signal would make your team slowest to diagnose a failed release?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "deep-dive-production-concerns"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/authentication",
      "sourceLinks": [
        "https://nextjs.org/docs/app/building-your-application/authentication",
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://nextjs.org/docs/15/app/getting-started/deploying",
        "https://web.dev/articles/vitals"
      ]
    },
    {
      "id": "loop-qa-deep-dive-production-concerns-2",
      "topicId": "deep-dive-production-concerns",
      "topicFamily": "production",
      "question": "Why are client UI checks and server authorization both useful but different?",
      "answer": "The UI can explain availability early and avoid offering an action the current user cannot use. The server must independently validate and authorize because a client can be modified or bypassed. Experience belongs in both places; enforcement belongs at the protected server operation.",
      "followUp": "How will your denied-path test call the server boundary without using the normal button?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "deep-dive-production-concerns"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/authentication",
      "sourceLinks": [
        "https://nextjs.org/docs/app/building-your-application/authentication",
        "https://nextjs.org/docs/15/app/guides/authentication",
        "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
      ]
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "production",
    "level": "advanced",
    "title": "Deep Dive: Auth Concepts, Security, Performance & Deploy"
  }
};
