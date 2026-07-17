import { describe, expect, it } from 'vitest';
import { curriculum, findModule, findTopic, findTopicById, findTrack, loadCurriculum } from './index.ts';
import { loadTopicPacket } from './packet.ts';

describe('curriculum loader', () => {
  it('loads the canonical Release 1 inventory', () => {
    const modules = curriculum.tracks.flatMap((track) => track.modules);
    const topics = modules.flatMap((module) => module.topics);

    expect(curriculum.tracks.map((track) => track.id)).toEqual(['javascript', 'react', 'nextjs']);
    expect(curriculum.tracks).toHaveLength(3);
    expect(modules).toHaveLength(27);
    expect(topics).toHaveLength(79);
    expect(new Set(topics.map((topic) => topic.id)).size).toBe(79);
  });

  it('returns undefined for unknown catalog coordinates', () => {
    expect(findTrack('missing')).toBeUndefined();
    expect(findModule('javascript', 'missing')).toBeUndefined();
    expect(findTopic('javascript', 'orientation-and-foundations', 'missing')).toBeUndefined();
    expect(findTopicById('missing')).toBeUndefined();
  });

  it('loads canonical normalized packet content', () => {
    const topic = findTopic('javascript', 'orientation-and-foundations', 'introduction-to-javascript');
    expect(topic).toBeDefined();
    if (topic === undefined) return;

    const packet = loadTopicPacket(topic);
    expect(packet?.id).toBe('JS-02');
    expect(packet?.learningObjectives.length).toBeGreaterThan(0);
    expect(packet?.sections.length).toBeGreaterThan(0);
    expect(packet?.summary.length).toBeGreaterThan(0);
  });

  it('rejects an incomplete canonical inventory', () => {
    const incomplete = { ...curriculum, tracks: curriculum.tracks.slice(0, 2) };
    expect(() => loadCurriculum(incomplete)).toThrow('exactly the canonical tracks');
  });
});
