import { describe, expect, it } from 'vitest';
import type { CanonicalContentRecord } from '@/lib/content/catalog';
import type { UnifiedProfile } from './types';
import { recommendNextContent } from './recommendations';

const now = new Date('2026-07-15T00:00:00.000Z');
const records: readonly CanonicalContentRecord[] = [
  { schemaVersion: 1, id: 'lesson:due-topic', kind: 'lesson', slug: 'due-topic', title: 'Due topic', topicId: 'due-topic', level: 'beginner', tags: [], sourceMetadata: [] },
  { schemaVersion: 1, id: 'lesson:weak-topic', kind: 'lesson', slug: 'weak-topic', title: 'Weak topic', topicId: 'weak-topic', level: 'beginner', tags: [], sourceMetadata: [] },
  { schemaVersion: 1, id: 'lesson:new-topic', kind: 'lesson', slug: 'new-topic', title: 'New topic', topicId: 'new-topic', level: 'beginner', tags: [], sourceMetadata: [] },
];

const profile: UnifiedProfile = {
  version: 3,
  name: 'Ada',
  level: 'beginner',
  diagnosticDone: true,
  strengths: [],
  weaknesses: [],
  goals: [],
  priorKnowledge: [],
  preferredStyle: 'active',
  communicationStyle: 'direct',
  paceMode: 'standard',
  diagnosticAnswers: [],
  masteryEstimates: { 'weak-topic': 0.3 },
  confidenceByTopic: { 'weak-topic': 0.4 },
  masteryRecords: {
    'weak-topic': {
      topicId: 'weak-topic', mastery: 0.3, confidence: 0.4, lastReviewed: now.toISOString(),
      attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '2026-07-20T00:00:00.000Z',
    },
  },
  completedTopics: [],
  reviewSchedule: [{ topicId: 'due-topic', dueAt: '2026-07-14T00:00:00.000Z', intervalDays: 1 }],
  challengeProgress: {},
  lessonProgress: {},
  earnedCapabilities: [],
  streakDays: 0,
  lastActiveAt: now.toISOString(),
  lastActiveDate: '2026-07-15',
};

describe('adaptive content recommendation', () => {
  it('prioritizes due review and explains why it is next', () => {
    expect(recommendNextContent(profile, records, now)).toEqual({
      id: 'lesson:due-topic',
      kind: 'lesson',
      topicId: 'due-topic',
      reason: 'due-review',
      priority: 3,
      why: 'Review due-topic; it is due now.',
    });
  });

  it('falls back to weakest and then unstarted content', () => {
    const withoutDue = { ...profile, reviewSchedule: [] };
    expect(recommendNextContent(withoutDue, records, now)?.reason).toBe('weak-topic');
    const withoutWeak = {
      ...withoutDue,
      masteryRecords: {},
      masteryEstimates: {},
      confidenceByTopic: {},
    };
    expect(recommendNextContent(withoutWeak, records, now)?.reason).toBe('new-topic');
  });

  it('returns no recommendation when every lesson is mastered', () => {
    const mastered = {
      ...profile,
      reviewSchedule: [],
      masteryRecords: Object.fromEntries(records.map((record) => [record.topicId, {
        topicId: record.topicId, mastery: 0.9, confidence: 0.9, lastReviewed: now.toISOString(),
        attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '2026-07-20T00:00:00.000Z',
      }])),
    };
    expect(recommendNextContent(mastered, records, now)).toBeNull();
  });
});
