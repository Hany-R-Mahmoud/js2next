import type { Lesson, LessonChunk, LessonDiagram, LessonSection, Level, MiniProject, TopicFamily } from '@/types';

interface BridgeSeed {
  readonly slug: string;
  readonly title: string;
  readonly topicFamily: TopicFamily;
  readonly level: Level;
  readonly prerequisites: readonly string[];
  readonly objectives: readonly string[];
  readonly whyMatters: string;
  readonly plainExplanation: string;
  readonly technicalModel: string;
  readonly causalWhy: string;
  readonly example: { readonly title: string; readonly code: string; readonly language: string; readonly path: string };
  readonly diagnostic: { readonly question: string; readonly options: readonly string[]; readonly correctAnswer: string; readonly expectedReasoning: string };
  readonly source: string;
  readonly nextTopic: string;
}

const bridgeSeeds = [
  {
    slug: 'deep-dive-async-immutability', title: 'Deep Dive: Async JavaScript, Immutability & Modules', topicFamily: 'foundations', level: 'beginner',
    prerequisites: [], objectives: ['Trace promise settlement and microtask order', 'Update nested data without mutation', 'Choose clear module boundaries'],
    whyMatters: 'React state updates and data fetching depend on promises, immutable references, and module boundaries.',
    plainExplanation: 'JavaScript schedules asynchronous work through the event loop. Immutability means creating new values instead of changing existing references, which lets React detect state changes predictably.',
    technicalModel: 'A Promise moves from pending to fulfilled or rejected. async functions return Promises. Shallow copies protect the root object; every nested object that changes needs its own new reference.',
    causalWhy: 'Mutating a nested object while preserving its parent reference can make an update invisible to reference-based comparison and can leave async results out of order.',
    example: { title: 'Immutable nested update', code: 'const next = { ...state, user: { ...state.user, age: 31 } };', language: 'typescript', path: 'Illustrative snippet' },
    diagnostic: { question: 'What does fetch(url) resolve to before json() is called?', options: ['Parsed JSON', 'A Response object', 'undefined', 'A rejected Promise'], correctAnswer: 'A Response object', expectedReasoning: 'fetch resolves to a Response; the body must be read separately with json(), text(), or another body method.' },
    source: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function', nextTopic: 'deep-dive-react-mental-model',
  },
  {
    slug: 'deep-dive-react-mental-model', title: 'Deep Dive: React Mental Model', topicFamily: 'react-mental-model', level: 'beginner',
    prerequisites: ['deep-dive-async-immutability'], objectives: ['Keep render pure', 'Separate props from state', 'Use stable keys and one-way data flow'],
    whyMatters: 'Props, state, keys, and composition become easier when a component is treated as a function of its inputs.',
    plainExplanation: 'A component returns a description of UI. React re-runs it when inputs change, compares the returned tree, and commits the necessary host updates.',
    technicalModel: 'Render is a pure calculation; commit applies the result. Props flow down, events flow up through callbacks, and keys preserve identity among siblings.',
    causalWhy: 'Stable identity tells React which list item survived across renders. Derived values should be computed from source state instead of stored as a second value that can drift.',
    example: { title: 'State update with a functional updater', code: 'setCount((current) => current + 1);', language: 'typescript', path: 'Illustrative snippet' },
    diagnostic: { question: 'Where should a network request that loads after mount live?', options: ['The component body', 'An Effect or event handler with explicit cleanup/error handling', 'A key prop', 'CSS'], correctAnswer: 'An Effect or event handler with explicit cleanup/error handling', expectedReasoning: 'Render must stay pure; external synchronization belongs in an Effect or in the event that initiated it.' },
    source: 'https://react.dev/learn/thinking-in-react', nextTopic: 'deep-dive-state-and-effects',
  },
  {
    slug: 'deep-dive-state-and-effects', title: 'Deep Dive: State, Effects & Custom Hooks', topicFamily: 'state-behavior', level: 'intermediate',
    prerequisites: ['deep-dive-react-mental-model'], objectives: ['Choose state ownership', 'Use Effects only for synchronization', 'Extract repeated behavior into hooks'],
    whyMatters: 'Most React complexity comes from unclear state ownership and Effects that are used for derivation or event handling.',
    plainExplanation: 'Keep state at the lowest owner that needs it, derive values during render, and use Effects to synchronize with systems outside React.',
    technicalModel: 'An Effect runs after commit and re-runs when reactive dependencies change. Cleanup runs before the next setup and on unmount, making it the boundary for subscriptions and request cancellation.',
    causalWhy: 'An Effect used to derive state adds an extra render and creates synchronization paths that can disagree. A functional updater or a reducer makes transitions explicit instead.',
    example: { title: 'Effect cleanup for a request', code: 'useEffect(() => {\n  const controller = new AbortController();\n  load(query, controller.signal);\n  return () => controller.abort();\n}, [query]);', language: 'typescript', path: 'Illustrative snippet' },
    diagnostic: { question: 'Which value should usually be computed during render rather than stored in state?', options: ['A WebSocket connection', 'A filtered list derived from items and query', 'A browser subscription', 'An external widget instance'], correctAnswer: 'A filtered list derived from items and query', expectedReasoning: 'Filtering is pure derivation. The other cases synchronize with an external system and need lifecycle management.' },
    source: 'https://react.dev/learn/you-might-not-need-an-effect', nextTopic: 'deep-dive-app-quality',
  },
  {
    slug: 'deep-dive-app-quality', title: 'Deep Dive: Forms, Accessibility, Errors & Testing', topicFamily: 'app-quality', level: 'intermediate',
    prerequisites: ['deep-dive-state-and-effects'], objectives: ['Build accessible form flows', 'Handle loading and error states', 'Test observable behavior'],
    whyMatters: 'A feature is not complete when it renders; users need clear states, keyboard access, recovery paths, and confidence that behavior stays correct.',
    plainExplanation: 'Use native controls first, label inputs, expose validation and status changes, and test what a user can see and do.',
    technicalModel: 'A robust async UI models idle, pending, success, empty, and error states. Tests should query roles and labels and assert outcomes instead of component internals.',
    causalWhy: 'Missing labels and failure states block real users. Testing implementation details makes tests brittle while missing regressions in the actual interaction contract.',
    example: { title: 'Accessible field', code: '<label htmlFor="email">Email</label>\n<input id="email" name="email" type="email" required />', language: 'tsx', path: 'Illustrative snippet' },
    diagnostic: { question: 'What is the strongest default for a form control?', options: ['A clickable div with custom handlers', 'A native input with a visible label', 'Placeholder text only', 'An icon with a tooltip'], correctAnswer: 'A native input with a visible label', expectedReasoning: 'Native controls provide keyboard, semantics, and validation behavior; a label keeps the relationship explicit.' },
    source: 'https://www.w3.org/WAI/ARIA/apg/', nextTopic: 'deep-dive-nextjs-foundations',
  },
  {
    slug: 'deep-dive-nextjs-foundations', title: 'Deep Dive: Next.js App Router Foundations', topicFamily: 'nextjs-foundations', level: 'intermediate',
    prerequisites: ['deep-dive-react-mental-model'], objectives: ['Organize route segments', 'Use layouts and loading states', 'Keep route concerns separate'],
    whyMatters: 'The App Router makes route structure, layouts, loading UI, and error boundaries part of the product architecture.',
    plainExplanation: 'Folders define segments, layouts persist around nested pages, and special files provide route-scoped loading and error behavior.',
    technicalModel: 'The route tree is composed from layouts, pages, and segment boundaries. Server Components are the default, so data and interactivity should be placed deliberately.',
    causalWhy: 'Clear segment boundaries prevent a single page from owning unrelated loading and error behavior and make navigation state easier to reason about.',
    example: { title: 'Route-scoped loading UI', code: 'export default function Loading() {\n  return <p role="status">Loading dashboard…</p>;\n}', language: 'tsx', path: 'Illustrative snippet' },
    diagnostic: { question: 'Which file supplies a persistent wrapper for nested routes?', options: ['layout.tsx', 'loading.tsx', 'route.ts', 'not-found.tsx'], correctAnswer: 'layout.tsx', expectedReasoning: 'A layout wraps and persists across navigation between its child segments.' },
    source: 'https://nextjs.org/docs/app/building-your-application/routing', nextTopic: 'deep-dive-rsc-boundaries',
  },
  {
    slug: 'deep-dive-rsc-boundaries', title: 'Deep Dive: Server and Client Component Boundaries', topicFamily: 'rsc-client', level: 'intermediate',
    prerequisites: ['deep-dive-nextjs-foundations'], objectives: ['Choose the correct component boundary', 'Pass serializable props', 'Keep interactive islands small'],
    whyMatters: 'The Server/Client boundary controls data access, browser capability, and how much JavaScript reaches the browser.',
    plainExplanation: 'Server Components can access server resources and render Client Components. Client Components handle hooks, events, and browser APIs.',
    technicalModel: "'use client' marks a module-graph boundary. Client Components can render server-provided children, but values crossing the boundary must obey React's serialization contract; Promises can be passed for a Client Component to read with use.",
    causalWhy: 'Marking an entire route as client-only for one button expands the client graph and can move server-only work into the browser. Isolating the interactive leaf preserves both capabilities.',
    example: { title: 'Small client island', code: "'use client';\n\nexport function LikeButton({ postId }: { postId: string }) {\n  return <button type=\"button\">Like {postId}</button>;\n}", language: 'tsx', path: 'Illustrative snippet' },
    diagnostic: { question: 'Which value is a safe ordinary prop from Server to Client?', options: ['A database connection', 'A class instance', 'A post id string', 'A function closure'], correctAnswer: 'A post id string', expectedReasoning: 'A primitive string is serializable; server resources, class instances, and closures are not ordinary serializable props.' },
    source: 'https://react.dev/reference/rsc/use-client', nextTopic: 'deep-dive-nextjs-data',
  },
  {
    slug: 'deep-dive-nextjs-data', title: 'Deep Dive: Data Fetching, Caching & Mutations', topicFamily: 'nextjs-data', level: 'advanced',
    prerequisites: ['deep-dive-rsc-boundaries'], objectives: ['Make cache intent explicit', 'Choose revalidation boundaries', 'Model mutation and refresh states'],
    whyMatters: 'Production correctness depends on knowing where data is fetched, cached, invalidated, and mutated.',
    plainExplanation: 'Fetch data where it belongs, state cache intent explicitly, and invalidate the smallest path or tag after a mutation.',
    technicalModel: 'A request may be cached, revalidated, or dynamic depending on its options and context. Route Handlers and Server Actions have different control-flow and invalidation responsibilities.',
    causalWhy: 'A stale production page is usually a cache contract or invalidation problem, not a rendering mystery. Align fetch options and mutation revalidation with the data ownership boundary.',
    example: { title: 'Explicit revalidation', code: "fetch('/api/posts', { next: { revalidate: 60, tags: ['posts'] } });", language: 'typescript', path: 'Illustrative snippet' },
    diagnostic: { question: 'What should a CMS webhook do after a post mutation?', options: ['Reload every browser tab', 'Invalidate the affected path or tag', 'Disable all caching permanently', 'Change React keys'], correctAnswer: 'Invalidate the affected path or tag', expectedReasoning: 'Targeted invalidation refreshes the affected cached data without discarding unrelated cache policy.' },
    source: 'https://nextjs.org/docs/app/building-your-application/caching', nextTopic: 'deep-dive-production-concerns',
  },
  {
    slug: 'deep-dive-production-concerns', title: 'Deep Dive: Auth Concepts, Security, Performance & Deploy', topicFamily: 'production', level: 'advanced',
    prerequisites: ['deep-dive-nextjs-data'], objectives: ['Separate authentication from authorization', 'Protect server boundaries', 'Budget performance and deployment risk'],
    whyMatters: 'A polished frontend still fails if authorization is client-only, secrets leak, or production performance and observability are ignored.',
    plainExplanation: 'The server is the authority for identity and permission checks. The UI can reflect access, but it cannot grant access.',
    technicalModel: 'Authenticate the request, authorize the action at the server boundary, and keep secrets out of client bundles. Measure user-facing performance instead of assuming a framework default is optimal.',
    causalWhy: 'Hidden buttons and middleware redirects do not protect APIs or mutations. Every privileged server operation needs its own denied-path check.',
    example: { title: 'Server-side authorization shape', code: 'const session = await getSession();\nif (!session?.user || session.user.id !== ownerId) redirect(\'/sign-in\');', language: 'typescript', path: 'Illustrative snippet' },
    diagnostic: { question: 'Where must authorization be enforced?', options: ['Only by hiding the button', 'At the server action/API boundary', 'Only in middleware UI redirects', 'In CSS'], correctAnswer: 'At the server action/API boundary', expectedReasoning: 'Clients are untrusted; the mutation or data boundary must reject unauthorized requests.' },
    source: 'https://nextjs.org/docs/app/building-your-application/authentication', nextTopic: 'deep-dive-architecture-decisions',
  },
  {
    slug: 'deep-dive-architecture-decisions', title: 'Deep Dive: Architecture & Trade-off Decisions', topicFamily: 'architecture', level: 'expert',
    prerequisites: ['deep-dive-production-concerns'], objectives: ['Choose state ownership deliberately', 'Separate feature and shared boundaries', 'Record decisions with trade-offs'],
    whyMatters: 'Architecture is the repeated practice of making boundaries and trade-offs explicit as the product changes.',
    plainExplanation: 'Keep feature state close to the feature, extract shared primitives when duplication hurts, and document why a dependency or boundary exists.',
    technicalModel: 'A useful decision names context, constraints, chosen boundary, alternatives, and the cost accepted. Avoid a global store unless the data is truly cross-cutting and independently owned.',
    causalWhy: 'Premature global abstractions couple unrelated features and make testing and migration harder. Small local boundaries preserve replaceability until repetition proves a shared seam.',
    example: { title: 'Decision record shape', code: 'Context: two apps share visual primitives.\nDecision: extract packages/ui, keep domain state local.\nTrade-off: monorepo tooling cost.', language: 'text', path: 'Illustrative snippet' },
    diagnostic: { question: 'What is the strongest reason to delay a global store?', options: ['Global stores are always slow', 'It couples components and reduces independent reuse', 'React forbids them', 'They cannot persist'], correctAnswer: 'It couples components and reduces independent reuse', expectedReasoning: 'The main cost is coupling and testability, not an absolute performance rule.' },
    source: 'https://react.dev/learn/sharing-state-between-components', nextTopic: '',
  },
] satisfies readonly BridgeSeed[];

