import { describe, expect, it } from 'vitest';
import { challenges } from '@/data/challenges';
import { lessons } from '@/data/lessons';
import { challengeSlugs, lessonSlugs } from './middleware';

describe('route and content parity', () => {
  it('keeps middleware route identity aligned with published content', () => {
    expect([...lessonSlugs].sort()).toEqual(lessons.map((lesson) => lesson.slug).sort());
    expect([...challengeSlugs].sort()).toEqual(challenges.map((challenge) => challenge.slug).sort());
  });
});
