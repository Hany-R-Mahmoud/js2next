import type { Metadata } from 'next';
import AppLayout from '@/components/layout/AppLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Learn React & Next.js',
  description: 'Interactive lessons, challenges, and best practices for mastering React and Next.js. Built for frontend developers who want durable understanding.',
  openGraph: {
    title: 'Learn React & Next.js',
    description: 'Interactive lessons, challenges, and best practices for mastering React and Next.js.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
