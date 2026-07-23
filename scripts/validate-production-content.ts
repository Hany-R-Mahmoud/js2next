import fs from 'node:fs';
import path from 'node:path';
import { assertManifestAllowed } from '../src/domain/content/manifest-gate.ts';

const mode = process.env.CONTENT_ACCESS_MODE ?? (process.env.NODE_ENV === 'production' ? 'closed' : 'preview');
if (mode === 'closed') process.exit(0);

const manifestPath = process.env.CONTENT_PRODUCTION_MANIFEST;
if (manifestPath === undefined) {
  if (mode === 'preview') process.exit(0);
  throw new Error('CONTENT_PRODUCTION_MANIFEST is required when CONTENT_ACCESS_MODE=members.');
}

const absolutePath = path.resolve(manifestPath);
if (!fs.existsSync(absolutePath)) throw new Error(`Production manifest was not found: ${absolutePath}`);
const raw = JSON.parse(fs.readFileSync(absolutePath, 'utf8')) as unknown;
assertManifestAllowed(raw, mode === 'members' ? 'production' : 'preview');
