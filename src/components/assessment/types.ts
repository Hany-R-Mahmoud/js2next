import type { AssessmentSet, Choice, Question } from '@/domain/assessment';

export type PublicChoice = Omit<Choice, 'feedback'>;
export type PublicQuestion = Omit<Question, 'correctChoiceIds' | 'choices' | 'explanation' | 'hint'> & { readonly choices: readonly PublicChoice[] };
export type AssessmentPageData = { readonly assessment: AssessmentSet; readonly questions: readonly PublicQuestion[] };
