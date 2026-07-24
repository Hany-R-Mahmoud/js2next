import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const formSource = readFileSync(new URL('./SignInForm.tsx', import.meta.url), 'utf8');
const pageSource = readFileSync(new URL('./page.tsx', import.meta.url), 'utf8');
const moduleSource = readFileSync(new URL('../learn/[track]/[module]/page.tsx', import.meta.url), 'utf8');

describe('authentication flow contracts', () => {
  it('does a full navigation after password sign-in so the server receives the session', () => {
    expect(formSource).toContain('window.location.assign(nextPath)');
    expect(formSource).not.toContain('router.replace(nextPath)');
  });

  it('shows callback failures instead of returning to an unexplained sign-in screen', () => {
    expect(pageSource).toContain('callbackErrors');
    expect(pageSource).toContain('callbackError=');
  });

  it('shows an account-opening action on unauthenticated module catalogs', () => {
    expect(moduleSource).toContain('getMemberAccess');
    expect(moduleSource).toContain('return <ModuleCatalog');
  });
});
