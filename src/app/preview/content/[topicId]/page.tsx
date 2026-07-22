import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { curriculum, findTopicById, moduleForTopic } from '@/domain/curriculum';
import { loadTopicPacket } from '@/domain/curriculum/packet';
import { CurriculumBadge, CurriculumHeader } from '@/components/curriculum/CurriculumHeader';
import { CurriculumNav } from '@/components/curriculum/CurriculumNav';
import { TopicPacketView } from '@/components/curriculum/TopicPacketView';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({ title: 'Draft content preview', description: 'Internal JS2Next draft content preview.', path: '/preview/content', indexable: false });

export default async function ContentPreviewPage({ params }: { readonly params: Promise<{ readonly topicId: string }> }) {
  const { topicId } = await params;
  const topic = findTopicById(topicId);
  if (!topic || topic.status !== 'draft') notFound();
  const packet = loadTopicPacket(topic);
  if (!packet) notFound();
  const track = curriculum.tracks.find((candidate) => candidate.modules.some((candidateModule) => candidateModule.topics.some((candidateTopic) => candidateTopic.id === topic.id)));
  const moduleDefinition = moduleForTopic(topic.id);
  if (!track || !moduleDefinition) notFound();
  return <div className="space-y-8"><CurriculumNav track={track} module={moduleDefinition} topic={topic} /><CurriculumHeader eyebrow="Internal draft preview" title={packet.title} description="This packet is draft-only and remains outside the published learner manifest." backHref={`/learn/${track.slug}/${moduleDefinition.slug}/${topic.slug}`} backLabel="Open learner view" /><div className="flex flex-wrap gap-2"><CurriculumBadge tone="warning">Draft</CurriculumBadge><CurriculumBadge>Human review pending</CurriculumBadge></div><TopicPacketView packet={packet} /><Link href={`/learn/${track.slug}/${moduleDefinition.slug}/${topic.slug}`} className="btn-secondary inline-block text-sm">Back to topic</Link></div>;
}
