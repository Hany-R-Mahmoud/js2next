import { NextRequest, NextResponse } from 'next/server';
import { topicBundles } from '@/content/topics';
import { challenges } from '@/data/challenges';
import { lessons } from '@/data/lessons';

export const topicSlugs = new Set(topicBundles.map((bundle) => bundle.id));
export const lessonSlugs = new Set(lessons.map((lesson) => lesson.slug));
export const challengeSlugs = new Set(challenges.map((challenge) => challenge.slug));

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/tracks', request.url));
  }

  const topicSlug = request.nextUrl.pathname.match(/^\/topic\/([^/]+)$/)?.[1];
  const knownTopic = topicSlug && topicSlugs.has(topicSlug);

  if (topicSlug && !knownTopic) {
    return NextResponse.rewrite(new URL('/not-found', request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/topic/:slug'],
};
