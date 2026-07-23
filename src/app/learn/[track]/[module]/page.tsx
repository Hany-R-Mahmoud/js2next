import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { findModule, findTrack } from '@/domain/curriculum';
import { CurriculumHeader } from '@/components/curriculum/CurriculumHeader';
import { CurriculumNav } from '@/components/curriculum/CurriculumNav';
import ModuleStageTabs from '@/components/curriculum/ModuleStageTabs';
import { getTopicPractice } from '@/components/assessment/release1-data.server';
import { pageMetadata } from '@/lib/seo';
import { enforceTopicAccess } from '@/lib/security/route-access';
import { getContentAccessMode } from '@/lib/security/access';

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
  if (getContentAccessMode() === 'closed') return <ModuleCatalog trackSlug={track.slug} module={moduleDefinition} trackTitle={track.title} />;
  await Promise.all(moduleDefinition.topics.map((topic) => enforceTopicAccess(topic, `/learn/${trackSlug}/${moduleSlug}`)));
  const practiceSets = moduleDefinition.topics.flatMap((topic) => { const set = getTopicPractice(topic.id); return set === null ? [] : [{ ownerId: set.ownerId, kind: 'topic-practice' as const, trackId: track.slug, title: set.title, questions: set.questions }]; });
  return <div className="space-y-8"><CurriculumNav track={track} module={moduleDefinition} /><CurriculumHeader eyebrow={`${track.title} · Module ${moduleDefinition.order}`} title={moduleDefinition.title} description="Learn the topic path, practice weak spots, check mastery, and reflect on what comes next." backHref={`/tracks/${track.slug}`} backLabel="Back to track" /><ModuleStageTabs track={track} module={moduleDefinition} practiceSets={practiceSets} /></div>;
}

function ModuleCatalog({ trackSlug, module, trackTitle }: { readonly trackSlug: string; readonly module: NonNullable<ReturnType<typeof findModule>>; readonly trackTitle: string }) {
  return <div className="space-y-8"><CurriculumNav /><CurriculumHeader eyebrow={`${trackTitle} · Module ${module.order}`} title={module.title} description="This public view shows the catalog only. Create a verified account to open the protected learning material." backHref={`/tracks/${trackSlug}`} backLabel="Back to track" /><ol className="space-y-3" aria-label={`${module.title} topics`}>{module.topics.filter((topic) => topic.status !== 'archived').map((topic) => <li key={topic.id} className="card flex items-center justify-between gap-4 p-5"><div><p className="text-xs font-semibold uppercase tracking-wide text-teal">Topic {topic.order}</p><h2 className="mt-1 font-semibold text-ink">{topic.title}</h2><p className="mt-1 text-sm text-ink-muted">{topic.estimatedMinutes} minutes · {topic.required ? 'Required' : 'Optional'}</p></div><a href={`/sign-in?next=${encodeURIComponent(`/learn/${trackSlug}/${module.slug}/${topic.slug}`)}`} className="btn-secondary shrink-0 text-sm">Create account to open</a></li>)}</ol></div>;
}
