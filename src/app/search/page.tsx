import SearchPageContent from './SearchPageContent';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { requireWorkspaceAccess } from '@/lib/security/route-access';
import { contentCatalog } from '@/lib/content/catalog';
import { searchContent, type SearchContentKind } from '@/lib/content/search';

export const metadata: Metadata = pageMetadata({
  title: 'Search the learning library',
  description: 'Search JS2Next lessons, challenges, Q&A, and practice prompts.',
  path: '/search',
  indexable: false,
});

interface SearchPageProps {
  readonly searchParams: Promise<{ readonly q?: string; readonly kind?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  await requireWorkspaceAccess();
  const params = await searchParams;
  const initialQuery = params.q ?? '';
  const initialKind = readKind(params.kind ?? null);
  const results = searchContent(contentCatalog, initialQuery, initialKind === 'all' ? undefined : initialKind)
    .slice(0, 50)
    .map(({ record }) => ({
      id: record.id,
      kind: record.kind,
      level: record.level,
      slug: record.slug,
      title: record.title,
      topicFamily: record.topicFamily,
      topicId: record.topicId,
    }));
  return <SearchPageContent initialQuery={initialQuery} initialKind={initialKind} results={results} />;
}

function readKind(value: string | null): SearchContentKind | 'all' {
  return value === 'lesson' || value === 'challenge' || value === 'qa' || value === 'practice' ? value : 'all';
}
