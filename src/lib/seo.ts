import type { Metadata } from 'next';

export const siteName = 'JS2Next';
export const siteDescription = 'A connected learning path from JavaScript to React to Next.js, built for durable frontend understanding.';
const defaultSiteUrl = 'https://js2next.vercel.app';

const rawSiteUrl = process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim() || defaultSiteUrl;
export const siteUrl = rawSiteUrl === undefined ? undefined : normalizeSiteUrl(rawSiteUrl);
export const metadataBase = siteUrl === undefined ? undefined : new URL(siteUrl);

export const socialImage = {
  url: '/brand/js2next-logo.png',
  width: 1024,
  height: 1024,
  alt: 'JS2Next: learn JavaScript, React, and Next.js as one connected path',
} as const;

export function absoluteUrl(path: string): string | undefined {
  return siteUrl === undefined ? undefined : new URL(path, siteUrl).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  indexable = true,
}: {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly type?: 'article' | 'website';
  readonly indexable?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url ?? path },
    robots: { index: indexable, follow: true },
    openGraph: {
      title,
      description,
      type,
      ...(url ? { url } : {}),
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage.url],
    },
  };
}

export function noIndexMetadata(path: string): Metadata {
  return pageMetadata({
    title: 'Learning workspace',
    description: 'Personal JS2Next learning workspace.',
    path,
    indexable: false,
  });
}

export function requireSiteUrl(): string {
  if (siteUrl === undefined) throw new Error('SITE_URL must be set before generating production SEO URLs.');
  return siteUrl;
}

function normalizeSiteUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('SITE_URL must use http or https.');
  return url.toString().replace(/\/$/, '');
}
