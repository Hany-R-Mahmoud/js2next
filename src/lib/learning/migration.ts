import type { LearnerProfile } from '@/types';
import type { ChallengeAttempt, LearningEvent, LessonProgress, TopicProgress, UnifiedLevel, UnifiedProfile } from './types';

export function isUnifiedProfile(value: unknown): value is UnifiedProfile {
  return isRecord(value)
    && value.version === 3
    && typeof value.name === 'string'
    && isLevel(value.level)
    && typeof value.diagnosticDone === 'boolean'
    && isStringArray(value.strengths)
    && isStringArray(value.weaknesses)
    && isStringArray(value.goals)
    && isStringArray(value.priorKnowledge)
    && isPreferredStyle(value.preferredStyle)
    && isCommunicationStyle(value.communicationStyle)
    && isPaceMode(value.paceMode)
    && isDiagnosticAnswers(value.diagnosticAnswers)
    && isNormalizedNumberMap(value.masteryEstimates)
    && isNormalizedNumberMap(value.confidenceByTopic)
    && isProgressMap(value.masteryRecords, isMasteryRecord)
    && isStringArray(value.completedTopics)
    && isReviewSchedule(value.reviewSchedule)
    && isProgressMap(value.challengeProgress, isChallengeAttempt)
    && isProgressMap(value.lessonProgress, isLessonProgress)
    && (value.topicProgress === undefined || isProgressMap(value.topicProgress, isTopicProgress))
    && (value.focusArea === undefined || typeof value.focusArea === 'string')
    && (value.learningEvents === undefined || isLearningEvents(value.learningEvents))
    && isStringArray(value.earnedCapabilities)
    && isNonNegativeFiniteNumber(value.streakDays)
    && typeof value.lastActiveAt === 'string'
    && (value.lastActiveDate === null || typeof value.lastActiveDate === 'string');
}

export function migrateCanonicalProfile(input: unknown, now: string): UnifiedProfile | null {
  if (!isRecord(input) || input.version !== 2) return null;
  const masteryRecords = readMasteryRecords(isRecord(input.masteryRecords) ? input.masteryRecords : {}, now);
  return makeUnifiedProfile(input, masteryRecords, now);
}

export function importLearnerProfile(raw: string, now: string): UnifiedProfile | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    const learner = isRecord(parsed.learner) ? parsed.learner : parsed;
    if (isUnifiedProfile(learner)) return learner;
    return migrateCanonicalProfile(learner, now)
      ?? migrateLearnReactProfile(learner, now)
      ?? migrateLegacyLearnerState(learner, now);
  } catch {
    return null;
  }
}

export function migrateLearnReactProfile(input: unknown, now: string): UnifiedProfile | null {
  if (!isRecord(input) || input.version !== 1 || typeof input.name !== 'string') return null;
  const masterySource = isRecord(input.masteryEstimates)
    ? Object.fromEntries(Object.entries(input.masteryEstimates).map(([topicId, mastery]) => [topicId, {
      mastery,
      confidence: isRecord(input.confidenceByTopic) ? input.confidenceByTopic[topicId] : undefined,
    }]))
    : {};
  const masteryRecords = readMasteryRecords(masterySource, now);
  const profile = {
    ...input,
    diagnosticDone: input.diagnosticDone,
    strengths: [],
    weaknesses: [],
    goals: input.goals,
    priorKnowledge: input.priorKnowledge,
    preferredStyle: input.preferredStyle,
    communicationStyle: input.preferredStyle,
    paceMode: 'standard',
    confidenceByTopic: input.confidenceByTopic,
    completedTopics: input.completedTopics,
    challengeProgress: input.challengeProgress,
    lessonProgress: input.lessonProgress,
    earnedCapabilities: [],
    streakDays: input.streakDays,
    lastActiveAt: input.updatedAt,
  };
  return makeUnifiedProfile(profile, masteryRecords, now, true);
}

