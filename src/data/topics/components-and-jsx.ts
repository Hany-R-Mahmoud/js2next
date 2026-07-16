import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "components-and-jsx",
  "lesson": {
    "slug": "components-and-jsx",
    "title": "Components & JSX",
    "topicFamily": "react-mental-model",
    "level": "beginner",
    "prerequisites": [],
    "learningObjectives": [
      "Explain what a React component fundamentally is",
      "Write JSX and understand how it compiles to createElement calls",
      "Distinguish between component declarations and component instances",
      "Apply composition patterns to build UIs from smaller pieces"
    ],
    "whyMatters": "Components are the fundamental unit of React. Every UI you build is a tree of components. Misunderstanding what a component actually is — a function that returns UI — leads to confusion about re-renders, hooks, and why components \"reset\" when their position in the tree changes.",
    "estimatedMinutes": 20,
    "sections": [
      {
        "id": "what-is-component",
        "type": "concept",
        "title": "What is a component?",
        "content": "A React component is a JavaScript function that returns a description of UI (JSX). React calls this function, reads the returned description, and updates the DOM to match.\n\nCrucially: a component is the function definition, not the returned UI. The same component function can be called multiple times with different props, producing different UI trees. Each call is a \"render\"."
      },
      {
        "id": "jsx-compilation",
        "type": "code-example",
        "title": "JSX: sugar over function calls",
        "content": "JSX is syntactic sugar for `React.createElement()` calls. This is why you need React in scope (even if you do not use it directly) — or why modern JSX transforms auto-import it.",
        "code": "// JSX:\n<button className=\"primary\" onClick={handleClick}>\n  Click me\n</button>\n\n// Equivalent createElement call:\nReact.createElement(\n  'button',\n  { className: 'primary', onClick: handleClick },\n  'Click me'\n);",
        "codeLanguage": "javascript",
        "codeFilePath": "examples/components/jsx-compilation.jsx"
      },
      {
        "id": "props-immutable",
        "type": "concept",
        "title": "Props are read-only",
        "content": "A component must never modify its own props. Props flow down from parent to child — one-way data flow. If a child needs to communicate back to a parent, it does so through callback props (functions passed as props). This constraint is what makes React predictable: data flows down, events flow up."
      },
      {
        "id": "composition",
        "type": "code-example",
        "title": "Composition over inheritance",
        "content": "React doesn't use class inheritance for UI. Instead, you compose components: one component renders another, passing props to customize behavior.",
        "code": "function Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <div className=\"layout\">\n      <Sidebar />\n      <main>{children}</main>\n    </div>\n  );\n}\n\nfunction ProfilePage() {\n  return (\n    <Layout>\n      <ProfileHeader name=\"Ada\" />\n      <ActivityFeed />\n    </Layout>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/components/composition.tsx"
      },
      {
        "id": "component-question",
        "type": "question",
        "title": "Check your understanding",
        "content": "",
        "questions": [
          {
            "id": "q3",
            "question": "What happens when a parent component re-renders?",
            "options": [
              "Only the parent re-renders; children stay the same",
              "All child components re-render regardless of props",
              "Children are evaluated again by default, unless an optimization can skip work",
              "React skips re-renders for any child whose JSX reference hasn't changed"
            ],
            "correctAnswer": "Children are evaluated again by default, unless an optimization can skip work",
            "expectedReasoning": "A parent render normally causes React to evaluate child elements again. React.memo and related optimizations may skip a child when its relevant inputs are unchanged, but context and local state still matter. The useful default is to measure before optimizing.",
            "commonMisconceptions": [
              "Believing React automatically compares prop values to skip renders",
              "Thinking that a child with unchanged props won't re-render"
            ]
          }
        ]
      },
      {
        "id": "component-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Components are functions that return UI descriptions. JSX creates element descriptions; `<Component />` is conceptually an element creation with the component function as its type, not a direct function call in your code. Props are inputs, and children is a special prop. Understanding this makes the render and reconciliation model easier to inspect."
      }
    ],
    "retrievalPrompt": "In one sentence: what is a React component? Then explain why props must be immutable.",
    "reflectionPrompt": "Look at a React component you have written. How would you split it into smaller pieces using composition? What would be the benefit?",
    "masteryCriteria": [
      "Can define a component as a function returning UI description",
      "Can write JSX with proper syntax and understand its compilation",
      "Understands one-way data flow through props",
      "Can compose components using children and custom props"
    ],
    "nextTopics": [
      "state-and-events"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "lastUpdated": "2026-07-01",
      "sources": [
        "https://react.dev/learn/your-first-component",
        "https://react.dev/reference/react/createElement"
      ]
    },
    "diagram": {
      "title": "Inputs become a UI tree",
      "kind": "tree",
      "nodes": [
        {
          "id": "inputs",
          "label": "Props and state",
          "role": "Component inputs"
        },
        {
          "id": "component",
          "label": "Component render",
          "role": "Pure UI calculation"
        },
        {
          "id": "tree",
          "label": "Element tree",
          "role": "Description committed by React"
        }
      ],
      "edges": [
        {
          "from": "inputs",
          "to": "component"
        },
        {
          "from": "component",
          "to": "tree"
        }
      ]
    },
    "chunks": [
      {
        "id": "components-and-jsx-retrieval-1",
        "title": "Keep the render model small",
        "concept": "A component describes UI from inputs; it does not directly become a mutable DOM node.",
        "prediction": {
          "prompt": "Where should a value derived from props normally be computed?",
          "options": [
            "During render",
            "In a second Effect-owned state value"
          ],
          "correctAnswer": "During render",
          "feedbackCorrect": "Pure derivation belongs in the render calculation.",
          "feedbackWrong": "A second state value can drift from its source."
        },
        "synthesis": "Separate UI description, state ownership, and host DOM effects."
      }
    ],
    "miniProject": {
      "title": "Decompose a profile card",
      "scenario": "Break a profile card into components with explicit props and one interactive leaf.",
      "acceptance": [
        "Each component has a clear input/output contract",
        "Derived display data is not duplicated in state",
        "The interactive leaf exposes an accessible action"
      ],
      "rubric": [
        {
          "dimension": "Composition",
          "evidence": "The component tree follows responsibility rather than arbitrary file size."
        },
        {
          "dimension": "Data flow",
          "evidence": "Props and callbacks have one readable owner."
        },
        {
          "dimension": "UI contract",
          "evidence": "The rendered result is testable through user-facing semantics."
        }
      ]
    }
  },
  "challenges": [
    {
      "slug": "loop-components-and-jsx",
      "title": "Apply Components & JSX",
      "level": 2,
      "topicFamily": "react-mental-model",
      "scenario": "Use the model from Components & JSX in a small project decision, then explain the boundary you chose.",
      "constraints": [
        "State the owner or boundary explicitly",
        "Include one failure or recovery case",
        "Keep the explanation tied to observable behavior"
      ],
      "acceptanceCriteria": [
        "Can define a component as a function returning UI description",
        "Can write JSX with proper syntax and understand its compilation",
        "Understands one-way data flow through props"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Start with the first learning objective: Explain what a React component fundamentally is."
        },
        {
          "stage": 2,
          "text": "Separate the model, the boundary that owns it, and the evidence a user or test can observe."
        },
        {
          "stage": 3,
          "text": "Use this retrieval prompt: In one sentence: what is a React component? Then explain why props must be immutable."
        }
      ],
      "expectedReasoning": "Can define a component as a function returning UI description · Can write JSX with proper syntax and understand its compilation · Understands one-way data flow through props · Can compose components using children and custom props",
      "commonWrongPaths": [
        "Adding a second owner without a requirement",
        "Describing success without a failure or recovery state"
      ],
      "answerExplanation": "A good response names the model, its owner, and an observable way to verify it. Components are the fundamental unit of React. Every UI you build is a tree of components. Misunderstanding what a component actually is — a function that returns UI — leads to confusion about re-renders, hooks, and why components \"reset\" when their position in the tree changes.",
      "followUpVariation": "Apply the same boundary to a different feature in the project.",
      "sourceLink": "https://react.dev/learn/your-first-component"
    }
  ],
  "qa": [
    {
      "id": "loop-qa-components-and-jsx-1",
      "topicId": "components-and-jsx",
      "topicFamily": "react-mental-model",
      "question": "What problem does Components & JSX help you solve?",
      "answer": "Components are the fundamental unit of React. Every UI you build is a tree of components. Misunderstanding what a component actually is — a function that returns UI — leads to confusion about re-renders, hooks, and why components \"reset\" when their position in the tree changes.",
      "followUp": "Name one decision in your current project where this model would change the implementation.",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "components-and-jsx"
      ],
      "sourceLink": "https://react.dev/learn/your-first-component"
    },
    {
      "id": "loop-qa-components-and-jsx-2",
      "topicId": "components-and-jsx",
      "topicFamily": "react-mental-model",
      "question": "How would you explain the core idea of Components & JSX to a teammate?",
      "answer": "In one sentence: what is a React component? Then explain why props must be immutable. A strong explanation should connect the model to: Explain what a React component fundamentally is; Write JSX and understand how it compiles to createElement calls.",
      "followUp": "Which observable behavior would prove your explanation is correct?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "components-and-jsx"
      ],
      "sourceLink": "https://react.dev/learn/your-first-component"
    },
    {
      "id": "loop-qa-components-and-jsx-3",
      "topicId": "components-and-jsx",
      "topicFamily": "react-mental-model",
      "question": "What evidence shows that you can apply Components & JSX?",
      "answer": "Can define a component as a function returning UI description · Can write JSX with proper syntax and understand its compilation · Understands one-way data flow through props",
      "followUp": "What failure case would you test before calling this skill reliable?",
      "category": "react",
      "level": "beginner",
      "tags": [
        "topic-loop",
        "components-and-jsx"
      ],
      "sourceLink": "https://react.dev/learn/your-first-component"
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "react-mental-model",
    "level": "beginner",
    "title": "Components & JSX"
  }
};
