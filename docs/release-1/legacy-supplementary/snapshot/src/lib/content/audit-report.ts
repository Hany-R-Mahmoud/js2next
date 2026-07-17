import { contentCatalog } from './catalog';
import { validateContentAudit, type ContentAuditReport } from './audit';
import { topicFamilyMeta } from '@/data/curriculum';

export interface ContentAuditSummary {
  readonly schemaVersion: 1;
  readonly claimCount: number;
  readonly contentCount: number;
  readonly verifiedCount: number;
  readonly pendingCount: number;
  readonly needsRevisionCount: number;
  readonly deprecatedCount: number;
  readonly issueCount: number;
  readonly nextPendingTopicFamily: string | null;
  readonly pendingByTopicFamily: readonly { readonly topicFamily: string; readonly count: number }[];
  readonly ok: boolean;
}

export function summarizeContentAudit(report: ContentAuditReport = validateContentAudit()): ContentAuditSummary {
  const nextPending = report.rows.find((row) => row.reviewStatus === 'pending');
  const nextRecord = nextPending ? contentCatalog.find((record) => record.id === nextPending.contentId) : undefined;
  const pendingCounts = new Map<string, number>();
  for (const row of report.rows) {
    if (row.reviewStatus !== 'pending') continue;
    const record = contentCatalog.find((candidate) => candidate.id === row.contentId);
    if (!record?.topicFamily) continue;
    const family = topicFamilyMeta[record.topicFamily].name;
    pendingCounts.set(family, (pendingCounts.get(family) ?? 0) + 1);
  }
  return {
    schemaVersion: 1,
    claimCount: report.claimCount,
    contentCount: report.contentCount,
    verifiedCount: report.verifiedCount,
    pendingCount: report.pendingCount,
    needsRevisionCount: report.needsRevisionCount,
    deprecatedCount: report.deprecatedCount,
    issueCount: report.issues.length,
    nextPendingTopicFamily: nextRecord?.topicFamily ? topicFamilyMeta[nextRecord.topicFamily].name : null,
    pendingByTopicFamily: Array.from(pendingCounts, ([topicFamily, count]) => ({ topicFamily, count })),
    ok: report.ok,
  };
}

export function formatContentAuditSummary(summary: ContentAuditSummary): string {
  const status = summary.ok ? 'READY' : 'PENDING HUMAN REVIEW';
  return [
    `Content audit: ${status}`,
    `Claims ${summary.claimCount} | Content ${summary.contentCount}`,
    `Verified ${summary.verifiedCount} | Pending ${summary.pendingCount} | Needs revision ${summary.needsRevisionCount} | Deprecated ${summary.deprecatedCount}`,
    `Issues ${summary.issueCount}`,
    `Next topic-family batch: ${summary.nextPendingTopicFamily ?? 'none'}`,
    ...summary.pendingByTopicFamily.map(({ topicFamily, count }) => `Pending · ${topicFamily}: ${count}`),
  ].join('\n');
}
