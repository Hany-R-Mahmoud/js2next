'use client';

import { useRef, useState } from 'react';
import { importLearnerBackup, serializeLearnerBackup } from '@/lib/learning/backup';
import { useLearnerStore } from '@/stores/learner';
import { useSettingsStore } from '@/stores/settings';

interface ProgressBackupProps {
  readonly compact?: boolean;
}

export function ProgressBackup({ compact = false }: ProgressBackupProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const exportProgress = () => {
    const learner = useLearnerStore.getState().canonicalProfile;
    const { reducedMotion, highContrast, fontSize } = useSettingsStore.getState();
    const blob = new Blob([serializeLearnerBackup(learner, { reducedMotion, highContrast, fontSize })], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'learn-next-progress.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage('Backup downloaded.');
  };

  const importProgress = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const backup = importLearnerBackup(await file.text(), new Date().toISOString());
    if (!backup) {
      setMessage('Backup rejected: invalid learner data.');
      event.target.value = '';
      return;
    }
    useLearnerStore.getState().importProfile(backup.learner);
    useSettingsStore.getState().setSettings(backup.settings);
    setMessage('Backup restored.');
    event.target.value = '';
  };

  return (
    <section className={`card ${compact ? 'p-4' : 'p-6'} space-y-3`} aria-labelledby="progress-backup-title">
      <div>
        <h2 id="progress-backup-title" className="font-semibold text-ink">Save your journey</h2>
        <p className="mt-1 text-sm text-ink-muted">Progress stays in this browser. Keep a backup before switching devices or clearing data.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={exportProgress} className="btn-secondary text-sm">Export backup</button>
        <button type="button" onClick={() => inputRef.current?.click()} className="btn-secondary text-sm">Import backup</button>
        <input ref={inputRef} type="file" accept="application/json,.json" onChange={importProgress} className="sr-only" />
      </div>
      {message && <p className="text-sm text-teal" role="status" aria-live="polite">{message}</p>}
    </section>
  );
}
