import { noIndexMetadata } from '@/lib/seo';
import { requireWorkspaceAccess } from '@/lib/security/route-access';

export const metadata = noIndexMetadata('/onboarding');

export default async function OnboardingLayout({ children }: { readonly children: React.ReactNode }) {
  await requireWorkspaceAccess();
  return children;
}
