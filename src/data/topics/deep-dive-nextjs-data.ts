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
      "Choose cached or fresh reads explicitly in Next.js 15.5.20",
      "Distinguish request data, cached data, and cached route output",
      "Use paths or tags to revalidate the smallest affected ownership boundary",
      "Design mutations with validation, authorization, pending, success, and failure states"
    ],
    "whyMatters": "A data feature is correct only when its read, freshness, mutation, and recovery rules agree. Naming those rules prevents a page from looking current in development while serving stale or unauthorized results in production.",
    "estimatedMinutes": 44,
    "sections": [
      {
        "id": "deep-dive-nextjs-data-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "Start with the product promise: must this read be fresh on every request, may it be reused, or may it be stale for a known time? In Next.js 15, `fetch` responses are not cached by default. Use `cache: \"force-cache\"` for data you deliberately want in the Data Cache, `cache: \"no-store\"` for a fresh request, or `next.revalidate` for a time limit. Tags give shared data a name for later invalidation.\n\nA route may still be prerendered and its output cached even when these layers differ. Keep the read policy, route rendering behavior, and browser navigation cache as separate questions. Test the deployed behavior instead of using “cached” as one undifferentiated label."
      },
      {
        "id": "deep-dive-nextjs-data-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "A Server Component can read data directly. A Route Handler defines an HTTP endpoint for callers that need one. A Server Function can handle a mutation started by React UI. Both server boundaries receive untrusted input and must validate and authorize before changing protected data.\n\nAfter a successful write, `revalidatePath` makes route output for a path stale, while `revalidateTag` targets cached data labeled with that tag. Choose the target from ownership: a path for route-specific output, a tag for the same data used in several routes. In a webhook, authenticate the sender before invalidating anything."
      },
      {
        "id": "deep-dive-nextjs-data-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "Stale output is usually a mismatch between the read policy and the event that changes data. Disabling every cache hides that mismatch but gives up useful reuse. Revalidating everything creates unrelated work. A precise contract says who owns the data, how stale it may be, what mutation changes it, and which path or tag becomes stale afterward. Revalidation follows a successful write; it does not make a failed mutation successful."
      },
      {
        "id": "deep-dive-nextjs-data-example",
        "type": "code-example",
        "title": "Explicit revalidation",
        "content": "This read is deliberately cached and tagged. The Server Function validates and authorizes before writing, then revalidates the shared data tag only after success.",
        "code": "const posts = await fetch(cmsUrl, {\n  cache: 'force-cache',\n  next: { tags: ['posts'] },\n}).then(response => {\n  if (!response.ok) throw new Error(`CMS ${response.status}`);\n  return response.json();\n});\n\n'use server';\nasync function updatePost(formData: FormData) {\n  const input = parsePost(formData);\n  const user = await requireUser();\n  await authorizePostEdit(user, input.id);\n  await savePost(input);\n  revalidateTag('posts');\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/posts/data.ts + app/posts/actions.ts"
      },
      {
        "id": "deep-dive-nextjs-data-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-nextjs-data-question",
            "question": "A signed CMS webhook reports that post 42 changed, and several routes read data tagged `posts`. What is the clearest next step after verifying the webhook?",
            "options": [
              "Revalidate the affected `posts` tag",
              "Disable every cache in the application permanently",
              "Change React list keys so the server data becomes fresh",
              "Reload every user’s browser tab from the webhook"
            ],
            "correctAnswer": "Revalidate the affected `posts` tag",
            "expectedReasoning": "The tag represents shared post data across routes, so targeted invalidation matches ownership. Disabling all caching removes an unrelated capability, React keys do not control the server data cache, and a server webhook cannot depend on forcing every open browser tab to reload."
          }
        ]
      },
      {
        "id": "deep-dive-nextjs-data-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Write a complete data contract: read owner, cache choice, acceptable staleness, mutation trust boundary, and post-success invalidation. Use a path for route-specific output and a tag for shared data identity. Show pending and recoverable failure in the UI, but keep validation and authorization on the server operation."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-nextjs-data-prediction",
        "title": "Predict the boundary",
        "concept": "Cache policy begins with freshness requirements, not a universal default.",
        "prediction": {
          "prompt": "A price must be fresh for every request. Which fetch intent is clearest?",
          "options": [
            "`cache: \"no-store\"`",
            "`cache: \"force-cache\"` with no invalidation plan",
            "A random React key"
          ],
          "correctAnswer": "`cache: \"no-store\"`",
          "feedbackCorrect": "The request explicitly opts out of reuse for this freshness requirement.",
          "feedbackWrong": "A persistent cache or client key does not express “fresh on every server request.”"
        },
        "synthesis": "State the freshness promise before choosing the API."
      },
      {
        "id": "deep-dive-nextjs-data-failure-mode",
        "title": "Name the failure mode",
        "concept": "Invalidation follows data identity and a successful mutation.",
        "prediction": {
          "prompt": "One post title changes and cached post lists share a `posts` tag. What should the mutation do after saving?",
          "options": [
            "Revalidate the relevant tag",
            "Invalidate before authorization",
            "Clear unrelated user caches"
          ],
          "correctAnswer": "Revalidate the relevant tag",
          "feedbackCorrect": "The tag reaches the cached reads whose data is now stale.",
          "feedbackWrong": "Authorization and the write come first; unrelated cache entries should keep their policy."
        },
        "synthesis": "Successful writes create staleness; invalidate the smallest boundary that owns it."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Data Fetching, Caching & Mutations",
      "scenario": "Design a cached post list, protected edit action, and authenticated CMS webhook.",
      "acceptance": [
        "Every read has an explicit Next.js 15.5.20 cache and freshness policy",
        "The edit validates input and authorizes the current user before saving",
        "The webhook authenticates its sender before targeted invalidation",
        "Pending, validation failure, service failure, success, and refreshed output are observable"
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
    "retrievalPrompt": "For a product read and edit, state the fetch cache option, acceptable staleness, mutation boundary, revalidation target, and user-visible pending and failure states.",
    "reflectionPrompt": "Choose one cached screen. What exactly is cached, what event makes it stale, and which path or tag should become current after a successful write?",
    "masteryCriteria": [
      "Can state that Next.js 15 fetch responses are not cached by default",
      "Can select no-store, force-cache, time revalidation, path, or tag from a freshness requirement",
      "Can distinguish a Route Handler from a Server Function mutation",
      "Validates and authorizes before writing, then revalidates only after success"
    ],
    "nextTopics": [
      "deep-dive-production-concerns"
    ],
    "metadata": {
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/app/building-your-application/caching",
        "https://nextjs.org/docs/15/app/guides/caching",
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://nextjs.org/docs/15/app/getting-started/fetching-data",
        "https://nextjs.org/docs/15/app/getting-started/updating-data",
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidatePath",
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidateTag"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-data-9",
      "title": "Deep Challenge: Production stale cache failure",
      "level": 9,
      "topicFamily": "nextjs-data",
      "scenario": "Editors update a CMS post, but production keeps old content while staging uses fresh reads. Diagnose the cache contract and design a precise production repair.",
      "constraints": [
        "Do not disable all caching without a stated freshness requirement",
        "Compare the read and rendering policy in both environments",
        "Authenticate any webhook before it can trigger invalidation"
      ],
      "acceptanceCriteria": [
        "The hypothesis names the cached read or route output that can remain stale",
        "The proposed fix chooses a path or tag that matches the changed data",
        "A failed or unauthorized mutation does not trigger success revalidation",
        "Verification repeats the production-like request and observes the expected freshness"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write down the exact `fetch` options and whether the route output is prerendered in each environment."
        },
        {
          "stage": 2,
          "text": "If several pages read the same post data, a tag may express ownership better than one route path."
        },
        {
          "stage": 3,
          "text": "Have the CMS webhook prove its identity, then invalidate only after the CMS confirms the change."
        }
      ],
      "expectedReasoning": "Staging and production use different freshness contracts. Production needs either a deliberate staleness window or an authenticated event that invalidates the cached data or route output. The repair should be measured against a production-like build rather than inferred from development mode.",
      "commonWrongPaths": [
        "Blaming React keys for a server cache problem",
        "Switching every request to no-store without evaluating the product requirement",
        "Allowing an unauthenticated webhook to invalidate arbitrary paths or tags"
      ],
      "answerExplanation": "Trace the read and route-output caches, align their policy across environments, and connect the successful CMS mutation to a verified, targeted invalidation boundary.",
      "followUpVariation": "A post detail page must update immediately, but the archive may be five minutes stale. Give each read a different explicit policy.",
      "checkType": "free-text",
      "prompt": "Hypothesize the root cause and a precise fix.",
      "freeTextKeywords": [
        "revalidat",
        "cache"
      ],
      "sourceLink": "https://nextjs.org/docs/app/guides/caching-without-cache-components",
      "sourceLinks": [
        "https://nextjs.org/docs/app/guides/caching-without-cache-components",
        "https://nextjs.org/docs/15/app/guides/caching",
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidateTag",
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidatePath"
      ]
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-nextjs-data-question",
      "question": "What should a CMS webhook do after a post mutation?",
      "answer": "After authenticating the webhook and confirming the mutation, revalidate the affected path or data tag. Use a tag when several routes share the same cached data and a path when the stale ownership is route-specific.",
      "followUp": "Which routes consume the changed data, and does a shared tag or one path express that ownership better?",
      "category": "nextjs",
      "level": "advanced",
      "topicId": "deep-dive-nextjs-data",
      "topicFamily": "nextjs-data",
      "tags": [
        "learn-react-bridge",
        "nextjs-data"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/caching",
      "sourceLinks": [
        "https://nextjs.org/docs/app/building-your-application/caching",
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidateTag",
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidatePath"
      ]
    },
    {
      "id": "loop-qa-deep-dive-nextjs-data-1",
      "topicId": "deep-dive-nextjs-data",
      "topicFamily": "nextjs-data",
      "question": "What belongs in a complete Next.js data contract?",
      "answer": "Name the read owner, explicit cache behavior, acceptable staleness, mutation boundary, validation and authorization checks, success invalidation, and user-visible pending and failure states. These decisions must agree for the feature to stay correct.",
      "followUp": "Which one of those decisions is currently implicit in your project?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "deep-dive-nextjs-data"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/caching",
      "sourceLinks": [
        "https://nextjs.org/docs/app/building-your-application/caching",
        "https://nextjs.org/docs/15/app/getting-started/fetching-data",
        "https://nextjs.org/docs/15/app/getting-started/updating-data"
      ]
    },
    {
      "id": "loop-qa-deep-dive-nextjs-data-2",
      "topicId": "deep-dive-nextjs-data",
      "topicFamily": "nextjs-data",
      "question": "How do `revalidatePath` and `revalidateTag` express different ownership?",
      "answer": "`revalidatePath` targets cached output associated with a route path. `revalidateTag` targets cached data labeled with a tag, which can be shared by several routes. Choose the smallest target that represents what the mutation made stale.",
      "followUp": "What is one mutation where a shared tag is more accurate than a single path?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "deep-dive-nextjs-data"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/caching",
      "sourceLinks": [
        "https://nextjs.org/docs/app/building-your-application/caching",
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidatePath",
        "https://nextjs.org/docs/15/app/api-reference/functions/revalidateTag"
      ]
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "nextjs-data",
    "level": "advanced",
    "title": "Deep Dive: Data Fetching, Caching & Mutations"
  }
};
