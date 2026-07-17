import { describe, expect, it } from 'vitest';
import { curriculum, findModule, findTopic, findTopicById, findTrack, loadCurriculum, prerequisitesFor } from './index.ts';

describe('curriculum runtime contract', () => {
  it('loads the canonical inventory in order', () => {
    expect(curriculum.tracks).toHaveLength(3);
    expect(curriculum.tracks.flatMap((track) => track.modules)).toHaveLength(27);
    expect(curriculum.tracks.flatMap((track) => track.modules).flatMap((module) => module.topics)).toHaveLength(79);
    expect(curriculum.tracks.map((track) => track.id)).toEqual(['javascript', 'react', 'nextjs']);
    expect(curriculum.tracks.map((track) => track.modules.map((module) => module.order))).toEqual(curriculum.tracks.map((track) => Array.from({ length: track.modules.length }, (_, index) => index + 1)));
  });

  it('resolves safe track, module, topic, and prerequisite lookups', () => {
    expect(findTrack('javascript')?.title).toBe('JavaScript');
    expect(findModule('javascript', 'orientation-and-foundations')?.id).toBe('JS-M01');
    expect(findTopic('javascript', 'orientation-and-foundations', 'introduction-to-javascript')?.id).toBe('JS-02');
    expect(findTopicById('missing')).toBeUndefined();
    expect(prerequisitesFor('JS-03').map((edge) => edge.fromTopicId)).toContain('JS-02');
  });

  it('rejects a wrong inventory count', () => {
    const tracks = curriculum.tracks.slice(0, 2);
    expect(() => loadCurriculum({ ...curriculum, tracks })).toThrow('exactly the canonical tracks');
  });
});
