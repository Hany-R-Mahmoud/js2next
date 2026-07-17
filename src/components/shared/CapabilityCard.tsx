import type { CapabilityDefinition, CapabilityProgress } from '@/lib/learning/capabilities';

interface CapabilityCardProps {
  readonly definition: CapabilityDefinition;
  readonly progress: CapabilityProgress;
}

export function CapabilityCard({ definition, progress }: CapabilityCardProps) {
  const percentage = Math.round((progress.completedTopics / progress.totalTopics) * 100);
  return (
    <article className={`high-contrast-surface rounded-lg border p-4 ${progress.earned ? 'border-teal/40 bg-teal/5' : 'border-paper-warm bg-slate'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">{definition.title}</h3>
          <p className="mt-1 text-xs text-ink-muted">{progress.completedTopics} of {progress.totalTopics} required topics complete</p>
        </div>
        <span className={`text-xs font-semibold ${progress.earned ? 'text-teal' : 'text-ink-muted'}`}>
          {progress.earned ? 'Earned' : `${percentage}%`}
        </span>
      </div>
      <div className="high-contrast-progress-track mt-3 h-1.5 overflow-hidden rounded-full bg-paper-warm" aria-hidden="true">
        <div className="high-contrast-progress h-full rounded-full bg-teal" style={{ width: `${percentage}%` }} />
      </div>
    </article>
  );
}
