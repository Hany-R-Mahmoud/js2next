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
    <nav aria-label="Curriculum navigation" className="mb-6 overflow-x-auto">
      <ol className="flex min-w-max items-center gap-2 text-sm text-ink-muted">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {index === lastIndex ? <span aria-current="page" className="font-medium text-ink">{item.label}</span> : <Link className="underline-offset-4 hover:text-teal hover:underline" href={item.href}>{item.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
