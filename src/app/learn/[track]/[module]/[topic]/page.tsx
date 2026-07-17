import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findModule, findTopic, findTrack, prerequisitesFor } from '@/domain/curriculum';
import { loadTopicPacket } from '@/domain/curriculum/packet';
import { CurriculumBadge, CurriculumHeader } from '@/components/curriculum/CurriculumHeader';
import { CurriculumNav } from '@/components/curriculum/CurriculumNav';
import { PrerequisiteNotice } from '@/components/curriculum/PrerequisiteNotice';
import { TopicPacketView } from '@/components/curriculum/TopicPacketView';

export default async function TopicPage({ params }: { readonly params: Promise<{ readonly track: string; readonly module: string; readonly topic: string }> }) {
  const { track: trackSlug, module: moduleSlug, topic: topicSlug } = await params;
  const track = findTrack(trackSlug);
  const moduleDefinition = findModule(trackSlug, moduleSlug);
  const topic = findTopic(trackSlug, moduleSlug, topicSlug);
  if (!track || !moduleDefinition || !topic) notFound();
  const packet = loadTopicPacket(topic);
  if (!packet) notFound();
  return <div className="space-y-8"><CurriculumNav track={track} module={moduleDefinition} topic={topic} /><CurriculumHeader eyebrow={`${track.title} · ${moduleDefinition.title}`} title={packet.title} description={`${topic.estimatedMinutes} minutes · Draft curriculum content`} backHref={`/learn/${track.slug}/${moduleDefinition.slug}`} backLabel="Back to module" /><div className="flex flex-wrap gap-2"><CurriculumBadge tone={topic.required ? 'accent' : 'neutral'}>{topic.required ? 'Required' : 'Optional'}</CurriculumBadge>{topic.advanced ? <CurriculumBadge tone="warning">Advanced</CurriculumBadge> : null}<CurriculumBadge>Order {topic.order}</CurriculumBadge></div><PrerequisiteNotice topic={topic} edges={prerequisitesFor(topic.id)} /><TopicPacketView packet={packet} /><div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper-warm pt-6"><p className="text-sm text-ink-muted">Ready to check your understanding?</p><Link href={`/learn/${track.slug}/${moduleDefinition.slug}/${topic.slug}/quiz`} className="btn-primary text-sm">Open topic quiz</Link></div></div>;
}
