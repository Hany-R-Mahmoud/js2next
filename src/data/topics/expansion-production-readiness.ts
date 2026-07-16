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
      "Separate build-time and runtime configuration concerns",
      "Review caching, error, and observability behavior before release",
      "Choose a deployment model that matches the app’s server requirements",
      "Define a rollback and verification path"
    ],
    "whyMatters": "A feature is not production-ready when it only works in a local development server. Release confidence comes from checking the built artifact, runtime configuration, data freshness, failures, and recovery path together.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "expansion-production-readiness-model",
        "type": "concept",
        "title": "Review the whole runtime",
        "content": "Inspect the production build, environment variables, server/runtime capabilities, caching and revalidation intent, error recovery, logs, and the deployment rollback path."
      },
      {
        "id": "expansion-production-readiness-code",
        "type": "code-example",
        "title": "Keep configuration explicit",
        "content": "Read server-only configuration at the server boundary and fail clearly when required values are missing. Public configuration must be safe to expose.",
        "code": "const apiBaseUrl = process.env.INTERNAL_API_URL;\nif (!apiBaseUrl) throw new Error('INTERNAL_API_URL is required');\n\nexport async function loadProjects() {\n  const response = await fetch(`${apiBaseUrl}/projects`);\n  if (!response.ok) throw new Error(`Projects failed: ${response.status}`);\n  return response.json();\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "Server data boundary"
      },
      {
        "id": "expansion-production-readiness-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-production-readiness-check",
            "question": "Which release check gives the strongest evidence that a deployment is safe?",
            "options": [
              "The development server renders one page",
              "A production-like build and smoke flow verify configuration, critical routes, failures, and recovery",
              "All environment variables are prefixed public",
              "Caching is disabled globally"
            ],
            "correctAnswer": "A production-like build and smoke flow verify configuration, critical routes, failures, and recovery",
            "expectedReasoning": "Production behavior depends on the built artifact, runtime configuration, server model, caching, and failure paths. A single local page does not exercise those boundaries."
          }
        ]
      },
      {
        "id": "expansion-production-readiness-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Release from evidence: build, configure, smoke-test critical routes, verify failure and freshness behavior, observe the runtime, and keep rollback simple."
      }
    ],
    "retrievalPrompt": "Which production checks must happen beyond “the page renders locally”?",
    "reflectionPrompt": "Choose one feature. What configuration, cache, failure, observability, smoke, and rollback checks would you require before release?",
    "masteryCriteria": [
      "Can distinguish development and production-like evidence",
      "Can identify server-only configuration",
      "Can name freshness and failure checks",
      "Can define a smoke and rollback path"
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
        "concept": "A successful local render proves less than a production-like build with runtime configuration and a failure smoke.",
        "prediction": {
          "prompt": "Which evidence should come before declaring release-ready?",
          "options": [
            "Only a local development screenshot",
            "A built artifact, configured runtime, and critical smoke flow"
          ],
          "correctAnswer": "A built artifact, configured runtime, and critical smoke flow",
          "feedbackCorrect": "Release evidence must cover the deployed boundaries.",
          "feedbackWrong": "Local rendering does not exercise deployment behavior."
        },
        "synthesis": "Build, configure, smoke, observe, and recover."
      }
    ],
    "miniProject": {
      "title": "Write a release plan",
      "scenario": "Create a production checklist for one protected, data-backed feature.",
      "acceptance": [
        "Required server configuration is identified",
        "Success and failure smoke checks are named",
        "A rollback signal and owner are recorded"
      ],
      "rubric": [
        {
          "dimension": "Runtime",
          "evidence": "Build and server configuration match the deployment target."
        },
        {
          "dimension": "Reliability",
          "evidence": "Freshness, errors, logs, and smoke checks are explicit."
        },
        {
          "dimension": "Recovery",
          "evidence": "Rollback trigger, owner, and reversible action are named."
        }
      ]
    },
    "metadata": {
      "lastUpdated": "2026-07-15",
      "sources": [
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://nextjs.org/docs/15/app/guides/self-hosting"
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-audit-production-release",
      "title": "Audit a Production Release",
      "level": 9,
      "topicFamily": "production",
      "scenario": "A team wants to ship a Next.js feature because it works in development. The feature reads a server-only API, uses cached data, has a recoverable error UI, and needs a rollback plan.",
      "constraints": [
        "Review the built artifact and runtime configuration",
        "Protect secrets and server-only boundaries",
        "Verify cache/freshness and failure behavior",
        "Define observable smoke and rollback checks"
      ],
      "acceptanceCriteria": [
        "Required configuration fails clearly without leaking secrets",
        "Critical route and mutation smoke checks are named",
        "Cache and error behavior are verified in a production-like environment",
        "A rollback signal and owner are explicit"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start with the production checklist, then map each item to evidence for this feature."
        },
        {
          "stage": 2,
          "text": "Separate public browser configuration from server-only values."
        },
        {
          "stage": 3,
          "text": "Write one failure smoke and one rollback trigger, not just a happy-path URL."
        }
      ],
      "expectedReasoning": "Production readiness is a set of verifiable boundaries: build, config, runtime, data freshness, failures, observability, and rollback.",
      "commonWrongPaths": [
        "Testing only with next dev",
        "Shipping secrets through public environment variables",
        "Disabling caching instead of defining intent",
        "Having no rollback or failure owner"
      ],
      "answerExplanation": "Run a production-like build, validate runtime configuration, smoke critical routes and failures, verify freshness and logs, and define a reversible release with a measurable rollback trigger.",
      "followUpVariation": "The deployment target cannot run the required server runtime. Decide whether to change the target or the architecture.",
      "checkType": "free-text",
      "prompt": "List the evidence and rollback checks required before this release.",
      "freeTextKeywords": [
        "build",
        "environment",
        "logs",
        "rollback"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/production-checklist",
      "sourceLinks": [
        "https://nextjs.org/docs/app/guides/self-hosting"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-production-build",
      "topicId": "expansion-production-readiness",
      "topicFamily": "production",
      "question": "Why should a Next.js app be tested from a production-like build?",
      "answer": "Development and production can differ in bundling, environment loading, caching, server behavior, and failure handling. A production-like build and smoke flow expose those boundaries earlier.",
      "followUp": "Which route and failure should be part of the smoke flow?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-production-readiness",
        "build",
        "deployment"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/production-checklist"
    },
    {
      "id": "expansion-qa-runtime-configuration",
      "topicId": "expansion-production-readiness",
      "topicFamily": "production",
      "question": "What makes an environment variable safe for the browser?",
      "answer": "Only values intentionally public should cross into browser code. Secrets and internal service configuration must remain server-only and be read at a protected server boundary.",
      "followUp": "How should a missing required server variable fail?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-production-readiness",
        "environment",
        "security"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/production-checklist"
    },
    {
      "id": "loop-qa-expansion-production-readiness-1",
      "topicId": "expansion-production-readiness",
      "topicFamily": "production",
      "question": "What problem does Prepare a Next.js App for Production help you solve?",
      "answer": "A feature is not production-ready when it only works in a local development server. Release confidence comes from checking the built artifact, runtime configuration, data freshness, failures, and recovery path together.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-production-readiness"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/production-checklist"
    }
  ],
  "practices": [
    {
      "id": "expansion-release-from-evidence",
      "topicId": "expansion-production-readiness",
      "topicFamily": "production",
      "title": "Release from Production Evidence",
      "summary": "Require a production-like build, configuration check, critical smoke flow, failure signal, and rollback path before shipping.",
      "rationale": "Local development proves only one runtime mode. Release evidence must cover the built artifact and the operational boundaries that can fail after deployment.",
      "tradeOffs": "A release checklist adds deliberate coordination. It prevents teams from discovering configuration, caching, or rollback gaps during an incident.",
      "appliesWhen": "A feature changes production routes, data, configuration, or runtime behavior.",
      "doesNotApplyWhen": "A local-only experiment has no deployment or user data impact.",
      "example": "Build, smoke the protected route and error path, verify required server variables, inspect logs, and record the rollback trigger.",
      "sourceLink": "https://nextjs.org/docs/app/guides/production-checklist",
      "sourceLinks": [
        "https://nextjs.org/docs/app/guides/self-hosting"
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
