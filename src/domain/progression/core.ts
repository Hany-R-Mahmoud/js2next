import type { AssessmentAttempt, CheckResponse, CurriculumDefinition, ModuleDefinition, ModuleProgress, PrerequisiteWarning, ProgressState, TopicProgress, TrackProgress } from './types';
import { PROGRESS_SCHEMA_VERSION } from './types';

const clamp = (value: number): number => Math.max(0, Math.min(100, value));
const unique = (values: readonly string[]): readonly string[] => [...new Set(values)];

export function createInitialProgress(profileId: string, curriculumVersion: string, now: string): ProgressState {
  return { schemaVersion: PROGRESS_SCHEMA_VERSION, profileId, curriculumVersion, topicProgress: {}, moduleProgress: {}, trackProgress: {}, assessmentAttempts: [], reviewQueue: [], legacyProgress: { imported: false, countsTowardNewMastery: false, exportReference: null }, updatedAt: now };
}

export function createTopicProgress(topicId: string, contentVersion: number, requiredCheckIds: readonly string[]): TopicProgress {
  return { topicId, contentVersion, lessonCompleted: false, requiredCheckIds: [...requiredCheckIds], attemptedCheckIds: [], checkResponses: {}, quizAttempts: [], quizPercent: 0, masteryPercent: 0, status: 'not-started', missedObjectiveIds: [], confidence: null, lastActivity: null };
}

export function recordLessonCompletion(state: ProgressState, topic: TopicProgress, completedAt: string): ProgressState {
  return updateTopic(state, { ...topic, lessonCompleted: true, lastActivity: completedAt, status: topic.status === 'not-started' ? 'in-progress' : topic.status }, completedAt);
}

export function recordCheckResponse(state: ProgressState, topic: TopicProgress, checkId: string, response: CheckResponse, answeredAt: string): ProgressState {
  const next = { ...topic, attemptedCheckIds: unique([...topic.attemptedCheckIds, checkId]), checkResponses: { ...topic.checkResponses, [checkId]: response }, lastActivity: answeredAt, status: 'in-progress' as const };
  return updateTopic(state, next, answeredAt);
}

export function recordTopicQuiz(state: ProgressState, topic: TopicProgress, attempt: AssessmentAttempt, objectiveIds: readonly string[], confidence: number | null): ProgressState {
  if (attempt.kind !== 'topic-quiz') return state;
  const percent = clamp(attempt.scorePercent);
  const gatesMet = topic.lessonCompleted && topic.requiredCheckIds.every((id) => topic.attemptedCheckIds.includes(id));
  const mastery = gatesMet && percent >= 80 ? percent : 0;
  const next: TopicProgress = { ...topic, quizAttempts: [...topic.quizAttempts, attempt.attemptId], quizPercent: Math.max(topic.quizPercent, percent), masteryPercent: mastery, status: mastery >= 80 ? 'mastered' : percent < 80 ? 'review-needed' : 'in-progress', missedObjectiveIds: attempt.passed ? topic.missedObjectiveIds : unique([...topic.missedObjectiveIds, ...objectiveIds]), confidence, lastActivity: attempt.completedAt };
  const recorded = { ...updateTopic(state, next, attempt.completedAt), assessmentAttempts: [...state.assessmentAttempts, attempt] };
  return attempt.passed ? recorded : objectiveIds.reduce<ProgressState>((current, objectiveId) => addObjectiveReview(current, topic.topicId, objectiveId, attempt.completedAt, 'incorrect-answer', confidence ?? 0, attempt.completedAt), recorded);
}

export function recordReviewAttempt(state: ProgressState, attempt: AssessmentAttempt): ProgressState {
  if (attempt.kind === 'topic-quiz') return state;
  return { ...state, assessmentAttempts: [...state.assessmentAttempts, attempt], updatedAt: attempt.completedAt };
}

export function addObjectiveReview(state: ProgressState, topicId: string, objectiveId: string, dueAt: string, reason: 'incorrect-answer' | 'low-mastery' | 'manual-review', confidence: number, at: string): ProgressState {
  const current = state.reviewQueue.find((item) => item.topicId === topicId && item.objectiveId === objectiveId);
  const next = { topicId, objectiveId, dueAt, reason, confidence: clamp(confidence), attempts: (current?.attempts ?? 0) + 1, lastActivity: at };
  return { ...state, reviewQueue: [...state.reviewQueue.filter((item) => !(item.topicId === topicId && item.objectiveId === objectiveId)), next], updatedAt: at };
}

function updateTopic(state: ProgressState, topic: TopicProgress, at: string): ProgressState { return { ...state, topicProgress: { ...state.topicProgress, [topic.topicId]: topic }, updatedAt: at }; }

export function aggregateModule(state: ProgressState, module: ModuleDefinition, reviewPercent: number): ModuleProgress {
  const required = module.topicIds.filter((topic) => topic.required);
  const mastered = required.filter((topic) => (state.topicProgress[topic.id]?.masteryPercent ?? 0) >= 80).map((topic) => topic.id);
  const complete = mastered.length === required.length && reviewPercent >= 80;
  return { moduleId: module.id, requiredTopicIds: required.map((topic) => topic.id), masteredTopicIds: mastered, reviewPercent: clamp(reviewPercent), complete };
}

export function aggregateTrack(state: ProgressState, track: CurriculumDefinition['tracks'][number], reviewPercent: number, moduleReviews: Readonly<Record<string, number>>): TrackProgress {
  const required = track.modules.filter((module) => module.required);
  const completeIds = required.filter((module) => aggregateModule(state, module, moduleReviews[module.id] ?? 0).complete).map((module) => module.id);
  return { trackId: track.id, requiredModuleIds: required.map((module) => module.id), completeModuleIds: completeIds, reviewPercent: clamp(reviewPercent), complete: completeIds.length === required.length && reviewPercent >= 80 };
}

export function prerequisiteWarning(state: ProgressState, prerequisiteId: string): PrerequisiteWarning | null {
  const masteryPercent = state.topicProgress[prerequisiteId]?.masteryPercent ?? 0;
  return masteryPercent < 80 ? { prerequisiteId, masteryPercent, canContinue: true, requiresExplicitConfirmation: true } : null;
}
