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
      "Separate an optimistic projection from authoritative server state",
      "Use a pending action to show immediate feedback without declaring success early",
      "Restore or reconcile the UI when the server rejects a mutation",
      "Keep pending, error, and retry feedback accessible"
    ],
    "whyMatters": "Optimistic UI can make a mutation feel immediate, but an optimistic projection is only a temporary hypothesis. Without a recovery path, a failed write leaves the interface lying to the learner.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "expansion-optimistic-mutations-model",
        "type": "concept",
        "title": "Projection, then confirmation",
        "content": "Show the expected result while an action is pending, but keep the server response authoritative. On success, use the confirmed data; on failure, remove or reconcile the projection and expose a retryable error."
      },
      {
        "id": "expansion-optimistic-mutations-code",
        "type": "code-example",
        "title": "Keep the pending action explicit",
        "content": "React’s optimistic state is a temporary view for an in-flight action. The mutation still needs server validation, authorization, and a success or failure result.",
        "code": "const [optimisticItems, addOptimisticItem] = useOptimistic(\n  items,\n  (current, pendingItem) => [...current, pendingItem],\n);\n\nasync function submit(formData: FormData) {\n  addOptimisticItem({ id: 'pending', title: String(formData.get('title')), pending: true });\n  await saveItem(formData);\n}",
        "codeLanguage": "tsx",
        "codeFilePath": "Client form and Server Action boundary"
      },
      {
        "id": "expansion-optimistic-mutations-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-optimistic-mutations-check",
            "question": "What must happen when an optimistic save is rejected?",
            "options": [
              "Keep the optimistic item permanently",
              "Reconcile or remove the projection and expose a recoverable error",
              "Reload until the item appears",
              "Hide the failure from the user"
            ],
            "correctAnswer": "Reconcile or remove the projection and expose a recoverable error",
            "expectedReasoning": "Optimistic state is temporary. The server result is authoritative, so rejection needs reconciliation plus feedback and a retry path."
          }
        ]
      },
      {
        "id": "expansion-optimistic-mutations-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Optimistic UI is a latency strategy, not a correctness boundary. Define the pending projection, authoritative response, rollback or reconciliation rule, and accessible failure path before shipping it."
      }
    ],
    "retrievalPrompt": "What is optimistic state allowed to claim while a mutation is pending, and how should a rejected mutation change the UI?",
    "reflectionPrompt": "Choose one mutation in your app. What can be projected safely, what server result confirms it, and what should the user retry after failure?",
    "masteryCriteria": [
      "Can distinguish optimistic projection from server truth",
      "Can identify the pending action boundary",
      "Can describe rollback or reconciliation on rejection",
      "Can preserve accessible pending and error feedback"
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
        "concept": "Optimistic state is temporary; the server result owns confirmation.",
        "prediction": {
          "prompt": "What should replace a pending projection after rejection?",
          "options": [
            "A permanent success badge",
            "A reconciled state with recovery feedback"
          ],
          "correctAnswer": "A reconciled state with recovery feedback",
          "feedbackCorrect": "Rejection must be visible and recoverable.",
          "feedbackWrong": "Pending UI cannot become server truth by itself."
        },
        "synthesis": "Define success and rejection before adding optimistic feedback."
      }
    ],
    "miniProject": {
      "title": "Add optimistic note creation",
      "scenario": "Design a note form that shows a pending item, confirms it from the server, and recovers after rejection.",
      "acceptance": [
        "Pending item is visibly distinct",
        "Server validates and authorizes",
        "Success replaces temporary identity",
        "Failure offers reconciliation and retry"
      ],
      "rubric": [
        {
          "dimension": "State ownership",
          "evidence": "Projection and authoritative server state are distinct."
        },
        {
          "dimension": "Recovery",
          "evidence": "Rejected writes are visible and retryable."
        }
      ]
    },
    "metadata": {
      "nextVersion": "Next.js 15.5.20; React 19.2.7",
      "lastUpdated": "2026-07-15",
      "sources": [
        "https://react.dev/reference/react/useOptimistic",
        "https://react.dev/reference/react-dom/hooks/useFormStatus",
        "https://nextjs.org/docs/app/guides/forms"
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-design-optimistic-mutation",
      "title": "Design an Optimistic Mutation with Rollback",
      "level": 8,
      "topicFamily": "nextjs-data",
      "scenario": "A learner adds a note from a slow connection. The product wants the note to appear immediately, but the server may reject it for validation or authorization.",
      "constraints": [
        "Keep the server response authoritative",
        "Show pending status without claiming confirmed success",
        "Define rollback or reconciliation",
        "Include a retryable failure path"
      ],
      "acceptanceCriteria": [
        "Optimistic item is marked pending",
        "Server validation and authorization remain in the mutation boundary",
        "Rejected writes remove or reconcile the projection",
        "The UI exposes pending, failure, and retry behavior"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Treat the immediate item as a projection, not confirmed data."
        },
        {
          "stage": 2,
          "text": "The server action still validates and authorizes the write."
        },
        {
          "stage": 3,
          "text": "Name what happens to the projected item when the write fails."
        }
      ],
      "expectedReasoning": "An optimistic mutation can improve perceived latency only if the pending projection is visibly distinct, the server remains authoritative, and rejection has explicit reconciliation and recovery.",
      "commonWrongPaths": [
        "Persisting the optimistic item without confirmation",
        "Trusting client validation as authorization",
        "Hiding a rejected write",
        "Retrying silently forever"
      ],
      "answerExplanation": "Render a pending projection through the action boundary, submit to a server-validated and authorized mutation, replace it with confirmed data on success, and remove or mark it failed with a retry action on rejection.",
      "followUpVariation": "The mutation creates a server-generated id and timestamp. Explain how the confirmed response replaces the temporary client identity.",
      "checkType": "free-text",
      "prompt": "Describe the pending, success, and rejection states for this optimistic note mutation.",
      "freeTextKeywords": [
        "pending",
        "server",
        "rollback",
        "retry"
      ],
      "sourceLink": "https://react.dev/reference/react/useOptimistic",
      "sourceLinks": [
        "https://react.dev/reference/react-dom/hooks/useFormStatus",
        "https://nextjs.org/docs/app/guides/forms"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-optimistic-recovery",
      "topicId": "expansion-optimistic-mutations",
      "topicFamily": "nextjs-data",
      "question": "What makes an optimistic mutation trustworthy?",
      "answer": "The UI distinguishes a pending projection from confirmed server state, the mutation validates and authorizes at the server boundary, and rejection reconciles the projection with a visible retryable error.",
      "followUp": "Which value should replace a temporary client id after success?",
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
        "https://nextjs.org/docs/app/guides/forms"
      ]
    },
    {
      "id": "loop-qa-expansion-optimistic-mutations-1",
      "topicId": "expansion-optimistic-mutations",
      "topicFamily": "nextjs-data",
      "question": "What problem does Design Optimistic Mutations with Recovery help you solve?",
      "answer": "Optimistic UI can make a mutation feel immediate, but an optimistic projection is only a temporary hypothesis. Without a recovery path, a failed write leaves the interface lying to the learner.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-optimistic-mutations"
      ],
      "sourceLink": "https://react.dev/reference/react/useOptimistic"
    },
    {
      "id": "loop-qa-expansion-optimistic-mutations-2",
      "topicId": "expansion-optimistic-mutations",
      "topicFamily": "nextjs-data",
      "question": "How would you explain the core idea of Design Optimistic Mutations with Recovery to a teammate?",
      "answer": "What is optimistic state allowed to claim while a mutation is pending, and how should a rejected mutation change the UI? A strong explanation should connect the model to: Separate an optimistic projection from authoritative server state; Use a pending action to show immediate feedback without declaring success early.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "expansion-optimistic-mutations"
      ],
      "sourceLink": "https://react.dev/reference/react/useOptimistic"
    }
  ],
  "practices": [
    {
      "id": "expansion-reconcile-optimistic-state",
      "topicId": "expansion-optimistic-mutations",
      "topicFamily": "nextjs-data",
      "title": "Reconcile Optimistic State with Server Truth",
      "summary": "Use optimistic UI for pending feedback, then replace or remove the projection according to the authoritative mutation result.",
      "rationale": "Optimistic state improves perceived latency but can be wrong. A visible pending state and explicit rejection path prevent stale or unauthorized projections from becoming misleading product state.",
      "tradeOffs": "Rollback and reconciliation add state transitions and failure UI. That cost is justified only when latency materially affects the interaction.",
      "appliesWhen": "A mutation is user-visible, latency-sensitive, and has a clear temporary projection.",
      "doesNotApplyWhen": "The operation is destructive, ambiguous, or too costly to represent safely before confirmation.",
      "example": "Show a pending note with a temporary id, replace it with the server-generated record on success, and remove it with a retry action on rejection.",
      "sourceLink": "https://react.dev/reference/react/useOptimistic",
      "sourceLinks": [
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
