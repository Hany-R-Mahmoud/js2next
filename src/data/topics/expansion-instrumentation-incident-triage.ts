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
      "Turn a user-visible production symptom into a scoped incident and testable hypothesis",
      "Use Next.js 15 register and onRequestError as observability integration seams",
      "Collect allowlisted correlation, route, deployment, timing, and error context without secrets",
      "Choose reversible mitigation, verification, escalation, and rollback from defined signals"
    ],
    "whyMatters": "During an incident, missing context encourages guesses while excessive logging can expose credentials or personal data. A calm triage loop collects the smallest safe evidence needed to protect users, test a hypothesis, and verify a reversible recovery decision.",
    "estimatedMinutes": 44,
    "sections": [
      {
        "id": "expansion-instrumentation-triage-model",
        "type": "concept",
        "title": "Signal to decision",
        "content": "Begin with impact: which users, operation, route, region, and deployment are affected, and when did it start? Assign a safe correlation id so browser reports and server events can refer to the same attempt without logging the request body or credentials. Compare failing and healthy requests, then write one leading hypothesis plus evidence that could disprove it.\n\nNext.js `instrumentation.ts` is an integration point. `register` runs when a server instance starts, and `onRequestError` can receive captured server errors with request and route context. Those hooks do not choose a telemetry vendor, define retention, protect fields automatically, or fix the incident. The application still owns allowlisting, redaction, sampling, alerts, runbooks, and recovery decisions."
      },
      {
        "id": "expansion-instrumentation-triage-code",
        "type": "code-example",
        "title": "Instrument the seam",
        "content": "The handler records only an allowlisted request id, method, route type, route path, deployment id, and error digest. It does not send cookies, authorization headers, full request headers, form bodies, or raw personal data. Any asynchronous export is awaited.",
        "code": "import type { Instrumentation } from 'next';\n\nexport function register() {\n  initializeServerTelemetry();\n}\n\nexport const onRequestError: Instrumentation.onRequestError = async (\n  error, request, context,\n) => {\n  const rawId = request.headers['x-request-id'];\n  const requestId = typeof rawId === 'string' ? rawId : undefined;\n\n  await recordSafeSignal({\n    requestId, method: request.method, routePath: context.routePath,\n    routeType: context.routeType, deployment: process.env.DEPLOYMENT_ID,\n    errorDigest: error.digest,\n  });\n};",
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
            "question": "A deployed Server Action fails intermittently and current logs cannot connect reports to requests. What is the safest useful next step?",
            "options": [
              "Add an allowlisted correlation id plus route, deployment, timing, and error context, then test a bounded hypothesis",
              "Log cookies, authorization headers, and every form field",
              "Disable authorization so reproduction is easier",
              "Treat the first guessed cause as confirmed"
            ],
            "correctAnswer": "Add an allowlisted correlation id plus route, deployment, timing, and error context, then test a bounded hypothesis",
            "expectedReasoning": "Safe structured context can connect the user symptom to a server event and deployment. Secrets and broad payloads create security risk, disabling authorization changes the system being diagnosed, and an untested guess is not incident evidence."
          }
        ]
      },
      {
        "id": "expansion-instrumentation-triage-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Scope impact, collect safe correlated evidence, compare healthy and failing behavior, and test one hypothesis. Choose the smallest reversible mitigation, verify it with the same user-visible flow and server signal, and escalate or roll back when the agreed threshold is met. After recovery, remove temporary unsafe detail, preserve the useful signal, and record the follow-up owner."
      }
    ],
    "retrievalPrompt": "For a failing Server Action, state impact, safe correlation fields, instrumentation seam, leading hypothesis, mitigation, verification, owner, escalation, and rollback trigger.",
    "reflectionPrompt": "Inspect one production log event. Which field supports a decision, which sensitive field should be removed, and which missing field would connect the symptom to a deployment?",
    "masteryCriteria": [
      "Can describe what register and onRequestError provide in Next.js 15.5.20",
      "Can separate browser symptom, server error, deployment context, and root-cause hypothesis",
      "Can design allowlisted telemetry that excludes credentials and unnecessary personal data",
      "Can define mitigation, verification, escalation, and rollback with observable thresholds"
    ],
    "nextTopics": [
      "deep-dive-production-concerns"
    ],
    "metadata": {
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/15/app/guides/instrumentation",
        "https://nextjs.org/docs/15/app/api-reference/file-conventions/instrumentation",
        "https://nextjs.org/docs/15/app/guides/open-telemetry",
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
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
        "concept": "Telemetry supports an incident decision only when its fields are safe, scoped, correlated, and connected to a hypothesis.",
        "prediction": {
          "prompt": "Which first event is useful without creating a second incident?",
          "options": [
            "Allowlisted request id, route, deployment, timing, error class or digest, and outcome",
            "Raw session cookie, access token, and complete form body",
            "A message that says only “something failed”"
          ],
          "correctAnswer": "Allowlisted request id, route, deployment, timing, error class or digest, and outcome",
          "feedbackCorrect": "Those fields connect scope and failure while avoiding credentials and unnecessary payload data.",
          "feedbackWrong": "Raw secrets create harm, while an uncorrelated generic message cannot support a bounded decision."
        },
        "synthesis": "Collect the minimum safe context that can change the incident decision."
      }
    ],
    "miniProject": {
      "title": "Write an incident card",
      "scenario": "Write an incident card for intermittent Server Action failures that began after one deployment.",
      "acceptance": [
        "Impact, start time, route, deployment, affected users, and incident owner are explicit",
        "Browser and server events share a safe correlation contract with an allowlist and retention decision",
        "The leading hypothesis has confirming and disproving evidence plus a production-like reproduction",
        "Mitigation, verification, escalation, rollback, and post-incident follow-up are measurable"
      ],
      "rubric": [
        {
          "dimension": "Evidence",
          "evidence": "Signals connect the same user attempt, route, deployment, and server failure."
        },
        {
          "dimension": "Safety",
          "evidence": "Credentials, raw payloads, and unnecessary personal data are excluded by design."
        },
        {
          "dimension": "Decision",
          "evidence": "Mitigation and rollback follow thresholds and are verified with the original symptom."
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
      "scenario": "After deployment `d-184`, about 8% of note-creation Server Actions fail. Browser reports show a generic error, server events lack correlation, and the team is divided between immediate rollback and adding full request bodies to logs.",
      "constraints": [
        "Use Next.js instrumentation as an integration seam, not as the root-cause fix",
        "Allowlist fields and exclude credentials, cookies, and unnecessary personal data",
        "Define impact, one leading hypothesis, and evidence that could disprove it",
        "Choose a reversible mitigation and measurable verification window",
        "Tie escalation or rollback to a declared threshold and owner"
      ],
      "acceptanceCriteria": [
        "The plan uses register or onRequestError according to the Next.js 15 contract",
        "A safe request id connects the browser symptom, server error, route, and deployment",
        "Healthy and failing events can be compared without raw form data or authorization headers",
        "The mitigation is smaller and more reversible than an untested permanent fix",
        "The same note-creation smoke and error-rate signal verify recovery or trigger rollback",
        "Temporary instrumentation has a removal or retention review owner"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write impact and the minimum allowlisted fields before adding any instrumentation."
        },
        {
          "stage": 2,
          "text": "Compare deployment d-184 failures with a healthy deployment or route and name one disconfirming signal."
        },
        {
          "stage": 3,
          "text": "Set an error-rate and time-window threshold, then verify mitigation with the original user flow."
        }
      ],
      "expectedReasoning": "The team needs enough safe correlation to locate the failing boundary and compare it with healthy behavior. Next.js hooks expose server startup and request-error seams, while field safety, hypotheses, mitigation, verification, rollback, and follow-up remain operational responsibilities.",
      "commonWrongPaths": [
        "Logging cookies, tokens, or complete form payloads",
        "Treating the presence of onRequestError as proof of a configured exporter or alert",
        "Disabling security controls to make the failure disappear",
        "Rolling back or declaring success without a threshold and verification window",
        "Keeping emergency verbose logging indefinitely"
      ],
      "answerExplanation": "Scope impact, add allowlisted correlation and deployment context through the supported seam, test a bounded hypothesis, mitigate reversibly, and use the original flow plus a declared error threshold to verify or roll back.",
      "followUpVariation": "The failure includes user-entered text that support wants to inspect. Design a safer reproduction and consent/redaction path without adding raw text to routine telemetry.",
      "checkType": "free-text",
      "prompt": "Write the impact, safe fields, instrumentation seam, hypothesis, mitigation, verification, rollback, and follow-up plan.",
      "freeTextKeywords": [
        "impact",
        "correlation",
        "allowlist",
        "hypothesis",
        "rollback"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/instrumentation",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/instrumentation",
        "https://nextjs.org/docs/15/app/api-reference/file-conventions/instrumentation",
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-instrumentation-triage",
      "topicId": "expansion-instrumentation-incident-triage",
      "topicFamily": "production",
      "question": "What does Next.js instrumentation contribute to an incident response?",
      "answer": "Next.js 15 provides `register` for server-instance startup integration and `onRequestError` for captured server errors with request and route context. The app still chooses an exporter, allowlists and redacts fields, defines alerts and retention, tests hypotheses, and makes mitigation or rollback decisions.",
      "followUp": "Which allowlisted fields would connect one browser report to one Server Action error without storing its body or credentials?",
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
        "https://nextjs.org/docs/15/app/guides/instrumentation",
        "https://nextjs.org/docs/15/app/api-reference/file-conventions/instrumentation"
      ]
    },
    {
      "id": "loop-qa-expansion-instrumentation-incident-triage-1",
      "topicId": "expansion-instrumentation-incident-triage",
      "topicFamily": "production",
      "question": "What makes a production signal useful for incident triage?",
      "answer": "It is safe, structured, correlated, scoped to impact, and capable of confirming or disproving a hypothesis. Route, deployment, timing, outcome, and an allowlisted request id are usually more useful than a large unstructured payload.",
      "followUp": "Which current log field never changes a decision and can be removed?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-instrumentation-incident-triage"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/instrumentation",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/instrumentation",
        "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
      ]
    },
    {
      "id": "loop-qa-expansion-instrumentation-incident-triage-2",
      "topicId": "expansion-instrumentation-incident-triage",
      "topicFamily": "production",
      "question": "How should mitigation, verification, and rollback relate during an incident?",
      "answer": "Choose the smallest reversible action that reduces impact, verify it with the same user-visible flow and server signal, and roll back or escalate when a pre-agreed threshold fails. Record the owner, time window, and post-recovery follow-up.",
      "followUp": "What exact signal and duration would prove your latest mitigation worked?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-instrumentation-incident-triage"
      ],
      "sourceLink": "https://nextjs.org/docs/15/app/guides/instrumentation",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/instrumentation",
        "https://nextjs.org/docs/15/app/guides/production-checklist"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-triage-from-safe-signals",
      "topicId": "expansion-instrumentation-incident-triage",
      "topicFamily": "production",
      "title": "Triage from Safe Production Signals",
      "summary": "Triage incidents with allowlisted correlated evidence, a bounded hypothesis, reversible mitigation, and measured verification or rollback.",
      "rationale": "Safe structured signals connect user impact to a server and deployment boundary without turning credentials or personal data into a second incident.",
      "tradeOffs": "Allowlisting and redaction provide less raw detail and require design work. They improve trust, retention control, comparison, and the quality of operational decisions.",
      "appliesWhen": "A deployed route, Server Function, Route Handler, render, or background operation needs evidence-based diagnosis.",
      "doesNotApplyWhen": "A local deterministic pure function can be reproduced and explained without production telemetry.",
      "example": "Correlate note-create outcome, route, deployment, duration, and error digest; compare healthy and failing events; mitigate; verify the same smoke; roll back if the agreed rate persists.",
      "sourceLink": "https://nextjs.org/docs/15/app/guides/instrumentation",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/instrumentation",
        "https://nextjs.org/docs/15/app/guides/open-telemetry",
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://nextjs.org/docs/15/app/api-reference/file-conventions/instrumentation",
        "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
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
