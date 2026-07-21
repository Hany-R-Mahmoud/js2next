import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "expansion-authorization-boundaries",
  "lesson": {
    "slug": "expansion-authorization-boundaries",
    "title": "Authorize at the Server Data Boundary",
    "topicFamily": "production",
    "level": "advanced",
    "prerequisites": [
      "expansion-accessible-forms",
      "expansion-client-server-state"
    ],
    "learningObjectives": [
      "Separate caller identity from permission for one operation and resource",
      "Place ownership and role checks beside protected server data access",
      "Treat hidden controls, route redirects, and browser state as user experience rather than authorization",
      "Design safe denial and bounded session-refresh behavior for direct requests"
    ],
    "whyMatters": "A signed-in user is not automatically allowed to read or change every record. The browser can alter IDs, roles, and requests, so the protected server operation must establish trusted identity and decide permission before data is returned or changed.",
    "estimatedMinutes": 44,
    "sections": [
      {
        "id": "expansion-authorization-boundaries-model",
        "type": "concept",
        "title": "Name the decision",
        "content": "Authentication answers “who is calling?” Authorization answers “may this caller perform this operation on this resource?” A valid session supplies identity; it does not grant every permission. At the server operation, parse the untrusted resource id, obtain the trusted caller from the server session, and apply an ownership, role, or policy check before reading or mutating protected data.\n\nA hidden button and a route redirect can make navigation clearer, but a caller can still send the request directly. Middleware may reject broad route classes early, yet each protected data operation still owns its specific authorization decision and safe denied outcome."
      },
      {
        "id": "expansion-authorization-boundaries-code",
        "type": "code-example",
        "title": "Bind identity to ownership",
        "content": "This query binds the untrusted project id to the trusted session identity. If the lookup finds nothing, the operation returns a safe denial without first exposing the project. A role-based exception would be an explicit server policy, never a role copied from the browser.",
        "code": "const session = await requireSession();\nconst projectId = parseProjectId(formData.get('projectId'));\n\nconst project = await db.project.findFirst({\n  where: { id: projectId, ownerId: session.user.id },\n});\n\nif (!project) return { ok: false, code: 'FORBIDDEN' };\nawait db.project.update({ where: { id: project.id }, data: parseEdit(formData) });\nreturn { ok: true };",
        "codeLanguage": "typescript",
        "codeFilePath": "app/projects/actions.ts"
      },
      {
        "id": "expansion-authorization-boundaries-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-authorization-boundaries-check",
            "question": "A signed-in user changes projectId in a direct request. Which check protects another user’s project?",
            "options": [
              "A server query or policy that binds the requested project and operation to trusted caller identity",
              "The edit button being hidden in the rendered page",
              "An ownerId value sent by the browser",
              "A disabled project-id input"
            ],
            "correctAnswer": "A server query or policy that binds the requested project and operation to trusted caller identity",
            "expectedReasoning": "The browser-controlled ID, hidden button, and disabled input can all be changed or bypassed. The protected server operation must derive identity from a trusted session and authorize that identity for the exact resource and action."
          }
        ]
      },
      {
        "id": "expansion-authorization-boundaries-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "For every protected operation, establish trusted identity, parse request data, authorize the operation and resource, and only then read or write. Return a deliberate denial that does not leak protected details, and verify the policy with direct requests from anonymous, permitted, and authenticated-but-unpermitted callers."
      }
    ],
    "retrievalPrompt": "Trace a protected project edit through authentication, input parsing, resource lookup, authorization, mutation, denial, and a direct unauthorized test.",
    "reflectionPrompt": "Choose one protected read or write. Which caller, operation, resource, and policy must the server evaluate, and what information should a denied response avoid revealing?",
    "masteryCriteria": [
      "Can explain authentication and authorization as separate server decisions",
      "Can bind a resource lookup or policy to trusted caller identity",
      "Can show why middleware, redirects, and hidden UI do not replace data-layer checks",
      "Can test denial, concurrent refresh, logout, and stale-result cases directly"
    ],
    "nextTopics": [
      "deep-dive-production-concerns"
    ],
    "metadata": {
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/app/guides/authentication",
        "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
        "https://nextjs.org/docs/15/app/guides/authentication",
        "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
        "https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel"
      ]
    },
    "diagram": {
      "title": "Identity to protected operation",
      "kind": "layers",
      "nodes": [
        {
          "id": "identity",
          "label": "Authenticate",
          "role": "Establish caller identity"
        },
        {
          "id": "permission",
          "label": "Authorize",
          "role": "Resource and operation policy"
        },
        {
          "id": "operation",
          "label": "Data operation",
          "role": "Read or mutate"
        },
        {
          "id": "denied",
          "label": "Safe denied path",
          "role": "No protected leakage"
        }
      ],
      "edges": [
        {
          "from": "identity",
          "to": "permission"
        },
        {
          "from": "permission",
          "to": "operation"
        },
        {
          "from": "permission",
          "to": "denied"
        }
      ]
    },
    "chunks": [
      {
        "id": "expansion-authorization-boundaries-retrieval-1",
        "title": "Do not trust the button",
        "concept": "Visible navigation can guide a user, but authorization belongs to the server operation that owns protected data.",
        "prediction": {
          "prompt": "A page redirects non-owners, but its Server Action updates by projectId alone. Is the project protected?",
          "options": [
            "No; the action still needs its own ownership or permission check",
            "Yes; the page redirect authorizes every direct action call"
          ],
          "correctAnswer": "No; the action still needs its own ownership or permission check",
          "feedbackCorrect": "The action is a separate protected entry point and must authorize the exact project and operation.",
          "feedbackWrong": "A caller can bypass visible navigation and invoke a server endpoint with altered request data."
        },
        "synthesis": "Authorize every protected entry point with trusted identity and resource policy."
      }
    ],
    "miniProject": {
      "title": "Review an ownership mutation",
      "scenario": "Review a project edit operation and a session refresh flow that can overlap with logout in another tab.",
      "acceptance": [
        "Anonymous, owner, non-owner, and allowed-role cases have explicit outcomes",
        "The protected lookup or policy uses trusted server identity before returning or changing data",
        "Refresh work has one bounded owner and a late result cannot reverse logout",
        "Denied responses, logs, and cross-tab messages expose no session secret or protected record"
      ],
      "rubric": [
        {
          "dimension": "Policy",
          "evidence": "Caller, operation, resource, and permission are all explicit."
        },
        {
          "dimension": "Race safety",
          "evidence": "Refresh retry, logout invalidation, and stale-result rules are bounded and testable."
        },
        {
          "dimension": "Disclosure",
          "evidence": "Denial and coordination reveal only what the caller needs to recover."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "expansion-review-ownership-check",
      "title": "Review an Ownership Check",
      "level": 8,
      "topicFamily": "production",
      "scenario": "The project page hides Edit for non-owners, but `updateProject(projectId, changes)` accepts any browser-provided id. Review and repair the operation before release.",
      "constraints": [
        "Treat projectId, ownerId, role, and changes from the browser as untrusted",
        "Use authenticated server identity",
        "Authorize the exact edit operation before returning or changing protected data",
        "Provide a safe denial and direct-request tests"
      ],
      "acceptanceCriteria": [
        "An owner can edit the intended project",
        "A signed-in non-owner and an anonymous caller cannot read or update it through the operation",
        "Any administrator exception comes from a trusted server policy",
        "The denied path does not expose the protected record",
        "Tests call the server boundary directly with altered project ids"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write a small table for anonymous, owner, non-owner, and administrator outcomes."
        },
        {
          "stage": 2,
          "text": "Use the session user id in the protected lookup or evaluate an explicit server permission policy."
        },
        {
          "stage": 3,
          "text": "Assert that a direct non-owner request changes no record and receives the deliberate denied result."
        }
      ],
      "expectedReasoning": "The UI is not the trust boundary. The operation derives identity from the server session, validates the requested id and changes, applies ownership or role policy before access, and returns a safe denial. Direct tests prove the check survives bypassed navigation.",
      "commonWrongPaths": [
        "Trusting ownerId or role from the request",
        "Checking only button visibility, middleware, or page navigation",
        "Loading and returning the protected record before permission is known",
        "Testing only the successful owner case"
      ],
      "answerExplanation": "Bind the requested project to trusted session identity or an explicit server role policy, deny before disclosure or mutation, and test the server entry point directly for every permission class.",
      "followUpVariation": "Add a support role that may read but not edit. Express operation-specific policy without trusting a client role flag.",
      "checkType": "free-text",
      "prompt": "Describe the trusted identity, resource policy, safe denial, and direct tests for this project edit.",
      "freeTextKeywords": [
        "identity",
        "authorize",
        "resource",
        "server"
      ],
      "sourceLink": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
      "sourceLinks": [
        "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
        "https://nextjs.org/docs/app/guides/authentication",
        "https://nextjs.org/docs/15/app/guides/authentication"
      ]
    },
    {
      "slug": "expansion-design-session-refresh-race",
      "title": "Design a Bounded Session Refresh Race",
      "level": 9,
      "topicFamily": "production",
      "scenario": "Three requests notice an expired session together. While one refresh is running, another tab logs out. Design a bounded client coordination model without weakening server authorization.",
      "constraints": [
        "Use one in-flight refresh owner or an equivalent single-flight contract",
        "Cap retries and stop on non-recoverable denial",
        "Invalidate any refresh result that began before logout",
        "Do not store session credentials in localStorage or broadcast them",
        "Keep every protected server operation authoritative"
      ],
      "acceptanceCriteria": [
        "Concurrent failures share one refresh attempt instead of creating a storm",
        "A generation, epoch, or equivalent rule rejects the late pre-logout result",
        "A same-origin tab message updates session view only and contains no credential",
        "Retry, denial, timeout, logout, and late-success races have bounded tests",
        "Protected data remains inaccessible unless the server authorizes the final request"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Store one in-flight Promise and let concurrent callers await the same result."
        },
        {
          "stage": 2,
          "text": "Increment a session generation on logout and compare it before accepting a refresh result."
        },
        {
          "stage": 3,
          "text": "Broadcast only a safe “session changed” event; the server still decides whether later requests are allowed."
        }
      ],
      "expectedReasoning": "Single-flight ownership prevents duplicate refresh work, retry limits prevent loops, and a logout generation prevents a late result from restoring an invalid view. BroadcastChannel can coordinate same-origin tabs, but it carries no authorization authority and no session credential.",
      "commonWrongPaths": [
        "Starting an independent refresh for every failed request",
        "Retrying every 401 without a bound",
        "Saving or broadcasting refresh credentials",
        "Accepting a refresh response that started before logout",
        "Treating a tab message as server permission"
      ],
      "answerExplanation": "Share one bounded refresh attempt, tag it with the current session generation, invalidate that generation on logout, broadcast only safe view coordination, and authorize every retried protected request on the server.",
      "followUpVariation": "A mobile client cannot use BroadcastChannel. Identify the refresh and server-authorization guarantees that remain unchanged.",
      "checkType": "free-text",
      "prompt": "Describe single-flight refresh, retry bounds, logout invalidation, safe tab coordination, and the race tests.",
      "freeTextKeywords": [
        "single-flight",
        "retry",
        "generation",
        "logout",
        "server"
      ],
      "sourceLink": "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
      "sourceLinks": [
        "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
        "https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel",
        "https://nextjs.org/docs/app/guides/authentication",
        "https://nextjs.org/docs/15/app/guides/authentication"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-authz-boundary",
      "topicId": "expansion-authorization-boundaries",
      "topicFamily": "production",
      "question": "What is the difference between authentication and authorization?",
      "answer": "Authentication establishes a trusted caller identity, usually through a server-validated session. Authorization then decides whether that caller may perform one operation on one resource. A protected Server Function or Route Handler needs both decisions before data access.",
      "followUp": "Which signed-in caller should your next authorization test deny, and for which resource and operation?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-authorization-boundaries",
        "authn",
        "authz"
      ],
      "sourceLink": "https://nextjs.org/docs/app/guides/authentication",
      "sourceLinks": [
        "https://nextjs.org/docs/app/guides/authentication",
        "https://nextjs.org/docs/15/app/guides/authentication"
      ]
    },
    {
      "id": "expansion-qa-ownership-check",
      "topicId": "expansion-authorization-boundaries",
      "topicFamily": "production",
      "question": "How does a server prevent an insecure direct object reference in a project operation?",
      "answer": "It parses the requested project id, derives caller identity from the trusted server session, and authorizes that identity for the exact read or write before returning or changing the project. Client-provided owner ids and roles are not permission evidence.",
      "followUp": "What should a direct non-owner request prove about both the response and stored project?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "expansion-authorization-boundaries",
        "ownership",
        "security"
      ],
      "sourceLink": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
      "sourceLinks": [
        "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
      ]
    },
    {
      "id": "expansion-qa-session-refresh-race",
      "topicId": "expansion-authorization-boundaries",
      "topicFamily": "production",
      "question": "How do you keep concurrent session refresh and logout bounded?",
      "answer": "Share one in-flight refresh attempt, cap retries, and associate the attempt with a session generation. Logout changes the generation, so a late earlier response is ignored. Same-origin tabs may broadcast a safe session-view change, but credentials and authorization remain server-owned.",
      "followUp": "How will a test pause the refresh, perform logout, release the response, and prove the session stays logged out?",
      "category": "architecture",
      "level": "expert",
      "tags": [
        "expansion-authorization-boundaries",
        "session",
        "refresh-race",
        "single-flight",
        "security"
      ],
      "sourceLink": "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
      "sourceLinks": [
        "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
        "https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel",
        "https://nextjs.org/docs/app/guides/authentication"
      ]
    }
  ],
  "practices": [
    {
      "id": "expansion-authorize-at-data-boundary",
      "topicId": "expansion-authorization-boundaries",
      "topicFamily": "production",
      "title": "Authorize at the Protected Data Boundary",
      "summary": "At each protected server read or write, bind trusted caller identity to the requested operation and resource before access.",
      "rationale": "Routes and buttons can be bypassed. A data-boundary check protects direct requests and makes ownership or role policy testable at the point that matters.",
      "tradeOffs": "Every protected entry point needs consistent policy and denial tests. Central helpers may reduce repetition, but each operation must still pass its real resource and action.",
      "appliesWhen": "A Server Function, Route Handler, or server read touches user-, tenant-, or role-scoped data.",
      "doesNotApplyWhen": "The operation and resource are intentionally public and disclose no protected data.",
      "example": "Parse projectId, obtain session.user.id, query or authorize the project for edit, deny safely if no permission exists, and test a direct non-owner request.",
      "sourceLink": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
      "sourceLinks": [
        "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
        "https://nextjs.org/docs/app/guides/authentication",
        "https://nextjs.org/docs/15/app/guides/authentication"
      ],
      "tags": [
        "expansion-authorization-boundaries",
        "authorization",
        "security"
      ]
    }
  ],
  "meta": {
    "topicFamily": "production",
    "level": "advanced",
    "title": "Authorize at the Server Data Boundary"
  }
};
