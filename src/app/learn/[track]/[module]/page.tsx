import { notFound } from 'next/navigation';
import { findModule, findTrack } from '@/domain/curriculum';
import { CurriculumHeader } from '@/components/curriculum/CurriculumHeader';
import { CurriculumNav } from '@/components/curriculum/CurriculumNav';
import ModuleStageTabs from '@/components/curriculum/ModuleStageTabs';
import { getTopicPractice } from '@/components/assessment/release1-data.server';

export default async function ModulePage({ params }: { readonly params: Promise<{ readonly track: string; readonly module: string }> }) {
  const { track: trackSlug, module: moduleSlug } = await params;
  const track = findTrack(trackSlug);
  const moduleDefinition = findModule(trackSlug, moduleSlug);
  if (!track || !moduleDefinition) notFound();
  const practiceSets = moduleDefinition.topics.flatMap((topic) => { const set = getTopicPractice(topic.id); return set === null ? [] : [{ ownerId: set.ownerId, kind: 'topic-practice' as const, trackId: track.slug, title: set.title, questions: set.questions }]; });
  return <div className="space-y-8"><CurriculumNav track={track} module={moduleDefinition} /><CurriculumHeader eyebrow={`${track.title} · Module ${moduleDefinition.order}`} title={moduleDefinition.title} description="Learn the topic path, practice weak spots, check mastery, and reflect on what comes next." backHref={`/tracks/${track.slug}`} backLabel="Back to track" /><ModuleStageTabs track={track} module={moduleDefinition} practiceSets={practiceSets} /></div>;
}
