import { topicModules } from '@/data/topics';

export const challenges = topicModules
  .flatMap((bundle) => bundle.challenges)
  .filter((challenge) => !challenge.slug.startsWith('loop-'));
