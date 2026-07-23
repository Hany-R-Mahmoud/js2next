import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { safeNextPath } from '@/lib/security/safe-next-path';
import { readSupabaseConfig } from '@/lib/supabase/config';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const code = request.nextUrl.searchParams.get('code');
  const nextPath = safeNextPath(request.nextUrl.searchParams.get('next'));
  if (code === null) return NextResponse.redirect(new URL('/sign-in?error=missing_code', request.url));
  if (readSupabaseConfig() === null) return NextResponse.redirect(new URL('/sign-in?error=not_configured', request.url));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error !== null) return NextResponse.redirect(new URL('/sign-in?error=invalid_code', request.url));
  return NextResponse.redirect(new URL(nextPath, request.url));
}
