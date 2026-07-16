import { describe, expect, it } from 'vitest';
import type { CanonicalContentRecord } from '@/lib/content/catalog';
import type { UnifiedProfile } from './types';
import { buildDailyPackage } from './daily-package';

const now = new Date('2026-07-15T00:00:00.000Z');
const records: readonly CanonicalContentRecord[] = [
  { schemaVersion: 1, id: 'lesson:focus', kind: 'lesson', slug: 'focus', title: 'Focus', topicId: 'focus', topicFamily: 'nextjs-data', level: 'intermediate', tags: [], sourceMetadata: [] },
  { schemaVersion: 1, id: 'challenge:focus', kind: 'challenge', slug: 'focus-challenge', title: 'Focus challenge', topicId: 'focus', topicFamily: 'nextjs-data', level: 4, tags: [], sourceMetadata: [] },
  { schemaVersion: 1, id: 'qa:focus', kind: 'qa', slug: 'focus-qa', title: 'Focus question', topicId: 'focus', tags: [], sourceMetadata: [] },
  { schemaVersion: 1, id: 'practice:focus', kind: 'practice', slug: 'focus-practice', title: 'Focus practice', topicId: 'focus', tags: [], sourceMetadata: [] },
  { schemaVersion: 1, id: 'challenge:fallback', kind: 'challenge', slug: 'fallback-challenge', title: 'Fallback challenge', topicId: 'other', tags: [], sourceMetadata: [] },
  { schemaVersion: 1, id: 'qa:fallback', kind: 'qa', slug: 'fallback-qa', title: 'Fallback question', topicId: 'other', tags: [], sourceMetadata: [] },
  { schemaVersion: 1, id: 'practice:fallback', kind: 'practice', slug: 'fallback-practice', title: 'Fallback practice', topicId: 'other', tags: [], sourceMetadata: [] },
];

const profile: UnifiedProfile = {
  version: 3,
  name: 'Ada',
  level: 'intermediate',
  diagnosticDone: true,
  strengths: [],
  weaknesses: [],
  goals: [],
  priorKnowledge: [],
  preferredStyle: 'active',
  communicationStyle: 'direct',
  paceMode: 'standard',
  diagnosticAnswers: [],
  masteryEstimates: {},
  confidenceByTopic: {},
  masteryRecords: {},
  completedTopics: [],
  reviewSchedule: [],
  challengeProgress: {},
  lessonProgress: {},
  earnedCapabilities: [],
  streakDays: 0,
  lastActiveAt: now.toISOString(),
  lastActiveDate: '2026-07-15',
};

describe('daily learning package', () => {
  it('selects the adaptive lesson and exact-topic practice loop', () => {
    expect(buildDailyPackage(profile, records, now)).toMatchObject({
      date: '2026-07-15',
      recommendation: { id: 'lesson:focus', reason: 'new-topic' },
      lesson: { id: 'lesson:focus' },
      challenge: { id: 'challenge:focus' },
      qa: { id: 'qa:focus' },
      practice: { id: 'practice:focus' },
    });
  });

  it('returns no package when there is no lesson to recommend', () => {
    const mastered = {
      ...profile,
      masteryRecords: { focus: { topicId: 'focus', mastery: 0.9, confidence: 0.9, lastReviewed: now.toISOString(), attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '2026-07-20T00:00:00.000Z' } },
    };
    expect(buildDailyPackage(mastered, records, now)).toBeNull();
  });
});
