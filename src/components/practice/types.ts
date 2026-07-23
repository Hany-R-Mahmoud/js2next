import type { TrackId } from '@/domain/assessment';
import type { PublicQuestion } from '@/components/assessment/types';

export type PracticeSet = {
  readonly ownerId: string;
  readonly kind: 'topic-practice' | 'module-practice';
  readonly trackId: TrackId;
  readonly title: string;
  readonly questions: readonly PublicQuestion[];
};
