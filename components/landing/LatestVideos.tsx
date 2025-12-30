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
      <div className="w-full px-10 md:px-28 py-12 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-[#C5A464] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-10 md:px-28 py-12">
      {/* Header with Accent Line */}
      <div className="mb-6">
        <div className="w-16 h-[3px] bg-[#C5A464] mb-2"></div>
        <h2 className="text-2xl mb-6">LATEST VIDEOS</h2>
      </div>

      {videos.length > 0 ? (
        <>
          {/* Video Grid - First Two Large Videos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {videos.slice(0, 2).map((video, index) => (
              <Link 
                href={video.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                key={video._id} 
                className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer" style={{ backgroundColor: '#181819' }}
              >
                {/* Background Image */}
                <img
                  src={video.thumbnailUrl || fallbackImage}
                  alt={video.title}
                  className="w-full h-[300px] md:h-[400px] object-cover opacity-80"
                />

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black p-6 flex flex-col justify-end">
                  {/* Play Button */}
                  <div className="left-6 z-10">
                    <div className="w-10 h-10 bg-[#C5A464] rounded flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Video Title */}
                  <h3 className="text-white text-xl font-bold">{video.title}</h3>

                  {/* Video Details */}
                  <p className="text-gray-400 text-sm mt-1">
                    {formatTimeDifference(video.createdAt)} | video
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Four Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {videos.slice(2).map((video, index) => (
              <Link 
                href={video.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                key={video._id} 
                className="relative h-[350px] rounded-lg overflow-hidden shadow-lg cursor-pointer" style={{ backgroundColor: '#181819' }}
              >
                {/* Background Image */}
                <img
                  src={video.thumbnailUrl || fallbackImage}
                  alt={video.title}
                  className="w-full h-[200px] md:h-[300px] object-cover opacity-80"
                />
                  
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black p-4 flex flex-col justify-end">
                  {/* Play Button */}
                  <div className="left-6 z-10">
                    <div className="w-10 h-10 bg-[#C5A464] rounded flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Video Title */}
                  <h3 className="text-white text-lg font-bold">{video.title}</h3>

                  {/* Video Details */}
                  <p className="text-gray-400 text-sm mt-1">
                    {formatTimeDifference(video.createdAt)} | video
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No videos available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default LatestVideos;
