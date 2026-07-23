import type { MetadataRoute } from 'next';
import { curriculum } from '@/domain/curriculum';
import { requireSiteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = requireSiteUrl();
  const paths = [
    '/',
    '/tracks',
    ...curriculum.tracks.flatMap((track) => [
      `/tracks/${track.slug}`,
    ]),
  ];
  return paths.map((path) => ({ url: new URL(path, baseUrl).toString() }));
}
