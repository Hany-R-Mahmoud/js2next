import { describe, expect, it } from 'vitest';
import { getChallengeLadderRubric, toUnifiedChallenge } from './challenge-adapter';
import type { Challenge } from '@/types';

const baseChallenge: Challenge = {
  slug: 'fix-stale-closure', title: 'Typed choice', level: 2, topicFamily: 'foundations',
  scenario: 'Choose the sound answer.', constraints: [], acceptanceCriteria: [], hints: [],
  expectedReasoning: 'The selected answer matches the model.', commonWrongPaths: [],
  answerExplanation: 'The answer is explicit.', followUpVariation: 'Explain the trade-off.',
  checkType: 'choice', prompt: 'Choose one.', options: ['No', 'Yes'], correctIndex: 1,
};

describe('challenge adapter', () => {
  it('creates a canonical challenge for typed content', () => {
    const unified = toUnifiedChallenge(baseChallenge);

    expect(unified).toEqual({
      id: 'challenge:fix-stale-closure', topicId: 'closures-in-javascript', level: 2, checkType: 'choice', correctIndex: 1,
    });
  });

  it('leaves reflection-only challenges unscored', () => {
    const unified = toUnifiedChallenge({ ...baseChallenge, checkType: undefined });

    expect(unified).toBeNull();
  });

  it('uses the owning lesson rather than the broad topic family', () => {
    const unified = toUnifiedChallenge({ ...baseChallenge, slug: 'learn-react-ch-js-1' });

    expect(unified?.topicId).toBe('deep-dive-async-immutability');
  });

  it('projects existing ladder fields into a stable rubric', () => {
    const rubric = getChallengeLadderRubric({
      ...baseChallenge,
      level: 7,
      acceptanceCriteria: ['Explain the trade-off'],
      hints: [{ stage: 1, text: 'Start with the boundary.' }],
      commonWrongPaths: ['Skip authorization'],
    });

    expect(rubric).toEqual({
      level: 7,
      criteria: ['Explain the trade-off'],
      hints: [{ stage: 1, text: 'Start with the boundary.' }],
      expectedReasoning: 'The selected answer matches the model.',
      commonWrongPaths: ['Skip authorization'],
    });
  });
});
