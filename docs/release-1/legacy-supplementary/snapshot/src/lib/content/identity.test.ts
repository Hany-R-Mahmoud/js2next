import { describe, expect, it } from 'vitest';
import { challenges } from '@/data/challenges';
import { lessons } from '@/data/lessons';
import { supplementalChallenges } from '@/content/topic-loop-content';
import { contentKey, getChallengeLessonSectionId, getChallengeTopicId } from './identity';

describe('content identity registry', () => {
  it('maps every challenge to an existing owning lesson', () => {
    const lessonIds = new Set(lessons.map((lesson) => lesson.slug));
    expect(challenges.every((challenge) => {
      const topicId = getChallengeTopicId(challenge);
      return topicId !== null && lessonIds.has(topicId);
    })).toBe(true);
  });

  it('keeps content keys unique across kinds', () => {
    const keys = [
      ...lessons.map((lesson) => contentKey('lesson', lesson.slug)),
      ...challenges.map((challenge) => contentKey('challenge', challenge.slug)),
    ];
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('maps every published challenge to an exact lesson section', () => {
    const lessonById = new Map(lessons.map((lesson) => [lesson.slug, lesson]));
    const missing = [...challenges, ...supplementalChallenges].filter((challenge) => {
      const topicId = getChallengeTopicId(challenge);
      const sectionId = getChallengeLessonSectionId(challenge);
      return topicId === null || sectionId === null || !lessonById.get(topicId)?.sections.some((section) => section.id === sectionId);
    }).map((challenge) => challenge.slug);
    expect(missing).toEqual([]);
  });
});
