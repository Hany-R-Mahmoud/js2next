export const ASSESSMENT_KINDS = ['topic-quiz', 'module-review', 'cumulative-review'] as const;
export type AssessmentKind = (typeof ASSESSMENT_KINDS)[number];
export type TrackId = 'javascript' | 'react' | 'nextjs';
export type QuestionStatus = 'draft' | 'reviewed' | 'published' | 'retired';
export type ReviewStatus = 'pending-human-review' | 'approved' | 'needs-revision';
export type CognitiveLevel = 'recognize' | 'explain' | 'predict' | 'apply' | 'debug' | 'tradeoff' | 'synthesize' | 'transfer';
export type AssessmentProfileType = 'conceptual' | 'workflow' | 'hybrid' | 'coding';
export type AssessmentMode = 'conceptual-review' | 'scenario-reasoning' | 'conceptual-comparison' | 'code-reading' | 'code-verification' | 'debugging' | 'code-analysis' | 'implementation-choice' | 'workflow-artifact' | 'workflow-scenario' | 'engineering-judgment' | 'architecture-tradeoff' | 'workflow-judgment' | 'conceptual-judgment';

export type AssessmentProfile = {
  readonly version: '2.0';
  readonly type: AssessmentProfileType;
  readonly label: string;
  readonly rationale: string;
  readonly topicQuizMix: Readonly<Record<string, number>>;
  readonly inLessonPolicy: string;
  readonly topicQuizPolicy: string;
};

export type DisplayCode = { readonly language: string; readonly source: string };
export type Choice = { readonly id: string; readonly label: string; readonly feedback: string };
export type Question = {
  readonly id: string; readonly trackId: TrackId; readonly moduleId: string; readonly topicId: string;
  readonly objectiveIds: readonly string[]; readonly kind: 'single-choice'; readonly presentation: 'text' | 'code';
  readonly prompt: string; readonly code?: DisplayCode; readonly choices: readonly Choice[];
  readonly correctChoiceIds: readonly [string]; readonly explanation: string; readonly hint?: string;
  readonly difficulty: 1 | 2 | 3 | 4 | 5; readonly cognitiveLevel: CognitiveLevel; readonly estimatedSeconds?: number;
  readonly tags?: readonly string[]; readonly version: 2; readonly status: QuestionStatus; readonly reviewStatus: ReviewStatus;
  readonly assessmentMode: AssessmentMode; readonly practical: boolean; readonly assessmentPolicyVersion: '2.0';
};
type AssessmentSetBase = {
  readonly schemaVersion: '2.0'; readonly id: string; readonly trackId: TrackId; readonly title: string;
  readonly questionIds: readonly string[]; readonly masteryThresholdPercent: 80; readonly attemptPolicy: 'unlimited';
  readonly version: 2; readonly status: QuestionStatus; readonly reviewStatus: ReviewStatus; readonly assessmentPolicyVersion: '2.0';
  readonly presentationMix?: Readonly<Record<string, number>>; readonly assessmentModeMix?: Readonly<Record<string, number>>;
};
export type TopicQuiz = AssessmentSetBase & { readonly kind: 'topic-quiz'; readonly moduleId?: string; readonly assessmentProfile?: AssessmentProfile };
export type ModuleReview = AssessmentSetBase & { readonly kind: 'module-review'; readonly moduleId: string };
export type CumulativeReview = AssessmentSetBase & { readonly kind: 'cumulative-review' };
export type AssessmentSet = TopicQuiz | ModuleReview | CumulativeReview;
export type SubmittedAnswer = { readonly questionId: string; readonly choiceId?: string };
export type QuestionResult = {
  readonly questionId: string; readonly submittedChoiceId?: string; readonly correct: boolean; readonly explanation: string;
  readonly hint?: string; readonly choiceFeedback?: string; readonly correctChoiceLabel?: string; readonly missedObjectiveIds: readonly string[];
};
export type AssessmentResult = {
  readonly assessmentId: string; readonly assessmentVersion: number; readonly submittedCount: number; readonly correctCount: number;
  readonly scorePercent: number; readonly mastered: boolean; readonly missedObjectiveIds: readonly string[];
  readonly questionResults: readonly QuestionResult[];
};
export type AssessmentAttempt = {
  readonly attemptId: string; readonly assessmentId: string; readonly assessmentVersion: number; readonly submittedAt: string;
  readonly submissions: readonly SubmittedAnswer[]; readonly scorePercent: number; readonly mastered: boolean;
  readonly missedObjectiveIds: readonly string[];
};
export type CreateAttemptInput = { readonly attemptId: string; readonly assessment: AssessmentSet; readonly result: AssessmentResult; readonly submittedAt: string };
