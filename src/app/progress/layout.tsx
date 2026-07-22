import { noIndexMetadata } from '@/lib/seo';

export const metadata = noIndexMetadata('/progress');

export default function ProgressLayout({ children }: { readonly children: React.ReactNode }) {
  return children;
}
