import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const projectRoot = path.resolve(__dirname, '../..');
const archiveRoot = path.join(projectRoot, 'docs/release-1/legacy-supplementary');
const runtimeRoot = path.join(projectRoot, 'src');

function sourceFiles(root: string): string[] {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) return sourceFiles(entryPath);
    return /\.(ts|tsx|mts|cts)$/.test(entry.name) && !entry.name.endsWith('.test.ts') && !entry.name.endsWith('.test.tsx')
      ? [entryPath]
      : [];
  });
}

describe('legacy archive boundary', () => {
  it('keeps the archive outside the runtime source tree', () => {
    expect(fs.existsSync(path.join(archiveRoot, 'README.md'))).toBe(true);
    expect([
      'snapshot/src/data/topics',
      'snapshot/src/lib/content',
      'snapshot/src/lib/learning',
      'snapshot/docs/review',
    ].every((relativePath) => fs.existsSync(path.join(archiveRoot, relativePath)))).toBe(true);
    expect(path.relative(runtimeRoot, archiveRoot).startsWith('..')).toBe(true);
  });

  it('finds no legacy archive reference in runtime source files', () => {
    const imports = sourceFiles(runtimeRoot).flatMap((filePath) =>
      fs.readFileSync(filePath, 'utf8').split('\n').filter((line) => /\b(import|require)\b/.test(line) && line.includes('legacy-supplementary')),
    );

    expect(imports).toEqual([]);
  });
});
