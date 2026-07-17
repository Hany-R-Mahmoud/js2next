import type { LegacyProgressRecord, ProgressState } from '@/domain/progression/types';
import { createInitialProgress } from '@/domain/progression/core';

export function resetForNewCurriculum(profileId: string, curriculumVersion: string, now: string, legacyExportReference: string | null): ProgressState {
  const legacyProgress: LegacyProgressRecord = { imported: legacyExportReference !== null, countsTowardNewMastery: false, exportReference: legacyExportReference };
  return { ...createInitialProgress(profileId, curriculumVersion, now), legacyProgress };
}
