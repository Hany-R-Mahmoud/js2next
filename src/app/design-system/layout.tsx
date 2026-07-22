import { noIndexMetadata } from '@/lib/seo';

export const metadata = noIndexMetadata('/design-system');

export default function DesignSystemLayout({ children }: { readonly children: React.ReactNode }) {
  return children;
}
