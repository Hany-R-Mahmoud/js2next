import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "expansion-instrumentation-incident-triage",
  "lesson": {
    "slug": "expansion-instrumentation-incident-triage",
    "title": "Instrument and Triage Production Failures",
    "topicFamily": "production",
    "level": "advanced",
    "prerequisites": [
      "expansion-production-readiness",
      "expansion-testing-user-behavior",
      "expansion-performance-diagnosis"
    ],
    "learningObjectives": [
      "Turn a production symptom into a bounded evidence loop",
      "Use Next.js instrumentation seams without assuming a vendor integration exists",
      "Keep logs and traces free of secrets and unnecessary personal data",
      "Define mitigation, verification, and rollback signals for an incident"
    ],
    "whyMatters": "A production failure needs evidence before a fix. Instrumentation can expose the request and error context, but only a disciplined triage loop connects that signal to a safe mitigation and recovery decision.",
    "estimatedMinutes": 30,
    "sections": [
      {
        "id": "expansion-instrumentation-triage-model",
        "type": "concept",
        "title": "Signal to decision",
        "content": "Start with impact and a safe correlation identifier, collect route, deployment, request, and error evidence, test the leading hypothesis, then record mitigation, verification, owner, and rollback trigger."
      },
      {
        "id": "expansion-instrumentation-triage-code",
        "type": "code-example",
        "title": "Instrument the seam",
        "content": "Next.js instrumentation is an integration seam. It can register server-side setup or error handling, but it does not prove that a provider, exporter, or alert policy is configured.",
        "code": "export function register() {\n  // Initialize a server-safe signal boundary.\n}\n\nexport function onRequestError(error: unknown, request: { path: string }) {\n  recordSafeSignal({ path: request.path, error });\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "instrumentation.ts"
      },
      {
        "id": "expansion-instrumentation-triage-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-instrumentation-triage-check",
            "question": "What is the next useful action when a route is failing and logs lack context?",
            "options": [
              "Add every request body and token to logs",
              "Collect safe route/deployment/error evidence with a correlation identifier",
              "Disable authorization to reproduce faster",
              "Declare the first guessed cause confirmed"
            ],
            "correctAnswer": "Collect safe route/deployment/error evidence with a correlation identifier",
            "expectedReasoning": "Triage needs enough bounded evidence to test a hypothesis without leaking secrets or treating instrumentation as the fix."
          }
        ]
      },
      {
        "id": "expansion-instrumentation-triage-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Instrument the boundary, protect telemetry, reproduce against production-like behavior, mitigate safely, verify the outcome, and keep rollback criteria explicit."
      }
    ],
    "retrievalPrompt": "Which evidence should you collect first when a production route fails, and what must never enter telemetry by default?",
    "reflectionPrompt": "Write an incident card for one route or Server Action: impact, hypothesis, safe evidence, mitigation, verification, owner, and rollback trigger.",
    "masteryCriteria": [
      "Can name the instrumentation seam and its limit",
      "Can choose safe request and error context",
      "Can separate evidence collection from root-cause repair",
      "Can define mitigation, verification, and rollback conditions"
    ],
    "nextTopics": [
      "deep-dive-production-concerns"
    ],
    "metadata": {
      "nextVersion": "Next.js 15.5.20",
      "lastUpdated": "2026-07-15",
      "sources": [
        "https://nextjs.org/docs/15/app/guides/instrumentation",
        "https://nextjs.org/docs/15/app/api-reference/file-conventions/instrumentation",
        "https://nextjs.org/docs/15/app/guides/open-telemetry",
        "https://nextjs.org/docs/15/app/guides/production-checklist"
      ]
    },
    "diagram": {
      "title": "Incident evidence loop",
      "kind": "flow",
      "nodes": [
        {
          "id": "impact",
          "label": "Impact",
          "role": "Users, route, and scope"
        },
        {
          "id": "signal",
          "label": "Safe signal",
          "role": "Correlation, error, deployment"
        },
        {
          "id": "mitigate",
          "label": "Mitigate",
          "role": "Reversible action"
        },
        {
          "id": "verify",
          "label": "Verify",
          "role": "Smoke and user outcome"
        },
        {
          "id": "recover",
          "label": "Rollback",
          "role": "Defined trigger"
        }
      ],
      "edges": [
        {
          "from": "impact",
          "to": "signal"
        },
        {
          "from": "signal",
          "to": "mitigate"
        },
        {
          "from": "mitigate",
          "to": "verify"
        },
        {
          "from": "verify",
          "to": "recover"
        }
      ]
    },
    "chunks": [
      {
        "id": "expansion-instrumentation-incident-triage-retrieval-1",
        "title": "Telemetry is evidence, not a fix",
        "concept": "Instrumentation connects a production symptom to safe request and error evidence; it does not prove the root cause or authorize logging secrets.",
        "prediction": {
          "prompt": "What belongs in the first incident signal?",
          "options": [
            "A raw access token and full form body",
            "A safe correlation id, route, deployment, and error context"
          ],
          "correctAnswer": "A safe correlation id, route, deployment, and error context",
          "feedbackCorrect": "Safe structured context supports diagnosis without creating a second security incident.",
          "feedbackWrong": "Raw credentials and unnecessary personal data do not make telemetry trustworthy."
        },
        "synthesis": "Collect safe evidence, test a hypothesis, mitigate reversibly, verify, and roll back on a defined trigger."
      }
    ],
    "miniProject": {
      "title": "Write an incident card",
      "scenario": "Create an incident card for a failing Server Action with impact, evidence, mitigation, verification, owner, and rollback condition.",
      "acceptance": [
        "A safe correlation field is defined",
        "Secrets and unnecessary personal data are excluded",
        "The hypothesis has a production-like reproduction",
        "Mitigation and rollback are reversible and measurable"
      ],
      "rubric": [
        {
          "dimension": "Evidence",
          "evidence": "Signals connect the user-visible failure to a bounded hypothesis."
        },
        {
          "dimension": "Safety",
          "evidence": "Telemetry avoids credentials and unnecessary personal data."
        },
        {
          "dimension": "Recovery",
          "evidence": "Verification and rollback triggers are explicit."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-triage-instrumentation-incident",
      "title": "Triage an Instrumented Production Incident",
      "level": 8,
      "topicFamily": "production",
      "scenario": "A Server Action intermittently fails after deployment. Browser reports show a generic error, server logs lack a safe correlation id, and the team wants to roll back immediately without checking impact.",
      "constraints": [
        "Use instrumentation as an evidence seam, not a vendor requirement",
        "Exclude secrets and unnecessary personal data from telemetry",
        "Define a bounded hypothesis and production-like reproduction",
        "Record mitigation, verification, owner, and rollback trigger"
      ],
      "acceptanceCriteria": [
        "The plan names register or onRequestError accurately",
        "A safe correlation and route/deployment context are collected",
        "The browser symptom is distinguished from the server signal",
        "The team has a reversible mitigation and verification step",
        "Rollback is tied to an impact threshold or failed verification rather than panic"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start with impact, scope, and a safe identifier, not raw request payloads."
        },
        {
          "stage": 2,
          "text": "Use instrumentation to connect request/error evidence to a hypothesis."
        },
        {
          "stage": 3,
          "text": "Set a rollback trigger and verify the mitigation with the same user-visible smoke."
        }
      ],
      "expectedReasoning": "A production incident needs bounded evidence and a reversible decision. Instrumentation can register server-side hooks and request errors, while safe logging, reproduction, mitigation, verification, and rollback remain application responsibilities.",
      "commonWrongPaths": [
        "Logging cookies, access tokens, or full form payloads",
        "Treating a telemetry hook as the root-cause fix",
        "Rolling back without checking blast radius or recovery evidence",
        "Using client-only logs to claim server authorization succeeded"
      ],
      "answerExplanation": "Capture impact, route, deployment, safe correlation, and error context; reproduce against production-like behavior; mitigate; verify the user-visible failure and server signal; then roll back when the defined trigger is met.",
      "followUpVariation": "The mitigation removes detailed error text from the UI. What safe signal remains for support and operators?",
      "checkType": "free-text",
      "prompt": "Write the incident triage loop and the evidence you would refuse to log.",
      "freeTextKeywords": [
        "instrumentation",
        "correlation",
        "safe",
        "mitigation",
        "rollback"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/instrumentation",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/api-reference/file-conventions/instrumentation",
        "https://nextjs.org/docs/15/app/guides/production-checklist"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-instrumentation-triage",
      "topicId": "expansion-instrumentation-incident-triage",
      "topicFamily": "production",
      "question": "What does Next.js instrumentation contribute to an incident response?",
      "answer": "It provides a server-side integration seam such as register or onRequestError for collecting bounded request and error signals. It does not configure a vendor, prove the root cause, or justify logging secrets and unnecessary personal data.",
      "followUp": "Which evidence connects a browser-visible failure to a production hypothesis?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "instrumentation",
        "incident-response",
        "observability",
        "production"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/instrumentation",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/api-reference/file-conventions/instrumentation"
      ]
    },
    {
      "id": "loop-qa-expansion-instrumentation-incident-triage-1",
      "topicId": "expansion-instrumentation-incident-triage",
      "topicFamily": "production",
      "question": "What problem does Instrument and Triage Production Failures help you solve?",
      "answer": "A production failure needs evidence before a fix. Instrumentation can expose the request and error context, but only a disciplined triage loop connects that signal to a safe mitigation and recovery decision.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-instrumentation-incident-triage"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/instrumentation"
    },
    {
      "id": "loop-qa-expansion-instrumentation-incident-triage-2",
      "topicId": "expansion-instrumentation-incident-triage",
      "topicFamily": "production",
      "question": "How would you explain the core idea of Instrument and Triage Production Failures to a teammate?",
      "answer": "Which evidence should you collect first when a production route fails, and what must never enter telemetry by default? A strong explanation should connect the model to: Turn a production symptom into a bounded evidence loop; Use Next.js instrumentation seams without assuming a vendor integration exists.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-instrumentation-incident-triage"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/instrumentation"
    }
  ],
  "practices": [
    {
      "id": "expansion-triage-from-safe-signals",
      "topicId": "expansion-instrumentation-incident-triage",
      "topicFamily": "production",
      "title": "Triage from Safe Production Signals",
      "summary": "Connect impact, route and deployment context, a safe correlation id, error evidence, mitigation, verification, and rollback without logging secrets by default.",
      "rationale": "Instrumentation is useful only when its signal supports a bounded operational decision. Safe fields protect users while keeping the incident explainable.",
      "tradeOffs": "Redacting and structuring telemetry takes discipline and can reduce raw debugging detail. The trade-off protects credentials and personal data from becoming incident multipliers.",
      "appliesWhen": "A deployed route, Server Action, or background operation needs diagnosis.",
      "doesNotApplyWhen": "A local pure function can be diagnosed deterministically without runtime telemetry.",
      "example": "Record route, deployment, correlation id, error class, and timing; reproduce safely, apply the smallest mitigation, verify the smoke flow, and roll back on the agreed impact threshold.",
      "sourceLink": "https://nextjs.org/docs/15/app/guides/instrumentation",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/open-telemetry",
        "https://nextjs.org/docs/15/app/guides/production-checklist"
      ],
      "tags": [
        "instrumentation",
        "incident-response",
        "observability",
        "rollback"
      ]
    }
  ],
  "meta": {
    "topicFamily": "production",
    "level": "advanced",
    "title": "Instrument and Triage Production Failures"
  }
};
