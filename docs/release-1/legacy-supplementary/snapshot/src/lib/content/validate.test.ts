import { describe, expect, it } from 'vitest';
import { validateContentRecords } from './validate';

describe('content validation seam', () => {
  it('reports duplicate IDs and missing sources', () => {
    const report = validateContentRecords([{ id: 'a' }, { id: 'a' }]);
    expect(report.ok).toBe(false);
    expect(report.issues.map((issue) => issue.message)).toEqual([
      'Content item has no source metadata.', 'Content ID is duplicated.', 'Content item has no source metadata.',
    ]);
  });

  it('accepts official metadata with a valid verification date', () => {
    const report = validateContentRecords([{
      id: 'react-state', sourceMetadata: [{
        sourceUrl: 'https://react.dev/learn/state-a-components-memory', sourceType: 'official',
        lastVerifiedAt: '2026-07-14', frameworkVersion: '19.2',
      }],
    }]);
    expect(report.ok).toBe(true);
  });
});
