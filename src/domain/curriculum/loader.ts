import runtimeJson from '../../../content/curriculum/curriculum.runtime.json';
import type { Curriculum, Module, PrerequisiteEdge, Subtopic, Topic, Track } from './types.ts';
import { trackIds } from './types.ts';

type RecordValue = Readonly<Record<string, unknown>>;

const isRecord = (value: unknown): value is RecordValue => typeof value === 'object' && value !== null && !Array.isArray(value);
const stringValue = (value: unknown, path: string): string => {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`Invalid curriculum ${path}`);
  return value;
};
const numberValue = (value: unknown, path: string): number => {
  if (typeof value !== 'number' || !Number.isInteger(value)) throw new Error(`Invalid curriculum ${path}`);
  return value;
};
const booleanValue = (value: unknown, path: string): boolean => {
  if (typeof value !== 'boolean') throw new Error(`Invalid curriculum ${path}`);
  return value;
};
const stringArray = (value: unknown, path: string): readonly string[] => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) throw new Error(`Invalid curriculum ${path}`);
  return value;
};
const recordArray = (value: unknown, path: string): readonly RecordValue[] => {
  if (!Array.isArray(value) || value.some((item) => !isRecord(item))) throw new Error(`Invalid curriculum ${path}`);
  return value;
};
const oneOf = <T extends string>(value: unknown, values: readonly T[], path: string): T => {
  if (typeof value !== 'string') throw new Error(`Invalid curriculum ${path}`);
  const match = values.find((item) => item === value);
  if (match === undefined) throw new Error(`Invalid curriculum ${path}`);
  return match;
};

const readSubtopics = (value: unknown, path: string): readonly Subtopic[] => recordArray(value ?? [], path).map((item, index) => ({
  id: stringValue(item.id, `${path}[${index}].id`),
  title: stringValue(item.title, `${path}[${index}].title`),
  order: numberValue(item.order, `${path}[${index}].order`),
}));

const readTopic = (value: RecordValue, path: string): Topic => ({
  id: stringValue(value.id, `${path}.id`),
  slug: stringValue(value.slug, `${path}.slug`),
  title: stringValue(value.title, `${path}.title`),
  order: numberValue(value.order, `${path}.order`),
  required: booleanValue(value.required, `${path}.required`),
  optional: booleanValue(value.optional, `${path}.optional`),
  advanced: booleanValue(value.advanced, `${path}.advanced`),
  contentType: stringValue(value.contentType, `${path}.contentType`),
  estimatedMinutes: numberValue(value.estimatedMinutes, `${path}.estimatedMinutes`),
  difficulty: numberValue(value.difficulty, `${path}.difficulty`),
  requiredPrerequisiteTopicIds: stringArray(value.requiredPrerequisiteTopicIds, `${path}.requiredPrerequisiteTopicIds`),
  recommendedPrerequisiteTopicIds: stringArray(value.recommendedPrerequisiteTopicIds, `${path}.recommendedPrerequisiteTopicIds`),
  packetPath: stringValue(value.packetPath, `${path}.packetPath`),
  markdownPath: stringValue(value.markdownPath, `${path}.markdownPath`),
  status: oneOf(value.status, ['draft', 'reviewed', 'published', 'archived'], `${path}.status`),
  reviewStatus: oneOf(value.reviewStatus, ['pending-human-review', 'approved', 'needs-revision'], `${path}.reviewStatus`),
  subtopics: readSubtopics(value.subtopics, `${path}.subtopics`),
});

const readModule = (value: RecordValue, path: string): Module => ({
  id: stringValue(value.id, `${path}.id`),
  slug: stringValue(value.slug, `${path}.slug`),
  title: stringValue(value.title, `${path}.title`),
  order: numberValue(value.order, `${path}.order`),
  topics: recordArray(value.topics, `${path}.topics`).map((item, index) => readTopic(item, `${path}.topics[${index}]`)),
  requiredTopicIds: stringArray(value.requiredTopicIds, `${path}.requiredTopicIds`),
  optionalTopicIds: stringArray(value.optionalTopicIds, `${path}.optionalTopicIds`),
  assessmentId: stringValue(value.assessmentId, `${path}.assessmentId`),
  masteryThresholdPercent: numberValue(value.masteryThresholdPercent, `${path}.masteryThresholdPercent`),
});

const readTrack = (value: RecordValue, path: string): Track => ({
  id: oneOf(value.id, trackIds, `${path}.id`),
  slug: oneOf(value.slug, trackIds, `${path}.slug`),
  title: stringValue(value.title, `${path}.title`),
  order: numberValue(value.order, `${path}.order`),
  modules: recordArray(value.modules, `${path}.modules`).map((item, index) => readModule(item, `${path}.modules[${index}]`)),
});

