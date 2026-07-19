import { describe, expect, it } from 'vitest';
import { createInitialProgress, createTopicProgress } from '@/domain/progression/core';
import { initialModuleStage, initialTopicStage, moduleStageStates, topicStageStates } from './stage-state';

const topic = (overrides: Partial<ReturnType<typeof createTopicProgress>> = {}) => ({
  ...createTopicProgress('JS-01', 1, []),
  ...overrides,
});

describe('learning stage state', () => {
  it('locks forward topic stages until their source evidence exists', () => {
    expect(topicStageStates(undefined).map((stage) => stage.status)).toEqual(['available', 'available', 'locked', 'locked', 'locked']);
    expect(topicStageStates(topic({ lessonCompleted: true })).map((stage) => stage.status)).toEqual(['done', 'done', 'available', 'locked', 'locked']);
    expect(topicStageStates(topic({ lessonCompleted: true, quizAttempts: ['attempt'] })).map((stage) => stage.status)).toEqual(['done', 'done', 'done', 'available', 'locked']);
  });

  it('chooses the next topic stage after refresh', () => {
    expect(initialTopicStage(undefined)).toBe('overview');
    expect(initialTopicStage(topic({ lessonCompleted: true }))).toBe('practice');
    expect(initialTopicStage(topic({ lessonCompleted: true, quizAttempts: ['attempt'] }))).toBe('check');
    expect(initialTopicStage(topic({ masteryPercent: 80 }))).toBe('reflect');
  });

  it('keeps module check locked until every required topic is mastered', () => {
    const state = createInitialProgress('p1', 'release-1', 'now');
    const requiredTopics = [{ id: 'JS-01', required: true }, { id: 'JS-02', required: true }] as const;
    const snapshot = { requiredTopics, state, reviewPercent: 0 };
    expect(moduleStageStates(snapshot)[3]?.lockReason).toContain('2 required topics');
    expect(initialModuleStage(snapshot)).toBe('overview');
    expect(initialModuleStage({ ...snapshot, reviewPercent: 100 })).toBe('overview');
  });
});
