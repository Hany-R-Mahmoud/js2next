import type { AssessmentAttempt, LegacyProgressRecord, PracticeAttempt, ProgressState, ReflectionEntry, ReviewItem, TopicProgress } from '@/domain/progression/types';
import { PROGRESS_SCHEMA_VERSION } from '@/domain/progression/types';

export type ImportResult = { readonly ok: true; readonly state: ProgressState } | { readonly ok: false; readonly reason: 'invalid-json' | 'invalid-schema' | 'future-version' };

export function parseProgress(raw: string): ImportResult {
  let value: unknown;
  try { value = JSON.parse(raw); } catch (error) { if (error instanceof SyntaxError) return { ok: false, reason: 'invalid-json' }; throw error; }
  if (!isRecord(value)) return { ok: false, reason: 'invalid-schema' };
  if (value.schemaVersion !== PROGRESS_SCHEMA_VERSION) return { ok: false, reason: value.schemaVersion === '1.0' ? 'invalid-schema' : 'future-version' };
  return isProgressState(value) ? { ok: true, state: value } : { ok: false, reason: 'invalid-schema' };
}

export function exportProgress(state: ProgressState): string { return JSON.stringify(state, null, 2); }

function isProgressState(value: unknown): value is ProgressState {
  if (!isRecord(value)) return false;
  return typeof value.profileId === 'string' && typeof value.curriculumVersion === 'string' && isRecord(value.topicProgress) && Object.entries(value.topicProgress).every(([id, topic]) => isTopic(topic, id)) && Array.isArray(value.assessmentAttempts) && value.assessmentAttempts.every(isAttempt) && (value.practiceAttempts === undefined || Array.isArray(value.practiceAttempts) && value.practiceAttempts.every(isPracticeAttempt)) && (value.reflections === undefined || Array.isArray(value.reflections) && value.reflections.every(isReflection)) && Array.isArray(value.reviewQueue) && value.reviewQueue.every(isReview) && isLegacy(value.legacyProgress) && typeof value.updatedAt === 'string' && (value.moduleProgress === undefined || isRecord(value.moduleProgress)) && (value.trackProgress === undefined || isRecord(value.trackProgress)) && (value.assessmentBankVersion === undefined || value.assessmentBankVersion === 1 || value.assessmentBankVersion === 2) && (value.assessmentV1Archive === undefined || isArchive(value.assessmentV1Archive));
}

function isArchive(value: unknown): boolean {
  if (!isRecord(value) || value.namespace !== 'assessment-v1' || typeof value.archivedAt !== 'string' || !Array.isArray(value.attempts) || !value.attempts.every(isAttempt) || !isRecord(value.topicProgress) || !Object.entries(value.topicProgress).every(([id, topic]) => isTopic(topic, id)) || !Array.isArray(value.reviewQueue) || !value.reviewQueue.every(isReview)) return false;
  return (value.moduleProgress === undefined || isRecord(value.moduleProgress)) && (value.trackProgress === undefined || isRecord(value.trackProgress));
}

function isTopic(value: unknown, id: string): value is TopicProgress {
  if (!isRecord(value) || value.topicId !== id || !isPositiveInt(value.contentVersion) || typeof value.lessonCompleted !== 'boolean' || !isStringArray(value.requiredCheckIds) || !isStringArray(value.attemptedCheckIds) || !isRecord(value.checkResponses) || !isStringArray(value.quizAttempts) || !isPercent(value.quizPercent) || !isPercent(value.masteryPercent) || !isStatus(value.status) || !isStringArray(value.missedObjectiveIds) || (value.confidence !== null && !isPercent(value.confidence)) || (value.lastActivity !== null && typeof value.lastActivity !== 'string')) return false;
  return Object.values(value.checkResponses).every(isCheckResponse);
}

function isAttempt(value: unknown): value is AssessmentAttempt {
  if (!isRecord(value) || typeof value.attemptId !== 'string' || typeof value.assessmentId !== 'string' || !isAssessmentKind(value.kind) || typeof value.ownerId !== 'string' || !isPositiveInt(value.contentVersion) || typeof value.startedAt !== 'string' || typeof value.completedAt !== 'string' || !isPercent(value.scorePercent) || typeof value.passed !== 'boolean' || !Array.isArray(value.answers)) return false;
  return value.answers.every((answer) => isRecord(answer) && typeof answer.questionId === 'string' && isStringArray(answer.objectiveIds) && isAnswer(answer.answer) && typeof answer.correct === 'boolean');
}

function isPracticeAttempt(value: unknown): value is PracticeAttempt {
  return isRecord(value) && typeof value.attemptId === 'string' && (value.kind === 'topic-practice' || value.kind === 'module-practice') && typeof value.ownerId === 'string' && isPositiveInt(value.contentVersion) && typeof value.completedAt === 'string' && isStringArray(value.questionIds) && isStringArray(value.answeredQuestionIds) && typeof value.correctCount === 'number' && Number.isInteger(value.correctCount) && value.correctCount >= 0;
}

function isReflection(value: unknown): value is ReflectionEntry {
  return isRecord(value) && typeof value.id === 'string' && typeof value.ownerId === 'string' && (value.kind === 'topic-reflection' || value.kind === 'module-reflection') && typeof value.retrieval === 'string' && typeof value.application === 'string' && isConfidence(value.confidence) && typeof value.submittedAt === 'string';
}

function isReview(value: unknown): value is ReviewItem { return isRecord(value) && typeof value.topicId === 'string' && typeof value.objectiveId === 'string' && typeof value.dueAt === 'string' && isReviewReason(value.reason) && isPercent(value.confidence) && isPositiveInt(value.attempts) && typeof value.lastActivity === 'string'; }
function isCheckResponse(value: unknown): boolean { return isRecord(value) && isAnswer(value.response) && (value.correct === undefined || typeof value.correct === 'boolean') && typeof value.answeredAt === 'string' && isPositiveInt(value.contentVersion); }
function isLegacy(value: unknown): value is LegacyProgressRecord { return isRecord(value) && typeof value.imported === 'boolean' && value.countsTowardNewMastery === false && (value.exportReference === null || typeof value.exportReference === 'string'); }
function isAnswer(value: unknown): value is string | number | readonly number[] { return typeof value === 'string' || typeof value === 'number' || (Array.isArray(value) && value.every((item) => typeof item === 'number')); }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
function isStringArray(value: unknown): value is readonly string[] { return Array.isArray(value) && value.every((item) => typeof item === 'string'); }
function isPercent(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100; }
function isConfidence(value: unknown): value is number { return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5; }
function isPositiveInt(value: unknown): value is number { return typeof value === 'number' && Number.isInteger(value) && value >= 1; }
function isStatus(value: unknown): value is TopicProgress['status'] { return value === 'not-started' || value === 'in-progress' || value === 'review-needed' || value === 'mastered'; }
function isAssessmentKind(value: unknown): value is AssessmentAttempt['kind'] { return value === 'topic-quiz' || value === 'module-review' || value === 'cumulative-review'; }
function isReviewReason(value: unknown): value is ReviewItem['reason'] { return value === 'incorrect-answer' || value === 'low-mastery' || value === 'manual-review'; }