export function migrateLegacyLearnerState(input: unknown, now: string): UnifiedProfile | null {
  if (!isRecord(input) || !isRecord(input.profile)) return null;
  const profile = input.profile;
  const mastery = isRecord(input.mastery) ? input.mastery : {};
  const masteryRecords = readMasteryRecords(mastery, now);
  return makeUnifiedProfile({
    ...profile,
    diagnosticDone: profile.diagnosticComplete,
    diagnostics: input.diagnostics,
    challengeProgress: input.challengeProgress,
    lessonProgress: input.lessonProgress,
    earnedCapabilities: input.earnedCapabilities,
    streak: input.streak,
    lastActive: input.lastActive,
    mastery: input.mastery,
    reviewSchedule: input.reviewSchedule,
  }, masteryRecords, now);
}

export function migrateLegacyProfile(profile: LearnerProfile, now: string): UnifiedProfile {
  return {
    version: 3,
    name: profile.name || 'Learner',
    level: profile.level,
    diagnosticDone: profile.diagnosticComplete,
    strengths: profile.strengths,
    weaknesses: profile.weaknesses,
    goals: profile.goals,
    priorKnowledge: profile.priorKnowledge,
    preferredStyle: profile.preferredStyle,
    communicationStyle: profile.communicationStyle,
    paceMode: profile.paceMode,
    diagnosticAnswers: [],
    masteryEstimates: {},
    confidenceByTopic: profile.confidence,
    masteryRecords: {},
    completedTopics: [],
    reviewSchedule: [],
    challengeProgress: {},
    lessonProgress: {},
    earnedCapabilities: [],
    streakDays: 0,
    lastActiveAt: now,
    lastActiveDate: now.slice(0, 10),
  };
}

function makeUnifiedProfile(
  source: Record<string, unknown>,
  masteryRecords: Record<string, UnifiedProfile['masteryRecords'][string]>,
  now: string,
  fromLearnReact = false,
): UnifiedProfile {
  const masteryEstimates = Object.fromEntries(Object.entries(masteryRecords).map(([topicId, record]) => [topicId, record.mastery]));
  const completedTopics = Array.from(new Set([
    ...Object.entries(masteryEstimates).filter(([, value]) => value >= 0.8).map(([topicId]) => topicId),
    ...readStringArray(source.completedTopics).map(mapTopicId),
  ]));
  const confidenceByTopic = Object.fromEntries(Object.entries(masteryRecords).map(([topicId, record]) => [topicId, record.confidence]));
  const sourceConfidence = isRecord(source.confidenceByTopic)
    ? Object.fromEntries(Object.entries(source.confidenceByTopic).flatMap(([topicId, value]) => {
      const confidence = readFiniteNumber(value);
      return confidence === null ? [] : [[mapTopicId(topicId), normalizeMastery(confidence)]];
    }))
    : {};
  const lastActiveAt = readString(source.lastActiveAt) ?? readString(source.lastActive) ?? now;
  return {
    version: 3,
    name: readString(source.name) ?? 'Learner',
    level: readLevel(source.level),
    diagnosticDone: readBoolean(source.diagnosticDone) || readBoolean(source.diagnosticComplete),
    strengths: readStringArray(source.strengths),
    weaknesses: readStringArray(source.weaknesses),
    goals: readStringArray(source.goals),
    priorKnowledge: readStringArray(source.priorKnowledge),
    preferredStyle: fromLearnReact ? readLearnReactPreferredStyle(source.preferredStyle) : readPreferredStyle(source.preferredStyle),
    communicationStyle: fromLearnReact ? readLearnReactCommunicationStyle(source.preferredStyle) : readCommunicationStyle(source.communicationStyle),
    paceMode: fromLearnReact ? 'standard' : readPaceMode(source.paceMode),
    diagnosticAnswers: readDiagnosticAnswers(source.diagnosticAnswers ?? source.diagnostics),
    masteryEstimates,
    confidenceByTopic: { ...sourceConfidence, ...confidenceByTopic },
    masteryRecords,
    completedTopics,
    reviewSchedule: readReviewScheduleValue(source.reviewSchedule ?? source.mastery),
    challengeProgress: readChallengeProgress(source.challengeProgress),
    lessonProgress: readLessonProgress(source.lessonProgress),
    topicProgress: readTopicProgress(source.topicProgress),
    ...(readString(source.focusArea) ? { focusArea: readString(source.focusArea) ?? undefined } : {}),
    learningEvents: readLearningEvents(source.learningEvents),
    earnedCapabilities: readStringArray(source.earnedCapabilities),
    streakDays: readFiniteNumber(source.streakDays) ?? readFiniteNumber(source.streak) ?? 0,
    lastActiveAt,
    lastActiveDate: readString(source.lastActiveDate) ?? lastActiveAt.slice(0, 10),
  };
}

