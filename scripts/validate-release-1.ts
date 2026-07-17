import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { assertManifestAllowed, compileReleaseContent } from '../src/domain/content/index.ts';

const root = resolve(process.cwd(), 'content');
const result = compileReleaseContent(root, resolve(root, 'normalized'));
if (result.diagnostics.length > 0) {
  for (const diagnostic of result.diagnostics) console.error(`${diagnostic.path}: ${diagnostic.message}`);
  process.exitCode = 1;
} else {
  const manifest: unknown = JSON.parse(readFileSync(resolve(root, 'manifests/release-1.draft.manifest.json'), 'utf8'));
  assertManifestAllowed(manifest, 'preview');
  console.log(`Release 1 preview validation passed: ${result.normalizedPackets.length} packets`);
}
