import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { findModule, findTopic, findTrack, prerequisitesFor } from '@/domain/curriculum';
import { loadTopicPacket } from '@/domain/curriculum/packet';
import { CurriculumBadge, CurriculumHeader } from '@/components/curriculum/CurriculumHeader';
import { CurriculumNav } from '@/components/curriculum/CurriculumNav';
import { PrerequisiteNotice } from '@/components/curriculum/PrerequisiteNotice';
import TopicStageTabs from '@/components/curriculum/TopicStageTabs';
import { getTopicPractice } from '@/components/assessment/release1-data.server';
import { pageMetadata } from '@/lib/seo';
import { enforceTopicAccess } from '@/lib/security/route-access';

export async function generateMetadata({ params }: { readonly params: Promise<{ readonly track: string; readonly module: string; readonly topic: string }> }): Promise<Metadata> {
  const { track: trackSlug, module: moduleSlug, topic: topicSlug } = await params;
  const track = findTrack(trackSlug);
  const moduleDefinition = findModule(trackSlug, moduleSlug);
  const topic = findTopic(trackSlug, moduleSlug, topicSlug);
  const packet = topic === undefined ? undefined : loadTopicPacket(topic);
  if (!track || !moduleDefinition || !topic || !packet) return pageMetadata({ title: 'Topic not found', description: 'The requested JS2Next topic does not exist.', path: `/learn/${trackSlug}/${moduleSlug}/${topicSlug}`, indexable: false });
  return pageMetadata({
    title: packet.title,
    description: packet.whyThisMatters,
    path: `/learn/${track.slug}/${moduleDefinition.slug}/${topic.slug}`,
    type: 'article',
    indexable: false,
  });
}

export default async function TopicPage({ params }: { readonly params: Promise<{ readonly track: string; readonly module: string; readonly topic: string }> }) {
  const { track: trackSlug, module: moduleSlug, topic: topicSlug } = await params;
  const track = findTrack(trackSlug);
  const moduleDefinition = findModule(trackSlug, moduleSlug);
  const topic = findTopic(trackSlug, moduleSlug, topicSlug);
  if (!track || !moduleDefinition || !topic) notFound();
  await enforceTopicAccess(topic, `/learn/${trackSlug}/${moduleSlug}/${topicSlug}`);
  const packet = loadTopicPacket(topic);
  if (!packet) notFound();
  const practice = getTopicPractice(topic.id);
  if (!practice) notFound();
  const practiceSet = { ownerId: practice.ownerId, kind: 'topic-practice' as const, trackId: track.slug, title: practice.title, questions: practice.questions };
  return <div className="space-y-8"><CurriculumNav track={track} module={moduleDefinition} topic={topic} /><CurriculumHeader eyebrow={`${track.title} · ${moduleDefinition.title}`} title={packet.title} description={`${topic.estimatedMinutes} minutes · Learn the model, apply it, then check your understanding.`} backHref={`/learn/${track.slug}/${moduleDefinition.slug}`} backLabel="Back to module" /><div className="flex flex-wrap gap-2"><CurriculumBadge tone={topic.required ? 'accent' : 'neutral'}>{topic.required ? 'Required' : 'Optional'}</CurriculumBadge>{topic.advanced ? <CurriculumBadge tone="warning">Advanced</CurriculumBadge> : null}<CurriculumBadge>Order {topic.order}</CurriculumBadge></div><PrerequisiteNotice topic={topic} edges={prerequisitesFor(topic.id)} /><TopicStageTabs trackSlug={track.slug} module={moduleDefinition} topic={topic} packet={packet} practiceSet={practiceSet} /></div>;
}
