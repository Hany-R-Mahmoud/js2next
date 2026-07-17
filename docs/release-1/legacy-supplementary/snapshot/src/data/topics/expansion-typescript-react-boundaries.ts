import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "expansion-typescript-react-boundaries",
  "lesson": {
    "slug": "expansion-typescript-react-boundaries",
    "title": "TypeScript at React and API Boundaries",
    "topicFamily": "foundations",
    "level": "intermediate",
    "prerequisites": [
      "components-and-jsx",
      "expansion-accessible-forms"
    ],
    "learningObjectives": [
      "Use inference, unions, and narrowing to describe UI state",
      "Type component props and event boundaries without overusing assertions",
      "Use generics for reusable data shapes",
      "Separate compile-time types from runtime validation of external data"
    ],
    "whyMatters": "TypeScript makes assumptions visible while code is edited, but browser and network input still arrives at runtime. Reliable React code uses types to guide design and runtime checks to protect boundaries.",
    "estimatedMinutes": 30,
    "sections": [
      {
        "id": "expansion-typescript-react-boundaries-model",
        "type": "concept",
        "title": "Compile time is not runtime",
        "content": "A TypeScript type can describe what code expects, but it does not validate JSON, FormData, or user input at runtime. Narrow unknown data before using it and keep the boundary contract explicit."
      },
      {
        "id": "expansion-typescript-react-boundaries-code",
        "type": "code-example",
        "title": "Narrow external data",
        "content": "Prefer a checked boundary over an assertion that merely silences the compiler.",
        "code": "type Project = { id: string; name: string };\n\nfunction isProject(value: unknown): value is Project {\n  return typeof value === 'object' && value !== null\n    && 'id' in value && typeof value.id === 'string'\n    && 'name' in value && typeof value.name === 'string';\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "Runtime data boundary"
      },
      {
        "id": "expansion-typescript-react-boundaries-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-typescript-react-boundaries-check",
            "question": "What is the safest first type for JSON returned by an untrusted API?",
            "options": [
              "The expected interface via `as Project`",
              "`unknown`, followed by a runtime narrowing check",
              "`any`, so every component can read it",
              "A string, regardless of the response"
            ],
            "correctAnswer": "`unknown`, followed by a runtime narrowing check",
            "expectedReasoning": "TypeScript does not inspect runtime JSON. unknown forces the boundary to prove the shape before code treats the value as a Project."
          }
        ]
      },
      {
        "id": "expansion-typescript-react-boundaries-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Use inference and narrow unions to make valid states clear. Type component and event boundaries precisely, use generics where a relationship matters, and validate external data at runtime."
      }
    ],
    "retrievalPrompt": "What can a TypeScript type guarantee, and what still needs a runtime check?",
    "reflectionPrompt": "Choose one API or form boundary. Which values are unknown, which invariant should be proven, and where should invalid input be reported?",
    "masteryCriteria": [
      "Can narrow unknown data safely",
      "Can model a UI state union",
      "Can type props and events without broad assertions",
      "Can explain compile-time versus runtime validation"
    ],
    "nextTopics": [
      "expansion-client-server-state"
    ],
    "metadata": {
      "lastUpdated": "2026-07-15",
      "sources": [
        "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
        "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
        "https://www.typescriptlang.org/docs/handbook/2/generics.html",
        "https://react.dev/learn/typescript"
      ]
    },
    "diagram": {
      "title": "From unknown input to typed UI",
      "kind": "flow",
      "nodes": [
        {
          "id": "unknown",
          "label": "External value",
          "role": "JSON, FormData, URL, or storage"
        },
        {
          "id": "narrow",
          "label": "Runtime narrowing",
          "role": "Evidence of shape"
        },
        {
          "id": "typed",
          "label": "Typed component props",
          "role": "Compile-time contract"
        },
        {
          "id": "state",
          "label": "Explicit UI states",
          "role": "Success and failure"
        }
      ],
      "edges": [
        {
          "from": "unknown",
          "to": "narrow"
        },
        {
          "from": "narrow",
          "to": "typed"
        },
        {
          "from": "typed",
          "to": "state"
        }
      ]
    },
    "chunks": [
      {
        "id": "expansion-typescript-react-boundaries-retrieval-1",
        "title": "TypeScript is not a parser",
        "concept": "Interfaces guide the compiler but disappear at runtime; network and browser values need runtime evidence before they become trusted application data.",
        "prediction": {
          "prompt": "What is required before treating API JSON as Project?",
          "options": [
            "Only `as Project`",
            "Parse or narrow the unknown runtime value"
          ],
          "correctAnswer": "Parse or narrow the unknown runtime value",
          "feedbackCorrect": "Runtime validation changes what the program can safely assume.",
          "feedbackWrong": "A type assertion changes compiler assumptions only."
        },
        "synthesis": "Narrow at the boundary, then model the valid and invalid states explicitly."
      }
    ],
    "miniProject": {
      "title": "Harden a typed form boundary",
      "scenario": "Design a FormData/API parser and a discriminated UI state for loading, success, and failure.",
      "acceptance": [
        "External values start as unknown",
        "Invalid data has a deliberate error path",
        "Verified props are precise and state branches are explicit"
      ],
      "rubric": [
        {
          "dimension": "Runtime safety",
          "evidence": "The parser proves the fields the component consumes."
        },
        {
          "dimension": "Type model",
          "evidence": "Success and failure states cannot be confused at compile time."
        },
        {
          "dimension": "Recovery",
          "evidence": "Invalid input becomes a user-visible actionable outcome."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-type-safe-form-boundary",
      "title": "Review a TypeScript Form Boundary",
      "level": 5,
      "topicFamily": "foundations",
      "scenario": "A form handler casts `FormData` to an Account object and a component casts API JSON to Project. Invalid values reach the UI and the compiler cannot show which states are possible.",
      "constraints": [
        "Do not use `any` as the boundary type",
        "Use narrowing or runtime validation for external values",
        "Model success and failure states explicitly",
        "Keep component props and event types precise"
      ],
      "acceptanceCriteria": [
        "External input is treated as unknown or parsed before use",
        "Invalid data produces a deliberate error path",
        "The UI state does not rely on impossible assertions",
        "The explanation distinguishes TypeScript checks from runtime validation"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "List which values come from the browser or network and therefore need runtime evidence."
        },
        {
          "stage": 2,
          "text": "Start with unknown and narrow the minimum shape needed by the component."
        },
        {
          "stage": 3,
          "text": "Represent loading, success, and failure as a readable state model."
        }
      ],
      "expectedReasoning": "TypeScript types guide code but do not parse runtime values. A trustworthy boundary validates or narrows external data, then exposes explicit state to typed React components.",
      "commonWrongPaths": [
        "Replacing every value with any",
        "Using `as Project` as validation",
        "Treating a disabled button as input protection",
        "Encoding error state as an optional success field with no invariant"
      ],
      "answerExplanation": "Parse or narrow FormData/API values at the boundary, return a discriminated success/error result, and pass verified data through precisely typed props.",
      "followUpVariation": "Add a server response that is valid JSON but missing one required field.",
      "checkType": "free-text",
      "prompt": "Explain how you would make this React and form boundary type-safe at compile time and safe at runtime.",
      "freeTextKeywords": [
        "unknown",
        "narrow",
        "runtime",
        "union"
      ],
      "sourceLink": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      "sourceLinks": [
        "https://react.dev/learn/typescript",
        "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-typescript-runtime",
      "topicId": "expansion-typescript-react-boundaries",
      "topicFamily": "foundations",
      "question": "Can a TypeScript interface validate API JSON at runtime?",
      "answer": "No. Interfaces and types guide compilation and are erased from runtime JavaScript. Parse or narrow the unknown value at the boundary before using it as the expected shape.",
      "followUp": "Where should an invalid payload become a user-visible error?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "expansion-typescript-react-boundaries",
        "typescript",
        "runtime-validation"
      ],
      "sourceLink": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html"
    },
    {
      "id": "expansion-qa-typescript-union",
      "topicId": "expansion-typescript-react-boundaries",
      "topicFamily": "foundations",
      "question": "Why model loading, success, and failure as a union?",
      "answer": "A discriminated union makes the allowed states and required fields explicit, so rendering code must handle each state instead of reading success data from an error or loading branch.",
      "followUp": "What should be the discriminant field?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "expansion-typescript-react-boundaries",
        "unions",
        "ui-state"
      ],
      "sourceLink": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html"
    },
    {
      "id": "loop-qa-expansion-typescript-react-boundaries-1",
      "topicId": "expansion-typescript-react-boundaries",
      "topicFamily": "foundations",
      "question": "What problem does TypeScript at React and API Boundaries help you solve?",
      "answer": "TypeScript makes assumptions visible while code is edited, but browser and network input still arrives at runtime. Reliable React code uses types to guide design and runtime checks to protect boundaries.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-typescript-react-boundaries"
      ],
      "sourceLink": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html"
    }
  ],
  "practices": [
    {
      "id": "expansion-type-boundaries-before-assertions",
      "topicId": "expansion-typescript-react-boundaries",
      "topicFamily": "foundations",
      "title": "Narrow External Data Before Assertions",
      "summary": "Treat browser, storage, and network values as unknown until runtime checks prove the shape required by the next layer.",
      "rationale": "Type assertions change the compiler’s view without changing the value. Narrowing or parsing keeps invalid data on an explicit recovery path.",
      "tradeOffs": "Boundary checks add code and may duplicate server schemas. That cost belongs at trust boundaries; internal values can rely more on inferred types.",
      "appliesWhen": "Data crosses from JSON, FormData, localStorage, URL input, or another untyped runtime boundary.",
      "doesNotApplyWhen": "The value was already constructed and validated inside the same typed module.",
      "example": "Parse an API response as unknown, validate its id and name, then pass Project props to a React component.",
      "sourceLink": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      "sourceLinks": [
        "https://react.dev/learn/typescript"
      ],
      "tags": [
        "expansion-typescript-react-boundaries",
        "typescript",
        "runtime-validation"
      ]
    }
  ],
  "meta": {
    "topicFamily": "foundations",
    "level": "intermediate",
    "title": "TypeScript at React and API Boundaries"
  }
};
