'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { topicBundles } from '@/content/topics';
import { useLearnerStore } from '@/stores/learner';
import { contentCatalog } from '@/lib/content/catalog';
import { recommendNextContent } from '@/lib/learning/recommendations';
import KnowledgeCheckForm from '@/components/shared/KnowledgeCheckForm';

export default function ReviewPage() {
  const { canonicalProfile, getReviewQueueDetails, setManualReview, removeFromReviewQueue } = useLearnerStore();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const persist = useLearnerStore.persist;
    const unsubscribe = persist.onFinishHydration(() => setHydrated(true));
    if (persist.hasHydrated()) setHydrated(true);
    return unsubscribe;
  }, []);
  const [sessionTopicIds, setSessionTopicIds] = useState<readonly string[]>([]);
  useEffect(() => {
    if (hydrated) setSessionTopicIds(getReviewQueueDetails().slice(0, 10).map((item) => item.topicId));
  }, [getReviewQueueDetails, hydrated]);
  const [index, setIndex] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [done, setDone] = useState(false);
  const topicId = sessionTopicIds[index];
  const bundle = topicId ? topicBundles.find((candidate) => candidate.id === topicId) : undefined;
  const question = bundle?.qa[0];
  const nextTopicId = recommendNextContent(canonicalProfile, contentCatalog)?.topicId ?? topicBundles[0]?.id;

  const finishItem = () => {
    if (!topicId) return;
    setManualReview(topicId, false);
    removeFromReviewQueue(topicId);
    setAnsweredCorrectly(false);
    if (index >= sessionTopicIds.length - 1) setDone(true);
    else setIndex(index + 1);
  };

  if (!hydrated) {
    return <div className="flex min-h-full items-center justify-center bg-paper p-4"><p className="text-sm text-ink-muted">Loading review session…</p></div>;
  }

  if (done || sessionTopicIds.length === 0) {
    return (
      <div className="flex min-h-full items-center justify-center bg-paper p-4">
        <section className="card w-full max-w-xl space-y-5 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Review complete</p>
          <h1 className="text-3xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Your next session is ready</h1>
          <p className="text-ink-light">You reviewed up to ten multiple-choice items. Return when another topic needs attention.</p>
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
          <span>Item {index + 1} of {sessionTopicIds.length}</span>
        </div>
        <div className="card space-y-6 p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-coral">Focused review</p>
            <h1 id="review-session-title" className="mt-2 text-2xl font-bold text-ink">{bundle?.lesson.title ?? topicId}</h1>
          </div>
          {question && <>
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
