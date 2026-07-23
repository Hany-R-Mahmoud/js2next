import { noIndexMetadata } from '@/lib/seo';
import { requireWorkspaceAccess } from '@/lib/security/route-access';

export const metadata = noIndexMetadata('/review');

export default async function ReviewLayout({ children }: { readonly children: React.ReactNode }) {
  await requireWorkspaceAccess();
  return children;
}
