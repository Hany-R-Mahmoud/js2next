import { topicModules } from '@/data/topics';
import type { TopicModule } from '@/data/topics/types';
import type { TopicFamily } from '@/types';

export type TopicBundle = TopicModule;
export const topicBundles = topicModules;

const topicBundleById = new Map(topicBundles.map((bundle) => [bundle.id, bundle]));

export function getTopicBundle(topicId: string): TopicBundle | undefined {
  return topicBundleById.get(topicId);
}

export function getTopicBundlesByFamily(topicFamily: TopicFamily): readonly TopicBundle[] {
  return topicBundles.filter((bundle) => bundle.meta.topicFamily === topicFamily);
}

export function getTopicRelationCounts(): Readonly<Record<string, {
  readonly challenges: number;
  readonly qa: number;
  readonly practices: number;
}>> {
  return Object.fromEntries(topicBundles.map((bundle) => [bundle.id, {
    challenges: bundle.challenges.length,
    qa: bundle.qa.length,
    practices: bundle.practices.length,
  }]));
}
