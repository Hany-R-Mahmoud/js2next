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
      "Separate authentication from authorization",
      "Check resource ownership or role permissions at the server boundary",
      "Avoid treating hidden UI and client state as security controls",
      "Return a deliberate denied outcome without leaking protected data"
    ],
    "whyMatters": "A route can look protected while its data operation remains vulnerable. Authorization belongs beside the resource access that must be protected, with an explicit ownership or permission decision.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "expansion-authorization-boundaries-model",
        "type": "concept",
        "title": "Name the decision",
        "content": "Authentication identifies the caller. Authorization decides whether that caller may perform this operation on this resource. Keep the decision at the server boundary that owns the data."
      },
      {
        "id": "expansion-authorization-boundaries-code",
        "type": "code-example",
        "title": "Bind identity to ownership",
        "content": "Do not load by an untrusted resource id and authorize later by assumption. Make the identity and ownership part of the protected data operation.",
        "code": "const session = await requireSession();\nconst project = await db.project.findFirst({\n  where: { id: projectId, ownerId: session.user.id },\n});\nif (!project) return forbidden();",
        "codeLanguage": "typescript",
        "codeFilePath": "Server Action or Route Handler"
      },
      {
        "id": "expansion-authorization-boundaries-question",
        "type": "question",
        "title": "Predict",
        "content": "",
        "questions": [
          {
            "id": "expansion-authorization-boundaries-check",
            "question": "Which control still matters when a user edits the request in DevTools?",
            "options": [
              "Hiding the edit button",
              "A client-side role flag",
              "A server-side identity and ownership/permission check",
              "A disabled input"
            ],
            "correctAnswer": "A server-side identity and ownership/permission check",
            "expectedReasoning": "The client can be bypassed. The protected operation must establish identity and authorize access where the data is read or changed."
          }
        ]
      },
      {
        "id": "expansion-authorization-boundaries-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Authenticate the caller, authorize the specific operation and resource at the server boundary, choose a safe denied response, and test direct requests rather than only visible navigation."
      }
    ],
    "retrievalPrompt": "Where should a resource ownership check run, and why is a hidden button insufficient?",
    "reflectionPrompt": "Pick one protected mutation. What identity, resource, permission, and denied outcome must the server evaluate?",
    "masteryCriteria": [
      "Can distinguish authentication and authorization",
      "Can bind a resource lookup to the caller identity",
      "Can explain why client UI is not a security boundary",
      "Can design a direct-request denial test"
    ],
    "nextTopics": [
      "deep-dive-production-concerns"
    ],
    "metadata": {
      "lastUpdated": "2026-07-15",
      "sources": [
        "https://nextjs.org/docs/app/guides/authentication",
        "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
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
        "concept": "A hidden edit button improves navigation but does not protect a direct request to the mutation.",
        "prediction": {
          "prompt": "Where must ownership be checked?",
          "options": [
            "Only in the UI",
            "At the protected server data boundary"
          ],
          "correctAnswer": "At the protected server data boundary",
          "feedbackCorrect": "The server remains authoritative for direct requests.",
          "feedbackWrong": "A client control can be bypassed."
        },
        "synthesis": "Authentication identifies the caller; authorization decides the requested operation on the requested resource."
      }
    ],
    "miniProject": {
      "title": "Review an ownership mutation",
      "scenario": "Design a direct-request test and server policy for editing a project owned by another user.",
      "acceptance": [
        "Trusted identity is derived server-side",
        "Resource ownership is checked before the operation",
        "Denied responses do not reveal protected data"
      ],
      "rubric": [
        {
          "dimension": "Identity",
          "evidence": "The caller comes from a trusted server session or equivalent."
        },
        {
          "dimension": "Policy",
          "evidence": "The permission check covers the exact resource and operation."
        },
        {
          "dimension": "Testing",
          "evidence": "A direct unauthorized request is covered."
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
      "scenario": "A route hides its edit button for non-owners, but the mutation accepts any projectId from the request. Review the boundary before the route ships.",
      "constraints": [
        "Treat request data as untrusted",
        "Establish the authenticated identity at the server",
        "Authorize the specific resource and operation",
        "Avoid revealing protected data through denied responses"
      ],
      "acceptanceCriteria": [
        "The mutation cannot update another owner’s project",
        "The server performs the ownership or role check even when called directly",
        "The denied outcome is deliberate and tested",
        "The explanation distinguishes authentication from authorization"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start at the mutation boundary, not the button visibility."
        },
        {
          "stage": 2,
          "text": "Join the resource lookup to the authenticated identity or apply an explicit permission policy."
        },
        {
          "stage": 3,
          "text": "Add a direct request test for a signed-in caller who does not own the resource."
        }
      ],
      "expectedReasoning": "A hidden control is a UX choice, not an authorization policy. The server must bind the caller to the resource and deny unauthorized operations consistently.",
      "commonWrongPaths": [
        "Trusting an ownerId sent by the browser",
        "Checking only middleware or page navigation",
        "Returning the protected record before checking permission",
        "Using a client role flag as the mutation guard"
      ],
      "answerExplanation": "Require a server session, use its trusted identity in the resource authorization query or policy, return a safe denied response, and test direct unauthorized requests.",
      "followUpVariation": "Add an administrator role without allowing a client-provided role to grant access.",
      "checkType": "free-text",
      "prompt": "Explain the server-side authorization review and the direct test you would require.",
      "freeTextKeywords": [
        "authorize",
        "ownership",
        "server",
        "403"
      ],
      "sourceLink": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
      "sourceLinks": [
        "https://nextjs.org/docs/app/guides/authentication"
      ]
    },
    {
      "slug": "expansion-design-session-refresh-race",
      "title": "Design a Bounded Session Refresh Race",
      "level": 9,
      "topicFamily": "production",
      "scenario": "Several requests see an expired session at once while another tab logs out. Design refresh ownership, retry limits, stale-result rejection, cross-tab invalidation, and tests.",
      "constraints": [
        "Use one refresh owner or an equivalent single-flight contract",
        "Bound retries and reject stale refresh results",
        "Keep session material out of localStorage",
        "Use cross-tab signaling only for session-view coordination",
        "Keep server authorization authoritative"
      ],
      "acceptanceCriteria": [
        "Concurrent requests do not create an unbounded refresh storm",
        "A logout in another tab invalidates the local session view",
        "A late refresh result cannot resurrect a logged-out session",
        "The design includes race, denial, and retry-bound tests",
        "The explanation does not treat BroadcastChannel as permission"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Name the owner of refresh work and the state that invalidates it."
        },
        {
          "stage": 2,
          "text": "Use a bounded retry and a generation or equivalent stale-result check."
        },
        {
          "stage": 3,
          "text": "Broadcast a safe logout/session-view event; re-check authorization at the server."
        }
      ],
      "expectedReasoning": "A single-flight refresh owner prevents duplicate work, bounded retry prevents loops, and stale-result rejection prevents a late response from restoring an invalid session. BroadcastChannel can coordinate same-origin tabs but cannot authorize a request or replace server checks.",
      "commonWrongPaths": [
        "Refreshing independently in every failed request",
        "Retrying forever on 401",
        "Storing refresh tokens in localStorage",
        "Trusting a tab event as proof of authorization",
        "Allowing a late refresh response to overwrite logout"
      ],
      "answerExplanation": "Coordinate refresh through one in-flight owner, cap retries, tag results so logout invalidates stale work, broadcast only safe session-view changes, and enforce the final permission at the protected server boundary.",
      "followUpVariation": "A mobile client cannot use BroadcastChannel. Which server-side guarantees remain unchanged?",
      "checkType": "free-text",
      "prompt": "Describe refresh ownership, stale-result rejection, cross-tab coordination, and the tests that prove the race is bounded.",
      "freeTextKeywords": [
        "single-flight",
        "retry",
        "logout",
        "BroadcastChannel",
        "server"
      ],
      "sourceLink": "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
      "sourceLinks": [
        "https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel",
        "https://nextjs.org/docs/app/guides/authentication"
      ]
    }
  ],
  "qa": [
    {
      "id": "expansion-qa-authz-boundary",
      "topicId": "expansion-authorization-boundaries",
      "topicFamily": "production",
      "question": "What is the difference between authentication and authorization?",
      "answer": "Authentication establishes who the caller is. Authorization decides whether that caller may perform a specific operation on a specific resource. Both must be enforced at the server boundary protecting the operation.",
      "followUp": "Why is hiding a button not authorization?",
      "category": "nextjs",
      "level": "advanced",
      "tags": [
        "expansion-authorization-boundaries",
        "authn",
        "authz"
      ],
      "sourceLink": "https://nextjs.org/docs/app/guides/authentication"
    },
    {
      "id": "expansion-qa-ownership-check",
      "topicId": "expansion-authorization-boundaries",
      "topicFamily": "production",
      "question": "How do you prevent an IDOR-style ownership bug?",
      "answer": "Do not trust an ownerId or role sent by the client. Derive identity from the authenticated server session and authorize the requested resource in the data operation or an equivalent server policy before returning or changing it.",
      "followUp": "Which direct request should be in the test?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "expansion-authorization-boundaries",
        "ownership",
        "security"
      ],
      "sourceLink": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
    },
    {
      "id": "expansion-qa-session-refresh-race",
      "topicId": "expansion-authorization-boundaries",
      "topicFamily": "production",
      "question": "How do you keep concurrent session refresh and logout bounded?",
      "answer": "Use one refresh owner or single-flight contract, cap retries, reject stale results after logout, and coordinate safe session-view invalidation across same-origin tabs. BroadcastChannel coordinates tabs but never replaces server authentication or authorization.",
      "followUp": "Which test proves a late refresh cannot resurrect a logged-out session?",
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
      "summary": "Use trusted server identity and resource ownership or permission checks where protected data is read or changed.",
      "rationale": "Client visibility and route redirects can be bypassed. The data operation needs a policy that remains true for direct requests and every caller.",
      "tradeOffs": "The policy must be applied consistently across reads and writes, which adds tests and server code.",
      "appliesWhen": "A route, action, or handler accesses user- or role-scoped data.",
      "doesNotApplyWhen": "The resource and operation are genuinely public.",
      "example": "Query a project by both projectId and session.user.id, then test a caller attempting to edit another owner’s project.",
      "sourceLink": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
      "sourceLinks": [
        "https://nextjs.org/docs/app/guides/authentication"
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
