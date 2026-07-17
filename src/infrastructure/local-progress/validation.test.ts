import { describe, expect, it } from 'vitest';
import { createInitialProgress } from '@/domain/progression/core';
import { createLocalProgressAdapter, loadProgress } from './adapter';
import { exportProgress, parseProgress } from './validation';
import { resetForNewCurriculum } from './migration';

describe('local progress boundary', () => {
  it('round-trips the schema-versioned empty state', () => {
    const state = createInitialProgress('local-default', 'release-1-draft', '2026-07-17');
    const parsed = parseProgress(exportProgress(state));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.state).toEqual(state);
  });

  it('accepts the supplied empty fixture contract', () => {
    const fixture = JSON.stringify({ schemaVersion: '1.0', profileId: 'local-default', curriculumVersion: 'release-1-draft', topicProgress: {}, assessmentAttempts: [], reviewQueue: [], legacyProgress: { imported: false, countsTowardNewMastery: false, exportReference: null }, updatedAt: '2026-07-17' });
    expect(parseProgress(fixture).ok).toBe(true);
  });

  it('does not replace state for malformed or future imports', () => {
    const fallback = createInitialProgress('p1', 'release-1', 'now');
    expect(loadProgress({ load: () => '{', save: () => undefined }, fallback)).toBe(fallback);
    expect(loadProgress({ load: () => JSON.stringify({ ...fallback, schemaVersion: '2.0' }), save: () => undefined }, fallback)).toBe(fallback);
  });

  it('keeps a legacy export separate during clean curriculum reset', () => {
    const state = resetForNewCurriculum('p1', 'release-1', 'now', 'legacy-export.json');
    expect(state.topicProgress).toEqual({});
    expect(state.legacyProgress).toEqual({ imported: true, countsTowardNewMastery: false, exportReference: 'legacy-export.json' });
  });

  it('adapts a Storage-like boundary without domain dependencies', () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
    const adapter = createLocalProgressAdapter(storage);
    adapter.save('value');
    expect(adapter.load()).toBe('value');
  });
});
