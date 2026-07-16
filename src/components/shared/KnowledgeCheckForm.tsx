'use client';

import { useEffect, useState } from 'react';
import type { DiagnosticQuestion } from '@/types';

interface KnowledgeCheckFormProps {
  readonly question: DiagnosticQuestion;
  readonly savedAnswer?: string;
  readonly savedCorrect?: boolean;
  readonly savedFeedback?: string;
  readonly onAnswerChange?: (answer: string) => void;
  readonly onSubmit: (answer: string, correct: boolean, feedback: string) => void;
}

export default function KnowledgeCheckForm({ question, savedAnswer, savedCorrect, savedFeedback, onAnswerChange, onSubmit }: KnowledgeCheckFormProps) {
  const [answer, setAnswer] = useState(savedAnswer ?? '');
  const [result, setResult] = useState<boolean | undefined>(savedCorrect);
  const [feedback, setFeedback] = useState(savedFeedback);

  useEffect(() => {
    setAnswer(savedAnswer ?? '');
    setResult(savedCorrect);
    setFeedback(savedFeedback);
  }, [savedAnswer, savedCorrect, savedFeedback]);

  const checkAnswer = () => {
    if (!answer || !question.correctAnswer) return;
    const correct = answer === question.correctAnswer;
    const nextFeedback = question.expectedReasoning ?? 'Compare your reasoning with the explanation above.';
    setResult(correct);
    setFeedback(nextFeedback);
    onSubmit(answer, correct, nextFeedback);
  };

  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        checkAnswer();
      }}
    >
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-ink">Choose an answer</legend>
        {question.options?.map((option) => (
          <label
            key={option}
            className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
              answer === option ? 'border-teal bg-teal/10' : 'border-paper-warm bg-slate hover:border-teal/50'
            }`}
          >
            <input
              type="radio"
              name={`knowledge-check-${question.id}`}
              value={option}
              checked={answer === option}
              onChange={() => {
                setAnswer(option);
                setResult(undefined);
                setFeedback(undefined);
                onAnswerChange?.(option);
              }}
              className="mt-0.5 accent-teal"
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>

      <button type="submit" className="btn-primary text-sm" disabled={!answer || !question.correctAnswer}>
        Check answer
      </button>

      {result !== undefined && feedback && (
        <div role="status" aria-live="polite" className={`rounded-lg p-3 text-sm ${result ? 'bg-teal/10 text-teal' : 'bg-coral/10 text-coral'}`}>
          <p className="font-semibold">{result ? 'Correct.' : `Not quite. Correct answer: ${question.correctAnswer}`}</p>
          <p className="mt-1">{feedback}</p>
        </div>
      )}
    </form>
  );
}
