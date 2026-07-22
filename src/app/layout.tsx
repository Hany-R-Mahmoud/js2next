import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import AppLayout from '@/components/layout/AppLayout';
import { absoluteUrl, metadataBase, siteDescription, siteName, socialImage } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: 'Learn JavaScript, React, and Next.js | JS2Next',
    template: '%s | JS2Next',
  },
  description: siteDescription,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Learn JavaScript, React, and Next.js',
    description: siteDescription,
    siteName,
    type: 'website',
    url: absoluteUrl('/') ?? '/',
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn JavaScript, React, and Next.js',
    description: siteDescription,
    images: [socialImage.url],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
        <Analytics />
      </body>
    </html>
  );
}
