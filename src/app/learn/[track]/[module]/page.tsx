import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { findModule, findTrack } from '@/domain/curriculum';
import { CurriculumHeader } from '@/components/curriculum/CurriculumHeader';
import { CurriculumNav } from '@/components/curriculum/CurriculumNav';
import ModuleStageTabs from '@/components/curriculum/ModuleStageTabs';
import { getTopicPractice } from '@/components/assessment/release1-data.server';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { readonly params: Promise<{ readonly track: string; readonly module: string }> }): Promise<Metadata> {
  const { track: trackSlug, module: moduleSlug } = await params;
  const track = findTrack(trackSlug);
  const moduleDefinition = findModule(trackSlug, moduleSlug);
  if (!track || !moduleDefinition) return pageMetadata({ title: 'Module not found', description: 'The requested JS2Next module does not exist.', path: `/learn/${trackSlug}/${moduleSlug}`, indexable: false });
  return pageMetadata({
    title: `${moduleDefinition.title} module`,
    description: `Learn ${moduleDefinition.title} in the ${track.title} track through ordered topics, practice, and mastery checks.`,
    path: `/learn/${track.slug}/${moduleDefinition.slug}`,
  });
}

export default async function ModulePage({ params }: { readonly params: Promise<{ readonly track: string; readonly module: string }> }) {
  const { track: trackSlug, module: moduleSlug } = await params;
  const track = findTrack(trackSlug);
  const moduleDefinition = findModule(trackSlug, moduleSlug);
  if (!track || !moduleDefinition) notFound();
  const practiceSets = moduleDefinition.topics.flatMap((topic) => { const set = getTopicPractice(topic.id); return set === null ? [] : [{ ownerId: set.ownerId, kind: 'topic-practice' as const, trackId: track.slug, title: set.title, questions: set.questions }]; });
  return <div className="space-y-8"><CurriculumNav track={track} module={moduleDefinition} /><CurriculumHeader eyebrow={`${track.title} · Module ${moduleDefinition.order}`} title={moduleDefinition.title} description="Learn the topic path, practice weak spots, check mastery, and reflect on what comes next." backHref={`/tracks/${track.slug}`} backLabel="Back to track" /><ModuleStageTabs track={track} module={moduleDefinition} practiceSets={practiceSets} /></div>;
}
