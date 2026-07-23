'use client';

import Link from 'next/link';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { FormEvent, useRef, useState } from 'react';
import { readSupabaseConfig } from '@/lib/supabase/config';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function SignInForm({ nextPath }: { readonly nextPath: string }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const configured = readSupabaseConfig() !== null && turnstileSiteKey !== undefined && turnstileSiteKey.length > 0;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const result = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          captchaToken: turnstileToken ?? undefined,
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(nextPath)}`,
        },
      });
      if (result.error !== null) throw result.error;
      setMessage('Check your inbox, verify your email, and use the link to start learning.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to send the sign-in link.');
    } finally {
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      setPending(false);
    }
  };

  return <main className="mx-auto flex min-h-[70dvh] w-full max-w-md items-center px-4 py-12"><section className="card w-full space-y-6 p-6 sm:p-8" aria-labelledby="sign-in-title"><div><p className="surface-eyebrow">Open member access</p><h1 id="sign-in-title" className="surface-title mt-2">Continue learning privately.</h1><p className="surface-description mt-2">Use any email address. Verify it to create your account and start learning. No password is stored in this project.</p></div><form className="space-y-4" onSubmit={submit}><label className="block text-sm font-semibold text-ink" htmlFor="member-email">Email address</label><input id="member-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-11 w-full rounded-[10px] border border-ash bg-slate px-4 py-3 text-white placeholder:text-ash focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal" placeholder="you@example.com" />{turnstileSiteKey && <Turnstile ref={turnstileRef} siteKey={turnstileSiteKey} onSuccess={setTurnstileToken} onExpire={() => setTurnstileToken(null)} onError={() => setTurnstileToken(null)} /> }<button className="btn-primary w-full" type="submit" disabled={pending || !configured || turnstileToken === null}>{pending ? 'Sending link…' : 'Create account or sign in'}</button></form>{!configured && <p className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-ink-light" role="alert">Authentication is not configured yet. Set the Supabase public variables and Turnstile site key before enabling member access.</p>}{message && <p className="rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-ink-light" role="status">{message}</p>}{error && <p className="rounded-lg border border-coral/40 bg-coral/10 p-3 text-sm text-ink-light" role="alert">{error}</p>}<Link href="/" className="btn-secondary inline-flex w-full justify-center">Back to JS2Next</Link></section></main>;
}
