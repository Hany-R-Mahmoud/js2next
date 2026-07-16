import { topicModules } from '@/data/topics';

export const bestPractices = topicModules.flatMap((bundle) => bundle.practices);
