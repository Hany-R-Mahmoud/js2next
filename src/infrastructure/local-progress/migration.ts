import type { AssessmentV1Archive, LegacyProgressRecord, ProgressState, TopicProgress } from '@/domain/progression/types';
import { createInitialProgress } from '@/domain/progression/core';

export function resetForNewCurriculum(profileId: string, curriculumVersion: string, now: string, legacyExportReference: string | null): ProgressState {
  const legacyProgress: LegacyProgressRecord = { imported: legacyExportReference !== null, countsTowardNewMastery: false, exportReference: legacyExportReference };
  return { ...createInitialProgress(profileId, curriculumVersion, now), legacyProgress };
}

const assessmentV2Topic = (topic: TopicProgress): TopicProgress => ({
  ...topic,
  contentVersion: 2,
  attemptedCheckIds: [],
  checkResponses: {},
  quizAttempts: [],
  quizPercent: 0,
  masteryPercent: 0,
  status: topic.lessonCompleted || topic.attemptedCheckIds.length > 0 ? 'in-progress' : 'not-started',
  missedObjectiveIds: [],
  confidence: null,
});

export function migrateAssessmentProgressV2(state: ProgressState, now: string): ProgressState {
  const v1Attempts = state.assessmentAttempts.filter((attempt) => attempt.contentVersion < 2);
  const v1Topics = Object.fromEntries(Object.entries(state.topicProgress).filter(([, topic]) => topic.contentVersion < 2));
  const needsMigration = state.assessmentBankVersion !== 2 || v1Attempts.length > 0 || Object.keys(v1Topics).length > 0;
  if (!needsMigration) return state;

  const archive: AssessmentV1Archive | undefined = state.assessmentV1Archive ?? (v1Attempts.length > 0 || Object.keys(v1Topics).length > 0 ? {
    namespace: 'assessment-v1',
    archivedAt: now,
    attempts: v1Attempts,
    topicProgress: v1Topics,
    ...(state.moduleProgress === undefined ? {} : { moduleProgress: state.moduleProgress }),
    ...(state.trackProgress === undefined ? {} : { trackProgress: state.trackProgress }),
    reviewQueue: state.reviewQueue,
  } : undefined);

  return {
    ...state,
    topicProgress: Object.fromEntries(Object.entries(state.topicProgress).map(([topicId, topic]) => [topicId, topic.contentVersion < 2 ? assessmentV2Topic(topic) : topic])),
    moduleProgress: {},
    trackProgress: {},
    assessmentAttempts: state.assessmentAttempts.filter((attempt) => attempt.contentVersion >= 2),
    reviewQueue: [],
    ...(archive === undefined ? {} : { assessmentV1Archive: archive }),
    assessmentBankVersion: 2,
    updatedAt: now,
  };
}

export function rollbackAssessmentProgressV2(state: ProgressState): ProgressState {
  const archive = state.assessmentV1Archive;
  if (archive === undefined) return state;
  return {
    ...state,
    topicProgress: archive.topicProgress,
    ...(archive.moduleProgress === undefined ? {} : { moduleProgress: archive.moduleProgress }),
    ...(archive.trackProgress === undefined ? {} : { trackProgress: archive.trackProgress }),
    assessmentAttempts: archive.attempts,
    reviewQueue: archive.reviewQueue,
    assessmentBankVersion: 1,
  };
}
