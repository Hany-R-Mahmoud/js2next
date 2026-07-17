import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { challenges } from '@/data/challenges';
import { lessons } from '@/data/lessons';
import { challengeSlugs, lessonSlugs, middleware } from './middleware';

describe('route and content parity', () => {
  it('keeps the landing page as the default entrypoint', () => {
    const response = middleware(new NextRequest('http://localhost/'));
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('keeps middleware route identity aligned with published content', () => {
    expect([...lessonSlugs].sort()).toEqual(lessons.map((lesson) => lesson.slug).sort());
    expect([...challengeSlugs].sort()).toEqual(challenges.map((challenge) => challenge.slug).sort());
  });
});
