import type { BestPractice, Challenge, Lesson, QAItem, TopicFamily } from '@/types';

export interface TopicModule {
  readonly id: string;
  readonly lesson: Lesson;
  readonly challenges: readonly Challenge[];
  readonly qa: readonly QAItem[];
  readonly practices: readonly BestPractice[];
  readonly meta: {
    readonly topicFamily: TopicFamily;
    readonly level: Lesson['level'];
    readonly title: string;
  };
}
