import { describe, expect, it } from 'vitest';
import { createInitialProgress } from '@/domain/progression/core';
import { createLocalProgressAdapter, loadProgress } from './adapter';
import { exportProgress, parseProgress } from './validation';
import { migrateAssessmentProgressV2, resetForNewCurriculum, rollbackAssessmentProgressV2 } from './migration';

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

  it('archives v1 assessment state while preserving lesson progress and supports rollback', () => {
    const topic = { ...createInitialProgress('p1', 'release-1-draft', 'now').topicProgress, 'JS-01': { topicId: 'JS-01', contentVersion: 1, lessonCompleted: true, requiredCheckIds: ['JS-01-Q01'], attemptedCheckIds: ['JS-01-Q01'], checkResponses: {}, quizAttempts: ['old-attempt'], quizPercent: 100, masteryPercent: 100, status: 'mastered' as const, missedObjectiveIds: ['JS-01-LO1'], confidence: 80, lastActivity: 'old' } };
    const state = { ...createInitialProgress('p1', 'release-1-draft', 'now'), topicProgress: topic, assessmentBankVersion: 1 as const, assessmentAttempts: [{ attemptId: 'old-attempt', assessmentId: 'JS-01-QUIZ', kind: 'topic-quiz' as const, ownerId: 'JS-01', contentVersion: 1, startedAt: 'old', completedAt: 'old', scorePercent: 100, passed: true, answers: [] }] };
    const migrated = migrateAssessmentProgressV2(state, 'new');
    expect(migrated.topicProgress['JS-01']).toMatchObject({ lessonCompleted: true, attemptedCheckIds: [], checkResponses: {}, contentVersion: 2, quizAttempts: [], masteryPercent: 0, status: 'in-progress' });
    expect(migrated.assessmentAttempts).toEqual([]);
    expect(migrated.reviewQueue).toEqual([]);
    expect(migrated.assessmentV1Archive).toMatchObject({ namespace: 'assessment-v1', archivedAt: 'new', attempts: state.assessmentAttempts });
    expect(rollbackAssessmentProgressV2(migrated).topicProgress['JS-01']).toMatchObject({ contentVersion: 1, quizAttempts: ['old-attempt'], masteryPercent: 100 });
    expect(rollbackAssessmentProgressV2(migrated).assessmentAttempts).toEqual(state.assessmentAttempts);
  });
});
