'use client';

import Link from 'next/link';
import { useState } from 'react';
import { evaluateAssessment } from '@/domain/assessment';
import { assessmentProfileLabel } from '@/domain/assessment';
import CodeBlock from '@/components/shared/CodeBlock';
import type { AssessmentPageData } from './types';
import type { AssessmentAttempt as ProgressAttempt, AssessmentAnswer, ProgressState } from '@/domain/progression/types';
import { addObjectiveReview, createInitialProgress, createTopicProgress, recordReviewAttempt, recordTopicQuiz } from '@/domain/progression/core';
import { createLocalProgressAdapter, loadProgress, saveProgress } from '@/infrastructure/local-progress';

const storageKey = 'js2next.local-progress';
const now = (): string => new Date().toISOString();
const makeId = (): string => `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function browserState(): { readonly state: ProgressState; readonly save: (state: ProgressState) => void } {
  const fallback = createInitialProgress('local-default', 'release-1-draft', now());
  if (typeof window === 'undefined') return { state: fallback, save: () => undefined };
  const adapter = createLocalProgressAdapter(window.localStorage, storageKey);
  return { state: loadProgress(adapter, fallback), save: (state) => saveProgress(adapter, state) };
}

function toStoredAttempt(data: AssessmentPageData, result: ReturnType<typeof evaluateAssessment>, completedAt: string): ProgressAttempt {
  const answers: readonly AssessmentAnswer[] = result.questionResults.map((item) => {
    const question = data.questions.find((candidate) => candidate.id === item.questionId);
    return { questionId: item.questionId, objectiveIds: question?.objectiveIds ?? [], answer: item.submittedChoiceId ?? '', correct: item.correct };
  });
  return { attemptId: makeId(), assessmentId: data.assessment.id, kind: data.assessment.kind, ownerId: data.assessment.kind === 'topic-quiz' ? (data.assessment.moduleId ?? data.assessment.id) : data.assessment.trackId, contentVersion: data.assessment.version, startedAt: completedAt, completedAt, scorePercent: result.scorePercent, passed: result.mastered, answers };
}

export function AssessmentRunner({ data, backHref }: { readonly data: AssessmentPageData; readonly backHref: string }) {
  const [answers, setAnswers] = useState<Readonly<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState<ReturnType<typeof evaluateAssessment> | null>(null);
  const [attempts, setAttempts] = useState(0);
  const submit = () => {
    const result = evaluateAssessment(data.assessment, data.questions, data.questions.map((question) => ({ questionId: question.id, choiceId: answers[question.id] })));
    const stored = toStoredAttempt(data, result, now());
    const current = browserState();
    let nextState = data.assessment.kind === 'topic-quiz'
      ? recordTopicQuiz(current.state, current.state.topicProgress[data.assessment.id.replace('-QUIZ', '')] ?? createTopicProgress(data.assessment.id.replace('-QUIZ', ''), data.assessment.version, [1, 2, 3].map((number) => `${data.assessment.id.replace('-QUIZ', '')}-Q0${number}`)), stored, result.missedObjectiveIds, null)
      : recordReviewAttempt(current.state, stored);
    if (!stored.passed) for (const question of data.questions) for (const objectiveId of question.objectiveIds) nextState = addObjectiveReview(nextState, question.topicId, objectiveId, stored.completedAt, 'incorrect-answer', 0, stored.completedAt);
    current.save(nextState);
    setSubmitted(result);
    setAttempts((value) => value + 1);
  };

  if (submitted !== null) {
    return <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="assessment-result-title">
      <section className="card space-y-4 p-6 sm:p-8">
        <p className="surface-eyebrow">Attempt {attempts}</p>
        <h1 id="assessment-result-title" className="surface-title">{Math.round(submitted.scorePercent)}% — {submitted.mastered ? 'Mastery reached' : 'Keep going'}</h1>
        <p className="surface-description">{submitted.mastered ? 'You reached the 80% mastery threshold.' : 'Review the feedback below, then retry as many times as you need.'}</p>
        <div className="flex flex-wrap gap-3"><button className="btn-primary" type="button" onClick={() => { setAnswers({}); setSubmitted(null); }}>Retry assessment</button><Link className="btn-secondary" href={backHref}>Back to learning</Link></div>
      </section>
      <section className="space-y-4" aria-label="Answer feedback">
        {data.questions.map((question, index) => { const result = submitted.questionResults.find((item) => item.questionId === question.id); return <article className="card space-y-3 p-5" key={question.id}><h2 className="font-semibold text-ink">{index + 1}. {question.prompt}</h2><p className={result?.correct ? 'text-success' : 'text-coral'}>{result?.correct ? 'Correct' : 'Needs another look'}</p><p className="text-sm leading-6 text-ink-light">{result?.choiceFeedback ?? 'No answer submitted.'}</p><p className="text-sm leading-6 text-ink-light">{result?.explanation}</p>{result?.hint && <p className="text-sm text-warning">Hint: {result.hint}</p>}</article>; })}
      </section>
    </main>;
  }

  return <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="assessment-title">
    <header><p className="surface-eyebrow">{data.assessment.kind === 'topic-quiz' && data.assessment.assessmentProfile ? assessmentProfileLabel(data.assessment.assessmentProfile.type) : data.assessment.kind.replace('-', ' ')}</p><h1 id="assessment-title" className="surface-title">{data.assessment.title}</h1><p className="surface-description">Five or more questions. Choices stay in source order; question order is stable for review.</p></header>
    <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); submit(); }}>
      {data.questions.map((question, index) => <fieldset className="card space-y-4 p-5 sm:p-6" key={question.id}><legend className="w-full font-semibold leading-6 text-ink">{index + 1}. {question.prompt}</legend>{question.code && <CodeBlock code={question.code.source} language={question.code.language} ariaLabel={`${question.code.language} assessment example`} />}<div className="space-y-2" role="radiogroup" aria-label={`Answers for question ${index + 1}`}>{question.choices.map((choice) => <label className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${answers[question.id] === choice.id ? 'border-teal bg-teal/10' : 'border-slate-secondary hover:border-teal/60'}`} key={choice.id}><input className="mt-1 h-4 w-4 accent-teal" type="radio" name={question.id} value={choice.id} checked={answers[question.id] === choice.id} onChange={() => setAnswers((current) => ({ ...current, [question.id]: choice.id }))} required /><span className="break-words text-sm leading-5 text-ink-light">{choice.label}</span></label>)}</div></fieldset>)}
      <button className="btn-primary w-full sm:w-auto" type="submit">Submit answers</button>
    </form>
  </main>;
}
