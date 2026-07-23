import SignInForm from './SignInForm';
import { noIndexMetadata } from '@/lib/seo';
import { safeNextPath } from '@/lib/security/safe-next-path';

export const metadata = noIndexMetadata('/sign-in');

export default async function SignInPage({ searchParams }: { readonly searchParams: Promise<{ readonly next?: string }> }) {
  const params = await searchParams;
  return <SignInForm nextPath={safeNextPath(params.next ?? null)} />;
}
