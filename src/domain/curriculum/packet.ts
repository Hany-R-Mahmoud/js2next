import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Topic } from './types.ts';

export interface LearningObjective {
  readonly id: string;
  readonly subtopic: string;
  readonly text: string;
  readonly cognitiveLevel: string;
}

export interface ConceptSection {
  readonly type: 'concept';
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly checkQuestionId?: string;
}

export interface CodeExampleSection {
  readonly type: 'code-example';
  readonly id: string;
  readonly title: string;
  readonly source: string;
  readonly language: string;
  readonly explanation?: string;
}

export type PacketSection = ConceptSection | CodeExampleSection;

export interface TopicPacket {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly whyThisMatters: string;
  readonly learningObjectives: readonly LearningObjective[];
  readonly mentalModel: string;
  readonly sections: readonly PacketSection[];
  readonly commonMistakes: readonly string[];
  readonly summary: readonly string[];
  readonly status: 'draft' | 'reviewed' | 'published' | 'archived';
  readonly reviewStatus: 'pending-human-review' | 'approved' | 'needs-revision';
}

type UnknownRecord = Readonly<Record<string, unknown>>;
const isRecord = (value: unknown): value is UnknownRecord => typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown, path: string): string => {
  if (typeof value !== 'string') throw new Error(`Invalid packet ${path}`);
  return value;
};
const texts = (value: unknown, path: string): readonly string[] => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) throw new Error(`Invalid packet ${path}`);
  return value;
};
const records = (value: unknown, path: string): readonly UnknownRecord[] => {
  if (!Array.isArray(value) || value.some((item) => !isRecord(item))) throw new Error(`Invalid packet ${path}`);
  return value;
};
const optionalText = (value: unknown): string | undefined => typeof value === 'string' ? value : undefined;

const oneOf = <T extends string>(value: unknown, values: readonly T[], path: string): T => {
  if (typeof value !== 'string') throw new Error(`Invalid packet ${path}`);
  const match = values.find((item) => item === value);
  if (match === undefined) throw new Error(`Invalid packet ${path}`);
  return match;
};

export const parseTopicPacket = (value: unknown): TopicPacket => {
  if (!isRecord(value)) throw new Error('Invalid packet root');
  const objectives = records(value.learningObjectives, 'learningObjectives').map((item, index) => ({
    id: text(item.id, `learningObjectives[${index}].id`),
    subtopic: text(item.subtopic, `learningObjectives[${index}].subtopic`),
    text: text(item.text, `learningObjectives[${index}].text`),
    cognitiveLevel: text(item.cognitiveLevel, `learningObjectives[${index}].cognitiveLevel`),
  }));
  const sections = records(value.sections, 'sections').map((item, index): PacketSection => {
    const type = text(item.type, `sections[${index}].type`);
    if (type === 'concept') return { type, id: text(item.id, `sections[${index}].id`), title: text(item.title, `sections[${index}].title`), body: text(item.body, `sections[${index}].body`), ...(optionalText(item.checkQuestionId) ? { checkQuestionId: optionalText(item.checkQuestionId) } : {}) };
    if (type === 'code-example') return { type, id: text(item.id, `sections[${index}].id`), title: text(item.title, `sections[${index}].title`), source: text(item.source, `sections[${index}].source`), language: text(item.language, `sections[${index}].language`), ...(optionalText(item.explanation) ? { explanation: optionalText(item.explanation) } : {}) };
    throw new Error(`Invalid packet sections[${index}].type`);
  });
  return {
    id: text(value.id, 'id'),
    slug: text(value.slug, 'slug'),
    title: text(value.title, 'title'),
    whyThisMatters: text(value.whyThisMatters, 'whyThisMatters'),
    learningObjectives: objectives,
    mentalModel: text(value.mentalModel, 'mentalModel'),
    sections,
    commonMistakes: texts(value.commonMistakes, 'commonMistakes'),
    summary: texts(value.summary, 'summary'),
    status: oneOf(value.status, ['draft', 'reviewed', 'published', 'archived'], 'status'),
    reviewStatus: oneOf(value.reviewStatus, ['pending-human-review', 'approved', 'needs-revision'], 'reviewStatus'),
  };
};

const contentRoot = join(process.cwd(), 'content', 'normalized');
const packetFiles = (track: string): readonly string[] => readdirSync(join(contentRoot, track)).filter((file) => file.endsWith('.json'));
const packetForTopic = (topic: Topic): unknown => {
  const track = topic.id.startsWith('JS-') ? 'javascript' : topic.id.startsWith('R-') ? 'react' : 'nextjs';
  const path = packetFiles(track).find((file) => file.startsWith(topic.id));
  return path === undefined ? undefined : JSON.parse(readFileSync(join(contentRoot, track, path), 'utf8'));
};

export const loadTopicPacket = (topic: Topic): TopicPacket | undefined => {
  const value = packetForTopic(topic);
  return value === undefined ? undefined : parseTopicPacket(value);
};
