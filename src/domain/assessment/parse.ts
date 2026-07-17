import { AssessmentValidationError } from './errors';
import type { AssessmentSet, Choice, DisplayCode, Question } from './types';
type RecordValue = { readonly [key: string]: unknown };
const tracks = ['javascript', 'react', 'nextjs'] as const;
const statuses = ['draft', 'reviewed', 'published', 'retired'] as const;
const reviews = ['pending-human-review', 'approved', 'needs-revision'] as const;
const cognitiveLevels = ['recognize', 'explain', 'predict', 'apply', 'debug', 'tradeoff', 'synthesize', 'transfer'] as const;
const kinds = ['topic-quiz', 'module-review', 'cumulative-review'] as const;
const isRecord = (value: unknown): value is RecordValue => typeof value === 'object' && value !== null && !Array.isArray(value);
const stringAt = (record: RecordValue, key: string, path: string): string => { const value = record[key]; if (typeof value !== 'string' || value.length === 0) throw new AssessmentValidationError(`${path}.${key}`, 'expected non-empty string'); return value; };
const arrayAt = (record: RecordValue, key: string, path: string): readonly unknown[] => { const value = record[key]; if (!Array.isArray(value)) throw new AssessmentValidationError(`${path}.${key}`, 'expected array'); return value; };
const integerAt = (record: RecordValue, key: string, path: string): number => { const value = record[key]; if (typeof value !== 'number' || !Number.isInteger(value)) throw new AssessmentValidationError(`${path}.${key}`, 'expected integer'); return value; };
const oneOf = <T extends string>(value: string, values: readonly T[], path: string): T => { const found = values.find((item) => item === value); if (found === undefined) throw new AssessmentValidationError(path, `unexpected value ${value}`); return found; };
const difficultyAt = (value: number, path: string): Question['difficulty'] => {
  switch (value) { case 1: return 1; case 2: return 2; case 3: return 3; case 4: return 4; case 5: return 5; default: throw new AssessmentValidationError(path, 'must be 1-5'); }
};
const stringsAt = (record: RecordValue, key: string, path: string, minimum: number): readonly string[] => { const values = arrayAt(record, key, path); if (values.length < minimum || values.some((value) => typeof value !== 'string' || value.length === 0)) throw new AssessmentValidationError(`${path}.${key}`, 'expected non-empty strings'); return values.filter((value): value is string => typeof value === 'string'); };
const parseCode = (value: unknown, path: string): DisplayCode => { if (!isRecord(value)) throw new AssessmentValidationError(path, 'expected object'); return { language: stringAt(value, 'language', path), source: stringAt(value, 'source', path) }; };
const parseChoice = (value: unknown, index: number): Choice => { const path = `choices[${index}]`; if (!isRecord(value)) throw new AssessmentValidationError(path, 'expected object'); return { id: stringAt(value, 'id', path), label: stringAt(value, 'label', path), feedback: stringAt(value, 'feedback', path) }; };

export const parseQuestion = (value: unknown): Question => {
  const path = 'question'; if (!isRecord(value)) throw new AssessmentValidationError(path, 'expected object');
  const id = stringAt(value, 'id', path); const prompt = stringAt(value, 'prompt', path);
  if (!/^[A-Z0-9-]+$/.test(id) || prompt.length < 10) throw new AssessmentValidationError(path, 'invalid id or prompt');
  if (stringAt(value, 'kind', path) !== 'single-choice') throw new AssessmentValidationError(`${path}.kind`, 'only single-choice is supported');
  const choices = arrayAt(value, 'choices', path).map(parseChoice); const correct = stringsAt(value, 'correctChoiceIds', path, 1);
  if (choices.length < 3 || choices.length > 6 || new Set(choices.map((choice) => choice.id)).size !== choices.length || correct.length !== 1 || !choices.some((choice) => choice.id === correct[0])) throw new AssessmentValidationError(path, 'invalid choices or correct answer');
  const presentation = value.presentation; if (presentation !== undefined && presentation !== 'text' && presentation !== 'code') throw new AssessmentValidationError(`${path}.presentation`, 'unexpected value');
  const code = value.code === undefined ? undefined : parseCode(value.code, `${path}.code`); if (presentation === 'code' && code === undefined) throw new AssessmentValidationError(`${path}.code`, 'required for code presentation');
  const difficulty = difficultyAt(integerAt(value, 'difficulty', path), `${path}.difficulty`);
  const estimatedSeconds = value.estimatedSeconds === undefined ? undefined : integerAt(value, 'estimatedSeconds', path); if (estimatedSeconds !== undefined && estimatedSeconds < 10) throw new AssessmentValidationError(`${path}.estimatedSeconds`, 'must be at least 10');
  const version = integerAt(value, 'version', path); if (version < 1) throw new AssessmentValidationError(`${path}.version`, 'must be at least 1');
  return { id, trackId: oneOf(stringAt(value, 'trackId', path), tracks, `${path}.trackId`), moduleId: stringAt(value, 'moduleId', path), topicId: stringAt(value, 'topicId', path), objectiveIds: stringsAt(value, 'objectiveIds', path, 1), kind: 'single-choice', ...(presentation === undefined ? {} : { presentation }), prompt, ...(code === undefined ? {} : { code }), choices, correctChoiceIds: [correct[0] ?? ''], explanation: stringAt(value, 'explanation', path), ...(value.hint === undefined ? {} : { hint: stringAt(value, 'hint', path) }), difficulty, cognitiveLevel: oneOf(stringAt(value, 'cognitiveLevel', path), cognitiveLevels, `${path}.cognitiveLevel`), ...(estimatedSeconds === undefined ? {} : { estimatedSeconds }), version, status: oneOf(stringAt(value, 'status', path), statuses, `${path}.status`), reviewStatus: oneOf(stringAt(value, 'reviewStatus', path), reviews, `${path}.reviewStatus`) };
};

export const parseAssessmentSet = (value: unknown): AssessmentSet => {
  const path = 'assessmentSet'; if (!isRecord(value)) throw new AssessmentValidationError(path, 'expected object');
  const kind = oneOf(stringAt(value, 'kind', path), kinds, `${path}.kind`); const questionIds = stringsAt(value, 'questionIds', path, 5);
  if (new Set(questionIds).size !== questionIds.length || value.schemaVersion !== '1.0' || value.masteryThresholdPercent !== 80 || value.attemptPolicy !== 'unlimited') throw new AssessmentValidationError(path, 'invalid fixed contract or question ids');
  const version = integerAt(value, 'version', path); if (version < 1) throw new AssessmentValidationError(`${path}.version`, 'must be at least 1');
  const base = { schemaVersion: '1.0' as const, id: stringAt(value, 'id', path), trackId: oneOf(stringAt(value, 'trackId', path), tracks, `${path}.trackId`), title: stringAt(value, 'title', path), questionIds, masteryThresholdPercent: 80 as const, attemptPolicy: 'unlimited' as const, version, status: oneOf(stringAt(value, 'status', path), statuses, `${path}.status`), reviewStatus: oneOf(stringAt(value, 'reviewStatus', path), reviews, `${path}.reviewStatus`) };
  switch (kind) { case 'topic-quiz': return { ...base, kind: 'topic-quiz', ...(value.moduleId === undefined ? {} : { moduleId: stringAt(value, 'moduleId', path) }) }; case 'module-review': return { ...base, kind: 'module-review', moduleId: stringAt(value, 'moduleId', path) }; case 'cumulative-review': return { ...base, kind: 'cumulative-review' }; default: throw new AssessmentValidationError(`${path}.kind`, 'unsupported kind'); }
};
