import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { evaluateAssessment } from '@/domain/assessment';
import { getAssessmentById } from '@/components/assessment/release1-data.server';
import { getMemberAccess } from '@/lib/security/member';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const attemptSchema = z.object({
  answers: z.array(z.object({ questionId: z.string().min(1), choiceId: z.string().min(1).optional() })).min(1).max(200),
});

export async function POST(request: NextRequest, context: { readonly params: Promise<{ readonly assessmentId: string }> }): Promise<NextResponse> {
  const member = await getMemberAccess();
  if (member === null) return NextResponse.json({ error: 'Authentication required.' }, { status: 401, headers: { 'Cache-Control': 'private, no-store' } });
  const { assessmentId } = await context.params;
  const source = getAssessmentById(assessmentId);
  if (source === null || source.assessment.status !== 'published' || source.assessment.reviewStatus !== 'approved') return NextResponse.json({ error: 'Assessment unavailable.' }, { status: 404 });

  const parsed = attemptSchema.safeParse(await request.json());
  if (!parsed.success || parsed.data.answers.length !== source.assessment.questionIds.length || new Set(parsed.data.answers.map((answer) => answer.questionId)).size !== source.assessment.questionIds.length || parsed.data.answers.some((answer) => !source.assessment.questionIds.includes(answer.questionId) || answer.choiceId === undefined)) return NextResponse.json({ error: 'All assessment questions require one valid answer.' }, { status: 400 });
  try {
    const result = evaluateAssessment(source.assessment, source.questions, parsed.data.answers);
    const supabase = await createSupabaseServerClient();
    const { error: persistenceError } = await supabase.from('assessment_attempts').insert({
      user_id: member.userId,
      assessment_id: source.assessment.id,
      submitted_at: new Date().toISOString(),
      score_percent: result.scorePercent,
      mastered: result.mastered,
      response: result,
    });
    if (persistenceError !== null) return NextResponse.json({ error: 'Unable to save assessment attempt.' }, { status: 503, headers: { 'Cache-Control': 'private, no-store' } });
    return NextResponse.json(result, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Assessment submission failed.' }, { status: 400, headers: { 'Cache-Control': 'private, no-store' } });
  }
}
