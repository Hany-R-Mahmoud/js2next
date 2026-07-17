import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findTrack } from '@/domain/curriculum';
import { CurriculumBadge, CurriculumHeader } from '@/components/curriculum/CurriculumHeader';
import { CurriculumNav } from '@/components/curriculum/CurriculumNav';

export default async function TrackPage({ params }: { readonly params: Promise<{ readonly track: string }> }) {
  const { track: trackSlug } = await params;
  const track = findTrack(trackSlug);
  if (!track) notFound();
  return <div className="space-y-8"><CurriculumNav track={track} /><CurriculumHeader eyebrow={`Track ${track.order}`} title={track.title} description="Work through modules in order. Optional and advanced topics remain visible without blocking the path." backHref="/tracks" backLabel="All tracks" /><ol className="space-y-4" aria-label={`${track.title} modules`}>{track.modules.map((module) => <li key={module.id}><Link href={`/learn/${track.slug}/${module.slug}`} className="card flex items-start justify-between gap-4 p-5 transition-colors hover:border-teal/50"><div><div className="flex flex-wrap items-center gap-2"><CurriculumBadge>Module {module.order}</CurriculumBadge><span className="text-xs text-ink-muted">{module.topics.length} topics</span></div><h2 className="mt-3 text-lg font-semibold text-ink">{module.title}</h2><p className="mt-1 text-sm text-ink-light">{module.requiredTopicIds.length} required · {module.optionalTopicIds.length} optional</p></div><span className="text-teal" aria-hidden="true">→</span></Link></li>)}</ol></div>;
}
