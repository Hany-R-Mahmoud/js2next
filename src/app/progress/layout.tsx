import { noIndexMetadata } from '@/lib/seo';
import { requireWorkspaceAccess } from '@/lib/security/route-access';

export const metadata = noIndexMetadata('/progress');

export default async function ProgressLayout({ children }: { readonly children: React.ReactNode }) {
  await requireWorkspaceAccess();
  return children;
}
