import type {
  ChallengeAnswer,
  ChallengeAttempt,
  UnifiedChallenge,
  UnifiedProfile,
} from './types';

export function scoreChallenge(challenge: UnifiedChallenge, answer: ChallengeAnswer): boolean {
  switch (challenge.checkType) {
    case 'choice':
      return typeof answer === 'number' && answer === challenge.correctIndex;
    case 'multi-choice':
      return arraysMatch(answer, challenge.correctIndices);
    case 'code-contains':
      return containsAll(answer, challenge.requiredSnippets);
    case 'free-text':
      return containsMost(answer, challenge.freeTextKeywords);
  }
}

export function updateMasteryFromChallenge(
  profile: UnifiedProfile,
  challenge: UnifiedChallenge,
  attempt: ChallengeAttempt,
  now: Date,
): UnifiedProfile {
  const previous = profile.masteryEstimates[challenge.topicId] ?? 0.2;
  const levelBoost = Math.min(challenge.level, 10) * 0.02;
  const delta = attempt.passed
    ? 0.12 + levelBoost - attempt.hintsUsed * 0.02 - (attempt.revealed ? 0.08 : 0)
    : attempt.revealed ? 0.02 : -0.04;
  const confidenceAdjustment = (clamp(attempt.confidence, 0, 1) - 0.5) * 0.05;
  const next = clamp(previous + delta + confidenceAdjustment, 0, 1);
  const reviewSchedule = scheduleReviewIfNeeded(profile, challenge.topicId, attempt, next, now);
  const priorRecord = profile.masteryRecords[challenge.topicId];
  const dueAt = reviewSchedule.find((item) => item.topicId === challenge.topicId)?.dueAt ?? now.toISOString();
  const confidence = clamp(attempt.confidence, 0, 1);
  const masteryRecord = {
    topicId: challenge.topicId,
    mastery: next,
    confidence,
    lastReviewed: now.toISOString(),
    attempts: (priorRecord?.attempts ?? 0) + 1,
    mistakes: attempt.passed ? [...(priorRecord?.mistakes ?? [])] : [...(priorRecord?.mistakes ?? []), challenge.id],
    timesReviewed: (priorRecord?.timesReviewed ?? 0) + 1,
    nextReviewDate: dueAt,
  };
  const completedTopics = next >= 0.8
    ? Array.from(new Set([...profile.completedTopics, challenge.topicId]))
    : profile.completedTopics;

  return {
    ...profile,
    masteryEstimates: { ...profile.masteryEstimates, [challenge.topicId]: next },
    confidenceByTopic: {
      ...profile.confidenceByTopic,
      [challenge.topicId]: confidence,
    },
    masteryRecords: { ...profile.masteryRecords, [challenge.topicId]: masteryRecord },
    completedTopics,
    reviewSchedule,
    challengeProgress: { ...profile.challengeProgress, [challenge.id]: attempt },
  };
}

function scheduleReviewIfNeeded(
  profile: UnifiedProfile,
  topicId: string,
  attempt: ChallengeAttempt,
  mastery: number,
  now: Date,
): UnifiedProfile['reviewSchedule'] {
  const needsReview = !attempt.passed || attempt.confidence < 0.55 || mastery < 0.8;
  if (!needsReview) return profile.reviewSchedule.filter((item) => item.topicId !== topicId);
  const intervalDays = !attempt.passed || mastery < 0.5 ? 1 : mastery < 0.7 ? 2 : 3;
  const due = new Date(now);
  due.setUTCDate(due.getUTCDate() + intervalDays);
  return [
    ...profile.reviewSchedule.filter((item) => item.topicId !== topicId),
    { topicId, dueAt: due.toISOString(), intervalDays },
  ];
}

function arraysMatch(answer: ChallengeAnswer, expected: readonly number[] | undefined): boolean {
  if (!Array.isArray(answer) || !expected || answer.length !== expected.length) return false;
  return expected.every((index) => answer.includes(index));
}

function containsAll(answer: ChallengeAnswer, snippets: readonly string[] | undefined): boolean {
  if (typeof answer !== 'string' || !snippets || snippets.length === 0) return false;
  const normalized = normalize(answer);
  return snippets.every((snippet) => normalized.includes(normalize(snippet)));
}

function containsMost(answer: ChallengeAnswer, keywords: readonly string[] | undefined): boolean {
  if (typeof answer !== 'string' || !keywords || keywords.length === 0) return false;
  const normalized = tokenize(answer);
  const hits = keywords.filter((keyword) => {
    const candidate = Array.from(tokenize(keyword));
    return candidate.length > 0 && candidate.every((token: string) => normalized.has(token));
  });
  return hits.length >= Math.ceil(keywords.length * 0.6);
}

function normalize(value: string): string {
  return value.replace(/\s+/g, '').toLowerCase();
}

function tokenize(value: string): Set<string> {
  return new Set(value.toLowerCase().match(/[a-z0-9]+/g) ?? []);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
