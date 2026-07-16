import SearchPageContent from './SearchPageContent';

interface SearchPageProps {
  readonly searchParams: Promise<{ readonly q?: string; readonly kind?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  return <SearchPageContent initialQuery={params.q ?? ''} initialKind={params.kind ?? null} />;
}
