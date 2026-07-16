export interface SourceMetadata {
  readonly sourceUrl: string;
  readonly sourceType: 'official' | 'standard' | 'research' | 'community';
  readonly lastVerifiedAt: string;
  readonly frameworkVersion?: string;
}

export interface ContentRecord {
  readonly id: string;
  readonly sourceMetadata?: readonly SourceMetadata[];
}

export interface ContentIssue {
  readonly id: string;
  readonly message: string;
}

export interface ContentValidationReport {
  readonly itemCount: number;
  readonly issues: readonly ContentIssue[];
  readonly ok: boolean;
}

export function validateContentRecords(records: readonly ContentRecord[]): ContentValidationReport {
  const issues: ContentIssue[] = [];
  const seen = new Set<string>();
  for (const record of records) {
    if (!record.id.trim()) issues.push({ id: record.id, message: 'Content ID is empty.' });
    if (seen.has(record.id)) issues.push({ id: record.id, message: 'Content ID is duplicated.' });
    seen.add(record.id);
    validateSources(record, issues);
  }
  return { itemCount: records.length, issues, ok: issues.length === 0 };
}

function validateSources(record: ContentRecord, issues: ContentIssue[]): void {
  if (!record.sourceMetadata || record.sourceMetadata.length === 0) {
    issues.push({ id: record.id, message: 'Content item has no source metadata.' });
    return;
  }
  for (const source of record.sourceMetadata) {
    if (!isValidHttpUrl(source.sourceUrl)) {
      issues.push({ id: record.id, message: `Invalid source URL: ${source.sourceUrl}` });
    }
    if (!source.lastVerifiedAt || Number.isNaN(Date.parse(source.lastVerifiedAt))) {
      issues.push({ id: record.id, message: 'Source metadata has no valid verification date.' });
    }
  }
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
