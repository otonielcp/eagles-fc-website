import { cache } from 'react';
import { getNewsById } from '@/actions/news';
import EnhancedNewsDetail from '@/components/news/EnhancedNewsDetail';
import { toPlainText, truncateText } from '@/components/news/plainText';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type NewsDetailPageProps = {
  params: Promise<{ id: string }>;
};

// generateMetadata and the page both need the article; fetch it once per request.
const getArticle = cache((id: string) => getNewsById(id));

const FALLBACK_IMAGE = '/LOGO%20(2).png';

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const news = await getArticle(id);

  if (!news) {
    return {
      title: 'News Not Found',
      description: 'The news article you are looking for does not exist',
    };
  }

  // The root layout's title template appends the site name.
  const description = truncateText(toPlainText(news.summary), 200);
  const images = [news.image || FALLBACK_IMAGE];
  const url = `/news/${news._id}`;

  return {
    title: news.title,
    description,
    openGraph: {
      type: 'article',
      title: news.title,
      description,
      url,
      siteName: 'Eagles FC',
      images,
      publishedTime: news.publishDate,
      modifiedTime: news.updatedAt,
      ...(news.author ? { authors: [news.author] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description,
      images,
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  // getNewsById returns null for unknown/invalid ids (and unpublished articles
  // for non-admins), which renders news/[id]/not-found.tsx.
  const news = await getArticle(id);

  if (!news) {
    notFound();
  }

  // Pass the entire news object to the component instead of just the ID
  // This prevents unnecessary duplicate data fetching
  return <EnhancedNewsDetail news={news} />;
}
