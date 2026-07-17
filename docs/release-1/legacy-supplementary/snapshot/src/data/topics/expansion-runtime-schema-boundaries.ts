import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "expansion-runtime-schema-boundaries",
  "lesson": {
    "slug": "expansion-runtime-schema-boundaries",
    "title": "Runtime Schemas at Form and API Boundaries",
    "topicFamily": "app-quality",
    "level": "intermediate",
    "prerequisites": [
      "expansion-accessible-forms",
      "expansion-typescript-react-boundaries"
    ],
    "learningObjectives": [
      "Separate compile-time TypeScript descriptions from runtime validation",
      "Use a schema to parse untrusted FormData or JSON at a protected boundary",
      "Choose safeParse-style failure handling that preserves actionable field errors",
      "Keep native form semantics and pending feedback when a schema library is introduced"
    ],
    "whyMatters": "A typed form can still receive malformed runtime input. A schema makes the boundary executable while the UI remains responsible for clear, accessible recovery.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "expansion-runtime-schema-model",
        "type": "concept",
        "title": "Types describe; schemas check",
        "content": "TypeScript helps during development, but FormData, JSON, URL values, and browser storage arrive at runtime. A schema turns those values into an explicit pass or failure result."
      },
      {
        "id": "expansion-runtime-schema-code",
        "type": "code-example",
        "title": "Parse before mutation",
        "content": "Validate at the server boundary and return structured failure data instead of mutating with unchecked fields.",
        "code": "const result = ProfileSchema.safeParse({\n  email: formData.get('email'),\n});\n\nif (!result.success) return { ok: false, errors: result.error.flatten().fieldErrors };\nawait saveProfile(result.data);",
        "codeLanguage": "typescript",
        "codeFilePath": "Server Action or API boundary"
      },
      {
        "id": "expansion-runtime-schema-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-runtime-schema-check",
            "question": "What should happen before a submitted email reaches the mutation?",
            "options": [
              "Trust the TypeScript interface",
              "Parse the runtime value with the boundary schema",
              "Read the placeholder as the value",
              "Disable the submit button permanently"
            ],
            "correctAnswer": "Parse the runtime value with the boundary schema",
            "expectedReasoning": "The client and its declared types can be bypassed; the protected boundary must validate the runtime value."
          }
        ]
      },
      {
        "id": "expansion-runtime-schema-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Keep native form behavior and accessible feedback, then add a runtime schema where data becomes trusted. A schema library is a boundary tool, not a replacement for authorization, persistence, or user-facing error design."
      }
    ],
    "retrievalPrompt": "Why can a TypeScript type not replace runtime schema validation for FormData or JSON?",
    "reflectionPrompt": "Choose one form or API boundary. Which fields need parsing, which errors can the user fix, and where is authorization still required?",
    "masteryCriteria": [
      "Can explain the compile-time/runtime distinction",
      "Can parse untrusted input before mutation",
      "Can return field-level failure information",
      "Can preserve accessible pending and recovery states"
    ],
    "nextTopics": [
      "expansion-client-server-state"
    ],
    "metadata": {
      "nextVersion": "Next.js 15.5.20; Zod 4",
      "lastUpdated": "2026-07-15",
      "sources": [
        "https://zod.dev/basics",
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://react.dev/reference/react-dom/components/form"
      ]
    },
    "diagram": {
      "title": "From runtime input to trusted data",
      "kind": "layers",
      "nodes": [
        {
          "id": "input",
          "label": "Untrusted input",
          "role": "FormData, JSON, or URL values"
        },
        {
          "id": "schema",
          "label": "Runtime schema",
          "role": "Parse or return issues"
        },
        {
          "id": "typed",
          "label": "Verified data",
          "role": "Safe application shape"
        },
        {
          "id": "mutation",
          "label": "Authorized mutation",
          "role": "Protected write"
        }
      ],
      "edges": [
        {
          "from": "input",
          "to": "schema"
        },
        {
          "from": "schema",
          "to": "typed"
        },
        {
          "from": "typed",
          "to": "mutation"
        }
      ]
    },
    "chunks": [
      {
        "id": "expansion-runtime-schema-boundaries-retrieval-1",
        "title": "Types are not runtime evidence",
        "concept": "A TypeScript interface cannot inspect FormData or JSON at runtime; a schema must parse the value before the protected operation trusts it.",
        "prediction": {
          "prompt": "What should a Server Action do with FormData before saving it?",
          "options": [
            "Cast it to the expected interface",
            "Parse it with a runtime schema and handle failure"
          ],
          "correctAnswer": "Parse it with a runtime schema and handle failure",
          "feedbackCorrect": "The schema creates runtime evidence and a structured recovery path.",
          "feedbackWrong": "A cast changes compiler assumptions but does not inspect the submitted value."
        },
        "synthesis": "Parse first, authorize the operation, then mutate verified data."
      }
    ],
    "miniProject": {
      "title": "Design a schema-backed form action",
      "scenario": "Specify a profile form that maps FormData into a runtime schema, returns field errors, and preserves accessible pending feedback.",
      "acceptance": [
        "Raw values are parsed at the server boundary",
        "Failure returns field-level recovery information",
        "Authorization remains separate from validation",
        "The form keeps native labels and pending/error states"
      ],
      "rubric": [
        {
          "dimension": "Runtime safety",
          "evidence": "The schema proves the fields used by the mutation."
        },
        {
          "dimension": "Recovery",
          "evidence": "Invalid fields map to actionable user-visible feedback."
        },
        {
          "dimension": "Security",
          "evidence": "Validation is not confused with authorization."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-design-runtime-schema-boundary",
      "title": "Design a Runtime-Safe Form Boundary",
      "level": 5,
      "topicFamily": "app-quality",
      "scenario": "A profile form accepts FormData and saves an email plus display name. The UI has TypeScript types, but direct requests can submit missing, malformed, or unexpected values.",
      "constraints": [
        "Keep native form semantics and pending feedback",
        "Parse untrusted values before the mutation",
        "Return actionable field errors without leaking internals",
        "Keep authorization separate from validation"
      ],
      "acceptanceCriteria": [
        "The boundary schema defines the accepted fields and constraints",
        "Invalid input returns structured field-level feedback",
        "Only parsed data reaches the mutation",
        "The explanation distinguishes runtime validation from authorization"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start with the raw FormData values; do not treat them as the final application type."
        },
        {
          "stage": 2,
          "text": "Use a schema parser with a success/failure result and preserve the field paths."
        },
        {
          "stage": 3,
          "text": "After validation succeeds, authorize the caller and only then perform the mutation."
        }
      ],
      "expectedReasoning": "TypeScript does not inspect runtime FormData. Parse the submitted values with a schema, return field issues on failure, and run authorization separately before saving verified data.",
      "commonWrongPaths": [
        "Using a type assertion as validation",
        "Trusting client constraints as the server boundary",
        "Returning a generic failure that loses field recovery",
        "Treating schema validation as permission checking"
      ],
      "answerExplanation": "Keep the native form and pending state, map FormData into a runtime schema, use a safe parse result to return field errors, then authorize the operation and persist only the parsed data.",
      "followUpVariation": "The API now accepts JSON from a mobile client. Which boundary stays the same and which input adapter changes?",
      "checkType": "free-text",
      "prompt": "Explain the schema, failure response, authorization, and mutation order for this form.",
      "freeTextKeywords": [
        "schema",
        "parse",
        "field",
        "server",
        "authorization"
      ],
      "sourceLink": "https://zod.dev/basics",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://react.dev/reference/react-dom/components/form"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-runtime-schema",
      "topicId": "expansion-runtime-schema-boundaries",
      "topicFamily": "app-quality",
      "question": "Why use a runtime schema for FormData when the fields already have TypeScript types?",
      "answer": "TypeScript types guide compilation but do not inspect values submitted by a browser or another client. A runtime schema parses the input, returns structured issues on failure, and produces data the server can safely pass to the next boundary; authorization is still a separate check.",
      "followUp": "How should field issues become accessible recovery feedback?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "expansion",
        "schemas",
        "zod",
        "forms",
        "runtime-validation"
      ],
      "sourceLink": "https://zod.dev/basics",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/forms"
      ]
    },
    {
      "id": "loop-qa-expansion-runtime-schema-boundaries-1",
      "topicId": "expansion-runtime-schema-boundaries",
      "topicFamily": "app-quality",
      "question": "What problem does Runtime Schemas at Form and API Boundaries help you solve?",
      "answer": "A typed form can still receive malformed runtime input. A schema makes the boundary executable while the UI remains responsible for clear, accessible recovery.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-runtime-schema-boundaries"
      ],
      "sourceLink": "https://zod.dev/basics"
    },
    {
      "id": "loop-qa-expansion-runtime-schema-boundaries-2",
      "topicId": "expansion-runtime-schema-boundaries",
      "topicFamily": "app-quality",
      "question": "How would you explain the core idea of Runtime Schemas at Form and API Boundaries to a teammate?",
      "answer": "Why can a TypeScript type not replace runtime schema validation for FormData or JSON? A strong explanation should connect the model to: Separate compile-time TypeScript descriptions from runtime validation; Use a schema to parse untrusted FormData or JSON at a protected boundary.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-runtime-schema-boundaries"
      ],
      "sourceLink": "https://zod.dev/basics"
    }
  ],
  "practices": [
    {
      "id": "expansion-parse-at-runtime-boundary",
      "topicId": "expansion-runtime-schema-boundaries",
      "topicFamily": "app-quality",
      "title": "Parse External Data Before Trusting It",
      "summary": "Use a runtime schema for FormData or JSON before passing values to a typed component, query, or mutation.",
      "rationale": "Compile-time types do not inspect runtime input. Parsing creates a deliberate success or recovery path and keeps invalid data from becoming an accidental application assumption.",
      "tradeOffs": "Schema definitions and field mapping add maintenance cost; keep them at real trust boundaries and avoid duplicating checks for purely internal values.",
      "appliesWhen": "Data comes from a browser form, API, URL, storage, or another untyped client.",
      "doesNotApplyWhen": "The value was constructed and validated inside the same trusted module.",
      "example": "Call `safeParse` at the Server Action boundary, return field issues on failure, then authorize and save only the parsed data.",
      "sourceLink": "https://zod.dev/basics",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/forms"
      ],
      "tags": [
        "expansion",
        "schemas",
        "zod",
        "runtime-validation"
      ]
    }
  ],
  "meta": {
    "topicFamily": "app-quality",
    "level": "intermediate",
    "title": "Runtime Schemas at Form and API Boundaries"
  }
};
