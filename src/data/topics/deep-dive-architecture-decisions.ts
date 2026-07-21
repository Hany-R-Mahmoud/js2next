import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "deep-dive-architecture-decisions",
  "lesson": {
    "slug": "deep-dive-architecture-decisions",
    "title": "Deep Dive: Architecture & Trade-off Decisions",
    "topicFamily": "architecture",
    "level": "expert",
    "prerequisites": [
      "deep-dive-production-concerns"
    ],
    "learningObjectives": [
      "Choose state, route, data, and policy owners from concrete requirements",
      "Separate feature-local code from stable shared boundaries",
      "Compare a dependency or abstraction with a small local solution",
      "Record context, alternatives, consequences, evidence, and a review trigger"
    ],
    "whyMatters": "Architecture is not a final diagram. It is a sequence of reversible and irreversible choices about ownership, trust, and change. Writing the reason and consequence lets a team evolve the system without repeating old debates or preserving a boundary after its requirement disappears.",
    "estimatedMinutes": 48,
    "sections": [
      {
        "id": "deep-dive-architecture-decisions-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "Start with the change you expect. Code that serves one user capability and changes together can stay feature-local. A shared primitive is useful when several features need the same stable contract—not merely similar-looking code. State follows its consumers and lifetime: local interaction stays local, siblings lift to a common owner, shareable view state belongs in the URL, remote data follows its server or cache owner, and protected policy stays at the server boundary.\n\nEvery abstraction and dependency has a cost. Compare it with a small local implementation using API fit, maintenance, accessibility, security, performance, testability, and migration effort. The smallest responsible choice may be a library or local code; the requirement decides."
      },
      {
        "id": "deep-dive-architecture-decisions-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "A short architecture decision record states the context, constraints, considered options, decision, positive and negative consequences, supporting evidence, and review trigger. Keep it beside the code or documentation the team already maintains. The record explains a choice at a point in time; it does not make the choice permanent.\n\nUse boundaries to control dependency direction. A feature may import stable UI primitives, but a shared UI package should not import one feature’s domain state. Server-only data and policy should not enter a client package. If a second application appears, share contracts that are genuinely common while keeping app-specific routes and state independently owned."
      },
      {
        "id": "deep-dive-architecture-decisions-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "A global abstraction creates coordination: unrelated changes must now agree on its API, release timing, tests, and migration. That cost is worthwhile only when the shared behavior is real and stable. Brief duplication can be cheaper while two features are still learning their requirements. Extract when the repeated contract is understood, the owners agree, and the shared boundary reduces more change than it creates."
      },
      {
        "id": "deep-dive-architecture-decisions-example",
        "type": "code-example",
        "title": "Decision record shape",
        "content": "This record explains why visual primitives are shared while domain state remains app-owned. It also names the cost and the signal for reviewing the decision.",
        "code": "Context: web and admin apps need the same accessible Button and Field contracts.\nOptions: duplicate; shared UI package; shared domain package.\nDecision: share tested UI primitives only; keep routes and domain state in each app.\nConsequences: consistent semantics, plus package versioning and tooling cost.\nReview trigger: three stable domain workflows require the same types and policy.",
        "codeLanguage": "text",
        "codeFilePath": "docs/decisions/012-shared-ui-boundary.md"
      },
      {
        "id": "deep-dive-architecture-decisions-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-architecture-decisions-question",
            "question": "Two features have similar filters today, but different owners and likely rules next quarter. What is the strongest first decision?",
            "options": [
              "Keep the implementations feature-local and record the evidence that would justify extraction",
              "Create a global store and shared filter framework immediately",
              "Copy both filters into one mutable module variable",
              "Require both teams to share every domain type before requirements are known"
            ],
            "correctAnswer": "Keep the implementations feature-local and record the evidence that would justify extraction",
            "expectedReasoning": "The apparent similarity is not yet a stable shared contract. Local ownership keeps change independent while a review trigger makes later extraction deliberate. The other choices create shared state or types before a common owner and requirement exist."
          }
        ]
      },
      {
        "id": "deep-dive-architecture-decisions-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Architecture makes ownership and accepted costs visible. Keep uncertain behavior local, share stable contracts, protect dependency direction, and choose tools from current requirements. Record alternatives, consequences, evidence, and the event that should reopen the choice."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-architecture-decisions-prediction",
        "title": "Predict the boundary",
        "concept": "A boundary is valuable when it reduces expected change and has a clear owner.",
        "prediction": {
          "prompt": "Two components look alike but follow different domain rules. Should they share one domain abstraction now?",
          "options": [
            "Not yet; preserve local ownership until the contract is stable",
            "Yes; visual similarity proves one domain owner"
          ],
          "correctAnswer": "Not yet; preserve local ownership until the contract is stable",
          "feedbackCorrect": "Local boundaries keep the rules independent while evidence develops.",
          "feedbackWrong": "Similar appearance does not prove shared policy, lifecycle, or change ownership."
        },
        "synthesis": "Extract a shared seam from stable behavior, not appearance alone."
      },
      {
        "id": "deep-dive-architecture-decisions-failure-mode",
        "title": "Name the failure mode",
        "concept": "A decision record keeps a choice revisable by preserving why and when it should change.",
        "prediction": {
          "prompt": "Which missing detail makes an architecture decision hardest to revisit?",
          "options": [
            "The accepted consequences and review trigger",
            "A fashionable tool name",
            "A permanent statement that alternatives are forbidden"
          ],
          "correctAnswer": "The accepted consequences and review trigger",
          "feedbackCorrect": "Those details reveal whether the original trade-off still fits current evidence.",
          "feedbackWrong": "Popularity and permanence do not explain fit or identify when the context changed."
        },
        "synthesis": "Record enough context to decide again, not enough ceremony to avoid the decision."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Architecture & Trade-off Decisions",
      "scenario": "Write a design review for a Learning Notes feature that spans routes, URL filters, server data, an accessible mutation form, and possible shared UI.",
      "acceptance": [
        "Every route, state value, data read, mutation, and policy has one named owner",
        "The Server/Client boundary and transferred data shape are explicit",
        "At least two options are compared with positive and negative consequences",
        "The decision includes observable tests and a measurable review trigger"
      ],
      "rubric": [
        {
          "dimension": "Model",
          "evidence": "The implementation demonstrates: Choose state ownership deliberately."
        },
        {
          "dimension": "Boundary",
          "evidence": "The explanation identifies the ownership or lifecycle boundary for architecture & trade-off decisions."
        },
        {
          "dimension": "Verification",
          "evidence": "A failure state and an observable test are included."
        }
      ]
    },
    "diagram": {
      "title": "Model → boundary → observable outcome",
      "kind": "flow",
      "nodes": [
        {
          "id": "model",
          "label": "Core model",
          "role": "Architecture & Trade-off Decisions"
        },
        {
          "id": "boundary",
          "label": "Explicit boundary",
          "role": "Where ownership and policy live"
        },
        {
          "id": "outcome",
          "label": "Observable outcome",
          "role": "What a learner or user can verify"
        }
      ],
      "edges": [
        {
          "from": "model",
          "to": "boundary",
          "label": "guides the decision"
        },
        {
          "from": "boundary",
          "to": "outcome",
          "label": "makes behavior testable"
        }
      ]
    },
    "retrievalPrompt": "For one feature, name every state and data owner, the trust boundary, the shared seams, one rejected alternative, one accepted cost, and the signal that would reopen the decision.",
    "reflectionPrompt": "Find an abstraction or dependency used by several features. Is the shared requirement stable, or are the callers only superficially similar?",
    "masteryCriteria": [
      "Can map each value and policy to one accountable owner",
      "Can keep a feature local until evidence supports a shared seam",
      "Can compare options using present constraints rather than popularity",
      "Can write a decision record with consequences and a measurable review trigger"
    ],
    "nextTopics": [],
    "metadata": {
      "reactVersion": "19.2.7",
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://react.dev/learn/sharing-state-between-components",
        "https://react.dev/learn/choosing-the-state-structure",
        "https://nextjs.org/docs/15/app/getting-started/project-structure",
        "https://nextjs.org/docs/15/app/getting-started/server-and-client-components",
        "https://adr.github.io/"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-arch-5",
      "title": "Deep Challenge: Choose state location",
      "level": 5,
      "topicFamily": "architecture",
      "scenario": "A dashboard date range must survive refresh, support back and forward navigation, and be shareable with a teammate. Choose its primary owner and explain what remains local.",
      "constraints": [
        "Choose one source of truth for the shareable range",
        "Define missing and invalid value behavior",
        "Keep unrelated transient interaction state out of the public contract"
      ],
      "acceptanceCriteria": [
        "The URL search params own the date range",
        "The parsing boundary documents a safe default and invalid range response",
        "A copied URL and browser history reproduce the view",
        "Calendar popover visibility remains local"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "List the required lifetime: refresh, sharing, and browser history all point to a route-owned value."
        },
        {
          "stage": 2,
          "text": "Name the URL keys and parse them before the query uses them."
        },
        {
          "stage": 3,
          "text": "Do not put the popover’s open state in the URL unless it has a real sharing requirement."
        }
      ],
      "expectedReasoning": "The URL is the product contract that satisfies sharing and navigation. The route parses it into valid inputs. Ephemeral calendar interaction remains local, preventing public state from collecting values that have no meaning after navigation.",
      "commonWrongPaths": [
        "Keeping the only date range in component state",
        "Maintaining independent writable copies in URL and global state",
        "Putting every hover and popover value in the URL"
      ],
      "answerExplanation": "Choose the URL because its built-in lifetime matches the requirement. Parse once at the route boundary and keep transient control state local.",
      "followUpVariation": "The product adds a saved personal default. Explain how the server preference supplies a default without replacing the explicit URL value.",
      "checkType": "choice",
      "prompt": "What is the best primary home for the date range?",
      "options": [
        "Module-level let variable",
        "URL search params",
        "CSS custom properties only",
        "Only sessionStorage with no URL"
      ],
      "correctIndex": 1,
      "sourceLink": "https://react.dev/learn/sharing-state-between-components",
      "sourceLinks": [
        "https://react.dev/learn/sharing-state-between-components",
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating#using-the-native-history-api",
        "https://react.dev/learn/choosing-the-state-structure"
      ]
    },
    {
      "slug": "learn-react-ch-arch-8",
      "title": "Deep Challenge: Defend an architecture under change",
      "level": 8,
      "topicFamily": "architecture",
      "scenario": "A second Next.js app needs the same accessible buttons and fields as the first app, but its routes, authorization, and business workflows differ. Propose a boundary that shares the stable contract without coupling both apps.",
      "constraints": [
        "Preserve independent app routes and domain state",
        "Share only a named, stable UI contract",
        "State one tooling or release cost introduced by sharing"
      ],
      "acceptanceCriteria": [
        "A shared UI package contains tested primitives and no app-specific domain policy",
        "Each app keeps feature routes, server data, and authorization local",
        "Dependency direction prevents the UI package from importing either app",
        "The decision names a review trigger for extracting a future domain package"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "List the contract that is genuinely identical: semantics, variants, focus behavior, and tokens."
        },
        {
          "stage": 2,
          "text": "Draw arrows from each app to the UI package; the package should not point back to an app."
        },
        {
          "stage": 3,
          "text": "Record the cost of package tooling and the evidence needed before sharing domain code."
        }
      ],
      "expectedReasoning": "Accessible UI behavior is a stable shared contract, while routes and domain policy have different owners. A one-way shared package reduces visual and semantic duplication without creating a cross-app state owner. Tooling cost is accepted and reviewed against actual reuse.",
      "commonWrongPaths": [
        "One shared global store for both independently deployed apps",
        "Moving app-specific authorization into the presentation package",
        "Creating a domain package solely because two current functions have similar names"
      ],
      "answerExplanation": "Share the stable UI seam and keep each app’s changing domain boundary local. Document dependency direction, tooling cost, and the evidence that would justify more sharing later.",
      "followUpVariation": "Both apps now implement the same audited permission policy. What evidence and ownership would be required before extracting it?",
      "checkType": "free-text",
      "prompt": "Outline a structure and one trade-off.",
      "freeTextKeywords": [
        "package",
        "feature",
        "app"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components",
      "sourceLinks": [
        "https://react.dev/learn/sharing-state-between-components",
        "https://nextjs.org/docs/15/app/getting-started/project-structure",
        "https://adr.github.io/"
      ]
    },
    {
      "slug": "learn-react-ch-capstone-10",
      "title": "Deep Challenge: Capstone: feature design review",
      "level": 10,
      "topicFamily": "architecture",
      "scenario": "Design a Learning Notes vertical slice: list notes, filter by shareable tag, create a note, recover from validation failure, and keep client JavaScript limited to required interaction.",
      "constraints": [
        "Server owns authoritative notes and protected writes",
        "The URL owns the shareable tag filter",
        "The form remains accessible and preserves useful input after rejection",
        "No new dependency is assumed without a documented requirement"
      ],
      "acceptanceCriteria": [
        "The route tree and Server/Client transfer shape are explicit",
        "The read has a freshness policy and the successful mutation has targeted revalidation",
        "Validation, authorization, pending, empty, error, success, and retry states are covered",
        "The review compares one alternative and states an accepted cost and review trigger"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start with the URL and server data owners, then add the smallest client interaction boundary."
        },
        {
          "stage": 2,
          "text": "Write the mutation order: parse, authenticate, authorize, save, revalidate, return a safe result."
        },
        {
          "stage": 3,
          "text": "List observable tests for a copied filter URL, keyboard form use, invalid input, denied access, and refresh after success."
        }
      ],
      "expectedReasoning": "The design assigns one owner to route state, authoritative data, interaction, and policy. The mutation trust boundary is explicit, and revalidation follows a successful write. Tests verify the user contract and denied paths. The decision record keeps the architecture proportional and revisable.",
      "commonWrongPaths": [
        "Fetching everything again in several Client Components",
        "Keeping independent filter copies in the URL and a global store",
        "Trusting client validation or hiding controls as authorization"
      ],
      "answerExplanation": "Build a vertical slice with route-owned filters, server-owned data and policy, focused client interaction, accessible recovery, and a documented freshness and test contract.",
      "followUpVariation": "Add offline note drafts. Identify the new lifetime requirement and the boundary that should own it.",
      "checkType": "free-text",
      "prompt": "Write a short design covering routes, server/client split, state locations, and acceptance tests.",
      "freeTextKeywords": [
        "server",
        "url",
        "revalidat",
        "test",
        "label"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components",
      "sourceLinks": [
        "https://react.dev/learn/sharing-state-between-components",
        "https://nextjs.org/docs/15/app/getting-started/server-and-client-components",
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://nextjs.org/docs/15/app/guides/caching",
        "https://www.w3.org/WAI/tutorials/forms/"
      ]
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-architecture-decisions-question",
      "question": "What is the strongest reason to delay a global store?",
      "answer": "Delay the global store when current consumers and lifetimes have clear local owners. A wider store adds a subscription and coordination boundary. Record the requirement that would justify moving, such as independent cross-tree consumers or a shared lifecycle that local lifting cannot express clearly.",
      "followUp": "What concrete new consumer or lifetime would make the current owner too narrow?",
      "category": "architecture",
      "level": "expert",
      "topicId": "deep-dive-architecture-decisions",
      "topicFamily": "architecture",
      "tags": [
        "learn-react-bridge",
        "architecture"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components",
      "sourceLinks": [
        "https://react.dev/learn/sharing-state-between-components",
        "https://react.dev/learn/choosing-the-state-structure"
      ]
    },
    {
      "id": "loop-qa-deep-dive-architecture-decisions-1",
      "topicId": "deep-dive-architecture-decisions",
      "topicFamily": "architecture",
      "question": "When is brief duplication safer than a shared abstraction?",
      "answer": "When features only look similar and their rules, owners, or expected changes are still different or uncertain. Local code lets each feature learn. Extract after the common contract is stable and the shared boundary reduces more coordination than it introduces.",
      "followUp": "Which repeated behavior is stable enough to name as a contract today?",
      "category": "architecture",
      "level": "expert",
      "tags": [
        "topic-loop",
        "deep-dive-architecture-decisions"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components",
      "sourceLinks": [
        "https://react.dev/learn/sharing-state-between-components",
        "https://nextjs.org/docs/15/app/getting-started/project-structure"
      ]
    },
    {
      "id": "loop-qa-deep-dive-architecture-decisions-2",
      "topicId": "deep-dive-architecture-decisions",
      "topicFamily": "architecture",
      "question": "What makes an architecture decision useful after the original meeting?",
      "answer": "It records the context, constraints, considered options, choice, positive and negative consequences, evidence, and a review trigger. A teammate can then tell whether the reason still applies and revisit the decision without guessing its history.",
      "followUp": "Which measurable signal would reopen your latest architecture decision?",
      "category": "architecture",
      "level": "expert",
      "tags": [
        "topic-loop",
        "deep-dive-architecture-decisions"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components",
      "sourceLinks": [
        "https://react.dev/learn/sharing-state-between-components",
        "https://adr.github.io/"
      ]
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "architecture",
    "level": "expert",
    "title": "Deep Dive: Architecture & Trade-off Decisions"
  }
};
