import type { CanonicalContentRecord } from '@/lib/content/catalog';
import type { UnifiedProfile } from './types';
import { recommendNextContent, type ContentRecommendation } from './recommendations';

export interface DailyPackage {
  readonly date: string;
  readonly recommendation: ContentRecommendation;
  readonly lesson: CanonicalContentRecord;
  readonly challenge: CanonicalContentRecord | null;
  readonly qa: CanonicalContentRecord | null;
  readonly practice: CanonicalContentRecord | null;
}

export function buildDailyPackage(
  profile: UnifiedProfile,
  records: readonly CanonicalContentRecord[],
  now = new Date(),
): DailyPackage | null {
  const recommendation = recommendNextContent(profile, records, now);
  if (!recommendation) return null;

  const lesson = records.find((record) => record.id === recommendation.id && record.kind === 'lesson');
  if (!lesson) return null;

  return {
    date: now.toISOString().slice(0, 10),
    recommendation,
    lesson,
    challenge: relatedRecord(records, 'challenge', lesson),
    qa: relatedRecord(records, 'qa', lesson),
    practice: relatedRecord(records, 'practice', lesson),
  };
}

function relatedRecord(
  records: readonly CanonicalContentRecord[],
  kind: CanonicalContentRecord['kind'],
  lesson: CanonicalContentRecord,
): CanonicalContentRecord | null {
  const candidates = records.filter((record) => record.kind === kind);
  return candidates.find((record) => record.topicId === lesson.topicId) ?? null;
}
