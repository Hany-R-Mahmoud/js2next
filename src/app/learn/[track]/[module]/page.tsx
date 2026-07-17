import { notFound } from 'next/navigation';
import { findModule, findTrack } from '@/domain/curriculum';
import { CurriculumHeader } from '@/components/curriculum/CurriculumHeader';
import { CurriculumNav } from '@/components/curriculum/CurriculumNav';
import ModuleStageTabs from '@/components/curriculum/ModuleStageTabs';

export default async function ModulePage({ params }: { readonly params: Promise<{ readonly track: string; readonly module: string }> }) {
  const { track: trackSlug, module: moduleSlug } = await params;
  const track = findTrack(trackSlug);
  const moduleDefinition = findModule(trackSlug, moduleSlug);
  if (!track || !moduleDefinition) notFound();
  return <div className="space-y-8"><CurriculumNav track={track} module={moduleDefinition} /><CurriculumHeader eyebrow={`${track.title} · Module ${moduleDefinition.order}`} title={moduleDefinition.title} description="Move between the topic path, module challenge, targeted review, and the next step." backHref={`/tracks/${track.slug}`} backLabel="Back to track" /><ModuleStageTabs track={track} module={moduleDefinition} /></div>;
}
