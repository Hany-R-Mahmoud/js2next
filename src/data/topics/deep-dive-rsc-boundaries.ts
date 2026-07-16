import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "deep-dive-rsc-boundaries",
  "lesson": {
    "slug": "deep-dive-rsc-boundaries",
    "title": "Deep Dive: Server and Client Component Boundaries",
    "topicFamily": "rsc-client",
    "level": "intermediate",
    "prerequisites": [
      "deep-dive-nextjs-foundations"
    ],
    "learningObjectives": [
      "Choose the correct component boundary",
      "Pass serializable props",
      "Keep interactive islands small"
    ],
    "whyMatters": "The Server/Client boundary controls data access, browser capability, and how much JavaScript reaches the browser.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "deep-dive-rsc-boundaries-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "Server Components can access server resources and render Client Components. Client Components handle hooks, events, and browser APIs."
      },
      {
        "id": "deep-dive-rsc-boundaries-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "'use client' marks a module-graph boundary. Client Components can render server-provided children, but values crossing the boundary must obey React's serialization contract; Promises can be passed for a Client Component to read with use."
      },
      {
        "id": "deep-dive-rsc-boundaries-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "Marking an entire route as client-only for one button expands the client graph and can move server-only work into the browser. Isolating the interactive leaf preserves both capabilities."
      },
      {
        "id": "deep-dive-rsc-boundaries-example",
        "type": "code-example",
        "title": "Small client island",
        "content": "Apply the model in a small, reviewable example.",
        "code": "'use client';\n\nexport function LikeButton({ postId }: { postId: string }) {\n  return <button type=\"button\">Like {postId}</button>;\n}",
        "codeLanguage": "tsx",
        "codeFilePath": "Illustrative snippet"
      },
      {
        "id": "deep-dive-rsc-boundaries-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-rsc-boundaries-question",
            "question": "Which value is a safe ordinary prop from Server to Client?",
            "options": [
              "A database connection",
              "A class instance",
              "A post id string",
              "A function closure"
            ],
            "correctAnswer": "A post id string",
            "expectedReasoning": "A primitive string is serializable; server resources, class instances, and closures are not ordinary serializable props."
          }
        ]
      },
      {
        "id": "deep-dive-rsc-boundaries-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "'use client' marks a module-graph boundary. Client Components can render server-provided children, but values crossing the boundary must obey React's serialization contract; Promises can be passed for a Client Component to read with use.\n\nDecision clue: Marking an entire route as client-only for one button expands the client graph and can move server-only work into the browser. Isolating the interactive leaf preserves both capabilities."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-rsc-boundaries-prediction",
        "title": "Predict the boundary",
        "concept": "'use client' marks a module-graph boundary. Client Components can render server-provided children, but values crossing the boundary must obey React's serialization contract; Promises can be passed for a Client Component to read with use.",
        "prediction": {
          "prompt": "Which value is a safe ordinary prop from Server to Client?",
          "options": [
            "A database connection",
            "A class instance",
            "A post id string",
            "A function closure"
          ],
          "correctAnswer": "A post id string",
          "feedbackCorrect": "Correct. Your prediction matches the model. Now explain why it stays true under change.",
          "feedbackWrong": "Revisit the model: A primitive string is serializable; server resources, class instances, and closures are not ordinary serializable props."
        },
        "synthesis": "A primitive string is serializable; server resources, class instances, and closures are not ordinary serializable props."
      },
      {
        "id": "deep-dive-rsc-boundaries-failure-mode",
        "title": "Name the failure mode",
        "concept": "Marking an entire route as client-only for one button expands the client graph and can move server-only work into the browser. Isolating the interactive leaf preserves both capabilities.",
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
        "synthesis": "Use this clue in review: Marking an entire route as client-only for one button expands the client graph and can move server-only work into the browser. Isolating the interactive leaf preserves both capabilities."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Server and Client Component Boundaries",
      "scenario": "Apply the lesson to a small feature. Explain the boundary before writing code, then name how you would verify it.",
      "acceptance": [
        "Choose the correct component boundary",
        "Pass serializable props",
        "Keep interactive islands small",
        "Name one failure state and one observable test."
      ],
      "rubric": [
        {
          "dimension": "Model",
          "evidence": "The implementation demonstrates: Choose the correct component boundary."
        },
        {
          "dimension": "Boundary",
          "evidence": "The explanation identifies the ownership or lifecycle boundary for server and client component boundaries."
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
          "role": "Server and Client Component Boundaries"
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
    "retrievalPrompt": "Explain the core model of Server and Client Component Boundaries and name one failure mode it prevents.",
    "reflectionPrompt": "Find one place in a real frontend project where this server and client component boundaries decision could be made more explicit.",
    "masteryCriteria": [
      "Choose the correct component boundary",
      "Pass serializable props",
      "Keep interactive islands small"
    ],
    "nextTopics": [
      "deep-dive-nextjs-data"
    ],
    "metadata": {
      "lastUpdated": "2026-07-14",
      "sources": [
        "https://react.dev/reference/rsc/use-client",
        "https://nextjs.org/docs/app/getting-started/server-and-client-components"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-next-6",
      "title": "Deep Challenge: Integrate server list + client like",
      "level": 6,
      "topicFamily": "rsc-client",
      "scenario": "Posts are fetched on the server; each row needs a Like button with useState.",
      "constraints": [
        "Serializable props only",
        "\"use client\" on the button file"
      ],
      "acceptanceCriteria": [
        "Server page is async",
        "Client button is an island"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Functions are not ordinary serializable props server-to-client."
        },
        {
          "stage": 2,
          "text": "Children/islands composition is preferred."
        }
      ],
      "expectedReasoning": "Fetch on the server, isolate the client button, pass a serializable id, and use a server mutation boundary when needed.",
      "commonWrongPaths": [
        "Marking the whole page client-only for one button"
      ],
      "answerExplanation": "Keep the page on the server, isolate interactivity, and pass ids or data that serialize.",
      "followUpVariation": "Implement like via a Server Action and targeted revalidation.",
      "checkType": "multi-choice",
      "prompt": "Select all correct statements:",
      "options": [
        "The page can be an async Server Component that awaits getPosts()",
        "LikeButton should be a Client Component with \"use client\"",
        "Pass an onLike function directly from the Server Component without Server Actions",
        "Pass post id as a serializable prop into LikeButton"
      ],
      "correctIndices": [
        0,
        1,
        3
      ],
      "sourceLink": "https://react.dev/reference/rsc/use-client"
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-rsc-boundaries-question",
      "question": "Which value is a safe ordinary prop from Server to Client?",
      "answer": "A post id string",
      "followUp": "A primitive string is serializable; server resources, class instances, and closures are not ordinary serializable props.",
      "category": "nextjs",
      "level": "intermediate",
      "topicId": "deep-dive-rsc-boundaries",
      "topicFamily": "rsc-client",
      "tags": [
        "learn-react-bridge",
        "rsc-client"
      ],
      "sourceLink": "https://react.dev/reference/rsc/use-client"
    },
    {
      "id": "loop-qa-deep-dive-rsc-boundaries-1",
      "topicId": "deep-dive-rsc-boundaries",
      "topicFamily": "rsc-client",
      "question": "What problem does Deep Dive: Server and Client Component Boundaries help you solve?",
      "answer": "The Server/Client boundary controls data access, browser capability, and how much JavaScript reaches the browser.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-rsc-boundaries"
      ],
      "sourceLink": "https://react.dev/reference/rsc/use-client"
    },
    {
      "id": "loop-qa-deep-dive-rsc-boundaries-2",
      "topicId": "deep-dive-rsc-boundaries",
      "topicFamily": "rsc-client",
      "question": "How would you explain the core idea of Deep Dive: Server and Client Component Boundaries to a teammate?",
      "answer": "Explain the core model of Server and Client Component Boundaries and name one failure mode it prevents. A strong explanation should connect the model to: Choose the correct component boundary; Pass serializable props.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-rsc-boundaries"
      ],
      "sourceLink": "https://react.dev/reference/rsc/use-client"
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "rsc-client",
    "level": "intermediate",
    "title": "Deep Dive: Server and Client Component Boundaries"
  }
};
