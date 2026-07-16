'use client';

import Link from 'next/link';
import { topicBundles } from '@/content/topics';
import { topicFamilyMeta } from '@/data/curriculum';
import { useLearnerStore } from '@/stores/learner';
import ProgressBar from '@/components/shared/ProgressBar';
import SearchBar from '@/components/shared/SearchBar';
import { CapabilityCard } from '@/components/shared/CapabilityCard';
import { capabilityDefinitions, getCapabilityProgress } from '@/lib/learning/capabilities';
import { useMemo, useState } from 'react';

export default function ProgressPage() {
  const { canonicalProfile } = useLearnerStore();
  const [query, setQuery] = useState('');
  const [showAllTopics, setShowAllTopics] = useState(false);
  const mastery = canonicalProfile.masteryRecords;
  const visibleTopics = useMemo(() => topicBundles.filter((bundle) => {
    const searchText = `${bundle.lesson.title} ${topicFamilyMeta[bundle.meta.topicFamily].name}`.toLowerCase();
    return searchText.includes(query.trim().toLowerCase());
  }), [query]);
  const weakSpots = topicBundles
    .map((bundle) => ({ bundle, mastery: mastery[bundle.id]?.mastery ?? 0 }))
    .filter((entry) => entry.mastery < 0.8)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 5);
  const mastered = topicBundles.filter((bundle) => (mastery[bundle.id]?.mastery ?? 0) >= 0.8).length;
  const startedTopics = visibleTopics.filter((bundle) => {
    const stage = canonicalProfile.topicProgress?.[bundle.id]?.stage;
    return (mastery[bundle.id]?.mastery ?? 0) > 0 || (stage !== undefined && stage !== 'learn');
  });
  const mapTopics = showAllTopics || query.trim() ? visibleTopics : startedTopics;
  const recentCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentActivity = (canonicalProfile.learningEvents ?? []).filter((event) => Date.parse(event.occurredAt) >= recentCutoff).slice(-7).reverse();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="mt-2 text-3xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>See what is sticking</h1>
        <p className="mt-1 text-ink-light">Mastery is evidence from completed topic loops, not time spent in the app.</p>
      </header>

      <section className="space-y-4" aria-labelledby="mastery-map-title">
        <div className="flex items-end justify-between gap-3">
          <div><h2 id="mastery-map-title" className="text-xl font-semibold text-ink">Mastery map</h2><p className="mt-1 text-sm text-ink-muted">{mastered} of {topicBundles.length} topics at 80% or higher</p></div>
          <span className="text-2xl font-bold text-teal">{Math.round((mastered / Math.max(topicBundles.length, 1)) * 100)}%</span>
        </div>
        <ProgressBar value={mastered} max={topicBundles.length} size="lg" label="Topics mastered" />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm text-ink-muted">Showing {mapTopics.length} of {topicBundles.length} topics{!showAllTopics && !query.trim() ? ' started' : ''}.</p>
          <SearchBar onSearch={setQuery} placeholder="Find a topic" className="sm:w-64" />
        </div>
        {!showAllTopics && !query.trim() && <button type="button" onClick={() => setShowAllTopics(true)} className="btn-secondary text-sm">Show all topics</button>}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {mapTopics.length > 0 ? mapTopics.map((bundle) => {
            const value = mastery[bundle.id]?.mastery ?? 0;
            return <Link key={bundle.id} href={`/topic/${bundle.id}`} className="rounded-lg border border-paper-warm p-4 hover:border-teal/40"><div className="flex items-center justify-between gap-2"><span className="text-sm font-medium text-ink">{bundle.lesson.title}</span><span className="text-sm font-semibold text-teal">{Math.round(value * 100)}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-warm"><div className="h-full rounded-full bg-teal" style={{ width: `${Math.round(value * 100)}%` }} /></div><p className="mt-2 text-xs text-ink-muted">{topicFamilyMeta[bundle.meta.topicFamily].name}</p></Link>;
          }) : <p className="rounded-lg border border-paper-warm p-5 text-sm text-ink-muted">No topics started yet. Use Home to begin the recommended topic, or search to find a topic.</p>}
        </div>
      </section>

      <section className="space-y-4 border-t border-paper-warm pt-6" aria-labelledby="capabilities-title">
        <div>
          <h2 id="capabilities-title" className="text-xl font-semibold text-ink">Earned capabilities</h2>
          <p className="mt-1 text-sm text-ink-muted">Complete topic loops and reach 80% mastery to earn durable skills.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {capabilityDefinitions.map((definition) => <CapabilityCard key={definition.id} definition={definition} progress={getCapabilityProgress(canonicalProfile, definition)} />)}
        </div>
      </section>

      <section className="space-y-4 border-t border-paper-warm pt-6" aria-labelledby="weak-spots-title">
        <h2 id="weak-spots-title" className="text-xl font-semibold text-ink">Weak spots</h2>
        <p className="mt-1 text-sm text-ink-muted">Up to five topics worth your next focused session.</p>
        <div className="mt-4 space-y-3">{weakSpots.length > 0 ? weakSpots.map(({ bundle, mastery: value }) => <Link key={bundle.id} href={`/topic/${bundle.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-paper-warm p-4 hover:border-coral/40"><div><p className="font-medium text-ink">{bundle.lesson.title}</p><p className="mt-1 text-xs text-ink-muted">{topicFamilyMeta[bundle.meta.topicFamily].name}</p></div><span className="font-semibold text-coral">{Math.round(value * 100)}%</span></Link>) : <p className="text-sm text-ink-muted">No weak spots yet. Keep the loop going.</p>}</div>
      </section>

      <section className="space-y-4 border-t border-paper-warm pt-6" aria-labelledby="recent-activity-title">
        <h2 id="recent-activity-title" className="text-xl font-semibold text-ink">Recent activity</h2>
        <p className="mt-1 text-sm text-ink-muted">The last seven days, capped at seven entries.</p>
        <div className="mt-4 space-y-3">{recentActivity.length > 0 ? recentActivity.map((event, index) => <div key={`${event.occurredAt}-${index}`} className="rounded-lg bg-paper-dark/40 p-4 text-sm"><p className="font-medium text-ink">{eventLabel(event.type)} · {topicBundles.find((bundle) => bundle.id === event.topicId)?.lesson.title ?? event.topicId}</p><p className="mt-1 text-xs text-ink-muted">{new Date(event.occurredAt).toLocaleString()}</p></div>) : <p className="text-sm text-ink-muted">Complete a topic loop to see activity here.</p>}</div>
      </section>
    </div>
  );
}

function eventLabel(type: string): string {
  switch (type) {
    case 'lesson-completed': return 'Lesson completed';
    case 'challenge-attempted': return 'Practice attempted';
    case 'qa-confirmed': return 'Q&A confirmed';
    case 'topic-completed': return 'Topic completed';
    default: return 'Learning activity';
  }
}
