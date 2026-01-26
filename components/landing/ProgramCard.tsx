"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ProgramCardProps {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  additionalInfo?: string;
  images: {
    main: string;
    secondary?: string;
  };
  imagePosition?: 'left' | 'right';
  index: number;
}

const ProgramCard = ({
  title,
  subtitle,
  description,
  highlights,
  additionalInfo,
  images,
  imagePosition = 'right',
  index,
}: ProgramCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div ref={cardRef} className="relative w-full overflow-hidden">
      
      {/* Full-Screen Hero Section */}
      <div className="relative min-h-screen flex items-center bg-[#0a0a0a]">
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={images.main}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/30"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div style={{
            backgroundImage: `linear-gradient(rgba(197, 164, 100, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 164, 100, 0.3) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            width: '100%',
            height: '100%'
          }}></div>
        </div>

        <div className="relative z-10 max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-20 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Content */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A464] uppercase">
                  {subtitle}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-7xl sm:text-8xl lg:text-9xl xl:text-[10rem] font-black text-white tracking-tighter leading-[0.85] mb-10"
              >
                {title}
              </motion.h2>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isVisible ? "100px" : 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-[3px] bg-[#C5A464] mb-12"
              ></motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl sm:text-2xl text-gray-300 leading-[1.6] mb-12 max-w-2xl"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                {description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <button className="group inline-flex items-center gap-4 px-12 py-5 bg-[#C5A464] text-black font-bold text-sm uppercase tracking-[0.2em] hover:bg-white transition-all duration-300">
                  <span>Discover More</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </motion.div>
            </div>

            {/* Secondary Image */}
            {images.secondary && (
              <motion.div
                className="lg:col-span-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <div className="relative">
                  <img
                    src={images.secondary}
                    alt={`${title} showcase`}
                    className="w-full h-[500px] lg:h-[650px] object-cover"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#C5A464]/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Premium Content Section */}
      <div className="relative bg-white py-32 lg:py-40">
        <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-20">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-20"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-[#C5A464]"></div>
              <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A464] uppercase">Program Excellence</span>
            </div>
          </motion.div>

          {/* Clean Highlights List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-16 mb-24">
            {highlights.map((highlight, idx) => {
              const [label, ...textParts] = highlight.split(':');
              const text = textParts.join(':');
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                  transition={{ duration: 0.6, delay: 0.9 + idx * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-1 h-full bg-[#C5A464] flex-shrink-0"></div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 mb-4 leading-tight">{label}</h4>
                      {text && (
                        <p className="text-gray-600 text-lg leading-[1.7]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{text}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Info - Sophisticated */}
          {additionalInfo && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="relative border-t-2 border-gray-200 pt-16"
            >
              <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
                <div className="max-w-4xl">
                  <h4 className="text-sm font-bold uppercase tracking-[0.25em] text-gray-400 mb-6">
                    {title === 'SELECT' ? 'The Next Level Awaits' : 
                     title === 'JUNIOR ACADEMY' ? 'Building Champions' :
                     'Your Journey Starts Here'}
                  </h4>
                  <p className="text-gray-700 text-xl leading-[1.7]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {additionalInfo}
                  </p>
                </div>
                
                {/* Register Button */}
                <div className="flex-shrink-0">
                  <a 
                    href="/playerinquiries"
                    className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#BD9B58] text-black font-bold text-lg px-10 py-5 transition-all duration-500 shadow-[0_0_30px_rgba(189,155,88,0.3)] hover:shadow-[0_0_50px_rgba(189,155,88,0.6)] uppercase tracking-wider whitespace-nowrap"
                  >
                    Register Now
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
