import { noIndexMetadata } from '@/lib/seo';

export const metadata = noIndexMetadata('/onboarding');

export default function OnboardingLayout({ children }: { readonly children: React.ReactNode }) {
  return children;
}
