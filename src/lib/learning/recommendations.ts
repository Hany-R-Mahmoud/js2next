import type { CanonicalContentRecord } from '@/lib/content/catalog';
import type { UnifiedProfile } from './types';

export type RecommendationReason = 'due-review' | 'weak-topic' | 'new-topic';

export interface ContentRecommendation {
  readonly id: string;
  readonly kind: 'lesson';
  readonly topicId: string;
  readonly reason: RecommendationReason;
  readonly priority: 1 | 2 | 3;
  readonly why: string;
}

export function recommendNextContent(
  profile: UnifiedProfile,
  records: readonly CanonicalContentRecord[],
  now = new Date(),
): ContentRecommendation | null {
  const lessons = records.filter((record): record is CanonicalContentRecord & { kind: 'lesson' } => record.kind === 'lesson');
  const due = profile.reviewSchedule
    .filter((item) => new Date(item.dueAt) <= now)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
    .map((item) => lessons.find((lesson) => lesson.topicId === item.topicId))
    .find((lesson): lesson is (typeof lessons)[number] => lesson !== undefined);
  if (due) {
    return {
      id: due.id,
      kind: 'lesson',
      topicId: due.topicId,
      reason: 'due-review',
      priority: 3,
      why: `Review ${due.topicId}; it is due now.`,
    };
  }

  const weak = lessons
    .map((lesson, index) => ({ lesson, index, mastery: profile.masteryRecords[lesson.topicId]?.mastery ?? profile.masteryEstimates[lesson.topicId] }))
    .filter((entry): entry is typeof entry & { mastery: number } => entry.mastery !== undefined && entry.mastery < 0.8)
    .sort((a, b) => a.mastery - b.mastery || a.index - b.index)[0];
  if (weak) {
    return {
      id: weak.lesson.id,
      kind: 'lesson',
      topicId: weak.lesson.topicId,
      reason: 'weak-topic',
      priority: 2,
      why: `Strengthen ${weak.lesson.topicId}; mastery is ${Math.round(weak.mastery * 100)}%.`,
    };
  }

  const next = lessons.find((lesson) => profile.masteryRecords[lesson.topicId] === undefined && profile.masteryEstimates[lesson.topicId] === undefined);
  return next
    ? {
      id: next.id,
      kind: 'lesson',
      topicId: next.topicId,
      reason: 'new-topic',
      priority: 1,
      why: `Start ${next.topicId}; it has no recorded mastery.`,
    }
    : null;
}
