import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { assertManifestAllowed, compileReleaseContent, ContentBoundaryError, isRecord, validatePacket } from './index.ts';
import type { JsonObject } from './types.ts';

function fixturePacket(): JsonObject {
  const path = join(process.cwd(), 'content/packets/javascript/js-m01-orientation-and-foundations/js-01-course-orientation.json');
  const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'));
  if (!isRecord(parsed)) throw new Error('fixture packet is not an object');
  return parsed;
}

describe('Release 1 content boundary', () => {
  it('accepts the complete draft package and emits 79 normalized packets', () => {
    const result = compileReleaseContent(join(process.cwd(), 'content'), join(process.cwd(), 'content/normalized'));
    expect(result.diagnostics).toHaveLength(0);
    expect(result.normalizedPackets).toHaveLength(79);
  });

  it('rejects a packet with a second correct choice', () => {
    const packet = fixturePacket();
    const questions = Array.isArray(packet.questions) ? packet.questions : [];
    const first = questions[0];
    if (!isRecord(first)) throw new Error('fixture question missing');
    const correct = Array.isArray(first.correctChoiceIds) ? first.correctChoiceIds : [];
    const invalid: JsonObject = { ...packet, questions: [...questions.slice(1), { ...first, correctChoiceIds: [...correct, 'extra'] }] };
    const result = validatePacket(invalid, 'fixture.json', new Set<string>());
    expect(result.ok).toBe(false);
    expect(result.diagnostics.some((diagnostic) => diagnostic.message.includes('exactly one'))).toBe(true);
  });

  it('allows draft preview but rejects the same pending manifest in production', () => {
    const manifest: unknown = JSON.parse(readFileSync(join(process.cwd(), 'content/manifests/release-1.draft.manifest.json'), 'utf8'));
    expect(() => assertManifestAllowed(manifest, 'preview')).not.toThrow();
    expect(() => assertManifestAllowed(manifest, 'production')).toThrow(ContentBoundaryError);
  });
});
