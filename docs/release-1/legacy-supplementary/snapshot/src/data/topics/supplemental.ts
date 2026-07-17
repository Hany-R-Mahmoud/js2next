import { topicModules } from './index';

export const supplementalChallenges = topicModules
  .flatMap((bundle) => bundle.challenges)
  .filter((challenge) => challenge.slug.startsWith('loop-'));

export const supplementalQaItems = topicModules
  .flatMap((bundle) => bundle.qa)
  .filter((item) => item.id.startsWith('loop-qa-'));
