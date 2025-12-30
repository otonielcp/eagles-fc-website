'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const coreValueImage = "/corevalues.jpeg"

const CoreValues = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && titleRef.current && valuesRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: "power3.out"
      });

      gsap.from(valuesRef.current.querySelectorAll('.value-item'), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3
      });
    }
  }, []);

  const values = [
    { name: 'CHARACTER', description: 'We stand for integrity, humility, and respect — on and off the pitch.' },
    { name: 'PASSION', description: 'We play with heart, energy, and an unbreakable love for the game.' },
    { name: 'DEVELOPMENT', description: 'We grow players, people, and ideas — building excellence from within.' },
    { name: 'CREATIVITY', description: 'We express ourselves with intelligence, flair, and a commitment to beautiful football.' },
    { name: 'UNITY', description: 'We are one club, one identity, one family — stronger together.' }
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center justify-center text-white text-center px-6 py-20 overflow-hidden"
      style={{ backgroundImage: `url(${coreValueImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, rgba(24, 24, 25, 0.7), rgba(24, 24, 25, 0.6), rgba(24, 24, 25, 0.7))' }}></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#BD9B58]/30 via-[#BD9B58]/20 to-[#BD9B58]/30 z-10"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 z-10" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #BD9B58 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#BD9B58]/20 to-transparent rounded-full blur-3xl z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#BD9B58]/20 to-transparent rounded-full blur-3xl z-10"></div>
      
      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent z-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent z-20"></div>
      
      {/* Text Content */}
      <div className="relative z-20 w-full mx-auto px-2 md:px-4 lg:px-8">
        <motion.h2 
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bebas font-bold mb-10 md:mb-14 uppercase tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] text-center relative z-30"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          CORE VALUES
        </motion.h2>
        
        <div 
          ref={valuesRef}
          className="flex flex-nowrap items-center justify-center relative z-30 w-full"
          style={{ 
            flexWrap: 'nowrap',
            overflow: 'visible',
            width: '100%'
          }}
        >
          {values.map((value, index) => (
            <motion.div
              key={value.name}
              className="value-item group relative z-30"
              style={{ 
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <span className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold tracking-wide uppercase relative z-10 inline-block text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:text-[#BD9B58] transition-colors duration-300 whitespace-nowrap px-1 md:px-2 lg:px-3 cursor-pointer">
                {value.name}
              </span>
              
              {/* Hover Tooltip with Description - Clean Minimal Design */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 pointer-events-none">
                <div 
                  className="border-t-2 border-[#BD9B58] rounded-b-lg shadow-2xl"
                  style={{ 
                    backgroundColor: '#181819',
                    minWidth: '280px',
                    maxWidth: '400px',
                    padding: '1.25rem 1.5rem',
                    display: 'inline-block'
                  }}
                >
                  <p className="text-white text-sm md:text-base leading-relaxed text-center font-light m-0 whitespace-normal">
                    {value.description}
                  </p>
                </div>
              </div>
              
              {/* Separator (except for last item) */}
              {index < values.length - 1 && (
                <span className="text-[#BD9B58] text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-light inline-block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mx-0.5 md:mx-1 lg:mx-2" style={{ flexShrink: 0 }}>
                  |
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative elements - moved outside content div */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-[#BD9B58]/20 rounded-full pointer-events-none z-0"></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-[#BD9B58]/15 rounded-full pointer-events-none z-0"></div>
    </div>
  );
};

export default CoreValues;