export function toLearnerProfile(profile: UnifiedProfile): LearnerProfile {
  return {
    name: profile.name,
    level: profile.level,
    strengths: [...profile.strengths],
    weaknesses: [...profile.weaknesses],
    goals: [...profile.goals],
    priorKnowledge: [...profile.priorKnowledge],
    preferredStyle: profile.preferredStyle,
    communicationStyle: profile.communicationStyle,
    paceMode: profile.paceMode,
    focusArea: profile.focusArea,
    confidence: { ...profile.confidenceByTopic },
    diagnosticComplete: profile.diagnosticDone,
  };
}

function readMasteryRecords(value: Record<string, unknown>, now: string): Record<string, UnifiedProfile['masteryRecords'][string]> {
  const result: Record<string, UnifiedProfile['masteryRecords'][string]> = {};
  for (const [sourceTopicId, raw] of Object.entries(value)) {
    if (!isRecord(raw)) continue;
    const mastery = readFiniteNumber(raw.mastery);
    if (mastery === null) continue;
    const normalized = normalizeMastery(mastery);
    const topicId = mapTopicId(sourceTopicId);
    result[topicId] = {
      topicId,
      mastery: normalized,
      confidence: normalizeMastery(readFiniteNumber(raw.confidence) ?? 0),
      lastReviewed: readString(raw.lastReviewed) ?? now,
      attempts: readFiniteNumber(raw.attempts) ?? 0,
      mistakes: readStringArray(raw.mistakes),
      timesReviewed: readFiniteNumber(raw.timesReviewed) ?? 0,
      nextReviewDate: readString(raw.nextReviewDate) ?? now,
    };
  }
  return result;
}

function readReviewSchedule(value: Record<string, unknown>): UnifiedProfile['reviewSchedule'] {
  return Object.entries(value).flatMap(([sourceTopicId, raw]) => {
    if (!isRecord(raw)) return [];
    const dueAt = readString(raw.nextReviewDate);
    return dueAt ? [{ topicId: mapTopicId(sourceTopicId), dueAt, intervalDays: 1 }] : [];
  });
}

function readReviewScheduleValue(value: unknown): UnifiedProfile['reviewSchedule'] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => {
      if (!isRecord(entry)) return [];
      const dueAt = readString(entry.dueAt);
      const topicId = readString(entry.topicId);
      const intervalDays = readFiniteNumber(entry.intervalDays);
      return dueAt && topicId && intervalDays !== null
        ? [{ topicId: mapTopicId(topicId), dueAt, intervalDays }]
        : [];
    });
  }
  return isRecord(value) ? readReviewSchedule(value) : [];
}

function readChallengeProgress(value: unknown): Record<string, ChallengeAttempt> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([sourceId, raw]) => {
    if (!isChallengeAttempt(raw, sourceId)) return [];
    const id = mapChallengeId(sourceId);
    return [[id, { ...raw, challengeId: id }]];
  }));
}

function readLessonProgress(value: unknown): Record<string, LessonProgress> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([sourceId, raw]) => {
    if (!isLessonProgress(raw, sourceId)) return [];
    const id = mapTopicId(sourceId);
    return [[id, { ...raw, topicId: id }]];
  }));
}

function readTopicProgress(value: unknown): Record<string, TopicProgress> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([sourceId, raw]) => {
    if (!isTopicProgress(raw, sourceId)) return [];
    const id = mapTopicId(sourceId);
    return [[id, { ...raw, topicId: id }]];
  }));
}

function isChallengeAttempt(value: unknown, expectedId?: string): value is ChallengeAttempt {
  return isRecord(value)
    && typeof value.challengeId === 'string'
    && (expectedId === undefined || value.challengeId === expectedId)
    && isNonNegativeFiniteNumber(value.attempts)
    && isNonNegativeFiniteNumber(value.hintsUsed)
    && typeof value.revealed === 'boolean'
    && typeof value.passed === 'boolean'
    && isNormalizedNumber(value.confidence)
    && (value.lastAnswer === undefined || typeof value.lastAnswer === 'string')
    && (value.scored === undefined || typeof value.scored === 'boolean')
    && (value.outcome === undefined || value.outcome === 'passed' || value.outcome === 'failed' || value.outcome === 'unscored')
    && typeof value.updatedAt === 'string';
}

