import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const progressModelSource = readFileSync(new URL('./progress-model.ts', import.meta.url), 'utf8');
const curriculumIndexSource = readFileSync(new URL('../../domain/curriculum/index.ts', import.meta.url), 'utf8');
const curriculumLoaderSource = readFileSync(new URL('../../domain/curriculum/loader.ts', import.meta.url), 'utf8');
const curriculumTypesSource = readFileSync(new URL('../../domain/curriculum/types.ts', import.meta.url), 'utf8');
const clientSafeCurriculumSources = [curriculumIndexSource, curriculumLoaderSource, curriculumTypesSource];

describe('progress client import boundary', () => {
  it('does not route browser progress through the filesystem-backed packet loader', () => {
    expect(progressModelSource).toContain("from '@/domain/curriculum/loader'");
    expect(progressModelSource).toContain("from '@/domain/curriculum/types'");
    expect(progressModelSource).not.toMatch(/from ['"]@\/domain\/curriculum['"]/);
    expect(progressModelSource).not.toMatch(/node:(?:fs|path)/);
  });

  it('keeps the curriculum modules reachable by progress free of filesystem imports', () => {
    expect(clientSafeCurriculumSources.join('\n')).not.toMatch(/node:(?:fs|path)/);
    expect(curriculumIndexSource).not.toContain("from './packet.ts'");
  });
});
