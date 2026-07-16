import { topicModules } from '@/data/topics';

export const qaItems = topicModules
  .flatMap((bundle) => bundle.qa)
  .filter((item) => !item.id.startsWith('loop-qa-'));
