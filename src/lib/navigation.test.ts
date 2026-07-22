import { describe, expect, it } from 'vitest';
import { isNavigationActive, mobileNavigation, moreNavigation } from '@/lib/navigation';

describe('navigation contract', () => {
  it('exposes the canonical navigation surface', () => {
    expect(mobileNavigation.map((item) => item.label)).toEqual([
      'Home', 'Search', 'Progress', 'More',
    ]);
    expect(moreNavigation.map((item) => item.label)).toEqual(['Tracks', 'Review', 'Settings']);
  });

  it('matches nested routes without activating similar prefixes', () => {
    expect(isNavigationActive('/topic/detail', '/topic')).toBe(true);
    expect(isNavigationActive('/topic/detail', '/home')).toBe(true);
    expect(isNavigationActive('/progress', '/progress')).toBe(true);
    expect(isNavigationActive('/review', '/review')).toBe(true);
    expect(isNavigationActive('/settings', '#more')).toBe(true);
    expect(isNavigationActive('/search', '#more')).toBe(false);
    expect(isNavigationActive('/progressive', '/progress')).toBe(false);
  });
});