function makeSections(seed: BridgeSeed): LessonSection[] {
  return [
    { id: `${seed.slug}-model`, type: 'concept', title: 'Plain explanation', content: seed.plainExplanation },
    { id: `${seed.slug}-technical`, type: 'concept', title: 'Technical model', content: seed.technicalModel },
    { id: `${seed.slug}-causal`, type: 'concept', title: 'Why it behaves this way', content: seed.causalWhy },
    { id: `${seed.slug}-example`, type: 'code-example', title: seed.example.title, content: 'Apply the model in a small, reviewable example.', code: seed.example.code, codeLanguage: seed.example.language, codeFilePath: seed.example.path },
    { id: `${seed.slug}-check`, type: 'question', title: 'Prediction check', content: '', questions: [{ id: `${seed.slug}-question`, question: seed.diagnostic.question, options: [...seed.diagnostic.options], correctAnswer: seed.diagnostic.correctAnswer, expectedReasoning: seed.diagnostic.expectedReasoning }] },
    { id: `${seed.slug}-synthesis`, type: 'synthesis', title: 'Synthesis', content: `${seed.technicalModel}\n\nDecision clue: ${seed.causalWhy}` },
  ];
}

function makeChunks(seed: BridgeSeed): LessonChunk[] {
  return [
    {
      id: `${seed.slug}-prediction`,
      title: 'Predict the boundary',
      concept: seed.technicalModel,
      prediction: {
        prompt: seed.diagnostic.question,
        options: [...seed.diagnostic.options],
        correctAnswer: seed.diagnostic.correctAnswer,
        feedbackCorrect: 'Correct. Your prediction matches the model. Now explain why it stays true under change.',
        feedbackWrong: `Revisit the model: ${seed.diagnostic.expectedReasoning}`,
      },
      synthesis: seed.diagnostic.expectedReasoning,
    },
    {
      id: `${seed.slug}-failure-mode`,
      title: 'Name the failure mode',
      concept: seed.causalWhy,
      prediction: {
        prompt: 'Which design move best prevents the failure described above?',
        options: ['Make the boundary explicit', 'Add another duplicated state value', 'Hide the failure from the user'],
        correctAnswer: 'Make the boundary explicit',
        feedbackCorrect: 'Correct. Explicit boundaries make the cause, ownership, and recovery path inspectable.',
        feedbackWrong: 'Prefer the smallest explicit boundary that owns the behavior and its recovery path.',
      },
      synthesis: `Use this clue in review: ${seed.causalWhy}`,
    },
  ];
}

