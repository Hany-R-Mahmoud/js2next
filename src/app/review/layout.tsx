import { noIndexMetadata } from '@/lib/seo';

export const metadata = noIndexMetadata('/review');

export default function ReviewLayout({ children }: { readonly children: React.ReactNode }) {
  return children;
}
