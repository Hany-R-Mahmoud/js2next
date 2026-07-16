import { describe, expect, it } from 'vitest';
import { createLearnerBackup, importLearnerBackup, serializeLearnerBackup } from './backup';
import type { UnifiedProfile } from './types';

const profile: UnifiedProfile = {
  version: 3,
  name: 'Ada',
  level: 'advanced',
  diagnosticDone: true,
  strengths: [],
  weaknesses: [],
  goals: ['Build durable apps'],
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
  topicProgress: {},
  earnedCapabilities: ['react-core'],
  streakDays: 2,
  lastActiveAt: '2026-07-16T00:00:00.000Z',
  lastActiveDate: '2026-07-16',
};

const settings = { reducedMotion: true, highContrast: false, fontSize: 'large' as const };

describe('learner backup', () => {
  it('round-trips learner and settings state', () => {
    const backup = createLearnerBackup(profile, settings);
    const imported = importLearnerBackup(JSON.stringify(backup), '2026-07-16T00:00:00.000Z');
    expect(imported).toEqual(backup);
  });

  it('serializes a versioned envelope', () => {
    expect(JSON.parse(serializeLearnerBackup(profile, settings))).toEqual({ version: 1, learner: profile, settings });
  });

  it('rejects malformed input', () => {
    expect(importLearnerBackup('{bad json', '2026-07-16T00:00:00.000Z')).toBeNull();
    expect(importLearnerBackup(JSON.stringify({ version: 1, learner: {} }), '2026-07-16T00:00:00.000Z')).toBeNull();
  });

  it('imports legacy learner-only data with default settings', () => {
    const imported = importLearnerBackup(JSON.stringify({ learner: profile }), '2026-07-16T00:00:00.000Z');
    expect(imported?.learner).toEqual(profile);
    expect(imported?.settings).toEqual({ reducedMotion: false, highContrast: false, fontSize: 'normal' });
  });
});
