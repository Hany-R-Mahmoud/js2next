import Link from 'next/link';
import type { CanonicalContentRecord } from '@/lib/content/catalog';
import type { SearchContentKind } from '@/lib/content/search';
import { topicFamilyMeta } from '@/data/curriculum';

const kindOptions: readonly { readonly value: SearchContentKind | 'all'; readonly label: string }[] = [
  { value: 'all', label: 'All content' },
  { value: 'lesson', label: 'Lessons' },
  { value: 'challenge', label: 'Challenges' },
  { value: 'qa', label: 'Q&A' },
  { value: 'practice', label: 'Practice' },
];

type PublicSearchRecord = Pick<CanonicalContentRecord, 'id' | 'kind' | 'level' | 'slug' | 'title' | 'topicFamily' | 'topicId'>;

interface SearchPageContentProps {
  readonly initialQuery: string;
  readonly initialKind: SearchContentKind | 'all';
  readonly results: readonly PublicSearchRecord[];
}

export default function SearchPageContent({ initialQuery, initialKind, results }: SearchPageContentProps) {
  return <div className="space-y-8">
    <header>
      <p className="eyebrow">Member library</p>
      <h1 className="mt-2 text-3xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>Find the next useful idea</h1>
      <p className="mt-1 text-ink-light">Search the learning library after signing in. Full lesson content never enters the browser search bundle.</p>
    </header>
    <section className="card space-y-4 p-6" aria-labelledby="search-title">
      <h2 id="search-title" className="font-semibold text-ink">Search the learning library</h2>
      <form className="flex flex-col gap-3 sm:flex-row" method="get">
        <label className="flex-1"><span className="sr-only">Search content</span><input type="search" name="q" defaultValue={initialQuery} dir="auto" placeholder="Try “state”, “جافاسكريبت”, or “testing”" className="min-h-11 w-full rounded-[10px] border border-ash bg-slate px-4 py-3 text-white placeholder:text-ash focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal" /></label>
        <label><span className="sr-only">Filter by content type</span><select name="kind" defaultValue={initialKind} className="min-h-11 w-full rounded-[10px] border border-ash bg-slate px-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal sm:w-44">{kindOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <button className="btn-primary min-h-11" type="submit">Search</button>
      </form>
    </section>
    <section aria-live="polite" aria-labelledby="results-title">
      <h2 id="results-title" className="text-xl font-semibold text-ink">{initialQuery.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Start with a search'}</h2>
      {initialQuery.trim() && results.length === 0 && <p className="mt-4 text-sm text-ink-muted">No matches yet. Try a broader topic, family, or tag.</p>}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {results.map((record) => <Link key={record.id} href={`/topic/${record.topicId}`} className="rounded-lg border border-paper-warm p-4 transition-colors hover:border-teal/40"><div className="flex items-start justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-wide text-teal">{kindLabel(record.kind)}</span>{record.level !== undefined && <span className="text-xs text-ink-muted">Level {record.level}</span>}</div><h3 className="mt-2 font-semibold text-ink">{record.title}</h3><p className="mt-1 text-sm text-ink-muted">{familyLabel(record.topicFamily)} · Open topic</p></Link>)}
      </div>
    </section>
  </div>;
}

function kindLabel(kind: SearchContentKind): string {
  return kindOptions.find((option) => option.value === kind)?.label ?? kind;
}

function familyLabel(topicFamily: PublicSearchRecord['topicFamily']): string {
  return topicFamily ? topicFamilyMeta[topicFamily].name : 'Learning library';
}
