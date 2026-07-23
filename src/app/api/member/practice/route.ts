import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { getPracticeQuestionForEvaluation } from '@/components/assessment/release1-data.server';
import { getMemberAccess } from '@/lib/security/member';
import { getContentAccessMode, isPublishedTopic } from '@/lib/security/access';
import { findTopicById } from '@/domain/curriculum';

const practiceSchema = z.object({ ownerId: z.string().min(1), questionId: z.string().min(1), choiceId: z.string().min(1) });

export async function POST(request: NextRequest): Promise<NextResponse> {
  if ((await getMemberAccess()) === null) return NextResponse.json({ error: 'Authentication required.' }, { status: 401, headers: { 'Cache-Control': 'private, no-store' } });
  if (getContentAccessMode() !== 'members') return NextResponse.json({ error: 'Practice unavailable.' }, { status: 404 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid practice submission.' }, { status: 400 });
  }
  const parsed = practiceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid practice submission.' }, { status: 400 });
  const question = getPracticeQuestionForEvaluation(parsed.data.ownerId, parsed.data.questionId);
  const topic = findTopicById(parsed.data.ownerId);
  if (topic === undefined || !isPublishedTopic(topic)) return NextResponse.json({ error: 'Practice unavailable.' }, { status: 404 });
  if (question === null) return NextResponse.json({ error: 'Practice question unavailable.' }, { status: 404 });
  const choice = question.choices.find((candidate) => candidate.id === parsed.data.choiceId);
  if (choice === undefined) return NextResponse.json({ error: 'Invalid practice choice.' }, { status: 400 });
  return NextResponse.json({ correct: question.correctChoiceIds[0] === parsed.data.choiceId, explanation: question.explanation, choiceFeedback: choice.feedback, ...(question.hint ? { hint: question.hint } : {}) }, { headers: { 'Cache-Control': 'private, no-store' } });
}
