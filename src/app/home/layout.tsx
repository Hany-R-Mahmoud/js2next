import { noIndexMetadata } from '@/lib/seo';
import { requireWorkspaceAccess } from '@/lib/security/route-access';

export const metadata = noIndexMetadata('/home');

export default async function HomeLayout({ children }: { readonly children: React.ReactNode }) {
  await requireWorkspaceAccess();
  return children;
}
