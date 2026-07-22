import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const topicSource = readFileSync(new URL('./TopicStageTabs.tsx', import.meta.url), 'utf8');
const moduleSource = readFileSync(new URL('./ModuleStageTabs.tsx', import.meta.url), 'utf8');
const sharedSource = readFileSync(new URL('../shared/StageTabs.tsx', import.meta.url), 'utf8');
const assessmentSource = readFileSync(new URL('../assessment/assessment-view.tsx', import.meta.url), 'utf8');

describe('learning flow contracts', () => {
  it('names topic and module stages with explicit actions', () => {
    expect(topicSource).not.toContain("id: 'overview'");
    expect(topicSource).toContain("label: 'Practice'");
    expect(topicSource).toContain("label: 'Check'");
    expect(moduleSource).not.toContain("id: 'overview'");
    expect(moduleSource).toContain("label: 'Practice'");
    expect(moduleSource).toContain("label: 'Check'");
  });

  it('renders lock reasons and complete tab-to-panel relationships', () => {
    expect(sharedSource).toContain('lockReason');
    expect(sharedSource).toContain('aria-controls={`stage-panel-${item.id}`}');
  });

  it('keeps module stage reset inputs stable across tab clicks', () => {
    expect(moduleSource).toContain('useMemo(() => module.topics.filter((topic) => topic.required), [module.topics])');
    expect(sharedSource).toContain("wideColumns === 0 ? 4");
  });

  it('uses a responsive code-question layout and question count', () => {
    expect(assessmentSource).toContain('lg:grid-cols-2');
    expect(assessmentSource).toContain('Question {index + 1} of {total}');
  });
});
