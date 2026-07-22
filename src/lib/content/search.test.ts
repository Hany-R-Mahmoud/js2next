import { describe, expect, it } from 'vitest';
import { contentCatalog } from './catalog';
import { normalizeSearchText, searchContent, searchTextMatches } from './search';

describe('searchContent', () => {
  it('searches titles, topic metadata, and tags across all content kinds', () => {
    const results = searchContent(contentCatalog, 'state');
    expect(new Set(results.map(({ record }) => record.kind))).toEqual(new Set(['lesson', 'challenge', 'qa', 'practice']));
  });

  it('filters results by content kind', () => {
    const results = searchContent(contentCatalog, 'state', 'lesson');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(({ record }) => record.kind === 'lesson')).toBe(true);
  });

  it('returns no results for blank queries and uses deterministic tie ordering', () => {
    expect(searchContent(contentCatalog, '   ')).toEqual([]);
    const records = contentCatalog.filter((record) => record.title.toLowerCase().includes('react')).slice(0, 3);
    expect(searchContent(records, 'react').map(({ record }) => record.id)).toEqual(
      [...records].sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id)).map((record) => record.id),
    );
  });

  it('normalizes Arabic variants and maps reviewed aliases to English concepts', () => {
    expect(normalizeSearchText('إِدارةُ الحالة')).toBe('ادارة الحالة');
    expect(searchTextMatches('Closures in JavaScript', 'الإغلاقات')).toBe(true);
    expect(searchContent(contentCatalog, 'مكونات').slice(0, 3).every(({ record }) => record.title.toLowerCase().includes('component') || record.topicId.includes('component'))).toBe(true);
    expect(searchContent(contentCatalog, 'جافاسكريبت').length).toBeGreaterThan(0);
  });
});
