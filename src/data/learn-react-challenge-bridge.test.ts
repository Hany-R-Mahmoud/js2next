import { describe, expect, it } from 'vitest';
import { challenges } from './challenges';
import { learnReactChallenges } from './learn-react-challenge-bridge';

describe('learn-react challenge bridge', () => {
  it('preserves the ten-level challenge ladder in canonical routes', () => {
    const slugs = new Set(challenges.map((challenge) => challenge.slug));
    expect(learnReactChallenges).toHaveLength(10);
    expect(new Set(learnReactChallenges.map((challenge) => challenge.slug)).size).toBe(10);
    expect(learnReactChallenges.every((challenge) => slugs.has(challenge.slug))).toBe(true);
    expect(new Set(learnReactChallenges.map((challenge) => challenge.level))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
    expect(learnReactChallenges.every((challenge) => challenge.hints.length > 0 && challenge.acceptanceCriteria.length > 0)).toBe(true);
  });
});
