export type NavigationIcon = 'dashboard' | 'book' | 'target' | 'message' | 'star' | 'trend' | 'settings' | 'search' | 'more';

export type NavigationItem = {
  readonly href: string;
  readonly label: string;
  readonly icon: NavigationIcon;
};

export const desktopNavigation = [
  { href: '/home', label: 'Learn', icon: 'book' },
  { href: '/search', label: 'Search', icon: 'search' },
  { href: '/progress', label: 'Progress', icon: 'trend' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
] as const satisfies readonly NavigationItem[];

export const moreNavigation: readonly NavigationItem[] = [];

export const mobileNavigation = [
  { href: '/home', label: 'Home', icon: 'book' },
  { href: '/progress', label: 'Progress', icon: 'trend' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
] as const satisfies readonly NavigationItem[];

export const mobilePrimaryNavigation = mobileNavigation;

export function isNavigationActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
