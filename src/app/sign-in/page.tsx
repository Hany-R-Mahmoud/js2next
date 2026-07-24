import SignInForm from './SignInForm';
import { noIndexMetadata } from '@/lib/seo';
import { safeNextPath } from '@/lib/security/safe-next-path';

export const metadata = noIndexMetadata('/sign-in');

const callbackErrors: Readonly<Record<string, string>> = {
  missing_code: 'The verification link was incomplete. Request a new email and open the newest link.',
  invalid_code: 'The verification link expired or was already used. Request a new email and open the newest link.',
  not_configured: 'Authentication is not configured for this deployment.',
};

export default async function SignInPage({ searchParams }: { readonly searchParams: Promise<{ readonly next?: string; readonly error?: string }> }) {
  const params = await searchParams;
  return <SignInForm nextPath={safeNextPath(params.next ?? null)} callbackError={params.error === undefined ? undefined : callbackErrors[params.error] ?? 'Authentication could not be completed. Try again.'} />;
}
