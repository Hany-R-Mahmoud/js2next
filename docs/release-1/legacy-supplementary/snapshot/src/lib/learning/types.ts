export type UnifiedLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type ChallengeCheck = 'choice' | 'multi-choice' | 'code-contains' | 'free-text';

export type ChallengeAnswer = string | number | readonly number[];

export interface UnifiedChallenge {
  readonly id: string;
  readonly topicId: string;
  readonly level: number;
  readonly checkType: ChallengeCheck;
  readonly correctIndex?: number;
  readonly correctIndices?: readonly number[];
  readonly requiredSnippets?: readonly string[];
  readonly freeTextKeywords?: readonly string[];
}

export interface ChallengeAttempt {
  readonly challengeId: string;
  readonly attempts: number;
  readonly hintsUsed: number;
  readonly revealed: boolean;
  readonly passed: boolean;
  readonly confidence: number;
  readonly lastAnswer?: string;
  readonly scored?: boolean;
  readonly outcome?: 'passed' | 'failed' | 'unscored';
  readonly updatedAt: string;
}

export interface LessonProgress {
  readonly topicId: string;
  readonly stepIndex: number;
  readonly diagnosticAnswered: boolean;
  readonly completed: boolean;
  readonly confidence: number;
  readonly lastVisited: string;
  readonly chunkProgress?: Readonly<Record<string, {
    readonly answered: boolean;
    readonly correct: boolean;
    readonly answer?: string;
  }>>;
  readonly answerProgress?: Readonly<Record<string, {
    readonly answer: string;
    readonly attempts: number;
    readonly hintsRequested: number;
    readonly revealed: boolean;
    readonly correct?: boolean;
    readonly feedback?: string;
  }>>;
  readonly miniProjectDraft?: string;
  readonly miniProjectSubmitted?: boolean;
  readonly reflection?: string;
}

export type TopicLoopStage = 'learn' | 'practice' | 'confirm' | 'complete';

export interface TopicProgress {
  readonly topicId: string;
  readonly stage: TopicLoopStage;
  readonly completedChallengeIds: readonly string[];
  readonly savedPracticeIds?: readonly string[];
  readonly confirmedQaIds: readonly string[];
  readonly manualReview: boolean;
  readonly lastVisited: string;
  readonly lastReviewCompletedAt?: string;
  readonly reflectStarted?: boolean;
}

export type LearningEvent =
  | {
      readonly type: 'lesson-completed';
      readonly topicId: string;
      readonly confidence: number;
      readonly mastery: number;
      readonly occurredAt: string;
    }
  | {
      readonly type: 'challenge-attempted';
      readonly topicId: string;
      readonly challengeId: string;
      readonly confidence: number;
      readonly passed: boolean;
      readonly hintsUsed: number;
      readonly occurredAt: string;
    }
  | {
      readonly type: 'qa-confirmed';
      readonly topicId: string;
      readonly qaId: string;
      readonly confidence: number;
      readonly occurredAt: string;
    }
  | {
      readonly type: 'topic-completed';
      readonly topicId: string;
      readonly mastery: number;
      readonly confidence: number;
      readonly occurredAt: string;
    };

export interface UnifiedProfile {
  readonly version: 3;
  readonly name: string;
  readonly level: UnifiedLevel;
  readonly diagnosticDone: boolean;
  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];
  readonly goals: readonly string[];
  readonly priorKnowledge: readonly string[];
  readonly preferredStyle: 'visual' | 'verbal' | 'active' | 'reflective';
  readonly communicationStyle: 'socratic' | 'direct' | 'storytelling';
  readonly paceMode: 'standard' | 'accelerated' | 'deep-dive';
  readonly diagnosticAnswers: readonly { questionId: string; answer: string; confidence: number }[];
  readonly masteryEstimates: Readonly<Record<string, number>>;
  readonly confidenceByTopic: Readonly<Record<string, number>>;
  readonly masteryRecords: Readonly<Record<string, {
    readonly topicId: string;
    readonly mastery: number;
    readonly confidence: number;
    readonly lastReviewed: string;
    readonly attempts: number;
    readonly mistakes: readonly string[];
    readonly timesReviewed: number;
    readonly nextReviewDate: string;
  }>>;
  readonly completedTopics: readonly string[];
  readonly reviewSchedule: readonly {
    readonly topicId: string;
    readonly dueAt: string;
    readonly intervalDays: number;
  }[];
  readonly challengeProgress: Readonly<Record<string, ChallengeAttempt>>;
  readonly lessonProgress: Readonly<Record<string, LessonProgress>>;
  readonly topicProgress?: Readonly<Record<string, TopicProgress>>;
  readonly focusArea?: string;
  readonly learningEvents?: readonly LearningEvent[];
  readonly earnedCapabilities: readonly string[];
  readonly streakDays: number;
  readonly lastActiveAt: string;
  readonly lastActiveDate: string | null;
}
