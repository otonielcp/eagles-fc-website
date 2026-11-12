"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getClubFixtures } from "@/actions/futbolcore";
import Link from "next/link";
import gsap from "gsap";
import { parseLocalDate, startOfToday } from "./landingUtils";
import SafeImg from "./SafeImg";

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
  const [matches, setMatches] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const fixtures = await getClubFixtures();
        // Upcoming scheduled games. f.date is a calendar day ("YYYY-MM-DD"), so
        // compare it as a local date against the start of today — a game stays
        // "upcoming" for the whole of match day.
        const today = startOfToday();
        const upcoming = fixtures.filter((f: any) => {
          const gameDate = parseLocalDate(f.date);
          return f.status === 'SCHEDULED' && gameDate >= today;
        });
        setMatches(upcoming);
      } catch (error) {
        console.error("Error fetching upcoming matches:", error);
      } finally {
        setLoaded(true);
      }
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

  // Nothing scheduled: leave the section out rather than show an empty carousel.
  if (loaded && matches.length === 0) {
    return null;
  }

  // Card width and slide step for `visibleSlides` cards with a 24px (gap-6) gap.
  // Percentages are of the track width, which equals the viewport width.
  const GAP = 24;
  const cardWidth = `calc((100% - ${GAP * (visibleSlides - 1)}px) / ${visibleSlides})`;
  const slideX = `calc(-${currentIndex} * ((100% - ${GAP * (visibleSlides - 1)}px) / ${visibleSlides} + ${GAP}px))`;

  return (
    <div className="w-full bg-white py-20 md:py-24 relative overflow-hidden">
      {/* Section Title */}
      <div className="relative z-10 text-center mb-12 md:mb-14 px-4">
        <div className="inline-flex items-center gap-4 mb-3">
          <div className="w-6 sm:w-14 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bebas text-gray-900 uppercase leading-none">Upcoming Matches</h2>
          <div className="w-6 sm:w-14 h-[2px] bg-gradient-to-l from-transparent to-[#BD9B58]"></div>
        </div>
        <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold">Next Fixtures</p>
      </div>

      <div className="relative w-full mx-auto px-4 sm:px-6 max-w-[1500px] z-10" ref={containerRef}>
        <div className="relative overflow-hidden -my-4 py-4" ref={sliderRef}>
          <motion.div
            className="flex gap-6"
            animate={{ x: slideX }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {matches.map((match, idx) => (
              <Link
                key={idx}
                href={`/matchreport/${match._id}`}
                className="group flex-shrink-0 match-card"
                style={{ width: cardWidth }}
              >
                <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 h-full flex flex-col border border-gray-200 hover:border-[#BD9B58]/60 relative">
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* League Logo or Match Title */}
                  <div className="px-6 pt-8 pb-5 flex items-center justify-center relative min-h-[104px]">
                    {match.leagueLogo ? (
                      <>
                        <img
                          src={match.leagueLogo}
                          alt=""
                          className="h-16 w-auto object-contain relative z-10 filter drop-shadow-sm"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider relative z-10 text-center leading-tight hidden">
                          {match.title || `${match.homeTeam} vs ${match.awayTeam}`}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider relative z-10 text-center leading-tight">
                        {match.title || `${match.homeTeam} vs ${match.awayTeam}`}
                      </p>
                    )}
                  </div>

                  {/* Date & Location */}
                  <div className="px-6 pb-6 text-center relative">
                    <div className="mx-auto mb-4 w-16 h-[1px] bg-gradient-to-r from-transparent via-[#BD9B58]/40 to-transparent"></div>
                    <p className="text-base font-semibold text-gray-900 mb-1 tracking-tight">
                      {formatDate(match.date)}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">
                      {match.stadium}
                    </p>
                  </div>

                  {/* Teams: home logo — kick-off time (or score) — away logo */}
                  <div className="px-5 pb-6 flex-1 flex flex-col justify-center">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="flex flex-col items-center gap-2 min-w-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                          <SafeImg
                            src={match.homeTeamLogo}
                            alt={match.homeTeam}
                            fallbackSrc={null}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 text-center leading-tight line-clamp-2">{match.homeTeam}</span>
                      </div>

                      {match.status === "SCHEDULED" || match.status === "Scheduled" || (match.homeScore === 0 && match.awayScore === 0) ? (
                        <div className="bg-[#BD9B58] text-white text-xl sm:text-2xl font-bebas px-3 sm:px-4 py-2 rounded-xl text-center whitespace-nowrap shadow-md">
                          {formatTime(match.time)}
                        </div>
                      ) : (
                        <div className="bg-[#181819] text-white text-3xl font-bebas px-4 py-2 rounded-xl whitespace-nowrap shadow-md">
                          {match.homeScore}-{match.awayScore}
                        </div>
                      )}

                      <div className="flex flex-col items-center gap-2 min-w-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                          <SafeImg
                            src={match.awayTeamLogo}
                            alt={match.awayTeam}
                            fallbackSrc={null}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 text-center leading-tight line-clamp-2">{match.awayTeam}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 pb-6">
                    <div className="w-full border border-gray-200 group-hover:border-[#BD9B58] group-hover:bg-[#BD9B58] rounded-xl px-4 py-3 text-center transition-colors duration-300">
                      <span className="text-xs font-bold text-gray-700 group-hover:text-white uppercase tracking-[0.2em] transition-colors duration-300">
                        Match Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Controls: prev — dots — next (kept below the cards so they never cover a logo) */}
        {maxIndex > 0 && (
          <div className="flex items-center justify-center gap-5 mt-10">
            <button
              type="button"
              aria-label="Previous matches"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:border-[#BD9B58] hover:text-[#BD9B58] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  className={`rounded-full transition-all duration-300 h-2 ${
                    index === currentIndex ? "bg-[#BD9B58] w-8" : "bg-gray-300 w-2 hover:bg-gray-400"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next matches"
              className="w-11 h-11 flex items-center justify-center rounded-full bg-[#BD9B58] text-white hover:bg-[#a8884a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;