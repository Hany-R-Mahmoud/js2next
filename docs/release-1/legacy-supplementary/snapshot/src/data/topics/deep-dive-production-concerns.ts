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
      "Separate authentication from authorization",
      "Protect server boundaries",
      "Budget performance and deployment risk"
    ],
    "whyMatters": "A polished frontend still fails if authorization is client-only, secrets leak, or production performance and observability are ignored.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "deep-dive-production-concerns-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "The server is the authority for identity and permission checks. The UI can reflect access, but it cannot grant access."
      },
      {
        "id": "deep-dive-production-concerns-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "Authenticate the request, authorize the action at the server boundary, and keep secrets out of client bundles. Measure user-facing performance instead of assuming a framework default is optimal."
      },
      {
        "id": "deep-dive-production-concerns-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "Hidden buttons and middleware redirects do not protect APIs or mutations. Every privileged server operation needs its own denied-path check."
      },
      {
        "id": "deep-dive-production-concerns-example",
        "type": "code-example",
        "title": "Server-side authorization shape",
        "content": "Apply the model in a small, reviewable example.",
        "code": "const session = await getSession();\nif (!session?.user || session.user.id !== ownerId) redirect('/sign-in');",
        "codeLanguage": "typescript",
        "codeFilePath": "Illustrative snippet"
      },
      {
        "id": "deep-dive-production-concerns-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-production-concerns-question",
            "question": "Where must authorization be enforced?",
            "options": [
              "Only by hiding the button",
              "At the server action/API boundary",
              "Only in middleware UI redirects",
              "In CSS"
            ],
            "correctAnswer": "At the server action/API boundary",
            "expectedReasoning": "Clients are untrusted; the mutation or data boundary must reject unauthorized requests."
          }
        ]
      },
      {
        "id": "deep-dive-production-concerns-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Authenticate the request, authorize the action at the server boundary, and keep secrets out of client bundles. Measure user-facing performance instead of assuming a framework default is optimal.\n\nDecision clue: Hidden buttons and middleware redirects do not protect APIs or mutations. Every privileged server operation needs its own denied-path check."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-production-concerns-prediction",
        "title": "Predict the boundary",
        "concept": "Authenticate the request, authorize the action at the server boundary, and keep secrets out of client bundles. Measure user-facing performance instead of assuming a framework default is optimal.",
        "prediction": {
          "prompt": "Where must authorization be enforced?",
          "options": [
            "Only by hiding the button",
            "At the server action/API boundary",
            "Only in middleware UI redirects",
            "In CSS"
          ],
          "correctAnswer": "At the server action/API boundary",
          "feedbackCorrect": "Correct. Your prediction matches the model. Now explain why it stays true under change.",
          "feedbackWrong": "Revisit the model: Clients are untrusted; the mutation or data boundary must reject unauthorized requests."
        },
        "synthesis": "Clients are untrusted; the mutation or data boundary must reject unauthorized requests."
      },
      {
        "id": "deep-dive-production-concerns-failure-mode",
        "title": "Name the failure mode",
        "concept": "Hidden buttons and middleware redirects do not protect APIs or mutations. Every privileged server operation needs its own denied-path check.",
        "prediction": {
          "prompt": "Which design move best prevents the failure described above?",
          "options": [
            "Make the boundary explicit",
            "Add another duplicated state value",
            "Hide the failure from the user"
          ],
          "correctAnswer": "Make the boundary explicit",
          "feedbackCorrect": "Correct. Explicit boundaries make the cause, ownership, and recovery path inspectable.",
          "feedbackWrong": "Prefer the smallest explicit boundary that owns the behavior and its recovery path."
        },
        "synthesis": "Use this clue in review: Hidden buttons and middleware redirects do not protect APIs or mutations. Every privileged server operation needs its own denied-path check."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Auth Concepts, Security, Performance & Deploy",
      "scenario": "Apply the lesson to a small feature. Explain the boundary before writing code, then name how you would verify it.",
      "acceptance": [
        "Separate authentication from authorization",
        "Protect server boundaries",
        "Budget performance and deployment risk",
        "Name one failure state and one observable test."
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
    "retrievalPrompt": "Explain the core model of Auth Concepts, Security, Performance & Deploy and name one failure mode it prevents.",
    "reflectionPrompt": "Find one place in a real frontend project where this auth concepts, security, performance & deploy decision could be made more explicit.",
    "masteryCriteria": [
      "Separate authentication from authorization",
      "Protect server boundaries",
      "Budget performance and deployment risk"
    ],
    "nextTopics": [
      "deep-dive-architecture-decisions"
    ],
    "metadata": {
      "lastUpdated": "2026-07-14",
      "sources": [
        "https://nextjs.org/docs/app/building-your-application/authentication",
        "https://nextjs.org/docs/15/app/guides/authentication",
        "https://nextjs.org/docs/15/app/guides/environment-variables",
        "https://nextjs.org/docs/15/app/guides/production-checklist"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-prod-7",
      "title": "Deep Challenge: Perf + a11y constraint challenge",
      "level": 7,
      "topicFamily": "production",
      "scenario": "Marketing wants an auto-playing product carousel on the homepage.",
      "constraints": [
        "Respect prefers-reduced-motion",
        "Preserve keyboard focus",
        "Protect the LCP image budget"
      ],
      "acceptanceCriteria": [
        "Mentions reduced motion",
        "Mentions keyboard or focus",
        "Mentions image or LCP"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "prefers-reduced-motion should pause or disable autoplay."
        },
        {
          "stage": 2,
          "text": "Focus order and accessible roles matter."
        },
        {
          "stage": 3,
          "text": "The hero image needs an intentional loading and layout budget."
        }
      ],
      "expectedReasoning": "Respect motion preferences, ensure keyboard operability and labels, and budget LCP with optimized media and stable layout.",
      "commonWrongPaths": [
        "Only polishing CSS animation"
      ],
      "answerExplanation": "Respect reduced motion, ensure keyboard operation and labels, and protect LCP and layout stability.",
      "followUpVariation": "How do you test reduced-motion behavior in CI?",
      "checkType": "free-text",
      "prompt": "List three concrete safeguards before shipping the carousel.",
      "freeTextKeywords": [
        "motion",
        "keyboard",
        "image"
      ],
      "sourceLink": "https://nextjs.org/docs/app/guides/production-checklist"
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-production-concerns-question",
      "question": "Where must authorization be enforced?",
      "answer": "At the server action/API boundary",
      "followUp": "Clients are untrusted; the mutation or data boundary must reject unauthorized requests.",
      "category": "performance",
      "level": "advanced",
      "topicId": "deep-dive-production-concerns",
      "topicFamily": "production",
      "tags": [
        "learn-react-bridge",
        "production"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/authentication"
    },
    {
      "id": "loop-qa-deep-dive-production-concerns-1",
      "topicId": "deep-dive-production-concerns",
      "topicFamily": "production",
      "question": "What problem does Deep Dive: Auth Concepts, Security, Performance & Deploy help you solve?",
      "answer": "A polished frontend still fails if authorization is client-only, secrets leak, or production performance and observability are ignored.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "deep-dive-production-concerns"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/authentication"
    },
    {
      "id": "loop-qa-deep-dive-production-concerns-2",
      "topicId": "deep-dive-production-concerns",
      "topicFamily": "production",
      "question": "How would you explain the core idea of Deep Dive: Auth Concepts, Security, Performance & Deploy to a teammate?",
      "answer": "Explain the core model of Auth Concepts, Security, Performance & Deploy and name one failure mode it prevents. A strong explanation should connect the model to: Separate authentication from authorization; Protect server boundaries.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "deep-dive-production-concerns"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/authentication"
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "production",
    "level": "advanced",
    "title": "Deep Dive: Auth Concepts, Security, Performance & Deploy"
  }
};
