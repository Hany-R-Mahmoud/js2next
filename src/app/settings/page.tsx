'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLearnerStore } from '@/stores/learner';
import { toLearnerProfile } from '@/lib/learning/migration';
import { ProgressBackup } from '@/components/shared/ProgressBackup';
import { useSettingsStore } from '@/stores/settings';
import { Level } from '@/types';

export default function SettingsPage() {
  const router = useRouter();
  const { canonicalProfile, setProfile, resetProgress } = useLearnerStore();
  const [message, setMessage] = useState<string | null>(null);
  const [resetArmed, setResetArmed] = useState(false);
  const profile = toLearnerProfile(canonicalProfile);
  const {
    reducedMotion, toggleReducedMotion,
    highContrast, toggleHighContrast,
    fontSize, setFontSize, resetSettings,
  } = useSettingsStore();

  const levels: { value: Level; label: string }[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  const styles: { value: 'visual' | 'verbal' | 'active' | 'reflective'; label: string }[] = [
    { value: 'visual', label: 'Visual — diagrams, animations, spatial explanations' },
    { value: 'verbal', label: 'Verbal — reading explanations and code examples' },
    { value: 'active', label: 'Active — building things as I learn' },
    { value: 'reflective', label: 'Reflective — theory first, then apply' },
  ];

  const confirmReset = () => {
    resetProgress();
    resetSettings();
    setResetArmed(false);
    setMessage('Progress and accessibility settings reset.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
          Settings
        </h1>
        <p className="text-ink-light mt-1">Customize your learning experience.</p>
      </div>

      <div className="card p-6 space-y-6">
        <h2 className="text-lg font-semibold text-ink">Learner Profile</h2>

        <div>
          <label htmlFor="level-select" className="block text-sm font-medium text-ink mb-1">Level</label>
          <select
            id="level-select"
            value={profile.level}
            onChange={(e) => setProfile({ level: e.target.value as Level })}
            className="w-full min-h-11 px-4 py-2 rounded-[10px] border border-paper-warm bg-slate text-ink
                       focus:outline-none focus:ring-2 focus:ring-teal"
          >
            {levels.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="style-select" className="block text-sm font-medium text-ink mb-1">Learning Style</label>
          <select
            id="style-select"
            value={profile.preferredStyle}
            onChange={(e) => setProfile({ preferredStyle: e.target.value as typeof profile.preferredStyle })}
            className="w-full min-h-11 px-4 py-2 rounded-[10px] border border-paper-warm bg-slate text-ink
                       focus:outline-none focus:ring-2 focus:ring-teal"
          >
            {styles.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pace-select" className="block text-sm font-medium text-ink mb-1">Pace</label>
          <select
            id="pace-select"
            value={profile.paceMode}
            onChange={(e) => setProfile({ paceMode: e.target.value as typeof profile.paceMode })}
            className="w-full min-h-11 px-4 py-2 rounded-[10px] border border-paper-warm bg-slate text-ink
                       focus:outline-none focus:ring-2 focus:ring-teal"
          >
            <option value="standard">Standard</option>
            <option value="accelerated">Accelerated</option>
            <option value="deep-dive">Deep Dive</option>
          </select>
        </div>

        <div>
          <label htmlFor="focus-select" className="block text-sm font-medium text-ink mb-1">Focus area</label>
          <select
            id="focus-select"
            value={profile.focusArea ?? ''}
            onChange={(e) => setProfile({ focusArea: e.target.value })}
            className="w-full min-h-11 px-4 py-2 rounded-[10px] border border-paper-warm bg-slate text-ink focus:outline-none focus:ring-2 focus:ring-teal"
          >
            <option value="">Use the full map</option>
            <option value="react-fundamentals">React fundamentals</option>
            <option value="state-and-data">State and data</option>
            <option value="nextjs-app-router">Next.js App Router</option>
            <option value="production">Production readiness</option>
          </select>
        </div>

        <button type="button" onClick={() => { setProfile({ diagnosticComplete: false }); router.push('/onboarding'); }} className="btn-secondary w-full">
          Re-run onboarding
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-ink">Accessibility</h2>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-ink">Reduced Motion</span>
          <button
            onClick={toggleReducedMotion}
            role="switch"
            aria-checked={reducedMotion}
            className={`relative w-11 min-h-11 rounded-full transition-colors ${reducedMotion ? 'bg-teal' : 'bg-paper-warm'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${reducedMotion ? 'translate-x-5' : ''}`} />
          </button>
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-ink">High Contrast</span>
          <button
            onClick={toggleHighContrast}
            role="switch"
            aria-checked={highContrast}
            className={`relative w-11 min-h-11 rounded-full transition-colors ${highContrast ? 'bg-teal' : 'bg-paper-warm'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${highContrast ? 'translate-x-5' : ''}`} />
          </button>
        </label>

        <div>
          <label htmlFor="font-size-select" className="block text-sm font-medium text-ink mb-1">Font Size</label>
          <select
            id="font-size-select"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as typeof fontSize)}
            className="w-full min-h-11 px-4 py-2 rounded-[10px] border border-paper-warm bg-slate text-ink
                       focus:outline-none focus:ring-2 focus:ring-teal"
          >
            <option value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="xlarge">Extra Large</option>
          </select>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-ink">Data</h2>
        <ProgressBackup />

        {!resetArmed && <button onClick={() => setResetArmed(true)} className="btn-vermillion w-full">
          Reset All Progress
        </button>}
        {resetArmed && (
          <div className="space-y-3 rounded-lg border border-vermillion/40 bg-vermillion/5 p-4" role="alert">
            <p className="text-sm text-ink">Reset all progress and accessibility settings? This cannot be undone.</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={confirmReset} className="btn-vermillion text-sm">Confirm reset</button>
              <button type="button" onClick={() => setResetArmed(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        )}

        {message && <p className="text-sm text-teal text-center" role="status">{message}</p>}
      </div>
    </div>
  );
}
