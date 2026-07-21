import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "expansion-optimistic-mutations",
  "lesson": {
    "slug": "expansion-optimistic-mutations",
    "title": "Design Optimistic Mutations with Recovery",
    "topicFamily": "nextjs-data",
    "level": "advanced",
    "prerequisites": [
      "expansion-client-server-state",
      "expansion-accessible-forms"
    ],
    "learningObjectives": [
      "Describe optimistic state as a temporary projection shown during an Action",
      "Keep server validation, authorization, and confirmed data authoritative",
      "Reconcile temporary identity and overlapping actions after success or rejection",
      "Provide accessible pending, error, correction, and retry behavior"
    ],
    "whyMatters": "Immediate feedback can make a slow mutation feel responsive, but the projected result may be rejected or changed by the server. A trustworthy optimistic flow makes “pending” visible, keeps the real operation authoritative, and defines how every temporary item converges or recovers.",
    "estimatedMinutes": 42,
    "sections": [
      {
        "id": "expansion-optimistic-mutations-model",
        "type": "concept",
        "title": "Projection, then confirmation",
        "content": "Optimistic state is a temporary view of what the interface expects while an Action is running. The base value—usually props or state updated from the server—decides what remains after the Action. In React 19.2, the optimistic setter is called inside an Action or Transition; form Action props already provide that context.\n\nBefore projecting, write both endings. On success, replace a temporary id, timestamp, or label with the confirmed server record. On rejection, the base state remains authoritative, the projection disappears or becomes a deliberate failed item, and the UI explains how to correct or retry. The server still parses input and authorizes the mutation."
      },
      {
        "id": "expansion-optimistic-mutations-code",
        "type": "code-example",
        "title": "Keep the pending action explicit",
        "content": "Because submitAction is passed to the form action prop, the optimistic update runs inside an Action. The pending note has a unique temporary id. The parent data changes only when createNote succeeds; on failure, React returns to the unchanged base notes and the error message supplies recovery.",
        "code": "const [optimisticNotes, addOptimisticNote] = useOptimistic(\n  notes,\n  (current, pending: Note) => [...current, pending],\n);\n\nasync function submitAction(formData: FormData) {\n  const tempId = crypto.randomUUID();\n  const title = String(formData.get('title') ?? '').trim();\n  addOptimisticNote({ id: tempId, title, pending: true });\n\n  const result = await createNote(formData);\n  if (!result.ok) setError(result.message);\n}\n\nreturn <form action={submitAction}>{/* fields and status */}</form>;",
        "codeLanguage": "tsx",
        "codeFilePath": "app/notes/NoteForm.tsx"
      },
      {
        "id": "expansion-optimistic-mutations-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-optimistic-mutations-check",
            "question": "The server rejects an optimistically added note. What should the interface do?",
            "options": [
              "Return to authoritative base data and show a clear correction or retry path",
              "Keep the pending note as confirmed forever",
              "Hide the rejection so the interaction still feels fast",
              "Retry indefinitely without user-visible status"
            ],
            "correctAnswer": "Return to authoritative base data and show a clear correction or retry path",
            "expectedReasoning": "Optimistic state is temporary and the server result controls confirmation. Keeping or hiding a rejected projection presents false data, while unbounded silent retries remove control and can repeat the mutation."
          }
        ]
      },
      {
        "id": "expansion-optimistic-mutations-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Use optimism only when the projected result is clear, useful, and recoverable. Call the optimistic setter inside an Action, mark temporary UI as pending, and keep server validation and authorization unchanged. Define confirmed replacement, rejection, concurrent-action identity, correction, and retry before shipping the faster-feeling path."
      }
    ],
    "retrievalPrompt": "Trace an optimistic note from temporary identity through Action, server validation and authorization, confirmed replacement or rejection, accessible error, and retry.",
    "reflectionPrompt": "Choose a mutation that feels slow. Is its expected result safe and reversible enough to project, and how would the user understand a rejection?",
    "masteryCriteria": [
      "Can explain the React 19.2 Action requirement and temporary value model",
      "Can separate projected UI from authoritative server data",
      "Can reconcile temporary ids and concurrent optimistic actions",
      "Can design pending, rejection, correction, retry, and confirmation states"
    ],
    "nextTopics": [
      "expansion-production-readiness"
    ],
    "diagram": {
      "title": "Optimistic mutation lifecycle",
      "kind": "flow",
      "nodes": [
        {
          "id": "pending",
          "label": "Pending projection"
        },
        {
          "id": "success",
          "label": "Confirmed server state"
        },
        {
          "id": "failure",
          "label": "Reconcile and retry"
        }
      ],
      "edges": [
        {
          "from": "pending",
          "to": "success",
          "label": "accepted"
        },
        {
          "from": "pending",
          "to": "failure",
          "label": "rejected"
        }
      ]
    },
    "chunks": [
      {
        "id": "expansion-optimistic-mutations-chunk-1",
        "title": "Name the truth source",
        "concept": "The optimistic value is temporary during an Action; the base value controls the final UI.",
        "prediction": {
          "prompt": "The server returns note id `n-42` for temporary id `tmp-7`. Which record should remain after success?",
          "options": [
            "The confirmed `n-42` record",
            "Both records permanently",
            "Only the temporary record marked confirmed without server data"
          ],
          "correctAnswer": "The confirmed `n-42` record",
          "feedbackCorrect": "The authoritative response replaces temporary identity and any server-owned fields.",
          "feedbackWrong": "Leaving duplicate or invented confirmation separates the UI from the server’s actual record."
        },
        "synthesis": "Project immediately, then converge on the authoritative result."
      }
    ],
    "miniProject": {
      "title": "Add optimistic note creation",
      "scenario": "Add optimistic note creation where two submissions may overlap and the server can return validation, authorization, or service failure.",
      "acceptance": [
        "Each pending note has a unique temporary identity and visible pending state",
        "The server parses, authorizes, and returns the confirmed record or a safe failure",
        "Success replaces only the matching projection with server-owned id and timestamp",
        "Rejection restores or marks the matching item and offers correction or bounded retry"
      ],
      "rubric": [
        {
          "dimension": "Authority",
          "evidence": "Projected and confirmed records are distinct and converge through the server result."
        },
        {
          "dimension": "Concurrency",
          "evidence": "Overlapping actions reconcile by unique identity without removing the wrong item."
        },
        {
          "dimension": "Recovery",
          "evidence": "Pending, validation, denial, service failure, correction, and retry are observable."
        }
      ]
    },
    "metadata": {
      "nextVersion": "15.5.20",
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://react.dev/reference/react/useOptimistic",
        "https://react.dev/reference/react-dom/hooks/useFormStatus",
        "https://nextjs.org/docs/app/guides/forms",
        "https://nextjs.org/docs/15/app/guides/forms"
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-design-optimistic-mutation",
      "title": "Design an Optimistic Mutation with Rollback",
      "level": 8,
      "topicFamily": "nextjs-data",
      "scenario": "A note form runs on a slow connection. Two notes can be submitted quickly, the server assigns ids and timestamps, and either write may fail validation or authorization. Design the optimistic lifecycle.",
      "constraints": [
        "Call optimistic setters inside a React Action or Transition",
        "Give every projection a stable temporary identity and pending presentation",
        "Keep the protected server mutation authoritative",
        "Reconcile the correct action after success or rejection",
        "Provide accessible correction and bounded retry behavior"
      ],
      "acceptanceCriteria": [
        "Two overlapping notes cannot overwrite or remove each other accidentally",
        "Server validation and authorization still happen before persistence",
        "A success replaces temporary id and server-owned fields with the confirmed record",
        "A rejection removes or marks only its projection and announces an actionable error",
        "Retry does not silently duplicate an already accepted mutation"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Model each action with a unique temporary id and status before writing UI code."
        },
        {
          "stage": 2,
          "text": "Write the server result as either confirmed record or a specific validation, denial, or service failure."
        },
        {
          "stage": 3,
          "text": "Reconcile by temporary/action identity and preserve the user’s editable title on a correctable failure."
        }
      ],
      "expectedReasoning": "Optimistic feedback is a temporary projection attached to one Action. Unique identity makes concurrent reconciliation safe. The server remains responsible for correctness and permission, and each result changes only its matching projection while giving the user a clear recovery path.",
      "commonWrongPaths": [
        "Using the same `pending` id for every submission",
        "Calling the optimistic setter outside an Action or Transition",
        "Treating client validation as server authorization",
        "Removing every pending note when one request fails",
        "Retrying without considering duplicate server acceptance"
      ],
      "answerExplanation": "Create one identified projection per Action, validate and authorize on the server, replace it with confirmed data on success, and reconcile only that item with accessible correction or retry on failure.",
      "followUpVariation": "The request times out after the server may have saved it. Add an idempotency or reconciliation strategy that avoids a duplicate retry.",
      "checkType": "free-text",
      "prompt": "Describe Action context, temporary identity, server authority, concurrent reconciliation, failure feedback, and retry behavior.",
      "freeTextKeywords": [
        "Action",
        "temporary",
        "server",
        "reconcile",
        "retry"
      ],
      "sourceLink": "https://react.dev/reference/react/useOptimistic",
      "sourceLinks": [
        "https://react.dev/reference/react/useOptimistic",
        "https://react.dev/reference/react-dom/hooks/useFormStatus",
        "https://nextjs.org/docs/app/guides/forms",
        "https://nextjs.org/docs/15/app/guides/forms"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-optimistic-recovery",
      "topicId": "expansion-optimistic-mutations",
      "topicFamily": "nextjs-data",
      "question": "What makes an optimistic mutation trustworthy?",
      "answer": "A trustworthy optimistic mutation marks its temporary projection, runs it inside an Action, keeps server validation and authorization authoritative, and reconciles the exact projection with confirmed data or an actionable failure. The user can always tell pending from confirmed state.",
      "followUp": "Which temporary and server-owned fields must be matched when this mutation succeeds?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-optimistic-mutations",
        "optimistic-ui",
        "mutations",
        "recovery"
      ],
      "sourceLink": "https://react.dev/reference/react/useOptimistic",
      "sourceLinks": [
        "https://react.dev/reference/react/useOptimistic",
        "https://nextjs.org/docs/app/guides/forms",
        "https://nextjs.org/docs/15/app/guides/forms"
      ]
    },
    {
      "id": "loop-qa-expansion-optimistic-mutations-1",
      "topicId": "expansion-optimistic-mutations",
      "topicFamily": "nextjs-data",
      "question": "What does React display when a useOptimistic Action fails before base state changes?",
      "answer": "When the Action ends, React renders the current base value passed to useOptimistic. If the parent or real state changed only on success, the rejected projection no longer appears. Catch or return the failure so the UI can explain correction or retry.",
      "followUp": "Which base value should remain visible after your next rejected mutation?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-optimistic-mutations"
      ],
      "sourceLink": "https://react.dev/reference/react/useOptimistic",
      "sourceLinks": [
        "https://react.dev/reference/react/useOptimistic"
      ]
    },
    {
      "id": "loop-qa-expansion-optimistic-mutations-2",
      "topicId": "expansion-optimistic-mutations",
      "topicFamily": "nextjs-data",
      "question": "Why does an optimistic list item need a unique temporary identity?",
      "answer": "Several Actions can overlap and finish in a different order. A unique temporary id lets each server result replace, remove, or mark only its own projection instead of affecting another pending item.",
      "followUp": "How will you match a confirmed server record to the projection that created it?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-optimistic-mutations"
      ],
      "sourceLink": "https://react.dev/reference/react/useOptimistic",
      "sourceLinks": [
        "https://react.dev/reference/react/useOptimistic"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-reconcile-optimistic-state",
      "topicId": "expansion-optimistic-mutations",
      "topicFamily": "nextjs-data",
      "title": "Reconcile Optimistic State with Server Truth",
      "summary": "Show one identified temporary projection during an Action, then converge on confirmed server data or an actionable failure.",
      "rationale": "Optimistic feedback reduces perceived latency but may be wrong. Explicit authority and reconciliation prevent pending UI from becoming false product state.",
      "tradeOffs": "Temporary identities, concurrent Actions, rollback, idempotency, and recovery add state transitions. Use optimism where latency matters and the projection is understandable and safely reversible.",
      "appliesWhen": "A user-visible mutation has a predictable temporary result and a clear confirmed or rejected outcome.",
      "doesNotApplyWhen": "The operation is destructive, irreversible, ambiguous, or too risky to present before server confirmation.",
      "example": "Add a pending note with a unique temp id inside a form Action, replace it with the server record on success, or preserve the title with an error and retry on rejection.",
      "sourceLink": "https://react.dev/reference/react/useOptimistic",
      "sourceLinks": [
        "https://react.dev/reference/react/useOptimistic",
        "https://react.dev/reference/react-dom/hooks/useFormStatus"
      ],
      "tags": [
        "expansion-optimistic-mutations",
        "optimistic-ui",
        "rollback",
        "recovery"
      ]
    }
  ],
  "meta": {
    "topicFamily": "nextjs-data",
    "level": "advanced",
    "title": "Design Optimistic Mutations with Recovery"
  }
};
