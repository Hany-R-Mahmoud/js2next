import { AssessmentEvaluationError } from './errors';
import type { AssessmentAttempt, AssessmentResult, AssessmentSet, Choice, CreateAttemptInput, Question, QuestionResult, SubmittedAnswer } from './types';

const choiceFor = (question: Question, choiceId: string | undefined): Choice | undefined => question.choices.find((choice) => choice.id === choiceId);
export const evaluateQuestion = (question: Question, submittedChoiceId?: string): QuestionResult => {
  if (submittedChoiceId !== undefined && choiceFor(question, submittedChoiceId) === undefined) throw new AssessmentEvaluationError(`invalid choice ${submittedChoiceId}`, question.id);
  const correct = submittedChoiceId !== undefined && question.correctChoiceIds[0] === submittedChoiceId; const choice = choiceFor(question, submittedChoiceId);
  return { questionId: question.id, ...(submittedChoiceId === undefined ? {} : { submittedChoiceId }), correct, explanation: question.explanation, ...(question.hint === undefined ? {} : { hint: question.hint }), ...(choice === undefined ? {} : { choiceFeedback: choice.feedback }), missedObjectiveIds: correct ? [] : [...question.objectiveIds] };
};

export const evaluateAssessment = (assessment: AssessmentSet, questions: readonly Question[], submissions: readonly SubmittedAnswer[]): AssessmentResult => {
  const questionMap = new Map(questions.map((question) => [question.id, question])); const answers = new Map<string, SubmittedAnswer>();
  for (const submission of submissions) { if (answers.has(submission.questionId)) throw new AssessmentEvaluationError(`duplicate submission ${submission.questionId}`); if (!assessment.questionIds.includes(submission.questionId)) throw new AssessmentEvaluationError(`question is not in assessment: ${submission.questionId}`); answers.set(submission.questionId, submission); }
  const questionResults: QuestionResult[] = [];
  for (const questionId of assessment.questionIds) { const question = questionMap.get(questionId); if (question === undefined) throw new AssessmentEvaluationError(`missing question ${questionId}`, questionId); const submission = answers.get(questionId); if (submission?.choiceId !== undefined) questionResults.push(evaluateQuestion(question, submission.choiceId)); }
  const correctCount = questionResults.filter((result) => result.correct).length; const submittedCount = questionResults.length; const scorePercent = submittedCount === 0 ? 0 : (correctCount / submittedCount) * 100;
  return { assessmentId: assessment.id, assessmentVersion: assessment.version, submittedCount, correctCount, scorePercent, mastered: scorePercent >= assessment.masteryThresholdPercent, missedObjectiveIds: [...new Set(questionResults.flatMap((result) => result.missedObjectiveIds))], questionResults };
};

export const createAttempt = ({ attemptId, assessment, result, submittedAt }: CreateAttemptInput): AssessmentAttempt => {
  if (result.assessmentId !== assessment.id || result.assessmentVersion !== assessment.version) throw new AssessmentEvaluationError('result does not match assessment version');
  if (attemptId.length === 0 || submittedAt.length === 0) throw new AssessmentEvaluationError('attempt identity and timestamp are required');
  const submissions = result.questionResults.map((question) => ({ questionId: question.questionId, ...(question.submittedChoiceId === undefined ? {} : { choiceId: question.submittedChoiceId }) }));
  return { attemptId, assessmentId: assessment.id, assessmentVersion: assessment.version, submittedAt, submissions: Object.freeze(submissions), scorePercent: result.scorePercent, mastered: result.mastered, missedObjectiveIds: Object.freeze([...result.missedObjectiveIds]) };
};

export const appendAttempt = (attempts: readonly AssessmentAttempt[], attempt: AssessmentAttempt): readonly AssessmentAttempt[] => Object.freeze([...attempts, attempt]);
