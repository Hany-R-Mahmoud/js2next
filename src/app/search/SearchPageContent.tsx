'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { contentCatalog, type CanonicalContentRecord } from '@/lib/content/catalog';
import { searchContent, type SearchContentKind } from '@/lib/content/search';
import { topicFamilyMeta } from '@/data/curriculum';

const kindOptions: readonly { value: SearchContentKind | 'all'; label: string }[] = [
  { value: 'all', label: 'All content' },
  { value: 'lesson', label: 'Lessons' },
  { value: 'challenge', label: 'Challenges' },
  { value: 'qa', label: 'Q&A' },
  { value: 'practice', label: 'Practice' },
];

interface SearchPageContentProps {
  readonly initialQuery: string;
  readonly initialKind: string | null;
}

export default function SearchPageContent({ initialQuery, initialKind }: SearchPageContentProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [kind, setKind] = useState<SearchContentKind | 'all'>(readKind(initialKind));
  const results = useMemo(
    () => searchContent(contentCatalog, query, kind === 'all' ? undefined : kind),
    [kind, query],
  );

  const updateUrl = (nextQuery: string, nextKind: SearchContentKind | 'all') => {
    const params = new URLSearchParams(window.location.search);
    if (nextQuery.trim()) params.set('q', nextQuery);
    else params.delete('q');
    if (nextKind === 'all') params.delete('kind');
    else params.set('kind', nextKind);
    const queryString = params.toString();
    router.replace(queryString ? `/search?${queryString}` : '/search');
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Library</p>
        <h1 className="mt-2 text-3xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Find the next useful idea</h1>
        <p className="mt-1 text-ink-light">Search lessons, challenges, Q&amp;A, and practice prompts from the canonical content catalog.</p>
      </header>

      <section className="card p-6 space-y-4" aria-labelledby="search-title">
        <h2 id="search-title" className="font-semibold text-ink">Search the learning library</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Search content</span>
            <input
              type="search"
              dir="auto"
              value={query}
              onChange={(event) => { setQuery(event.target.value); updateUrl(event.target.value, kind); }}
              placeholder="Try “state”, “جافاسكريبت”, or “testing”"
              className="min-h-11 w-full rounded-[10px] border border-ash bg-slate px-4 py-3 text-white placeholder:text-ash focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </label>
          <label>
            <span className="sr-only">Filter by content type</span>
            <select
              value={kind}
              onChange={(event) => { const nextKind = event.target.value as SearchContentKind | 'all'; setKind(nextKind); updateUrl(query, nextKind); }}
              className="min-h-11 w-full rounded-[10px] border border-ash bg-slate px-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal sm:w-44"
            >
              {kindOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section aria-live="polite" aria-labelledby="results-title">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="results-title" className="text-xl font-semibold text-ink">{query.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Start with a search'}</h2>
        </div>
        {query.trim() && results.length === 0 && <p className="mt-4 text-sm text-ink-muted">No matches yet. Try a broader topic, family, or tag. الدروس متاحة بالإنجليزية؛ جرّب الاسم الإنجليزي للمفهوم إذا لزم الأمر.</p>}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {results.map(({ record }) => (
            <Link key={record.id} href={`/topic/${record.topicId}`} className="rounded-lg border border-paper-warm p-4 transition-colors hover:border-teal/40">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-teal">{kindLabel(record.kind)}</span>
                {record.level !== undefined && <span className="text-xs text-ink-muted">Level {record.level}</span>}
              </div>
              <h3 className="mt-2 font-semibold text-ink">{record.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{familyLabel(record.topicFamily)} · Open topic</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function readKind(value: string | null): SearchContentKind | 'all' {
  return kindOptions.some((option) => option.value === value) ? value as SearchContentKind : 'all';
}

function kindLabel(kind: SearchContentKind): string {
  return kindOptions.find((option) => option.value === kind)?.label ?? kind;
}

function familyLabel(topicFamily: CanonicalContentRecord['topicFamily']): string {
  return topicFamily ? topicFamilyMeta[topicFamily].name : 'Learning library';
}
