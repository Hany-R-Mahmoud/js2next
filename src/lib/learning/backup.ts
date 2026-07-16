import { importLearnerProfile } from './migration';
import type { UnifiedProfile } from './types';

export const BACKUP_SCHEMA_VERSION = 1 as const;

export interface BackupSettings {
  readonly reducedMotion: boolean;
  readonly highContrast: boolean;
  readonly fontSize: 'normal' | 'large' | 'xlarge';
}

export interface LearnerBackup {
  readonly version: typeof BACKUP_SCHEMA_VERSION;
  readonly learner: UnifiedProfile;
  readonly settings: BackupSettings;
}

export function createLearnerBackup(profile: UnifiedProfile, settings: BackupSettings): LearnerBackup {
  return { version: BACKUP_SCHEMA_VERSION, learner: profile, settings };
}

export function serializeLearnerBackup(profile: UnifiedProfile, settings: BackupSettings): string {
  return JSON.stringify(createLearnerBackup(profile, settings), null, 2);
}

export function importLearnerBackup(raw: string, now: string): LearnerBackup | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    if (parsed.version !== undefined && parsed.version !== BACKUP_SCHEMA_VERSION) return null;
    const learner = importLearnerProfile(raw, now);
    if (!learner) return null;
    return {
      version: BACKUP_SCHEMA_VERSION,
      learner,
      settings: isBackupSettings(parsed.settings) ? parsed.settings : defaultBackupSettings,
    };
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

const defaultBackupSettings: BackupSettings = {
  reducedMotion: false,
  highContrast: false,
  fontSize: 'normal',
};

function isBackupSettings(value: unknown): value is BackupSettings {
  if (!isRecord(value)) return false;
  return typeof value.reducedMotion === 'boolean'
    && typeof value.highContrast === 'boolean'
    && isFontSize(value.fontSize);
}

function isFontSize(value: unknown): value is BackupSettings['fontSize'] {
  return value === 'normal' || value === 'large' || value === 'xlarge';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
