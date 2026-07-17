import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseMarkdownPacket } from './markdown.ts';
import { isRecord, validatePacket } from './validator.ts';
import type { CompiledContent, ContentDiagnostic, JsonObject, JsonValue } from './types.ts';

const IDENTITY_FIELDS = ['id', 'slug', 'trackId', 'moduleId', 'order', 'title', 'version', 'status', 'reviewStatus', 'publicationStatus'] as const;

function stableJson(value: JsonValue): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (isRecord(value)) {
    const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(',')}}`;
  }
  const encoded = JSON.stringify(value);
  return encoded === undefined ? 'null' : encoded;
}

function filesUnder(root: string, extension: string): readonly string[] {
  const result: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) result.push(...filesUnder(path, extension));
    else if (entry.isFile() && entry.name.endsWith(extension)) result.push(path);
  }
  return result.sort((left, right) => left.localeCompare(right));
}

function valueMatches(frontmatter: unknown, json: JsonValue): boolean {
  if (Array.isArray(frontmatter) && Array.isArray(json)) return frontmatter.length === json.length && frontmatter.every((item, index) => item === json[index]);
  return frontmatter === json;
}

function packetPairDiagnostics(markdownPath: string, jsonPath: string, packet: JsonObject): readonly ContentDiagnostic[] {
  const diagnostics: ContentDiagnostic[] = [];
  try {
    const markdown = parseMarkdownPacket(readFileSync(markdownPath, 'utf8'));
    for (const field of IDENTITY_FIELDS) {
      const frontmatter = markdown.frontmatter[field];
      const json = packet[field];
      if (frontmatter === undefined || json === undefined || !valueMatches(frontmatter, json)) diagnostics.push({ path: `${relative(process.cwd(), markdownPath)}.frontmatter.${field}`, message: `does not match ${relative(process.cwd(), jsonPath)}` });
    }
    const body = markdown.body;
    const requiredMarkers = [String(packet.id ?? ''), String(packet.title ?? '')];
    const objectives = Array.isArray(packet.learningObjectives) ? packet.learningObjectives : [];
    for (const objective of objectives) if (isRecord(objective) && typeof objective.id === 'string') requiredMarkers.push(objective.id);
    const checks = Array.isArray(packet.inLessonQuestionIds) ? packet.inLessonQuestionIds : [];
    for (const check of checks) if (typeof check === 'string') requiredMarkers.push(check);
    for (const marker of requiredMarkers) if (!body.includes(marker)) diagnostics.push({ path: relative(process.cwd(), markdownPath), message: `missing JSON content marker ${marker}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown Markdown parse failure';
    diagnostics.push({ path: relative(process.cwd(), markdownPath), message });
  }
  return diagnostics;
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function validateReferences(packets: readonly JsonObject[], curriculum: unknown, assessments: readonly JsonObject[], issues: ContentDiagnostic[]): void {
  const topicIds = new Set(packets.map((packet) => typeof packet.id === 'string' ? packet.id : ''));
  const questionIds = new Set<string>();
  for (const packet of packets) for (const question of Array.isArray(packet.questions) ? packet.questions : []) if (isRecord(question) && typeof question.id === 'string') questionIds.add(question.id);
  for (const packet of packets) {
    const id = typeof packet.id === 'string' ? packet.id : 'unknown';
    for (const key of ['requiredPrerequisiteTopicIds', 'recommendedPrerequisiteTopicIds']) {
      for (const reference of Array.isArray(packet[key]) ? packet[key] : []) if (typeof reference !== 'string' || !topicIds.has(reference)) issues.push({ path: `packet(${id}).${key}`, message: `unresolved topic reference ${String(reference)}` });
    }
  }
  const assessmentIds = new Set<string>();
  for (const assessment of assessments) {
    const id = typeof assessment.id === 'string' ? assessment.id : 'unknown';
    if (assessmentIds.has(id)) issues.push({ path: 'assessments', message: `duplicate assessment id ${id}` });
    assessmentIds.add(id);
    for (const reference of Array.isArray(assessment.questionIds) ? assessment.questionIds : []) if (typeof reference !== 'string' || !questionIds.has(reference)) issues.push({ path: `assessment(${id}).questionIds`, message: `unresolved question reference ${String(reference)}` });
  }
  if (!isRecord(curriculum)) { issues.push({ path: 'curriculum.runtime.json', message: 'must be a JSON object' }); return; }
  const tracks = Array.isArray(curriculum.tracks) ? curriculum.tracks : [];
  if (tracks.length !== 3) issues.push({ path: 'curriculum.runtime.json.tracks', message: 'must contain exactly 3 tracks' });
  const curriculumTopicIds = new Set<string>();
  let moduleCount = 0;
  for (const track of tracks) {
    if (!isRecord(track)) continue;
    for (const module of Array.isArray(track.modules) ? track.modules : []) {
      if (!isRecord(module)) continue;
      moduleCount += 1;
      for (const topic of Array.isArray(module.topics) ? module.topics : []) if (isRecord(topic) && typeof topic.id === 'string') curriculumTopicIds.add(topic.id);
    }
  }
  if (moduleCount !== 27) issues.push({ path: 'curriculum.runtime.json.tracks', message: 'must contain exactly 27 modules' });
  if (curriculumTopicIds.size !== 79) issues.push({ path: 'curriculum.runtime.json.tracks', message: 'must contain exactly 79 topics' });
  for (const topicId of curriculumTopicIds) if (!topicIds.has(topicId)) issues.push({ path: 'curriculum.runtime.json', message: `curriculum topic ${topicId} has no packet` });
}

