'use client';

import { useEffect, useState } from 'react';
import { addObjectiveReview, createInitialProgress, createTopicProgress, recordReviewAttempt, recordTopicQuiz } from '@/domain/progression/core';
import type { AssessmentResult, Question } from '@/domain/assessment';
import { createAttempt as createAssessmentAttempt, evaluateAssessment } from '@/domain/assessment';
import type { AssessmentAttempt as ProgressAttempt, ProgressState } from '@/domain/progression/types';
import { createLocalProgressAdapter, loadProgress, saveProgress } from '@/infrastructure/local-progress';
import { AssessmentView } from './assessment-view';
import type { AssessmentPageData } from './types';

const STORAGE_KEY = 'js2next.local-progress';

type AssessmentClientProps = { readonly data: AssessmentPageData; readonly backHref: string };

const now = (): string => new Date().toISOString();
const attemptId = (): string => `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function shuffled<T>(values: readonly T[]): readonly T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = result[index];
    const swap = result[swapIndex];
    if (current !== undefined && swap !== undefined) {
      result[index] = swap;
      result[swapIndex] = current;
    }
  }
  return result;
}

function fallbackProgress(): ProgressState {
  return createInitialProgress('local-default', 'release-1-draft', now());
}

function readProgress(): { readonly state: ProgressState; readonly save: (state: ProgressState) => void } {
  const fallback = fallbackProgress();
  const adapter = createLocalProgressAdapter(window.localStorage, STORAGE_KEY);
  return { state: loadProgress(adapter, fallback), save: (state) => saveProgress(adapter, state) };
}

function toProgressAttempt(data: AssessmentPageData, result: AssessmentResult, completedAt: string): ProgressAttempt {
  const answers = result.questionResults.map((item) => {
    const question = data.questions.find((candidate) => candidate.id === item.questionId);
    return { questionId: item.questionId, objectiveIds: question?.objectiveIds ?? [], answer: item.submittedChoiceId ?? '', correct: item.correct };
  });
  return { attemptId: attemptId(), assessmentId: data.assessment.id, kind: data.assessment.kind, ownerId: data.assessment.kind === 'topic-quiz' ? (data.questions[0]?.topicId ?? data.assessment.id) : data.assessment.kind === 'module-review' ? data.assessment.moduleId : data.assessment.trackId, contentVersion: data.assessment.version, startedAt: completedAt, completedAt, scorePercent: result.scorePercent, passed: result.mastered, answers };
}

function persistAttempt(data: AssessmentPageData, result: AssessmentResult): void {
  const completedAt = now();
  const stored = toProgressAttempt(data, result, completedAt);
  const current = readProgress();
  let next = data.assessment.kind === 'topic-quiz'
    ? recordTopicQuiz(current.state, current.state.topicProgress[data.questions[0]?.topicId ?? data.assessment.id] ?? createTopicProgress(data.questions[0]?.topicId ?? data.assessment.id, data.assessment.version, []), stored, result.missedObjectiveIds, null)
    : recordReviewAttempt(current.state, stored);
  const missedQuestions = result.questionResults.filter((questionResult) => !questionResult.correct);
  for (const resultItem of missedQuestions) {
    const question = data.questions.find((candidate) => candidate.id === resultItem.questionId);
    if (question !== undefined) for (const objectiveId of question.objectiveIds) next = addObjectiveReview(next, question.topicId, objectiveId, completedAt, 'incorrect-answer', 0, completedAt);
  }
  const immutableAttempt = createAssessmentAttempt({ attemptId: stored.attemptId, assessment: data.assessment, result, submittedAt: completedAt });
  void immutableAttempt;
  current.save(next);
}

export function AssessmentClient({ data, backHref }: AssessmentClientProps) {
  const [questions, setQuestions] = useState<readonly Question[]>(data.questions);
  const [answers, setAnswers] = useState<Readonly<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState<AssessmentResult | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setQuestions(shuffled(data.questions));
    const state = readProgress().state;
    setAttempts(state.assessmentAttempts.filter((attempt) => attempt.assessmentId === data.assessment.id).length);
  }, [data]);

  const answer = (questionId: string, choiceId: string): void => setAnswers((current) => ({ ...current, [questionId]: choiceId }));
  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const result = evaluateAssessment(data.assessment, data.questions, data.questions.map((question) => ({ questionId: question.id, choiceId: answers[question.id] })));
    persistAttempt(data, result);
    setSubmitted(result);
    setAttempts((count) => count + 1);
  };
  const retry = (): void => { setAnswers({}); setSubmitted(null); setQuestions(shuffled(data.questions)); };

  return <AssessmentView data={data} questions={questions} answers={answers} submitted={submitted} attempts={attempts} backHref={backHref} onAnswer={answer} onSubmit={submit} onRetry={retry} />;
}
