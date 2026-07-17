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
      "Evaluate feature organization strategies (colocation vs. separation)",
      "Determine state ownership and server/client responsibility boundaries",
      "Make informed dependency choices with trade-off analysis",
      "Plan migration strategies for evolving architectures",
      "Communicate architectural decisions with rationale"
    ],
    "whyMatters": "Architecture is not about picking the \"best\" pattern — it is about making intentional trade-offs you can explain and revisit. Every decision (file structure, state placement, data fetching strategy, dependency choice) has a cost now and a cost later. Understanding the trade-offs lets you make reversible decisions quickly and irreversible decisions carefully.",
    "estimatedMinutes": 25,
    "sections": [
      {
        "id": "feature-organization",
        "type": "concept",
        "title": "Feature organization",
        "content": "Two dominant approaches: (1) file-type grouping (components/, hooks/, utils/) and (2) feature colocation (features/auth/, features/dashboard/). File-type grouping works for small projects but scales poorly — related code drifts apart. Feature colocation keeps everything for a feature together but requires discipline to avoid feature coupling. Most production apps use a hybrid: feature folders for domain logic, shared folders for truly cross-cutting utilities."
      },
      {
        "id": "state-ownership",
        "type": "concept",
        "title": "State ownership and boundaries",
        "content": "For each piece of state, ask: which component would break first if it were wrong? That component should own it. Server state (data from APIs) should live as close to the fetch as possible — prefer Server Components that pass data down. Client state (UI toggles, form inputs) should live in the nearest common ancestor of the components that use it. Global client state is the exception, not the default."
      },
      {
        "id": "network-boundary",
        "type": "concept",
        "title": "The network boundary",
        "content": "In Next.js, `'use client'` marks a module-graph boundary: imports reachable from that module become part of the Client Component graph. Client Components can still render on the server for the initial response, then hydrate in the browser. The boundary controls which APIs and props are allowed, not a simple line where all code below runs only in the browser."
      },
      {
        "id": "dependency-decisions",
        "type": "concept",
        "title": "Dependency choices",
        "content": "Every dependency is a bet. Frontend: React + Next.js are the foundation. State management: start with React's built-in tools (useState, useReducer, Context), then add a library such as Zustand or TanStack Query when a concrete server-state, persistence, synchronization, or sharing problem justifies it. Forms: React Hook Form for complex forms, native form elements for simple ones. Testing: Vitest + React Testing Library for unit/integration, Playwright for E2E. The question is never 'what should I use?' but 'what problem does this dependency solve that I actually have?'"
      },
      {
        "id": "architecture-question",
        "type": "question",
        "title": "Check your understanding",
        "content": "",
        "questions": [
          {
            "id": "q10",
            "question": "A junior developer puts all state in a global Zustand store \"just in case.\" What is the strongest argument against this?",
            "options": [
              "Zustand is slower than React Context",
              "Global state makes components harder to test and reuse",
              "Global state cannot be used in Server Components",
              "It violates the single responsibility principle"
            ],
            "correctAnswer": "Global state makes components harder to test and reuse",
            "expectedReasoning": "Components that depend on global state are coupled to the store's shape and existence. You cannot test them in isolation without setting up the store. You cannot reuse them in a different context because they assume the store is present. The strongest argument against unnecessary global state is not performance — it's the erosion of component independence and testability.",
            "commonMisconceptions": [
              "Prematurely reaching for global state management",
              "Not considering the testing and reusability cost"
            ]
          }
        ]
      },
      {
        "id": "architecture-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Architecture is a continuous practice, not a one-time decision. Start simple, let patterns emerge, then formalize them. Document decisions with rationale (ADR format): what was the context, what did we choose, why, and what were the alternatives. This creates institutional knowledge and makes future architectural changes informed, not reactive."
      }
    ],
    "retrievalPrompt": "What is the most important boundary in a Next.js application? What crosses it, and what stays on each side?",
    "reflectionPrompt": "Look at your current project structure. If you had to onboard a new developer tomorrow, what three things would confuse them most about the architecture?",
    "masteryCriteria": [
      "Can evaluate feature organization strategies with trade-offs",
      "Can determine appropriate state ownership for different kinds of state",
      "Understands the network boundary and what data crosses it",
      "Makes dependency decisions based on actual problems, not trends",
      "Can communicate architectural decisions with rationale"
    ],
    "nextTopics": [],
    "metadata": {
      "lastUpdated": "2026-07-01",
      "sources": [
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
        "concept": "A new library is justified by a distinct requirement and an explicit owner, not by application size or popularity alone.",
        "prediction": {
          "prompt": "What should be named before adding a global store?",
          "options": [
            "The shared client state it uniquely owns",
            "The library’s popularity ranking"
          ],
          "correctAnswer": "The shared client state it uniquely owns",
          "feedbackCorrect": "Ownership and evidence keep the decision reversible.",
          "feedbackWrong": "Popularity does not define a product boundary."
        },
        "synthesis": "Record context, owner, alternatives, trade-off, and the evidence that would trigger change."
      }
    ],
    "miniProject": {
      "title": "Write an architecture decision record",
      "scenario": "Choose ownership for local UI state, URL filters, server data, and shared client state in one feature.",
      "acceptance": [
        "Every value has one primary owner",
        "At least one rejected alternative is explained",
        "A migration trigger and verification method are recorded"
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
      "scenario": "A dashboard has: user profile (from API), theme toggle, search query, filter state, cart items (persisted), and a multi-step form wizard. Choose the right state management strategy for each.",
      "constraints": [
        "Justify each choice with a specific reason",
        "Consider: local state, lifted state, context, URL search params, server state, and persisted state",
        "Explain at least one trade-off for each choice"
      ],
      "acceptanceCriteria": [
        "Each piece of state has an appropriate home with justification",
        "At least three different strategies are used",
        "Trade-offs are clearly stated"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Think about: who needs this data? How long does it live? Does it survive refreshes?"
        },
        {
          "stage": 2,
          "text": "URL search params are perfect for shareable, bookmarkable filter state."
        },
        {
          "stage": 3,
          "text": "Server state (API data) should not be stored in global client state unless you have a specific reason."
        }
      ],
      "expectedReasoning": "User profile = server state (fetch in Server Component or React Query). Theme = context + localStorage. Search query = local state (only the search bar needs it). Filters = URL search params (shareable). Cart = Zustand + localStorage (persisted, needed globally). Form wizard = local state or useReducer (isolated to the form).",
      "commonWrongPaths": [
        "Putting everything in a global store",
        "Using URL params for ephemeral UI state that should not be shareable",
        "Duplicating server state in client stores"
      ],
      "answerExplanation": "The key principle: put state as close to where it is used as possible. Only lift when multiple consumers need it. Only persist when it must survive refresh. Only put in URL when it is shareable/filterable. Only make global when it is truly app-wide.",
      "followUpVariation": "How would the architecture change if the dashboard needed real-time collaboration?",
      "sourceLinks": [
        "https://tanstack.com/query/latest/docs/framework/react/overview",
        "https://github.com/pmndrs/zustand"
      ],
      "sourceLink": "https://react.dev/learn/sharing-state-between-components"
    },
    {
      "slug": "capstone-build-portfolio",
      "title": "Capstone: Build a Developer Portfolio",
      "level": 10,
      "topicFamily": "architecture",
      "scenario": "Build a complete developer portfolio site with: a home page, project showcase, blog with Markdown content, contact form with validation, dark/light theme, and SEO optimization. Deploy and explain your architecture.",
      "constraints": [
        "Use Next.js App Router with TypeScript",
        "Blog posts stored as Markdown files",
        "Contact form uses Server Actions",
        "Dark/light theme persists and respects system preference",
        "Set page-specific Lighthouse targets and record a production-like baseline rather than assuming one universal score",
        "Include tests for the contact form validation logic"
      ],
      "acceptanceCriteria": [
        "All pages render with real content",
        "Blog posts load from Markdown files (at least 2 seeded posts)",
        "Contact form validates inputs and shows success/error states",
        "Theme toggle works and persists",
        "Measured Lighthouse evidence meets the agreed page-specific targets, with any trade-offs documented",
        "At least 3 unit tests for form validation",
        "README explains architecture decisions"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start with the route structure: /, /projects, /blog, /blog/[slug], /contact."
        },
        {
          "stage": 2,
          "text": "Use gray-matter to parse Markdown frontmatter for blog posts."
        },
        {
          "stage": 3,
          "text": "Theme: use a context provider, localStorage, and the `prefers-color-scheme` media query."
        }
      ],
      "expectedReasoning": "This is a capstone — combine all skills. Server Components for static content, Client Components for interactive parts (theme toggle, contact form). Markdown processing at build time or on-demand. Server Action for form submission. next-themes or custom context for theming.",
      "commonWrongPaths": [
        "Making everything a Client Component",
        "Not handling the form's pending state during Server Action submission",
        "Forgetting to add metadata to all pages"
      ],
      "answerExplanation": "Architecture: App Router with Server Components by default. Blog: read Markdown from filesystem using fs + gray-matter, render to HTML. Contact: Client form component calls a Server Action. Theme: ThemeProvider (Client) wrapping children, using localStorage + system preference. Tests: Vitest for form validation logic. Deploy to Vercel.",
      "followUpVariation": "Add an admin dashboard to CRUD blog posts. How does the architecture evolve?",
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/deploying"
    }
  ],
  "qa": [
    {
      "id": "qa-12",
      "question": "How do I organize a large Next.js project?",
      "answer": "Start with feature colocation: `features/` contains domain-specific code, `shared/` contains cross-cutting utilities. Inside each feature, group by purpose: components, hooks, actions, types. At the app level, use route groups `(marketing)`, `(dashboard)` for different layouts. Keep the src/ structure flat for small projects, nested for large ones. Treat this as a maintainable project-organization option rather than a universal Next.js rule: a developer working on a feature should find related code in one place, not scattered across the project.",
      "followUp": "At what project size does feature colocation become more valuable than file-type grouping?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "architecture",
        "organization",
        "scaling"
      ],
      "topicId": "architecture-decisions",
      "topicFamily": "architecture",
      "sourceLink": "https://nextjs.org/docs/app/getting-started/project-structure"
    },
    {
      "id": "loop-qa-architecture-decisions-1",
      "topicId": "architecture-decisions",
      "topicFamily": "architecture",
      "question": "What problem does Architecture & Decision-Making help you solve?",
      "answer": "Architecture is not about picking the \"best\" pattern — it is about making intentional trade-offs you can explain and revisit. Every decision (file structure, state placement, data fetching strategy, dependency choice) has a cost now and a cost later. Understanding the trade-offs lets you make reversible decisions quickly and irreversible decisions carefully.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "architecture-decisions"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/rendering"
    },
    {
      "id": "loop-qa-architecture-decisions-2",
      "topicId": "architecture-decisions",
      "topicFamily": "architecture",
      "question": "How would you explain the core idea of Architecture & Decision-Making to a teammate?",
      "answer": "What is the most important boundary in a Next.js application? What crosses it, and what stays on each side? A strong explanation should connect the model to: Evaluate feature organization strategies (colocation vs. separation); Determine state ownership and server/client responsibility boundaries.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "architecture",
      "level": "advanced",
      "tags": [
        "topic-loop",
        "architecture-decisions"
      ],
      "sourceLink": "https://nextjs.org/docs/app/building-your-application/rendering"
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "architecture",
    "level": "advanced",
    "title": "Architecture & Decision-Making"
  }
};
