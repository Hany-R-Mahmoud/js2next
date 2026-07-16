export type Level = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type TopicFamily =
  | 'foundations'
  | 'react-mental-model'
  | 'state-behavior'
  | 'app-quality'
  | 'nextjs-foundations'
  | 'rsc-client'
  | 'nextjs-data'
  | 'production'
  | 'architecture';

export interface LearnerProfile {
  name: string;
  level: Level;
  strengths: string[];
  weaknesses: string[];
  goals: string[];
  priorKnowledge: string[];
  preferredStyle: 'visual' | 'verbal' | 'active' | 'reflective';
  communicationStyle: 'socratic' | 'direct' | 'storytelling';
  paceMode: 'standard' | 'accelerated' | 'deep-dive';
  focusArea?: string;
  confidence: Record<string, number>;
  diagnosticComplete: boolean;
}

export interface MasteryState {
  topicId: string;
  mastery: number;
  confidence: number;
  lastReviewed: string;
  attempts: number;
  mistakes: string[];
  timesReviewed: number;
  nextReviewDate: string;
}

export interface LessonSection {
  id: string;
  type: 'concept' | 'code-example' | 'question' | 'synthesis' | 'diagram';
  title?: string;
  content: string;
  code?: string;
  codeLanguage?: string;
  codeFilePath?: string;
  questions?: DiagnosticQuestion[];
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  expectedReasoning?: string;
  commonMisconceptions?: string[];
}

export interface Lesson {
  slug: string;
  title: string;
  topicFamily: TopicFamily;
  level: Level;
  prerequisites: string[];
  learningObjectives: string[];
  whyMatters: string;
  estimatedMinutes: number;
  sections: LessonSection[];
  chunks?: LessonChunk[];
  miniProject?: MiniProject;
  diagram?: LessonDiagram;
  retrievalPrompt: string;
  reflectionPrompt: string;
  masteryCriteria: string[];
  nextTopics: string[];
  metadata: {
    reactVersion?: string;
    nextVersion?: string;
    lastUpdated: string;
    sources: string[];
  };
}

export interface LessonChunk {
  id: string;
  title: string;
  concept: string;
  prediction: {
    prompt: string;
    options: string[];
    correctAnswer: string;
    feedbackCorrect: string;
    feedbackWrong: string;
  };
  synthesis: string;
}

export interface MiniProject {
  title: string;
  scenario: string;
  acceptance: string[];
  rubric?: MiniProjectRubric[];
}

export interface MiniProjectRubric {
  dimension: string;
  evidence: string;
}

export interface LessonDiagram {
  title: string;
  kind: 'flow' | 'layers' | 'tree';
  nodes: { id: string; label: string; role?: string }[];
  edges: { from: string; to: string; label?: string }[];
}

export interface Challenge {
  slug: string;
  title: string;
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  topicFamily: TopicFamily;
  scenario: string;
  constraints: string[];
  acceptanceCriteria: string[];
  hints: { stage: number; text: string }[];
  expectedReasoning: string;
  commonWrongPaths: string[];
  answerExplanation: string;
  followUpVariation: string;
  starterCode?: string;
  testCases?: { input: string; expected: string }[];
  checkType?: 'choice' | 'multi-choice' | 'code-contains' | 'free-text';
  prompt?: string;
  options?: string[];
  correctIndex?: number;
  correctIndices?: number[];
  requiredSnippets?: string[];
  freeTextKeywords?: string[];
  sourceLink?: string;
  sourceLinks?: string[];
}

export interface QAItem {
  id: string;
  topicId: string;
  topicFamily: TopicFamily;
  question: string;
  answer: string;
  options?: string[];
  correctIndex?: number;
  followUp: string;
  category: 'react' | 'nextjs' | 'debugging' | 'architecture' | 'performance' | 'testing' | 'accessibility';
  level: Level;
  tags: string[];
  sourceLink?: string;
  sourceLinks?: string[];
}

export interface BestPractice {
  id: string;
  topicId: string;
  topicFamily: TopicFamily;
  title: string;
  summary: string;
  rationale: string;
  tradeOffs: string;
  appliesWhen: string;
  doesNotApplyWhen: string;
  example: string;
  sourceLink?: string;
  sourceLinks?: string[];
  reactVersion?: string;
  nextVersion?: string;
  tags: string[];
}

export interface ProgressSnapshot {
  totalTopics: number;
  completed: number;
  mastery: Record<string, number>;
  streak: number;
  lastActive: string;
  reviewQueue: string[];
  earnedCapabilities: string[];
}
