import type { Topic } from '@/domain/curriculum';

export const CONTENT_ACCESS_MODES = ['closed', 'preview', 'members'] as const;
export type ContentAccessMode = (typeof CONTENT_ACCESS_MODES)[number];

export type MembershipSnapshot = {
  readonly status: 'active' | 'revoked';
  readonly expiresAt: string | null;
  readonly lockedUntil: string | null;
};

export type ContentAccessDecision =
  | { readonly allowed: true }
  | { readonly allowed: false; readonly reason: 'closed' | 'unauthenticated' | 'unpublished' | 'revoked' | 'expired' | 'locked' };

export function contentAccessMode(nodeEnv: string | undefined, rawMode: string | undefined): ContentAccessMode {
  if (isContentAccessMode(rawMode)) return rawMode;
  return nodeEnv === 'production' ? 'closed' : 'preview';
}

export function getContentAccessMode(): ContentAccessMode {
  return contentAccessMode(process.env.NODE_ENV, process.env.CONTENT_ACCESS_MODE);
}

export function isPublishedTopic(topic: Pick<Topic, 'status' | 'reviewStatus'>): boolean {
  return topic.status === 'published' && topic.reviewStatus === 'approved';
}

export function isCatalogTopic(topic: Pick<Topic, 'status'>): boolean {
  return topic.status !== 'archived';
}

export function isMembershipValid(membership: MembershipSnapshot, now = new Date()): boolean {
  if (membership.status !== 'active') return false;
  if (membership.expiresAt !== null && !isFutureDate(membership.expiresAt, now)) return false;
  if (membership.lockedUntil !== null && isLockedDate(membership.lockedUntil, now)) return false;
  return true;
}

export function resolveContentAccess({
  mode,
  topic,
  membership,
  now = new Date(),
}: {
  readonly mode: ContentAccessMode;
  readonly topic: Pick<Topic, 'status' | 'reviewStatus'>;
  readonly membership: MembershipSnapshot | null;
  readonly now?: Date;
}): ContentAccessDecision {
  if (mode === 'closed') return { allowed: false, reason: 'closed' };
  if (mode === 'preview') return topic.status === 'archived' ? { allowed: false, reason: 'unpublished' } : { allowed: true };
  if (!isPublishedTopic(topic)) return { allowed: false, reason: 'unpublished' };
  if (membership === null) return { allowed: false, reason: 'unauthenticated' };
  if (membership.status !== 'active') return { allowed: false, reason: 'revoked' };
  if (membership.expiresAt !== null && !isFutureDate(membership.expiresAt, now)) return { allowed: false, reason: 'expired' };
  if (membership.lockedUntil !== null && isLockedDate(membership.lockedUntil, now)) return { allowed: false, reason: 'locked' };
  return { allowed: true };
}

function isContentAccessMode(value: string | undefined): value is ContentAccessMode {
  return value !== undefined && CONTENT_ACCESS_MODES.some((mode) => mode === value);
}

function isFutureDate(value: string, now: Date): boolean {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && timestamp > now.getTime();
}

function isLockedDate(value: string, now: Date): boolean {
  const timestamp = Date.parse(value);
  return !Number.isFinite(timestamp) || timestamp > now.getTime();
}
