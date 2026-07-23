import { describe, expect, it } from 'vitest';
import type { Topic } from '@/domain/curriculum';
import { contentAccessMode, isCatalogTopic, isMembershipValid, isPublishedTopic, resolveContentAccess } from './access';

const topic = {
  id: 'JS-01',
  slug: 'foundations',
  title: 'Foundations',
  order: 1,
  required: true,
  optional: false,
  advanced: false,
  contentType: 'lesson',
  estimatedMinutes: 20,
  difficulty: 1,
  requiredPrerequisiteTopicIds: [],
  recommendedPrerequisiteTopicIds: [],
  packetPath: 'content/normalized/javascript/JS-01.json',
  markdownPath: 'content/normalized/javascript/JS-01.md',
  status: 'published',
  reviewStatus: 'approved',
  subtopics: [],
} satisfies Topic;

describe('content access policy', () => {
  it('uses a closed-by-default production mode', () => {
    expect(contentAccessMode('production', undefined)).toBe('closed');
    expect(contentAccessMode('development', undefined)).toBe('preview');
  });

  it('allows only approved published topics into the public catalog', () => {
    expect(isPublishedTopic(topic)).toBe(true);
    expect(isCatalogTopic(topic)).toBe(true);
    expect(isPublishedTopic({ ...topic, reviewStatus: 'pending-human-review' })).toBe(false);
  });

  it('keeps full content unavailable in closed mode', () => {
    expect(resolveContentAccess({ mode: 'closed', topic, membership: null })).toEqual({
      allowed: false,
      reason: 'closed',
    });
  });

  it('requires an active, unexpired member for published content', () => {
    expect(resolveContentAccess({ mode: 'members', topic, membership: null })).toEqual({
      allowed: false,
      reason: 'unauthenticated',
    });
    expect(resolveContentAccess({
      mode: 'members',
      topic,
      membership: { status: 'active', expiresAt: '2027-01-01T00:00:00.000Z', lockedUntil: null },
      now: new Date('2026-07-23T00:00:00.000Z'),
    }).allowed).toBe(true);
    expect(resolveContentAccess({
      mode: 'members',
      topic,
      membership: { status: 'active', expiresAt: '2026-07-22T00:00:00.000Z', lockedUntil: null },
      now: new Date('2026-07-23T00:00:00.000Z'),
    })).toEqual({ allowed: false, reason: 'expired' });
  });

  it('rejects revoked, expired, locked, and malformed membership snapshots', () => {
    expect(isMembershipValid({ status: 'revoked', expiresAt: null, lockedUntil: null })).toBe(false);
    expect(isMembershipValid({ status: 'active', expiresAt: '2026-07-22T00:00:00.000Z', lockedUntil: null }, new Date('2026-07-23T00:00:00.000Z'))).toBe(false);
    expect(isMembershipValid({ status: 'active', expiresAt: null, lockedUntil: '2027-01-01T00:00:00.000Z' }, new Date('2026-07-23T00:00:00.000Z'))).toBe(false);
    expect(isMembershipValid({ status: 'active', expiresAt: null, lockedUntil: 'not-a-date' })).toBe(false);
  });
});
