import type { Challenge, TopicFamily } from '@/types';

type CheckType = 'choice' | 'multi-choice' | 'code-contains' | 'free-text';
type BridgeTopicId = 'js-async-immutability' | 'react-mental-model' | 'state-and-effects' | 'rsc-boundaries' | 'production-concerns' | 'nextjs-data' | 'architecture-decisions';

interface ChallengeSeed {
  readonly id: string;
  readonly topicId: BridgeTopicId;
  readonly title: string;
  readonly level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  readonly scenario: string;
  readonly constraints: readonly string[];
  readonly acceptance: readonly string[];
  readonly checkType: CheckType;
  readonly prompt: string;
  readonly starterCode?: string;
  readonly options?: readonly string[];
  readonly correctIndex?: number;
  readonly correctIndices?: readonly number[];
  readonly requiredSnippets?: readonly string[];
  readonly freeTextKeywords?: readonly string[];
  readonly hints: readonly string[];
  readonly expectedReasoning: string;
  readonly wrongPaths: readonly string[];
  readonly answerExplanation: string;
  readonly followUp: string;
}

const familyByTopic: Readonly<Record<BridgeTopicId, TopicFamily>> = {
  'js-async-immutability': 'foundations',
  'react-mental-model': 'react-mental-model',
  'state-and-effects': 'state-behavior',
  'rsc-boundaries': 'rsc-client',
  'production-concerns': 'production',
  'nextjs-data': 'nextjs-data',
  'architecture-decisions': 'architecture',
};

const sourceByTopic: Readonly<Record<BridgeTopicId, string>> = {
  'js-async-immutability': 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide',
  'react-mental-model': 'https://react.dev/learn/thinking-in-react',
  'state-and-effects': 'https://react.dev/learn/you-might-not-need-an-effect',
  'rsc-boundaries': 'https://react.dev/reference/rsc/use-client',
  'production-concerns': 'https://nextjs.org/docs/app/guides/production-checklist',
  'nextjs-data': 'https://nextjs.org/docs/app/guides/caching-without-cache-components',
  'architecture-decisions': 'https://react.dev/learn/sharing-state-between-components',
};

