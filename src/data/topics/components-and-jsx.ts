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
      "Describe a component as a pure render calculation with an explicit public API",
      "Use JSX rules, expressions, fragments, and stable list keys correctly",
      "Treat props as immutable inputs and send requested changes through callbacks",
      "Choose component boundaries and composition slots from responsibilities, not markup size alone"
    ],
    "whyMatters": "Components turn a UI into named responsibilities. JSX describes the result of a render; props carry read-only inputs; composition lets a parent control structure without hiding ownership. Clear boundaries make behavior, testing, accessibility, and later state placement easier to reason about.",
    "estimatedMinutes": 30,
    "sections": [
      {
        "id": "what-is-component",
        "type": "concept",
        "title": "A component is a render calculation",
        "content": "A React component is a capitalized JavaScript function that React calls while rendering. Given the same props, state, and context, its render calculation should return the same JSX and should not mutate values that existed before the call. Event handlers may cause changes later; render itself describes the UI for the current inputs.\n\nComponents are also API boundaries. A useful component owns one coherent responsibility and exposes the data and events needed to use it. React preserves or resets component state from the component’s type, position, and key in the rendered tree—not from the spelling of a local variable."
      },
      {
        "id": "jsx-compilation",
        "type": "code-example",
        "title": "JSX is syntax for element descriptions",
        "content": "JSX lets JavaScript code describe an element tree. Tooling transforms JSX into calls understood by the React runtime. Use braces for JavaScript expressions, close tags, use `className`, and return one enclosing value—often a fragment. Lists need keys that are stable among siblings so React can match item identity across renders.",
        "code": "type Item = { id: string; name: string; available: boolean };\n\nfunction ItemList({ items }: { items: readonly Item[] }) {\n  if (items.length === 0) return <p>No items available.</p>;\n\n  return (\n    <>\n      <h2>Inventory</h2>\n      <ul>\n        {items.map(item => (\n          <li key={item.id}>\n            {item.name} {item.available ? '✓' : 'Unavailable'}\n          </li>\n        ))}\n      </ul>\n    </>\n  );\n}",
        "codeLanguage": "typescript",
        "codeFilePath": "examples/components/jsx-compilation.jsx"
      },
      {
        "id": "props-immutable",
        "type": "concept",
        "title": "Props are read-only inputs",
        "content": "Props are the inputs chosen by a parent for one render. A child must not mutate a prop object or array: mutation changes data owned elsewhere and makes render behavior depend on hidden history. If the child needs a change, it calls an event prop so the owner can produce the next value.\n\nRead-only does not mean deeply frozen at runtime. It is a programming contract. TypeScript `readonly` annotations, immutable update expressions, and focused callback props make the contract visible, but ownership is the reason behind it."
      },
      {
        "id": "composition",
        "type": "code-example",
        "title": "Compose structure without hiding ownership",
        "content": "Use `children` for an open content slot and named element props for multiple semantic slots. The composing parent keeps ownership of the elements it supplies; the wrapper owns only layout and presentation promised by its API.",
        "code": "type CardProps = {\n  id: string;\n  title: string;\n  children: React.ReactNode;\n  actions?: React.ReactNode;\n};\n\nfunction Card({ id, title, children, actions }: CardProps) {\n  const titleId = `${id}-title`;\n  return (\n    <section aria-labelledby={titleId}>\n      <h2 id={titleId}>{title}</h2>\n      <div>{children}</div>\n      {actions && <footer>{actions}</footer>}\n    </section>\n  );\n}\n\n<Card id=\"profile\" title=\"Profile\" actions={<button>Edit</button>}>\n  <p>Account details</p>\n</Card>",
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
            "question": "A `ProductCard` receives a `product` object as a prop and needs to request a price change. Which approach preserves ownership?",
            "options": [
              "Assign to `product.price` during render",
              "Call an `onPriceChange` prop so the owner can create the next product value",
              "Copy the prop into state in every render and mutate the copy",
              "Props are writable inside event handlers, so mutate it there"
            ],
            "correctAnswer": "Call an `onPriceChange` prop so the owner can create the next product value",
            "expectedReasoning": "The parent owns the product value it passed. The child can report an event through a callback; the owner then decides whether and how to create the next value. Mutating the prop hides the update from React’s data flow, and duplicating every prop into state creates two sources of truth.",
            "commonMisconceptions": [
              "Treating event-handler timing as permission to mutate props",
              "Copying props to state by default instead of preserving one owner"
            ]
          }
        ]
      },
      {
        "id": "component-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "A component should be a pure render calculation with a small, intentional API. JSX expresses the tree; props and context provide inputs; callbacks report events; composition provides slots without transferring hidden ownership. Use stable keys for repeated identities, and keep state placement separate from presentational markup."
      }
    ],
    "retrievalPrompt": "Explain what React expects from a component during render, why props are read-only, and when a stable list key affects identity.",
    "reflectionPrompt": "Choose one component in your codebase. Does its prop API express a coherent responsibility, or merely expose its internal markup?",
    "masteryCriteria": [
      "Can write a capitalized, pure component that returns valid JSX",
      "Can use expressions, fragments, conditional rendering, and stable keys deliberately",
      "Can update owned data without mutating a prop",
      "Can design a composition boundary with `children` or named element props"
    ],
    "nextTopics": [
      "state-and-events"
    ],
    "metadata": {
      "reactVersion": "19.2",
      "lastUpdated": "2026-07-20",
      "sources": [
        "https://react.dev/learn/your-first-component",
        "https://react.dev/learn/writing-markup-with-jsx",
        "https://react.dev/learn/passing-props-to-a-component",
        "https://react.dev/learn/keeping-components-pure",
        "https://react.dev/learn/rendering-lists",
        "https://react.dev/learn/preserving-and-resetting-state"
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
        "title": "Derive display values during render",
        "concept": "If JSX can calculate a value entirely from current props, a second state value and Effect create unnecessary synchronization.",
        "prediction": {
          "prompt": "Where should `fullName` be created when it is only `${firstName} ${lastName}`?",
          "options": [
            "During render",
            "In a second Effect-owned state value"
          ],
          "correctAnswer": "During render",
          "feedbackCorrect": "The rendered value stays consistent with its props without another owner.",
          "feedbackWrong": "Duplicating a derivable value creates a synchronization path and an avoidable extra render."
        },
        "synthesis": "One source of truth plus render-time derivation keeps component APIs predictable."
      }
    ],
    "miniProject": {
      "title": "Decompose a profile card",
      "scenario": "Design a reusable result card that supports empty content, a details slot, and optional actions.",
      "acceptance": [
        "The component API names data and events by responsibility",
        "Props remain read-only and repeated items use stable data keys",
        "Empty and optional states are represented in JSX without duplicate state"
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
      "title": "Design a Reusable Results Panel",
      "level": 2,
      "topicFamily": "react-mental-model",
      "scenario": "Build a `ResultsPanel` that renders a title, zero or more result rows, and an optional action area supplied by its parent.",
      "constraints": [
        "Keep render pure and treat every prop as read-only",
        "Use a stable result ID as each row key",
        "Use composition for the optional action area and a callback for row selection"
      ],
      "acceptanceCriteria": [
        "An empty array renders a clear empty state",
        "Rows render from props with stable keys and no prop mutation",
        "Selecting a row reports its ID to the owner",
        "The parent can provide or omit action JSX without the panel owning that action state"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Write the prop type first: title, readonly results, `onSelect(id)`, and an optional React-node slot."
        },
        {
          "stage": 2,
          "text": "Return early for the empty state, then map rows using each result’s stable ID."
        },
        {
          "stage": 3,
          "text": "Keep the action element owned by the parent; the panel only chooses where that slot is rendered."
        }
      ],
      "expectedReasoning": "The panel owns layout, not result data or the action’s behavior. Data flows in as read-only props, events flow out through a callback, and composition preserves the parent’s ownership of optional actions. Stable keys preserve row identity.",
      "commonWrongPaths": [
        "Copying the results prop into state without an independent editing requirement",
        "Using array indexes as keys even though stable result IDs are available"
      ],
      "answerExplanation": "Define a narrow prop API, render an explicit empty state, map the readonly results with `key={result.id}`, call `onSelect(result.id)` from the row event, and render the optional action node in a slot. No Effect or duplicate state is required.",
      "followUpVariation": "Add a named `summary` slot. When is a named slot clearer than one undifferentiated `children` value?",
      "sourceLink": "https://react.dev/learn/passing-props-to-a-component"
    }
  ],
  "qa": [
    {
      "id": "loop-qa-components-and-jsx-1",
      "topicId": "components-and-jsx",
      "topicFamily": "react-mental-model",
      "question": "What contract does React expect from a component during render?",
      "answer": "The component should calculate JSX from current props, state, and context without mutating pre-existing values or causing side effects. Given the same inputs, its render calculation should be predictable.",
      "followUp": "Which work belongs in an event handler rather than render?",
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
      "question": "Why are props read-only even when JavaScript does not freeze them?",
      "answer": "The parent owns the values it passes. Mutating them creates a hidden update outside React’s one-way data flow. A child reports intent through callbacks so the owner can create the next value.",
      "followUp": "Which prop in your component API represents an event instead of data?",
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
      "question": "What evidence shows that a component boundary is well designed?",
      "answer": "Its responsibility is coherent, its props describe data and events clearly, repeated children have stable keys, empty and optional states are explicit, and it does not duplicate values that can be derived during render.",
      "followUp": "Which failure state can a test observe without reading component internals?",
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
