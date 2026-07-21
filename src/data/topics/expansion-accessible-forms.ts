import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "expansion-accessible-forms",
  "lesson": {
    "slug": "expansion-accessible-forms",
    "title": "Accessible Forms and Server Validation",
    "topicFamily": "app-quality",
    "level": "intermediate",
    "prerequisites": [
      "state-and-events"
    ],
    "learningObjectives": [
      "Build a form from native controls, persistent labels, instructions, and connected errors",
      "Model idle, pending, validation failure, unexpected failure, and success states",
      "Parse and authorize submitted data at the server mutation boundary",
      "Use React form state without removing progressive browser behavior"
    ],
    "whyMatters": "A form is both a user interaction and a trust boundary. Clear semantics help people complete it, observable states help them recover, and server validation and authorization protect the operation even when the normal browser UI is bypassed.",
    "estimatedMinutes": 38,
    "sections": [
      {
        "id": "expansion-accessible-forms-model",
        "type": "concept",
        "title": "Model",
        "content": "Start with a real `<form>`, native controls, and visible labels. A placeholder can offer an example, but it disappears and is not a durable label. Keep instructions and field errors as visible text, associate them with the control, and do not rely on color alone. The submit control should communicate pending state, and a result message should explain success or the next recovery step.\n\nClient constraints can provide immediate guidance. They do not protect the mutation because another client can send a direct request. The Server Function or Route Handler parses the runtime values, authenticates the caller, authorizes the operation, performs the write, and returns safe field or form feedback."
      },
      {
        "id": "expansion-accessible-forms-code",
        "type": "code-example",
        "title": "A server boundary",
        "content": "The server action treats `FormData` as untrusted. It returns an actionable field message without writing invalid data. A real protected action would authenticate and authorize before the final mutation.",
        "code": "'use server';\n\ntype FormState = { fieldErrors?: { email?: string }; message?: string };\n\nexport async function createAccount(\n  _previous: FormState,\n  formData: FormData\n): Promise<FormState> {\n  const emailValue = formData.get('email');\n  const email = typeof emailValue === 'string' ? emailValue.trim() : '';\n\n  if (!email.includes('@')) {\n    return { fieldErrors: { email: 'Enter a valid email address.' } };\n  }\n\n  const user = await requireSignedInUser();\n  await authorizeAccountCreation(user);\n  await saveAccount({ email });\n  return { message: 'Account created.' };\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "app/signup/actions.ts"
      },
      {
        "id": "expansion-accessible-forms-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-accessible-forms-check",
            "question": "A browser blocks an invalid email during normal use. Which check still protects the account mutation from a direct request?",
            "options": [
              "Server-side parsing and authorization before the write",
              "The disabled state of the visible submit button",
              "The email placeholder text",
              "A red border applied by CSS"
            ],
            "correctAnswer": "Server-side parsing and authorization before the write",
            "expectedReasoning": "The server boundary receives requests even when the form UI is modified or skipped, so it must inspect the runtime value and permission. Button state, placeholder text, and CSS improve presentation or guidance but are not trustworthy enforcement."
          }
        ]
      },
      {
        "id": "expansion-accessible-forms-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Use native semantics for the interaction, React form state for pending and returned feedback when useful, and the server operation for validation and permission. Preserve the learner’s useful input after a correctable error, connect the message to its field, and revalidate cached output only after a successful mutation."
      }
    ],
    "retrievalPrompt": "Trace a form from labeled input through pending feedback, server parsing, authorization, field errors, success, and revalidation. Explain which boundary owns each step.",
    "reflectionPrompt": "Complete one important form with only a keyboard, then submit invalid and unauthorized requests. Which feedback or server check is missing?",
    "masteryCriteria": [
      "Uses native controls with persistent accessible names",
      "Connects instructions and errors to the relevant fields",
      "Can distinguish fast client guidance from server-owned correctness and permission",
      "Preserves useful input and provides an observable recovery path"
    ],
    "nextTopics": [
      "expansion-runtime-schema-boundaries"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/app/guides/forms",
        "https://www.w3.org/WAI/ARIA/apg/",
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://react.dev/reference/react/useActionState",
        "https://react.dev/reference/react-dom/hooks/useFormStatus",
        "https://react.dev/reference/react-dom/components/form",
        "https://www.w3.org/WAI/tutorials/forms/",
        "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
      ]
    },
    "diagram": {
      "title": "From field to trusted mutation",
      "kind": "layers",
      "nodes": [
        {
          "id": "native",
          "label": "Native control",
          "role": "Label and keyboard baseline"
        },
        {
          "id": "feedback",
          "label": "Observable feedback",
          "role": "Pending, success, and error"
        },
        {
          "id": "server",
          "label": "Server validation",
          "role": "Untrusted input boundary"
        },
        {
          "id": "recovery",
          "label": "Recoverable outcome",
          "role": "Actionable next step"
        }
      ],
      "edges": [
        {
          "from": "native",
          "to": "feedback"
        },
        {
          "from": "feedback",
          "to": "server"
        },
        {
          "from": "server",
          "to": "recovery"
        }
      ]
    },
    "chunks": [
      {
        "id": "expansion-accessible-forms-retrieval-1",
        "title": "Find the trust boundary",
        "concept": "Accessible client feedback and server enforcement solve different parts of the same form flow.",
        "prediction": {
          "prompt": "The Server Function returns a correctable email error. What should the UI do?",
          "options": [
            "Keep the input, connect the visible error to the field, and let the user retry",
            "Clear every field and show only a console message"
          ],
          "correctAnswer": "Keep the input, connect the visible error to the field, and let the user retry",
          "feedbackCorrect": "The user can understand and repair the rejected value without rebuilding their work.",
          "feedbackWrong": "A correctable server result needs visible, field-related recovery while useful input remains available."
        },
        "synthesis": "Server correctness should return enough safe information for accessible recovery."
      }
    ],
    "miniProject": {
      "title": "Build a recoverable signup flow",
      "scenario": "Build a signup flow with email and password fields, React pending feedback, server validation, authorization, and recoverable errors.",
      "acceptance": [
        "Every control has a visible associated label and useful instructions",
        "Pending, field validation, unexpected failure, and success are distinguishable",
        "Invalid or unauthorized direct requests are rejected before mutation",
        "Useful input remains available after a correctable rejection"
      ],
      "rubric": [
        {
          "dimension": "Semantics",
          "evidence": "Native controls, labels, and status roles match the interaction."
        },
        {
          "dimension": "Trust",
          "evidence": "The server re-parses and authorizes submitted data."
        },
        {
          "dimension": "Recovery",
          "evidence": "A rejected submission tells the user what to do next."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-build-accessible-form",
      "title": "Build a Recoverable Signup Form",
      "level": 3,
      "topicFamily": "app-quality",
      "scenario": "A signup form uses placeholder-only inputs, disables its button while submitting without a status message, and reports every server rejection as “Something went wrong.” Redesign the complete flow.",
      "constraints": [
        "Use labeled native controls and visible text feedback",
        "Keep runtime validation and authorization at the server operation",
        "Do not rely on color, placeholder text, or button disabling alone"
      ],
      "acceptanceCriteria": [
        "Each field has a persistent accessible name and connected instructions or errors",
        "Pending state is perceivable and prevents accidental duplicate submission",
        "Correctable field errors preserve useful input and identify a next step",
        "Malformed and unauthorized direct requests cannot reach the mutation"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write the form in semantic HTML before adding React state or styling."
        },
        {
          "stage": 2,
          "text": "Return a safe state shape with field errors and a form-level message from the server action."
        },
        {
          "stage": 3,
          "text": "Use a child submit component with `useFormStatus`, or the pending value from `useActionState`, and connect field errors with visible text."
        }
      ],
      "expectedReasoning": "Native controls and labels establish a usable baseline. React exposes pending and returned action state. The server parses and authorizes because the client is untrusted. Structured errors let the learner recover without losing input or learning about internal failures.",
      "commonWrongPaths": [
        "Using placeholders as the only labels",
        "Treating a disabled button as a security boundary",
        "Returning raw exception details instead of safe actionable feedback"
      ],
      "answerExplanation": "Build semantics first, add observable form states, then protect the mutation at the server boundary. Return safe field and form feedback so the user can correct the request and retry.",
      "followUpVariation": "Add a username availability check. Decide which feedback may be client-assisted and which final uniqueness check must remain at the write boundary.",
      "checkType": "free-text",
      "prompt": "Explain how the form stays accessible and safe when a client bypasses its UI.",
      "freeTextKeywords": [
        "label",
        "pending",
        "server",
        "validate"
      ],
      "sourceLink": "https://nextjs.org/docs/app/guides/forms",
      "sourceLinks": [
        "https://nextjs.org/docs/app/guides/forms",
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://react.dev/reference/react/useActionState",
        "https://react.dev/reference/react-dom/hooks/useFormStatus",
        "https://www.w3.org/WAI/tutorials/forms/"
      ]
    }
  ],
  "qa": [
    {
      "id": "qa-9",
      "question": "How do I handle forms in Next.js with Server Actions?",
      "answer": "Create an async Server Function marked `use server` and pass it to the form `action`. The form itself does not have to become a Client Component unless it uses client Hooks. For returned validation state, a Client Component can use `useActionState`; a child submit control can use `useFormStatus` for the parent form’s pending state. Parse and authorize on the server, return safe actionable errors, and revalidate a path or tag only after a successful write when cached output became stale.",
      "followUp": "Which part of this form can work before client JavaScript loads, and which enhancement truly needs a Client Component?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "forms",
        "server-actions",
        "validation"
      ],
      "topicId": "expansion-accessible-forms",
      "topicFamily": "app-quality",
      "sourceLink": "https://nextjs.org/docs/15/app/guides/forms",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://react.dev/reference/react/useActionState",
        "https://react.dev/reference/react-dom/hooks/useFormStatus"
      ]
    },
    {
      "id": "expansion-qa-form-boundary",
      "topicId": "expansion-accessible-forms",
      "topicFamily": "app-quality",
      "question": "Why does a form need server-side validation if it already validates in the browser?",
      "answer": "Browser validation provides fast guidance, but the browser is not a trusted enforcement point. The server operation must parse the submitted runtime values, authenticate the caller, authorize the requested action, and reject invalid input before the write.",
      "followUp": "Which server error can be safely mapped to a field, and which should remain a generic form-level failure?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "expansion",
        "forms",
        "server-validation"
      ],
      "sourceLink": "https://nextjs.org/docs/app/guides/forms",
      "sourceLinks": [
        "https://nextjs.org/docs/app/guides/forms",
        "https://nextjs.org/docs/15/app/guides/forms#validation-errors",
        "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
      ]
    },
    {
      "id": "expansion-qa-form-semantics",
      "topicId": "expansion-accessible-forms",
      "topicFamily": "app-quality",
      "question": "What is the strongest default for a form field label?",
      "answer": "Use a visible `<label>` associated with the native control. It gives the field a persistent name and a larger click target. Placeholder text may show an example, but it disappears and should not be the only label.",
      "followUp": "How will a validation message be visibly and programmatically related to this field?",
      "category": "accessibility",
      "level": "beginner",
      "tags": [
        "expansion",
        "forms",
        "semantics"
      ],
      "sourceLink": "https://www.w3.org/WAI/ARIA/apg/",
      "sourceLinks": [
        "https://www.w3.org/WAI/ARIA/apg/",
        "https://www.w3.org/WAI/tutorials/forms/labels/",
        "https://www.w3.org/WAI/tutorials/forms/notifications/"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-validate-at-server-boundary",
      "topicId": "expansion-accessible-forms",
      "topicFamily": "app-quality",
      "title": "Validate Again at the Server Boundary",
      "summary": "Use client checks for timely guidance, then parse, authenticate, and authorize again at the server operation before changing protected data.",
      "rationale": "A caller can bypass the rendered form and send a direct request. Only the server boundary can enforce the runtime data and permission contract for the write.",
      "tradeOffs": "Client and server guidance can drift. Share a validation description only when the project already supports that boundary, and keep server authorization independent from field validation.",
      "appliesWhen": "A form, Server Function, or Route Handler reads external input or changes protected data.",
      "doesNotApplyWhen": "The value never crosses a trust boundary and cannot affect a protected operation.",
      "example": "The browser checks email format for quick feedback; the Server Function parses it, verifies the user may create the account, and saves only after both checks pass.",
      "sourceLink": "https://nextjs.org/docs/app/guides/forms",
      "nextVersion": "Next.js 15.5.20",
      "tags": [
        "expansion",
        "forms",
        "security"
      ],
      "sourceLinks": [
        "https://nextjs.org/docs/app/guides/forms",
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
      ]
    }
  ],
  "meta": {
    "topicFamily": "app-quality",
    "level": "intermediate",
    "title": "Accessible Forms and Server Validation"
  }
};
