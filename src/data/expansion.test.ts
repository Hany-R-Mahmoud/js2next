import { describe, expect, it } from 'vitest';
import { bestPractices } from './best-practices';
import { challenges } from './challenges';
import { qaItems } from './qa';
import { lessons } from './lessons';

describe('curriculum expansion batch', () => {
  it('publishes the sourced P0 modules', () => {
    const expansion = lessons.filter((lesson) => lesson.slug.startsWith('expansion-'));

    expect(expansion.map((lesson) => lesson.slug)).toEqual([
      'expansion-accessible-forms',
      'expansion-runtime-schema-boundaries',
      'expansion-url-state',
      'expansion-browser-failure-debugging',
      'expansion-client-server-state',
      'expansion-performance-diagnosis',
      'expansion-authorization-boundaries',
      'expansion-typescript-react-boundaries',
      'expansion-testing-user-behavior',
      'expansion-production-readiness',
      'expansion-ecosystem-comparisons',
      'expansion-optimistic-mutations',
      'expansion-instrumentation-incident-triage',
    ]);
    expect(expansion.every((lesson) => lesson.metadata.sources.every((source) => source.startsWith('https://')))).toBe(true);
    expect(expansion.every((lesson) => lesson.learningObjectives.length >= 3)).toBe(true);
  });

  it('publishes challenges, knowledge items, and practices for every module', () => {
    expect(challenges.filter((challenge) => challenge.slug.startsWith('expansion-'))).toHaveLength(15);
    expect(qaItems.filter((item) => item.id.startsWith('expansion-'))).toHaveLength(23);
    expect(bestPractices.filter((practice) => practice.id.startsWith('expansion-'))).toHaveLength(14);
  });

  it('keeps the focused recovery topics attached to their canonical owners', () => {
    expect(challenges.map((challenge) => challenge.slug)).toEqual(expect.arrayContaining([
      'expansion-design-route-recovery',
      'expansion-triage-instrumentation-incident',
      'expansion-design-session-refresh-race',
    ]));
    expect(qaItems.map((item) => item.id)).toEqual(expect.arrayContaining([
      'expansion-qa-route-recovery',
      'expansion-qa-instrumentation-triage',
      'expansion-qa-session-refresh-race',
    ]));
  });

  it('keeps every expansion record directly sourced', () => {
    const sources = [
      ...challenges.filter((challenge) => challenge.slug.startsWith('expansion-')).flatMap((challenge) => [challenge.sourceLink, ...(challenge.sourceLinks ?? [])]),
      ...qaItems.filter((item) => item.id.startsWith('expansion-')).flatMap((item) => [item.sourceLink, ...(item.sourceLinks ?? [])]),
      ...bestPractices.filter((practice) => practice.id.startsWith('expansion-')).flatMap((practice) => [practice.sourceLink, ...(practice.sourceLinks ?? [])]),
    ];

    expect(sources.every((source) => source?.startsWith('https://'))).toBe(true);
  });

  it('publishes richer learning extensions for applied modules', () => {
    const richer = lessons.filter((lesson) => ['expansion-testing-user-behavior', 'expansion-production-readiness'].includes(lesson.slug));
    expect(richer).toHaveLength(2);
    expect(richer.every((lesson) => lesson.diagram && lesson.chunks?.length && lesson.miniProject?.rubric?.length)).toBe(true);
  });
});
