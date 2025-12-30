import { getNewsById } from '@/actions/news';
import EnhancedNewsDetail from '@/components/news/EnhancedNewsDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type NewsDetailPageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await params;
  const news = await getNewsById(id);
  
  if (!news) {
    return {
      title: 'News Not Found | Eagles Football Club',
      description: 'The news article you are looking for does not exist',
    };
  }
  
  return {
    title: `${news.title} | Eagles Football Club`,
    description: news.summary,
    openGraph: {
      images: [news.image],
    },
  };
}

export default async function NewsDetailPage({ params }: any) {
  const { id } = await params;
  const news = await getNewsById(id);
  
  if (!news) {
    notFound();
  }
  
  // Pass the entire news object to the component instead of just the ID
  // This prevents unnecessary duplicate data fetching
  return <EnhancedNewsDetail news={news} />;
}