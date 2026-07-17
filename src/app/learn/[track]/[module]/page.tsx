import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findModule, findTrack } from '@/domain/curriculum';
import { CurriculumBadge, CurriculumHeader } from '@/components/curriculum/CurriculumHeader';
import { CurriculumNav } from '@/components/curriculum/CurriculumNav';

export default async function ModulePage({ params }: { readonly params: Promise<{ readonly track: string; readonly module: string }> }) {
  const { track: trackSlug, module: moduleSlug } = await params;
  const track = findTrack(trackSlug);
  const moduleDefinition = findModule(trackSlug, moduleSlug);
  if (!track || !moduleDefinition) notFound();
  return <div className="space-y-8"><CurriculumNav track={track} module={moduleDefinition} /><CurriculumHeader eyebrow={`${track.title} · Module ${moduleDefinition.order}`} title={moduleDefinition.title} description="Read each topic in order. Prerequisite guidance is a soft warning and never a permanent lock." backHref={`/tracks/${track.slug}`} backLabel="Back to track" /><ol className="grid gap-4 md:grid-cols-2" aria-label={`${moduleDefinition.title} topics`}>{moduleDefinition.topics.map((topic) => <li key={topic.id}><Link href={`/learn/${track.slug}/${moduleDefinition.slug}/${topic.slug}`} className="card block h-full p-5 transition-colors hover:border-teal/50"><div className="flex flex-wrap items-center gap-2"><CurriculumBadge>Topic {topic.order}</CurriculumBadge>{topic.required ? <CurriculumBadge tone="accent">Required</CurriculumBadge> : <CurriculumBadge>Optional</CurriculumBadge>}{topic.advanced ? <CurriculumBadge tone="warning">Advanced</CurriculumBadge> : null}</div><h2 className="mt-3 font-semibold text-ink">{topic.title}</h2><p className="mt-2 text-sm text-ink-light">{topic.estimatedMinutes} min · Difficulty {topic.difficulty}</p></Link></li>)}</ol></div>;
}
