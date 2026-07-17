'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { topicBundles } from '@/content/topics';
import { useLearnerStore } from '@/stores/learner';
import { contentCatalog } from '@/lib/content/catalog';
import { recommendNextContent } from '@/lib/learning/recommendations';
import KnowledgeCheckForm from '@/components/shared/KnowledgeCheckForm';

type ReviewSessionItem = { topicId: string; questionId: string };

export default function ReviewPage() {
  const { canonicalProfile, getReviewQueueDetails, setManualReview, removeFromReviewQueue } = useLearnerStore();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const persist = useLearnerStore.persist;
    const unsubscribe = persist.onFinishHydration(() => setHydrated(true));
    if (persist.hasHydrated()) setHydrated(true);
    return unsubscribe;
  }, []);
  const [sessionItems, setSessionItems] = useState<readonly ReviewSessionItem[]>([]);
  const sessionInitialized = useRef(false);
  useEffect(() => {
    if (!hydrated || sessionInitialized.current) return;
    sessionInitialized.current = true;
    const usedByTopic = new Map<string, Set<string>>();
    const items = getReviewQueueDetails().slice(0, 10).flatMap((item) => {
      const bundle = topicBundles.find((candidate) => candidate.id === item.topicId);
      if (!bundle || bundle.qa.length === 0) return [];
      const usedQuestionIds = usedByTopic.get(item.topicId) ?? new Set<string>();
      const lastReviewAt = canonicalProfile.topicProgress?.[item.topicId]?.lastReviewCompletedAt;
      const rotation = lastReviewAt ? Math.abs(Date.parse(lastReviewAt)) % bundle.qa.length : 0;
      const question = bundle.qa[(rotation + usedQuestionIds.size) % bundle.qa.length];
      usedQuestionIds.add(question.id);
      usedByTopic.set(item.topicId, usedQuestionIds);
      return [{ topicId: item.topicId, questionId: question.id }];
    });
    setSessionItems(items);
  }, [canonicalProfile.topicProgress, getReviewQueueDetails, hydrated]);
  const [index, setIndex] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [done, setDone] = useState(false);
  const sessionItem = sessionItems[index];
  const topicId = sessionItem?.topicId;
  const bundle = topicId ? topicBundles.find((candidate) => candidate.id === topicId) : undefined;
  const question = bundle && sessionItem ? bundle.qa.find((candidate) => candidate.id === sessionItem.questionId) : undefined;
  const nextTopicId = recommendNextContent(canonicalProfile, contentCatalog)?.topicId ?? topicBundles[0]?.id;

  const finishItem = () => {
    if (!topicId) return;
    setManualReview(topicId, false);
    removeFromReviewQueue(topicId);
    setAnsweredCorrectly(false);
    if (index >= sessionItems.length - 1) setDone(true);
    else setIndex(index + 1);
  };

  if (!hydrated) {
    return <div className="flex min-h-full items-center justify-center bg-paper p-4"><p className="text-sm text-ink-muted">Loading review session…</p></div>;
  }

  if (done || sessionItems.length === 0) {
    return (
      <div className="flex min-h-full items-center justify-center bg-paper p-4">
        <section className="card w-full max-w-xl space-y-5 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">{done ? 'Review complete' : 'Nothing queued'}</p>
          <h1 className="text-3xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>{done ? 'Your next session is ready' : 'You are caught up'}</h1>
          <p className="text-ink-light">{done ? 'You reviewed up to ten multiple-choice items. Return when another topic needs attention.' : 'Complete a topic or flag a weak spot to build a focused review session.'}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/home" className="btn-secondary inline-block">Back to home</Link>
            {nextTopicId && <Link href={`/topic/${nextTopicId}`} className="btn-primary inline-block">Continue learning</Link>}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-paper p-4">
      <section className="w-full max-w-2xl space-y-6" aria-labelledby="review-session-title">
        <div className="flex items-center justify-between gap-3 text-sm text-ink-muted">
          <span>Focused review</span>
          <span>Item {index + 1} of {sessionItems.length}</span>
        </div>
        <div className="card space-y-6 p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-coral">Focused review</p>
            <h1 id="review-session-title" className="mt-2 text-2xl font-bold text-ink">{bundle?.lesson.title ?? topicId}</h1>
          </div>
          {question && <>
            <p className="rounded-lg bg-paper-dark/50 p-4 text-sm leading-6 text-ink-light">{question.reviewScenario ?? 'Apply the concept to a new situation before choosing an answer.'}</p>
            <p className="text-lg leading-relaxed text-ink">{question.question}</p>
            <KnowledgeCheckForm
            key={question.id}
            question={{ id: question.id, question: question.question, options: question.options, correctAnswer: question.answer, expectedReasoning: question.answer }}
            onAnswerChange={() => setAnsweredCorrectly(false)}
            onSubmit={(_answer, correct) => setAnsweredCorrectly(correct)}
            />
          </>}
          <button type="button" className="btn-primary" onClick={finishItem} disabled={!answeredCorrectly}>Next item</button>
        </div>
      </section>
    </div>
  );
}
