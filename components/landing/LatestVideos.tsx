'use client';

import { useState, useEffect } from 'react';
import { getLatestVideos } from '@/actions/video';
import { Video } from '@/types/video';
import Link from 'next/link';

// Fallback image for videos without thumbnails
const fallbackImage = "/footerimage.jpeg";

const LatestVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const latestVideos = await getLatestVideos(6);
        setVideos(latestVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Function to format the time difference
  const formatTimeDifference = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w`;
    return `${Math.floor(diffInSeconds / 2592000)}mo`;
  };

  if (loading) {
    return (
      <div className="w-full px-4 md:px-6 lg:px-8 py-12 bg-gray-50 flex justify-center items-center">
        <div className="w-12 h-12 border-t-2 border-b-2 border-[#BD9B58] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-20 bg-white">
      {/* Section Title - Premium Style */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
          <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">Watch Now</span>
        </div>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas font-black text-black uppercase tracking-wider mb-4">
          LATEST <span className="text-[#BD9B58]">VIDEOS</span>
        </h2>
        <p className="text-gray-700 text-lg">Catch up on our latest highlights and content</p>
      </div>

      {videos.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          {/* Video Grid - First Two Large Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {videos.slice(0, 2).map((video) => (
              <Link
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                key={video._id}
                className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-black"
              >
                {/* Background Image */}
                <img
                  src={video.thumbnailUrl || fallbackImage}
                  alt={video.title}
                  className="w-full h-[350px] md:h-[450px] object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Top gold accent line */}
                <div className="absolute top-0 left-0 w-0 h-[3px] bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] transition-all duration-500 group-hover:w-full z-20"></div>

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 flex flex-col justify-end">
                  {/* Play Button */}
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-[#BD9B58] group-hover:bg-[#D4AF37] flex items-center justify-center transition-all duration-300 shadow-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Video Title */}
                  <h3 className="text-white text-2xl md:text-3xl font-bebas font-black uppercase leading-tight tracking-wider mb-3">{video.title}</h3>

                  {/* Video Details */}
                  <p className="text-white/80 text-sm font-semibold uppercase tracking-wide">
                    {formatTimeDifference(video.createdAt)} ago
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#BD9B58] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
              </Link>
            ))}
          </div>

          {/* Bottom Videos - 3 Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.slice(2).map((video) => (
              <Link
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                key={video._id}
                className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-black"
              >
                {/* Top gold accent bar */}
                <div className="h-1 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] w-0 group-hover:w-full transition-all duration-500"></div>

                {/* Background Image */}
                <img
                  src={video.thumbnailUrl || fallbackImage}
                  alt={video.title}
                  className="w-full h-[280px] object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end">
                  {/* Play Button */}
                  <div className="mb-3">
                    <div className="w-12 h-12 bg-[#BD9B58] group-hover:bg-[#D4AF37] flex items-center justify-center transition-all duration-300 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-0.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Video Title */}
                  <h3 className="text-white text-lg font-bebas font-bold uppercase leading-tight tracking-wider line-clamp-2 mb-2">{video.title}</h3>

                  {/* Video Details */}
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-wide">
                    {formatTimeDifference(video.createdAt)} ago
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-[#BD9B58] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600">No videos available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default LatestVideos;
