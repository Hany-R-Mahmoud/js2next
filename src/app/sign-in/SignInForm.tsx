'use client';

import Link from 'next/link';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { FormEvent, useRef, useState } from 'react';
import { readSupabaseConfig } from '@/lib/supabase/config';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type AuthMode = 'sign-in' | 'sign-up';

export default function SignInForm({ nextPath, callbackError }: { readonly nextPath: string; readonly callbackError?: string }) {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(callbackError ?? null);
  const [pending, setPending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const supabaseConfigured = readSupabaseConfig() !== null;
  const turnstileConfigured = turnstileSiteKey !== undefined && turnstileSiteKey.length > 0;
  const configured = supabaseConfigured && turnstileConfigured;

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setPassword('');
    setMessage(null);
    setError(null);
    setTurnstileToken(null);
    turnstileRef.current?.reset();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const supabase = createSupabaseBrowserClient();
      if (mode === 'sign-up') {
        const result = await supabase.auth.signUp({
          email,
          password,
          options: {
            captchaToken: turnstileToken ?? undefined,
            emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(nextPath)}`,
          },
        });
        if (result.error !== null) throw result.error;
        setMessage('Account created. Check your email, verify your address, then return here to sign in.');
      } else {
        const result = await supabase.auth.signInWithPassword({
          email,
          password,
          options: { captchaToken: turnstileToken ?? undefined },
        });
        if (result.error !== null) throw result.error;
        window.location.assign(nextPath);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to authenticate.');
    } finally {
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      setPending(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[70dvh] w-full max-w-md items-center px-4 py-12">
      <section className="card w-full space-y-6 p-6 sm:p-8" aria-labelledby="sign-in-title">
        <div>
          <p className="surface-eyebrow">Open member access</p>
          <h1 id="sign-in-title" className="surface-title mt-2">{mode === 'sign-up' ? 'Create your account.' : 'Welcome back.'}</h1>
          <p className="surface-description mt-2">
            {mode === 'sign-up' ? 'Create a password, verify your email, and start learning.' : 'Sign in with the email and password you created.'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-semibold text-ink" htmlFor="member-email">Email address</label>
            <input id="member-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-11 w-full rounded-[10px] border border-ash bg-slate px-4 py-3 text-white placeholder:text-ash focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink" htmlFor="member-password">Password</label>
            <input id="member-password" name="password" type="password" autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-11 w-full rounded-[10px] border border-ash bg-slate px-4 py-3 text-white placeholder:text-ash focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal" placeholder="At least 8 characters" />
          </div>
          {turnstileSiteKey && <Turnstile ref={turnstileRef} siteKey={turnstileSiteKey} onSuccess={setTurnstileToken} onExpire={() => setTurnstileToken(null)} onError={() => setTurnstileToken(null)} />}
          <button className="btn-primary w-full" type="submit" disabled={pending || !configured || turnstileToken === null}>
            {pending ? (mode === 'sign-up' ? 'Creating account…' : 'Signing in…') : (mode === 'sign-up' ? 'Create account' : 'Sign in')}
          </button>
        </form>

        {!supabaseConfigured && <p className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-ink-light" role="alert">Authentication is not configured yet. Set the Supabase public variables.</p>}
        {supabaseConfigured && !turnstileConfigured && <p className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-ink-light" role="alert">Authentication protection is not configured yet. Set the Turnstile site key.</p>}
        {message && <p className="rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-ink-light" role="status">{message}</p>}
        {error && <p className="rounded-lg border border-coral/40 bg-coral/10 p-3 text-sm text-ink-light" role="alert">{error}</p>}

        <button type="button" onClick={() => changeMode(mode === 'sign-up' ? 'sign-in' : 'sign-up')} className="inline-flex min-h-11 w-full items-center justify-center text-sm font-semibold text-teal hover:text-ink">
          {mode === 'sign-up' ? 'Already have an account? Sign in' : 'Need an account? Create one'}
        </button>
        <Link href="/" className="btn-secondary inline-flex w-full justify-center">Back to JS2Next</Link>
      </section>
    </main>
  );
}
