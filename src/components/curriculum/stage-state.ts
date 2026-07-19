import type { Module, Topic } from '@/domain/curriculum';
import type { ProgressState, TopicProgress } from '@/domain/progression/types';

export type TopicStageId = 'overview' | 'learn' | 'practice' | 'check' | 'reflect';
export type StageStatus = 'current' | 'done' | 'available' | 'locked';

export interface StageState<T extends string> {
  readonly id: T;
  readonly status: StageStatus;
  readonly lockReason?: string;
}

export interface ModuleStageSnapshot {
  readonly requiredTopics: readonly Pick<Topic, 'id'>[];
  readonly state: ProgressState;
  readonly reviewPercent: number;
}

type StageStatusValue = Pick<StageState<string>, 'status' | 'lockReason'>;

const status = (done: boolean, locked = false, lockReason?: string): StageStatusValue => {
  if (locked) return { status: 'locked', ...(lockReason ? { lockReason } : {}) };
  return { status: done ? 'done' : 'available' };
};

export function topicStageStates(progress: TopicProgress | undefined): readonly StageState<TopicStageId>[] {
  const lessonCompleted = progress?.lessonCompleted === true;
  const attemptedQuiz = (progress?.quizAttempts.length ?? 0) > 0;
  const mastered = (progress?.masteryPercent ?? 0) >= 80;
  return [
    { id: 'overview', ...status(lessonCompleted) },
    { id: 'learn', ...status(lessonCompleted) },
    { id: 'practice', ...status(attemptedQuiz, !lessonCompleted, 'Complete Learn first') },
    { id: 'check', ...status(mastered, !attemptedQuiz, 'Complete Practice first') },
    { id: 'reflect', ...status(mastered, !mastered, 'Reach 80% mastery first') },
  ];
}

export function initialTopicStage(progress: TopicProgress | undefined): TopicStageId {
  if ((progress?.masteryPercent ?? 0) >= 80) return 'reflect';
  if ((progress?.quizAttempts.length ?? 0) > 0) return 'check';
  if (progress?.lessonCompleted) return 'practice';
  return 'overview';
}

export function moduleStageStates(snapshot: ModuleStageSnapshot): readonly StageState<'overview' | 'learn' | 'practice' | 'check' | 'reflect'>[] {
  const requiredProgress = snapshot.requiredTopics.map((topic) => snapshot.state.topicProgress[topic.id]);
  const started = requiredProgress.some((progress) => progress?.lessonCompleted === true || (progress?.quizAttempts.length ?? 0) > 0);
  const learned = requiredProgress.every((progress) => progress?.lessonCompleted === true);
  const mastered = requiredProgress.every((progress) => (progress?.masteryPercent ?? 0) >= 80);
  const remaining = requiredProgress.filter((progress) => (progress?.masteryPercent ?? 0) < 80).length;
  return [
    { id: 'overview', ...status(started) },
    { id: 'learn', ...status(learned) },
    { id: 'practice', ...status(mastered, !started, 'Start a required topic first') },
    { id: 'check', ...status(snapshot.reviewPercent >= 80, !mastered, `${remaining} required topic${remaining === 1 ? '' : 's'} need mastery`) },
    { id: 'reflect', ...status(mastered && snapshot.reviewPercent >= 80, !mastered || snapshot.reviewPercent < 80, !mastered ? `${remaining} required topic${remaining === 1 ? '' : 's'} need mastery` : 'Pass the module check at 80%') },
  ];
}

export function initialModuleStage(snapshot: ModuleStageSnapshot): 'overview' | 'learn' | 'practice' | 'check' | 'reflect' {
  const requiredProgress = snapshot.requiredTopics.map((topic) => snapshot.state.topicProgress[topic.id]);
  const mastered = requiredProgress.every((progress) => (progress?.masteryPercent ?? 0) >= 80);
  if (mastered && snapshot.reviewPercent >= 80) return 'reflect';
  if (mastered) return 'check';
  if (requiredProgress.some((progress) => progress?.lessonCompleted === true)) return 'practice';
  return 'overview';
}

export function nextRequiredTopic(module: Module, state: ProgressState): Topic | undefined {
  return module.topics.find((topic) => topic.required && (state.topicProgress[topic.id]?.masteryPercent ?? 0) < 80);
}