function isLessonProgress(value: unknown, expectedId?: string): value is LessonProgress {
  return isRecord(value)
    && typeof value.topicId === 'string'
    && (expectedId === undefined || value.topicId === expectedId)
    && isNonNegativeFiniteNumber(value.stepIndex)
    && typeof value.diagnosticAnswered === 'boolean'
    && typeof value.completed === 'boolean'
    && isNormalizedNumber(value.confidence)
    && typeof value.lastVisited === 'string'
    && (value.chunkProgress === undefined || isChunkProgress(value.chunkProgress))
    && (value.answerProgress === undefined || isAnswerProgress(value.answerProgress))
    && (value.miniProjectDraft === undefined || typeof value.miniProjectDraft === 'string')
    && (value.miniProjectSubmitted === undefined || typeof value.miniProjectSubmitted === 'boolean')
    && (value.reflection === undefined || typeof value.reflection === 'string');
}

function isTopicProgress(value: unknown, expectedId?: string): value is TopicProgress {
  return isRecord(value)
    && typeof value.topicId === 'string'
    && (expectedId === undefined || value.topicId === expectedId)
    && isTopicLoopStage(value.stage)
    && isStringArray(value.completedChallengeIds)
    && isStringArray(value.confirmedQaIds)
    && typeof value.manualReview === 'boolean'
    && typeof value.lastVisited === 'string'
    && (value.lastReviewCompletedAt === undefined || typeof value.lastReviewCompletedAt === 'string');
}

function isChunkProgress(value: unknown): boolean {
  return isRecord(value) && Object.values(value).every((entry) => isRecord(entry)
    && typeof entry.answered === 'boolean'
    && typeof entry.correct === 'boolean'
    && (entry.answer === undefined || typeof entry.answer === 'string'));
}

function isAnswerProgress(value: unknown): boolean {
  return isRecord(value) && Object.values(value).every((entry) => isRecord(entry)
    && typeof entry.answer === 'string'
    && isNonNegativeFiniteNumber(entry.attempts)
    && isNonNegativeFiniteNumber(entry.hintsRequested)
    && typeof entry.revealed === 'boolean'
    && (entry.feedback === undefined || typeof entry.feedback === 'string'));
}

function isProgressMap<T>(value: unknown, guard: (entry: unknown, expectedId: string) => entry is T): value is Readonly<Record<string, T>> {
  if (!isRecord(value)) return false;
  return Object.entries(value).every(([id, entry]) => guard(entry, id));
}

function isMasteryRecord(value: unknown, expectedId?: string): value is UnifiedProfile['masteryRecords'][string] {
  return isRecord(value)
    && typeof value.topicId === 'string'
    && (expectedId === undefined || value.topicId === expectedId)
    && isNormalizedNumber(value.mastery)
    && isNormalizedNumber(value.confidence)
    && typeof value.lastReviewed === 'string'
    && isNonNegativeFiniteNumber(value.attempts)
    && isStringArray(value.mistakes)
    && isNonNegativeFiniteNumber(value.timesReviewed)
    && typeof value.nextReviewDate === 'string';
}

function isDiagnosticAnswers(value: unknown): value is UnifiedProfile['diagnosticAnswers'] {
  return Array.isArray(value) && value.every((entry) => isRecord(entry)
    && typeof entry.questionId === 'string'
    && typeof entry.answer === 'string'
    && isNormalizedNumber(entry.confidence));
}

function readLearningEvents(value: unknown): readonly LearningEvent[] {
  return isLearningEvents(value) ? value : [];
}

