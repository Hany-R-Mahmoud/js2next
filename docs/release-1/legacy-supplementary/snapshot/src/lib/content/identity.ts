import type { Challenge } from '@/types';

export type ContentKind = 'lesson' | 'challenge' | 'qa' | 'practice';

const challengeTopicBySlug = {
  'fix-stale-closure': 'closures-in-javascript',
  'implement-counter': 'state-and-events',
  'build-todo-list': 'use-reducer-and-context',
  'debug-race-condition': 'async-js-promises',
  'choose-state-strategy': 'architecture-decisions',
  'integrate-rsc-data': 'server-vs-client-components',
  'optimize-list-performance': 'production-deployment',
  'design-auth-flow': 'production-deployment',
  'investigate-slow-page': 'production-deployment',
  'capstone-build-portfolio': 'architecture-decisions',
  'learn-react-ch-js-1': 'deep-dive-async-immutability',
  'learn-react-ch-react-2': 'deep-dive-react-mental-model',
  'learn-react-ch-react-3': 'deep-dive-react-mental-model',
  'learn-react-ch-eff-4': 'deep-dive-state-and-effects',
  'learn-react-ch-arch-5': 'deep-dive-architecture-decisions',
  'learn-react-ch-next-6': 'deep-dive-rsc-boundaries',
  'learn-react-ch-prod-7': 'deep-dive-production-concerns',
  'learn-react-ch-arch-8': 'deep-dive-architecture-decisions',
  'learn-react-ch-data-9': 'deep-dive-nextjs-data',
  'learn-react-ch-capstone-10': 'deep-dive-architecture-decisions',
  'expansion-build-accessible-form': 'expansion-accessible-forms',
  'expansion-design-runtime-schema-boundary': 'expansion-runtime-schema-boundaries',
  'expansion-design-url-filter-state': 'expansion-url-state',
  'expansion-debug-stale-search-results': 'expansion-browser-failure-debugging',
  'expansion-design-query-cache-boundary': 'expansion-client-server-state',
  'expansion-profile-render-hotspot': 'expansion-performance-diagnosis',
  'expansion-review-ownership-check': 'expansion-authorization-boundaries',
  'expansion-type-safe-form-boundary': 'expansion-typescript-react-boundaries',
  'expansion-design-test-boundary': 'expansion-testing-user-behavior',
  'expansion-audit-production-release': 'expansion-production-readiness',
  'expansion-review-ecosystem-choice': 'expansion-ecosystem-comparisons',
  'expansion-design-optimistic-mutation': 'expansion-optimistic-mutations',
  'expansion-design-route-recovery': 'app-router-and-layouts',
  'expansion-triage-instrumentation-incident': 'expansion-instrumentation-incident-triage',
  'expansion-design-session-refresh-race': 'expansion-authorization-boundaries',
} as const;

const challengeLessonSectionBySlug: Readonly<Record<string, string>> = {
  'fix-stale-closure': 'closure-fix',
  'implement-counter': 'state-batching',
  'build-todo-list': 'reducer-pattern',
  'debug-race-condition': 'race-conditions',
  'choose-state-strategy': 'architecture-question',
  'integrate-rsc-data': 'decision-guide',
  'optimize-list-performance': 'build-output',
  'design-auth-flow': 'env-vars',
  'investigate-slow-page': 'build-output',
  'capstone-build-portfolio': 'feature-organization',
  'learn-react-ch-js-1': 'deep-dive-async-immutability-model',
  'learn-react-ch-react-2': 'deep-dive-react-mental-model-model',
  'learn-react-ch-react-3': 'deep-dive-react-mental-model-model',
  'learn-react-ch-eff-4': 'deep-dive-state-and-effects-model',
  'learn-react-ch-arch-5': 'deep-dive-architecture-decisions-model',
  'learn-react-ch-next-6': 'deep-dive-rsc-boundaries-model',
  'learn-react-ch-prod-7': 'deep-dive-production-concerns-model',
  'learn-react-ch-arch-8': 'deep-dive-architecture-decisions-model',
  'learn-react-ch-data-9': 'deep-dive-nextjs-data-model',
  'learn-react-ch-capstone-10': 'deep-dive-architecture-decisions-model',
  'expansion-build-accessible-form': 'expansion-accessible-forms-model',
  'expansion-design-runtime-schema-boundary': 'expansion-runtime-schema-model',
  'expansion-design-url-filter-state': 'expansion-url-state-model',
  'expansion-debug-stale-search-results': 'expansion-browser-failure-fetch',
  'expansion-design-query-cache-boundary': 'expansion-client-server-state-model',
  'expansion-profile-render-hotspot': 'expansion-performance-diagnosis-model',
  'expansion-review-ownership-check': 'expansion-authorization-boundaries-model',
  'expansion-type-safe-form-boundary': 'expansion-typescript-react-boundaries-model',
  'expansion-design-test-boundary': 'expansion-testing-user-behavior-model',
  'expansion-audit-production-release': 'expansion-production-readiness-model',
  'expansion-review-ecosystem-choice': 'expansion-ecosystem-comparisons-model',
  'expansion-design-optimistic-mutation': 'expansion-optimistic-mutations-model',
  'expansion-design-route-recovery': 'loading-error',
  'expansion-triage-instrumentation-incident': 'expansion-instrumentation-triage-model',
  'expansion-design-session-refresh-race': 'expansion-authorization-boundaries-model',
};

const supplementalLessonSectionByTopic: Readonly<Record<string, string>> = {
  'components-and-jsx': 'what-is-component',
  'use-effect-and-custom-hooks': 'effect-purpose',
  'server-data-fetching': 'server-fetch',
  'deep-dive-app-quality': 'deep-dive-app-quality-model',
  'deep-dive-nextjs-foundations': 'deep-dive-nextjs-foundations-model',
};

export function contentKey(kind: ContentKind, slug: string): string {
  return `${kind}:${slug}`;
}

export function challengeContentId(slug: string): string {
  return contentKey('challenge', slug);
}

export function getChallengeTopicId(challenge: Challenge): string | null {
  const entry = Object.entries(challengeTopicBySlug).find(([slug]) => slug === challenge.slug);
  if (entry) return entry[1];
  return challenge.slug.startsWith('loop-') ? challenge.slug.slice('loop-'.length) : null;
}

export function getChallengeTopicMap(): Readonly<Record<string, string>> {
  return challengeTopicBySlug;
}

export function getChallengeLessonSectionId(challenge: Challenge): string | null {
  if (challengeLessonSectionBySlug[challenge.slug]) return challengeLessonSectionBySlug[challenge.slug];
  if (challenge.slug.startsWith('loop-')) return supplementalLessonSectionByTopic[challenge.slug.slice('loop-'.length)] ?? null;
  return null;
}
