'use client';

import { useEffect, useState } from 'react';
import ky from 'ky';
import { addObjectiveReview, createTopicProgress, recordReviewAttempt, recordTopicQuiz } from '@/domain/progression/core';
import type { AssessmentResult } from '@/domain/assessment';
import { createAttempt as createAssessmentAttempt } from '@/domain/assessment';
import type { AssessmentAttempt as ProgressAttempt } from '@/domain/progression/types';
import { readProgress, updateProgress } from '@/components/progress/useProgressState';
import { AssessmentView } from './assessment-view';
import type { AssessmentPageData, PublicQuestion } from './types';

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
  updateProgress((current) => {
    let next = data.assessment.kind === 'topic-quiz'
      ? recordTopicQuiz(current, current.topicProgress[data.questions[0]?.topicId ?? data.assessment.id] ?? createTopicProgress(data.questions[0]?.topicId ?? data.assessment.id, data.assessment.version, []), stored, result.missedObjectiveIds, null)
      : recordReviewAttempt(current, stored);
    const missedQuestions = result.questionResults.filter((questionResult) => !questionResult.correct);
    for (const resultItem of missedQuestions) {
      const question = data.questions.find((candidate) => candidate.id === resultItem.questionId);
      if (question !== undefined) for (const objectiveId of question.objectiveIds) next = addObjectiveReview(next, question.topicId, objectiveId, completedAt, 'incorrect-answer', 0, completedAt);
    }
    const immutableAttempt = createAssessmentAttempt({ attemptId: stored.attemptId, assessment: data.assessment, result, submittedAt: completedAt });
    void immutableAttempt;
    return next;
  });
}

export function AssessmentClient({ data, backHref }: AssessmentClientProps) {
  const [questions, setQuestions] = useState<readonly PublicQuestion[]>(data.questions);
  const [answers, setAnswers] = useState<Readonly<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState<AssessmentResult | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setQuestions(shuffled(data.questions));
    const state = readProgress();
    setAttempts(state.assessmentAttempts.filter((attempt) => attempt.assessmentId === data.assessment.id).length);
  }, [data]);

  const answer = (questionId: string, choiceId: string): void => setAnswers((current) => ({ ...current, [questionId]: choiceId }));
  const submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      const result = await ky.post(`/api/member/assessments/${encodeURIComponent(data.assessment.id)}/attempts`, { json: { answers: data.questions.map((question) => ({ questionId: question.id, choiceId: answers[question.id] })) } }).json<AssessmentResult>();
      persistAttempt(data, result);
      setSubmitted(result);
      setAttempts((count) => count + 1);
    } catch {
      setSubmitted(null);
    }
  };
  const retry = (): void => { setAnswers({}); setSubmitted(null); setQuestions(shuffled(data.questions)); };

  return <AssessmentView data={data} questions={questions} answers={answers} submitted={submitted} attempts={attempts} backHref={backHref} onAnswer={answer} onSubmit={submit} onRetry={retry} />;
}
