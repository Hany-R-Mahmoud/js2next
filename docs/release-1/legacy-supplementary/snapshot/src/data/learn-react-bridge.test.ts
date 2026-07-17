import { describe, expect, it } from 'vitest';
import { lessons } from './lessons';
import { learnReactDeepDives } from './learn-react-bridge';

describe('learn-react content bridge', () => {
  it('adds every deep dive to the canonical lesson graph', () => {
    const ids = new Set(lessons.map((lesson) => lesson.slug));
    expect(learnReactDeepDives).toHaveLength(9);
    expect(new Set(learnReactDeepDives.map((lesson) => lesson.slug)).size).toBe(9);
    expect(learnReactDeepDives.every((lesson) => ids.has(lesson.slug))).toBe(true);
    expect(learnReactDeepDives.every((lesson) => lesson.metadata.sources.length > 0)).toBe(true);
    expect(learnReactDeepDives.flatMap((lesson) => lesson.nextTopics).every((slug) => ids.has(slug))).toBe(true);
  });

  it('keeps the merged deep dives actionable beyond passive reading', () => {
    expect(learnReactDeepDives.every((lesson) => (lesson.chunks?.length ?? 0) >= 2)).toBe(true);
    expect(learnReactDeepDives.every((lesson) => lesson.miniProject?.acceptance.length === 4)).toBe(true);
    expect(learnReactDeepDives.every((lesson) => lesson.diagram?.edges.length === 2)).toBe(true);
  });
});
