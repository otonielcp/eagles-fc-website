"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUpcomingMatches } from "@/actions/fixture";
import { IFixture } from "@/types/fixtures";
import Link from "next/link";
import gsap from "gsap";

// Three.js Animated Background Component
const ThreeJSBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 600;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(189, 155, 88, ${particle.opacity})`;
        ctx.fill();

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });

      // Draw connections
      particles.forEach((particle1, i) => {
        particles.slice(i + 1).forEach(particle2 => {
          const dx = particle1.x - particle2.x;
          const dy = particle1.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(189, 155, 88, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

// Date formatting helper function
const formatDate = (dateString: string) => {
  // Parse date without timezone issues
  const date = new Date(dateString + 'T00:00:00');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName}, ${monthName} ${dayNum}, ${year}`;
};

// Time formatting helper function (with AM/PM)
const formatTime = (timeString: string) => {
  if (!timeString) return '';
  
  // If time already contains AM/PM, clean it up
  if (timeString.includes('AM') || timeString.includes('PM')) {
    const cleanTime = timeString.replace(/\s+/g, ' ').trim();
    const parts = cleanTime.split(' ');
    if (parts.length >= 2) {
      const timePart = parts[0];
      const ampmPart = parts[parts.length - 1];
      const [hours, minutes] = timePart.split(':');
      const hour = parseInt(hours);
      return `${hour}:${minutes} ${ampmPart}`;
    }
    return cleanTime;
  }
  
  // Split the time string (assuming format like "17:00" or "05:00")
  const [hours, minutes] = timeString.split(':');
  const hour24 = parseInt(hours);
  
  // Convert to 12-hour format with AM/PM
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  
  return `${hour12}:${minutes} ${ampm}`;
};

// Time formatting helper function (without AM/PM for score box)
const formatTimeShort = (timeString: string) => {
  if (!timeString) return '';
  
  // If time already contains AM/PM, remove it
  if (timeString.includes('AM') || timeString.includes('PM')) {
    const cleanTime = timeString.replace(/\s+/g, ' ').trim();
    const parts = cleanTime.split(' ');
    const timePart = parts[0];
    const [hours, minutes] = timePart.split(':');
    const hour = parseInt(hours);
    return `${hour}:${minutes}`;
  }
  
  // Split the time string (assuming format like "17:00" or "05:00")
  const [hours, minutes] = timeString.split(':');
  const hour24 = parseInt(hours);
  
  // Convert to 12-hour format without AM/PM
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  
  return `${hour12}:${minutes}`;
};

