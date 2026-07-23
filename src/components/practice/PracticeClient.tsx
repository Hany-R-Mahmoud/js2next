'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { recordPracticeAttempt } from '@/domain/progression/core';
import type { PracticeAttempt } from '@/domain/progression/types';
import CodeBlock from '@/components/shared/CodeBlock';
import InlineMarkdown from '@/components/shared/InlineMarkdown';
import { updateProgress } from '@/components/progress/useProgressState';
import type { PracticeSet } from './types';
import ky from 'ky';

type PracticeClientProps = { readonly set: PracticeSet; readonly backHref: string };
type AnswerState = { readonly questionId: string; readonly choiceId: string; readonly correct: boolean };
type PracticeResult = { readonly correct: boolean; readonly explanation: string; readonly choiceFeedback?: string; readonly hint?: string };

export default function PracticeClient({ set, backHref }: PracticeClientProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<readonly AnswerState[]>([]);
  const [selected, setSelected] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<PracticeResult | null>(null);
  const [complete, setComplete] = useState(false);
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const question = set.questions[index];

  useEffect(() => {
    if (!submitted) return;
    actionButtonRef.current?.scrollIntoView({ block: 'center', inline: 'nearest' });
    actionButtonRef.current?.focus({ preventScroll: true });
  }, [submitted]);

  if (complete) return <PracticeComplete set={set} correctCount={answers.filter((answer) => answer.correct).length} backHref={backHref} />;
  if (!question) return <p className="text-sm text-ink-light">Practice content is being prepared for this topic.</p>;

  const isCorrect = submittedResult?.correct === true;

  const submit = async () => {
    if (selected === undefined || submitted) return;
    const result = await ky.post('/api/member/practice', { json: { ownerId: set.ownerId, questionId: question.id, choiceId: selected } }).json<PracticeResult>();
    setAnswers((current) => [...current.filter((item) => item.questionId !== question.id), { questionId: question.id, choiceId: selected, correct: result.correct }]);
    setSubmittedResult(result);
    setSubmitted(true);
  };

  const retry = () => {
    if (!submitted || isCorrect) return;
    setSelected(undefined);
    setSubmitted(false);
    setSubmittedResult(null);
  };

  const next = () => {
    if (!submitted) return;
    if (index === set.questions.length - 1) {
      const completedAt = new Date().toISOString();
      const attempt: PracticeAttempt = { attemptId: `practice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, kind: set.kind, ownerId: set.ownerId, contentVersion: 2, completedAt, questionIds: set.questions.map((item) => item.id), answeredQuestionIds: [...answers.map((item) => item.questionId), question.id], correctCount: answers.filter((item) => item.correct).length + (isCorrect ? 1 : 0) };
      updateProgress((state) => recordPracticeAttempt(state, attempt));
      setComplete(true);
      return;
    }
    setIndex((current) => current + 1);
    setSelected(undefined);
    setSubmitted(false);
    setSubmittedResult(null);
  };

  return <section className="card space-y-5 p-6" aria-labelledby="practice-title">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="surface-eyebrow">Guided practice</p><h2 id="practice-title" className="mt-2 text-2xl font-bold text-ink">{set.title}</h2></div><span className="text-sm text-ink-muted">Question {index + 1} of {set.questions.length}</span></div>
    <p className="text-sm leading-6 text-ink-light">Use the hint and reasoning to make the idea usable. This practice does not change your mastery score.</p>
    <div className="space-y-2" aria-label="Practice progress"><div className="flex items-center justify-between text-xs font-semibold text-ink-muted"><span>Practice progress</span><span>{index + 1} of {set.questions.length}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-secondary" role="progressbar" aria-label="Practice progress" aria-valuemin={0} aria-valuemax={set.questions.length} aria-valuenow={index + 1}><div className="h-full rounded-full bg-teal transition-[width]" style={{ width: `${((index + 1) / set.questions.length) * 100}%` }} /></div></div>
    {question.code && <CodeBlock code={question.code.source} language={question.code.language} ariaLabel={`${question.code.language} practice example`} />}
    <h3 className="font-semibold leading-6 text-ink"><InlineMarkdown text={question.prompt} /></h3>
    <fieldset className="space-y-2"><legend className="sr-only">Choose an answer</legend>{question.choices.map((choice) => <label key={choice.id} className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${selected === choice.id ? 'border-teal bg-teal/10' : 'border-slate-secondary hover:border-teal/60'}`}><input className="mt-1 h-4 w-4 accent-teal" type="radio" name={`practice-${question.id}`} value={choice.id} checked={selected === choice.id} onChange={() => setSelected(choice.id)} disabled={submitted} /><span className="break-words text-sm leading-5 text-ink-light">{choice.label}</span></label>)}</fieldset>
    {submitted && submittedResult && <div className={`rounded-lg border p-4 text-sm leading-6 ${isCorrect ? 'border-success/40 bg-success/10' : 'border-warning/40 bg-warning/10'}`} role="status"><p className="font-semibold text-ink">{isCorrect ? 'Correct' : 'Try the reasoning again'}</p><p className="mt-1 text-ink-light">{isCorrect ? submittedResult.explanation : submittedResult.choiceFeedback ?? submittedResult.explanation}</p>{!isCorrect && <p className="mt-2 text-ink-light">{submittedResult.explanation}</p>}{submittedResult.hint && <p className="mt-2 text-warning">Hint: {submittedResult.hint}</p>}</div>}
    <div className="flex flex-wrap gap-3"><button ref={actionButtonRef} type="button" className="btn-primary" onClick={submitted ? isCorrect ? next : retry : submit} disabled={!submitted && selected === undefined}>{submitted ? isCorrect ? index === set.questions.length - 1 ? 'Finish practice' : 'Next question' : 'Try again' : 'Check answer'}</button><Link href={backHref} className="btn-secondary">Back to learning</Link></div>
  </section>;
}

function PracticeComplete({ set, correctCount, backHref }: { readonly set: PracticeSet; readonly correctCount: number; readonly backHref: string }) {
  return <section className="card space-y-5 p-6" aria-labelledby="practice-complete-title"><p className="surface-eyebrow">Practice complete</p><h2 id="practice-complete-title" className="text-2xl font-bold text-ink">You worked through {set.questions.length} questions</h2><p className="leading-7 text-ink-light">You got {correctCount} of {set.questions.length} right. Review any explanation, then continue to Check when you are ready.</p><Link href={backHref} className="btn-primary inline-flex w-fit">Return to learning</Link></section>;
}
