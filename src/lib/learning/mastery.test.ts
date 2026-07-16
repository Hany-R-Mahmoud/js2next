import { describe, expect, it } from 'vitest';
import { scoreChallenge, updateMasteryFromChallenge } from './mastery';
import type { UnifiedChallenge, UnifiedProfile } from './types';

const baseProfile: UnifiedProfile = {
  version: 3, name: 'Test learner', level: 'beginner', diagnosticDone: true,
  strengths: [], weaknesses: [], goals: [], priorKnowledge: [], preferredStyle: 'active',
  communicationStyle: 'socratic', paceMode: 'standard', diagnosticAnswers: [],
  masteryEstimates: { closures: 0.4 }, confidenceByTopic: {}, masteryRecords: {}, completedTopics: [],
  reviewSchedule: [], challengeProgress: {}, lessonProgress: {}, earnedCapabilities: [],
  streakDays: 0, lastActiveAt: '2026-07-14T00:00:00.000Z', lastActiveDate: null,
};

describe('unified challenge engine', () => {
  it('scores code answers by normalized required snippets', () => {
    const challenge: UnifiedChallenge = {
      id: 'closure-fix', topicId: 'closures', level: 2, checkType: 'code-contains',
      requiredSnippets: ['setCount(c => c + 1)'],
    };
    expect(scoreChallenge(challenge, 'setCount( c => c + 1 )')).toBe(true);
    expect(scoreChallenge(challenge, 'setCount(count + 1)')).toBe(false);
  });

  it('turns a failed attempt into a review item', () => {
    const challenge: UnifiedChallenge = {
      id: 'closure-choice', topicId: 'closures', level: 1, checkType: 'choice', correctIndex: 1,
    };
    const next = updateMasteryFromChallenge(baseProfile, challenge, {
      challengeId: challenge.id, attempts: 1, hintsUsed: 0, revealed: false,
      passed: false, confidence: 0.8, updatedAt: '2026-07-14T00:00:00.000Z',
    }, new Date('2026-07-14T00:00:00.000Z'));
    expect(next.masteryEstimates.closures).toBeLessThan(0.4);
    expect(next.reviewSchedule[0]?.intervalDays).toBe(1);
    expect(next.challengeProgress[challenge.id]?.passed).toBe(false);
  });

  it('does not treat a keyword as present inside a larger word', () => {
    const challenge: UnifiedChallenge = {
      id: 'state-terms', topicId: 'state', level: 1, checkType: 'free-text',
      freeTextKeywords: ['state', 'render'],
    };
    expect(scoreChallenge(challenge, 'stateless render')).toBe(false);
    expect(scoreChallenge(challenge, 'state causes a render')).toBe(true);
  });
});
