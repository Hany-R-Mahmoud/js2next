'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLearnerStore } from '@/stores/learner';
import SearchBar from '@/components/shared/SearchBar';
import SurfaceHeader from '@/components/shared/SurfaceHeader';
import { buildCanonicalProgress } from '@/components/progress/progress-model';
import { useProgressState } from '@/components/progress/useProgressState';

export default function HomePage() {
  const { canonicalProfile } = useLearnerStore();
  const { state, hydrated: progressHydrated } = useProgressState();
  const [query, setQuery] = useState('');
  const [learnerHydrated, setLearnerHydrated] = useState(false);

  useEffect(() => {
    const persist = useLearnerStore.persist;
    const unsubscribe = persist.onFinishHydration(() => setLearnerHydrated(true));
    if (persist.hasHydrated()) setLearnerHydrated(true);
    return unsubscribe;
  }, []);

  const progress = buildCanonicalProgress(state);
  const visibleTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return progress.topics;
    return progress.topics.filter((topic) => `${topic.title} ${topic.trackTitle} ${topic.moduleTitle}`.toLowerCase().includes(normalizedQuery));
  }, [progress.topics, query]);
  const nextTopic = progress.topics.find((topic) => topic.required && topic.masteryPercent < 80) ?? progress.topics.find((topic) => topic.masteryPercent < 80);

  if (!progressHydrated || !learnerHydrated) {
    return <div className="card p-6" role="status" aria-live="polite">Loading your canonical learning progress…</div>;
  }

  return <div className="space-y-8">
    <SurfaceHeader
      eyebrow="Your learning studio"
      title={`Welcome back, ${canonicalProfile.name || 'Developer'}`}
      description={`${canonicalProfile.level.charAt(0).toUpperCase() + canonicalProfile.level.slice(1)} path${canonicalProfile.streakDays > 0 ? ` · ${canonicalProfile.streakDays} day streak` : ''}`}
      action={<p className="text-sm text-ink-muted">{progress.topicMasteredCount} of {progress.topics.length} topics mastered</p>}
    />

    {!canonicalProfile.diagnosticDone && <section className="card border-teal/30 bg-teal/5 p-6" aria-labelledby="onboarding-title"><h2 id="onboarding-title" className="text-lg font-semibold text-ink">Choose your first direction</h2><p className="mt-1 text-sm text-ink-light">Browse the canonical JavaScript to React to Next.js path whenever you are ready.</p><Link href="/onboarding" className="btn-primary mt-4 inline-block text-sm">Choose a starting point</Link></section>}

    {state.reviewQueue.length > 0 && <section className="card border-coral/30 bg-coral/5 p-6" aria-labelledby="review-title"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-coral">Review due</p><h2 id="review-title" className="mt-1 text-lg font-semibold text-ink">Keep your recent learning available</h2><p className="mt-1 text-sm text-ink-light">{state.reviewQueue.length} item{state.reviewQueue.length === 1 ? '' : 's'} need a focused check.</p></div><Link href="/review" className="btn-secondary shrink-0 text-center text-sm">Start review</Link></div></section>}

    {nextTopic && <section className="card p-6" aria-labelledby="next-topic-title"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Next recommended action</p><h2 id="next-topic-title" className="mt-1 text-xl font-semibold text-ink">{nextTopic.title}</h2><p className="mt-2 max-w-2xl text-sm text-ink-light">{nextTopic.status === 'not-started' ? 'Start the next required topic in your path.' : `Continue this ${nextTopic.status.replace('-', ' ')} topic.`}</p><Link href={nextTopic.href} className="btn-primary mt-4 inline-flex text-sm">Continue topic</Link></section>}

    <section className="space-y-4" aria-labelledby="module-progress-title"><div className="flex items-end justify-between gap-3"><div><h2 id="module-progress-title" className="text-2xl font-bold text-ink">Module progress</h2><p className="mt-1 text-sm text-ink-muted">Topic mastery and the module check work together.</p></div><Link href="/progress" className="text-sm font-semibold text-teal hover:text-teal-dark">Full progress</Link></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{progress.tracks.flatMap((track) => track.modules.map((module) => <article className="card space-y-3 p-5" key={module.id}><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">{track.title}</p><h3 className="mt-1 font-semibold text-ink">{module.title}</h3></div><span className="text-sm font-bold text-teal">{module.completionPercent}%</span></div><p className="text-sm text-ink-light">{module.masteredTopicCount}/{module.requiredTopicCount} required topics mastered</p><progress className="h-2 w-full accent-teal" max={100} value={module.completionPercent} aria-label={`${module.title} topic completion`} /><p className="text-xs text-ink-muted">{module.complete ? 'Module complete' : module.reviewPercent >= 80 ? 'Ready to continue' : 'Module check pending'}</p><Link href={`/learn/${track.id}/${module.slug}`} className="btn-secondary inline-flex text-sm">Open module</Link></article>))}</div></section>

    <section aria-labelledby="topic-map-title" className="space-y-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="topic-map-title" className="text-2xl font-bold text-ink">Canonical topic map</h2><p className="mt-1 text-sm text-ink-muted">Showing {visibleTopics.length} of {progress.topics.length} topics.</p></div><SearchBar onSearch={setQuery} placeholder="Find a topic" className="sm:w-64" /></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{visibleTopics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}</div>{visibleTopics.length === 0 && <p className="rounded-lg border border-paper-warm p-5 text-sm text-ink-muted">No canonical topics match this search.</p>}</section>
  </div>;
}

function TopicCard({ topic }: { readonly topic: ReturnType<typeof buildCanonicalProgress>['topics'][number] }) {
  const statusLabel = topic.status === 'mastered' ? 'Mastered' : topic.status === 'review-needed' ? 'Review needed' : topic.status === 'in-progress' ? 'In progress' : 'Ready to learn';
  return <Link href={topic.href} className="card block p-5 transition-colors hover:border-teal/40"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">{topic.trackTitle} · {topic.moduleTitle}</p><h3 className="mt-2 font-semibold text-ink">{topic.title}</h3></div><span className="text-sm font-semibold text-teal-dark">{topic.masteryPercent}%</span></div><div className="mt-4 flex items-center justify-between text-xs text-ink-muted"><span>{statusLabel}</span><span>{topic.required ? 'Required' : 'Optional'}</span></div><div className="high-contrast-progress-track mt-2 h-1.5 overflow-hidden rounded-full bg-paper-warm" aria-hidden="true"><div className="high-contrast-progress h-full rounded-full bg-teal" style={{ width: `${topic.masteryPercent}%` }} /></div></Link>;
}
