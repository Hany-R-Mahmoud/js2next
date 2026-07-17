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
      "Model form state from the user-visible states",
      "Use native controls and labels before custom behavior",
      "Validate submitted data at the server boundary",
      "Expose pending and error feedback to assistive technology"
    ],
    "whyMatters": "Forms are a trust boundary and a primary interaction surface. A form that looks correct can still lose data, hide errors, or accept invalid input.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "expansion-accessible-forms-model",
        "type": "concept",
        "title": "Model",
        "content": "Use native controls with explicit labels, then model idle, pending, success, and error states so every submission has a visible outcome."
      },
      {
        "id": "expansion-accessible-forms-code",
        "type": "code-example",
        "title": "A server boundary",
        "content": "Validate again where the mutation is authorized.",
        "code": "export async function createAccount(formData: FormData) {\n  const email = String(formData.get('email') ?? '');\n  if (!email.includes('@')) return { ok: false, message: 'Enter a valid email.' };\n  return { ok: true };\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "Server Action or Route Handler"
      },
      {
        "id": "expansion-accessible-forms-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-accessible-forms-check",
            "question": "Which check protects a mutation when a client bypasses the UI?",
            "options": [
              "The disabled submit button",
              "The server-side validation and authorization boundary",
              "Placeholder text",
              "A CSS class"
            ],
            "correctAnswer": "The server-side validation and authorization boundary",
            "expectedReasoning": "The client is untrusted; the server boundary must parse and authorize submitted data."
          }
        ]
      },
      {
        "id": "expansion-accessible-forms-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Native semantics improve the interaction baseline. Server validation protects correctness. Pending and error states connect the two into a recoverable user flow."
      }
    ],
    "retrievalPrompt": "Where should form data be validated, and why is client validation alone insufficient?",
    "reflectionPrompt": "Inspect one form you use. Can a keyboard and screen-reader user identify its fields, pending state, and errors?",
    "masteryCriteria": [
      "Can choose native controls and explicit labels",
      "Can describe the server trust boundary",
      "Can model pending and error feedback",
      "Can explain why client checks are not authorization"
    ],
    "nextTopics": [
      "expansion-runtime-schema-boundaries"
    ],
    "metadata": {
      "nextVersion": "Next.js 15.5.20",
      "lastUpdated": "2026-07-15",
      "sources": [
        "https://nextjs.org/docs/app/guides/forms",
        "https://www.w3.org/WAI/ARIA/apg/"
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
        "concept": "A disabled button and browser constraint improve the interaction but do not protect a mutation from a direct request.",
        "prediction": {
          "prompt": "Which boundary must reject malformed input?",
          "options": [
            "The CSS and disabled button",
            "The server validation boundary"
          ],
          "correctAnswer": "The server validation boundary",
          "feedbackCorrect": "The server owns correctness when the client can be bypassed.",
          "feedbackWrong": "Client controls improve UX; they cannot protect a direct request."
        },
        "synthesis": "Build accessible feedback around a server-owned correctness boundary."
      }
    ],
    "miniProject": {
      "title": "Build a recoverable signup flow",
      "scenario": "Design a signup form with labels, pending feedback, server rejection, and preserved input.",
      "acceptance": [
        "Every control has a durable accessible name",
        "Pending and error states are observable",
        "The server validates bypassed input"
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
      "scenario": "A signup form accepts an email and password, but users cannot tell when submission is pending or why a server rejection occurred.",
      "constraints": [
        "Use native labels and controls",
        "Keep validation at the server boundary",
        "Expose pending and error states without relying on color alone"
      ],
      "acceptanceCriteria": [
        "Every control has an associated label",
        "The submit action has a pending state",
        "A rejected submission exposes an actionable message",
        "The server rejects malformed input even when the UI is bypassed"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start with a real form and labels before adding styling."
        },
        {
          "stage": 2,
          "text": "Treat FormData as untrusted at the server boundary."
        },
        {
          "stage": 3,
          "text": "Give the status message a semantic role and preserve the user input after rejection."
        }
      ],
      "expectedReasoning": "Native semantics establish keyboard and assistive-technology behavior. Client feedback improves speed, but server parsing and authorization own correctness.",
      "commonWrongPaths": [
        "Using placeholder text as the only label",
        "Disabling the button without telling the user why",
        "Trusting client validation as the mutation guard"
      ],
      "answerExplanation": "Use labeled native controls, pending feedback, an assertive or status region appropriate to the message, and server-side parsing before the mutation.",
      "followUpVariation": "Add a confirmation step without losing the original server error.",
      "checkType": "free-text",
      "prompt": "Explain how the form stays accessible and safe when a client bypasses its UI.",
      "freeTextKeywords": [
        "label",
        "pending",
        "server",
        "validate"
      ],
      "sourceLink": "https://nextjs.org/docs/app/guides/forms"
    }
  ],
  "qa": [
    {
      "id": "qa-9",
      "question": "How do I handle forms in Next.js with Server Actions?",
      "answer": "Create an async function marked with 'use server' that accepts FormData. In your form component (Client Component), set the form's action prop to the Server Action. Use `useFormStatus` to get the pending state, and `useActionState` (React 19) to manage form state including errors. Validate on both client (for UX) and server (for security). After a successful mutation, perform targeted invalidation only when cached data needs refreshing, choosing a path or tag that matches the data ownership and cache model.",
      "followUp": "How do Server Actions compare to traditional API routes for form handling?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "forms",
        "server-actions",
        "validation"
      ],
      "topicId": "expansion-accessible-forms",
      "topicFamily": "app-quality",
      "sourceLink": "https://nextjs.org/docs/15/app/guides/forms"
    },
    {
      "id": "expansion-qa-form-boundary",
      "topicId": "expansion-accessible-forms",
      "topicFamily": "app-quality",
      "question": "Why does a form need server-side validation if it already validates in the browser?",
      "answer": "Browser validation improves feedback, but a client can be bypassed. The server must parse and authorize input at the mutation boundary.",
      "followUp": "Which error should the user see after a rejected submission?",
      "category": "nextjs",
      "level": "intermediate",
      "tags": [
        "expansion",
        "forms",
        "server-validation"
      ],
      "sourceLink": "https://nextjs.org/docs/app/guides/forms"
    },
    {
      "id": "expansion-qa-form-semantics",
      "topicId": "expansion-accessible-forms",
      "topicFamily": "app-quality",
      "question": "What is the strongest default for a form field label?",
      "answer": "Use a visible label associated with a native control. Placeholder text is not a durable replacement for a label.",
      "followUp": "How would you test the association?",
      "category": "accessibility",
      "level": "beginner",
      "tags": [
        "expansion",
        "forms",
        "semantics"
      ],
      "sourceLink": "https://www.w3.org/WAI/ARIA/apg/"
    }
  ],
  "practices": [
    {
      "id": "expansion-validate-at-server-boundary",
      "topicId": "expansion-accessible-forms",
      "topicFamily": "app-quality",
      "title": "Validate Again at the Server Boundary",
      "summary": "Use client validation for fast feedback, but parse and authorize data again where the mutation is protected.",
      "rationale": "Clients are untrusted and can submit requests without rendering your form. The server boundary owns correctness and permission checks.",
      "tradeOffs": "The same rule may appear in client and server code; shared schemas can reduce drift when the runtime supports them.",
      "appliesWhen": "A form, action, or route handler changes protected data.",
      "doesNotApplyWhen": "The value never leaves the current process or affects a protected operation.",
      "example": "A signup form checks email format in the browser, then the Server Action parses it before creating the account.",
      "sourceLink": "https://nextjs.org/docs/app/guides/forms",
      "nextVersion": "Next.js 15.5.20",
      "tags": [
        "expansion",
        "forms",
        "security"
      ]
    }
  ],
  "meta": {
    "topicFamily": "app-quality",
    "level": "intermediate",
    "title": "Accessible Forms and Server Validation"
  }
};
