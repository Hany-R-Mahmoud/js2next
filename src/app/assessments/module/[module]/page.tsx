import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AssessmentClient } from '@/components/assessment/AssessmentClient';
import { getModuleReview } from '@/components/assessment/release1-data.server';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({ title: 'Module assessment', description: 'Complete a JS2Next module assessment.', path: '/assessments/module', indexable: false });

export default async function ModuleAssessmentPage({ params }: { readonly params: Promise<{ readonly module: string }> }) {
  const { module } = await params;
  const data = getModuleReview(module);
  if (data === null) notFound();
  return <AssessmentClient data={data} backHref="/progress" />;
}
