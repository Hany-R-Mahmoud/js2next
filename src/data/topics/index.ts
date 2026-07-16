import type { TopicModule } from './types';
import { topic as topic_1 } from './closures-in-javascript';
import { topic as topic_2 } from './async-js-promises';
import { topic as topic_3 } from './components-and-jsx';
import { topic as topic_4 } from './state-and-events';
import { topic as topic_5 } from './use-reducer-and-context';
import { topic as topic_6 } from './use-effect-and-custom-hooks';
import { topic as topic_7 } from './app-router-and-layouts';
import { topic as topic_8 } from './server-vs-client-components';
import { topic as topic_9 } from './server-data-fetching';
import { topic as topic_10 } from './production-deployment';
import { topic as topic_11 } from './architecture-decisions';
import { topic as topic_12 } from './deep-dive-async-immutability';
import { topic as topic_13 } from './deep-dive-react-mental-model';
import { topic as topic_14 } from './deep-dive-state-and-effects';
import { topic as topic_15 } from './deep-dive-app-quality';
import { topic as topic_16 } from './deep-dive-nextjs-foundations';
import { topic as topic_17 } from './deep-dive-rsc-boundaries';
import { topic as topic_18 } from './deep-dive-nextjs-data';
import { topic as topic_19 } from './deep-dive-production-concerns';
import { topic as topic_20 } from './deep-dive-architecture-decisions';
import { topic as topic_21 } from './expansion-accessible-forms';
import { topic as topic_22 } from './expansion-runtime-schema-boundaries';
import { topic as topic_23 } from './expansion-url-state';
import { topic as topic_24 } from './expansion-browser-failure-debugging';
import { topic as topic_25 } from './expansion-client-server-state';
import { topic as topic_26 } from './expansion-performance-diagnosis';
import { topic as topic_27 } from './expansion-authorization-boundaries';
import { topic as topic_28 } from './expansion-typescript-react-boundaries';
import { topic as topic_29 } from './expansion-testing-user-behavior';
import { topic as topic_30 } from './expansion-production-readiness';
import { topic as topic_31 } from './expansion-ecosystem-comparisons';
import { topic as topic_32 } from './expansion-optimistic-mutations';
import { topic as topic_33 } from './expansion-instrumentation-incident-triage';

const authoredTopicModules = [topic_1, topic_2, topic_3, topic_4, topic_5, topic_6, topic_7, topic_8, topic_9, topic_10, topic_11, topic_12, topic_13, topic_14, topic_15, topic_16, topic_17, topic_18, topic_19, topic_20, topic_21, topic_22, topic_23, topic_24, topic_25, topic_26, topic_27, topic_28, topic_29, topic_30, topic_31, topic_32, topic_33] as const satisfies readonly TopicModule[];

const allQa = authoredTopicModules.flatMap((topic) => topic.qa);
const allChallenges = authoredTopicModules.flatMap((topic) => topic.challenges);

export const topicModules: readonly TopicModule[] = authoredTopicModules.map((topic) => ({
  ...topic,
  qa: topic.qa.map((item) => {
    const options = choiceOptions(
      item.answer,
      allQa
        .filter((candidate) => candidate.id !== item.id && candidate.topicFamily === item.topicFamily)
        .map((candidate) => candidate.answer),
      item.id,
    );
    return { ...item, options, correctIndex: options.indexOf(item.answer) };
  }),
  challenges: topic.challenges.map((challenge) => {
    if (challenge.checkType === 'choice' || challenge.checkType === 'multi-choice' || challenge.checkType === 'code-contains') return challenge;
    const correct = challenge.answerExplanation;
    const options = choiceOptions(
      correct,
      [
        ...challenge.commonWrongPaths,
        ...allChallenges
          .filter((candidate) => candidate.slug !== challenge.slug && candidate.topicFamily === challenge.topicFamily)
          .map((candidate) => candidate.answerExplanation),
      ],
      challenge.slug,
    );
    return {
      ...challenge,
      checkType: 'choice' as const,
      prompt: challenge.prompt ?? 'Which approach best satisfies this scenario?',
      options,
      correctIndex: options.indexOf(correct),
      freeTextKeywords: undefined,
    };
  }),
}));

function choiceOptions(correct: string, candidates: readonly string[], key: string): string[] {
  const distractors = Array.from(new Set(candidates.filter((candidate) => candidate !== correct))).slice(0, 3);
  if (distractors.length < 3) throw new Error(`Not enough distinct answer choices for ${key}`);
  const options = [...distractors];
  options.splice(hash(key) % 4, 0, correct);
  return options;
}

function hash(value: string): number {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}
