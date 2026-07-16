import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Challenge, LearnerProfile, ProgressSnapshot } from '@/types';
import { isUnifiedProfile, migrateCanonicalProfile, migrateLearnReactProfile, migrateLegacyLearnerState } from '@/lib/learning/migration';
import { updateMasteryFromChallenge } from '@/lib/learning/mastery';
import { appendLearningEvent, buildReviewQueue, type ReviewQueueItem } from '@/lib/learning/adaptation';
import { toUnifiedChallenge } from '@/lib/learning/challenge-adapter';
import { reconcileCapabilities } from '@/lib/learning/capabilities';
import type { ChallengeAttempt, LearningEvent, LessonProgress, TopicLoopStage, TopicProgress, UnifiedProfile } from '@/lib/learning/types';

interface LearnerStore {
  canonicalProfile: UnifiedProfile;

  setProfile: (profile: Partial<LearnerProfile>) => void;
  completeDiagnostic: () => void;
  addDiagnosticAnswer: (questionId: string, answer: string, confidence: number) => void;
  updateMastery: (topicId: string, updates: Partial<UnifiedProfile['masteryRecords'][string]>) => void;
  completeLesson: (slug: string, mastery: number, mistakes: string[]) => void;
  addToReviewQueue: (topicId: string) => void;
  removeFromReviewQueue: (topicId: string) => void;
  incrementStreak: () => void;
  resetProgress: () => void;
  importProfile: (profile: UnifiedProfile) => void;
  getProgressSnapshot: () => ProgressSnapshot;
  getReviewQueue: () => string[];
  getReviewQueueDetails: () => readonly ReviewQueueItem[];
  recordLearningEvent: (event: LearningEvent) => void;
  recordChallengeAttempt: (attempt: ChallengeAttempt, challenge?: Challenge) => void;
  saveLessonProgress: (progress: LessonProgress) => void;
  saveTopicProgress: (progress: TopicProgress) => void;
  confirmQa: (topicId: string, qaId: string) => void;
  setManualReview: (topicId: string, flagged: boolean) => void;
  completeTopic: (topicId: string, masteryScore: number) => void;
}

const defaultCanonicalProfile: UnifiedProfile = {
  version: 3,
  name: '',
  level: 'beginner',
  diagnosticDone: false,
  strengths: [],
  weaknesses: [],
  goals: [],
  priorKnowledge: [],
  preferredStyle: 'active',
  communicationStyle: 'socratic',
  paceMode: 'standard',
  diagnosticAnswers: [],
  masteryEstimates: {},
  confidenceByTopic: {},
  masteryRecords: {},
  completedTopics: [],
  reviewSchedule: [],
  challengeProgress: {},
  lessonProgress: {},
  topicProgress: {},
  focusArea: '',
  learningEvents: [],
  earnedCapabilities: [],
  streakDays: 0,
  lastActiveAt: new Date().toISOString(),
  lastActiveDate: null,
};