export function compileReleaseContent(contentRoot: string, normalizedRoot?: string): CompiledContent {
  const packetRoot = join(contentRoot, 'packets');
  const jsonPaths = filesUnder(packetRoot, '.json');
  const markdownPaths = new Map(filesUnder(packetRoot, '.md').map((path) => [path.replace(/\.md$/, ''), path]));
  const issues: ContentDiagnostic[] = [];
  const packets: JsonObject[] = [];
  const seenQuestionIds = new Set<string>();
  for (const jsonPath of jsonPaths) {
    let value: unknown;
    try { value = readJson(jsonPath); } catch (error) { issues.push({ path: relative(process.cwd(), jsonPath), message: error instanceof Error ? error.message : 'invalid JSON' }); continue; }
    const validation = validatePacket(value, relative(process.cwd(), jsonPath), seenQuestionIds);
    issues.push(...validation.diagnostics);
    if (!isRecord(value)) continue;
    packets.push(value);
    const markdownPath = markdownPaths.get(jsonPath.replace(/\.json$/, ''));
    if (markdownPath === undefined) issues.push({ path: relative(process.cwd(), jsonPath), message: 'matching Markdown packet is missing' });
    else issues.push(...packetPairDiagnostics(markdownPath, jsonPath, value));
  }
  const assessments = filesUnder(join(contentRoot, 'assessment-source'), '.json').filter((path) => !path.endsWith('question-bank.json')).map(readJson).filter(isRecord);
  validateReferences(packets, readJson(join(contentRoot, 'curriculum', 'curriculum.runtime.json')), assessments, issues);
  const normalizedPackets = [...packets].sort((left, right) => String(left.id).localeCompare(String(right.id)));
  if (normalizedRoot !== undefined && issues.length === 0) for (const packet of normalizedPackets) {
    const track = typeof packet.trackId === 'string' ? packet.trackId : 'unknown';
    const id = typeof packet.id === 'string' ? packet.id : 'unknown';
    const output = join(normalizedRoot, track, `${id}.json`);
    mkdirSync(join(normalizedRoot, track), { recursive: true });
    writeFileSync(output, `${stableJson(packet)}\n`, 'utf8');
  }
  return { normalizedPackets, diagnostics: issues };
}
