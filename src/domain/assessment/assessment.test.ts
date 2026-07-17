import { describe, expect, it } from 'vitest';
import {
  AssessmentValidationError,
  AssessmentEvaluationError,
  appendAttempt,
  createAttempt,
  evaluateAssessment,
  parseAssessmentSet,
  parseQuestion,
} from './index';
import type { AssessmentSet } from './index';

const question = parseQuestion({
  id: 'JS-01-Q01', trackId: 'javascript', moduleId: 'JS-M01', topicId: 'JS-01',
  objectiveIds: ['JS-01-LO1'], kind: 'single-choice', presentation: 'code',
  prompt: 'Which choice is correct?', code: { language: 'js', source: 'const value = 1;' },
  choices: [
    { id: 'a', label: 'First choice', feedback: 'The first choice is incorrect.' },
    { id: 'b', label: 'Second choice', feedback: 'The second choice is correct.' },
    { id: 'c', label: 'Third choice', feedback: 'The third choice is incorrect.' },
    { id: 'd', label: 'Fourth choice', feedback: 'The fourth choice is incorrect.' },
  ],
  correctChoiceIds: ['b'], explanation: 'The second choice is correct because it matches the rule.',
  hint: 'Check the stated rule.', difficulty: 1, cognitiveLevel: 'recognize', version: 2,
  status: 'draft', reviewStatus: 'pending-human-review', assessmentMode: 'code-reading', practical: true, assessmentPolicyVersion: '2.0',
});

const set = parseAssessmentSet({
  schemaVersion: '2.0', assessmentPolicyVersion: '2.0', id: 'JS-01-QUIZ', kind: 'topic-quiz', trackId: 'javascript',
  moduleId: 'JS-M01', title: 'Topic quiz', questionIds: ['JS-01-Q01', 'JS-01-Q02', 'JS-01-Q03', 'JS-01-Q04', 'JS-01-Q05'],
  masteryThresholdPercent: 80, attemptPolicy: 'unlimited', version: 2,
  status: 'draft', reviewStatus: 'pending-human-review',
});
const questions = [question, ...['02', '03', '04', '05'].map((suffix) => ({ ...question, id: `JS-01-Q${suffix}` }))];

const evaluate = (submittedChoiceId: string | undefined) => evaluateAssessment(set, questions, [
  { questionId: question.id, choiceId: submittedChoiceId },
]);

describe('assessment domain', () => {
  it('scores zero, partial, and full submissions deterministically', () => {
    expect(evaluate('a')).toMatchObject({ scorePercent: 0, mastered: false, submittedCount: 1 });
    expect(evaluate('b')).toMatchObject({ scorePercent: 100, mastered: true, submittedCount: 1 });
    expect(evaluate(undefined)).toMatchObject({ scorePercent: 0, mastered: false, submittedCount: 0 });
    expect(evaluateAssessment(set, questions, [
      { questionId: 'JS-01-Q01', choiceId: 'a' },
      { questionId: 'JS-01-Q02', choiceId: 'b' },
    ])).toMatchObject({ scorePercent: 50, mastered: false, submittedCount: 2 });
  });

  it('rejects invalid choices and malformed question correctness', () => {
    expect(() => evaluate('missing')).toThrow(AssessmentEvaluationError);
    expect(() => parseQuestion({ ...question, correctChoiceIds: ['a', 'b'] })).toThrow(AssessmentValidationError);
  });

  it('returns explanation, hint, choice feedback, and missed objectives', () => {
    const result = evaluate('a');
    expect(result.questionResults[0]).toMatchObject({
      submittedChoiceId: 'a', correct: false, explanation: question.explanation,
      hint: question.hint, choiceFeedback: 'The first choice is incorrect.',
      missedObjectiveIds: ['JS-01-LO1'],
    });
  });

  it('keeps failed retries as immutable versioned attempts', () => {
    const failed = createAttempt({
      attemptId: 'attempt-1', assessment: set, result: evaluate('a'),
      submittedAt: '2026-07-17T00:00:00.000Z',
    });
    const passed = createAttempt({
      attemptId: 'attempt-2', assessment: set, result: evaluate('b'),
      submittedAt: '2026-07-17T00:01:00.000Z',
    });
    expect(failed).toMatchObject({ assessmentVersion: 2, mastered: false, scorePercent: 0 });
    expect(passed).toMatchObject({ assessmentVersion: 2, mastered: true, scorePercent: 100 });
    expect(failed.submissions).not.toBe(passed.submissions);
    const history = appendAttempt(appendAttempt([], failed), passed);
    expect(history).toEqual([failed, passed]);
  });

  it('models topic, module, and cumulative sets', () => {
    const kinds: readonly AssessmentSet['kind'][] = ['topic-quiz', 'module-review', 'cumulative-review'];
    expect(kinds).toHaveLength(3);
  });

  it('preserves code as display data only', () => {
    expect(question.code).toEqual({ language: 'js', source: 'const value = 1;' });
    expect(Object.keys(question.code ?? {})).toEqual(['language', 'source']);
  });
});
