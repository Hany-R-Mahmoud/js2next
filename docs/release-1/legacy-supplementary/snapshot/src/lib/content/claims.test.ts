import { describe, expect, it } from 'vitest';
import { validateClaimCoverage, validateVolatileClaims, volatileClaims } from './claims';

describe('volatile content claims', () => {
  it('reports normalized, catalog-backed claim references', () => {
    const report = validateClaimCoverage();

    expect(report.issues).toEqual([]);
    expect(report.coveredContentIds.length).toBeGreaterThan(0);
    expect(report.coverageRatio).toBeGreaterThan(0);
    expect(report.uncoveredContentIds).toEqual([]);
  });

  it('rejects duplicate and non-normalized claim references', () => {
    const report = validateClaimCoverage([
      { ...volatileClaims[0], claimId: ' claim-js-closure-lexical-binding ' },
      { ...volatileClaims[0], claimId: volatileClaims[0].claimId },
    ]);

    expect(report.issues).toEqual([
      ' claim-js-closure-lexical-binding : claim ID is not normalized',
      'claim-js-closure-lexical-binding: duplicate claim ID',
    ]);

    expect(validateClaimCoverage([{ ...volatileClaims[0], contentId: ' lesson:closures-in-javascript ' }]).issues)
      .toContain(' lesson:closures-in-javascript : content ID is not normalized');
  });

  it('ties every audited claim to a published record and direct source', () => {
    expect(volatileClaims.length).toBeGreaterThan(0);
    expect(validateVolatileClaims()).toEqual([]);
  });

  it('keeps the version-sensitive review queue closed for the pinned runtime', () => {
    const reviewedClaimIds = new Set([
      'claim-next-revalidation-context',
      'claim-next-revalidation-version-boundary',
      'claim-next-deep-dive-cache-contract',
      'claim-next-image-layout-budget',
      'claim-next-production-env-boundary',
      'claim-next-production-measurement',
      'claim-next-url-filter-state',
      'claim-react-performance-measurement-loop',
      'claim-next-runtime-public-config',
    ]);

    expect(volatileClaims.filter((claim) => claim.confidence === 'needs-review')).toEqual([]);
    expect(volatileClaims
      .filter((claim) => reviewedClaimIds.has(claim.claimId))
      .every((claim) => claim.sourceUrl.includes('/docs/15/')))
      .toBe(true);
  });

  it('rejects duplicate or detached claims', () => {
    const [claim] = volatileClaims;
    expect(validateVolatileClaims([claim, claim])).toContain(`${claim.claimId}: duplicate claim ID`);
    expect(validateVolatileClaims([{ ...claim, contentId: 'lesson:missing' }])).toContain(`${claim.claimId}: unknown content ID lesson:missing`);
  });

  it('rejects claim metadata that disagrees with the catalog', () => {
    const [claim] = volatileClaims;
    expect(validateVolatileClaims([{ ...claim, sourceType: 'research' }])).toContain(`${claim.claimId}: source type does not match catalog metadata`);
    expect(validateVolatileClaims([{ ...claim, frameworkVersion: '' }])).toContain(`${claim.claimId}: framework version is empty`);
  });
});
