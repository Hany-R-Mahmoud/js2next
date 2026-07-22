import type { MetadataRoute } from 'next';
import { curriculum } from '@/domain/curriculum';
import { loadTopicPacket } from '@/domain/curriculum/packet';
import { requireSiteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = requireSiteUrl();
  const paths = [
    '/',
    '/tracks',
    ...curriculum.tracks.flatMap((track) => [
      `/tracks/${track.slug}`,
      ...track.modules.flatMap((module) => [
        `/learn/${track.slug}/${module.slug}`,
        ...module.topics
          .filter((topic) => topic.status !== 'archived' && loadTopicPacket(topic) !== undefined)
          .map((topic) => `/learn/${track.slug}/${module.slug}/${topic.slug}`),
      ]),
    ]),
  ];
  return paths.map((path) => ({ url: new URL(path, baseUrl).toString() }));
}
