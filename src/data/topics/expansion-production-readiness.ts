import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "expansion-production-readiness",
  "lesson": {
    "slug": "expansion-production-readiness",
    "title": "Prepare a Next.js App for Production",
    "topicFamily": "production",
    "level": "advanced",
    "prerequisites": [
      "expansion-performance-diagnosis",
      "expansion-authorization-boundaries"
    ],
    "learningObjectives": [
      "Verify the built application with the same runtime and configuration model used in production",
      "Separate server-only secrets from values intentionally shipped to the browser",
      "Test cache freshness, protected mutations, failure recovery, and operational signals before release",
      "Define a gradual release, verification owner, and reversible rollback decision"
    ],
    "whyMatters": "A page working in `next dev` proves only the development path. Production confidence comes from checking the built artifact, deployment runtime, configuration, data freshness, security, failures, signals, and recovery as one release contract.",
    "estimatedMinutes": 42,
    "sections": [
      {
        "id": "expansion-production-readiness-model",
        "type": "concept",
        "title": "Review the whole runtime",
        "content": "Start with the deployment target: does it provide the server runtime, persistence, network access, and scaling behavior the feature needs? Build the exact application line, start it with production-like configuration, and smoke the user paths that matter. A public page, protected route, data read, mutation, and error recovery often exercise different boundaries.\n\nClassify configuration deliberately. Server-only secrets stay in server code. Values prefixed for browser exposure must be safe for anyone to read and may be inlined at build time. Verify the app’s cache and revalidation promises with real change events, inspect safe logs or metrics, and decide before release who can pause or roll back and which signal should trigger that decision."
      },
      {
        "id": "expansion-production-readiness-code",
        "type": "code-example",
        "title": "Keep configuration explicit",
        "content": "Read required internal configuration only in server code and fail with a clear operational error that does not print the secret. A health or smoke check can detect the missing value before user traffic reaches the feature.",
        "code": "function requiredServerEnv(name: 'INTERNAL_API_URL'): string {\n  const value = process.env[name];\n  if (!value) throw new Error(`${name} is not configured`);\n  return value;\n}\n\nexport async function loadProjects() {\n  const response = await fetch(`${requiredServerEnv('INTERNAL_API_URL')}/projects`);\n  if (!response.ok) throw new Error(`Projects request failed: ${response.status}`);\n  return response.json();\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "lib/server/projects.ts"
      },
      {
        "id": "expansion-production-readiness-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-production-readiness-check",
            "question": "Which evidence most strongly supports releasing a protected, cached project feature?",
            "options": [
              "The production build starts with production-like config, and smoke tests cover access, mutation, freshness, failure, signals, and rollback",
              "One page renders in next dev",
              "Every environment value is renamed with NEXT_PUBLIC_",
              "All caching is disabled without checking the freshness requirement"
            ],
            "correctAnswer": "The production build starts with production-like config, and smoke tests cover access, mutation, freshness, failure, signals, and rollback",
            "expectedReasoning": "The first choice exercises the boundaries that differ after deployment. Development rendering is narrower evidence, public prefixes expose values rather than securing them, and disabling all caching replaces an explicit product policy with a broad workaround."
          }
        ]
      },
      {
        "id": "expansion-production-readiness-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Treat release as an evidence loop: build the intended artifact, supply validated configuration, smoke critical success and failure paths, verify freshness and protected operations, inspect safe signals, and observe the release window. If the agreed threshold fails, use the named reversible mitigation or rollback and verify recovery with the same smoke flow."
      }
    ],
    "retrievalPrompt": "Trace a protected data feature through build, runtime configuration, smoke checks, cache freshness, failure signals, deployment verification, and rollback.",
    "reflectionPrompt": "Choose an upcoming release. Which missing value, stale read, denied mutation, service failure, or deployment signal could surprise the team after shipping?",
    "masteryCriteria": [
      "Can distinguish local development evidence from a production-like build and runtime",
      "Can classify environment values as server-only or intentionally public",
      "Can verify protected routes, mutations, freshness, failure, and observability",
      "Can name the release owner, success window, rollback trigger, and reversible action"
    ],
    "nextTopics": [
      "deep-dive-production-concerns"
    ],
    "diagram": {
      "title": "Release evidence loop",
      "kind": "flow",
      "nodes": [
        {
          "id": "build",
          "label": "Build",
          "role": "Production artifact"
        },
        {
          "id": "configure",
          "label": "Configure",
          "role": "Runtime values"
        },
        {
          "id": "smoke",
          "label": "Smoke",
          "role": "Critical routes and failures"
        },
        {
          "id": "observe",
          "label": "Observe",
          "role": "Logs and signals"
        },
        {
          "id": "recover",
          "label": "Recover",
          "role": "Rollback path"
        }
      ],
      "edges": [
        {
          "from": "build",
          "to": "configure"
        },
        {
          "from": "configure",
          "to": "smoke"
        },
        {
          "from": "smoke",
          "to": "observe"
        },
        {
          "from": "observe",
          "to": "recover"
        }
      ]
    },
    "chunks": [
      {
        "id": "expansion-production-readiness-chunk-1",
        "title": "Find the missing evidence",
        "concept": "Production readiness joins artifact, runtime, configuration, data policy, failure behavior, observability, and recovery.",
        "prediction": {
          "prompt": "A server secret is missing only in the deployment environment. Which check should catch it before broad traffic?",
          "options": [
            "Production-like startup or smoke validation of required server configuration",
            "A browser bundle that prints all environment values",
            "A local screenshot"
          ],
          "correctAnswer": "Production-like startup or smoke validation of required server configuration",
          "feedbackCorrect": "The check runs at the boundary that consumes the server-only value and fails before the feature serves traffic.",
          "feedbackWrong": "Browser exposure leaks configuration, while local rendering does not prove the deployed runtime has the value."
        },
        "synthesis": "Verify each release assumption at the boundary where it can fail."
      }
    ],
    "miniProject": {
      "title": "Write a release plan",
      "scenario": "Write a release plan for a protected project dashboard with cached lists, an edit action, an internal API, and a recoverable error boundary.",
      "acceptance": [
        "The deployment runtime and all required server/public configuration are classified",
        "Smoke checks cover owner access, denied access, successful edit, stale-data refresh, and service failure recovery",
        "Safe logs or metrics and a release observation window have named owners",
        "A measurable rollback trigger and reversible action are rehearsed"
      ],
      "rubric": [
        {
          "dimension": "Runtime",
          "evidence": "The production artifact and deployment target satisfy the feature’s server requirements."
        },
        {
          "dimension": "Evidence",
          "evidence": "Success, denial, freshness, and failure checks produce observable results."
        },
        {
          "dimension": "Recovery",
          "evidence": "Owner, threshold, mitigation, rollback, and post-rollback verification are explicit."
        }
      ]
    },
    "metadata": {
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://nextjs.org/docs/15/app/guides/self-hosting",
        "https://nextjs.org/docs/15/app/guides/environment-variables",
        "https://nextjs.org/docs/15/app/getting-started/deploying"
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-audit-production-release",
      "title": "Audit a Production Release",
      "level": 9,
      "topicFamily": "production",
      "scenario": "A protected Next.js project dashboard works in development. It reads an internal API, caches project lists, writes through a Server Function, and has an error boundary. Audit the release before traffic is enabled.",
      "constraints": [
        "Use Next.js 15.5.20 production behavior and the real deployment runtime model",
        "Keep secrets server-only and classify intentionally public values",
        "Verify authorization, freshness, failure recovery, and safe signals",
        "Define a gradual release, owner, observation window, and rollback trigger"
      ],
      "acceptanceCriteria": [
        "The built app starts with required configuration and fails clearly when a required server value is absent",
        "Owner and non-owner smoke tests exercise the protected read and mutation",
        "A successful edit produces the documented cache freshness outcome",
        "An internal API failure reaches useful recovery UI and safe operational evidence",
        "The release has a measurable success threshold and reversible rollback step"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "List the deployment capabilities and configuration each route, data read, and mutation requires."
        },
        {
          "stage": 2,
          "text": "Run one happy path, one denial, one stale-data change, and one service failure against the built app."
        },
        {
          "stage": 3,
          "text": "Name who watches which signal, for how long, and what action occurs when the threshold fails."
        }
      ],
      "expectedReasoning": "A production release is safe when its assumptions are exercised in the built runtime. The audit covers configuration, protected operations, cache behavior, failure recovery, and observable release decisions rather than relying on a local success path.",
      "commonWrongPaths": [
        "Testing only with next dev",
        "Moving a secret into a NEXT_PUBLIC_ variable",
        "Disabling all caches instead of verifying a freshness contract",
        "Shipping without an owner, observation window, or rollback threshold"
      ],
      "answerExplanation": "Build and start the intended app, validate server/public configuration, smoke success and failure boundaries, verify authorization and freshness, observe safe signals, and use a rehearsed rollback when the agreed threshold fails.",
      "followUpVariation": "The target cannot provide the required long-running server capability. Compare changing the target with redesigning the feature before release.",
      "checkType": "free-text",
      "prompt": "List the production artifact, configuration, smoke, freshness, signal, observation, and rollback evidence required.",
      "freeTextKeywords": [
        "build",
        "configuration",
        "freshness",
        "signal",
        "rollback"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/production-checklist",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://nextjs.org/docs/app/guides/self-hosting",
        "https://nextjs.org/docs/15/app/guides/environment-variables",
        "https://nextjs.org/docs/15/app/guides/self-hosting"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-production-build",
      "topicId": "expansion-production-readiness",
      "topicFamily": "production",
      "question": "Why should a Next.js app be tested from a production-like build?",
      "answer": "The production build can differ from development in bundling, optimization, environment handling, route rendering, caching, and server execution. Starting and smoking the built app exposes deployment assumptions before they become user-facing incidents.",
      "followUp": "Which protected route, mutation, stale-data event, and service failure belong in your smallest useful smoke set?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-production-readiness",
        "build",
        "deployment"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/production-checklist",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/production-checklist"
      ]
    },
    {
      "id": "expansion-qa-runtime-configuration",
      "topicId": "expansion-production-readiness",
      "topicFamily": "production",
      "question": "What makes an environment variable safe for the browser?",
      "answer": "A value is safe for browser code only when the team intentionally treats it as public. Next.js exposes NEXT_PUBLIC_ values to the client bundle, so credentials and internal service configuration must remain server-only. Required values should fail clearly without printing their secret contents.",
      "followUp": "Which current variable would be damaging if every browser user could read it?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-production-readiness",
        "environment",
        "security"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/production-checklist",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://nextjs.org/docs/15/app/guides/environment-variables"
      ]
    },
    {
      "id": "loop-qa-expansion-production-readiness-1",
      "topicId": "expansion-production-readiness",
      "topicFamily": "production",
      "question": "What evidence turns “it works locally” into a production release decision?",
      "answer": "Use the intended production artifact and runtime, validated configuration, critical success and failure smoke checks, freshness and authorization evidence, safe operational signals, an observation window, and a reversible rollback rule.",
      "followUp": "Which one of those boundaries is currently assumed rather than verified in your release process?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-production-readiness"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/production-checklist",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://nextjs.org/docs/15/app/guides/self-hosting"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-release-from-evidence",
      "topicId": "expansion-production-readiness",
      "topicFamily": "production",
      "title": "Release from Production Evidence",
      "summary": "Release a production-like artifact only after configuration, critical flows, failures, freshness, safe signals, and rollback are verified.",
      "rationale": "Development mode does not prove the deployed runtime or operational contract. A short, repeatable evidence set makes the release decision and recovery path explicit.",
      "tradeOffs": "A release gate adds coordination and test time. Keep it proportional to risk, automate stable checks, and preserve human ownership for ambiguous impact and rollback decisions.",
      "appliesWhen": "A deployment changes routes, protected data, mutations, caching, configuration, runtime requirements, or user-facing recovery.",
      "doesNotApplyWhen": "A local experiment has no deployment, shared data, or user impact.",
      "example": "Start the built app with production-like config; smoke owner access, non-owner denial, edit freshness, and API failure; observe the release window; roll back if the agreed error threshold fails.",
      "sourceLink": "https://nextjs.org/docs/app/guides/production-checklist",
      "sourceLinks": [
        "https://nextjs.org/docs/app/guides/production-checklist",
        "https://nextjs.org/docs/app/guides/self-hosting",
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://nextjs.org/docs/15/app/guides/environment-variables",
        "https://nextjs.org/docs/15/app/guides/self-hosting"
      ],
      "tags": [
        "expansion-production-readiness",
        "deployment",
        "operations"
      ]
    }
  ],
  "meta": {
    "topicFamily": "production",
    "level": "advanced",
    "title": "Prepare a Next.js App for Production"
  }
};
