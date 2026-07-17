'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { scoreChallenge } from '@/lib/learning/mastery';
import { toUnifiedChallenge } from '@/lib/learning/challenge-adapter';
import { challengeContentId } from '@/lib/content/identity';
import type { Challenge } from '@/types';
import type { ChallengeAnswer, ChallengeAttempt } from '@/lib/learning/types';

interface ChallengeAnswerFormProps {
  readonly challenge: Challenge;
  readonly lessonSectionId?: string | null;
  readonly savedAttempt?: ChallengeAttempt;
  readonly hintsUsed: number;
  readonly revealed: boolean;
  readonly onSubmit: (attempt: ChallengeAttempt, challenge: Challenge) => void;
}

export default function ChallengeAnswerForm({ challenge, lessonSectionId, savedAttempt, hintsUsed, revealed, onSubmit }: ChallengeAnswerFormProps) {
  const unifiedChallenge = toUnifiedChallenge(challenge);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => readIndex(savedAttempt?.lastAnswer));
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>(() => readIndexes(savedAttempt?.lastAnswer));
  const [textAnswer, setTextAnswer] = useState(savedAttempt?.lastAnswer ?? '');
  const [result, setResult] = useState<boolean | null>(savedAttempt?.scored ? savedAttempt.passed : null);

  useEffect(() => {
    setSelectedIndex(readIndex(savedAttempt?.lastAnswer));
    setSelectedIndexes(readIndexes(savedAttempt?.lastAnswer));
    setTextAnswer(savedAttempt?.lastAnswer ?? '');
    setResult(savedAttempt?.scored ? savedAttempt.passed : null);
  }, [savedAttempt]);

  if (!unifiedChallenge) return null;

  const answerReady = isAnswerReady(unifiedChallenge.checkType, selectedIndex, selectedIndexes, textAnswer);
  const answerId = `challenge-answer-${challenge.slug}`;
  const correctAnswer = correctAnswerText(challenge);

  const submit = () => {
    const answer = getAnswer(unifiedChallenge.checkType, selectedIndex, selectedIndexes, textAnswer);
    if (answer === null) return;
    const passed = scoreChallenge(unifiedChallenge, answer);
    const attempt: ChallengeAttempt = {
      challengeId: challengeContentId(challenge.slug),
      attempts: (savedAttempt?.attempts ?? 0) + 1,
      hintsUsed,
      revealed,
      passed,
      scored: true,
      outcome: passed ? 'passed' : 'failed',
      confidence: passed ? 0.8 : 0.5,
      lastAnswer: serializeAnswer(answer),
      updatedAt: new Date().toISOString(),
    };
    setResult(passed);
    onSubmit(attempt, challenge);
  };

  return (
    <form
      className="card p-6 space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-teal font-semibold">Knowledge check</p>
        <h2 className="text-lg font-semibold text-ink">{challenge.prompt}</h2>
      </div>

      {unifiedChallenge.checkType === 'choice' && (
        <fieldset className="space-y-2">
          <legend className="sr-only">Choose one answer</legend>
          {challenge.options?.map((option, index) => (
            <label
              key={option}
              className={`high-contrast-option ${selectedIndex === index ? 'high-contrast-option-selected' : ''} flex min-h-11 cursor-pointer items-start gap-3 rounded-[10px] border p-3 text-sm transition-colors ${selectedIndex === index ? 'border-teal bg-teal/10' : 'border-paper-warm bg-slate hover:border-teal/50'}`}
            >
              <input
                type="radio"
                name={`challenge-${challenge.slug}`}
                checked={selectedIndex === index}
                onChange={() => {
                  setSelectedIndex(index);
                  setResult(null);
                }}
                className="mt-0.5 accent-teal"
              />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
      )}

      {unifiedChallenge.checkType === 'multi-choice' && (
        <fieldset className="space-y-2">
          <legend className="sr-only">Select all correct answers</legend>
          {challenge.options?.map((option, index) => (
            <label key={option} className={`high-contrast-option ${selectedIndexes.includes(index) ? 'high-contrast-option-selected' : ''} flex gap-3 items-start min-h-11 rounded-[10px] border p-3 text-sm cursor-pointer transition-colors ${selectedIndexes.includes(index) ? 'border-teal bg-teal/10' : 'border-paper-warm bg-slate hover:border-teal/50'}`}>
              <input
                type="checkbox"
                checked={selectedIndexes.includes(index)}
                onChange={() => {
                  setSelectedIndexes((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
                  setResult(null);
                }}
                className="mt-0.5 accent-teal"
              />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
      )}

      {unifiedChallenge.checkType === 'code-contains' && (
        <div>
          <label htmlFor={answerId} className="sr-only">Write the relevant code</label>
          <textarea
            id={answerId}
            value={textAnswer}
            onChange={(event) => {
              setTextAnswer(event.target.value);
              setResult(null);
            }}
            placeholder="Write the relevant code…"
            className="w-full min-h-32 p-3 rounded-[10px] border border-paper-warm bg-slate text-ink text-sm resize-y focus:outline-none focus:ring-2 focus:ring-teal font-mono"
          />
        </div>
      )}

      <button type="submit" className="btn-primary text-sm" disabled={!answerReady}>Check answer</button>

      {result !== null && (
        <div role="status" className={`rounded-lg p-4 text-sm ${result ? 'bg-teal/10 text-teal' : 'bg-coral/10 text-coral'}`}>
          <p className="font-semibold">{result ? 'Correct. Mastery updated.' : 'Not yet. This topic is now in your review path.'}</p>
          {!result && <p className="mt-1"><span className="font-semibold">Correct answer:</span> {correctAnswer}</p>}
          {(result || correctAnswer !== challenge.answerExplanation) && <p className="mt-1">{result ? challenge.expectedReasoning : challenge.answerExplanation}</p>}
          {!result && lessonSectionId && <Link href={`#lesson-section-${lessonSectionId}`} className="mt-2 inline-block font-semibold underline">Review the exact lesson section</Link>}
        </div>
      )}
    </form>
  );
}

function correctAnswerText(challenge: Challenge): string {
  if (challenge.checkType === 'choice' && challenge.correctIndex !== undefined) {
    return challenge.options?.[challenge.correctIndex] ?? 'Review the explanation below.';
  }
  if (challenge.checkType === 'multi-choice' && challenge.correctIndices) {
    return challenge.correctIndices.map((index) => challenge.options?.[index]).filter((option): option is string => option !== undefined).join(', ') || 'Review the explanation below.';
  }
  if (challenge.checkType === 'code-contains' && challenge.requiredSnippets) {
    return challenge.requiredSnippets.join(', ');
  }
  return challenge.expectedReasoning;
}

function isAnswerReady(checkType: string, selectedIndex: number | null, selectedIndexes: number[], textAnswer: string): boolean {
  return checkType === 'choice' ? selectedIndex !== null : checkType === 'multi-choice' ? selectedIndexes.length > 0 : textAnswer.trim().length > 0;
}

function getAnswer(checkType: ChallengeAnswerFormProps['challenge']['checkType'], selectedIndex: number | null, selectedIndexes: number[], textAnswer: string): ChallengeAnswer | null {
  switch (checkType) {
    case 'choice': return selectedIndex;
    case 'multi-choice': return selectedIndexes;
    case 'code-contains':
    case 'free-text': return textAnswer;
    default: return null;
  }
}

function serializeAnswer(answer: ChallengeAnswer): string {
  return Array.isArray(answer) ? JSON.stringify(answer) : String(answer);
}

function readIndex(value: string | undefined): number | null {
  if (!value || value.startsWith('[')) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function readIndexes(value: string | undefined): number[] {
  if (!value?.startsWith('[')) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'number' && Number.isInteger(item)) ? parsed : [];
  } catch (error) {
    if (error instanceof SyntaxError) return [];
    throw error;
  }
}
