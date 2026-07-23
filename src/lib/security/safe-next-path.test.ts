import { describe, expect, it } from 'vitest';
import { safeNextPath } from './safe-next-path';

describe('safe next paths', () => {
  it('keeps navigation on the application origin', () => {
    expect(safeNextPath('/learn/javascript')).toBe('/learn/javascript');
    expect(safeNextPath('/\\evil.com')).toBe('/home');
    expect(safeNextPath('//evil.com')).toBe('/home');
    expect(safeNextPath('https://evil.com')).toBe('/home');
  });
});