function makeMiniProject(seed: BridgeSeed): MiniProject {
  return {
    title: `Practice lab: ${seed.title.replace('Deep Dive: ', '')}`,
    scenario: `Apply the lesson to a small feature. Explain the boundary before writing code, then name how you would verify it.`,
    acceptance: [...seed.objectives.slice(0, 3), 'Name one failure state and one observable test.'],
    rubric: [
      { dimension: 'Model', evidence: `The implementation demonstrates: ${seed.objectives[0]}.` },
      { dimension: 'Boundary', evidence: `The explanation identifies the ownership or lifecycle boundary for ${seed.title.replace('Deep Dive: ', '').toLowerCase()}.` },
      { dimension: 'Verification', evidence: 'A failure state and an observable test are included.' },
    ],
  };
}

function makeDiagram(seed: BridgeSeed): LessonDiagram {
  return {
    title: 'Model → boundary → observable outcome',
    kind: 'flow',
    nodes: [
      { id: 'model', label: 'Core model', role: seed.title.replace('Deep Dive: ', '') },
      { id: 'boundary', label: 'Explicit boundary', role: 'Where ownership and policy live' },
      { id: 'outcome', label: 'Observable outcome', role: 'What a learner or user can verify' },
    ],
    edges: [
      { from: 'model', to: 'boundary', label: 'guides the decision' },
      { from: 'boundary', to: 'outcome', label: 'makes behavior testable' },
    ],
  };
}

