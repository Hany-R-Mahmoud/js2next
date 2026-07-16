import { describe, expect, it } from 'vitest';
import { lessons } from './lessons';

describe('lesson practice extensions', () => {
  it('gives every published lesson a diagram, retrieval checkpoint, and rubric', () => {
    expect(lessons).toHaveLength(33);
    expect(lessons.every((lesson) => lesson.diagram && lesson.chunks?.length && lesson.miniProject?.rubric?.length)).toBe(true);
  });
});
