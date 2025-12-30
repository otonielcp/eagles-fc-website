"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getNewsById } from "@/actions/news";
import { News } from "@/types/news";
import EditNewsForm from "@/components/admin/news/EditNewsForm";
import { toast, Toaster } from "sonner";
import { useParams } from "next/navigation";

export default function EditNewsPage() {
  const router = useRouter();
  const params: { id: string } = useParams();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await getNewsById(params.id);
        if (newsData) {
          setNews(newsData);
        } else {
          toast.error("News article not found");
          router.push("/admin/news");
        }
      } catch (error) {
        toast.error("Failed to load news article");
        console.error(error);
        router.push("/admin/news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [params.id, router]);

  const handleCancel = () => {
    router.push("/admin/news");
  };

  const handleNewsUpdated = (updatedNews: News) => {
    setNews(updatedNews);
    router.push("/admin/news");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">News article not found</h3>
        <button
          onClick={() => router.push("/admin/news")}
          className="mt-4 px-4 py-2 bg-[#C5A464] text-white rounded-md hover:bg-[#B39355]"
        >
          Back to News Management
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit News Article</h1>
        <p className="text-muted-foreground">
          Update the details of your news article
        </p>
      </div>
      <EditNewsForm
        news={news}
        onCancel={handleCancel}
        onNewsUpdated={handleNewsUpdated}
      />
      <Toaster position="top-center" richColors />
    </div>
  );
} 