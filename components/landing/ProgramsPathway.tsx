"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { ProgramPyramid } from './ProgramPyramid';

const ProgramsPathway = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const tiers = [
    { label: "SELECT", age: "(13 - 19)" },
    { label: "COMPETITIVE", age: "(13 - 19)" },
    { label: "JUNIOR ACADEMY", age: "(5 - 8)" },
    { label: "RECREATIONAL" },
  ];

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95, y: 30 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 1, 
          ease: "power3.out" 
        }
      );
    }
  }, []);

  return (
    <div className="relative w-full py-16 md:py-24 lg:py-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">
            Player <span className="text-[#CEB27D]">Development</span> Pathway
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Your journey from first steps to professional play
          </p>
        </motion.div>

        {/* Pyramid Container */}
        <div ref={containerRef} className="flex justify-center">
          <ProgramPyramid 
            tiers={tiers}
            logoSrc="/EAGLES-CREST.png"
          />
        </div>
      </div>
    </div>
  );
};

export default ProgramsPathway;
