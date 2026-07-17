import type { AssessmentSet, Question } from '@/domain/assessment';

export type AssessmentPageData = { readonly assessment: AssessmentSet; readonly questions: readonly Question[] };
