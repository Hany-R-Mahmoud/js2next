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
      "Organize route segments",
      "Use layouts and loading states",
      "Keep route concerns separate"
    ],
    "whyMatters": "The App Router makes route structure, layouts, loading UI, and error boundaries part of the product architecture.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "deep-dive-nextjs-foundations-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "Folders define segments, layouts persist around nested pages, and special files provide route-scoped loading and error behavior."
      },
      {
        "id": "deep-dive-nextjs-foundations-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "The route tree is composed from layouts, pages, and segment boundaries. Server Components are the default, so data and interactivity should be placed deliberately."
      },
      {
        "id": "deep-dive-nextjs-foundations-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "Clear segment boundaries prevent a single page from owning unrelated loading and error behavior and make navigation state easier to reason about."
      },
      {
        "id": "deep-dive-nextjs-foundations-example",
        "type": "code-example",
        "title": "Route-scoped loading UI",
        "content": "Apply the model in a small, reviewable example.",
        "code": "export default function Loading() {\n  return <p role=\"status\">Loading dashboard…</p>;\n}",
        "codeLanguage": "tsx",
        "codeFilePath": "Illustrative snippet"
      },
      {
        "id": "deep-dive-nextjs-foundations-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-nextjs-foundations-question",
            "question": "Which file supplies a persistent wrapper for nested routes?",
            "options": [
              "layout.tsx",
              "loading.tsx",
              "route.ts",
              "not-found.tsx"
            ],
            "correctAnswer": "layout.tsx",
            "expectedReasoning": "A layout wraps and persists across navigation between its child segments."
          }
        ]
      },
      {
        "id": "deep-dive-nextjs-foundations-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "The route tree is composed from layouts, pages, and segment boundaries. Server Components are the default, so data and interactivity should be placed deliberately.\n\nDecision clue: Clear segment boundaries prevent a single page from owning unrelated loading and error behavior and make navigation state easier to reason about."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-nextjs-foundations-prediction",
        "title": "Predict the boundary",
        "concept": "The route tree is composed from layouts, pages, and segment boundaries. Server Components are the default, so data and interactivity should be placed deliberately.",
        "prediction": {
          "prompt": "Which file supplies a persistent wrapper for nested routes?",
          "options": [
            "layout.tsx",
            "loading.tsx",
            "route.ts",
            "not-found.tsx"
          ],
          "correctAnswer": "layout.tsx",
          "feedbackCorrect": "Correct. Your prediction matches the model. Now explain why it stays true under change.",
          "feedbackWrong": "Revisit the model: A layout wraps and persists across navigation between its child segments."
        },
        "synthesis": "A layout wraps and persists across navigation between its child segments."
      },
      {
        "id": "deep-dive-nextjs-foundations-failure-mode",
        "title": "Name the failure mode",
        "concept": "Clear segment boundaries prevent a single page from owning unrelated loading and error behavior and make navigation state easier to reason about.",
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
        "synthesis": "Use this clue in review: Clear segment boundaries prevent a single page from owning unrelated loading and error behavior and make navigation state easier to reason about."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Next.js App Router Foundations",
      "scenario": "Apply the lesson to a small feature. Explain the boundary before writing code, then name how you would verify it.",
      "acceptance": [
        "Organize route segments",
        "Use layouts and loading states",
        "Keep route concerns separate",
        "Name one failure state and one observable test."
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
    "retrievalPrompt": "Explain the core model of Next.js App Router Foundations and name one failure mode it prevents.",
    "reflectionPrompt": "Find one place in a real frontend project where this next.js app router foundations decision could be made more explicit.",
    "masteryCriteria": [
      "Organize route segments",
      "Use layouts and loading states",
      "Keep route concerns separate"
    ],
    "nextTopics": [
      "deep-dive-rsc-boundaries"
    ],
    "metadata": {
      "lastUpdated": "2026-07-14",
      "sources": [
        "https://nextjs.org/docs/app/building-your-application/routing",
        "https://nextjs.org/docs/app/getting-started/layouts-and-pages"
      ]
    }
  },
  "challenges": [
    {
      "slug": "loop-deep-dive-nextjs-foundations",
      "title": "Apply Deep Dive: Next.js App Router Foundations",
      "level": 2,
      "topicFamily": "nextjs-foundations",
      "scenario": "Use the model from Deep Dive: Next.js App Router Foundations in a small project decision, then explain the boundary you chose.",
      "constraints": [
        "State the owner or boundary explicitly",
        "Include one failure or recovery case",
        "Keep the explanation tied to observable behavior"
      ],
      "acceptanceCriteria": [
        "Organize route segments",
        "Use layouts and loading states",
        "Keep route concerns separate"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start with the first learning objective: Organize route segments."
        },
        {
          "stage": 2,
          "text": "Separate the model, the boundary that owns it, and the evidence a user or test can observe."
        },
        {
          "stage": 3,
          "text": "Use this retrieval prompt: Explain the core model of Next.js App Router Foundations and name one failure mode it prevents."
        }
      ],
      "expectedReasoning": "Organize route segments · Use layouts and loading states · Keep route concerns separate",
      "commonWrongPaths": [
        "Adding a second owner without a requirement",
        "Describing success without a failure or recovery state"
      ],
      "answerExplanation": "A good response names the model, its owner, and an observable way to verify it. The App Router makes route structure, layouts, loading UI, and error boundaries part of the product architecture.",
      "followUpVariation": "Apply the same boundary to a different feature in the project.",
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/routing"
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-nextjs-foundations-question",
      "question": "Which file supplies a persistent wrapper for nested routes?",
      "answer": "layout.tsx",
      "followUp": "A layout wraps and persists across navigation between its child segments.",
      "category": "nextjs",
      "level": "intermediate",
      "topicId": "deep-dive-nextjs-foundations",
      "topicFamily": "nextjs-foundations",
      "tags": [
        "learn-react-bridge",
        "nextjs-foundations"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/routing"
    },
    {
      "id": "loop-qa-deep-dive-nextjs-foundations-1",
      "topicId": "deep-dive-nextjs-foundations",
      "topicFamily": "nextjs-foundations",
      "question": "What problem does Deep Dive: Next.js App Router Foundations help you solve?",
      "answer": "The App Router makes route structure, layouts, loading UI, and error boundaries part of the product architecture.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-nextjs-foundations"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/routing"
    },
    {
      "id": "loop-qa-deep-dive-nextjs-foundations-2",
      "topicId": "deep-dive-nextjs-foundations",
      "topicFamily": "nextjs-foundations",
      "question": "How would you explain the core idea of Deep Dive: Next.js App Router Foundations to a teammate?",
      "answer": "Explain the core model of Next.js App Router Foundations and name one failure mode it prevents. A strong explanation should connect the model to: Organize route segments; Use layouts and loading states.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-nextjs-foundations"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/routing"
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "nextjs-foundations",
    "level": "intermediate",
    "title": "Deep Dive: Next.js App Router Foundations"
  }
};
