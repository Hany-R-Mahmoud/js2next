import { NextRequest, NextResponse } from 'next/server';
import { challenges } from '@/data/challenges';
import { lessons } from '@/data/lessons';
import { updateSupabaseSession } from '@/lib/supabase/middleware';

export const topicSlugs = new Set<string>();
export const lessonSlugs = new Set(lessons.map((lesson) => lesson.slug));
export const challengeSlugs = new Set(challenges.map((challenge) => challenge.slug));

export async function middleware(request: NextRequest): Promise<NextResponse> {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
