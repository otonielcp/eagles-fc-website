import type { MetadataRoute } from 'next';
import { getVisibleTeams } from '@/lib/publicTeams';
import { getOpenJobs } from '@/actions/careers';
import { getPublishedNews } from '@/actions/news';
import { SITE_URL } from '@/app/(landing)/site-url';

const BASE_URL = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static public pages. Redirect-only stubs (/media, /sponsorship, /ticketing)
  // are left out: a sitemap should list only final, 200-status URLs.
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/teams`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/fixtures`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/results`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/tables`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/club`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/coaches`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/programs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/partners`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/playerinquiries`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/careers/apply`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/cookies`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];

  // Team pages for the teams shown on /teams
  let teamPages: MetadataRoute.Sitemap = [];
  try {
    const teams = await getVisibleTeams();
    teamPages = teams.map((team) => ({
      url: `${BASE_URL}/team/${team.routeId}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // If API fails, just skip dynamic team pages
  }

  // Published news articles (getPublishedNews throws on DB failure, so guard it)
  let newsPages: MetadataRoute.Sitemap = [];
  try {
    const articles = await getPublishedNews();
    newsPages = articles.map((article) => ({
      url: `${BASE_URL}/news/${article._id}`,
      lastModified: new Date(article.updatedAt || article.publishDate || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    // If the database is unreachable, just skip news articles
  }

  // Open job postings (getOpenJobs already returns [] on failure)
  const jobPages: MetadataRoute.Sitemap = (await getOpenJobs()).map((job) => ({
    url: `${BASE_URL}/careers/${job.slug}`,
    lastModified: new Date(job.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...teamPages, ...newsPages, ...jobPages];
}
