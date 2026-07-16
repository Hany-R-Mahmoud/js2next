import { describe, expect, it } from 'vitest';
import { bestPractices } from '@/data/best-practices';
import { challenges } from '@/data/challenges';
import { qaItems } from '@/data/qa';
import { getTopicBundle, topicBundles } from './topics';
import { supplementalChallenges, supplementalQaItems } from './topic-loop-content';
import { topicModules } from '@/data/topics';

describe('canonical topic bundles', () => {
  it('owns all related learning records by exact topic id', () => {
    const bundle = getTopicBundle('state-and-events');

    expect(bundle).toBeDefined();
    expect(bundle?.lesson.slug).toBe('state-and-events');
    expect(bundle?.challenges.every((challenge) => challenge.topicFamily === bundle.lesson.topicFamily)).toBe(true);
    expect(bundle?.qa.every((item) => item.topicId === bundle.lesson.slug)).toBe(true);
    expect(bundle?.practices.every((practice) => practice.topicId === bundle.lesson.slug)).toBe(true);
  });

  it('publishes one bundle per lesson without duplicate topic ids', () => {
    expect(topicBundles.length).toBeGreaterThan(0);
    expect(new Set(topicBundles.map((bundle) => bundle.id)).size).toBe(topicBundles.length);
    expect(topicBundles.every((bundle) => bundle.lesson.slug === bundle.id)).toBe(true);
  });

  it('uses the topic-owned registry as the canonical bundle source', () => {
    expect(topicBundles.map((bundle) => bundle.id)).toEqual(topicModules.map((bundle) => bundle.id));
  });

  it('does not drop published relationship records during migration', () => {
    expect(topicBundles.flatMap((bundle) => bundle.challenges).map((challenge) => challenge.slug).sort()).toEqual([...challenges, ...supplementalChallenges].map((challenge) => challenge.slug).sort());
    expect(topicBundles.flatMap((bundle) => bundle.qa).map((item) => item.id).sort()).toEqual([...qaItems, ...supplementalQaItems].map((item) => item.id).sort());
    expect(topicBundles.flatMap((bundle) => bundle.practices).map((practice) => practice.id).sort()).toEqual(bestPractices.map((practice) => practice.id).sort());
  });

  it('gives every published topic a complete learning loop', () => {
    const sparse = topicBundles
      .filter((bundle) => bundle.challenges.length < 1 || bundle.qa.length < 3)
      .map((bundle) => `${bundle.id} (challenges=${bundle.challenges.length}, qa=${bundle.qa.length})`);
    expect(sparse).toEqual([]);
    expect(topicBundles.every((bundle) => bundle.challenges.length <= 3 && bundle.qa.length <= 5)).toBe(true);
  });

  it('publishes selectable answers for every conceptual question', () => {
    const qa = topicBundles.flatMap((bundle) => bundle.qa);
    const conceptualChallenges = topicBundles
      .flatMap((bundle) => bundle.challenges)
      .filter((challenge) => challenge.checkType !== 'code-contains');

    expect(qa.every((item) => item.options?.length === 4 && item.correctIndex !== undefined && item.options[item.correctIndex] === item.answer)).toBe(true);
    expect(conceptualChallenges.every((challenge) => ['choice', 'multi-choice'].includes(challenge.checkType ?? '') && challenge.options?.length === 4)).toBe(true);
  });

  it('keeps sparse-topic drafts explicit and source-linked', () => {
    expect(supplementalChallenges.every((challenge) => challenge.slug.startsWith('loop-') && challenge.sourceLink?.startsWith('http'))).toBe(true);
    expect(supplementalQaItems.every((item) => item.id.startsWith('loop-qa-') && item.sourceLink?.startsWith('http'))).toBe(true);
  });
});