const challengeSeeds = [
  { id: 'ch-js-1', topicId: 'js-async-immutability', title: 'Trace the microtask order', level: 1, scenario: "You are debugging log order in a React data loader's unit test.", constraints: ['No running code in your head beyond the event loop model'], acceptance: ['Correct order selected', 'Reason mentions microtasks'], checkType: 'choice', prompt: "What is the console order?\n\nconsole.log('A');\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');", options: ['A B C', 'A C B', 'B A C', 'C B A'], correctIndex: 1, hints: ['Sync code runs to completion first.', 'Promise then callbacks are microtasks.', 'Order: A, C, then B.'], expectedReasoning: 'Sync logs A and C; the microtask logs B.', wrongPaths: ['Assuming promises run immediately before the next sync line'], answerExplanation: 'The call stack runs A and C. After it clears, the microtask queue runs B.', followUp: "Add setTimeout(() => console.log('D'), 0)—where does D go?" },
  { id: 'ch-react-2', topicId: 'react-mental-model', title: 'Complete a controlled input', level: 2, scenario: 'A search box must be controlled by React state.', constraints: ['Use value + onChange', 'No defaultValue'], acceptance: ['Includes useState', 'value bound', 'onChange updates state'], checkType: 'code-contains', prompt: 'Complete the component so the input is controlled:', starterCode: 'function Search() {\n  // your state here\n  return <input /* ... */ />;\n}', requiredSnippets: ['useState', 'value=', 'onChange'], hints: ["const [q, setQ] = useState('')", 'value={q}', "onChange={(e) => setQ(e.target.value)}"], expectedReasoning: 'Controlled components read from state and write via onChange.', wrongPaths: ['Using only defaultValue (uncontrolled)'], answerExplanation: 'State owns the value; the input reflects it; onChange updates state as the single source of truth.', followUp: 'Debounce the query before filtering a large list.' },
  { id: 'ch-react-3', topicId: 'react-mental-model', title: 'Build a filterable list', level: 3, scenario: 'Product wants a client-side filter by name.', constraints: ['Stable keys', 'Derive the filtered list during render'], acceptance: ['Filter during render', 'key={item.id}'], checkType: 'code-contains', prompt: 'Write a sketch that filters items by query without useEffect:', starterCode: 'function List({ items, query }: { items: {id:string;name:string}[]; query: string }) {\n  // ...\n}', requiredSnippets: ['filter', 'key=', '.id'], hints: ['const visible = items.filter(...)', 'Do not copy query into effect state', 'key={item.id}'], expectedReasoning: 'Derived data belongs during render; stable keys come from data ids.', wrongPaths: ['Using useEffect to set filtered state'], answerExplanation: 'Filtering is pure derivation and needs no Effect. Keys must be stable identities.', followUp: 'Move query into the URL for shareable filters.' },
  { id: 'ch-eff-4', topicId: 'state-and-effects', title: 'Debug the stale effect', level: 4, scenario: 'A profile page fetches /api/users/:id but shows the previous user after navigation.', constraints: ['Explain the root cause', 'Propose a fix'], acceptance: ['Mentions a missing dependency or stale closure', 'Mentions cleanup or abort'], checkType: 'free-text', prompt: 'Why can this Effect show stale data, and what is a robust fix?', freeTextKeywords: ['userId', 'depend', 'stale'], hints: ['Look at the dependency array.', 'userId is read inside but not listed.', 'Also consider aborting in-flight requests on change.'], expectedReasoning: 'The empty dependency array captures the initial userId; include userId and clean up or abort the previous request.', wrongPaths: ['Blaming React keys only'], answerExplanation: 'Include userId in the dependency list and abort or ignore an older request when the id changes.', followUp: 'How would Server Components change this design?' },
  { id: 'ch-arch-5', topicId: 'architecture-decisions', title: 'Choose state location', level: 5, scenario: 'A dashboard date-range filter must be shareable with teammates via a link.', constraints: ['Pick one primary location', 'Justify the trade-off'], acceptance: ['URL chosen', 'Trade-off mentioned'], checkType: 'choice', prompt: 'What is the best primary home for the date range?', options: ['Module-level let variable', 'URL search params', 'CSS custom properties only', 'Only sessionStorage with no URL'], correctIndex: 1, hints: ['Shareable with teammates means it belongs in the link.', 'sessionStorage alone does not share across users.'], expectedReasoning: 'The URL is shareable and history-friendly.', wrongPaths: ['Global module state'], answerExplanation: 'Search params make the view shareable and preserve back/forward behavior. Ephemeral hover state can stay in React state.', followUp: 'When would server-stored preferences beat the URL?' },
  { id: 'ch-next-6', topicId: 'rsc-boundaries', title: 'Integrate server list + client like', level: 6, scenario: 'Posts are fetched on the server; each row needs a Like button with useState.', constraints: ['Serializable props only', '"use client" on the button file'], acceptance: ['Server page is async', 'Client button is an island'], checkType: 'multi-choice', prompt: 'Select all correct statements:', options: ['The page can be an async Server Component that awaits getPosts()', 'LikeButton should be a Client Component with "use client"', 'Pass an onLike function directly from the Server Component without Server Actions', 'Pass post id as a serializable prop into LikeButton'], correctIndices: [0, 1, 3], hints: ['Functions are not ordinary serializable props server-to-client.', 'Children/islands composition is preferred.'], expectedReasoning: 'Fetch on the server, isolate the client button, pass a serializable id, and use a server mutation boundary when needed.', wrongPaths: ['Marking the whole page client-only for one button'], answerExplanation: 'Keep the page on the server, isolate interactivity, and pass ids or data that serialize.', followUp: 'Implement like via a Server Action and targeted revalidation.' },
  { id: 'ch-prod-7', topicId: 'production-concerns', title: 'Perf + a11y constraint challenge', level: 7, scenario: 'Marketing wants an auto-playing product carousel on the homepage.', constraints: ['Respect prefers-reduced-motion', 'Preserve keyboard focus', 'Protect the LCP image budget'], acceptance: ['Mentions reduced motion', 'Mentions keyboard or focus', 'Mentions image or LCP'], checkType: 'free-text', prompt: 'List three concrete safeguards before shipping the carousel.', freeTextKeywords: ['motion', 'keyboard', 'image'], hints: ['prefers-reduced-motion should pause or disable autoplay.', 'Focus order and accessible roles matter.', 'The hero image needs an intentional loading and layout budget.'], expectedReasoning: 'Respect motion preferences, ensure keyboard operability and labels, and budget LCP with optimized media and stable layout.', wrongPaths: ['Only polishing CSS animation'], answerExplanation: 'Respect reduced motion, ensure keyboard operation and labels, and protect LCP and layout stability.', followUp: 'How do you test reduced-motion behavior in CI?' },
  { id: 'ch-arch-8', topicId: 'architecture-decisions', title: 'Defend an architecture under change', level: 8, scenario: 'You chose feature folders. Leadership wants a shared design-system package and a second Next app for admin.', constraints: ['Keep feature velocity', 'Share UI primitives'], acceptance: ['Extract primitives', 'Apps import the package', 'Avoid a god shared store'], checkType: 'free-text', prompt: 'Outline a structure and one trade-off.', freeTextKeywords: ['package', 'feature', 'app'], hints: ['Use packages/ui for primitives.', 'Keep apps/web and apps/admin boundaries.', 'Do not force all business state into one global store.'], expectedReasoning: 'Use app boundaries plus a shared UI package; keep domain features local.', wrongPaths: ['One mega Redux store for both apps on day one'], answerExplanation: 'Extract presentational primitives while keeping domain features local. The trade-off is monorepo tooling cost.', followUp: 'When should a domain package be extracted instead of briefly duplicating code?' },
  { id: 'ch-data-9', topicId: 'nextjs-data', title: 'Production stale cache failure', level: 9, scenario: "Editors update a blog post in a CMS, but production shows old content for minutes while staging uses no-store.", constraints: ['Do not disable all caching without reason'], acceptance: ['Mentions revalidation', 'Mentions a tag or path', 'Mentions the environment difference'], checkType: 'free-text', prompt: 'Hypothesize the root cause and a precise fix.', freeTextKeywords: ['revalidat', 'cache'], hints: ['Production may be caching the fetch or render.', 'A CMS webhook can revalidate a path or tag.', 'Compare fetch options between staging and production.'], expectedReasoning: 'A cached render or fetch lacks targeted invalidation after the CMS mutation.', wrongPaths: ['Blaming React keys'], answerExplanation: 'Use a CMS webhook to revalidate the affected path or tag and align cache intent across environments.', followUp: 'How would you verify cache headers during an incident?' },
  { id: 'ch-capstone-10', topicId: 'architecture-decisions', title: 'Capstone: feature design review', level: 10, scenario: 'Design a Learning Notes feature: create notes, list notes, filter by tag, and share the filter link.', constraints: ['Server owns the authoritative list', 'Filter is shareable', 'Client code is limited to needed interactivity'], acceptance: ['Server fetch list', 'URL filter', 'Accessible form fields', 'Mutation and revalidation', 'Test cases listed'], checkType: 'free-text', prompt: 'Write a short design covering routes, server/client split, state locations, and acceptance tests.', freeTextKeywords: ['server', 'url', 'revalidat', 'test', 'label'], hints: ['Use an async server page and searchParams.', 'Use a Server Action for mutation and targeted revalidation.', 'List empty, validation-error, and filter tests.'], expectedReasoning: 'The design is a vertical slice with clear boundaries and observable tests.', wrongPaths: ['All-client fetch with hidden secrets'], answerExplanation: 'The server page reads notes and URL filters; a client form submits the mutation; the list is revalidated; labels and empty/error states are tested.', followUp: 'Add optimistic creation with rollback on failure.' },
] satisfies readonly ChallengeSeed[];

export const learnReactChallenges: Challenge[] = challengeSeeds.map((seed) => ({
  slug: `learn-react-${seed.id}`,
  title: `Deep Challenge: ${seed.title}`,
  level: seed.level,
  topicFamily: familyByTopic[seed.topicId],
  scenario: seed.scenario,
  constraints: [...seed.constraints],
  acceptanceCriteria: [...seed.acceptance],
  hints: seed.hints.map((text, index) => ({ stage: index + 1, text })),
  expectedReasoning: seed.expectedReasoning,
  commonWrongPaths: [...seed.wrongPaths],
  answerExplanation: seed.answerExplanation,
  followUpVariation: seed.followUp,
  starterCode: seed.starterCode,
  checkType: seed.checkType,
  prompt: seed.prompt,
  options: seed.options ? [...seed.options] : undefined,
  correctIndex: seed.correctIndex,
  correctIndices: seed.correctIndices ? [...seed.correctIndices] : undefined,
  requiredSnippets: seed.requiredSnippets ? [...seed.requiredSnippets] : undefined,
  freeTextKeywords: seed.freeTextKeywords ? [...seed.freeTextKeywords] : undefined,
  sourceLink: sourceByTopic[seed.topicId],
}));
