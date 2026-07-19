'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLearnerStore } from '@/stores/learner';
import { useSettingsStore } from '@/stores/settings';
import { desktopNavigation, isNavigationActive, mobilePrimaryNavigation, type NavigationIcon } from '@/lib/navigation';
import { useEffect } from 'react';

type NavIconName = NavigationIcon;

const navIconPaths: Readonly<Record<NavIconName, readonly string[]>> = {
  dashboard: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'],
  book: ['M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z', 'M4 5.5v15', 'M8 7h8', 'M8 11h8'],
  target: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'],
  message: ['M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3.3-.6L4 20l1.6-3.7A7.2 7.2 0 0 1 4.5 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5z'],
  star: ['m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z'],
  trend: ['M4 19V5', 'M4 19h16', 'm7 15 3-4 3 2 5-7', 'M18 6h-4', 'M18 6v4'],
  settings: ['M12 3v2', 'M12 19v2', 'm5.6 5.6 1.4 1.4', 'm17 17 1.4 1.4', 'M3 12h2', 'M19 12h2', 'm5.6 18.4 1.4-1.4', 'm17 7 1.4-1.4', 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  search: ['M21 21l-4.3-4.3', 'M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z'],
  more: ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'],
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { canonicalProfile } = useLearnerStore();
  const { reducedMotion, highContrast, fontSize } = useSettingsStore();

  useEffect(() => {
    document.documentElement.dataset.contrast = highContrast ? 'high' : 'normal';
    document.documentElement.dataset.fontSize = fontSize;
    return () => {
      delete document.documentElement.dataset.contrast;
      delete document.documentElement.dataset.fontSize;
    };
  }, [fontSize, highContrast]);

  if (pathname === '/' || pathname === '/onboarding') {
    return (
      <div className={reducedMotion ? 'reduced-motion' : ''}>
        {children}
      </div>
    );
  }

  return (
    <div className={reducedMotion ? 'reduced-motion' : ''}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-cloud focus:px-4 focus:py-2 focus:text-black focus:shadow-md"
      >
        Skip to content
      </a>
      <div className="fixed inset-0 flex min-w-0 flex-col overflow-hidden lg:flex-row">
        <aside
          className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:max-w-none lg:flex-col lg:overflow-y-auto lg:border-r lg:border-slate-secondary lg:bg-midnight"
        >
          <div className="p-6 border-b border-slate-secondary">
            <Link href="/home" className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              JS2Next
            </Link>
            {canonicalProfile.diagnosticDone && (
              <p className="text-sm text-ash mt-1">
                {canonicalProfile.level.charAt(0).toUpperCase() + canonicalProfile.level.slice(1)} path
              </p>
            )}
            <p className={`mt-2 text-sm font-semibold ${canonicalProfile.streakDays > 0 ? 'text-lime-badge' : 'text-ink-muted'}`}>Streak · {canonicalProfile.streakDays} day{canonicalProfile.streakDays === 1 ? '' : 's'}</p>
          </div>

          <nav className="flex flex-1 flex-col space-y-1 p-4" role="navigation" aria-label="Main navigation">
            {desktopNavigation.map((item) => {
              const isActive = isNavigationActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link nav-item flex items-center gap-3 ${isActive ? 'nav-item-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-secondary">
            <Link
              href="/home"
              className="inline-flex min-h-11 items-center text-sm text-ash transition-colors hover:text-white"
            >
              Back to Home
            </Link>
          </div>
        </aside>

        <div className="relative z-40 flex h-14 shrink-0 items-center justify-center bg-midnight px-4 lg:hidden">
          <p className={`text-sm font-semibold ${canonicalProfile.streakDays > 0 ? 'text-lime-badge' : 'text-ink-muted'}`}>
            Streak · {canonicalProfile.streakDays} day{canonicalProfile.streakDays === 1 ? '' : 's'}
          </p>
        </div>

        <div id="main-content" className="app-main-scroll mx-auto min-h-0 w-full max-w-5xl flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-6 lg:p-8">
          {children}
        </div>

        <nav className="mobile-bottom-nav relative z-50 flex shrink-0 items-center gap-1 border-t border-slate-secondary bg-midnight px-2 pt-2 lg:hidden" aria-label="Primary navigation">
          {mobilePrimaryNavigation.map((item) => {
            const isActive = isNavigationActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-bottom-nav-item nav-item ${isActive ? 'nav-item-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function NavIcon({ name }: { readonly name: NavIconName }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {navIconPaths[name].map((path) => <path key={path} d={path} />)}
    </svg>
  );
}
