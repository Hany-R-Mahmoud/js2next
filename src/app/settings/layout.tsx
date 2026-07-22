import { noIndexMetadata } from '@/lib/seo';

export const metadata = noIndexMetadata('/settings');

export default function SettingsLayout({ children }: { readonly children: React.ReactNode }) {
  return children;
}
