import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseAssessmentSet, parseQuestionBank } from '@/domain/assessment';
import type { AssessmentSet, Question, TrackId } from '@/domain/assessment';
import type { AssessmentPageData } from './types';

type JsonRecord = { readonly [key: string]: unknown };
type TopicPacket = JsonRecord & { readonly id: string; readonly title: string; readonly trackId: TrackId; readonly moduleId: string; readonly status: string; readonly reviewStatus: string; readonly version: number; readonly topicQuiz: JsonRecord; readonly assessmentProfile: JsonRecord; readonly questions: readonly unknown[] };

const contentRoot = join(process.cwd(), 'content');
const tracks: readonly TrackId[] = ['javascript', 'react', 'nextjs'];

const isRecord = (value: unknown): value is JsonRecord => typeof value === 'object' && value !== null && !Array.isArray(value);
const isTrack = (value: unknown): value is TrackId => value === 'javascript' || value === 'react' || value === 'nextjs';

const readJson = (path: string): unknown => JSON.parse(readFileSync(path, 'utf8')) as unknown;

const filesIn = (root: string): readonly string[] => readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
  const path = join(root, entry.name);
  return entry.isDirectory() ? filesIn(path) : entry.name.endsWith('.json') ? [path] : [];
});

const topicPackets = tracks.flatMap((track) => filesIn(join(contentRoot, 'normalized', track)).map((path) => readJson(path)))
  .filter((value): value is TopicPacket => isRecord(value) && typeof value.id === 'string' && typeof value.title === 'string' && isTrack(value.trackId) && typeof value.moduleId === 'string' && typeof value.status === 'string' && typeof value.reviewStatus === 'string' && value.version === 2 && isRecord(value.topicQuiz) && isRecord(value.assessmentProfile) && Array.isArray(value.questions));

const questionBank = new Map<string, Question>(parseQuestionBank(readJson(join(contentRoot, 'assessment-source', 'question-bank.json'))).map((question) => [question.id, question]));

const sourceSets = filesIn(join(contentRoot, 'assessment-source'))
  .filter((path) => !path.endsWith('question-bank.json'))
  .map((path) => parseAssessmentSet(readJson(path)));

const findSet = (predicate: (assessment: AssessmentSet) => boolean): AssessmentSet => {
  const assessment = sourceSets.find(predicate);
  if (assessment === undefined) throw new Error('Release 1 assessment source was not found');
  return assessment;
};

const questionsFor = (assessment: AssessmentSet): readonly Question[] => assessment.questionIds.map((questionId) => {
  const question = questionBank.get(questionId);
  if (question === undefined) throw new Error(`Release 1 question was not found: ${questionId}`);
  return question;
});

export function getTopicQuiz(topicId: string): AssessmentPageData | null {
  const packet = topicPackets.find((candidate) => candidate.id === topicId);
  if (packet === undefined) return null;
  const topicQuiz = parseAssessmentSet({ kind: 'topic-quiz', ...packet.topicQuiz, assessmentProfile: packet.assessmentProfile, trackId: packet.trackId, moduleId: packet.moduleId, title: `${packet.title} quiz`, status: packet.status, reviewStatus: packet.reviewStatus, version: packet.version, schemaVersion: '2.0', assessmentPolicyVersion: '2.0' });
  return { assessment: topicQuiz, questions: questionsFor(topicQuiz) };
}

export function getModuleReview(moduleId: string): AssessmentPageData | null {
  const assessment = sourceSets.find((candidate) => candidate.kind === 'module-review' && candidate.moduleId === moduleId);
  return assessment === undefined ? null : { assessment, questions: questionsFor(assessment) };
}

export function getCumulativeReview(trackId: TrackId): AssessmentPageData {
  const assessment = findSet((candidate) => candidate.kind === 'cumulative-review' && candidate.trackId === trackId);
  return { assessment, questions: questionsFor(assessment) };
}

export function listRelease1Topics(): readonly TopicPacket[] { return topicPackets; }

export function listRelease1Assessments(): readonly AssessmentSet[] { return sourceSets; }
