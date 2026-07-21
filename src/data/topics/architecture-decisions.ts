import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "architecture-decisions",
  "lesson": {
    "slug": "architecture-decisions",
    "title": "Architecture & Decision-Making",
    "topicFamily": "architecture",
    "level": "advanced",
    "prerequisites": [
      "server-vs-client-components",
      "use-reducer-and-context",
      "server-data-fetching"
    ],
    "learningObjectives": [
      "Organize code around clear ownership and change boundaries",
      "Choose the smallest state owner that serves every consumer",
      "Keep validation, authentication, and authorization at trustworthy boundaries",
      "Evaluate a dependency from requirements, cost, evidence, and an exit plan",
      "Record an architecture decision so a teammate can understand and revisit it"
    ],
    "whyMatters": "Architecture is the set of boundaries that makes change understandable. A useful decision names the problem, the owner, the trade-offs, and the evidence that will show whether the choice is working. That is more durable than choosing a folder pattern or library because it is popular.",
    "estimatedMinutes": 42,
    "sections": [
      {
        "id": "feature-organization",
        "type": "concept",
        "title": "Feature organization",
        "content": "There is no single folder layout that fits every application. Start with ownership: which code changes together because it serves one user capability? A small project can keep route, component, and helper files close together. As a feature grows, a feature folder can group its UI, tests, types, and server access while truly shared code remains outside it.\n\nIn the Next.js App Router, files can safely live inside a route segment without becoming routes; a segment becomes public through route files such as `page` or `route`. Use private folders or route groups when they make intent clearer. Reorganize when navigation, ownership, or repeated cross-feature imports provide evidence that the current boundary is costly."
      },
      {
        "id": "state-ownership",
        "type": "concept",
        "title": "State ownership and boundaries",
        "content": "Place each state value at the lowest component that must coordinate every consumer of that value. Keep temporary input or open/closed state local when only one component needs it. Lift state to the closest common parent when siblings must agree. Use context when a stable value must reach a distant subtree and passing it through many unrelated components obscures the API. Use an external store only when its subscription or cross-tree requirements justify another system.\n\nDo not copy a value into several owners. Keep one source of truth, pass it down, and derive values such as filtered lists during render. For server data, prefer the framework data boundary and cache model before copying remote results into global client state."
      },
      {
        "id": "network-boundary",
        "type": "concept",
        "title": "The network boundary",
        "content": "The browser is an untrusted caller. Client validation can give fast, kind feedback, but the server must validate every value that affects stored data or protected work. Authenticate the current user, authorize the exact operation on the exact resource, and return a safe result. Keep secrets and private data access in server-only modules.\n\nDesign failure as part of the contract: define validation errors, unavailable dependencies, empty results, and retry behavior. The UI can then show a useful recovery path instead of treating every failure as an unexpected exception."
      },
      {
        "id": "dependency-decisions",
        "type": "concept",
        "title": "Dependency choices",
        "content": "Begin with the requirement, not a library name. Write the behavior you need, the environments it must support, and the risks it must reduce. Compare a small local implementation with candidate dependencies using evidence: API fit, accessibility, security history, maintenance, bundle or runtime cost, testability, and migration cost.\n\nA dependency can be the simplest responsible choice when it solves difficult, well-understood work. It can also add more concepts than the feature needs. Record why it was chosen, how it is isolated behind your code, and what signal would cause a review. Check the current official documentation before adopting or upgrading it."
      },
      {
        "id": "architecture-question",
        "type": "question",
        "title": "Check your understanding",
        "content": "",
        "questions": [
          {
            "id": "q10",
            "question": "A product filter is used only inside one catalog subtree today. A team proposes a global store because another project used one. What is the best first decision?",
            "options": [
              "Keep the state at the closest catalog owner and record what future requirement would justify moving it",
              "Move it to a global store now so the architecture looks consistent",
              "Copy the filter into local state and URL state without choosing one owner",
              "Put the filter in a module variable so every component can mutate it"
            ],
            "correctAnswer": "Keep the state at the closest catalog owner and record what future requirement would justify moving it",
            "expectedReasoning": "The current consumers define a clear local owner, and a review trigger keeps the choice reversible. A global store adds a new subscription boundary without a present requirement. Duplicating the value creates synchronization problems. A mutable module variable bypasses React state and has unclear lifecycle and ownership.",
            "commonMisconceptions": [
              "Treating a familiar tool as evidence that every feature needs it",
              "Assuming more global access automatically means simpler ownership",
              "Keeping several writable copies of the same decision value"
            ]
          }
        ]
      },
      {
        "id": "architecture-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Start with the user capability and expected changes. Name one owner for UI, state, data access, and policy. Put trustworthy checks at the server boundary. Choose dependencies from explicit requirements and evidence. Write down the decision, consequences, and review signal so the architecture can evolve without losing its reasoning."
      }
    ],
    "retrievalPrompt": "For one feature, name its UI owner, state owner, server boundary, dependency choices, and the evidence that would make you revisit the design.",
    "reflectionPrompt": "Find one decision in your project that is currently implicit. Write the context, options, choice, consequences, and one review trigger.",
    "masteryCriteria": [
      "Can explain a feature boundary in terms of ownership and expected change",
      "Can place state from the consumers that need one shared value",
      "Can distinguish a user-friendly UI check from a trustworthy server check",
      "Can compare a dependency with a small local solution without trend-based reasoning",
      "Can write a short decision record with consequences and a review trigger"
    ],
    "nextTopics": [],
    "metadata": {
      "reactVersion": "19.2.7",
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://nextjs.org/docs/15/app/getting-started/project-structure",
        "https://react.dev/learn/sharing-state-between-components",
        "https://react.dev/learn/choosing-the-state-structure",
        "https://nextjs.org/docs/15/app/guides/authentication",
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://adr.github.io/",
        "https://nextjs.org/docs/app/building-your-application/rendering"
      ]
    },
    "diagram": {
      "title": "Architecture as a decision loop",
      "kind": "flow",
      "nodes": [
        {
          "id": "need",
          "label": "Product need",
          "role": "User and operational contract"
        },
        {
          "id": "boundary",
          "label": "Ownership boundary",
          "role": "Where state/data lives"
        },
        {
          "id": "decision",
          "label": "Trade-off record",
          "role": "Choice and rejected alternatives"
        },
        {
          "id": "evidence",
          "label": "Evidence",
          "role": "Measure and revisit"
        }
      ],
      "edges": [
        {
          "from": "need",
          "to": "boundary"
        },
        {
          "from": "boundary",
          "to": "decision"
        },
        {
          "from": "decision",
          "to": "evidence"
        },
        {
          "from": "evidence",
          "to": "boundary",
          "label": "revisit when evidence changes"
        }
      ]
    },
    "chunks": [
      {
        "id": "architecture-decisions-retrieval-1",
        "title": "Reject trend-driven ownership",
        "concept": "Architecture is a revisable ownership decision supported by requirements and evidence.",
        "prediction": {
          "prompt": "A teammate asks why a dependency and state boundary were chosen. Which answer is most useful?",
          "options": [
            "The requirement, considered options, trade-offs, evidence, and review trigger",
            "The tool is popular and the folder structure looks modern",
            "The decision should never be revisited after implementation"
          ],
          "correctAnswer": "The requirement, considered options, trade-offs, evidence, and review trigger",
          "feedbackCorrect": "That answer makes the decision understandable, testable, and safe to revisit.",
          "feedbackWrong": "Popularity and permanence do not explain fit. Connect the choice to a need, consequences, evidence, and a review signal."
        },
        "synthesis": "A good boundary has a named owner, a reason, observable evidence, and a path to change."
      }
    ],
    "miniProject": {
      "title": "Write an architecture decision record",
      "scenario": "Write an architecture decision record for a filterable catalog that needs shareable URL filters, server data, and one protected saved-search action.",
      "acceptance": [
        "Names the owners of URL state, local interaction state, server data, and authorization",
        "Compares at least two state or dependency options against current requirements",
        "Lists positive and negative consequences plus one measurable review trigger",
        "Includes success, validation failure, unavailable-data, and retry behavior"
      ],
      "rubric": [
        {
          "dimension": "Ownership",
          "evidence": "State and data boundaries are non-duplicated and explainable."
        },
        {
          "dimension": "Trade-offs",
          "evidence": "The cost of the chosen option and alternatives is explicit."
        },
        {
          "dimension": "Evidence",
          "evidence": "The decision includes a measurable reason to revisit it."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "choose-state-strategy",
      "title": "Choose a State Strategy",
      "level": 5,
      "topicFamily": "architecture",
      "scenario": "A catalog has a local draft search field, shareable URL filters, server-fetched results, and a compare tray used by two sibling panels. Choose an owner for each value and explain when you would reconsider it.",
      "constraints": [
        "Give every writable value one source of truth",
        "Keep server data separate from client interaction state",
        "Use current consumers and required persistence to justify each boundary"
      ],
      "acceptanceCriteria": [
        "The draft search remains local unless another consumer needs it",
        "Shareable filters use the URL as their owner",
        "The compare tray is lifted to the closest common parent of its consumers",
        "The answer names a concrete trigger that could justify context or an external store later"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "List each value, who reads it, who writes it, and whether it must survive navigation or be shareable."
        },
        {
          "stage": 2,
          "text": "The URL is useful state when reload and sharing must reproduce the same filter."
        },
        {
          "stage": 3,
          "text": "Choose the closest common owner for the compare tray; add a wider state system only when a wider requirement appears."
        }
      ],
      "expectedReasoning": "State location follows consumers and lifetime. Local drafts stay local, shareable filters belong in the URL, siblings share through their closest common owner, and server results remain in the server data boundary. A future cross-route consumer or independent subscription requirement could justify a wider client store.",
      "commonWrongPaths": [
        "Putting every value in one global store without a present requirement",
        "Keeping URL filters and local filter state as independent writable copies",
        "Treating server-fetched results as permanent global client state by default"
      ],
      "answerExplanation": "Map each value to its consumers and lifetime, then choose the narrowest owner that satisfies them. This produces one source of truth now while leaving an explicit trigger for a future change.",
      "followUpVariation": "A compare tray must now survive route changes. Which requirement changed, and what new boundary would you evaluate?",
      "sourceLinks": [
        "https://react.dev/learn/sharing-state-between-components",
        "https://react.dev/learn/choosing-the-state-structure",
        "https://nextjs.org/docs/15/app/getting-started/linking-and-navigating#using-the-native-history-api",
        "https://tanstack.com/query/latest/docs/framework/react/overview"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components"
    },
    {
      "slug": "capstone-build-portfolio",
      "title": "Capstone: Build a Developer Portfolio",
      "level": 10,
      "topicFamily": "architecture",
      "scenario": "Plan and build a small developer portfolio with a project list, project detail routes, a contact form, and a documented deployment decision. Keep the architecture proportional to this scope.",
      "constraints": [
        "Use the existing React and Next.js stack without adding a dependency unless a written requirement justifies it",
        "Keep secrets and contact-form validation on the server",
        "Record one architecture decision with alternatives, consequences, and a review trigger"
      ],
      "acceptanceCriteria": [
        "Routes, feature ownership, and data boundaries are easy to trace",
        "The contact form has labels, pending feedback, validation feedback, success, and recoverable failure",
        "Protected configuration does not enter client code or public environment variables",
        "A production build and critical keyboard flow are verified before handoff"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write the routes and user flows before choosing folders or packages."
        },
        {
          "stage": 2,
          "text": "Keep project content simple unless editing requirements prove that a content system is needed."
        },
        {
          "stage": 3,
          "text": "Test the production build and submit the form through both success and failure paths."
        }
      ],
      "expectedReasoning": "The portfolio needs clear route and server boundaries, not maximum infrastructure. Requirements determine where content lives and whether any dependency is useful. The server validates the contact request and owns secrets, while the UI communicates each state. The decision record keeps one important trade-off visible.",
      "commonWrongPaths": [
        "Adding a content, state, or styling dependency before naming the requirement it solves",
        "Trusting only browser validation for the contact form",
        "Calling the project complete after development mode renders the happy path"
      ],
      "answerExplanation": "Build the smallest architecture that supports the named flows, keep trust checks on the server, verify observable quality, and document a decision that may need to change later.",
      "followUpVariation": "Editors now need previews and scheduled publishing. Which content decision should be reopened, and what evidence will compare the new options?",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/project-structure",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/project-structure",
        "https://nextjs.org/docs/15/app/guides/forms",
        "https://nextjs.org/docs/15/app/getting-started/deploying",
        "https://www.w3.org/WAI/tutorials/forms/",
        "https://nextjs.org/docs/app/building-your-application/deploying"
      ]
    }
  ],
  "qa": [
    {
      "id": "qa-12",
      "question": "How do I organize a large Next.js project?",
      "answer": "Use a structure that makes ownership and navigation clear for the current project. Keep related route UI, tests, and helpers close while the feature is small; extract a feature or shared module when several routes truly share it or when ownership becomes hard to trace. In the App Router, a folder is not publicly routable by itself: route files such as `page` or `route` expose the segment. Record local conventions so teammates know where new work belongs.",
      "followUp": "Which files change together for one feature, and which imports show that a boundary may need to move?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "architecture",
        "organization",
        "scaling"
      ],
      "topicId": "architecture-decisions",
      "topicFamily": "architecture",
      "sourceLink": "https://nextjs.org/docs/15/app/getting-started/project-structure",
      "sourceLinks": [
        "https://nextjs.org/docs/15/app/getting-started/project-structure",
        "https://nextjs.org/docs/app/getting-started/project-structure"
      ]
    },
    {
      "id": "loop-qa-architecture-decisions-1",
      "topicId": "architecture-decisions",
      "topicFamily": "architecture",
      "question": "How do you choose a state boundary without starting from a favorite library?",
      "answer": "List the value’s readers, writers, lifetime, persistence, and sharing needs. Keep it local when one component owns it, lift it to the closest common parent when siblings coordinate, use the URL when navigation and sharing must reproduce it, and use a wider store only for a demonstrated wider subscription or ownership need.",
      "followUp": "What new requirement would make your current state owner too narrow?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "architecture-decisions"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components",
      "sourceLinks": [
        "https://react.dev/learn/sharing-state-between-components",
        "https://react.dev/learn/choosing-the-state-structure"
      ]
    },
    {
      "id": "loop-qa-architecture-decisions-2",
      "topicId": "architecture-decisions",
      "topicFamily": "architecture",
      "question": "What belongs in a useful architecture decision record?",
      "answer": "State the context and requirement, the options considered, the decision, positive and negative consequences, supporting evidence, and a concrete trigger or date for review. Keep it short enough to maintain. The record explains why the boundary exists; it does not claim the choice can never change.",
      "followUp": "Which observable signal would make you reopen your most recent architecture decision?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "architecture-decisions"
      ],
      "sourceLink": "https://adr.github.io/",
      "sourceLinks": [
        "https://adr.github.io/"
      ]
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "architecture",
    "level": "advanced",
    "title": "Architecture & Decision-Making"
  }
};
