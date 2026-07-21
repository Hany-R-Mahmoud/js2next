import type { TopicModule } from './types';

export const topic: TopicModule = {
  "id": "deep-dive-rsc-boundaries",
  "lesson": {
    "slug": "deep-dive-rsc-boundaries",
    "title": "Deep Dive: Server and Client Component Boundaries",
    "topicFamily": "rsc-client",
    "level": "intermediate",
    "prerequisites": [
      "deep-dive-nextjs-foundations"
    ],
    "learningObjectives": [
      "Choose Server or Client Components from required capabilities",
      "Explain `use client` as a client module-graph entry point",
      "Pass React-serializable values and server-rendered slots across the boundary",
      "Keep data access and authorization server-owned while isolating browser interaction"
    ],
    "whyMatters": "Server and Client Components let one route use two environments. The boundary decides where privileged data access runs, what values cross to the browser, and how much client JavaScript an interaction needs.",
    "estimatedMinutes": 40,
    "sections": [
      {
        "id": "deep-dive-rsc-boundaries-model",
        "type": "concept",
        "title": "Plain explanation",
        "content": "In the App Router, pages and layouts are Server Components by default. They can await server data and use server-only modules without sending that component code to the browser. They cannot use client state, event handlers, Effects, or browser APIs.\n\nA file beginning with `use client` creates an entry point into the client module graph. That component can use browser capabilities, and the modules it imports become part of that graph. Start on the server, then add a focused client boundary where an actual interaction requires it."
      },
      {
        "id": "deep-dive-rsc-boundaries-technical",
        "type": "concept",
        "title": "Technical model",
        "content": "A Server Component may render a Client Component and pass values supported by React serialization. Primitives, supported collections, and Promises may cross; arbitrary class instances and ordinary function closures do not. A function deliberately marked `use server` is a Server Function and may be referenced from client code, but it still receives untrusted arguments and must validate and authorize every protected operation.\n\nA Client Component cannot import server-only implementation code. For composition, let a Server Component create server-rendered content and pass it as `children` or another React-node prop to a Client Component. This preserves server ownership without asking the client graph to execute the server component."
      },
      {
        "id": "deep-dive-rsc-boundaries-causal",
        "type": "concept",
        "title": "Why it behaves this way",
        "content": "The boundary is a capability and transfer contract. Marking a whole page `use client` for one button can pull unrelated imports into the client graph and prevents that page from directly using server-only resources. A small interactive leaf receives only the data it needs, while the server keeps secrets, database clients, and policy checks. The useful goal is a clear boundary—not the smallest file at any cost."
      },
      {
        "id": "deep-dive-rsc-boundaries-example",
        "type": "code-example",
        "title": "Small client island",
        "content": "The server page reads private data and passes a small serializable view to the interactive button. The button owns local pending UI; the protected write remains a server operation.",
        "code": "// app/posts/page.tsx — Server Component\nexport default async function PostsPage() {\n  const posts = await getPosts();\n  return posts.map(post => (\n    <article key={post.id}>\n      <h2>{post.title}</h2>\n      <LikeButton postId={post.id} initialLikes={post.likes} />\n    </article>\n  ));\n}\n\n// LikeButton.tsx — Client Component\n'use client';\n\nexport function LikeButton(props: { postId: string; initialLikes: number }) {\n  const [likes, setLikes] = useState(props.initialLikes);\n  return <button onClick={() => setLikes(value => value + 1)}>Like {likes}</button>;\n}",
        "codeLanguage": "tsx",
        "codeFilePath": "app/posts/page.tsx + app/posts/LikeButton.tsx"
      },
      {
        "id": "deep-dive-rsc-boundaries-check",
        "type": "question",
        "title": "Prediction check",
        "content": "",
        "questions": [
          {
            "id": "deep-dive-rsc-boundaries-question",
            "question": "A Server Component must give a Client Component enough information to select a post. Which ordinary prop is the clearest boundary value?",
            "options": [
              "The post ID string",
              "The database connection object",
              "An ORM model class instance with methods",
              "An unmarked server closure that captures a secret"
            ],
            "correctAnswer": "The post ID string",
            "expectedReasoning": "A string is a simple serializable identifier. A database connection and class instance belong to server implementation. An ordinary function closure cannot cross this boundary and must not carry secrets; a protected mutation needs a deliberate Server Function or server endpoint with validation and authorization."
          }
        ]
      },
      {
        "id": "deep-dive-rsc-boundaries-synthesis",
        "type": "synthesis",
        "title": "Synthesis",
        "content": "Choose the environment from capability: server resources and policy stay on the server; state, events, Effects, and browser APIs live in the client graph. Pass a small React-serializable contract or a server-rendered slot, and keep every protected read or write authorized at its server boundary."
      }
    ],
    "chunks": [
      {
        "id": "deep-dive-rsc-boundaries-prediction",
        "title": "Predict the boundary",
        "concept": "`use client` marks a client module-graph entry, not simply a component whose HTML appears in the browser.",
        "prediction": {
          "prompt": "A page needs one dropdown with local state. Which boundary is clearest?",
          "options": [
            "Keep the page server-owned and make the dropdown a Client Component",
            "Mark the entire page client-owned automatically"
          ],
          "correctAnswer": "Keep the page server-owned and make the dropdown a Client Component",
          "feedbackCorrect": "Only the subtree requiring browser state enters the client graph.",
          "feedbackWrong": "A page-wide boundary may move unrelated imports and data work into the client graph without a requirement."
        },
        "synthesis": "Add the client entry where browser capability begins."
      },
      {
        "id": "deep-dive-rsc-boundaries-failure-mode",
        "title": "Name the failure mode",
        "concept": "Values cross the boundary; server-only capabilities do not.",
        "prediction": {
          "prompt": "A client button needs to request a protected write. What is the safe design?",
          "options": [
            "Call a deliberate server boundary that validates and authorizes",
            "Pass the database client to the button",
            "Trust a hidden button as authorization"
          ],
          "correctAnswer": "Call a deliberate server boundary that validates and authorizes",
          "feedbackCorrect": "The browser starts the request, but the server remains the authority for its inputs and permission.",
          "feedbackWrong": "Server resources do not belong in the client graph, and hidden UI cannot grant or deny permission."
        },
        "synthesis": "Treat every client-started server operation as an untrusted request."
      }
    ],
    "miniProject": {
      "title": "Practice lab: Server and Client Component Boundaries",
      "scenario": "Split a server-fetched post list from client-owned like controls and a protected server mutation.",
      "acceptance": [
        "The page and database read remain Server Components or server-only modules",
        "Each client control receives only serializable display and identity values",
        "Pending and failure feedback belong to the interactive control",
        "The protected write validates input and authorizes the current user on the server"
      ],
      "rubric": [
        {
          "dimension": "Model",
          "evidence": "The implementation demonstrates: Choose the correct component boundary."
        },
        {
          "dimension": "Boundary",
          "evidence": "The explanation identifies the ownership or lifecycle boundary for server and client component boundaries."
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
          "role": "Server and Client Component Boundaries"
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
    "retrievalPrompt": "For a database query, product details, a quantity selector, and a protected mutation, name the owner and the exact value that crosses each Server/Client boundary.",
    "reflectionPrompt": "Choose one Client Component. Which browser capability requires it, and could server-rendered content or data remain above a smaller entry point?",
    "masteryCriteria": [
      "Can choose a boundary from server-only and browser-only capabilities",
      "Can explain which imports enter the client graph",
      "Can identify ordinary values that cannot cross as props",
      "Keeps privileged reads and authorization in server-owned code"
    ],
    "nextTopics": [
      "deep-dive-nextjs-data"
    ],
    "metadata": {
      "reactVersion": "19.2.7",
      "nextVersion": "15.5.20",
      "lastUpdated": "2026-07-21",
      "sources": [
        "https://react.dev/reference/rsc/use-client",
        "https://nextjs.org/docs/app/getting-started/server-and-client-components",
        "https://nextjs.org/docs/15/app/getting-started/server-and-client-components",
        "https://react.dev/reference/rsc/use-server",
        "https://react.dev/reference/rsc/server-components",
        "https://nextjs.org/docs/15/app/guides/authentication"
      ]
    }
  },
  "challenges": [
    {
      "slug": "learn-react-ch-next-6",
      "title": "Deep Challenge: Integrate server list + client like",
      "level": 6,
      "topicFamily": "rsc-client",
      "scenario": "Build a post list that is fetched on the server. Each row needs an interactive Like button, and the final write must be authorized for the signed-in user.",
      "constraints": [
        "Keep the page and data access server-owned",
        "Place `use client` only at the interactive entry point",
        "Pass a serializable post ID and display data",
        "Treat the server mutation arguments as untrusted"
      ],
      "acceptanceCriteria": [
        "The async Server Component renders the initial list without a second client fetch",
        "The Like button owns only its browser interaction and pending feedback",
        "No database client, class instance, secret, or ordinary server closure crosses as a prop",
        "The mutation checks the session and post permission before writing"
      ],
      "hints": [
        {
          "stage": 1,
          "text": "Draw two boxes: server graph and client graph. Put each import in the box that can execute it."
        },
        {
          "stage": 2,
          "text": "Pass `postId` and a display count to the Client Component; keep the database model private."
        },
        {
          "stage": 3,
          "text": "A Server Function is still a public request boundary. Validate its post ID and authorize the current user."
        }
      ],
      "expectedReasoning": "The server owns privileged data access and decides the transferable view. The client owns click and pending behavior. The mutation is a separate server trust boundary, so it revalidates identity and permission even though trusted server-rendered UI created the button.",
      "commonWrongPaths": [
        "Marking the page `use client` and importing the database module",
        "Passing an ORM instance or ordinary closure as a prop",
        "Treating a visible Like button as proof that the caller is authorized"
      ],
      "answerExplanation": "Keep the read in the server graph, pass small serializable values to a focused client control, and authorize the write at the server operation. Each boundary then has one inspectable job.",
      "followUpVariation": "The post body is server-rendered inside a client carousel. How can a Server Component pass that content as a slot without importing it into the client graph?",
      "checkType": "multi-choice",
      "prompt": "Select all correct statements:",
      "options": [
        "The page can be an async Server Component that awaits getPosts()",
        "LikeButton should be a Client Component with \"use client\"",
        "Pass an onLike function directly from the Server Component without Server Actions",
        "Pass post id as a serializable prop into LikeButton"
      ],
      "correctIndices": [
        0,
        1,
        3
      ],
      "sourceLink": "https://react.dev/reference/rsc/use-client",
      "sourceLinks": [
        "https://react.dev/reference/rsc/use-client",
        "https://nextjs.org/docs/15/app/getting-started/server-and-client-components",
        "https://react.dev/reference/rsc/use-server",
        "https://nextjs.org/docs/15/app/guides/authentication"
      ]
    }
  ],
  "qa": [
    {
      "id": "learn-react-deep-dive-rsc-boundaries-question",
      "question": "Which value is a safe ordinary prop from Server to Client?",
      "answer": "Pass the post ID string. It is a clear serializable identifier. Keep database connections, arbitrary class instances, and ordinary server closures inside the server graph. Use a deliberate server operation for protected work.",
      "followUp": "What is the smallest data shape the client interaction truly needs?",
      "category": "nextjs",
      "level": "intermediate",
      "topicId": "deep-dive-rsc-boundaries",
      "topicFamily": "rsc-client",
      "tags": [
        "learn-react-bridge",
        "rsc-client"
      ],
      "sourceLink": "https://react.dev/reference/rsc/use-client",
      "sourceLinks": [
        "https://react.dev/reference/rsc/use-client",
        "https://react.dev/reference/rsc/use-client#serializable-types"
      ]
    },
    {
      "id": "loop-qa-deep-dive-rsc-boundaries-1",
      "topicId": "deep-dive-rsc-boundaries",
      "topicFamily": "rsc-client",
      "question": "How do you choose between a Server and Client Component?",
      "answer": "Use a Server Component for server-only data, private modules, and UI that needs no browser interaction. Add a Client Component for state, event handlers, Effects, or browser APIs. Then pass the smallest supported value or server-rendered slot between them.",
      "followUp": "Which exact capability in your component requires the browser?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-rsc-boundaries"
      ],
      "sourceLink": "https://react.dev/reference/rsc/use-client",
      "sourceLinks": [
        "https://react.dev/reference/rsc/use-client",
        "https://nextjs.org/docs/15/app/getting-started/server-and-client-components"
      ]
    },
    {
      "id": "loop-qa-deep-dive-rsc-boundaries-2",
      "topicId": "deep-dive-rsc-boundaries",
      "topicFamily": "rsc-client",
      "question": "Why is `use client` a module-graph decision?",
      "answer": "The directive marks a client entry point, so the modules imported from that entry become available to the browser. Its placement therefore affects both capabilities and shipped client code, not only the component where the text appears.",
      "followUp": "Which imports would leave the client graph if you moved the boundary down one level?",
      "category": "react",
      "level": "intermediate",
      "tags": [
        "topic-loop",
        "deep-dive-rsc-boundaries"
      ],
      "sourceLink": "https://react.dev/reference/rsc/use-client",
      "sourceLinks": [
        "https://react.dev/reference/rsc/use-client",
        "https://nextjs.org/docs/15/app/getting-started/server-and-client-components#reducing-js-bundle-size"
      ]
    }
  ],
  "practices": [],
  "meta": {
    "topicFamily": "rsc-client",
    "level": "intermediate",
    "title": "Deep Dive: Server and Client Component Boundaries"
  }
};
