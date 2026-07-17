import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "expansion-performance-diagnosis",
  "lesson": {
    "slug": "expansion-performance-diagnosis",
    "title": "Measure Render Performance Before Optimizing",
    "topicFamily": "production",
    "level": "advanced",
    "prerequisites": [
      "deep-dive-react-mental-model",
      "production-deployment"
    ],
    "learningObjectives": [
      "Separate a user-visible performance symptom from an assumed cause",
      "Use profiling evidence to find expensive renders or calculations",
      "Explain memoization trade-offs and dependency correctness",
      "Measure production-like behavior before declaring an optimization successful"
    ],
    "whyMatters": "Performance fixes can add complexity without changing the bottleneck. A repeatable measurement loop keeps memoization, data loading, and bundle work tied to evidence users can feel.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "expansion-performance-diagnosis-model",
        "type": "concept",
        "title": "Start with the symptom",
        "content": "Name the interaction and measure it. Check render work, calculation cost, network waterfalls, JavaScript transfer, and hydration before choosing a fix."
      },
      {
        "id": "expansion-performance-diagnosis-code",
        "type": "code-example",
        "title": "Optimize a measured boundary",
        "content": "Memoization can skip work when its inputs are stable, but it is an optimization. Keep the component pure and verify that the dependency or prop boundary matches the expensive work.",
        "code": "const visibleRows = useMemo(\n  () => filterRows(rows, query),\n  [rows, query],\n);\n\nconst Row = memo(ProjectRow);",
        "codeLanguage": "tsx",
        "codeFilePath": "Measured list boundary"
      },
      {
        "id": "expansion-performance-diagnosis-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-performance-diagnosis-check",
            "question": "What should you do before adding memo to a slow list?",
            "options": [
              "Add memo to every component",
              "Profile the interaction and identify the expensive work or unstable boundary",
              "Move all state to a global store",
              "Disable development checks"
            ],
            "correctAnswer": "Profile the interaction and identify the expensive work or unstable boundary",
            "expectedReasoning": "Profiling connects a symptom to a bottleneck. Memo may help one boundary, but it cannot fix a server waterfall, a large download, or an incorrect dependency."
          }
        ]
      },
      {
        "id": "expansion-performance-diagnosis-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Measure the interaction, isolate the bottleneck, choose the smallest fix, and measure again in a production-like build. Treat memoization as a measured optimization, not a default architecture rule."
      }
    ],
    "retrievalPrompt": "What evidence would distinguish render work from a network, JavaScript-transfer, or hydration bottleneck?",
    "reflectionPrompt": "Choose one slow interaction. What is the baseline measurement, what boundary might be expensive, and what result would prove the fix helped?",
    "masteryCriteria": [
      "Can name a measurable performance symptom",
      "Can choose profiling evidence for the suspected bottleneck",
      "Can explain memoization trade-offs",
      "Can compare before/after behavior in a production-like build"
    ],
    "nextTopics": [
      "deep-dive-production-concerns"
    ],
    "metadata": {
      "lastUpdated": "2026-07-15",
      "sources": [
        "https://react.dev/reference/react/memo",
        "https://react.dev/reference/react/useMemo",
        "https://react.dev/reference/react/Profiler",
        "https://nextjs.org/docs/15/app/guides/production-checklist"
      ]
    },
    "diagram": {
      "title": "Measure before optimizing",
      "kind": "flow",
      "nodes": [
        {
          "id": "symptom",
          "label": "User-visible symptom",
          "role": "Interaction or load delay"
        },
        {
          "id": "profile",
          "label": "Profile evidence",
          "role": "Render, network, bundle, or server"
        },
        {
          "id": "fix",
          "label": "Smallest fix",
          "role": "Target the dominant cost"
        },
        {
          "id": "compare",
          "label": "Measure again",
          "role": "Observed result"
        }
      ],
      "edges": [
        {
          "from": "symptom",
          "to": "profile"
        },
        {
          "from": "profile",
          "to": "fix"
        },
        {
          "from": "fix",
          "to": "compare"
        }
      ]
    },
    "chunks": [
      {
        "id": "expansion-performance-diagnosis-retrieval-1",
        "title": "Reject optimization by reflex",
        "concept": "A slow interaction is not proof of a render bottleneck; profiling separates render work from network, bundle, and server costs.",
        "prediction": {
          "prompt": "What should happen before adding memoization?",
          "options": [
            "Profile the user-visible interaction",
            "Add memo to every row"
          ],
          "correctAnswer": "Profile the user-visible interaction",
          "feedbackCorrect": "A baseline identifies whether memoization targets the real cost.",
          "feedbackWrong": "Blanket memoization can add complexity without improving the bottleneck."
        },
        "synthesis": "Measure the same interaction before and after the smallest evidence-backed change."
      }
    ],
    "miniProject": {
      "title": "Investigate a slow project list",
      "scenario": "Create a measurement plan for typing latency, render work, network waterfalls, and a production-like comparison.",
      "acceptance": [
        "At least one baseline metric is recorded",
        "Alternative bottlenecks are considered",
        "The fix is re-measured after implementation"
      ],
      "rubric": [
        {
          "dimension": "Evidence",
          "evidence": "The hypothesis is connected to a concrete profile or browser signal."
        },
        {
          "dimension": "Scope",
          "evidence": "The fix targets the dominant boundary rather than adding broad memoization."
        },
        {
          "dimension": "Outcome",
          "evidence": "Before/after results and trade-offs are recorded."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-profile-render-hotspot",
      "title": "Profile a Slow Project List",
      "level": 7,
      "topicFamily": "production",
      "scenario": "Typing into a project filter feels slow. The list contains expensive row calculations, but the team is considering memoization before checking whether the delay comes from rendering, data fetching, or a large client bundle.",
      "constraints": [
        "Define the user interaction and baseline",
        "Use profiling or browser performance evidence",
        "Choose the smallest boundary-level fix",
        "Compare the result in a production-like build"
      ],
      "acceptanceCriteria": [
        "The suspected bottleneck is supported by a measurement",
        "The proposed memoization boundary has stable, correct inputs",
        "Network and bundle causes are considered before render-only changes",
        "The result is measured again and recorded as an observed change"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write down the interaction, start/end markers, and baseline before editing."
        },
        {
          "stage": 2,
          "text": "Use the React Profiler or browser Performance panel to separate render work from network and long-task costs."
        },
        {
          "stage": 3,
          "text": "Memoize only the measured boundary and verify props/dependencies preserve correctness."
        }
      ],
      "expectedReasoning": "A slow interaction is not proof of a render bottleneck. Evidence should identify the dominant cost; memoization is one possible optimization and must be validated after the change.",
      "commonWrongPaths": [
        "Adding memo everywhere without a baseline",
        "Using an empty dependency array to silence recomputation",
        "Ignoring a server waterfall or bundle-size problem",
        "Treating development timing as production truth"
      ],
      "answerExplanation": "Capture a baseline, profile the interaction, classify the dominant cost, apply the smallest evidence-backed fix, and compare the same measurement in a production-like build.",
      "followUpVariation": "The rows are fast, but the initial page is slow because a client boundary ships too much JavaScript. Re-plan the fix.",
      "checkType": "free-text",
      "prompt": "Explain how you would investigate and improve this interaction without guessing.",
      "freeTextKeywords": [
        "profile",
        "measure",
        "memo",
        "production"
      ],
      "sourceLink": "https://react.dev/reference/react/Profiler",
      "sourceLinks": [
        "https://react.dev/reference/react/memo",
        "https://nextjs.org/docs/15/app/guides/production-checklist"
      ]
    }
  ],
  "qa": [
    {
      "id": "learn-react-qa-extra-1",
      "category": "performance",
      "level": "intermediate",
      "question": "When should I memoize with useMemo or useCallback?",
      "answer": "Use them for a measured expensive calculation or a stable reference required by an optimized child or Effect. Avoid blanket memoization because it adds complexity.",
      "followUp": "How would you measure whether memoization helped?",
      "tags": [
        "learn-react-bridge",
        "memoization"
      ],
      "sourceLink": "https://react.dev/reference/react/useMemo",
      "topicId": "expansion-performance-diagnosis",
      "topicFamily": "production"
    },
    {
      "id": "expansion-qa-profiler",
      "topicId": "expansion-performance-diagnosis",
      "topicFamily": "production",
      "question": "What does the React Profiler help you learn?",
      "answer": "It records render timing data for a component tree so you can investigate which interactions or components consume time. It does not by itself prove that memoization is the right fix.",
      "followUp": "Which other evidence would you collect for a slow initial page?",
      "category": "performance",
      "level": "advanced",
      "tags": [
        "expansion-performance-diagnosis",
        "profiling",
        "rendering"
      ],
      "sourceLink": "https://react.dev/reference/react/Profiler"
    },
    {
      "id": "expansion-qa-memoization",
      "topicId": "expansion-performance-diagnosis",
      "topicFamily": "production",
      "question": "Why is memoization an optimization rather than a correctness fix?",
      "answer": "memo and useMemo can skip or cache work when inputs are unchanged, but correctness still depends on pure rendering, complete props/dependencies, and the actual bottleneck. They add comparison or cache complexity and should be measured.",
      "followUp": "What can a memoized component still re-render for?",
      "category": "react",
      "level": "advanced",
      "tags": [
        "expansion-performance-diagnosis",
        "memo",
        "useMemo"
      ],
      "sourceLink": "https://react.dev/reference/react/memo",
      "sourceLinks": [
        "https://react.dev/reference/react/useMemo"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-measure-before-memo",
      "topicId": "expansion-performance-diagnosis",
      "topicFamily": "production",
      "title": "Measure Before Adding Memoization",
      "summary": "Profile a user-visible interaction and identify its dominant cost before adding memo or useMemo.",
      "rationale": "Memoization only addresses certain render or calculation costs. A baseline prevents optimizing the wrong layer and gives the team a result to compare.",
      "tradeOffs": "Profiling takes time and can reveal multiple contributors. That is cheaper than carrying memoization boundaries that obscure data flow without improving the measured interaction.",
      "appliesWhen": "A render or interaction is slow enough to affect users and the cause is not yet proven.",
      "doesNotApplyWhen": "There is no measured symptom or the bottleneck is clearly outside render work.",
      "example": "Record filter latency, profile the list, then memoize the measured row boundary only if stable props make the comparison useful.",
      "sourceLink": "https://react.dev/reference/react/Profiler",
      "sourceLinks": [
        "https://react.dev/reference/react/memo",
        "https://react.dev/reference/react/useMemo",
        "https://nextjs.org/docs/15/app/guides/production-checklist"
      ],
      "tags": [
        "expansion-performance-diagnosis",
        "profiling",
        "optimization"
      ]
    }
  ],
  "meta": {
    "topicFamily": "production",
    "level": "advanced",
    "title": "Measure Render Performance Before Optimizing"
  }
};