const readEdge = (value: RecordValue, path: string): PrerequisiteEdge => ({
  fromTopicId: stringValue(value.fromTopicId, `${path}.fromTopicId`),
  toTopicId: stringValue(value.toTopicId, `${path}.toTopicId`),
  kind: oneOf(value.kind, ['required', 'recommended'], `${path}.kind`),
  policy: stringValue(value.policy, `${path}.policy`),
  masteryThresholdPercent: numberValue(value.masteryThresholdPercent, `${path}.masteryThresholdPercent`),
});

const assertOrdered = (values: readonly { readonly order: number }[], path: string): void => {
  values.forEach((value, index) => {
    if (value.order !== index + 1) throw new Error(`Invalid curriculum order at ${path}[${index}]`);
  });
};

const assertUnique = (values: readonly string[], path: string): void => {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate curriculum ID at ${path}`);
};

export const loadCurriculum = (value: unknown): Curriculum => {
  if (!isRecord(value)) throw new Error('Invalid curriculum root');
  const tracks = recordArray(value.tracks, 'tracks').map((item, index) => readTrack(item, `tracks[${index}]`));
  if (tracks.length !== 3 || tracks.map((track) => track.id).some((id, index) => id !== trackIds[index])) throw new Error('Curriculum must contain exactly the canonical tracks');
  assertOrdered(tracks, 'tracks');
  tracks.forEach((track) => assertOrdered(track.modules, `${track.id}.modules`));
  const modules = tracks.flatMap((track) => track.modules);
  const topics = modules.flatMap((module) => module.topics);
  if (modules.length !== 27 || topics.length !== 79) throw new Error('Curriculum inventory must contain 27 modules and 79 topics');
  assertUnique(modules.map((module) => module.id), 'modules');
  assertUnique(topics.map((topic) => topic.id), 'topics');
  modules.forEach((module) => {
    assertOrdered(module.topics, `${module.id}.topics`);
    assertUnique(module.requiredTopicIds, `${module.id}.requiredTopicIds`);
    assertUnique(module.optionalTopicIds, `${module.id}.optionalTopicIds`);
    if (module.requiredTopicIds.some((id) => !module.topics.some((topic) => topic.id === id)) || module.optionalTopicIds.some((id) => !module.topics.some((topic) => topic.id === id)) || module.requiredTopicIds.some((id) => module.optionalTopicIds.includes(id)) || module.topics.some((topic) => topic.required !== module.requiredTopicIds.includes(topic.id) || topic.optional !== module.optionalTopicIds.includes(topic.id))) throw new Error(`Invalid topic reference in ${module.id}`);
  });
  const topicIds = new Set(topics.map((topic) => topic.id));
  const prerequisiteEdges = recordArray(value.prerequisiteEdges, 'prerequisiteEdges').map((item, index) => readEdge(item, `prerequisiteEdges[${index}]`));
  if (topics.some((topic) => [...topic.requiredPrerequisiteTopicIds, ...topic.recommendedPrerequisiteTopicIds].some((id) => !topicIds.has(id)))) throw new Error('Invalid topic prerequisite reference');
  if (prerequisiteEdges.some((edge) => !topicIds.has(edge.fromTopicId) || !topicIds.has(edge.toTopicId))) throw new Error('Invalid prerequisite edge reference');
  return {
    schemaVersion: stringValue(value.schemaVersion, 'schemaVersion'),
    product: stringValue(value.product, 'product'),
    release: stringValue(value.release, 'release'),
    tracks,
    prerequisiteEdges,
  };
};

export const curriculum = loadCurriculum(runtimeJson);

export const findTrack = (trackId: string): Track | undefined => curriculum.tracks.find((track) => track.slug === trackId);
export const findModule = (trackId: string, moduleSlug: string): Module | undefined => findTrack(trackId)?.modules.find((module) => module.slug === moduleSlug);
export const findTopic = (trackId: string, moduleSlug: string, topicSlug: string): Topic | undefined => findModule(trackId, moduleSlug)?.topics.find((topic) => topic.slug === topicSlug);
export const findTopicById = (topicId: string): Topic | undefined => curriculum.tracks.flatMap((track) => track.modules).flatMap((module) => module.topics).find((topic) => topic.id === topicId);
export const prerequisitesFor = (topicId: string): readonly PrerequisiteEdge[] => curriculum.prerequisiteEdges.filter((edge) => edge.toTopicId === topicId);
export const moduleForTopic = (topicId: string): Module | undefined => curriculum.tracks.flatMap((track) => track.modules).find((module) => module.topics.some((topic) => topic.id === topicId));
