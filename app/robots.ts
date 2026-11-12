import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/app/(landing)/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/cart', '/checkout'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
