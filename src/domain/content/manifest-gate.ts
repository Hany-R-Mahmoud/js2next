import { isRecord } from './validator.ts';
import { ContentBoundaryError } from './types.ts';
import type { ContentDiagnostic, ContentMode, JsonObject } from './types.ts';

function stringAt(value: JsonObject, key: string): string | undefined {
  const item = value[key];
  return typeof item === 'string' ? item : undefined;
}

function entriesAt(value: JsonObject, key: string): readonly JsonObject[] {
  const items = value[key];
  return Array.isArray(items) ? items.filter(isRecord) : [];
}

export function assertManifestAllowed(raw: unknown, mode: ContentMode): JsonObject {
  const diagnostics: ContentDiagnostic[] = [];
  if (!isRecord(raw)) throw new ContentBoundaryError([{ path: 'manifest', message: 'must be a JSON object' }]);
  if (stringAt(raw, 'release') !== 'Release 1') diagnostics.push({ path: 'manifest.release', message: 'must be Release 1' });
  if (mode === 'production') {
    if (raw.runtimeEligible !== true) diagnostics.push({ path: 'manifest.runtimeEligible', message: 'production runtime requires runtimeEligible=true' });
    if (stringAt(raw, 'publicationStatus') !== 'published') diagnostics.push({ path: 'manifest.publicationStatus', message: 'production runtime requires published manifest' });
    if (!isRecord(raw.humanApproval) || raw.humanApproval.approved !== true) diagnostics.push({ path: 'manifest.humanApproval.approved', message: 'production runtime requires explicit human approval' });
  }
  for (const key of ['topicPackets', 'assessmentSets']) for (const entry of entriesAt(raw, key)) {
    const path = `manifest.${key}.${String(entry.id ?? 'unknown')}`;
    if (mode === 'production' && (entry.status === 'pending-human-review' || entry.reviewStatus === 'pending-human-review')) diagnostics.push({ path, message: 'pending-human-review content cannot enter runtime' });
    if (mode === 'production' && (entry.status !== 'published' || entry.reviewStatus !== 'approved')) diagnostics.push({ path, message: 'production entries must be published and approved' });
  }
  if (diagnostics.length > 0) throw new ContentBoundaryError(diagnostics);
  return raw;
}
