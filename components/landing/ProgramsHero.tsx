"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

const ProgramsHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current && titleRef.current && subtitleRef.current && accentRef.current) {
      const tl = gsap.timeline();
      
      // Animate orbs with more sophisticated movement
      if (orb1Ref.current && orb2Ref.current) {
        gsap.to(orb1Ref.current, {
          x: 150,
          y: -80,
          duration: 25,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        gsap.to(orb2Ref.current, {
          x: -120,
          y: 100,
          duration: 30,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
      
      // Animate accent line
      tl.fromTo(
        accentRef.current,
        { width: 0, opacity: 0 },
        { width: '300px', opacity: 1, duration: 1.5, ease: "power3.out" }
      )
      // Animate title with stagger
      .fromTo(
        titleRef.current.querySelectorAll('span'),
        { opacity: 0, y: 80, rotationX: -90 },
        { 
          opacity: 1, 
          y: 0, 
          rotationX: 0,
          duration: 1.2, 
          ease: "power4.out",
          stagger: 0.15
        },
        "-=1"
      )
      // Animate subtitle
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
      );
    }
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative w-full h-[80vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#181819] to-[#0f0f0f]"
    >
      {/* Enhanced animated gradient orbs */}
      <motion.div 
        ref={orb1Ref}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#C5A464]/30 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        ref={orb2Ref}
        className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-[#C5A464]/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
      
      {/* Sophisticated grid pattern */}
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `linear-gradient(#C5A464 1px, transparent 1px), linear-gradient(90deg, #C5A464 1px, transparent 1px)`,
        backgroundSize: '100px 100px'
      }}></div>

      {/* Animated gold accent lines */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C5A464] to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C5A464] to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
      />

      {/* Premium decorative elements */}
      <div className="absolute top-24 left-24 w-48 h-48 border border-[#C5A464]/20 rounded-full hidden xl:block"></div>
      <div className="absolute bottom-24 right-24 w-40 h-40 border border-[#C5A464]/20 rounded-full hidden xl:block"></div>
      <div className="absolute top-1/2 left-16 w-32 h-32 border border-[#C5A464]/15 rounded-full hidden lg:block"></div>
      <div className="absolute top-1/3 right-16 w-24 h-24 border border-[#C5A464]/10 rounded-full hidden lg:block"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <motion.div 
            ref={accentRef}
            className="h-[4px] bg-gradient-to-r from-transparent via-[#C5A464] to-transparent rounded-full shadow-lg shadow-[#C5A464]/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </div>
        
        <h1 
          ref={titleRef}
          className="text-7xl md:text-8xl lg:text-9xl xl:text-[13rem] font-black text-white mb-12 tracking-tight leading-[0.85]"
          style={{ fontFamily: "'Bebas Neue', 'Arial Black', sans-serif", letterSpacing: '0.01em' }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            OUR
          </motion.span>
          <motion.span 
            className="block bg-gradient-to-r from-[#C5A464] via-[#D4B068] to-[#C5A464] bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            PROGRAMS
          </motion.span>
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl lg:text-3xl text-gray-300/95 leading-relaxed max-w-4xl mx-auto font-light tracking-wide"
        >
          From recreational play to elite competition, discover the perfect pathway for every player's journey
        </p>

        {/* Premium decorative dots */}
        <div className="flex justify-center gap-4 mt-16">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-[#C5A464] shadow-lg shadow-[#C5A464]/50"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + i * 0.2, duration: 0.5, type: "spring" }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/90 to-transparent"></div>
      
      {/* Premium particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => {
          const randomX = typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1920;
          const randomY = typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 1080;
          return (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-[#C5A464]/40 rounded-full"
              initial={{
                x: randomX,
                y: randomY,
                opacity: 0
              }}
              animate={{
                y: [null, randomY - 150],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeOut"
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProgramsHero;
