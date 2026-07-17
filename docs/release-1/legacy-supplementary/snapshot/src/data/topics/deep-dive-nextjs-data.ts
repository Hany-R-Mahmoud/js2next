import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "deep-dive-nextjs-data",
  "lesson": {
    "slug": "deep-dive-nextjs-data",
    "title": "Deep Dive: Data Fetching, Caching & Mutations",
    "topicFamily": "nextjs-data",
    "level": "advanced",
    "prerequisites": [
      "deep-dive-rsc-boundaries"
    ],
    "learningObjectives": [
      "Make cache intent explicit",
      "Choose revalidation boundaries",
      "Model mutation and refresh states"
    ],
    "whyMatters": "Production correctness depends on knowing where data is fetched, cached, invalidated, and mutated.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "deep-dive-nextjs-data-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "Fetch data where it belongs, state cache intent explicitly, and invalidate the smallest path or tag after a mutation."
      },
      {
        "id": "deep-dive-nextjs-data-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "A request may be cached, revalidated, or dynamic depending on its options and context. Route Handlers and Server Actions have different control-flow and invalidation responsibilities."
      },
      {
        "id": "deep-dive-nextjs-data-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "A stale production page is usually a cache contract or invalidation problem, not a rendering mystery. Align fetch options and mutation revalidation with the data ownership boundary."
      },
      {
        "id": "deep-dive-nextjs-data-example",
        "type": "code-example",
        "title": "Explicit revalidation",
        "content": "Apply the model in a small, reviewable example.",
        "code": "fetch('/api/posts', { next: { revalidate: 60, tags: ['posts'] } });",
        "codeLanguage": "typescript",
        "codeFilePath": "Illustrative snippet"
      },
      {
        "id": "deep-dive-nextjs-data-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-nextjs-data-question",
            "question": "What should a CMS webhook do after a post mutation?",
            "options": [
              "Reload every browser tab",
              "Invalidate the affected path or tag",
              "Disable all caching permanently",
              "Change React keys"
            ],
            "correctAnswer": "Invalidate the affected path or tag",
            "expectedReasoning": "Targeted invalidation refreshes the affected cached data without discarding unrelated cache policy."
          }
        ]
      },
      {
        "id": "deep-dive-nextjs-data-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "A request may be cached, revalidated, or dynamic depending on its options and context. Route Handlers and Server Actions have different control-flow and invalidation responsibilities.\n\nDecision clue: A stale production page is usually a cache contract or invalidation problem, not a rendering mystery. Align fetch options and mutation revalidation with the data ownership boundary."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-nextjs-data-prediction",
        "title": "Predict the boundary",
        "concept": "A request may be cached, revalidated, or dynamic depending on its options and context. Route Handlers and Server Actions have different control-flow and invalidation responsibilities.",
        "prediction": {
          "prompt": "What should a CMS webhook do after a post mutation?",
          "options": [
            "Reload every browser tab",
            "Invalidate the affected path or tag",
            "Disable all caching permanently",
            "Change React keys"
          ],
          "correctAnswer": "Invalidate the affected path or tag",
          "feedbackCorrect": "Correct. Your prediction matches the model. Now explain why it stays true under change.",
          "feedbackWrong": "Revisit the model: Targeted invalidation refreshes the affected cached data without discarding unrelated cache policy."
        },
        "synthesis": "Targeted invalidation refreshes the affected cached data without discarding unrelated cache policy."
      },
      {
        "id": "deep-dive-nextjs-data-failure-mode",
        "title": "Name the failure mode",
        "concept": "A stale production page is usually a cache contract or invalidation problem, not a rendering mystery. Align fetch options and mutation revalidation with the data ownership boundary.",
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
        "synthesis": "Use this clue in review: A stale production page is usually a cache contract or invalidation problem, not a rendering mystery. Align fetch options and mutation revalidation with the data ownership boundary."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Data Fetching, Caching & Mutations",
      "scenario": "Apply the lesson to a small feature. Explain the boundary before writing code, then name how you would verify it.",
      "acceptance": [
        "Make cache intent explicit",
        "Choose revalidation boundaries",
        "Model mutation and refresh states",
        "Name one failure state and one observable test."
      ],
      "rubric": [
        {
          "dimension": "Model",
          "evidence": "The implementation demonstrates: Make cache intent explicit."
        },
        {
          "dimension": "Boundary",
          "evidence": "The explanation identifies the ownership or lifecycle boundary for data fetching, caching & mutations."
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
          "role": "Data Fetching, Caching & Mutations"
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
    "retrievalPrompt": "Explain the core model of Data Fetching, Caching & Mutations and name one failure mode it prevents.",
    "reflectionPrompt": "Find one place in a real frontend project where this data fetching, caching & mutations decision could be made more explicit.",
    "masteryCriteria": [
      "Make cache intent explicit",
      "Choose revalidation boundaries",
      "Model mutation and refresh states"
    ],
    "nextTopics": [
      "deep-dive-production-concerns"
    ],
    "metadata": {
      "lastUpdated": "2026-07-14",
      "sources": [
        "https://nextjs.org/docs/app/building-your-application/caching",
        "https://nextjs.org/docs/15/app/guides/caching",
        "https://nextjs.org/docs/15/app/guides/forms"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-data-9",
      "title": "Deep Challenge: Production stale cache failure",
      "level": 9,
      "topicFamily": "nextjs-data",
      "scenario": "Editors update a blog post in a CMS, but production shows old content for minutes while staging uses no-store.",
      "constraints": [
        "Do not disable all caching without reason"
      ],
      "acceptanceCriteria": [
        "Mentions revalidation",
        "Mentions a tag or path",
        "Mentions the environment difference"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Production may be caching the fetch or render."
        },
        {
          "stage": 2,
          "text": "A CMS webhook can revalidate a path or tag."
        },
        {
          "stage": 3,
          "text": "Compare fetch options between staging and production."
        }
      ],
      "expectedReasoning": "A cached render or fetch lacks targeted invalidation after the CMS mutation.",
      "commonWrongPaths": [
        "Blaming React keys"
      ],
      "answerExplanation": "Use a CMS webhook to revalidate the affected path or tag and align cache intent across environments.",
      "followUpVariation": "How would you verify cache headers during an incident?",
      "checkType": "free-text",
      "prompt": "Hypothesize the root cause and a precise fix.",
      "freeTextKeywords": [
        "revalidat",
        "cache"
      ],
      "sourceLink": "https://nextjs.org/docs/app/guides/caching-without-cache-components"
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-nextjs-data-question",
      "question": "What should a CMS webhook do after a post mutation?",
      "answer": "Invalidate the affected path or tag",
      "followUp": "Targeted invalidation refreshes the affected cached data without discarding unrelated cache policy.",
      "category": "nextjs",
      "level": "advanced",
      "topicId": "deep-dive-nextjs-data",
      "topicFamily": "nextjs-data",
      "tags": [
        "learn-react-bridge",
        "nextjs-data"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/caching"
    },
    {
      "id": "loop-qa-deep-dive-nextjs-data-1",
      "topicId": "deep-dive-nextjs-data",
      "topicFamily": "nextjs-data",
      "question": "What problem does Deep Dive: Data Fetching, Caching & Mutations help you solve?",
      "answer": "Production correctness depends on knowing where data is fetched, cached, invalidated, and mutated.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "deep-dive-nextjs-data"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/caching"
    },
    {
      "id": "loop-qa-deep-dive-nextjs-data-2",
      "topicId": "deep-dive-nextjs-data",
      "topicFamily": "nextjs-data",
      "question": "How would you explain the core idea of Deep Dive: Data Fetching, Caching & Mutations to a teammate?",
      "answer": "Explain the core model of Data Fetching, Caching & Mutations and name one failure mode it prevents. A strong explanation should connect the model to: Make cache intent explicit; Choose revalidation boundaries.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "deep-dive-nextjs-data"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/caching"
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "nextjs-data",
    "level": "advanced",
    "title": "Deep Dive: Data Fetching, Caching & Mutations"
  }
};
