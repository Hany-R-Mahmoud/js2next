'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createInitialProgress } from '@/domain/progression/core';
import type { ProgressState, ReviewItem } from '@/domain/progression/types';
import { createLocalProgressAdapter, loadProgress } from '@/infrastructure/local-progress';
import { buildCanonicalProgress, progressStorageKey, type CanonicalTopic } from './progress-model';

const EMPTY_PROGRESS = createInitialProgress(
  'local-default',
  'release-1-draft',
  '1970-01-01T00:00:00.000Z',
);

export function ReviewSurface() {
  const [state, setState] = useState<ProgressState>(EMPTY_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const adapter = createLocalProgressAdapter(window.localStorage, progressStorageKey);
    setState(loadProgress(adapter, EMPTY_PROGRESS));
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <main className="mx-auto w-full max-w-3xl" aria-labelledby="review-loading-title">
        <section className="card space-y-3 p-6" role="status" aria-live="polite">
          <h1 id="review-loading-title" className="text-xl font-semibold text-ink">Loading review queue</h1>
          <p className="text-sm text-ink-muted">Reading this browser&apos;s saved review items.</p>
        </section>
      </main>
    );
  }

  const progress = buildCanonicalProgress(state);
  const topicsById = new Map(progress.topics.map((topic) => [topic.id, topic]));

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6" aria-labelledby="review-title">
      <header>
        <p className="surface-eyebrow">Review queue</p>
        <h1 id="review-title" className="surface-title">Practice what needs another look</h1>
        <p className="surface-description">Each item comes from the local progress record and stays until the learner addresses it.</p>
      </header>

      {state.reviewQueue.length === 0 ? (
        <section className="card space-y-4 p-6" aria-labelledby="empty-review-title">
          <h2 id="empty-review-title" className="text-xl font-semibold text-ink">Nothing queued yet</h2>
          <p className="text-ink-light">A missed objective creates a review item. Complete an assessment to build a focused queue.</p>
          <Link className="btn-primary inline-block" href="/progress">View progress</Link>
        </section>
      ) : (
        <section className="space-y-3" aria-labelledby="queue-title">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="queue-title" className="text-xl font-semibold text-ink">{state.reviewQueue.length} item{state.reviewQueue.length === 1 ? '' : 's'} to review</h2>
            <Link className="text-sm font-semibold text-teal hover:text-teal-dark" href="/progress">Progress overview</Link>
          </div>
          {state.reviewQueue.map((item) => (
            <ReviewQueueCard key={`${item.topicId}-${item.objectiveId}`} item={item} topic={topicsById.get(item.topicId)} />
          ))}
        </section>
      )}
    </main>
  );
}

function ReviewQueueCard({ item, topic }: { readonly item: ReviewItem; readonly topic: CanonicalTopic | undefined }) {
  return (
    <article className="card space-y-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-warning">{reasonLabel(item.reason)}</p>
        <p className="text-sm text-ink-muted">Due {formatDate(item.dueAt)}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-ink">{topic?.title ?? item.topicId}</h3>
        <p className="mt-1 text-sm text-ink-light">Objective {item.objectiveId}</p>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div><dt className="text-ink-muted">Attempts</dt><dd className="mt-1 font-semibold text-ink">{item.attempts}</dd></div>
        <div><dt className="text-ink-muted">Confidence</dt><dd className="mt-1 font-semibold text-ink">{Math.round(item.confidence)}%</dd></div>
        <div><dt className="text-ink-muted">Last activity</dt><dd className="mt-1 font-semibold text-ink">{formatDate(item.lastActivity)}</dd></div>
      </dl>
      {topic ? (
        <Link className="btn-secondary inline-block" href={`${topic.href}/quiz`}>Practice this topic</Link>
      ) : (
        <p className="rounded-lg border border-warning/50 bg-warning/10 p-3 text-sm text-ink-light">This item no longer maps to the canonical curriculum and remains visible for audit.</p>
      )}
    </article>
  );
}

function reasonLabel(reason: ReviewItem['reason']): string {
  switch (reason) {
    case 'incorrect-answer': return 'Incorrect answer';
    case 'low-mastery': return 'Low mastery';
    case 'manual-review': return 'Manual review';
  }
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}
