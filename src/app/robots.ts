import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/learn/', '/assessments/', '/preview/', '/search', '/home', '/progress', '/review', '/settings', '/onboarding', '/api/', '/auth/'] },
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
