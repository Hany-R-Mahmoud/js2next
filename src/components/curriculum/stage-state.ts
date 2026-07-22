import type { Module, Topic } from '@/domain/curriculum';
import type { ProgressState, TopicProgress } from '@/domain/progression/types';

export type TopicStageId = 'learn' | 'practice' | 'check' | 'reflect';
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
  readonly practiceCompleted: boolean;
  readonly checkAttempted: boolean;
}

type StageStatusValue = Pick<StageState<string>, 'status' | 'lockReason'>;

const status = (done: boolean, locked = false, lockReason?: string): StageStatusValue => {
  if (locked) return { status: 'locked', ...(lockReason ? { lockReason } : {}) };
  return { status: done ? 'done' : 'available' };
};

export function topicStageStates(progress: TopicProgress | undefined, practiceCompleted: boolean): readonly StageState<TopicStageId>[] {
  const lessonCompleted = progress?.lessonCompleted === true;
  const attemptedQuiz = (progress?.quizAttempts.length ?? 0) > 0;
  const mastered = (progress?.masteryPercent ?? 0) >= 80;
  return [
    { id: 'learn', ...status(lessonCompleted) },
    { id: 'practice', ...status(practiceCompleted, !lessonCompleted, 'Complete Learn first') },
    { id: 'check', ...status(mastered, !practiceCompleted, 'Complete Practice first') },
    { id: 'reflect', ...status(mastered, !attemptedQuiz, 'Submit a Check first') },
  ];
}

export function initialTopicStage(progress: TopicProgress | undefined, practiceCompleted: boolean): TopicStageId {
  if ((progress?.masteryPercent ?? 0) >= 80) return 'reflect';
  if ((progress?.quizAttempts.length ?? 0) > 0) return (progress?.masteryPercent ?? 0) >= 80 ? 'reflect' : 'practice';
  if (practiceCompleted) return 'check';
  if (progress?.lessonCompleted) return 'practice';
  return 'learn';
}

export function moduleStageStates(snapshot: ModuleStageSnapshot): readonly StageState<'learn' | 'practice' | 'check' | 'reflect'>[] {
  const requiredProgress = snapshot.requiredTopics.map((topic) => snapshot.state.topicProgress[topic.id]);
  const learned = requiredProgress.every((progress) => progress?.lessonCompleted === true);
  const mastered = requiredProgress.every((progress) => (progress?.masteryPercent ?? 0) >= 80);
  const remaining = requiredProgress.filter((progress) => (progress?.masteryPercent ?? 0) < 80).length;
  return [
    { id: 'learn', ...status(learned) },
    { id: 'practice', ...status(snapshot.practiceCompleted, !requiredProgress.some((progress) => progress?.lessonCompleted === true), 'Start a required topic first') },
    { id: 'check', ...status(snapshot.reviewPercent >= 80, !mastered || !snapshot.practiceCompleted, !mastered ? `${remaining} required topic${remaining === 1 ? '' : 's'} need mastery` : 'Complete module Practice first') },
    { id: 'reflect', ...status(mastered && snapshot.reviewPercent >= 80, !snapshot.checkAttempted, 'Submit the module Check first') },
  ];
}

export function initialModuleStage(snapshot: ModuleStageSnapshot): 'learn' | 'practice' | 'check' | 'reflect' {
  const requiredProgress = snapshot.requiredTopics.map((topic) => snapshot.state.topicProgress[topic.id]);
  const mastered = requiredProgress.every((progress) => (progress?.masteryPercent ?? 0) >= 80);
  if (snapshot.checkAttempted && snapshot.reviewPercent >= 80) return 'reflect';
  if (snapshot.checkAttempted || snapshot.practiceCompleted) return mastered ? 'check' : 'practice';
  if (requiredProgress.some((progress) => progress?.lessonCompleted === true)) return 'practice';
  return 'learn';
}

export function nextRequiredTopic(module: Module, state: ProgressState): Topic | undefined {
  return module.topics.find((topic) => topic.required && (state.topicProgress[topic.id]?.masteryPercent ?? 0) < 80);
}
