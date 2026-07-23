import { notFound, redirect } from 'next/navigation';
import { getTopicBundle } from '@/content/topics';
import { findTopicById, moduleForTopic, curriculum } from '@/domain/curriculum';
import { legacyTopicRedirects } from '@/lib/content/legacy-topic-redirects';
import { enforceTopicAccess } from '@/lib/security/route-access';

export default async function LegacyTopicRedirect({ params }: { readonly params: Promise<{ readonly slug: string }> }) {
  const { slug } = await params;
  const bundle = getTopicBundle(slug);
  if (!bundle) notFound();
  const targetId = legacyTopicRedirects[slug];
  const target = targetId === undefined ? undefined : findTopicById(targetId);
  const moduleDefinition = target === undefined ? undefined : moduleForTopic(target.id);
  const track = moduleDefinition === undefined ? undefined : curriculum.tracks.find((candidate) => candidate.modules.some((item) => item.id === moduleDefinition.id));
  if (!target || !moduleDefinition || !track) redirect(`/search?q=${encodeURIComponent(bundle.lesson.title)}`);
  await enforceTopicAccess(target, `/topic/${slug}`);
  redirect(`/learn/${track.slug}/${moduleDefinition.slug}/${target.slug}`);
}
