import type { CanonicalContentRecord } from './catalog';

export type SearchContentKind = CanonicalContentRecord['kind'];

export interface ContentSearchResult {
  readonly record: CanonicalContentRecord;
  readonly score: number;
}

const searchAliases: readonly { readonly aliases: readonly string[]; readonly targets: readonly string[] }[] = [
  { aliases: ['جافاسكريبت', 'جافا سكريبت'], targets: ['javascript'] },
  { aliases: ['الإغلاقات', 'إغلاق', 'اغلاق'], targets: ['closures'] },
  { aliases: ['إدارة الحالة', 'ادارة الحالة', 'الحالة'], targets: ['state'] },
  { aliases: ['المكونات', 'المكوّنات', 'مكونات'], targets: ['components'] },
  { aliases: ['الوعود', 'وعد'], targets: ['promises'] },
  { aliases: ['البرمجة غير المتزامنة', 'غير متزامن'], targets: ['async'] },
  { aliases: ['مكونات الخادم', 'مكونات العميل'], targets: ['server', 'client'] },
  { aliases: ['التخزين المؤقت', 'تخزين مؤقت'], targets: ['caching', 'cache'] },
];

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/ـ/g, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

function aliasesFor(query: string): readonly string[] {
  const normalizedQuery = normalizeSearchText(query);
  return searchAliases.flatMap(({ aliases, targets }) => aliases.some((alias) => normalizeSearchText(alias) === normalizedQuery) ? targets : []);
}

export function searchTextMatches(value: string, query: string): boolean {
  const normalizedValue = normalizeSearchText(value);
  const normalizedQuery = normalizeSearchText(query);
  return normalizedValue.includes(normalizedQuery) || aliasesFor(normalizedQuery).some((target) => normalizedValue.includes(target));
}

export function searchContent(
  records: readonly CanonicalContentRecord[],
  query: string,
  kind?: SearchContentKind,
): readonly ContentSearchResult[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const terms = [...new Set([...normalizedQuery.split(/\s+/).filter(Boolean), ...aliasesFor(normalizedQuery).flatMap((target) => target.split(/\s+/))])];
  const aliasMatch = aliasesFor(normalizedQuery);
  return records
    .filter((record) => kind === undefined || record.kind === kind)
    .map((record) => {
      const title = normalizeSearchText(record.title);
      const haystack = normalizeSearchText([record.title, record.slug, record.topicId, record.topicFamily ?? '', ...record.tags].join(' '));
      const exactTitleScore = title === normalizedQuery ? 100 : 0;
      const titleScore = title.includes(normalizedQuery) ? 40 : 0;
      const aliasScore = aliasMatch.some((target) => haystack.includes(target)) ? 80 : 0;
      const termScore = terms.filter((term) => haystack.includes(term)).length * 10;
      return { record, score: exactTitleScore + titleScore + aliasScore + termScore };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title) || a.record.id.localeCompare(b.record.id));
}
