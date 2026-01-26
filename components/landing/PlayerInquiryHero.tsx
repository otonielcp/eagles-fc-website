'use client';

import { useEffect, useState } from 'react';

export default function PlayerInquiryHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full bg-black py-20 md:py-28">
      {/* Top gold accent line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent"></div>
      
      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Eyebrow */}
        <div className={`flex items-center gap-4 mb-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
          <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">Join The Eagles</span>
        </div>
        
        {/* Main headline */}
        <h1 className={`text-7xl md:text-8xl lg:text-9xl font-bebas font-black uppercase tracking-wider leading-none transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="block text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">PLAYER</span>
          <span className="block bg-gradient-to-r from-[#BD9B58] via-[#D4AF37] to-[#BD9B58] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(189,155,88,0.6)]">REGISTRATION</span>
        </h1>

        {/* Description */}
        <p className={`text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mt-6 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Ready to take your game to the next level? Register your interest in joining <span className="text-white font-bold">Eagles FC</span> and become part of Nebraska's premier soccer club.
        </p>
      </div>

      {/* Bottom gold accent line */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent"></div>
    </div>
  );
}