function isLearningEvents(value: unknown): value is readonly LearningEvent[] {
  return Array.isArray(value) && value.every((entry) => {
    if (!isRecord(entry) || typeof entry.topicId !== 'string' || typeof entry.occurredAt !== 'string' || !isNormalizedNumber(entry.confidence)) {
      return false;
    }
    switch (entry.type) {
      case 'lesson-completed':
        return isNormalizedNumber(entry.mastery);
      case 'challenge-attempted':
        return typeof entry.challengeId === 'string'
          && typeof entry.passed === 'boolean'
          && isNonNegativeFiniteNumber(entry.hintsUsed);
      case 'qa-confirmed':
        return typeof entry.qaId === 'string';
      case 'topic-completed':
        return isNormalizedNumber(entry.mastery);
      default:
        return false;
    }
  });
}

function isReviewSchedule(value: unknown): value is UnifiedProfile['reviewSchedule'] {
  return Array.isArray(value) && value.every((entry) => isRecord(entry)
    && typeof entry.topicId === 'string'
    && typeof entry.dueAt === 'string'
    && isNonNegativeFiniteNumber(entry.intervalDays));
}

function isNormalizedNumberMap(value: unknown): value is Readonly<Record<string, number>> {
  return isRecord(value) && Object.values(value).every(isNormalizedNumber);
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function isLevel(value: unknown): value is UnifiedLevel {
  return value === 'beginner' || value === 'intermediate' || value === 'advanced' || value === 'expert';
}

function isPreferredStyle(value: unknown): value is LearnerProfile['preferredStyle'] {
  return value === 'visual' || value === 'verbal' || value === 'active' || value === 'reflective';
}

function isCommunicationStyle(value: unknown): value is LearnerProfile['communicationStyle'] {
  return value === 'socratic' || value === 'direct' || value === 'storytelling';
}

function isPaceMode(value: unknown): value is LearnerProfile['paceMode'] {
  return value === 'standard' || value === 'accelerated' || value === 'deep-dive';
}

function isTopicLoopStage(value: unknown): value is TopicProgress['stage'] {
  return value === 'learn' || value === 'practice' || value === 'confirm' || value === 'complete';
}

function isNormalizedNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
}

function isNonNegativeFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function normalizeMastery(value: number): number {
  return Math.max(0, Math.min(1, value > 1 ? value / 100 : value));
}

function readLevel(value: unknown): UnifiedLevel {
  return value === 'intermediate' || value === 'advanced' || value === 'expert' ? value : 'beginner';
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
}

function readDiagnosticAnswers(value: unknown): UnifiedProfile['diagnosticAnswers'] {
  return isDiagnosticAnswers(value) ? value : [];
}

function readPreferredStyle(value: unknown): LearnerProfile['preferredStyle'] {
  return isPreferredStyle(value) ? value : 'active';
}

function readLearnReactPreferredStyle(value: unknown): LearnerProfile['preferredStyle'] {
  if (value === 'visual') return 'visual';
  if (value === 'causal' || value === 'detailed') return 'reflective';
  if (value === 'socratic' || value === 'concise') return 'verbal';
  return 'active';
}

function readLearnReactCommunicationStyle(value: unknown): LearnerProfile['communicationStyle'] {
  return value === 'socratic' ? 'socratic' : 'direct';
}

function readCommunicationStyle(value: unknown): LearnerProfile['communicationStyle'] {
  return isCommunicationStyle(value) ? value : 'socratic';
}

function readPaceMode(value: unknown): LearnerProfile['paceMode'] {
  return isPaceMode(value) ? value : 'standard';
}

function readBoolean(value: unknown): boolean {
  return value === true;
}

function readFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function mapTopicId(topicId: string): string {
  const mapped: Readonly<Record<string, string>> = {
    'js-async-immutability': 'deep-dive-async-immutability',
    'react-mental-model': 'deep-dive-react-mental-model',
    'state-and-effects': 'deep-dive-state-and-effects',
    'app-quality': 'deep-dive-app-quality',
    'nextjs-foundations': 'deep-dive-nextjs-foundations',
    'rsc-boundaries': 'deep-dive-rsc-boundaries',
    'nextjs-data': 'deep-dive-nextjs-data',
    'production-concerns': 'deep-dive-production-concerns',
    'architecture-decisions': 'deep-dive-architecture-decisions',
  };
  return mapped[topicId] ?? topicId;
}

function mapChallengeId(challengeId: string): string {
  if (challengeId.startsWith('challenge:')) return challengeId;
  const slug = challengeId.startsWith('ch-') ? `learn-react-${challengeId}` : challengeId;
  return `challenge:${slug}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
