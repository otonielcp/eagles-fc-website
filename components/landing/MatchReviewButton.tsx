'use client';

import Link from "next/link";

interface MatchReviewButtonProps {
  matchId: string;
}

const MatchReviewButton = ({ matchId }: MatchReviewButtonProps) => {
  return (
    <div className="flex justify-center">
      <Link 
        href={`/matchreport/${matchId}`}
        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base md:text-lg uppercase tracking-wider overflow-hidden transition-all duration-300 transform hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #BD9B58 0%, #d4b068 50%, #BD9B58 100%)',
          backgroundSize: '200% 200%',
          boxShadow: '0 8px 30px rgba(189, 155, 88, 0.4), 0 0 0 2px rgba(189, 155, 88, 0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundPosition = '100% 0%';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(189, 155, 88, 0.6), 0 0 0 2px rgba(189, 155, 88, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundPosition = '0% 0%';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(189, 155, 88, 0.4), 0 0 0 2px rgba(189, 155, 88, 0.2)';
        }}
      >
        {/* Shimmer Effect */}
        <span 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
          }}
        />
        
        <span className="relative z-10 flex items-center gap-2">
          <span>Match Review</span>
          <svg 
            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </Link>
    </div>
  );
};

export default MatchReviewButton;




