import type { Question, TrackId } from '@/domain/assessment';

export type PracticeSet = {
  readonly ownerId: string;
  readonly kind: 'topic-practice' | 'module-practice';
  readonly trackId: TrackId;
  readonly title: string;
  readonly questions: readonly Question[];
};
