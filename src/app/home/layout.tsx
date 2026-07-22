import { noIndexMetadata } from '@/lib/seo';

export const metadata = noIndexMetadata('/home');

export default function HomeLayout({ children }: { readonly children: React.ReactNode }) {
  return children;
}
