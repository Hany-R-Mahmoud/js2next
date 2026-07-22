export const PROGRESS_SCHEMA_VERSION = '1.0' as const;
export type ProgressSchemaVersion = typeof PROGRESS_SCHEMA_VERSION;
export type AssessmentBankVersion = 1 | 2;
export type ProgressStatus = 'not-started' | 'in-progress' | 'review-needed' | 'mastered';
export type AssessmentKind = 'topic-quiz' | 'module-review' | 'cumulative-review';
export type PracticeKind = 'topic-practice' | 'module-practice';

export interface CheckResponse {
  readonly response: string | number | readonly number[];
  readonly correct?: boolean;
  readonly answeredAt: string;
  readonly contentVersion: number;
}

export interface AssessmentAnswer {
  readonly questionId: string;
  readonly objectiveIds: readonly string[];
  readonly answer: string | number | readonly number[];
  readonly correct: boolean;
}

export interface AssessmentAttempt {
  readonly attemptId: string;
  readonly assessmentId: string;
  readonly kind: AssessmentKind;
  readonly ownerId: string;
  readonly contentVersion: number;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly scorePercent: number;
  readonly passed: boolean;
  readonly answers: readonly AssessmentAnswer[];
}

export interface PracticeAttempt {
  readonly attemptId: string;
  readonly kind: PracticeKind;
  readonly ownerId: string;
  readonly contentVersion: number;
  readonly completedAt: string;
  readonly questionIds: readonly string[];
  readonly answeredQuestionIds: readonly string[];
  readonly correctCount: number;
}

export interface ReflectionEntry {
  readonly id: string;
  readonly ownerId: string;
  readonly kind: 'topic-reflection' | 'module-reflection';
  readonly retrieval: string;
  readonly application: string;
  readonly confidence: number;
  readonly submittedAt: string;
}

export interface ReviewItem {
  readonly topicId: string;
  readonly objectiveId: string;
  readonly dueAt: string;
  readonly reason: 'incorrect-answer' | 'low-mastery' | 'manual-review';
  readonly confidence: number;
  readonly attempts: number;
  readonly lastActivity: string;
}

export interface TopicProgress {
  readonly topicId: string;
  readonly contentVersion: number;
  readonly lessonCompleted: boolean;
  readonly requiredCheckIds: readonly string[];
  readonly attemptedCheckIds: readonly string[];
  readonly checkResponses: Readonly<Record<string, CheckResponse>>;
  readonly quizAttempts: readonly string[];
  readonly quizPercent: number;
  readonly masteryPercent: number;
  readonly status: ProgressStatus;
  readonly missedObjectiveIds: readonly string[];
  readonly confidence: number | null;
  readonly lastActivity: string | null;
}

export interface ModuleProgress {
  readonly moduleId: string;
  readonly requiredTopicIds: readonly string[];
  readonly masteredTopicIds: readonly string[];
  readonly reviewPercent: number;
  readonly complete: boolean;
}

export interface TrackProgress {
  readonly trackId: string;
  readonly requiredModuleIds: readonly string[];
  readonly completeModuleIds: readonly string[];
  readonly reviewPercent: number;
  readonly complete: boolean;
}

export interface LegacyProgressRecord {
  readonly imported: boolean;
  readonly countsTowardNewMastery: false;
  readonly exportReference: string | null;
}

export interface AssessmentV1Archive {
  readonly namespace: 'assessment-v1';
  readonly archivedAt: string;
  readonly attempts: readonly AssessmentAttempt[];
  readonly topicProgress: Readonly<Record<string, TopicProgress>>;
  readonly moduleProgress?: Readonly<Record<string, ModuleProgress>>;
  readonly trackProgress?: Readonly<Record<string, TrackProgress>>;
  readonly reviewQueue: readonly ReviewItem[];
}

export interface ProgressState {
  readonly schemaVersion: ProgressSchemaVersion;
  readonly profileId: string;
  readonly curriculumVersion: string;
  readonly topicProgress: Readonly<Record<string, TopicProgress>>;
  readonly moduleProgress?: Readonly<Record<string, ModuleProgress>>;
  readonly trackProgress?: Readonly<Record<string, TrackProgress>>;
  readonly assessmentAttempts: readonly AssessmentAttempt[];
  readonly practiceAttempts?: readonly PracticeAttempt[];
  readonly reflections?: readonly ReflectionEntry[];
  readonly reviewQueue: readonly ReviewItem[];
  readonly legacyProgress: LegacyProgressRecord;
  readonly assessmentBankVersion?: AssessmentBankVersion;
  readonly assessmentV1Archive?: AssessmentV1Archive;
  readonly updatedAt: string;
}

export interface TopicDefinition { readonly id: string; readonly required: boolean; readonly contentVersion: number; }
export interface ModuleDefinition { readonly id: string; readonly required: boolean; readonly topicIds: readonly TopicDefinition[]; }
export interface TrackDefinition { readonly id: string; readonly required: boolean; readonly modules: readonly ModuleDefinition[]; }
export interface CurriculumDefinition { readonly tracks: readonly TrackDefinition[]; }

export interface PrerequisiteWarning {
  readonly prerequisiteId: string;
  readonly masteryPercent: number;
  readonly canContinue: true;
  readonly requiresExplicitConfirmation: false;
}
