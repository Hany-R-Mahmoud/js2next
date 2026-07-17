import type { ProgressState } from '@/domain/progression/types';
import { migrateAssessmentProgressV2 } from './migration';
import { exportProgress, parseProgress } from './validation';

export interface ProgressStorage { readonly load: () => string | null; readonly save: (value: string) => void; }
export interface LocalStorageLike { readonly getItem: (key: string) => string | null; readonly setItem: (key: string, value: string) => void; }

export function createLocalProgressAdapter(storage: LocalStorageLike, key = 'js2next.local-progress'): ProgressStorage {
  return { load: () => storage.getItem(key), save: (value) => storage.setItem(key, value) };
}

export function loadProgress(storage: ProgressStorage, fallback: ProgressState): ProgressState {
  const raw = storage.load();
  if (raw === null) return fallback;
  const result = parseProgress(raw);
  if (!result.ok) return fallback;
  const migrated = migrateAssessmentProgressV2(result.state, new Date().toISOString());
  if (migrated !== result.state) saveProgress(storage, migrated);
  return migrated;
}

export function saveProgress(storage: ProgressStorage, state: ProgressState): void { storage.save(exportProgress(state)); }
