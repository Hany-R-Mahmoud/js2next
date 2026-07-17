import { describe, expect, it } from 'vitest';
import { buildLegacyContentInventory } from './inventory';

describe('legacy content inventory', () => {
  it('keeps lesson source coverage visible and flags unscored legacy sets', () => {
    const inventory = buildLegacyContentInventory();
    expect(inventory.lessons.itemCount).toBeGreaterThan(0);
    expect(inventory.lessons.ok).toBe(true);
    expect(inventory.challenges.ok).toBe(true);
    expect(inventory.questions.ok).toBe(true);
    expect(inventory.practices.ok).toBe(true);
  });

  it('requires direct provenance on every published challenge and question', async () => {
    const [{ challenges }, { qaItems }] = await Promise.all([
      import('@/data/challenges'),
      import('@/data/qa'),
    ]);
    expect(challenges.every((challenge) => typeof challenge.sourceLink === 'string')).toBe(true);
    expect(qaItems.every((item) => typeof item.sourceLink === 'string')).toBe(true);
  });

  it('keeps every lesson handoff inside the lesson graph', async () => {
    const { lessons } = await import('@/data/lessons');
    const slugs = new Set(lessons.map((lesson) => lesson.slug));
    expect(lessons.flatMap((lesson) => lesson.nextTopics).every((slug) => slugs.has(slug))).toBe(true);
  });
});
