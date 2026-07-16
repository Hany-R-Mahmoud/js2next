import type { Challenge } from '@/types';
import { challengeContentId, getChallengeTopicId } from '@/lib/content/identity';
import type { UnifiedChallenge } from './types';

export function toUnifiedChallenge(challenge: Challenge): UnifiedChallenge | null {
  if (!challenge.checkType || !challenge.prompt) return null;
  const topicId = getChallengeTopicId(challenge);
  if (!topicId) return null;

  return {
    id: challengeContentId(challenge.slug),
    topicId,
    level: challenge.level,
    checkType: challenge.checkType,
    ...(challenge.correctIndex === undefined ? {} : { correctIndex: challenge.correctIndex }),
    ...(challenge.correctIndices === undefined ? {} : { correctIndices: challenge.correctIndices }),
    ...(challenge.requiredSnippets === undefined ? {} : { requiredSnippets: challenge.requiredSnippets }),
    ...(challenge.freeTextKeywords === undefined ? {} : { freeTextKeywords: challenge.freeTextKeywords }),
  };
}

export interface ChallengeLadderRubric {
  readonly level: Challenge['level'];
  readonly criteria: readonly string[];
  readonly hints: readonly { stage: number; text: string }[];
  readonly expectedReasoning: string;
  readonly commonWrongPaths: readonly string[];
}

export function getChallengeLadderRubric(challenge: Challenge): ChallengeLadderRubric {
  return {
    level: challenge.level,
    criteria: [...challenge.acceptanceCriteria],
    hints: challenge.hints.map((hint) => ({ ...hint })),
    expectedReasoning: challenge.expectedReasoning,
    commonWrongPaths: [...challenge.commonWrongPaths],
  };
}
