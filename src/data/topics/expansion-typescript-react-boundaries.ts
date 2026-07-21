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
      "Use inference and discriminated unions to represent valid React UI states",
      "Type component props and events at the boundary where callers use them",
      "Use generics when two or more types have a meaningful relationship",
      "Treat browser, form, storage, and network values as runtime input that must be narrowed or parsed"
    ],
    "whyMatters": "TypeScript can catch inconsistent assumptions while you edit code, but it does not inspect a JSON response or FormData value at runtime. A clear boundary starts with what actually arrived, proves the needed shape, and then gives React components precise states and props.",
    "estimatedMinutes": 40,
    "sections": [
      {
        "id": "expansion-typescript-react-boundaries-model",
        "type": "concept",
        "title": "Compile time is not runtime",
        "content": "Inside typed code, inference often gives a value the right type without extra annotations. At a boundary—JSON, FormData, URL parameters, localStorage, or an untyped library—the running program receives JavaScript values. Type annotations and interfaces are erased, so begin with `unknown` when the shape has not been proven.\n\nA runtime parser or type guard checks the fields the next layer needs. After that check, TypeScript can narrow the value and components can receive precise props. Use a discriminated union such as `loading | error | success` so each render branch exposes only valid fields. Use a generic when it preserves a real relationship, such as “this list and this selected value contain the same item type.”"
      },
      {
        "id": "expansion-typescript-react-boundaries-code",
        "type": "code-example",
        "title": "Narrow external data",
        "content": "The boundary accepts unknown and returns an explicit result. Components never need to assert that invalid data is a Project; they render the success or error branch that the parser produced.",
        "code": "type Project = { id: string; name: string };\ntype LoadState =\n  | { status: 'loading' }\n  | { status: 'error'; message: string }\n  | { status: 'success'; project: Project };\n\nfunction parseProject(value: unknown): LoadState {\n  if (typeof value !== 'object' || value === null) {\n    return { status: 'error', message: 'Project data was not an object.' };\n  }\n  if (!('id' in value) || typeof value.id !== 'string' ||\n      !('name' in value) || typeof value.name !== 'string') {\n    return { status: 'error', message: 'Project data is incomplete.' };\n  }\n  return { status: 'success', project: { id: value.id, name: value.name } };\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "lib/projects/parse-project.ts"
      },
      {
        "id": "expansion-typescript-react-boundaries-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-typescript-react-boundaries-check",
            "question": "An API returns JSON that the application expects to be a Project. What is the safest boundary?",
            "options": [
              "Receive unknown, check the required runtime fields, then return a typed success or error result",
              "Write `response.json() as Project` and assume the server never changes",
              "Use any so every component can read any property",
              "Check only that the response is truthy"
            ],
            "correctAnswer": "Receive unknown, check the required runtime fields, then return a typed success or error result",
            "expectedReasoning": "The runtime check supplies evidence for the compiler and a recovery path for the user. An assertion changes only the compiler’s belief, any removes useful checking, and truthiness does not prove the required fields."
          }
        ]
      },
      {
        "id": "expansion-typescript-react-boundaries-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Let inference handle ordinary internal values. At runtime boundaries, start from unknown and prove the minimum shape required. Then express component props, events, and UI states precisely so invalid combinations are difficult to construct and every rejected input has an intentional recovery path."
      }
    ],
    "retrievalPrompt": "Trace an API response from unknown runtime input through validation into a discriminated loading, error, or success state and typed component props.",
    "reflectionPrompt": "Find one `as` assertion at a browser or network boundary. What evidence is missing, and which safe result should invalid data produce?",
    "masteryCriteria": [
      "Can explain what TypeScript ^5.7.0 checks and what disappears at runtime",
      "Can narrow unknown values without falling back to any",
      "Can model UI branches so each branch has exactly the fields it needs",
      "Can choose precise props, events, and generics without unnecessary assertions"
    ],
    "nextTopics": [
      "expansion-client-server-state"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
        "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
        "https://www.typescriptlang.org/docs/handbook/2/generics.html",
        "https://react.dev/learn/typescript",
        "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html"
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
        "concept": "A type assertion changes TypeScript’s belief; a runtime check changes what the program actually knows about a value.",
        "prediction": {
          "prompt": "A valid JSON response is missing `project.name`. What happens if the boundary only uses `as Project`?",
          "options": [
            "The invalid value can reach the component unchanged",
            "TypeScript inserts a runtime name check automatically"
          ],
          "correctAnswer": "The invalid value can reach the component unchanged",
          "feedbackCorrect": "Assertions are erased and do not inspect the runtime object.",
          "feedbackWrong": "TypeScript’s static types do not add a runtime parser to emitted JavaScript."
        },
        "synthesis": "Narrow or parse external values, then pass verified data through typed contracts."
      }
    ],
    "miniProject": {
      "title": "Harden a typed form boundary",
      "scenario": "Harden an account form that reads FormData, calls an API, and renders loading, validation failure, service failure, or success.",
      "acceptance": [
        "Every browser and network value begins as untrusted runtime input",
        "Parsing returns a deliberate field or form error instead of an assertion",
        "A discriminated union gives each UI branch only its valid fields",
        "Component props and events are precise and no broad any is introduced"
      ],
      "rubric": [
        {
          "dimension": "Runtime evidence",
          "evidence": "The boundary checks every field the next layer consumes."
        },
        {
          "dimension": "Type model",
          "evidence": "Loading, error, and success combinations are explicit and exhaustive."
        },
        {
          "dimension": "Recovery",
          "evidence": "Invalid input preserves useful context and produces actionable feedback."
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
      "scenario": "An account form uses `formData as Account`, and its API client uses `await response.json() as Project`. Missing fields later crash the success component. Redesign both trust boundaries and the UI state.",
      "constraints": [
        "Keep external input unknown until runtime evidence proves the needed fields",
        "Do not use any or an assertion as validation",
        "Represent loading, validation error, service error, and success explicitly",
        "Keep props and event types readable and precise"
      ],
      "acceptanceCriteria": [
        "FormData values are checked for presence and runtime type before conversion",
        "API JSON is parsed or narrowed before it becomes Project",
        "Invalid values reach an actionable error branch rather than the success component",
        "The state model prevents success data from being read in loading or error branches",
        "The explanation distinguishes TypeScript checking from runtime validation"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "List every value controlled by the browser, server response, URL, or storage."
        },
        {
          "stage": 2,
          "text": "Give each boundary a small parser that returns success or a specific failure."
        },
        {
          "stage": 3,
          "text": "Use one discriminant such as status so rendering can switch exhaustively."
        }
      ],
      "expectedReasoning": "TypeScript describes relationships in the program but cannot validate external JavaScript values. Runtime parsing converts unknown input into a typed result, and a discriminated union carries verified data or actionable failure to React without impossible assertions.",
      "commonWrongPaths": [
        "Replacing the boundary type with any",
        "Using `as Account` or `as Project` as proof",
        "Checking only that a value is truthy",
        "Combining optional data and optional error fields into ambiguous states"
      ],
      "answerExplanation": "Parse FormData and JSON at their entry points, return explicit success or failure values, and let a discriminated union control which typed props each React branch receives.",
      "followUpVariation": "The API adds a new valid archived project variant. Extend the runtime parser and union without weakening existing checks.",
      "checkType": "free-text",
      "prompt": "Explain the runtime parsers, typed results, React state union, and recovery behavior for this form and API flow.",
      "freeTextKeywords": [
        "unknown",
        "parse",
        "narrow",
        "union"
      ],
      "sourceLink": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      "sourceLinks": [
        "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
        "https://react.dev/learn/typescript",
        "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
        "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-typescript-runtime",
      "topicId": "expansion-typescript-react-boundaries",
      "topicFamily": "foundations",
      "question": "Can a TypeScript interface validate API JSON at runtime?",
      "answer": "No. Interfaces, type aliases, and assertions are erased from the emitted JavaScript. Receive untrusted JSON as unknown, then run a parser or narrowing check before the program treats it as the expected application type.",
      "followUp": "Which required field and failure message would your next API parser check first?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "expansion-typescript-react-boundaries",
        "typescript",
        "runtime-validation"
      ],
      "sourceLink": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      "sourceLinks": [
        "https://www.typescriptlang.org/docs/handbook/2/narrowing.html"
      ]
    },
    {
      "id": "expansion-qa-typescript-union",
      "topicId": "expansion-typescript-react-boundaries",
      "topicFamily": "foundations",
      "question": "Why model loading, success, and failure as a union?",
      "answer": "A discriminated union gives each state a shared tag, such as status, and the fields valid for that branch. Rendering can narrow by the tag, so success data is unavailable during loading or failure and every branch can be handled deliberately.",
      "followUp": "What fields belong only to your success branch, and which belong only to a recoverable error?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "expansion-typescript-react-boundaries",
        "unions",
        "ui-state"
      ],
      "sourceLink": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
      "sourceLinks": [
        "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
        "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions"
      ]
    },
    {
      "id": "loop-qa-expansion-typescript-react-boundaries-1",
      "topicId": "expansion-typescript-react-boundaries",
      "topicFamily": "foundations",
      "question": "When should a React boundary use inference, an annotation, a generic, or a runtime parser?",
      "answer": "Use inference for clear internal values, annotations for public props and event contracts, and a generic when it preserves a relationship between types. Use a runtime parser or guard when data crosses from the browser, network, URL, storage, or another untrusted source.",
      "followUp": "Which boundary in your current feature is external enough to require runtime evidence?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-typescript-react-boundaries"
      ],
      "sourceLink": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      "sourceLinks": [
        "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
        "https://react.dev/learn/typescript",
        "https://www.typescriptlang.org/docs/handbook/2/generics.html"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-type-boundaries-before-assertions",
      "topicId": "expansion-typescript-react-boundaries",
      "topicFamily": "foundations",
      "title": "Narrow External Data Before Assertions",
      "summary": "At each external boundary, receive the value as unknown and narrow or parse it before passing precise data to React.",
      "rationale": "Assertions disappear at runtime and can hide an invalid payload. A boundary check turns uncertainty into an explicit typed success or recoverable failure.",
      "tradeOffs": "Parsers add code and require tests as payloads evolve. Concentrating them at trust boundaries keeps most internal code simple and inferred.",
      "appliesWhen": "Data arrives through JSON, FormData, URL input, storage, browser APIs, or an untyped integration.",
      "doesNotApplyWhen": "The value was constructed from already verified data inside the same typed boundary.",
      "example": "Parse unknown project JSON into `{ ok: true, project }` or `{ ok: false, message }`, then render a discriminated React state without `as Project`.",
      "sourceLink": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      "sourceLinks": [
        "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
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
