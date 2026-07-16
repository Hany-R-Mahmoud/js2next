import type { CanonicalContentRecord } from './catalog';

export type SearchContentKind = CanonicalContentRecord['kind'];

export interface ContentSearchResult {
  readonly record: CanonicalContentRecord;
  readonly score: number;
}

export function searchContent(
  records: readonly CanonicalContentRecord[],
  query: string,
  kind?: SearchContentKind,
): readonly ContentSearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  return records
    .filter((record) => kind === undefined || record.kind === kind)
    .map((record) => {
      const title = record.title.toLowerCase();
      const haystack = [record.title, record.slug, record.topicId, record.topicFamily ?? '', ...record.tags]
        .join(' ')
        .toLowerCase();
      const exactTitleScore = title === normalizedQuery ? 100 : 0;
      const titleScore = title.includes(normalizedQuery) ? 40 : 0;
      const termScore = terms.filter((term) => haystack.includes(term)).length * 10;
      return { record, score: exactTitleScore + titleScore + termScore };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title) || a.record.id.localeCompare(b.record.id));
}
