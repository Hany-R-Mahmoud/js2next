import { describe, expect, it } from 'vitest';
import { determineDiagnosticLevel } from './diagnostic';

describe('diagnostic level selection', () => {
  it('includes the final answer in the level decision', () => {
    expect(determineDiagnosticLevel({ beginner: 0, intermediate: 0, advanced: 0, expert: 1 })).toBe('expert');
  });
});
