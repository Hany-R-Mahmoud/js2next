import { describe, expect, it } from 'vitest';
import type { LearningEvent, UnifiedProfile } from './types';
import { appendLearningEvent, buildReviewQueue } from './adaptation';

const now = new Date('2026-07-15T00:00:00.000Z');
const profile: UnifiedProfile = {
  version: 3, name: 'Ada', level: 'beginner', diagnosticDone: true,
  strengths: [], weaknesses: [], goals: [], priorKnowledge: [], preferredStyle: 'active',
  communicationStyle: 'direct', paceMode: 'standard', diagnosticAnswers: [],
  masteryEstimates: { due: 0.7, uncertain: 0.7, weak: 0.3 },
  confidenceByTopic: { due: 0.8, uncertain: 0.3, weak: 0.8 },
  masteryRecords: {
    due: { topicId: 'due', mastery: 0.7, confidence: 0.8, lastReviewed: now.toISOString(), attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '2026-07-14T00:00:00.000Z' },
    uncertain: { topicId: 'uncertain', mastery: 0.7, confidence: 0.3, lastReviewed: now.toISOString(), attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '2026-07-20T00:00:00.000Z' },
    weak: { topicId: 'weak', mastery: 0.3, confidence: 0.8, lastReviewed: now.toISOString(), attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '2026-07-20T00:00:00.000Z' },
  },
  completedTopics: [], reviewSchedule: [], challengeProgress: {}, lessonProgress: {}, earnedCapabilities: [],
  streakDays: 0, lastActiveAt: now.toISOString(), lastActiveDate: '2026-07-15',
};

describe('adaptive learning signals', () => {
  it('orders due, uncertain, and weak topics with explicit reasons', () => {
    expect(buildReviewQueue(profile, now)).toEqual([
      expect.objectContaining({ topicId: 'due', reason: 'due-review', priority: 3 }),
      expect.objectContaining({ topicId: 'uncertain', reason: 'low-confidence', priority: 2 }),
      expect.objectContaining({ topicId: 'weak', reason: 'weak-mastery', priority: 1 }),
    ]);
  });

  it('keeps only the newest bounded learning events', () => {
    const first: LearningEvent = {
      type: 'challenge-attempted', topicId: 'closures', challengeId: 'c-1', confidence: 0.2,
      passed: false, hintsUsed: 1, occurredAt: now.toISOString(),
    };
    const second: LearningEvent = { ...first, challengeId: 'c-2', occurredAt: '2026-07-16T00:00:00.000Z' };
    const next = appendLearningEvent({ ...profile, learningEvents: [first] }, second, 1);
    expect(next.learningEvents).toEqual([second]);
    expect(appendLearningEvent({ ...profile, learningEvents: [first] }, second, 0).learningEvents).toEqual([]);
  });

  it('includes explicitly flagged topics in review', () => {
    const flagged: UnifiedProfile = {
      ...profile,
      topicProgress: {
        weak: {
          topicId: 'weak', stage: 'complete', completedChallengeIds: [],
          confirmedQaIds: [], manualReview: true, lastVisited: now.toISOString(),
        },
      },
    };
    expect(buildReviewQueue(flagged, now)).toContainEqual(expect.objectContaining({ topicId: 'weak', reason: 'manual-review' }));
  });

  it('does not immediately requeue low-confidence work after a completed review', () => {
    const reviewed: UnifiedProfile = {
      ...profile,
      topicProgress: {
        uncertain: {
          topicId: 'uncertain', stage: 'complete', completedChallengeIds: [],
          confirmedQaIds: [], manualReview: false, lastVisited: now.toISOString(),
          lastReviewCompletedAt: now.toISOString(),
        },
      },
    };
    expect(buildReviewQueue(reviewed, now)).not.toContainEqual(expect.objectContaining({ topicId: 'uncertain' }));
  });
});
