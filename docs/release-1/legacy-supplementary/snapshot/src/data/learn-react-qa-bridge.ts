import type { QAItem, TopicFamily } from '@/types';
import { learnReactDeepDives } from './learn-react-bridge';

const categoryByFamily: Readonly<Record<TopicFamily, QAItem['category']>> = {
  foundations: 'debugging',
  'react-mental-model': 'react',
  'state-behavior': 'react',
  'app-quality': 'accessibility',
  'nextjs-foundations': 'nextjs',
  'rsc-client': 'nextjs',
  'nextjs-data': 'nextjs',
  production: 'performance',
  architecture: 'architecture',
};

const diagnosticQa: QAItem[] = learnReactDeepDives.flatMap((lesson) => {
  const question = lesson.sections.flatMap((section) => section.questions ?? [])[0];
  if (!question) return [];
  return [{
    id: `learn-react-${question.id}`,
    question: question.question,
    answer: question.correctAnswer ?? 'Review the explanation and reason from the model.',
    followUp: question.expectedReasoning ?? lesson.retrievalPrompt,
    category: categoryByFamily[lesson.topicFamily],
    level: lesson.level,
    topicId: lesson.slug,
    topicFamily: lesson.topicFamily,
    tags: ['learn-react-bridge', lesson.topicFamily],
    sourceLink: lesson.slug === 'deep-dive-async-immutability'
      ? 'https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch'
      : lesson.metadata.sources[0],
  }];
});

type UnownedQAItem = Omit<QAItem, 'topicId' | 'topicFamily'>;

const extraQa: UnownedQAItem[] = [
  {
    id: 'learn-react-qa-extra-1',
    category: 'performance',
    level: 'intermediate',
    question: 'When should I memoize with useMemo or useCallback?',
    answer: 'Use them for a measured expensive calculation or a stable reference required by an optimized child or Effect. Avoid blanket memoization because it adds complexity.',
    followUp: 'How would you measure whether memoization helped?',
    tags: ['learn-react-bridge', 'memoization'],
    sourceLink: 'https://react.dev/reference/react/useMemo',
  },
  {
    id: 'learn-react-qa-extra-2',
    category: 'testing',
    level: 'intermediate',
    question: 'What should I test in a React component?',
    answer: 'Test user-visible behavior: rendered outcomes, interactions, and accessibility roles. Avoid coupling tests to implementation details such as state variable names.',
    followUp: 'How would you test a component that uses a context provider?',
    tags: ['learn-react-bridge', 'testing'],
    sourceLink: 'https://testing-library.com/docs/react-testing-library/intro/',
  },
  {
    id: 'learn-react-qa-extra-3',
    category: 'debugging',
    level: 'intermediate',
    question: 'React says “Too many re-renders”. What should I inspect first?',
    answer: 'Look for an unconditional state update during render, such as setX(1) in the component body or onClick={handler()} invoking the handler immediately.',
    followUp: 'How does Strict Mode effect setup differ from an infinite render loop?',
    tags: ['learn-react-bridge', 'debugging'],
    sourceLink: 'https://react.dev/reference/react/useState',
  },
  {
    id: 'learn-react-qa-extra-4',
    category: 'nextjs',
    level: 'intermediate',
    question: 'What is the difference between redirect and next/link navigation?',
    answer: 'next/link supports user-driven client navigation. redirect() is server-side control flow, such as sending a user elsewhere after an authorization check.',
    followUp: 'When does redirect throw?',
    tags: ['learn-react-bridge', 'navigation'],
    sourceLink: 'https://nextjs.org/docs/app/api-reference/functions/redirect',
  },
];

const extraQaOwnership: Readonly<Record<string, { topicId: string; topicFamily: TopicFamily }>> = {
  'learn-react-qa-extra-1': { topicId: 'expansion-performance-diagnosis', topicFamily: 'production' },
  'learn-react-qa-extra-2': { topicId: 'expansion-testing-user-behavior', topicFamily: 'app-quality' },
  'learn-react-qa-extra-3': { topicId: 'deep-dive-react-mental-model', topicFamily: 'react-mental-model' },
  'learn-react-qa-extra-4': { topicId: 'app-router-and-layouts', topicFamily: 'nextjs-foundations' },
};

export const learnReactQa: QAItem[] = [...diagnosticQa, ...extraQa.map((item) => ({ ...item, ...extraQaOwnership[item.id] }))];
