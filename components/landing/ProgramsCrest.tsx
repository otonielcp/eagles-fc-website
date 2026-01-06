"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

const ProgramsCrest = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const crestRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (crestRef.current && glowRef.current) {
      // Animate crest entrance
      gsap.fromTo(
        crestRef.current,
        { opacity: 0, scale: 0.7, rotation: -10 },
        { 
          opacity: 1, 
          scale: 1, 
          rotation: 0,
          duration: 1.8, 
          ease: "elastic.out(1, 0.5)"
        }
      );

      // Animate glow
      gsap.to(glowRef.current, {
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
        duration: 4,
        repeat: -1,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <motion.div 
      ref={sectionRef} 
      className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #C5A464 1px, transparent 0)`,
        backgroundSize: '80px 80px'
      }}></div>

      {/* Animated gold accent lines */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C5A464]/40 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C5A464]/40 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      />

      {/* Decorative corner elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-[#C5A464]/10 rounded-full hidden lg:block"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 border border-[#C5A464]/10 rounded-full hidden lg:block"></div>

      <div className="relative w-full max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Eagles Football Club <span className="text-[#C5A464]">Crest</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Symbol of excellence, tradition, and our commitment to developing champions
          </p>
        </motion.div>

        {/* Crest Container */}
        <div className="relative h-[500px] md:h-[700px] lg:h-[800px] flex items-center justify-center">
          {/* Animated glow effect */}
          <motion.div
            ref={glowRef}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(197, 164, 100, 0.15) 0%, transparent 70%)'
            }}
          />

          {/* Crest Image */}
          <motion.img
            ref={crestRef}
            src="/EAGLES-CREST.png"
            alt="Eagles FC Crest"
            className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.4 }}
          />

          {/* Decorative rings */}
          <motion.div
            className="absolute inset-0 border-2 border-[#C5A464]/20 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <motion.div
            className="absolute inset-0 border border-[#C5A464]/10 rounded-full"
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.8 }}
          />

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#C5A464]/40 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProgramsCrest;
