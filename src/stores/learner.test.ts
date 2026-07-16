import { describe, expect, it } from 'vitest';
import { useLearnerStore } from './learner';

describe('canonical learner store', () => {
  it('does not expose duplicate top-level learner state', () => {
    const state = useLearnerStore.getState();
    expect(state).not.toHaveProperty('profile');
    expect(state).not.toHaveProperty('mastery');
    expect(state).not.toHaveProperty('challengeProgress');
    expect(state).toHaveProperty('canonicalProfile');
  });

  it('writes profile and mastery changes to the canonical profile', () => {
    const store = useLearnerStore.getState();
    store.resetProgress();
    store.setProfile({ name: 'Ada', level: 'advanced' });
    store.updateMastery('closures', { mastery: 0.8, confidence: 0.9 });

    const profile = useLearnerStore.getState().canonicalProfile;
    expect(profile.name).toBe('Ada');
    expect(profile.level).toBe('advanced');
    expect(profile.masteryEstimates.closures).toBe(0.8);
    expect(profile.masteryRecords.closures?.mastery).toBe(0.8);

    store.resetProgress();
  });

  it('keeps adaptive events and exposes prioritized review details', () => {
    const store = useLearnerStore.getState();
    store.resetProgress();
    store.recordLearningEvent({
      type: 'lesson-completed',
      topicId: 'closures',
      confidence: 0.4,
      mastery: 0.5,
      occurredAt: '2026-07-15T00:00:00.000Z',
    });
    store.updateMastery('closures', { mastery: 0.4, confidence: 0.4 });

    const profile = useLearnerStore.getState().canonicalProfile;
    expect(profile.learningEvents?.[0]?.type).toBe('lesson-completed');
    expect(store.getReviewQueueDetails()[0]).toEqual(expect.objectContaining({
      topicId: 'closures',
      reason: 'due-review',
    }));

    store.resetProgress();
  });

  it('persists the canonical topic loop and manual review flag', () => {
    const store = useLearnerStore.getState();
    store.resetProgress();
    store.saveTopicProgress({
      topicId: 'state-and-events',
      stage: 'practice',
      completedChallengeIds: ['challenge:implement-counter'],
      confirmedQaIds: [],
      manualReview: false,
      lastVisited: '2026-07-15T00:00:00.000Z',
    });
    store.confirmQa('state-and-events', 'qa-11');
    store.setManualReview('state-and-events', true);

    const profile = useLearnerStore.getState().canonicalProfile;
    expect(profile.topicProgress?.['state-and-events']).toEqual(expect.objectContaining({
      stage: 'confirm',
      completedChallengeIds: ['challenge:implement-counter'],
      confirmedQaIds: ['qa-11'],
      manualReview: true,
    }));

    store.completeTopic('state-and-events', 85);
    expect(useLearnerStore.getState().canonicalProfile.topicProgress?.['state-and-events']?.stage).toBe('complete');
    expect(useLearnerStore.getState().canonicalProfile.completedTopics).toContain('state-and-events');
    expect(useLearnerStore.getState().canonicalProfile.streakDays).toBeGreaterThanOrEqual(1);
    store.resetProgress();
  });

  it('clears low-confidence review until the topic changes or becomes due again', () => {
    const store = useLearnerStore.getState();
    store.resetProgress();
    store.updateMastery('closures-in-javascript', { mastery: 0.3, confidence: 0.3 });
    expect(store.getReviewQueue()).toContain('closures-in-javascript');
    store.removeFromReviewQueue('closures-in-javascript');
    expect(store.getReviewQueue()).not.toContain('closures-in-javascript');
    store.resetProgress();
  });
});
