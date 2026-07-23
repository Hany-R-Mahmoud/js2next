import { noIndexMetadata } from '@/lib/seo';
import { requireWorkspaceAccess } from '@/lib/security/route-access';

export const metadata = noIndexMetadata('/settings');

export default async function SettingsLayout({ children }: { readonly children: React.ReactNode }) {
  await requireWorkspaceAccess();
  return children;
}
