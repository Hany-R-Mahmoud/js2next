import Link from 'next/link';
import type { FormEvent } from 'react';
import type { AssessmentResult, Question } from '@/domain/assessment';
import { assessmentProfileLabel } from '@/domain/assessment';
import CodeBlock from '@/components/shared/CodeBlock';
import type { AssessmentPageData } from './types';

type AssessmentViewProps = {
  readonly data: AssessmentPageData;
  readonly questions: readonly Question[];
  readonly answers: Readonly<Record<string, string>>;
  readonly submitted: AssessmentResult | null;
  readonly attempts: number;
  readonly backHref: string;
  readonly onAnswer: (questionId: string, choiceId: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly onRetry: () => void;
};

export function AssessmentView({ data, questions, answers, submitted, attempts, backHref, onAnswer, onSubmit, onRetry }: AssessmentViewProps) {
  if (submitted !== null) {
    return <AssessmentResultView data={data} questions={questions} result={submitted} attempts={attempts} backHref={backHref} onRetry={onRetry} />;
  }

  return <main className="mx-auto w-full max-w-3xl space-y-6 py-8" aria-labelledby="assessment-title">
    <header>
      <p className="surface-eyebrow">{assessmentLabel(data.assessment)}</p>
      <h1 id="assessment-title" className="surface-title">{data.assessment.title}</h1>
      <p className="surface-description">Choose one answer for each question. Your choices stay in source order, and feedback appears after submission.</p>
    </header>
    <form className="space-y-5" onSubmit={onSubmit}>
      {questions.map((question, index) => <QuestionCard key={question.id} question={question} index={index} answer={answers[question.id]} onAnswer={onAnswer} />)}
      <button className="btn-primary w-full sm:w-auto" type="submit">Submit answers</button>
    </form>
  </main>;
}

function QuestionCard({ question, index, answer, onAnswer }: { readonly question: Question; readonly index: number; readonly answer: string | undefined; readonly onAnswer: (questionId: string, choiceId: string) => void }) {
  const groupId = `question-${question.id}`;
  return <fieldset className="card space-y-4 p-5 sm:p-6">
    <legend className="w-full font-semibold leading-6 text-ink">{index + 1}. {question.prompt}</legend>
    {question.assessmentMode && <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal">{question.assessmentMode.replaceAll('-', ' ')}</p>}
    {question.code && <CodeBlock code={question.code.source} language={question.code.language} ariaLabel={`${question.code.language} assessment example`} />}
    <div className="space-y-2">
      {question.choices.map((choice) => {
        const inputId = `${groupId}-${choice.id}`;
        const selected = answer === choice.id;
        return <label className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${selected ? 'border-teal bg-teal/10' : 'border-slate-secondary hover:border-teal/60'}`} htmlFor={inputId} key={choice.id}>
          <input id={inputId} className="mt-1 h-4 w-4 accent-teal" type="radio" name={groupId} value={choice.id} checked={selected} onChange={() => onAnswer(question.id, choice.id)} required />
          <span className="break-words text-sm leading-5 text-ink-light">{choice.label}</span>
        </label>;
      })}
    </div>
  </fieldset>;
}

function AssessmentResultView({ data, questions, result, attempts, backHref, onRetry }: { readonly data: AssessmentPageData; readonly questions: readonly Question[]; readonly result: AssessmentResult; readonly attempts: number; readonly backHref: string; readonly onRetry: () => void }) {
  return <main className="mx-auto w-full max-w-3xl space-y-6 py-8" aria-labelledby="assessment-result-title">
    <section className="card space-y-4 p-6 sm:p-8">
      <p className="surface-eyebrow">Attempt {attempts}</p>
      <h1 id="assessment-result-title" className="surface-title">{Math.round(result.scorePercent)}% — {result.mastered ? 'Mastery reached' : 'Keep going'}</h1>
      <p className="surface-description">{result.mastered ? `You reached the ${data.assessment.masteryThresholdPercent}% mastery threshold.` : 'Review the feedback below, then retry as many times as you need.'}</p>
      <div className="flex flex-wrap gap-3"><button className="btn-primary" type="button" onClick={onRetry}>Retry assessment</button><Link className="btn-secondary" href={backHref}>Back to learning</Link></div>
      <p className="sr-only" role="status" aria-live="polite">Assessment submitted. Score {Math.round(result.scorePercent)} percent.</p>
    </section>
    <section className="space-y-4" aria-label="Answer feedback">
      {questions.map((question, index) => <FeedbackCard key={question.id} question={question} index={index} result={result.questionResults.find((item) => item.questionId === question.id)} />)}
    </section>
  </main>;
}

function FeedbackCard({ question, index, result }: { readonly question: Question; readonly index: number; readonly result: AssessmentResult['questionResults'][number] | undefined }) {
  const correctChoice = question.choices.find((choice) => choice.id === question.correctChoiceIds[0]);
  const selectedChoice = question.choices.find((choice) => choice.id === result?.submittedChoiceId);
  const correct = result?.correct === true;
  return <article className="card space-y-3 p-5" aria-labelledby={`feedback-${question.id}`}>
    <h2 id={`feedback-${question.id}`} className="font-semibold leading-6 text-ink">{index + 1}. {question.prompt}</h2>
    {question.code && <CodeBlock code={question.code.source} language={question.code.language} ariaLabel={`${question.code.language} assessment example`} />}
    <p className={correct ? 'font-semibold text-success' : 'font-semibold text-coral'}>{correct ? 'Correct' : 'Needs another look'}</p>
    <p className="text-sm leading-6 text-ink-light">{selectedChoice ? `Your choice: ${selectedChoice.label}` : 'No answer submitted.'}</p>
    {result?.choiceFeedback && <p className="text-sm leading-6 text-ink-light">{result.choiceFeedback}</p>}
    {!correct && correctChoice && <p className="text-sm leading-6 text-ink-light">Correct answer: {correctChoice.label}</p>}
    <p className="text-sm leading-6 text-ink-light">{result?.explanation ?? question.explanation}</p>
    {result?.hint && <p className="text-sm leading-6 text-warning">Hint: {result.hint}</p>}
  </article>;
}

function assessmentLabel(assessment: AssessmentPageData['assessment']): string {
  if (assessment.kind === 'topic-quiz' && assessment.assessmentProfile !== undefined) return assessmentProfileLabel(assessment.assessmentProfile.type);
  switch (assessment.kind) {
    case 'topic-quiz': return 'Topic quiz';
    case 'module-review': return 'Module review';
    case 'cumulative-review': return 'Cumulative review';
  }
}
