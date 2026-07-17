import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
type AssessmentProfileType = 'conceptual' | 'workflow' | 'hybrid' | 'coding';
type Question = Record<string, unknown>;

const root = resolve(process.cwd());
const content = join(root, 'content');
const tracks = ['javascript', 'react', 'nextjs'] as const;
const profileCounts: Record<AssessmentProfileType, number> = { conceptual: 0, workflow: 0, hybrid: 0, coding: 0 };
const readJson = (path: string): unknown => JSON.parse(readFileSync(path, 'utf8')) as unknown;
const filesUnder = (directory: string): readonly string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? filesUnder(path) : entry.name.endsWith('.json') ? [path] : [];
});
const fail = (message: string): never => { throw new Error(message); };

const bankDocument = readJson(join(content, 'assessment-source/question-bank.json')) as Record<string, unknown>;
const bank = Array.isArray(bankDocument.questions) ? bankDocument.questions.filter((question): question is Question => typeof question === 'object' && question !== null && !Array.isArray(question)) : [];
if (bank.length !== 632 || new Set(bank.map((question) => question.id)).size !== 632) fail('active bank must contain exactly 632 unique questions');
if (bankDocument.schemaVersion !== '2.0' || bankDocument.assessmentPolicyVersion !== '2.0' || bankDocument.status !== 'draft' || bankDocument.reviewStatus !== 'pending-human-review') fail('active bank has an invalid v2 envelope');
if (bank.some((question) => question.version !== 2 || question.status !== 'draft' || question.reviewStatus !== 'pending-human-review')) fail('active bank contains a non-v2 or publishable question');
if (bank.some((question) => !Array.isArray(question.choices) || question.choices.length !== 4 || question.correctChoiceIds instanceof Array === false || question.correctChoiceIds.length !== 1)) fail('active bank contains an invalid four-choice question');

const bankById = new Map<string, Question>(bank.map((question) => [String(question.id), question]));
const packets = tracks.flatMap((track) => filesUnder(join(content, 'normalized', track)).map(readJson));
if (packets.length !== 79) fail(`expected 79 normalized packets, received ${packets.length}`);
const packetQuestions: Question[] = [];
for (const packet of packets) {
  if (typeof packet !== 'object' || packet === null || Array.isArray(packet)) fail('normalized packet is not an object');
  const value = packet as Record<string, unknown>;
  const profile = value.assessmentProfile as Record<string, unknown> | undefined;
  const type = profile?.type;
  if (type !== 'conceptual' && type !== 'workflow' && type !== 'hybrid' && type !== 'coding') fail(`packet ${String(value.id)} has no valid assessment profile`);
  const profileType = type as AssessmentProfileType;
  profileCounts[profileType] += 1;
  if (!Array.isArray(value.questions) || !value.questions.every((question): question is Question => typeof question === 'object' && question !== null && !Array.isArray(question))) fail(`packet ${String(value.id)} has invalid questions`);
  const packetRecords = value.questions as Question[];
  for (const question of packetRecords) {
    const parsed = bankById.get(String(question.id)) ?? fail(`packet question ${String(question.id)} is missing from active bank`);
    packetQuestions.push(parsed);
  }
  const quiz = value.topicQuiz as Record<string, unknown> | undefined;
  const quizIds = Array.isArray(quiz?.questionIds) ? quiz.questionIds.filter((id): id is string => typeof id === 'string') : [];
  const quizQuestions = quizIds.map((id) => bankById.get(id)).filter((question): question is Question => question !== undefined);
  const codeCount = quizQuestions.filter((question) => question.presentation === 'code').length;
  const practicalCount = quizQuestions.filter((question) => question.practical === true).length;
  if (profileType === 'conceptual' && codeCount !== 0) fail(`conceptual packet ${String(value.id)} contains code quiz questions`);
  if (profileType === 'hybrid' && codeCount < 3) fail(`hybrid packet ${String(value.id)} has fewer than three code quiz questions`);
  if (profileType === 'coding' && codeCount < 4) fail(`coding packet ${String(value.id)} has fewer than four code quiz questions`);
  if (profileType === 'workflow' && practicalCount < 1) fail(`workflow packet ${String(value.id)} has no practical scenario or artifact`);
}
if (new Set(packetQuestions.map((question) => question.id)).size !== 632) fail('normalized packets do not expose exactly the 632 active question IDs');

const sets = filesUnder(join(content, 'assessment-source')).filter((path) => !path.endsWith('question-bank.json')).map((path) => readJson(path) as Record<string, unknown>);
if (sets.length !== 30) fail(`expected 30 active module/cumulative assessment sets, received ${sets.length}`);
for (const assessment of sets) {
  const questionIds = Array.isArray(assessment.questionIds) ? assessment.questionIds.filter((id): id is string => typeof id === 'string') : [];
  for (const questionId of questionIds) if (!bankById.has(questionId)) fail(`${String(assessment.id)} references missing question ${questionId}`);
  if (assessment.schemaVersion !== '2.0' || assessment.assessmentPolicyVersion !== '2.0' || assessment.version !== 2 || assessment.status !== 'draft' || assessment.reviewStatus !== 'pending-human-review') fail(`${String(assessment.id)} is not a draft v2 assessment set`);
}

const expectedProfiles: Readonly<Record<AssessmentProfileType, number>> = { conceptual: 12, coding: 33, workflow: 16, hybrid: 18 };
for (const profile of Object.keys(expectedProfiles) as AssessmentProfileType[]) if (profileCounts[profile] !== expectedProfiles[profile]) fail(`profile ${profile} count is ${profileCounts[profile]}, expected ${expectedProfiles[profile]}`);
console.log(`Assessment v2 validation passed: ${bank.length} questions, ${packets.length} profiles, ${sets.length} assessment sets`);
console.log(`Profiles: ${JSON.stringify(profileCounts)}`);
