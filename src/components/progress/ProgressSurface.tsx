'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { exportProgress, parseProgress } from '@/infrastructure/local-progress';
import {
  buildCanonicalProgress,
  type CanonicalModuleSummary,
  type CanonicalTopic,
  type CanonicalTrackSummary,
} from './progress-model';
import { useProgressState, writeProgress } from './useProgressState';

type ImportFailureReason = Extract<ReturnType<typeof parseProgress>, { readonly ok: false }>['reason'];

const IMPORT_FAILURE_MESSAGES: Readonly<Record<ImportFailureReason, string>> = {
  'invalid-json': 'The selected file is not valid JSON.',
  'invalid-schema': 'The selected file does not match the Release 1 progress schema.',
  'future-version': 'This progress file uses a newer schema version.',
};

export function ProgressSurface() {
  const { state, hydrated } = useProgressState();
  const [message, setMessage] = useState('');
  const input = useRef<HTMLInputElement>(null);

  if (!hydrated) {
    return <ProgressLoading />;
  }

  const progress = buildCanonicalProgress(state);

  const exportFile = () => {
    const blob = new Blob([exportProgress(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `js2next-progress-${state.schemaVersion}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setMessage(`Progress exported as schema ${state.schemaVersion}.`);
  };

  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.currentTarget;
    const file = inputElement.files?.[0];
    if (file === undefined) return;

    try {
      const result = parseProgress(await file.text());
      if (!result.ok) {
        setMessage(`Import rejected. ${IMPORT_FAILURE_MESSAGES[result.reason]}`);
        return;
      }

      writeProgress(result.state);
      setMessage(`Progress imported. Schema ${result.state.schemaVersion} is now active.`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Import failed. Existing progress was kept: ${error.message}`
          : 'Import failed. Existing progress was kept.',
      );
    } finally {
      inputElement.value = '';
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8" aria-labelledby="progress-title">
      <header className="surface-header">
        <div>
          <p className="surface-eyebrow">Progress</p>
          <h1 id="progress-title" className="surface-title">Evidence that sticks</h1>
          <p className="surface-description">
            Release 1 mastery is earned through the required learning loop and an 80% assessment.
          </p>
        </div>
        <Link className="btn-secondary inline-block" href="/review">Open review queue</Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Progress summary">
        <MetricCard label="Topics mastered" value={`${progress.topicMasteredCount}/${progress.topics.length}`} tone="success" />
        <MetricCard label="Attempts saved" value={String(state.assessmentAttempts.length)} tone="teal" />
        <MetricCard label="Review items" value={String(state.reviewQueue.length)} tone="warning" />
      </section>

      <TrackSummarySection tracks={progress.tracks} />

      <section className="card space-y-5 p-5 sm:p-6" aria-labelledby="module-status-title">
        <div>
          <h2 id="module-status-title" className="text-xl font-semibold text-ink">Module progress</h2>
          <p className="mt-1 text-sm text-ink-muted">Topic mastery and module review scores work together.</p>
        </div>
        <div className="space-y-6">
          {progress.tracks.map((track) => (
            <div key={track.id}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink-muted">{track.title}</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {track.modules.map((module) => <ModuleCard key={module.id} module={module} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <TopicMasterySection topics={progress.topics} />

      <section className="card space-y-4 p-5 sm:p-6" aria-labelledby="backup-title">
        <div>
          <h2 id="backup-title" className="text-xl font-semibold text-ink">Export or import progress</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Files are checked before they can replace this browser&apos;s progress. Current schema: <code>{state.schemaVersion}</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary" type="button" onClick={exportFile}>Export progress</button>
          <button className="btn-secondary" type="button" onClick={() => input.current?.click()}>Import progress</button>
          <input
            ref={input}
            className="sr-only"
            type="file"
            accept="application/json,.json"
            aria-label="Choose a schema-versioned progress JSON file"
            onChange={importFile}
          />
        </div>
        <p className="text-sm text-ink-light" role="status" aria-live="polite">
          {message || 'Legacy progress is kept separate and never counts toward Release 1 mastery.'}
        </p>
        {state.legacyProgress.imported && (
          <p className="rounded-lg border border-warning/50 bg-warning/10 p-3 text-sm text-ink-light">
            A legacy export is preserved separately. It contributes 0% to this curriculum&apos;s mastery.
          </p>
        )}
      </section>
    </main>
  );
}

function ProgressLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl" aria-labelledby="progress-loading-title">
      <section className="card space-y-3 p-6" role="status" aria-live="polite">
        <h1 id="progress-loading-title" className="text-xl font-semibold text-ink">Loading local progress</h1>
        <p className="text-sm text-ink-muted">Reading this browser&apos;s saved learning evidence.</p>
      </section>
    </main>
  );
}

function MetricCard({ label, value, tone }: { readonly label: string; readonly value: string; readonly tone: 'success' | 'teal' | 'warning' }) {
  const valueClass = tone === 'success' ? 'text-success' : tone === 'teal' ? 'text-teal' : 'text-warning';
  return (
    <article className="card p-5">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${valueClass}`}>{value}</p>
    </article>
  );
}

function TrackSummarySection({ tracks }: { readonly tracks: readonly CanonicalTrackSummary[] }) {
  return (
    <section className="space-y-4" aria-labelledby="track-status-title">
      <div>
        <h2 id="track-status-title" className="text-xl font-semibold text-ink">Track progress</h2>
        <p className="mt-1 text-sm text-ink-muted">A track completes only after every module and its cumulative review reach the threshold.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {tracks.map((track) => (
          <article className="card space-y-4 p-5" key={track.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-ink">{track.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{track.completeModuleCount}/{track.moduleCount} modules complete</p>
              </div>
              <span className="text-lg font-bold text-teal">{track.completionPercent}%</span>
            </div>
            <progress className="h-2 w-full accent-teal" max={100} value={track.completionPercent} aria-label={`${track.title} module completion`} />
            <p className="text-sm text-ink-light">Cumulative review: {track.reviewPercent}%</p>
            <p className={track.complete ? 'text-sm font-semibold text-success' : 'text-sm text-ink-muted'}>
              {track.complete ? 'Track complete' : 'In progress'}
            </p>
            <Link className="btn-secondary inline-block text-sm" href={`/assessments/cumulative/${track.id}`}>Open cumulative review</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function ModuleCard({ module }: { readonly module: CanonicalModuleSummary }) {
  return (
    <article className="rounded-lg border border-slate-secondary p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-medium text-ink">{module.title}</h4>
          <p className="mt-1 text-xs text-ink-muted">{module.masteredTopicCount}/{module.requiredTopicCount} required topics mastered</p>
        </div>
        <span className="text-sm font-semibold text-teal">{module.completionPercent}%</span>
      </div>
      <progress className="mt-3 h-2 w-full accent-teal" max={100} value={module.completionPercent} aria-label={`${module.title} topic mastery`} />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-ink-muted">Module review: {module.reviewPercent}%</span>
        <Link className="inline-flex min-h-11 items-center font-semibold text-teal hover:text-teal-dark" href={`/assessments/module/${module.id}`}>Review module</Link>
      </div>
      <p className={module.complete ? 'mt-2 text-sm font-semibold text-success' : 'mt-2 text-sm text-ink-muted'}>
        {module.complete ? 'Complete' : 'Not complete'}
      </p>
    </article>
  );
}

function TopicMasterySection({ topics }: { readonly topics: readonly CanonicalTopic[] }) {
  const tracks = [...new Set(topics.map((topic) => topic.trackId))];
  return (
    <section className="card space-y-5 p-5 sm:p-6" aria-labelledby="topic-status-title">
      <div>
        <h2 id="topic-status-title" className="text-xl font-semibold text-ink">Topic mastery</h2>
        <p className="mt-1 text-sm text-ink-muted">Mastery shown here comes only from the local Release 1 progress record.</p>
      </div>
      <div className="space-y-3">
        {tracks.map((trackId) => (
          <details key={trackId} open={trackId === 'javascript'} className="rounded-lg border border-slate-secondary">
            <summary className="cursor-pointer px-4 py-3 font-semibold text-ink">{topics.find((topic) => topic.trackId === trackId)?.trackTitle ?? trackId}</summary>
            <div className="grid gap-3 border-t border-slate-secondary p-3 sm:grid-cols-2">
              {topics.filter((topic) => topic.trackId === trackId).map((topic) => <TopicCard key={topic.id} topic={topic} />)}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function TopicCard({ topic }: { readonly topic: CanonicalTopic }) {
  return (
    <Link className="rounded-lg border border-slate-secondary p-4 transition-colors hover:border-teal/60" href={topic.href}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-ink-muted">{topic.moduleTitle}{topic.required ? ' · Required' : ' · Optional'}</p>
          <h3 className="mt-1 font-medium text-ink">{topic.title}</h3>
        </div>
        <span className="text-sm font-semibold text-teal">{topic.masteryPercent}%</span>
      </div>
      <progress className="mt-3 h-2 w-full accent-teal" max={100} value={topic.masteryPercent} aria-label={`${topic.title} mastery`} />
      <p className="mt-2 text-xs text-ink-muted">{topic.status}</p>
    </Link>
  );
}
