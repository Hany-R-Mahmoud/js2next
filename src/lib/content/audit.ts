import { contentCatalog, type CanonicalContentRecord } from './catalog';
import { validateVolatileClaims, volatileClaims, type ContentClaim } from './claims';

export const CONTENT_AUDIT_SCHEMA_VERSION = 1 as const;

export type ContentAuditStatus = 'pending' | 'verified' | 'needs-revision' | 'deprecated';

export interface ContentAuditReview {
  readonly claimId: string;
  readonly status: ContentAuditStatus;
  readonly reviewer?: string;
  readonly reviewedAt?: string;
  readonly reviewNotes?: string;
}

export const contentAuditReviews: readonly ContentAuditReview[] = [];

export interface ContentAuditRow {
  readonly schemaVersion: typeof CONTENT_AUDIT_SCHEMA_VERSION;
  readonly claimId: string;
  readonly contentId: string;
  readonly sourceUrl: string;
  readonly lastVerifiedAt: string;
  readonly relevantVersion: string;
  readonly exactClaim: string;
  readonly supports: string;
  readonly conflicts: string;
  readonly confidence: ContentClaim['confidence'];
  readonly reviewStatus: ContentAuditStatus;
  readonly reviewer?: string;
  readonly reviewedAt?: string;
  readonly reviewNotes?: string;
}

export interface ContentAuditIssue {
  readonly id: string;
  readonly message: string;
}

export interface ContentAuditReport {
  readonly claimCount: number;
  readonly contentCount: number;
  readonly verifiedCount: number;
  readonly pendingCount: number;
  readonly needsRevisionCount: number;
  readonly deprecatedCount: number;
  readonly rows: readonly ContentAuditRow[];
  readonly issues: readonly ContentAuditIssue[];
  readonly ok: boolean;
}

export function buildContentAuditMatrix(
  claims: readonly ContentClaim[] = volatileClaims,
  reviews: readonly ContentAuditReview[] = contentAuditReviews,
): readonly ContentAuditRow[] {
  const reviewByClaimId = new Map(reviews.map((review) => [review.claimId, review]));

  return claims.map((claim) => {
    const review = reviewByClaimId.get(claim.claimId);
    return {
      schemaVersion: CONTENT_AUDIT_SCHEMA_VERSION,
      claimId: claim.claimId,
      contentId: claim.contentId,
      sourceUrl: claim.sourceUrl,
      lastVerifiedAt: claim.lastVerifiedAt,
      relevantVersion: claim.frameworkVersion,
      exactClaim: claim.claim,
      supports: claim.supports,
      conflicts: claim.conflicts,
      confidence: claim.confidence,
      reviewStatus: review?.status ?? 'pending',
      ...(review?.reviewer ? { reviewer: review.reviewer } : {}),
      ...(review?.reviewedAt ? { reviewedAt: review.reviewedAt } : {}),
      ...(review?.reviewNotes ? { reviewNotes: review.reviewNotes } : {}),
    };
  });
}

export function validateContentAudit(
  records: readonly CanonicalContentRecord[] = contentCatalog,
  claims: readonly ContentClaim[] = volatileClaims,
  reviews: readonly ContentAuditReview[] = contentAuditReviews,
): ContentAuditReport {
  const rows = buildContentAuditMatrix(claims, reviews);
  const recordIds = new Set(records.map((record) => record.id));
  const claimIds = new Set(claims.map((claim) => claim.claimId));
  const coveredContentIds = new Set<string>();
  const seenClaimIds = new Set<string>();
  const seenReviewIds = new Set<string>();
  const issues: ContentAuditIssue[] = [...validateVolatileClaims(claims).map((message) => ({
    id: 'claim-ledger',
    message,
  }))];

  for (const claim of claims) {
    if (seenClaimIds.has(claim.claimId)) {
      issues.push({ id: claim.claimId, message: 'Claim ID is duplicated.' });
    }
    seenClaimIds.add(claim.claimId);
    if (recordIds.has(claim.contentId)) coveredContentIds.add(claim.contentId);
  }

  for (const record of records) {
    if (!coveredContentIds.has(record.id)) {
      issues.push({ id: record.id, message: 'Content item has no claim-level audit row.' });
    }
  }

  for (const review of reviews) {
    if (seenReviewIds.has(review.claimId)) {
      issues.push({ id: review.claimId, message: 'Review decision is duplicated.' });
    }
    seenReviewIds.add(review.claimId);
    if (!claimIds.has(review.claimId)) {
      issues.push({ id: review.claimId, message: 'Review decision references an unknown claim.' });
    }
    if (review.status === 'verified') {
      if (!review.reviewer?.trim()) issues.push({ id: review.claimId, message: 'Verified claim has no reviewer.' });
      if (!review.reviewedAt || Number.isNaN(Date.parse(review.reviewedAt))) {
        issues.push({ id: review.claimId, message: 'Verified claim has no valid review date.' });
      }
      if (!review.reviewNotes?.trim()) issues.push({ id: review.claimId, message: 'Verified claim has no review notes.' });
    }
    if (review.reviewedAt && Number.isNaN(Date.parse(review.reviewedAt))) {
      issues.push({ id: review.claimId, message: 'Review decision has an invalid review date.' });
    }
  }

  for (const row of rows) {
    if (row.reviewStatus === 'pending') {
      issues.push({ id: row.claimId, message: 'Claim is awaiting human review.' });
    }
  }

  const verifiedCount = rows.filter((row) => row.reviewStatus === 'verified').length;
  const pendingCount = rows.filter((row) => row.reviewStatus === 'pending').length;
  const needsRevisionCount = rows.filter((row) => row.reviewStatus === 'needs-revision').length;
  const deprecatedCount = rows.filter((row) => row.reviewStatus === 'deprecated').length;

  return {
    claimCount: claims.length,
    contentCount: records.length,
    verifiedCount,
    pendingCount,
    needsRevisionCount,
    deprecatedCount,
    rows,
    issues,
    ok: issues.length === 0 && verifiedCount === rows.length && coveredContentIds.size === records.length,
  };
}
