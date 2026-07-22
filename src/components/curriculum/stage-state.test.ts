import { describe, expect, it } from 'vitest';
import { createInitialProgress, createTopicProgress } from '@/domain/progression/core';
import { initialModuleStage, initialTopicStage, moduleStageStates, topicStageStates } from './stage-state';

const topic = (overrides: Partial<ReturnType<typeof createTopicProgress>> = {}) => ({
  ...createTopicProgress('JS-01', 1, []),
  ...overrides,
});

describe('learning stage state', () => {
  it('locks forward topic stages until their source evidence exists', () => {
    expect(topicStageStates(undefined, false).map((stage) => stage.status)).toEqual(['available', 'locked', 'locked', 'locked']);
    expect(topicStageStates(topic({ lessonCompleted: true }), false).map((stage) => stage.status)).toEqual(['done', 'available', 'locked', 'locked']);
    expect(topicStageStates(topic({ lessonCompleted: true }), true).map((stage) => stage.status)).toEqual(['done', 'done', 'available', 'locked']);
  });

  it('chooses the next topic stage after refresh', () => {
    expect(initialTopicStage(undefined, false)).toBe('learn');
    expect(initialTopicStage(topic({ lessonCompleted: true }), false)).toBe('practice');
    expect(initialTopicStage(topic({ lessonCompleted: true }), true)).toBe('check');
    expect(initialTopicStage(topic({ masteryPercent: 80 }), false)).toBe('reflect');
  });

  it('keeps module check locked until every required topic is mastered', () => {
    const state = createInitialProgress('p1', 'release-1', 'now');
    const requiredTopics = [{ id: 'JS-01', required: true }, { id: 'JS-02', required: true }] as const;
    const snapshot = { requiredTopics, state, reviewPercent: 0, practiceCompleted: false, checkAttempted: false };
    expect(moduleStageStates(snapshot)[2]?.lockReason).toContain('2 required topics');
    expect(initialModuleStage(snapshot)).toBe('learn');
    expect(initialModuleStage({ ...snapshot, practiceCompleted: true })).toBe('practice');
  });
});
