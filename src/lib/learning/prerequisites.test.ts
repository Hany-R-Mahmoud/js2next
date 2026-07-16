import { describe, expect, it } from 'vitest';
import { unmetPrerequisites } from './prerequisites';

describe('lesson prerequisites', () => {
  it('requires every prerequisite to reach 80 percent mastery', () => {
    expect(unmetPrerequisites(['closures', 'components'], {
      closures: { mastery: 0.8 },
      components: { mastery: 0.79 },
    })).toEqual(['components']);
  });

  it('treats missing prerequisites as locked', () => {
    expect(unmetPrerequisites(['closures'], {})).toEqual(['closures']);
    expect(unmetPrerequisites([], {})).toEqual([]);
  });
});
