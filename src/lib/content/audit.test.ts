import { describe, expect, it } from 'vitest';
import { buildContentAuditMatrix, validateContentAudit, type ContentAuditReview } from './audit';
import { buildContentCatalog } from './catalog';
import { volatileClaims } from './claims';

describe('internal content audit ledger', () => {
  it('keeps the audit matrix separate from learner-facing content metadata', () => {
    const rows = buildContentAuditMatrix();
    expect(rows.length).toBe(volatileClaims.length);
    expect(rows.every((row) => row.exactClaim.trim() && row.sourceUrl.startsWith('http'))).toBe(true);
    expect(rows.every((row) => row.reviewStatus === 'pending')).toBe(true);
  });

  it('does not report content as release-ready before human review decisions exist', () => {
    const report = validateContentAudit();
    expect(report.ok).toBe(false);
    expect(report.pendingCount).toBe(report.claimCount);
    expect(report.issues.some((issue) => issue.message === 'Claim is awaiting human review.')).toBe(true);
  });

  it('requires complete evidence when a claim is marked verified', () => {
    const [claim] = volatileClaims;
    const records = buildContentCatalog().filter((record) => record.id === claim.contentId);
    const review: ContentAuditReview = {
      claimId: claim.claimId,
      status: 'verified',
      reviewer: 'content-reviewer',
      reviewedAt: '2026-07-16',
      reviewNotes: 'Claim wording, source scope, version context, and conflict note checked.',
    };

    const report = validateContentAudit(records, [claim], [review]);
    expect(report.ok).toBe(true);
    expect(report.verifiedCount).toBe(1);
    expect(report.issues).toEqual([]);
  });

  it('rejects duplicate and detached review decisions', () => {
    const [claim] = volatileClaims;
    const review: ContentAuditReview = { claimId: claim.claimId, status: 'pending' };
    const report = validateContentAudit(
      buildContentCatalog().filter((record) => record.id === claim.contentId),
      [claim],
      [review, review, { claimId: 'claim:missing', status: 'verified' }],
    );

    expect(report.issues.map((issue) => issue.message)).toEqual(expect.arrayContaining([
      'Review decision is duplicated.',
      'Review decision references an unknown claim.',
      'Claim is awaiting human review.',
      'Verified claim has no reviewer.',
      'Verified claim has no valid review date.',
      'Verified claim has no review notes.',
    ]));
  });
});
