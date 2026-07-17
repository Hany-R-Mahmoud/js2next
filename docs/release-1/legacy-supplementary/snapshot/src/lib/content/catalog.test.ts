import { describe, expect, it } from 'vitest';
import { buildContentCatalog } from './catalog';

describe('canonical content catalog', () => {
  it('has unique typed identities and direct provenance for every published record', () => {
    const records = buildContentCatalog();
    expect(records.length).toBeGreaterThan(0);
    expect(new Set(records.map((record) => record.id)).size).toBe(records.length);
    expect(records.every((record) => record.sourceMetadata.length > 0)).toBe(true);
    expect(records.every((record) => record.sourceMetadata.every((source) => source.sourceUrl.startsWith('http')))).toBe(true);
  });

  it('covers every canonical content kind without duplicate IDs', () => {
    const records = buildContentCatalog();
    expect(new Set(records.map((record) => record.kind))).toEqual(new Set(['lesson', 'challenge', 'qa', 'practice']));
    expect(records.filter((record) => record.kind === 'lesson').length).toBeGreaterThan(0);
    expect(records.filter((record) => record.kind === 'challenge').length).toBeGreaterThan(0);
    expect(records.filter((record) => record.kind === 'qa').length).toBeGreaterThan(0);
    expect(records.filter((record) => record.kind === 'practice').length).toBeGreaterThan(0);
  });

  it('keeps every challenge ownership reference inside the lesson catalog', () => {
    const records = buildContentCatalog();
    const lessonIds = new Set(records.filter((record) => record.kind === 'lesson').map((record) => record.topicId));
    expect(records.filter((record) => record.kind === 'challenge').every((record) => lessonIds.has(record.topicId))).toBe(true);
  });

  it('publishes the v1 normalized fields and explicit expansion ownership', () => {
    const records = buildContentCatalog();
    expect(records.every((record) => record.schemaVersion === 1 && record.title.trim() && record.tags.length > 0 && record.topicId.trim() && record.topicFamily !== undefined)).toBe(true);
    const expansionRecords = records.filter((record) => record.id.includes(':expansion-'));
    expect(expansionRecords.length).toBeGreaterThan(0);
    const lessonTopics = new Set(records.filter((record) => record.kind === 'lesson').map((record) => record.topicId));
    expect(expansionRecords.filter((record) => record.kind === 'qa' || record.kind === 'practice').every((record) => lessonTopics.has(record.topicId))).toBe(true);
  });
});