export const useLearnerStore = create<LearnerStore>()(
  persist(
    (set, get) => ({
      canonicalProfile: defaultCanonicalProfile,

      setProfile: (updates) =>
        set((s) => ({ canonicalProfile: updateCanonicalProfile(s.canonicalProfile, updates) })),

      completeDiagnostic: () =>
        set((s) => ({ canonicalProfile: { ...s.canonicalProfile, diagnosticDone: true } })),

      addDiagnosticAnswer: (questionId, answer, confidence) =>
        set((s) => ({
          canonicalProfile: {
            ...s.canonicalProfile,
            diagnosticAnswers: [...s.canonicalProfile.diagnosticAnswers, { questionId, answer, confidence }],
          },
        })),

      updateMastery: (topicId, updates) =>
        set((s) => {
          const existing = s.canonicalProfile.masteryRecords[topicId];
          const defaults = {
            topicId,
            mastery: 0,
            confidence: 0,
            lastReviewed: new Date().toISOString(),
            attempts: 0,
            mistakes: [] as string[],
            timesReviewed: 0,
            nextReviewDate: new Date().toISOString(),
          };
          const normalizedUpdates = updates.mastery === undefined
            ? updates
            : { ...updates, mastery: normalizeMasteryInput(updates.mastery) };
          const nextMastery = {
            ...s.canonicalProfile.masteryRecords,
            [topicId]: { ...defaults, ...existing, ...normalizedUpdates },
          };
          const next = nextMastery[topicId];
          return {
            canonicalProfile: reconcileProfile(syncCanonicalMastery(s.canonicalProfile, topicId, next)),
          };
        }),

      completeLesson: (slug, masteryScore, mistakes) => {
        const existing = get().canonicalProfile.masteryRecords[slug];
        const now = new Date();
        const nextReview = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day

        set((s) => {
          const nextProfile = syncCanonicalMastery(s.canonicalProfile, slug, {
            topicId: slug,
            mastery: masteryScore / 100,
            confidence: masteryScore >= 80 ? 0.8 : 0.5,
            lastReviewed: now.toISOString(),
            attempts: (existing?.attempts || 0) + 1,
            mistakes: [...(existing?.mistakes || []), ...mistakes],
            timesReviewed: (existing?.timesReviewed || 0) + 1,
            nextReviewDate: nextReview.toISOString(),
          });
          return {
            canonicalProfile: reconcileProfile(appendLearningEvent(nextProfile, {
              type: 'lesson-completed',
              topicId: slug,
              confidence: masteryScore >= 80 ? 0.8 : 0.5,
              mastery: masteryScore / 100,
              occurredAt: now.toISOString(),
            })),
          };
        });
      },

      saveTopicProgress: (progress) =>
        set((s) => {
          const previousStage = s.canonicalProfile.topicProgress?.[progress.topicId]?.stage ?? 'learn';
          const nextProfile = {
            ...s.canonicalProfile,
            topicProgress: {
              ...(s.canonicalProfile.topicProgress ?? {}),
              [progress.topicId]: progress,
            },
            lastActiveAt: progress.lastVisited,
          };
          const completedAct = stageRank(progress.stage) > stageRank(previousStage);
          return { canonicalProfile: reconcileProfile(completedAct ? advanceStreak(nextProfile, progress.lastVisited) : nextProfile) };
        }),

      confirmQa: (topicId, qaId) =>
        set((s) => {
          const current = readTopicProgress(s.canonicalProfile, topicId);
          const now = new Date().toISOString();
          const progress: TopicProgress = {
            ...current,
            stage: 'confirm',
            confirmedQaIds: Array.from(new Set([...current.confirmedQaIds, qaId])),
            lastVisited: now,
          };
          return {
            canonicalProfile: appendLearningEvent({
              ...s.canonicalProfile,
              topicProgress: { ...(s.canonicalProfile.topicProgress ?? {}), [topicId]: progress },
              lastActiveAt: now,
            }, {
              type: 'qa-confirmed',
              topicId,
              qaId,
              confidence: s.canonicalProfile.confidenceByTopic[topicId] ?? 0.5,
              occurredAt: now,
            }),
          };
        }),

      setManualReview: (topicId, flagged) =>
        set((s) => {
          const current = readTopicProgress(s.canonicalProfile, topicId);
          const now = new Date().toISOString();
          return {
            canonicalProfile: {
              ...s.canonicalProfile,
              topicProgress: {
                ...(s.canonicalProfile.topicProgress ?? {}),
                [topicId]: { ...current, manualReview: flagged, lastVisited: now },
              },
              lastActiveAt: now,
            },
          };
        }),

      completeTopic: (topicId, masteryScore) =>
        set((s) => {
          const now = new Date().toISOString();
          const normalizedMastery = normalizeMasteryInput(masteryScore);
          const current = readTopicProgress(s.canonicalProfile, topicId);
          const nextProfile = syncCanonicalMastery(s.canonicalProfile, topicId, {
            topicId,
            mastery: normalizedMastery,
            confidence: normalizedMastery >= 0.8 ? 0.8 : 0.5,
            lastReviewed: now,
            attempts: (s.canonicalProfile.masteryRecords[topicId]?.attempts ?? 0) + 1,
            mistakes: s.canonicalProfile.masteryRecords[topicId]?.mistakes ?? [],
            timesReviewed: (s.canonicalProfile.masteryRecords[topicId]?.timesReviewed ?? 0) + 1,
            nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          });
          return {
            canonicalProfile: reconcileProfile(appendLearningEvent({
              ...advanceStreak(nextProfile, now),
              topicProgress: {
                ...(nextProfile.topicProgress ?? {}),
                [topicId]: { ...current, stage: 'complete', lastVisited: now },
              },
              lastActiveAt: now,
            }, {
              type: 'topic-completed',
              topicId,
              mastery: normalizedMastery,
              confidence: normalizedMastery >= 0.8 ? 0.8 : 0.5,
              occurredAt: now,
            })),
          };
        }),

      addToReviewQueue: (topicId) => {
        const existing = get().canonicalProfile.masteryRecords[topicId];
        if (existing) {
          const now = new Date();
          const nextReview = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          set((s) => ({
            canonicalProfile: syncCanonicalMastery(s.canonicalProfile, topicId, { ...existing, nextReviewDate: nextReview.toISOString() }),
          }));
        }
      },

      removeFromReviewQueue: (topicId) => {
        const existing = get().canonicalProfile.masteryRecords[topicId];
        if (existing) {
          const now = new Date().toISOString();
          const nextReviewDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
          set((s) => {
            const nextProfile = syncCanonicalMastery(s.canonicalProfile, topicId, { ...existing, nextReviewDate });
            const current = readTopicProgress(nextProfile, topicId);
            return {
              canonicalProfile: {
                ...nextProfile,
                topicProgress: {
                  ...(nextProfile.topicProgress ?? {}),
                  [topicId]: { ...current, manualReview: false, lastReviewCompletedAt: now, lastVisited: now },
                },
                lastActiveAt: now,
              },
            };
          });
        }
      },

      incrementStreak: () =>
        set((s) => {
          const now = new Date();
          const nowIso = now.toISOString();
          const today = now.toDateString();
          const last = new Date(s.canonicalProfile.lastActiveAt).toDateString();
          if (today === last) {
            return {
              canonicalProfile: { ...s.canonicalProfile, streakDays: Math.max(1, s.canonicalProfile.streakDays), lastActiveAt: nowIso, lastActiveDate: nowIso.slice(0, 10) },
            };
          }
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          const nextStreak = last === yesterday ? s.canonicalProfile.streakDays + 1 : 1;
          return {
            canonicalProfile: { ...s.canonicalProfile, streakDays: nextStreak, lastActiveAt: nowIso, lastActiveDate: nowIso.slice(0, 10) },
          };
        }),

      resetProgress: () =>
        set({ canonicalProfile: { ...defaultCanonicalProfile, lastActiveAt: new Date().toISOString() } }),

      importProfile: (profile) => set({ canonicalProfile: reconcileProfile(profile) }),

      getProgressSnapshot: () => {
        const { canonicalProfile } = get();
        const entries = Object.entries(canonicalProfile.masteryRecords);
        const completed = entries.filter(([, m]) => m.mastery >= 0.8).length;
        const reviewQueue = buildReviewQueue(canonicalProfile).map((item) => item.topicId);
        return {
          totalTopics: entries.length,
          completed,
          mastery: Object.fromEntries(entries.map(([id, m]) => [id, m.mastery])),
          streak: canonicalProfile.streakDays,
          lastActive: canonicalProfile.lastActiveAt,
          reviewQueue,
          earnedCapabilities: [...canonicalProfile.earnedCapabilities],
        };
      },

      getReviewQueue: () => {
        return get().getReviewQueueDetails().map((item) => item.topicId);
      },

      getReviewQueueDetails: () => buildReviewQueue(get().canonicalProfile),

      recordLearningEvent: (event) =>
        set((s) => ({ canonicalProfile: appendLearningEvent(s.canonicalProfile, event) })),

      recordChallengeAttempt: (attempt, challenge) =>
        set((s) => {
          const unifiedChallenge = challenge ? toUnifiedChallenge(challenge) : null;
          if (unifiedChallenge === null) {
            return {
              canonicalProfile: {
                ...s.canonicalProfile,
                challengeProgress: { ...s.canonicalProfile.challengeProgress, [attempt.challengeId]: attempt },
                lastActiveAt: attempt.updatedAt,
              },
            };
          }
          const canonicalProfile = updateMasteryFromChallenge(s.canonicalProfile, unifiedChallenge, attempt, new Date(attempt.updatedAt));
          return {
            canonicalProfile: reconcileProfile(appendLearningEvent(
              {
                ...canonicalProfile,
                topicProgress: {
                  ...(canonicalProfile.topicProgress ?? {}),
                  [unifiedChallenge.topicId]: advancePracticeProgress(
                    canonicalProfile.topicProgress?.[unifiedChallenge.topicId],
                    unifiedChallenge.topicId,
                    attempt.challengeId,
                    attempt.updatedAt,
                  ),
                },
                lastActiveAt: attempt.updatedAt,
              },
              {
                type: 'challenge-attempted',
                topicId: unifiedChallenge.topicId,
                challengeId: attempt.challengeId,
                confidence: attempt.confidence,
                passed: attempt.passed,
                hintsUsed: attempt.hintsUsed,
                occurredAt: attempt.updatedAt,
              },
            )),
          };
        }),

      saveLessonProgress: (progress) =>
        set((s) => ({
          canonicalProfile: {
            ...s.canonicalProfile,
            lessonProgress: {
              ...s.canonicalProfile.lessonProgress,
              [progress.topicId]: progress,
            },
            lastActiveAt: progress.lastVisited,
          },
        })),
    }),
    {
      name: 'learn-next-learner',
      partialize: (state) => ({ canonicalProfile: state.canonicalProfile }),
      merge: (persistedState, currentState) => {
        const persisted = isRecord(persistedState) ? persistedState : {};
        const now = new Date().toISOString();
        const siblingProfile = readSiblingProfile(now);
        const rawProfile = isUnifiedProfile(persisted.canonicalProfile)
          ? persisted.canonicalProfile
          : migrateCanonicalProfile(persisted.canonicalProfile, now)
            ?? migrateLegacyLearnerState(persistedState, now)
            ?? siblingProfile
            ?? currentState.canonicalProfile;
        const canonicalProfile = reconcileProfile(rawProfile);
        return { ...currentState, canonicalProfile };
      },
    }
  )
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readSiblingProfile(now: string): UnifiedProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('learn-react:profile:v1');
    return raw ? migrateLearnReactProfile(JSON.parse(raw), now) : null;
  } catch {
    return null;
  }
}

