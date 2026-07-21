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
      "Explain why TypeScript types do not inspect runtime input",
      "Adapt FormData or JSON into a small schema input at the trust boundary",
      "Return safe field-level issues while preventing unchecked data from reaching the mutation",
      "Keep validation, authentication, and authorization as separate decisions"
    ],
    "whyMatters": "A type describes what code expects during development; it does not prove what a browser, API caller, URL, or storage system actually sent. Runtime parsing turns an assumption into evidence and gives invalid data a deliberate recovery path.",
    "estimatedMinutes": 36,
    "sections": [
      {
        "id": "expansion-runtime-schema-model",
        "type": "concept",
        "title": "Types describe; schemas check",
        "content": "TypeScript checks the code the compiler can see, then its types are removed from the emitted JavaScript. A type assertion changes the compiler’s assumption; it does not inspect a runtime value. `FormData.get()` can produce a string, `File`, or `null`, and parsed JSON can have any shape. Adapt only the fields you accept, then parse them with a runtime validator before treating them as application data.\n\nA schema library is one way to express this parser, not a required dependency for every value. Use it at real trust boundaries when structured parsing and issue paths justify its maintenance cost. Validation proves shape and rules; authentication proves identity; authorization proves permission."
      },
      {
        "id": "expansion-runtime-schema-code",
        "type": "code-example",
        "title": "Parse before mutation",
        "content": "The boundary creates an explicit object from raw FormData and uses a non-throwing parse result. Only verified data reaches authorization and persistence; expected field issues return safe recovery details.",
        "code": "const raw = {\n  email: formData.get('email'),\n  displayName: formData.get('displayName'),\n};\n\nconst result = ProfileSchema.safeParse(raw);\nif (!result.success) {\n  return {\n    ok: false,\n    fieldErrors: result.error.flatten().fieldErrors,\n  };\n}\n\nconst user = await requireUser();\nawait authorizeProfileEdit(user, result.data);\nawait saveProfile(result.data);",
        "codeLanguage": "typescript",
        "codeFilePath": "Server Function or Route Handler boundary"
      },
      {
        "id": "expansion-runtime-schema-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-runtime-schema-check",
            "question": "A Server Function receives FormData for an email and display name. What should happen before those values reach the mutation?",
            "options": [
              "Adapt the raw values and parse them with the runtime boundary schema",
              "Cast the FormData to the desired TypeScript interface",
              "Trust the browser because the inputs used `required`",
              "Save first and validate only if the database rejects the write"
            ],
            "correctAnswer": "Adapt the raw values and parse them with the runtime boundary schema",
            "expectedReasoning": "Runtime parsing inspects the values and produces verified data or structured issues. A cast performs no check, browser constraints can be bypassed, and saving before validation lets invalid input reach a protected operation."
          }
        ]
      },
      {
        "id": "expansion-runtime-schema-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "At an external boundary, build the accepted input shape, parse it at runtime, return safe actionable issues on expected failure, then authenticate and authorize before mutation. Keep native form semantics and pending feedback around the boundary. A schema improves runtime evidence; it does not replace permission checks, persistence rules, or thoughtful error design."
      }
    ],
    "retrievalPrompt": "Trace one FormData or JSON request through input adaptation, schema parsing, safe error mapping, authentication, authorization, and mutation. State what each step proves.",
    "reflectionPrompt": "Choose one external input boundary. Which values can be null, files, malformed strings, extra fields, or unexpected JSON shapes, and how should each failure recover?",
    "masteryCriteria": [
      "Can distinguish a compile-time type from runtime evidence",
      "Parses a deliberate input shape before business logic uses it",
      "Maps expected validation issues to safe actionable feedback",
      "Does not confuse valid data with permission to perform an operation"
    ],
    "nextTopics": [
      "expansion-client-server-state"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://zod.dev/basics",
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://react.dev/reference/react-dom/components/form",
        "https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html#erased-types",
        "https://developer.mozilla.org/en-US/docs/Web/API/FormData/get",
        "https://www.w3.org/WAI/tutorials/forms/notifications/"
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
        "concept": "A runtime parser changes unknown input into either verified data or explicit issues.",
        "prediction": {
          "prompt": "What does `formData as ProfileInput` prove at runtime?",
          "options": [
            "Nothing about the submitted values",
            "That every field was parsed and authorized"
          ],
          "correctAnswer": "Nothing about the submitted values",
          "feedbackCorrect": "The assertion only changes a compiler assumption; it executes no validation.",
          "feedbackWrong": "Types and assertions are erased. Runtime code must inspect external values."
        },
        "synthesis": "Parse first, map expected issues, authorize separately, then mutate verified data."
      }
    ],
    "miniProject": {
      "title": "Design a schema-backed form action",
      "scenario": "Design a profile action that accepts FormData today and JSON from a mobile client later, while sharing one verified application shape.",
      "acceptance": [
        "Each transport adapts raw values into the same schema input",
        "Invalid fields return safe field-level recovery information",
        "Only parsed data reaches authorization and persistence",
        "The design states when a schema dependency is justified and does not add one at runtime"
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
      "scenario": "A profile update accepts FormData from the browser and JSON from a mobile client. TypeScript interfaces exist, but callers can send missing fields, Files, extra values, or malformed strings. Design one runtime-safe application boundary.",
      "constraints": [
        "Keep native form behavior and observable pending feedback",
        "Adapt each transport before parsing",
        "Return safe field issues without exposing internal exceptions",
        "Authorize separately after validation succeeds"
      ],
      "acceptanceCriteria": [
        "The accepted email and display-name shape and constraints are explicit",
        "FormData and JSON adapters feed one runtime parser",
        "Only verified data reaches the protected mutation",
        "The answer distinguishes validation failure, unauthenticated identity, denied permission, and unexpected service failure"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "List the runtime types each transport can produce before writing the application schema."
        },
        {
          "stage": 2,
          "text": "Use a result with success/data or issues; map expected issue paths to fields."
        },
        {
          "stage": 3,
          "text": "After parsing, obtain the current identity and check permission for this profile before saving."
        }
      ],
      "expectedReasoning": "Transport adapters handle raw FormData and JSON differences. One parser establishes the application shape and returns structured expected issues. Authentication and authorization answer separate trust questions. Persistence receives only verified, permitted data.",
      "commonWrongPaths": [
        "Using a type assertion as a runtime check",
        "Sending raw validation-library internals to the user",
        "Treating schema success as proof that the caller owns the profile",
        "Adding a schema dependency without a real external boundary or reuse need"
      ],
      "answerExplanation": "Adapt raw transport values, parse one accepted shape, map expected issues safely, authorize the operation, and persist only the parsed data. This order keeps both correctness and recovery inspectable.",
      "followUpVariation": "A batch endpoint accepts ten profiles. Decide whether to reject the whole batch or return per-item issues, and explain the transactional consequence.",
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
        "https://zod.dev/basics",
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://react.dev/reference/react-dom/components/form",
        "https://developer.mozilla.org/en-US/docs/Web/API/FormData/get",
        "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-runtime-schema",
      "topicId": "expansion-runtime-schema-boundaries",
      "topicFamily": "app-quality",
      "question": "Why use a runtime schema for FormData when the fields already have TypeScript types?",
      "answer": "TypeScript types and assertions do not execute after compilation, so they cannot inspect FormData or JSON. A runtime parser checks the actual value, returns verified data or structured issues, and prevents unchecked input from reaching application logic. Authentication and authorization remain separate checks.",
      "followUp": "Which raw runtime values can each field produce before your schema sees them?",
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
        "https://zod.dev/basics",
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html#erased-types",
        "https://developer.mozilla.org/en-US/docs/Web/API/FormData/get"
      ]
    },
    {
      "id": "loop-qa-expansion-runtime-schema-boundaries-1",
      "topicId": "expansion-runtime-schema-boundaries",
      "topicFamily": "app-quality",
      "question": "What does successful schema parsing prove, and what does it not prove?",
      "answer": "It proves that the runtime value matches the accepted shape and validation rules and gives the application verified data. It does not prove who the caller is, whether the caller may perform the action, or whether the database operation will succeed.",
      "followUp": "Where are identity, permission, and service failure handled after parsing?",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-runtime-schema-boundaries"
      ],
      "sourceLink": "https://zod.dev/basics",
      "sourceLinks": [
        "https://zod.dev/basics",
        "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
      ]
    },
    {
      "id": "loop-qa-expansion-runtime-schema-boundaries-2",
      "topicId": "expansion-runtime-schema-boundaries",
      "topicFamily": "app-quality",
      "question": "How should runtime validation issues become form feedback?",
      "answer": "Map expected issue paths to safe visible field messages, associate each message with its control, preserve useful input, and provide a form-level message for failures that are not tied to one field. Do not expose stack traces or internal schema details.",
      "followUp": "Which issue belongs to one field, and which requires a form-level recovery message?",
      "category": "testing",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "expansion-runtime-schema-boundaries"
      ],
      "sourceLink": "https://zod.dev/basics",
      "sourceLinks": [
        "https://zod.dev/basics",
        "https://www.w3.org/WAI/tutorials/forms/notifications/",
        "https://nextjs.org/docs/15/app/guides/forms#validation-errors"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-parse-at-runtime-boundary",
      "topicId": "expansion-runtime-schema-boundaries",
      "topicFamily": "app-quality",
      "title": "Parse External Data Before Trusting It",
      "summary": "Adapt and parse FormData, JSON, URL values, or storage data before typed application code trusts them.",
      "rationale": "Compile-time types do not inspect external runtime values. Parsing creates verified data or an explicit recovery result and keeps malformed input away from protected logic.",
      "tradeOffs": "Schemas and adapters add code and maintenance. Use them at real trust boundaries and avoid introducing a library for values already constructed and proven inside one trusted module.",
      "appliesWhen": "Data enters from a browser form, API client, URL, file, storage system, or another process.",
      "doesNotApplyWhen": "The value is created and constrained entirely inside the same trusted module with no external representation.",
      "example": "Adapt `FormData.get()` results, call a non-throwing parser, return field issues on failure, then authorize and save only the parsed value.",
      "sourceLink": "https://zod.dev/basics",
      "sourceLinks": [
        "https://zod.dev/basics",
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://developer.mozilla.org/en-US/docs/Web/API/FormData/get",
        "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
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
