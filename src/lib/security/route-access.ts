import 'server-only';

import { notFound, redirect } from 'next/navigation';
import type { Topic } from '@/domain/curriculum';
import type { AssessmentSet } from '@/domain/assessment';
import { getContentAccessMode, resolveContentAccess } from './access';
import { getMemberAccess } from './member';

export class ContentAccessDeniedError extends Error {
  readonly name = 'ContentAccessDeniedError';

  constructor(readonly reason: 'closed' | 'unauthenticated' | 'unpublished' | 'revoked' | 'expired' | 'locked') {
    super(`Content access denied: ${reason}`);
  }
}

export async function requireTopicAccess(topic: Pick<Topic, 'status' | 'reviewStatus'>): Promise<void> {
  const mode = getContentAccessMode();
  const decision = resolveContentAccess({
    mode,
    topic,
    membership: mode === 'members' ? (await getMemberAccess())?.membership ?? null : null,
  });
  if (!decision.allowed) throw new ContentAccessDeniedError(decision.reason);
}

export async function enforceTopicAccess(topic: Pick<Topic, 'status' | 'reviewStatus'>, path: string): Promise<void> {
  try {
    await requireTopicAccess(topic);
  } catch (error) {
    if (error instanceof ContentAccessDeniedError && error.reason === 'unauthenticated') signInRedirect(path);
    notFound();
  }
}

export async function enforceAssessmentAccess(assessment: Pick<AssessmentSet, 'status' | 'reviewStatus'>, path: string): Promise<void> {
  await enforceTopicAccess({ status: assessment.status === 'retired' ? 'archived' : assessment.status, reviewStatus: assessment.reviewStatus }, path);
}

export async function requirePreviewAccess(): Promise<void> {
  if (getContentAccessMode() !== 'preview') notFound();
}

export async function requireWorkspaceAccess(): Promise<void> {
  const mode = getContentAccessMode();
  if (mode === 'preview') return;
  if (mode === 'closed') notFound();
  if ((await getMemberAccess()) === null) redirect('/sign-in');
}

export function signInRedirect(path: string): never {
  redirect(`/sign-in?next=${encodeURIComponent(path)}`);
}
