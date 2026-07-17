import { notFound } from 'next/navigation';
import { AssessmentClient } from '@/components/assessment/AssessmentClient';
import { getModuleReview } from '@/components/assessment/release1-data.server';

export default async function ModuleAssessmentPage({ params }: { readonly params: Promise<{ readonly module: string }> }) {
  const { module } = await params;
  const data = getModuleReview(module);
  if (data === null) notFound();
  return <AssessmentClient data={data} backHref="/progress" />;
}
