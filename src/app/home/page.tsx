'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { topicBundles } from '@/content/topics';
import { topicFamilyMeta } from '@/data/curriculum';
import { contentCatalog } from '@/lib/content/catalog';
import { recommendNextContent } from '@/lib/learning/recommendations';
import { useLearnerStore } from '@/stores/learner';
import SearchBar from '@/components/shared/SearchBar';
import type { TopicFamily } from '@/types';
import { ProgressBackup } from '@/components/shared/ProgressBackup';

const allFamilies: readonly (TopicFamily | 'all')[] = ['all', 'foundations', 'react-mental-model', 'state-behavior', 'app-quality', 'nextjs-foundations', 'rsc-client', 'nextjs-data', 'production', 'architecture'];

export default function HomePage() {
  const { canonicalProfile, getReviewQueueDetails } = useLearnerStore();
  const [family, setFamily] = useState<TopicFamily | 'all'>('all');
  const [query, setQuery] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persist = useLearnerStore.persist;
    const unsubscribe = persist.onFinishHydration(() => setHydrated(true));
    if (persist.hasHydrated()) setHydrated(true);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (hydrated) setFamily(familyForFocus(canonicalProfile.focusArea));
  }, [canonicalProfile.focusArea, hydrated]);

  const reviewQueue = hydrated ? getReviewQueueDetails() : [];
  const recommendation = hydrated ? recommendNextContent(canonicalProfile, contentCatalog) : null;
  const recommendedBundle = recommendation ? topicBundles.find((bundle) => bundle.id === recommendation.topicId) : undefined;
  const dailyBundle = recommendedBundle ?? topicBundles[0];
  const dailyWhy = recommendation?.why ?? 'Start with the first topic in the map and build from the fundamentals.';
  const visibleTopics = useMemo(
    () => topicBundles.filter((bundle) => {
      const matchesFamily = family === 'all' || bundle.meta.topicFamily === family;
      const searchText = `${bundle.lesson.title} ${bundle.lesson.whyMatters} ${topicFamilyMeta[bundle.meta.topicFamily].name}`.toLowerCase();
      return matchesFamily && searchText.includes(query.trim().toLowerCase());
    }),
    [family, query],
  );
  const mastered = hydrated ? topicBundles.filter((bundle) => (canonicalProfile.masteryRecords[bundle.id]?.mastery ?? 0) >= 0.8).length : 0;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome back, {canonicalProfile.name || 'Developer'}
          </h1>
          <Link href="/settings" className="mt-1 inline-block text-ink-light hover:text-teal">
            {(hydrated ? canonicalProfile.level : 'beginner').charAt(0).toUpperCase() + (hydrated ? canonicalProfile.level : 'beginner').slice(1)} path
            {hydrated && canonicalProfile.streakDays > 0 ? ` · ${canonicalProfile.streakDays} day streak` : ''}
          </Link>
        </div>
        <p className="text-sm text-ink-muted">{mastered} of {topicBundles.length} topics mastered</p>
      </header>

      {hydrated && !canonicalProfile.diagnosticDone && (
        <section className="card border-teal/30 bg-teal/5 p-6" aria-labelledby="onboarding-title">
          <h2 id="onboarding-title" className="text-lg font-semibold text-ink">Set your learning path</h2>
          <p className="mt-1 text-sm text-ink-light">Answer four short questions so the home map can prioritize the right topics.</p>
          <Link href="/onboarding" className="btn-primary mt-4 inline-block text-sm">Start onboarding</Link>
        </section>
      )}

      {reviewQueue.length > 0 && (
        <section className="card border-coral/30 bg-coral/5 p-6" aria-labelledby="review-title">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-coral">Review due</p>
              <h2 id="review-title" className="mt-1 text-lg font-semibold text-ink">Keep your recent learning available</h2>
              <p className="mt-1 text-sm text-ink-light">{reviewQueue.length} topic{reviewQueue.length === 1 ? '' : 's'} need a focused check.</p>
            </div>
            <Link href="/review" className="btn-secondary shrink-0 text-center text-sm">Start review</Link>
          </div>
        </section>
      )}

      {dailyBundle && (
        <section className="card p-6" aria-labelledby="daily-suggestion-title">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Today&apos;s suggestion</p>
          <h2 id="daily-suggestion-title" className="mt-1 text-xl font-semibold text-ink">{dailyBundle.lesson.title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-light">{dailyWhy}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link href={`/topic/${dailyBundle.id}`} className="btn-primary text-sm">Continue topic</Link>
            <span className="text-xs text-ink-muted">{dailyBundle.lesson.estimatedMinutes} minutes · {dailyBundle.challenges.length} practice checks</span>
          </div>
        </section>
      )}

      <ProgressBackup compact />

      <section aria-labelledby="topic-map-title" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="topic-map-title" className="mt-1 text-2xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Topic map</h2>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <SearchBar onSearch={setQuery} placeholder="Find a topic" className="sm:w-64" />
            <label className="text-sm text-ink-light">
              <span className="sr-only">Filter topic family</span>
              <select value={family} onChange={(event) => setFamily(readFamily(event.target.value))} className="min-h-11 w-full rounded-[10px] border border-paper-warm bg-slate px-3 text-ink focus:outline-none focus:ring-2 focus:ring-teal sm:w-auto">
                {allFamilies.map((item) => <option key={item} value={item}>{item === 'all' ? 'All families' : topicFamilyMeta[item].name}</option>)}
              </select>
            </label>
          </div>
        </div>

        <p className="text-sm text-ink-muted">Showing {visibleTopics.length} of {topicBundles.length} topics.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleTopics.length > 0 ? visibleTopics.map((bundle) => {
            const mastery = hydrated ? canonicalProfile.masteryRecords[bundle.id]?.mastery ?? 0 : 0;
            const stage = hydrated ? canonicalProfile.topicProgress?.[bundle.id]?.stage ?? 'learn' : 'learn';
            return (
              <Link key={bundle.id} href={`/topic/${bundle.id}`} className="card block p-5 transition-colors hover:border-teal/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">{topicFamilyMeta[bundle.meta.topicFamily].name}</p>
                    <h3 className="mt-2 font-semibold text-ink">{bundle.lesson.title}</h3>
                  </div>
                  <span className="text-sm font-semibold text-teal">{Math.round(mastery * 100)}%</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-ink-light">{bundle.lesson.whyMatters}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
                  <span>{stage === 'complete' ? 'Complete' : stage === 'learn' ? 'Ready to learn' : `In ${stage}`}</span>
                  <span>{bundle.lesson.estimatedMinutes} min</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-warm" aria-hidden="true">
                  <div className="h-full rounded-full bg-teal" style={{ width: `${Math.round(mastery * 100)}%` }} />
                </div>
              </Link>
            );
          }) : <p className="rounded-lg border border-paper-warm p-5 text-sm text-ink-muted">No topics match this search and family filter.</p>}
        </div>
      </section>
    </div>
  );
}

function readFamily(value: string): TopicFamily | 'all' {
  switch (value) {
    case 'foundations':
    case 'react-mental-model':
    case 'state-behavior':
    case 'app-quality':
    case 'nextjs-foundations':
    case 'rsc-client':
    case 'nextjs-data':
    case 'production':
    case 'architecture':
      return value;
    default:
      return 'all';
  }
}

function familyForFocus(focusArea: string | undefined): TopicFamily | 'all' {
  switch (focusArea) {
    case 'react-fundamentals': return 'foundations';
    case 'state-and-data': return 'state-behavior';
    case 'nextjs-app-router': return 'nextjs-foundations';
    case 'production': return 'production';
    default: return 'all';
  }
}