export const learnReactDeepDives: Lesson[] = bridgeSeeds.map((seed) => ({
  slug: seed.slug,
  title: seed.title,
  topicFamily: seed.topicFamily,
  level: seed.level,
  prerequisites: [...seed.prerequisites],
  learningObjectives: [...seed.objectives],
  whyMatters: seed.whyMatters,
  estimatedMinutes: 25,
  sections: makeSections(seed),
  chunks: makeChunks(seed),
  miniProject: makeMiniProject(seed),
  diagram: makeDiagram(seed),
  retrievalPrompt: `Explain the core model of ${seed.title.replace('Deep Dive: ', '')} and name one failure mode it prevents.`,
  reflectionPrompt: `Find one place in a real frontend project where this ${seed.title.replace('Deep Dive: ', '').toLowerCase()} decision could be made more explicit.`,
  masteryCriteria: [...seed.objectives],
  nextTopics: seed.nextTopic ? [seed.nextTopic] : [],
  metadata: {
    lastUpdated: '2026-07-14',
    sources: [
      seed.source,
      ...(seed.slug === 'deep-dive-async-immutability' ? ['https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide', 'https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch'] : []),
      ...(seed.slug === 'deep-dive-state-and-effects' ? ['https://react.dev/learn/synchronizing-with-effects'] : []),
      ...(seed.slug === 'deep-dive-app-quality' ? ['https://www.w3.org/TR/WCAG22/', 'https://testing-library.com/docs/react-testing-library/intro/'] : []),
      ...(seed.slug === 'deep-dive-nextjs-foundations' ? ['https://nextjs.org/docs/app/getting-started/layouts-and-pages'] : []),
      ...(seed.slug === 'deep-dive-rsc-boundaries' ? ['https://nextjs.org/docs/app/getting-started/server-and-client-components'] : []),
      ...(seed.slug === 'deep-dive-nextjs-data' ? ['https://nextjs.org/docs/15/app/guides/caching', 'https://nextjs.org/docs/15/app/guides/forms'] : []),
      ...(seed.slug === 'deep-dive-production-concerns' ? ['https://nextjs.org/docs/15/app/guides/authentication', 'https://nextjs.org/docs/15/app/guides/environment-variables', 'https://nextjs.org/docs/15/app/guides/production-checklist'] : []),
    ],
  },
}));
