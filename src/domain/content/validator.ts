import type { ContentDiagnostic, JsonObject, JsonValue, ValidationResult } from './types.ts';

const TRACKS = new Set(['javascript', 'react', 'nextjs']);
const STATUSES = new Set(['draft', 'reviewed', 'published', 'retired', 'archived']);
const REVIEW_STATUSES = new Set(['pending-human-review', 'approved', 'needs-revision']);
const COGNITIVE_LEVELS = new Set(['recognize', 'explain', 'predict', 'apply', 'debug', 'tradeoff', 'synthesize', 'transfer']);
const ASSESSMENT_PROFILES = new Set(['conceptual', 'workflow', 'hybrid', 'coding']);
const SCENARIO_MODES = new Set(['scenario-reasoning', 'workflow-artifact', 'workflow-scenario', 'workflow-judgment']);

export function isRecord(value: JsonValue | unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringAt(value: JsonObject, key: string): string | undefined {
  const item = value[key];
  return typeof item === 'string' ? item : undefined;
}

function numberAt(value: JsonObject, key: string): number | undefined {
  const item = value[key];
  return typeof item === 'number' && Number.isInteger(item) ? item : undefined;
}

function arrayAt(value: JsonObject, key: string): readonly JsonValue[] | undefined {
  const item = value[key];
  return Array.isArray(item) ? item : undefined;
}

function add(issues: ContentDiagnostic[], path: string, message: string): void {
  issues.push({ path, message });
}

function validateQuestion(question: JsonObject, path: string, objectives: ReadonlySet<string>, topicId: string, issues: ContentDiagnostic[], seen: Set<string>): void {
  const id = stringAt(question, 'id');
  if (id === undefined) { add(issues, path, 'question id must be a string'); return; }
  if (seen.has(id)) add(issues, `${path}.id`, `duplicate question id ${id}`);
  seen.add(id);
  if (stringAt(question, 'topicId') !== topicId) add(issues, `${path}.topicId`, `must equal packet topic ${topicId}`);
  if (stringAt(question, 'kind') !== 'single-choice') add(issues, `${path}.kind`, 'must be single-choice');
  if (!TRACKS.has(stringAt(question, 'trackId') ?? '')) add(issues, `${path}.trackId`, 'must be a supported track');
  const prompt = stringAt(question, 'prompt');
  if (prompt === undefined || prompt.trim().length < 10) add(issues, `${path}.prompt`, 'must contain at least 10 characters');
  const questionObjectives = arrayAt(question, 'objectiveIds') ?? [];
  if (questionObjectives.length < 1) add(issues, `${path}.objectiveIds`, 'must reference at least one objective');
  for (const objective of questionObjectives) {
    if (typeof objective !== 'string' || !objectives.has(objective)) add(issues, `${path}.objectiveIds`, `unknown objective reference ${String(objective)}`);
  }
  const choices = arrayAt(question, 'choices') ?? [];
  if (choices.length !== 4) add(issues, `${path}.choices`, 'must contain exactly 4 choices');
  const choiceIds = new Set<string>();
  for (const [index, choice] of choices.entries()) {
    if (!isRecord(choice)) { add(issues, `${path}.choices[${index}]`, 'must be an object'); continue; }
    const choiceId = stringAt(choice, 'id');
    if (choiceId === undefined) add(issues, `${path}.choices[${index}].id`, 'must be a string');
    else if (choiceIds.has(choiceId)) add(issues, `${path}.choices`, `duplicate choice id ${choiceId}`);
    else choiceIds.add(choiceId);
    if ((stringAt(choice, 'label') ?? '').trim() === '') add(issues, `${path}.choices[${index}].label`, 'must not be empty');
    if ((stringAt(choice, 'feedback') ?? '').trim() === '') add(issues, `${path}.choices[${index}].feedback`, 'must not be empty');
  }
  const correct = arrayAt(question, 'correctChoiceIds') ?? [];
  if (correct.length !== 1 || typeof correct[0] !== 'string' || !choiceIds.has(correct[0])) add(issues, `${path}.correctChoiceIds`, 'must contain exactly one existing choice id');
  if ((stringAt(question, 'explanation') ?? '').trim().length < 10) add(issues, `${path}.explanation`, 'must contain corrective explanation');
  if (numberAt(question, 'version') !== 2) add(issues, `${path}.version`, 'must be v2');
  if (stringAt(question, 'presentation') !== 'text' && stringAt(question, 'presentation') !== 'code') add(issues, `${path}.presentation`, 'must be text or code');
  if (stringAt(question, 'assessmentMode') === undefined) add(issues, `${path}.assessmentMode`, 'is required for v2 questions');
  if (typeof question.practical !== 'boolean') add(issues, `${path}.practical`, 'must be boolean');
  if (stringAt(question, 'assessmentPolicyVersion') !== '2.0') add(issues, `${path}.assessmentPolicyVersion`, 'must be 2.0');
  if (stringAt(question, 'status') !== 'draft') add(issues, `${path}.status`, 'v2 questions must remain draft');
  if (stringAt(question, 'reviewStatus') !== 'pending-human-review') add(issues, `${path}.reviewStatus`, 'v2 questions must remain pending human review');
  if (stringAt(question, 'presentation') === 'code' && !isRecord(question.code)) add(issues, `${path}.code`, 'is required for code presentation');
  if (!COGNITIVE_LEVELS.has(stringAt(question, 'cognitiveLevel') ?? '')) add(issues, `${path}.cognitiveLevel`, 'must be a supported cognitive level');
}

export function validatePacket(value: unknown, sourcePath: string, seenQuestionIds: Set<string>): ValidationResult {
  const issues: ContentDiagnostic[] = [];
  if (!isRecord(value)) return { ok: false, diagnostics: [{ path: sourcePath, message: 'packet must be a JSON object' }] };
  const id = stringAt(value, 'id') ?? '';
  const topicPath = `${sourcePath}(${id || 'unknown'})`;
  if (!id) add(issues, topicPath, 'id is required');
  const trackId = stringAt(value, 'trackId');
  if (!TRACKS.has(trackId ?? '')) add(issues, `${topicPath}.trackId`, 'must be javascript, react, or nextjs');
  if ((stringAt(value, 'moduleId') ?? '').trim() === '') add(issues, `${topicPath}.moduleId`, 'is required');
  if (numberAt(value, 'version') === undefined || (numberAt(value, 'version') ?? 0) < 1) add(issues, `${topicPath}.version`, 'must be a positive integer');
  if (!STATUSES.has(stringAt(value, 'status') ?? '')) add(issues, `${topicPath}.status`, 'is invalid');
  if (!REVIEW_STATUSES.has(stringAt(value, 'reviewStatus') ?? '')) add(issues, `${topicPath}.reviewStatus`, 'is invalid');
  if (stringAt(value, 'publicationStatus') === 'published' && stringAt(value, 'reviewStatus') !== 'approved') add(issues, `${topicPath}.publicationStatus`, 'published content must be approved');
  const objectives = new Set<string>();
  for (const [index, objective] of (arrayAt(value, 'learningObjectives') ?? []).entries()) {
    if (!isRecord(objective) || typeof objective.id !== 'string') add(issues, `${topicPath}.learningObjectives[${index}]`, 'must have a string id');
    else if (objectives.has(objective.id)) add(issues, `${topicPath}.learningObjectives`, `duplicate objective id ${objective.id}`);
    else objectives.add(objective.id);
  }
  const questions = arrayAt(value, 'questions') ?? [];
  if (questions.length < 8) add(issues, `${topicPath}.questions`, 'must contain at least 8 questions');
  const localIds = new Set<string>();
  for (const [index, question] of questions.entries()) {
    if (isRecord(question)) validateQuestion(question, `${topicPath}.questions[${index}]`, objectives, id, issues, localIds);
    else add(issues, `${topicPath}.questions[${index}]`, 'must be an object');
  }
  for (const questionId of localIds) {
    if (seenQuestionIds.has(questionId)) add(issues, `${topicPath}.questions`, `question id ${questionId} is duplicated across packets`);
    seenQuestionIds.add(questionId);
  }
  const inLesson = arrayAt(value, 'inLessonQuestionIds') ?? [];
  if (inLesson.length < 3) add(issues, `${topicPath}.inLessonQuestionIds`, 'must contain at least 3 checks');
  const quiz = isRecord(value.topicQuiz) ? value.topicQuiz : undefined;
  const quizIds = quiz === undefined ? [] : arrayAt(quiz, 'questionIds') ?? [];
  if (quizIds.length !== 5) add(issues, `${topicPath}.topicQuiz.questionIds`, 'must contain exactly 5 questions');
  for (const ref of [...inLesson, ...quizIds]) if (typeof ref !== 'string' || !localIds.has(ref)) add(issues, `${topicPath}.assessment`, `unresolved question reference ${String(ref)}`);
  const profile = isRecord(value.assessmentProfile) ? value.assessmentProfile : undefined;
  const profileType = profile === undefined ? undefined : stringAt(profile, 'type');
  if (profile === undefined || !ASSESSMENT_PROFILES.has(profileType ?? '')) add(issues, `${topicPath}.assessmentProfile`, 'must contain a supported v2 profile');
  if (profile !== undefined && stringAt(profile, 'version') !== '2.0') add(issues, `${topicPath}.assessmentProfile.version`, 'must be 2.0');
  const localQuestions = new Map(questions.filter(isRecord).map((question) => [stringAt(question, 'id') ?? '', question]));
  const quizQuestions = quizIds.map((id) => localQuestions.get(typeof id === 'string' ? id : '')).filter((question): question is JsonObject => question !== undefined);
  const codeCount = quizQuestions.filter((question) => stringAt(question, 'presentation') === 'code').length;
  const workflowCount = quizQuestions.filter((question) => SCENARIO_MODES.has(stringAt(question, 'assessmentMode') ?? '')).length;
  const codeOrArtifactCount = quizQuestions.filter((question) => stringAt(question, 'presentation') === 'code' || question.practical === true).length;
  if (profileType === 'conceptual' && codeCount !== 0) add(issues, `${topicPath}.topicQuiz`, 'conceptual profiles must not force code questions');
  if (profileType === 'workflow' && (workflowCount < 4 || codeOrArtifactCount < 1)) add(issues, `${topicPath}.topicQuiz`, 'workflow profiles require four workflow scenarios and one code or artifact question');
  if (profileType === 'hybrid' && codeCount < 3) add(issues, `${topicPath}.topicQuiz`, 'hybrid profiles require at least three code questions');
  if (profileType === 'coding' && codeCount < 4) add(issues, `${topicPath}.topicQuiz`, 'coding profiles require at least four code questions');
  const sections = arrayAt(value, 'sections') ?? [];
  for (const [index, section] of sections.entries()) {
    if (!isRecord(section)) continue;
    const check = stringAt(section, 'checkQuestionId');
    if (check !== undefined && !localIds.has(check)) add(issues, `${topicPath}.sections[${index}].checkQuestionId`, `unresolved question reference ${check}`);
    for (const objective of arrayAt(section, 'objectiveIds') ?? []) if (typeof objective !== 'string' || !objectives.has(objective)) add(issues, `${topicPath}.sections[${index}].objectiveIds`, `unknown objective reference ${String(objective)}`);
  }
  const sources = arrayAt(value, 'researchSources') ?? [];
  if (sources.length === 0) add(issues, `${topicPath}.researchSources`, 'must contain source metadata');
  for (const [index, source] of sources.entries()) {
    if (!isRecord(source)) { add(issues, `${topicPath}.researchSources[${index}]`, 'must be an object'); continue; }
    if ((stringAt(source, 'kind') ?? '').trim() === '' || (stringAt(source, 'title') ?? '').trim() === '') add(issues, `${topicPath}.researchSources[${index}]`, 'must contain kind and title');
    const url = stringAt(source, 'url') ?? stringAt(source, 'sourceUrl');
    if (url !== undefined && !/^https?:\/\/[^\s]+$/.test(url)) add(issues, `${topicPath}.researchSources[${index}]`, 'source URL must use HTTP(S)');
  }
  return { ok: issues.length === 0, diagnostics: issues };
}
