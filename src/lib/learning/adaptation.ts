import type { LearningEvent, UnifiedProfile } from './types';

export type ReviewReason = 'due-review' | 'manual-review' | 'low-confidence' | 'weak-mastery';

export interface ReviewQueueItem {
  readonly topicId: string;
  readonly dueAt: string;
  readonly mastery: number;
  readonly confidence: number;
  readonly reason: ReviewReason;
  readonly priority: 1 | 2 | 3;
}

const DEFAULT_EVENT_LIMIT = 50;

export function appendLearningEvent(
  profile: UnifiedProfile,
  event: LearningEvent,
  limit = DEFAULT_EVENT_LIMIT,
): UnifiedProfile {
  const boundedLimit = Math.max(0, Math.floor(limit));
  const events = boundedLimit === 0
    ? []
    : [...(profile.learningEvents ?? []), normalizeLearningEvent(event)].slice(-boundedLimit);
  return { ...profile, learningEvents: events };
}

export function buildReviewQueue(profile: UnifiedProfile, now = new Date()): readonly ReviewQueueItem[] {
  const scheduleByTopic = new Map(profile.reviewSchedule.map((item) => [item.topicId, item]));
  return Object.values(profile.masteryRecords)
    .flatMap((record) => {
      const scheduled = scheduleByTopic.get(record.topicId);
      const dueAt = scheduled?.dueAt ?? record.nextReviewDate;
      const due = new Date(dueAt) <= now;
      const manual = profile.topicProgress?.[record.topicId]?.manualReview === true;
      const lastReviewCompletedAt = profile.topicProgress?.[record.topicId]?.lastReviewCompletedAt;
      const changedSinceReview = !lastReviewCompletedAt || Date.parse(record.lastReviewed) > Date.parse(lastReviewCompletedAt);
      const reason: ReviewReason | null = manual
        ? 'manual-review'
        : due
        ? 'due-review'
        : changedSinceReview && record.confidence < 0.55
          ? 'low-confidence'
          : changedSinceReview && record.mastery < 0.5
            ? 'weak-mastery'
            : null;
      if (!reason) return [];
      return [{
        topicId: record.topicId,
        dueAt,
        mastery: record.mastery,
        confidence: record.confidence,
        reason,
        priority: priorityFor(reason),
      }];
    })
    .sort((a, b) => b.priority - a.priority || a.dueAt.localeCompare(b.dueAt) || a.topicId.localeCompare(b.topicId));
}

function priorityFor(reason: ReviewReason): ReviewQueueItem['priority'] {
  switch (reason) {
    case 'due-review':
      return 3;
    case 'manual-review':
      return 2;
    case 'low-confidence':
      return 2;
    case 'weak-mastery':
      return 1;
    default:
      return assertNever(reason);
  }
}

function normalizeLearningEvent(event: LearningEvent): LearningEvent {
  switch (event.type) {
    case 'lesson-completed':
      return { ...event, confidence: clamp(event.confidence), mastery: clamp(event.mastery) };
    case 'challenge-attempted':
      return { ...event, confidence: clamp(event.confidence), hintsUsed: Math.max(0, event.hintsUsed) };
    case 'qa-confirmed':
      return { ...event, confidence: clamp(event.confidence) };
    case 'topic-completed':
      return { ...event, confidence: clamp(event.confidence), mastery: clamp(event.mastery) };
    default:
      return assertNever(event);
  }
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function assertNever(value: never): never {
  throw new Error(`Unhandled learning event: ${String(value)}`);
}
