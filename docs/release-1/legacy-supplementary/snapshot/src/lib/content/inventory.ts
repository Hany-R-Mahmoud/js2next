import { buildContentCatalog } from './catalog';
import { validateContentRecords, type ContentValidationReport } from './validate';

export interface LegacyContentInventory {
  readonly lessons: ContentValidationReport;
  readonly challenges: ContentValidationReport;
  readonly questions: ContentValidationReport;
  readonly practices: ContentValidationReport;
}

export function buildLegacyContentInventory(): LegacyContentInventory {
  const records = buildContentCatalog();
  return {
    lessons: validateContentRecords(records.filter((record) => record.kind === 'lesson')),
    challenges: validateContentRecords(records.filter((record) => record.kind === 'challenge')),
    questions: validateContentRecords(records.filter((record) => record.kind === 'qa')),
    practices: validateContentRecords(records.filter((record) => record.kind === 'practice')),
  };
}
