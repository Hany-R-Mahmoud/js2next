'use client';

import { useEffect, useState } from 'react';
import { createInitialProgress } from '@/domain/progression/core';
import type { ProgressState } from '@/domain/progression/types';
import { createLocalProgressAdapter, loadProgress, saveProgress } from '@/infrastructure/local-progress';
import { progressStorageKey } from './progress-model';

const progressEventName = 'js2next:progress-updated';

export const emptyProgress = createInitialProgress(
  'local-default',
  'release-1-draft',
  '1970-01-01T00:00:00.000Z',
);

export function readProgress(): ProgressState {
  if (typeof window === 'undefined') return emptyProgress;
  const adapter = createLocalProgressAdapter(window.localStorage, progressStorageKey);
  return loadProgress(adapter, emptyProgress);
}

export function writeProgress(state: ProgressState): void {
  if (typeof window === 'undefined') return;
  const adapter = createLocalProgressAdapter(window.localStorage, progressStorageKey);
  saveProgress(adapter, state);
  window.dispatchEvent(new Event(progressEventName));
}

export function updateProgress(updater: (state: ProgressState) => ProgressState): ProgressState {
  const next = updater(readProgress());
  writeProgress(next);
  return next;
}

export function useProgressState(): { readonly state: ProgressState; readonly hydrated: boolean } {
  const [state, setState] = useState<ProgressState>(emptyProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setState(readProgress());
    sync();
    setHydrated(true);
    window.addEventListener(progressEventName, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(progressEventName, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return { state, hydrated };
}
