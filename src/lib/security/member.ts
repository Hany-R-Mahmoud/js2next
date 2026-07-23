import 'server-only';

import { z } from 'zod';
import { isMembershipValid, type MembershipSnapshot } from './access';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { readSupabaseConfig } from '@/lib/supabase/config';

const membershipSchema = z.object({
  status: z.enum(['active', 'revoked']),
  expires_at: z.string().nullable(),
  locked_until: z.string().nullable(),
});

export type MemberAccess = {
  readonly userId: string;
  readonly membership: MembershipSnapshot;
};

export async function getMemberAccess(): Promise<MemberAccess | null> {
  if (readSupabaseConfig() === null) return null;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error !== null || data === null || typeof data.claims.sub !== 'string') return null;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (
    userError !== null ||
    userData.user === null ||
    userData.user.id !== data.claims.sub ||
    userData.user.email_confirmed_at === null
  ) return null;

  const { data: membership, error: membershipError } = await supabase
    .from('members')
    .select('status, expires_at, locked_until')
    .eq('user_id', data.claims.sub)
    .maybeSingle();
  if (membershipError !== null) return null;

  if (membership === null) {
    return {
      userId: data.claims.sub,
      membership: { status: 'active', expiresAt: null, lockedUntil: null },
    };
  }

  const parsed = membershipSchema.safeParse(membership);
  if (!parsed.success) return null;
  const snapshot = {
    status: parsed.data.status,
    expiresAt: parsed.data.expires_at,
    lockedUntil: parsed.data.locked_until,
  } satisfies MembershipSnapshot;
  if (!isMembershipValid(snapshot)) return null;
  return {
    userId: data.claims.sub,
    membership: snapshot,
  };
}
