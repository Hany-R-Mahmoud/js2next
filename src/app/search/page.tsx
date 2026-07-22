import SearchPageContent from './SearchPageContent';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

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
  const params = await searchParams;
  return <SearchPageContent initialQuery={params.q ?? ''} initialKind={params.kind ?? null} />;
}