const Matches: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [matches, setMatches] = useState<IFixture[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      const matches = await getUpcomingMatches();
      setMatches(matches);
    };
    fetchMatches();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (matches.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, matches.length - getVisibleSlides());
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [matches.length]);

  // GSAP Animation on mount
  useEffect(() => {
    if (titleRef.current && containerRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power3.out"
      });

      gsap.from(containerRef.current.querySelectorAll('.match-card'), {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3
      });
    }
  }, [matches]);

  // Number of slides to show based on screen width
  const getVisibleSlides = (): number => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1400) return 4;
      if (width >= 1024) return 3;
      if (width >= 768) return 2;
      return 1;
    }
    return 4;
  };

  // Initialize with default to avoid hydration mismatch
  const [visibleSlides, setVisibleSlides] = useState<number>(4);

  React.useEffect(() => {
    // Set initial value on client side only
    setVisibleSlides(getVisibleSlides());
    
    const handleResize = () => {
      setVisibleSlides(getVisibleSlides());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = matches.length;
  const maxIndex = Math.max(0, totalSlides - visibleSlides);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <div className="w-full bg-white pb-20 pt-24 relative overflow-hidden">
      {/* Stadium drawing background */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ opacity: 0.12 }}>
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1200 800" 
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stadium structure */}
          <g stroke="#BD9B58" strokeWidth="4" fill="none" strokeOpacity="0.6">
            {/* Main field outline */}
            <rect x="150" y="250" width="900" height="300" rx="15" />
            
            {/* Center circle */}
            <circle cx="600" cy="400" r="70" />
            <line x1="600" y1="250" x2="600" y2="550" />
            
            {/* Penalty boxes */}
            <rect x="150" y="310" width="160" height="180" rx="8" />
            <rect x="890" y="310" width="160" height="180" rx="8" />
            
            {/* Goal areas */}
            <rect x="150" y="360" width="50" height="80" rx="4" />
            <rect x="1000" y="360" width="50" height="80" rx="4" />
            
            {/* Stadium stands - top */}
            <path d="M 100 200 Q 100 150 150 130 Q 250 110 350 120 Q 450 130 550 140 Q 650 150 750 145 Q 850 135 950 125 Q 1050 115 1100 120 Q 1150 125 1150 200" />
            <line x1="100" y1="200" x2="100" y2="250" />
            <line x1="1150" y1="200" x2="1150" y2="250" />
            
            {/* Stadium stands - bottom */}
            <path d="M 100 600 Q 100 650 150 670 Q 250 690 350 680 Q 450 670 550 660 Q 650 650 750 655 Q 850 665 950 675 Q 1050 685 1100 680 Q 1150 675 1150 600" />
            <line x1="100" y1="600" x2="100" y2="550" />
            <line x1="1150" y1="600" x2="1150" y2="550" />
            
            {/* Stands vertical supports */}
            <line x1="150" y1="130" x2="150" y2="250" />
            <line x1="350" y1="120" x2="350" y2="250" />
            <line x1="550" y1="140" x2="550" y2="250" />
            <line x1="750" y1="145" x2="750" y2="250" />
            <line x1="950" y1="125" x2="950" y2="250" />
            <line x1="1100" y1="120" x2="1100" y2="250" />
            
            <line x1="150" y1="670" x2="150" y2="550" />
            <line x1="350" y1="680" x2="350" y2="550" />
            <line x1="550" y1="660" x2="550" y2="550" />
            <line x1="750" y1="655" x2="750" y2="550" />
            <line x1="950" y1="675" x2="950" y2="550" />
            <line x1="1100" y1="680" x2="1100" y2="550" />
            
            {/* Corner arcs */}
            <path d="M 150 250 Q 100 250 100 300" />
            <path d="M 1050 250 Q 1150 250 1150 300" />
            <path d="M 150 550 Q 100 550 100 500" />
            <path d="M 1050 550 Q 1150 550 1150 500" />
          </g>
        </svg>
      </div>
      
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent"></div>

      {/* Section Title */}
      <div className="relative z-10 text-center mb-16 px-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas text-gray-900 uppercase tracking-tight">Upcoming Matches</h2>
          <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-[#BD9B58]"></div>
        </div>
        <p className="text-gray-600 text-sm uppercase tracking-widest font-medium">Next Fixtures</p>
      </div>

      <div className="relative w-full mx-auto px-4 max-w-[1800px] z-10" ref={containerRef}>
        {/* Left side fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>

        {/* Right side fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="relative overflow-hidden" ref={sliderRef}>
          <motion.div
            className="flex gap-6 py-5"
            animate={{
              x: visibleSlides === 4 ? `calc(-${currentIndex} * (100% / 4 + 1.5%))` :
                 visibleSlides === 3 ? `calc(-${currentIndex} * (100% / 3 + 2%))` :
                 visibleSlides === 2 ? `calc(-${currentIndex} * (100% / 2 + 3%))` :
                 `calc(-${currentIndex} * 100%)`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {matches.map((match, idx) => (
              <Link 
                key={idx} 
                href={`/matchreport/${match._id}`}
                className="group flex-shrink-0 match-card"
                style={{ 
                  width: visibleSlides === 4 ? "calc((100% - 72px) / 4)" : 
                         visibleSlides === 3 ? "calc((100% - 48px) / 3)" :
                         visibleSlides === 2 ? "calc((100% - 24px) / 2)" :
                         "100%",
                  minWidth: visibleSlides === 1 ? "100%" : "280px"
                }}
              >
                <div className="bg-white rounded-3xl overflow-hidden transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15),0_4px_12px_rgba(189,155,88,0.2)] h-full flex flex-col min-h-[520px] border border-gray-200 hover:border-[#BD9B58]/60 group relative backdrop-blur-sm">
                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06), inset 0 -1px 2px rgba(0,0,0,0.04)'
                  }}></div>
                  
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#BD9B58]/0 via-transparent to-transparent group-hover:from-[#BD9B58]/8 group-hover:via-transparent transition-all duration-500 pointer-events-none"></div>
                  
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* League Logo */}
                  <div className="px-8 pt-12 pb-8 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-transparent"></div>
                    <img 
                      src={match.leagueLogo} 
                      alt="League Logo" 
                      className="h-16 w-auto object-contain relative z-10 filter drop-shadow-sm"
                    />
                  </div>

                  {/* Date & Location */}
                  <div className="px-6 pb-8 text-center relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-[1px] bg-gradient-to-r from-transparent via-[#BD9B58]/30 to-transparent"></div>
                    <p className="text-base font-semibold text-gray-900 mb-1.5 mt-4 tracking-tight">
                      {formatDate(match.date)}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {formatTime(match.time)} • {match.stadium}
                    </p>
                  </div>

                  {/* Teams Section */}
                  <div className="px-8 pb-8 flex-1 flex flex-col justify-center relative">
                    {/* Logos and Score/Time */}
                    <div className="flex items-center justify-center gap-6 relative z-10">
                      <div className="transition-transform duration-500 group-hover:scale-105 w-24 h-24 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-2xl p-3">
                        <img 
                          src={match.homeTeamLogo} 
                          alt={match.homeTeam} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      {match.status === "SCHEDULED" || match.status === "Scheduled" || (match.homeScore === 0 && match.awayScore === 0) ? (
                        <div className="bg-gradient-to-br from-[#BD9B58] to-[#d4b068] text-white text-2xl font-bebas px-6 py-3 rounded-2xl text-center min-w-[120px] shadow-lg relative overflow-hidden flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                          <span className="relative z-10">{formatTimeShort(match.time)}</span>
                        </div>
                      ) : (
                        <div className="text-white text-4xl font-bebas px-6 py-3 rounded-2xl shadow-lg relative overflow-hidden flex-shrink-0" style={{ backgroundColor: '#181819' }}>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <span className="relative z-10">{match.homeScore}-{match.awayScore}</span>
                        </div>
                      )}
                      
                      <div className="transition-transform duration-500 group-hover:scale-105 w-24 h-24 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-2xl p-3">
                        <img 
                          src={match.awayTeamLogo} 
                          alt={match.awayTeam} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer with Status */}
                  <div className="px-8 pb-8 relative z-10">
                    <div className="w-full bg-gray-50 group-hover:bg-gradient-to-r group-hover:from-[#BD9B58] group-hover:to-[#d4b068] border border-gray-200 group-hover:border-transparent rounded-2xl px-6 py-3.5 text-center transition-all duration-500">
                      <span className="text-sm font-bold text-gray-700 group-hover:text-white uppercase tracking-wider transition-colors duration-500">
                        {match.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Navigation arrows */}
        <button
          className="bg-white/90 backdrop-blur-md text-gray-700 px-4 py-3 absolute left-4 top-1/2 transform -translate-y-1/2 hover:bg-white border border-gray-200 hover:border-[#BD9B58] hover:text-[#BD9B58] transition-all focus:outline-none rounded-full z-20 disabled:opacity-30 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="bg-gradient-to-r from-[#BD9B58] to-[#d4b068] text-white px-4 py-3 absolute right-4 top-1/2 transform -translate-y-1/2 hover:shadow-[0_4px_20px_rgba(189,155,88,0.4)] hover:scale-105 transition-all focus:outline-none rounded-full z-20 disabled:opacity-30 shadow-lg disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Pagination dots */}
        <div className="flex justify-center mt-10 gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-[#BD9B58] w-10 h-2 shadow-md" 
                  : "bg-gray-300 w-2 h-2 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;