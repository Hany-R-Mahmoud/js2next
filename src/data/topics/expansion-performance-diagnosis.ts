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
      "Describe a slow user interaction before proposing a cause",
      "Use React and browser profiles to locate the dominant cost",
      "Choose memoization only when stable inputs let it skip measured work",
      "Compare the same interaction before and after a change in a production-like build"
    ],
    "whyMatters": "A pause while typing can come from rendering, a calculation, a request waterfall, a large JavaScript download, or hydration. Measuring first keeps the repair focused and prevents an optimization from adding complexity to the wrong part of the app.",
    "estimatedMinutes": 38,
    "sections": [
      {
        "id": "expansion-performance-diagnosis-model",
        "type": "concept",
        "title": "Start with the symptom",
        "content": "Begin with what the user experiences: for example, “after each key press, the filtered rows appear 300 ms later.” Reproduce the same interaction with the same data size and record a baseline. Then inspect the likely layers separately: network timing, JavaScript transfer and long tasks, React render commits, and expensive calculations.\n\nA React profile can show which components rendered and how long a commit took. It cannot by itself prove that the network, server, or bundle is fast. Use the tool whose signal matches the suspected boundary, and keep alternative explanations open until the evidence rules them out."
      },
      {
        "id": "expansion-performance-diagnosis-code",
        "type": "code-example",
        "title": "Optimize a measured boundary",
        "content": "If the profile shows that filtering is expensive and repeats with unchanged rows and query, useMemo can cache that calculation. If a costly row repeatedly receives unchanged props, memo may skip its parent-driven render. Both remain performance optimizations: keep render logic correct without them, and note that React Compiler may reduce the need for manual memoization when the project actually enables it.",
        "code": "const visibleRows = useMemo(\n  () => filterRows(rows, query),\n  [rows, query],\n);\n\nconst ProjectRow = memo(function ProjectRow({ project }: Props) {\n  return <li>{project.name}</li>;\n});",
        "codeLanguage": "tsx",
        "codeFilePath": "app/projects/ProjectList.tsx"
      },
      {
        "id": "expansion-performance-diagnosis-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-performance-diagnosis-check",
            "question": "Typing in a project filter feels slow, but no profile has been captured. What is the strongest next step?",
            "options": [
              "Reproduce and profile the interaction while also checking network and main-thread evidence",
              "Wrap every component in memo before measuring",
              "Use an empty dependency array so the filtered rows never recompute",
              "Assume development timing exactly matches the production build"
            ],
            "correctAnswer": "Reproduce and profile the interaction while also checking network and main-thread evidence",
            "expectedReasoning": "A baseline and profile connect the visible delay to a boundary. Blanket memoization may not affect a request or bundle bottleneck, an incomplete dependency array can return stale results, and development timing is not production evidence."
          }
        ]
      },
      {
        "id": "expansion-performance-diagnosis-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Use a short loop: describe one user-visible symptom, reproduce it, collect the matching evidence, change the smallest responsible boundary, and repeat the same measurement. Keep the optimization only when the interaction improves without stale data, missed updates, or a maintenance cost larger than the benefit."
      }
    ],
    "retrievalPrompt": "For a slow list filter, describe the symptom, baseline, evidence that separates render work from network or bundle work, proposed change, and before/after comparison.",
    "reflectionPrompt": "Choose one delay a user can feel. What exactly starts and ends the interaction, which evidence will locate the cost, and what improvement would be meaningful?",
    "masteryCriteria": [
      "Can state a reproducible symptom and baseline instead of an assumed cause",
      "Can read a React commit profile alongside browser network and main-thread evidence",
      "Can explain when memo, useMemo, or no memoization is the smaller choice",
      "Can verify correctness and performance in the same production-like scenario"
    ],
    "nextTopics": [
      "deep-dive-production-concerns"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
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
        "concept": "Performance diagnosis separates a visible symptom from render, calculation, network, bundle, server, and hydration causes.",
        "prediction": {
          "prompt": "A React commit is fast, but the page waits on three sequential requests. Which first change follows the evidence?",
          "options": [
            "Investigate the request waterfall",
            "Add memo to every row",
            "Remove correct dependencies"
          ],
          "correctAnswer": "Investigate the request waterfall",
          "feedbackCorrect": "The measured delay is outside the row render, so the request sequence is the useful boundary to inspect.",
          "feedbackWrong": "Memoization or incomplete dependencies do not shorten a measured network waterfall and may add new problems."
        },
        "synthesis": "Let the dominant measured cost choose the repair."
      }
    ],
    "miniProject": {
      "title": "Investigate a slow project list",
      "scenario": "Investigate a project list where typing can trigger filtering, row renders, and an optional server search.",
      "acceptance": [
        "The interaction, data size, environment, and baseline are recorded",
        "React commits, browser work, and request timing are compared before choosing a cause",
        "The proposed change targets one measured boundary and preserves correct dependencies",
        "The same production-like scenario is measured again and the trade-off is documented"
      ],
      "rubric": [
        {
          "dimension": "Evidence",
          "evidence": "The leading hypothesis is supported by a named profile or browser signal."
        },
        {
          "dimension": "Correctness",
          "evidence": "The optimization preserves current props, state, context, and dependency behavior."
        },
        {
          "dimension": "Outcome",
          "evidence": "Before/after results use the same interaction and include the observed maintenance cost."
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
      "scenario": "A 1,000-row project list pauses after each key press. A teammate proposes memo on every component, but the route can also refetch and ships a large client bundle. Produce an evidence-based diagnosis and one smallest repair.",
      "constraints": [
        "Use the same query, data size, and production-like build for comparisons",
        "Inspect render commits, main-thread work, and request timing before choosing the bottleneck",
        "Keep every calculation dependency and component input correct",
        "Record a measurable result and any new complexity"
      ],
      "acceptanceCriteria": [
        "The baseline names a user-visible start, end, and duration",
        "Evidence identifies the dominant boundary rather than merely listing possibilities",
        "Memoization is used only if repeated expensive work and stable inputs justify it",
        "The follow-up measurement uses the same scenario and checks correct results",
        "An ineffective change can be removed cleanly"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Record one slow key press and inspect both the React commit and browser network/main-thread timeline."
        },
        {
          "stage": 2,
          "text": "If rows are expensive, check whether their props are actually unchanged between renders."
        },
        {
          "stage": 3,
          "text": "Repeat the exact interaction after one change; do not compare unrelated runs."
        }
      ],
      "expectedReasoning": "The visible pause does not identify its cause. A controlled baseline and matching profiles locate the dominant cost. Manual memoization is useful only when it can skip measured repeated work with stable inputs; other evidence may instead point to request, bundle, or state-placement changes.",
      "commonWrongPaths": [
        "Adding memo everywhere without a baseline",
        "Omitting a dependency so cached data becomes stale",
        "Ignoring a measured request waterfall or long task",
        "Comparing development timing with a different production scenario"
      ],
      "answerExplanation": "Measure one reproducible interaction, classify the dominant cost, change one boundary, and repeat the same measurement. Keep manual memoization only when the profile and stable inputs show that it saves meaningful work.",
      "followUpVariation": "The React profile is fast, but the first interaction waits for a dynamically loaded client bundle. Redesign the investigation around transfer and execution evidence.",
      "checkType": "free-text",
      "prompt": "Describe the baseline, evidence, smallest change, correctness checks, and before/after result for this slow list.",
      "freeTextKeywords": [
        "baseline",
        "profile",
        "bottleneck",
        "production"
      ],
      "sourceLink": "https://react.dev/reference/react/Profiler",
      "sourceLinks": [
        "https://react.dev/reference/react/Profiler",
        "https://react.dev/reference/react/memo",
        "https://nextjs.org/docs/15/app/guides/production-checklist",
        "https://react.dev/reference/react/useMemo"
      ]
    }
  ],
  "qa": [
    {
      "id": "learn-react-qa-extra-1",
      "category": "performance",
      "level": "intermediate",
      "question": "When should I memoize with useMemo or useCallback?",
      "answer": "Use useMemo for a measured expensive calculation whose dependencies are complete, or useCallback when a stable function reference is required by a measured optimized boundary or synchronization contract. Do not add either by default: the cache has a readability and comparison cost, and React Compiler may already provide memoization if the project enables it.",
      "followUp": "Which profile would show that the same expensive calculation or child render is repeating with unchanged inputs?",
      "tags": [
        "learn-react-bridge",
        "memoization"
      ],
      "sourceLink": "https://react.dev/reference/react/useMemo",
      "topicId": "expansion-performance-diagnosis",
      "topicFamily": "production",
      "sourceLinks": [
        "https://react.dev/reference/react/useMemo",
        "https://react.dev/reference/react/memo"
      ]
    },
    {
      "id": "expansion-qa-profiler",
      "topicId": "expansion-performance-diagnosis",
      "topicFamily": "production",
      "question": "What does the React Profiler help you learn?",
      "answer": "The React Profiler records when a profiled tree commits and how much rendering work it performed. Use it to locate expensive or repeated renders for a specific interaction, then compare it with browser network and main-thread evidence because it does not measure every possible bottleneck.",
      "followUp": "If the React commit is short, which browser evidence would you inspect next?",
      "category": "performance",
      "level": "advanced",
      "tags": [
        "expansion-performance-diagnosis",
        "profiling",
        "rendering"
      ],
      "sourceLink": "https://react.dev/reference/react/Profiler",
      "sourceLinks": [
        "https://react.dev/reference/react/Profiler"
      ]
    },
    {
      "id": "expansion-qa-memoization",
      "topicId": "expansion-performance-diagnosis",
      "topicFamily": "production",
      "question": "Why is memoization an optimization rather than a correctness fix?",
      "answer": "memo and useMemo may skip work when relevant inputs are unchanged, but React may still render a memoized component and its own state or consumed context can still change. Correctness must come from pure rendering and complete inputs; memoization is kept only when measurement shows a useful performance benefit.",
      "followUp": "Which changing object, function, state, or context value could make your memo boundary render again?",
      "category": "react",
      "level": "advanced",
      "tags": [
        "expansion-performance-diagnosis",
        "memo",
        "useMemo"
      ],
      "sourceLink": "https://react.dev/reference/react/memo",
      "sourceLinks": [
        "https://react.dev/reference/react/memo",
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
      "summary": "Measure one reproducible user interaction and locate its dominant cost before adding manual memoization.",
      "rationale": "memo and useMemo only address particular repeated render or calculation work. A baseline prevents a render optimization from being applied to a request, bundle, server, or hydration problem.",
      "tradeOffs": "Profiling takes focused setup, and memoization adds comparisons and cognitive load. The result is a smaller change with evidence, plus a clear reason to remove it if the benefit disappears.",
      "appliesWhen": "A user-visible interaction is slow enough to measure and render or calculation work is a plausible contributor.",
      "doesNotApplyWhen": "There is no reproducible symptom, or evidence already locates the delay outside React rendering.",
      "example": "Profile the same 1,000-row filter before and after memoizing only a costly row with stable primitive props, while checking that every query result remains current.",
      "sourceLink": "https://react.dev/reference/react/Profiler",
      "sourceLinks": [
        "https://react.dev/reference/react/Profiler",
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
