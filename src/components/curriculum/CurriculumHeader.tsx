import Link from 'next/link';

interface CurriculumHeaderProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly backHref?: string;
  readonly backLabel?: string;
}

export function CurriculumHeader({ eyebrow, title, description, backHref, backLabel }: CurriculumHeaderProps) {
  return (
    <header className="surface-header">
      <div>
        <p className="surface-eyebrow">{eyebrow}</p>
        <h1 className="surface-title">{title}</h1>
        <p className="surface-description">{description}</p>
      </div>
      {backHref && backLabel ? <Link href={backHref} className="btn-secondary shrink-0 text-center text-sm">{backLabel}</Link> : null}
    </header>
  );
}

export function CurriculumBadge({ children, tone = 'neutral' }: { readonly children: React.ReactNode; readonly tone?: 'neutral' | 'accent' | 'warning' }) {
  const toneClass = tone === 'accent' ? 'border-teal/40 bg-teal/10 text-teal-dark' : tone === 'warning' ? 'border-warning/40 bg-warning/10 text-warning' : 'border-paper-warm bg-slate-secondary text-ink-light';
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClass}`}>{children}</span>;
}
