import { describe, expect, it } from 'vitest';
import { aggregateModule, aggregateTrack, createInitialProgress, createTopicProgress, prerequisiteWarning, recordCheckResponse, recordLessonCompletion, recordPracticeAttempt, recordReviewAttempt, recordTopicQuiz } from './core';
import type { AssessmentAttempt, CurriculumDefinition, PracticeAttempt } from './types';

const answer = (questionId: string, objectiveIds: readonly string[], correct: boolean) => ({ questionId, objectiveIds, answer: 1, correct });
const attempt = (kind: AssessmentAttempt['kind'], scorePercent: number, id: string, answers = [answer('q1', ['o1'], scorePercent >= 80)]): AssessmentAttempt => ({ attemptId: id, assessmentId: `${kind}:a`, kind, ownerId: 'topic-1', contentVersion: 1, startedAt: '2026-07-17T00:00:00Z', completedAt: '2026-07-17T01:00:00Z', scorePercent, passed: scorePercent >= 80, answers });

describe('progression core', () => {
  it('masters a topic only after lesson, required checks, and an 80% quiz', () => {
    let state = createInitialProgress('p1', 'release-1', 'now');
    let topic = createTopicProgress('topic-1', 1, ['check-1']);
    state = recordTopicQuiz(state, topic, attempt('topic-quiz', 100, 'a1'), ['o1'], 0.8);
    expect(state.topicProgress['topic-1']?.masteryPercent).toBe(0);
    topic = { ...topic, ...state.topicProgress['topic-1'] };
    state = recordLessonCompletion(state, topic, 't1');
    topic = { ...topic, ...state.topicProgress['topic-1'] };
    state = recordTopicQuiz(state, topic, attempt('topic-quiz', 80, 'a2'), ['o1'], 0.8);
    expect(state.topicProgress['topic-1']?.masteryPercent).toBe(0);
    topic = { ...topic, ...state.topicProgress['topic-1'] };
    state = recordCheckResponse(state, topic, 'check-1', { response: 1, answeredAt: 't2', contentVersion: 1 }, 't2');
    topic = { ...topic, ...state.topicProgress['topic-1'] };
    state = recordTopicQuiz(state, topic, attempt('topic-quiz', 80, 'a3'), ['o1'], 0.8);
    expect(state.topicProgress['topic-1']?.status).toBe('mastered');
  });

  it('retains failed attempts and upserts objective review items', () => {
    const topic = createTopicProgress('topic-1', 1, []);
    const state = recordTopicQuiz(createInitialProgress('p1', 'release-1', 'now'), topic, attempt('topic-quiz', 40, 'failed'), ['o1'], 0.2);
    expect(state.assessmentAttempts).toHaveLength(1);
    expect(state.reviewQueue).toHaveLength(1);
    expect(state.reviewQueue[0]?.objectiveId).toBe('o1');
    const retried = recordReviewAttempt(state, attempt('module-review', 40, 'module-failed'));
    expect(retried.assessmentAttempts).toHaveLength(2);
  });

  it('stores practice separately from scored assessment history', () => {
    const practice: PracticeAttempt = { attemptId: 'practice-1', kind: 'topic-practice', ownerId: 'topic-1', contentVersion: 2, completedAt: '2026-07-17T01:00:00Z', questionIds: ['q1', 'q2'], answeredQuestionIds: ['q1', 'q2'], correctCount: 1 };
    const state = recordPracticeAttempt(createInitialProgress('p1', 'release-1', 'now'), practice);
    expect(state.practiceAttempts).toEqual([practice]);
    expect(state.assessmentAttempts).toEqual([]);
  });

  it('aggregates required content while ignoring optional topics and modules', () => {
    let state = createInitialProgress('p1', 'release-1', 'now');
    state = { ...state, topicProgress: { required: { ...createTopicProgress('required', 1, []), masteryPercent: 100, status: 'mastered' }, optional: { ...createTopicProgress('optional', 1, []), masteryPercent: 0 } } };
    const moduleDefinition = { id: 'm1', required: true, topicIds: [{ id: 'required', required: true, contentVersion: 1 }, { id: 'optional', required: false, contentVersion: 1 }] };
    expect(aggregateModule(state, moduleDefinition, 80).complete).toBe(true);
    const curriculum: CurriculumDefinition = { tracks: [{ id: 't1', required: true, modules: [moduleDefinition] }] };
    expect(aggregateTrack(state, curriculum.tracks[0] ?? curriculum.tracks[0], 80, { m1: 80 }).complete).toBe(true);
  });

  it('returns a soft prerequisite warning with explicit continue', () => {
    const state = createInitialProgress('p1', 'release-1', 'now');
    expect(prerequisiteWarning(state, 'missing')).toEqual({ prerequisiteId: 'missing', masteryPercent: 0, canContinue: true, requiresExplicitConfirmation: false });
  });
});
