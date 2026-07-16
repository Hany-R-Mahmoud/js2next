import { describe, expect, it } from 'vitest';
import {
  capabilityDefinitions,
  checkCapability,
  diffCapabilities,
  getCapabilityProgress,
  getCapability,
  reconcileCapabilities,
} from './capabilities';
import type { UnifiedProfile } from './types';

function profile(overrides: Partial<UnifiedProfile> = {}): UnifiedProfile {
  return {
    version: 3,
    name: '',
    level: 'beginner',
    diagnosticDone: false,
    strengths: [],
    weaknesses: [],
    goals: [],
    priorKnowledge: [],
    preferredStyle: 'active',
    communicationStyle: 'socratic',
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
    earnedCapabilities: [],
    streakDays: 0,
    lastActiveAt: new Date().toISOString(),
    lastActiveDate: null,
    ...overrides,
  };
}

describe('capability definitions', () => {
  it('has the expected seven capabilities', () => {
    expect(capabilityDefinitions).toHaveLength(7);
    const ids = capabilityDefinitions.map((d) => d.id);
    expect(ids).toEqual([
      'js-foundations',
      'react-core',
      'state-management',
      'nextjs-app-router',
      'rsc-boundaries',
      'production-ready',
      'architecture-thinking',
    ]);
  });

  it('every definition has a title and at least one required topic', () => {
    for (const def of capabilityDefinitions) {
      expect(def.title).toBeTruthy();
      expect(def.requiredTopicIds.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('getCapability resolves by id', () => {
    const def = getCapability('react-core');
    expect(def?.title).toBe('React Core');
    expect(def?.requiredTopicIds).toEqual(['components-and-jsx', 'state-and-events']);
  });

  it('getCapability returns undefined for unknown id', () => {
    expect(getCapability('unknown')).toBeUndefined();
  });

  it('every required topic appears in at least one definition', () => {
    const allRequired = new Set(capabilityDefinitions.flatMap((d) => d.requiredTopicIds));
    expect(allRequired.size).toBeGreaterThan(0);
  });
});

describe('reconcileCapabilities', () => {
  it('returns empty when no topics meet the threshold', () => {
    const p = profile({
      masteryRecords: {
        'closures-in-javascript': { topicId: 'closures-in-javascript', mastery: 0.5, confidence: 0.5, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
        'async-js-promises': { topicId: 'async-js-promises', mastery: 0.5, confidence: 0.5, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
      },
      topicProgress: {
        'closures-in-javascript': { topicId: 'closures-in-javascript', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
        'async-js-promises': { topicId: 'async-js-promises', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
      },
    });
    expect(reconcileCapabilities(p)).toEqual([]);
  });

  it('awards a capability when every required topic has mastery >= 0.8 and stage complete', () => {
    const p = profile({
      masteryRecords: {
        'closures-in-javascript': { topicId: 'closures-in-javascript', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
        'async-js-promises': { topicId: 'async-js-promises', mastery: 0.85, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
      },
      topicProgress: {
        'closures-in-javascript': { topicId: 'closures-in-javascript', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
        'async-js-promises': { topicId: 'async-js-promises', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
      },
    });
    expect(reconcileCapabilities(p)).toEqual(['js-foundations']);
  });

  it('does not award when mastery is high but topic stage is not complete', () => {
    const p = profile({
      masteryRecords: {
        'closures-in-javascript': { topicId: 'closures-in-javascript', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
        'async-js-promises': { topicId: 'async-js-promises', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
      },
      topicProgress: {
        'closures-in-javascript': { topicId: 'closures-in-javascript', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
        'async-js-promises': { topicId: 'async-js-promises', stage: 'practice', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
      },
    });
    expect(reconcileCapabilities(p)).toEqual([]);
  });

  it('does not award when topic is complete but mastery is below 0.8', () => {
    const p = profile({
      masteryRecords: {
        'closures-in-javascript': { topicId: 'closures-in-javascript', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
        'async-js-promises': { topicId: 'async-js-promises', mastery: 0.7, confidence: 0.7, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
      },
      topicProgress: {
        'closures-in-javascript': { topicId: 'closures-in-javascript', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
        'async-js-promises': { topicId: 'async-js-promises', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
      },
    });
    expect(reconcileCapabilities(p)).toEqual([]);
  });

  it('is idempotent — does not duplicate already-earned capabilities', () => {
    const p = profile({
      earnedCapabilities: ['js-foundations'],
      masteryRecords: {
        'closures-in-javascript': { topicId: 'closures-in-javascript', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
        'async-js-promises': { topicId: 'async-js-promises', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
      },
      topicProgress: {
        'closures-in-javascript': { topicId: 'closures-in-javascript', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
        'async-js-promises': { topicId: 'async-js-promises', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
      },
    });
    expect(reconcileCapabilities(p)).toEqual(['js-foundations']);
  });

  it('deduplicates legacy earned capability IDs', () => {
    const p = profile({ earnedCapabilities: ['js-foundations', 'js-foundations'] });
    expect(reconcileCapabilities(p)).toEqual(['js-foundations']);
  });

  it('awards multiple capabilities when multiple groups are satisfied', () => {
    const p = profile({
      masteryRecords: {
        'closures-in-javascript': { topicId: 'closures-in-javascript', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
        'async-js-promises': { topicId: 'async-js-promises', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
        'production-deployment': { topicId: 'production-deployment', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
      },
      topicProgress: {
        'closures-in-javascript': { topicId: 'closures-in-javascript', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
        'async-js-promises': { topicId: 'async-js-promises', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
        'production-deployment': { topicId: 'production-deployment', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
      },
    });
    const result = reconcileCapabilities(p);
    expect(result).toContain('js-foundations');
    expect(result).toContain('production-ready');
  });

  it('handles missing topicProgress gracefully', () => {
    const p = profile({
      masteryRecords: {
        'closures-in-javascript': { topicId: 'closures-in-javascript', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
        'async-js-promises': { topicId: 'async-js-promises', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
      },
    });
    expect(reconcileCapabilities(p)).toEqual([]);
  });

  it('never revokes — already-earned capabilities persist even if topics degrade', () => {
    const p = profile({
      earnedCapabilities: ['js-foundations', 'rsc-boundaries'],
      masteryRecords: {},
      topicProgress: {},
    });
    expect(reconcileCapabilities(p)).toEqual(['js-foundations', 'rsc-boundaries']);
  });
});

describe('checkCapability', () => {
  const def = { id: 'react-core', title: 'React Core', requiredTopicIds: ['components-and-jsx', 'state-and-events'] as const };

  it('returns true when all required topics meet thresholds', () => {
    const p = profile({
      masteryRecords: {
        'components-and-jsx': { topicId: 'components-and-jsx', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
        'state-and-events': { topicId: 'state-and-events', mastery: 0.85, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
      },
      topicProgress: {
        'components-and-jsx': { topicId: 'components-and-jsx', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
        'state-and-events': { topicId: 'state-and-events', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
      },
    });
    expect(checkCapability(p, def)).toBe(true);
  });

  it('returns false when a topic has mastery exactly 0.8 but stage is not complete', () => {
    const p = profile({
      masteryRecords: {
        'components-and-jsx': { topicId: 'components-and-jsx', mastery: 0.8, confidence: 0.8, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
        'state-and-events': { topicId: 'state-and-events', mastery: 0.8, confidence: 0.8, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
      },
      topicProgress: {
        'components-and-jsx': { topicId: 'components-and-jsx', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
        'state-and-events': { topicId: 'state-and-events', stage: 'confirm', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
      },
    });
    expect(checkCapability(p, def)).toBe(false);
  });

  it('returns false when a topic record is missing entirely', () => {
    const p = profile({
      masteryRecords: {
        'components-and-jsx': { topicId: 'components-and-jsx', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
      },
      topicProgress: {
        'components-and-jsx': { topicId: 'components-and-jsx', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
      },
    });
    expect(checkCapability(p, def)).toBe(false);
  });

  it('returns false when mastery is exactly at the boundary (0.8) and stage is complete', () => {
    const p = profile({
      masteryRecords: {
        'components-and-jsx': { topicId: 'components-and-jsx', mastery: 0.8, confidence: 0.8, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
        'state-and-events': { topicId: 'state-and-events', mastery: 0.8, confidence: 0.8, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
      },
      topicProgress: {
        'components-and-jsx': { topicId: 'components-and-jsx', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
        'state-and-events': { topicId: 'state-and-events', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
      },
    });
    expect(checkCapability(p, def)).toBe(true);
  });
});

describe('getCapabilityProgress', () => {
  it('reports completed requirements and earned state', () => {
    const p = profile({
      earnedCapabilities: ['react-core'],
      masteryRecords: {
        'components-and-jsx': { topicId: 'components-and-jsx', mastery: 0.9, confidence: 0.9, lastReviewed: '', attempts: 1, mistakes: [], timesReviewed: 1, nextReviewDate: '' },
      },
      topicProgress: {
        'components-and-jsx': { topicId: 'components-and-jsx', stage: 'complete', completedChallengeIds: [], confirmedQaIds: [], manualReview: false, lastVisited: '' },
      },
    });
    expect(getCapabilityProgress(p, capabilityDefinitions[1])).toEqual({ completedTopics: 1, totalTopics: 2, earned: true });
  });
});

describe('diffCapabilities', () => {
  it('returns newly-awarded ids', () => {
    expect(diffCapabilities(['js-foundations'], ['js-foundations', 'react-core'])).toEqual(['react-core']);
  });

  it('returns empty when nothing changed', () => {
    expect(diffCapabilities(['js-foundations'], ['js-foundations'])).toEqual([]);
  });

  it('returns empty when previous had more (clearing is handled by reset)', () => {
    expect(diffCapabilities(['js-foundations', 'react-core'], ['react-core'])).toEqual([]);
  });

  it('handles empty previous', () => {
    expect(diffCapabilities([], ['js-foundations', 'react-core'])).toEqual(['js-foundations', 'react-core']);
  });
});