function syncCanonicalMastery(
  profile: UnifiedProfile,
  topicId: string,
  record: UnifiedProfile['masteryRecords'][string],
): UnifiedProfile {
  const normalizedMastery = Math.max(0, Math.min(1, record.mastery));
  const normalizedRecord = {
    ...record,
    topicId,
    mastery: normalizedMastery,
    confidence: Math.max(0, Math.min(1, record.confidence)),
  };
  return {
    ...profile,
    masteryEstimates: { ...profile.masteryEstimates, [topicId]: normalizedMastery },
    confidenceByTopic: { ...profile.confidenceByTopic, [topicId]: normalizedRecord.confidence },
    masteryRecords: { ...profile.masteryRecords, [topicId]: normalizedRecord },
    completedTopics: normalizedMastery >= 0.8
      ? Array.from(new Set([...profile.completedTopics, topicId]))
      : profile.completedTopics.filter((id) => id !== topicId),
    reviewSchedule: [
      ...profile.reviewSchedule.filter((item) => item.topicId !== topicId),
      { topicId, dueAt: record.nextReviewDate, intervalDays: 1 },
    ],
  };
}

function normalizeMasteryInput(value: number): number {
  return Math.max(0, Math.min(1, value > 1 ? value / 100 : value));
}

function readTopicProgress(profile: UnifiedProfile, topicId: string): TopicProgress {
  return profile.topicProgress?.[topicId] ?? {
    topicId,
    stage: 'learn',
    completedChallengeIds: [],
    savedPracticeIds: [],
    confirmedQaIds: [],
    manualReview: false,
    lastVisited: new Date().toISOString(),
  };
}

