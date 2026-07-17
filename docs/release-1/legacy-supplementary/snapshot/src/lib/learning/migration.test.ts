import { describe, expect, it } from 'vitest';
import { isUnifiedProfile, migrateLearnReactProfile, migrateLegacyLearnerState, migrateLegacyProfile, toLearnerProfile } from './migration';
import type { LearnerProfile } from '@/types';

describe('legacy learner migration', () => {
  it('normalizes the old 0-100 mastery scale to 0-1', () => {
    const migrated = migrateLegacyLearnerState({
      profile: { name: 'Ada', level: 'advanced', diagnosticComplete: true },
      mastery: { closures: { mastery: 80, confidence: 0.7, nextReviewDate: '2026-07-15T00:00:00.000Z' } },
      streak: 3, lastActive: '2026-07-14T12:00:00.000Z',
    }, '2026-07-14T12:00:00.000Z');
    expect(migrated?.masteryEstimates.closures).toBe(0.8);
    expect(migrated?.masteryRecords.closures?.mastery).toBe(0.8);
    expect(migrated?.completedTopics).toContain('closures');
    expect(migrated?.lastActiveDate).toBe('2026-07-14');
  });

  it('rejects malformed persisted state without throwing', () => {
    expect(migrateLegacyLearnerState({ mastery: {} }, '2026-07-14T00:00:00.000Z')).toBeNull();
    expect(migrateLegacyLearnerState(null, '2026-07-14T00:00:00.000Z')).toBeNull();
  });

  it('does not reinterpret legacy confidence as mastery', () => {
    const profile: LearnerProfile = {
      name: 'Ada', level: 'advanced', strengths: [], weaknesses: [], goals: [], priorKnowledge: [],
      preferredStyle: 'active', communicationStyle: 'direct', paceMode: 'standard',
      confidence: { closures: 0.9 }, diagnosticComplete: true,
    };
    const migrated = migrateLegacyProfile(profile, '2026-07-14T00:00:00.000Z');
    expect(migrated.masteryEstimates).toEqual({});
    expect(migrated.confidenceByTopic.closures).toBe(0.9);
    expect(toLearnerProfile(migrated).diagnosticComplete).toBe(true);
  });

  it('preserves progress records added to the legacy persisted envelope', () => {
    const migrated = migrateLegacyLearnerState({
      profile: { name: 'Ada', level: 'beginner', diagnosticComplete: false },
      challengeProgress: {
        closures: { challengeId: 'closures', attempts: 1, hintsUsed: 0, revealed: false, passed: false, confidence: 0.5, updatedAt: '2026-07-14T00:00:00.000Z' },
      },
      lessonProgress: {
        closures: {
          topicId: 'closures',
          stepIndex: 2,
          diagnosticAnswered: false,
          completed: false,
          confidence: 0.2,
          lastVisited: '2026-07-14T00:00:00.000Z',
          answerProgress: {
            question: { answer: 'A', attempts: 1, hintsRequested: 0, revealed: false },
          },
        },
      },
    }, '2026-07-14T00:00:00.000Z');
    expect(migrated?.challengeProgress['challenge:closures']?.attempts).toBe(1);
    expect(migrated?.lessonProgress.closures?.stepIndex).toBe(2);
    expect(migrated?.lessonProgress.closures?.answerProgress?.question.answer).toBe('A');
  });

  it('imports learn-react v1 progress into canonical IDs and normalized mastery', () => {
    const migrated = migrateLearnReactProfile({
      version: 1,
      name: 'Ada',
      level: 'intermediate',
      goals: ['Ship a production app'],
      priorKnowledge: ['JavaScript'],
      preferredStyle: 'causal',
      diagnosticDone: true,
      confidenceByTopic: { 'js-async-immutability': 0.7 },
      masteryEstimates: { 'js-async-immutability': 0.6 },
      completedTopics: [],
      challengeProgress: {
        'ch-js-1': {
          challengeId: 'ch-js-1', attempts: 1, hintsUsed: 0, revealed: false,
          passed: true, confidence: 0.8, updatedAt: '2026-07-14T00:00:00.000Z',
        },
      },
      lessonProgress: {},
      streakDays: 2,
      updatedAt: '2026-07-14T00:00:00.000Z',
    }, '2026-07-15T00:00:00.000Z');

    expect(migrated?.masteryEstimates['deep-dive-async-immutability']).toBe(0.6);
    expect(migrated?.confidenceByTopic['deep-dive-async-immutability']).toBe(0.7);
    expect(migrated?.challengeProgress['challenge:learn-react-ch-js-1']?.passed).toBe(true);
    expect(migrated?.lastActiveDate).toBe('2026-07-14');
  });

  it('rejects mismatched progress keys and incomplete canonical profiles', () => {
    const migrated = migrateLegacyLearnerState({
      profile: { name: 'Ada', level: 'beginner', diagnosticComplete: false },
      challengeProgress: { closures: { challengeId: 'other', attempts: 1, hintsUsed: 0, revealed: false, passed: false, confidence: 0.5, updatedAt: '2026-07-14T00:00:00.000Z' } },
    }, '2026-07-14T00:00:00.000Z');
    expect(migrated?.challengeProgress).toEqual({});
    expect(isUnifiedProfile({ version: 2, name: 'Ada', masteryEstimates: {}, challengeProgress: {}, lessonProgress: {} })).toBe(false);
  });
});
