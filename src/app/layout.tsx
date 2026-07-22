import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import AppLayout from '@/components/layout/AppLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'JS2Next',
  description: 'A connected learning path from JavaScript to React to Next.js, built for durable frontend understanding.',
  openGraph: {
    title: 'JS2Next',
    description: 'A connected learning path from JavaScript to React to Next.js.',
    type: 'website',
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