function advancePracticeProgress(
  current: TopicProgress | undefined,
  topicId: string,
  challengeId: string,
  lastVisited: string,
): TopicProgress {
  const progress = current ?? {
    topicId,
    stage: 'learn' as const,
    completedChallengeIds: [],
    savedPracticeIds: [],
    confirmedQaIds: [],
    manualReview: false,
    lastVisited,
  };
  return {
    ...progress,
    stage: progress.stage === 'complete' ? 'complete' : 'practice',
    completedChallengeIds: Array.from(new Set([...progress.completedChallengeIds, challengeId])),
    lastVisited,
  };
}

function advanceStreak(profile: UnifiedProfile, nowIso: string): UnifiedProfile {
  const today = new Date(nowIso).toDateString();
  const last = new Date(profile.lastActiveAt).toDateString();
  if (today === last) {
    return { ...profile, streakDays: Math.max(1, profile.streakDays), lastActiveAt: nowIso, lastActiveDate: nowIso.slice(0, 10) };
  }
  const yesterday = new Date(new Date(nowIso).getTime() - 86400000).toDateString();
  return {
    ...profile,
    streakDays: last === yesterday ? profile.streakDays + 1 : 1,
    lastActiveAt: nowIso,
    lastActiveDate: nowIso.slice(0, 10),
  };
}

