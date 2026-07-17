import { notFound } from 'next/navigation';
import { findModule, findTopic, findTrack, prerequisitesFor } from '@/domain/curriculum';
import { loadTopicPacket } from '@/domain/curriculum/packet';
import { CurriculumBadge, CurriculumHeader } from '@/components/curriculum/CurriculumHeader';
import { CurriculumNav } from '@/components/curriculum/CurriculumNav';
import { PrerequisiteNotice } from '@/components/curriculum/PrerequisiteNotice';
import TopicStageTabs from '@/components/curriculum/TopicStageTabs';

export default async function TopicPage({ params }: { readonly params: Promise<{ readonly track: string; readonly module: string; readonly topic: string }> }) {
  const { track: trackSlug, module: moduleSlug, topic: topicSlug } = await params;
  const track = findTrack(trackSlug);
  const moduleDefinition = findModule(trackSlug, moduleSlug);
  const topic = findTopic(trackSlug, moduleSlug, topicSlug);
  if (!track || !moduleDefinition || !topic) notFound();
  const packet = loadTopicPacket(topic);
  if (!packet) notFound();
  return <div className="space-y-8"><CurriculumNav track={track} module={moduleDefinition} topic={topic} /><CurriculumHeader eyebrow={`${track.title} · ${moduleDefinition.title}`} title={packet.title} description={`${topic.estimatedMinutes} minutes · Draft curriculum content`} backHref={`/learn/${track.slug}/${moduleDefinition.slug}`} backLabel="Back to module" /><div className="flex flex-wrap gap-2"><CurriculumBadge tone={topic.required ? 'accent' : 'neutral'}>{topic.required ? 'Required' : 'Optional'}</CurriculumBadge>{topic.advanced ? <CurriculumBadge tone="warning">Advanced</CurriculumBadge> : null}<CurriculumBadge>Order {topic.order}</CurriculumBadge></div><PrerequisiteNotice topic={topic} edges={prerequisitesFor(topic.id)} /><TopicStageTabs trackSlug={track.slug} module={moduleDefinition} topic={topic} packet={packet} /></div>;
}
