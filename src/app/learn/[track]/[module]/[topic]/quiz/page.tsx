import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AssessmentClient } from '@/components/assessment/AssessmentClient';
import { getTopicQuiz } from '@/components/assessment/release1-data.server';
import { findTopic } from '@/domain/curriculum';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Topic quiz',
  description: 'Check your understanding with a JS2Next topic quiz.',
  path: '/learn/quiz',
  indexable: false,
});

export default async function TopicQuizPage({ params }: { readonly params: Promise<{ readonly track: string; readonly module: string; readonly topic: string }> }) {
  const { track, module, topic } = await params;
  const topicDefinition = findTopic(track, module, topic);
  const data = getTopicQuiz(topicDefinition?.id ?? topic);
  if (data === null || data.assessment.trackId !== track) notFound();
  return <AssessmentClient data={data} backHref={`/learn/${track}/${module}/${topic}`} />;
}