function stageRank(stage: TopicLoopStage): number {
  switch (stage) {
    case 'learn': return 0;
    case 'practice': return 1;
    case 'confirm': return 2;
    case 'complete': return 3;
    default: return assertNever(stage);
  }
}

function reconcileProfile(profile: UnifiedProfile): UnifiedProfile {
  return { ...profile, earnedCapabilities: reconcileCapabilities(profile) };
}

function assertNever(value: never): never {
  throw new Error(`Unhandled topic stage: ${String(value)}`);
}

function updateCanonicalProfile(profile: UnifiedProfile, updates: Partial<LearnerProfile>): UnifiedProfile {
  return {
    ...profile,
    ...(updates.name === undefined ? {} : { name: updates.name || 'Learner' }),
    ...(updates.level === undefined ? {} : { level: updates.level }),
    ...(updates.strengths === undefined ? {} : { strengths: updates.strengths }),
    ...(updates.weaknesses === undefined ? {} : { weaknesses: updates.weaknesses }),
    ...(updates.goals === undefined ? {} : { goals: updates.goals }),
    ...(updates.priorKnowledge === undefined ? {} : { priorKnowledge: updates.priorKnowledge }),
    ...(updates.preferredStyle === undefined ? {} : { preferredStyle: updates.preferredStyle }),
    ...(updates.communicationStyle === undefined ? {} : { communicationStyle: updates.communicationStyle }),
    ...(updates.paceMode === undefined ? {} : { paceMode: updates.paceMode }),
    ...(updates.focusArea === undefined ? {} : { focusArea: updates.focusArea }),
    ...(updates.confidence === undefined ? {} : { confidenceByTopic: updates.confidence }),
    ...(updates.diagnosticComplete === undefined ? {} : { diagnosticDone: updates.diagnosticComplete }),
  };
}
