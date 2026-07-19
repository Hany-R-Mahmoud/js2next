import Link from 'next/link';
import type { Module, Topic, Track } from '@/domain/curriculum';

interface CurriculumNavProps {
  readonly track?: Track;
  readonly module?: Module;
  readonly topic?: Topic;
}

export function CurriculumNav({ track, module, topic }: CurriculumNavProps) {
  const items = [
    { href: '/tracks', label: 'Tracks' },
    ...(track ? [{ href: `/tracks/${track.slug}`, label: track.title }] : []),
    ...(track && module ? [{ href: `/learn/${track.slug}/${module.slug}`, label: module.title }] : []),
    ...(track && module && topic ? [{ href: `/learn/${track.slug}/${module.slug}/${topic.slug}`, label: topic.title }] : []),
  ];
  const lastIndex = items.length - 1;

  return (
    <nav aria-label="Curriculum navigation" className="mb-6 min-w-0">
      <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
          {items.map((item, index) => (
            <li key={item.href} className="flex min-w-0 items-center gap-2">
              {index === lastIndex ? <span aria-current="page" className="inline-flex min-h-11 min-w-0 max-w-full items-center break-words px-0.5 font-medium text-ink">{item.label}</span> : <Link className="inline-flex min-h-11 min-w-0 max-w-full items-center break-words px-0.5 underline-offset-4 hover:text-teal hover:underline" href={item.href}>{item.label}</Link>}
              {index < lastIndex ? <span aria-hidden="true" className="shrink-0">/</span> : null}
            </li>
          ))}
      </ol>
    </nav>
  );
}
