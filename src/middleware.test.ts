import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { challenges } from '@/data/challenges';
import { lessons } from '@/data/lessons';
import { challengeSlugs, lessonSlugs, middleware } from './middleware';

describe('route and content parity', () => {
  it('routes the default entrypoint to the Release 1 curriculum', () => {
    const response = middleware(new NextRequest('http://localhost/'));
    expect(response.headers.get('location')).toBe('http://localhost/tracks');
  });

  it('keeps middleware route identity aligned with published content', () => {
    expect([...lessonSlugs].sort()).toEqual(lessons.map((lesson) => lesson.slug).sort());
    expect([...challengeSlugs].sort()).toEqual(challenges.map((challenge) => challenge.slug).sort());
  });
});
