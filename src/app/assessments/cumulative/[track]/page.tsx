import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AssessmentClient } from '@/components/assessment/AssessmentClient';
import { getCumulativeReview } from '@/components/assessment/release1-data.server';
import type { TrackId } from '@/domain/assessment';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({ title: 'Track assessment', description: 'Complete a JS2Next cumulative track assessment.', path: '/assessments/cumulative', indexable: false });

const isTrack = (value: string): value is TrackId => value === 'javascript' || value === 'react' || value === 'nextjs';

export default async function CumulativeAssessmentPage({ params }: { readonly params: Promise<{ readonly track: string }> }) {
  const { track } = await params;
  if (!isTrack(track)) notFound();
  return <AssessmentClient data={getCumulativeReview(track)} backHref="/progress" />;
}
