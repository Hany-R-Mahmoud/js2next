import { describe, expect, it } from 'vitest';
import { formatContentAuditSummary, summarizeContentAudit } from './audit-report';

describe('content audit reporting', () => {
  it('reports exact review totals without changing human decisions', () => {
    const summary = summarizeContentAudit();
    expect(summary.pendingCount).toBe(summary.claimCount);
    expect(summary.verifiedCount).toBe(0);
    expect(summary.ok).toBe(false);
    expect(summary.nextPendingTopicFamily).toBeTruthy();
    expect(summary.pendingByTopicFamily.reduce((total, family) => total + family.count, 0)).toBe(summary.pendingCount);
  });

  it('formats a deterministic human-readable summary', () => {
    expect(formatContentAuditSummary({
      schemaVersion: 1,
      claimCount: 4,
      contentCount: 3,
      verifiedCount: 0,
      pendingCount: 4,
      needsRevisionCount: 0,
      deprecatedCount: 0,
      issueCount: 4,
      nextPendingTopicFamily: 'Foundations',
      pendingByTopicFamily: [{ topicFamily: 'Foundations', count: 4 }],
      ok: false,
    })).toContain('PENDING HUMAN REVIEW');
  });
});
