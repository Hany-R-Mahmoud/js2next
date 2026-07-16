import type { Level } from '@/types';

const levels: readonly Level[] = ['beginner', 'intermediate', 'advanced', 'expert'];

export function determineDiagnosticLevel(scores: Readonly<Record<Level, number>>): Level {
  return levels.reduce((best, level) => scores[level] > scores[best] ? level : best, 'beginner');
}
