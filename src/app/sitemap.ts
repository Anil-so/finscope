import { MetadataRoute } from 'next';
import { INITIAL_COMPANIES } from '@/lib/data/initialCompanies';
import { METRIC_SLUG_MAP } from '@/types/sec';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://finscope.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const companyRoutes: MetadataRoute.Sitemap = [];
  const metricRoutes: MetadataRoute.Sitemap = [];
  const metricSlugs = Object.keys(METRIC_SLUG_MAP);

  for (const c of INITIAL_COMPANIES) {
    const tickerLower = c.ticker.toLowerCase();
    companyRoutes.push({
      url: `${baseUrl}/company/${tickerLower}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    for (const slug of metricSlugs) {
      metricRoutes.push({
        url: `${baseUrl}/company/${tickerLower}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return [...staticRoutes, ...companyRoutes, ...metricRoutes];
}
