import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { assessmentProfileLabel, parseQuestionBank } from './index';

describe('assessment practicality v2 contract', () => {
  it('loads exactly 632 unique v2 questions from the active bank', () => {
    const bank = JSON.parse(readFileSync('content/assessment-source/question-bank.json', 'utf8')) as unknown;
    const questions = parseQuestionBank(bank);
    expect(questions).toHaveLength(632);
    expect(new Set(questions.map((question) => question.id)).size).toBe(632);
    expect(questions.every((question) => question.version === 2 && question.choices.length === 4 && question.status === 'draft' && question.reviewStatus === 'pending-human-review')).toBe(true);
  });

  it('keeps code questions as display data and uses the shared code-block surface', () => {
    const source = readFileSync('src/components/assessment/assessment-view.tsx', 'utf8');
    expect(source).toContain("import CodeBlock from '@/components/shared/CodeBlock'");
    expect(source).toContain('<CodeBlock code={question.code.source}');
    expect(source).not.toContain('<pre className="overflow-x-auto rounded-lg bg-code-bg');
  });

  it('exposes the four supplied profile-specific labels', () => {
    expect(assessmentProfileLabel('conceptual')).toBe('Conceptual and mental-model review');
    expect(assessmentProfileLabel('workflow')).toBe('Developer workflow and decision scenarios');
    expect(assessmentProfileLabel('hybrid')).toBe('Mental model plus practical code reasoning');
    expect(assessmentProfileLabel('coding')).toBe('Code-reading, debugging, and implementation challenge');
  });
});
