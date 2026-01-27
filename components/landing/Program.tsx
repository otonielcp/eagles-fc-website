'use client';

import Link from 'next/link';
import { UserCheck, GitCompareArrows, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { getSiteImage } from '@/lib/site-images';

// Dynamic import for Three.js to prevent build errors - Temporarily disabled
// let Canvas: any;
// let OrbitControls: any;
// let Sphere: any;
// let THREE: any;

// try {
//   const threeFiber = require('@react-three/fiber');
//   const drei = require('@react-three/drei');
//   THREE = require('three');
//   Canvas = threeFiber.Canvas;
//   OrbitControls = drei.OrbitControls;
//   Sphere = drei.Sphere;
// } catch (e) {
//   console.warn('Three.js not available, using fallback');
// }

const programpic = getSiteImage("/photos/IMG_3418.JPG");

// Three.js Soccer Ball Component - Temporarily disabled
const SoccerBall = () => {
  return null;
  // if (!Sphere) return null;
  // return (
  //   <Sphere args={[1, 32, 32]} position={[0, 2, 0]}>
  //     <meshStandardMaterial 
  //       color="#ffffff" 
  //       roughness={0.3}
  //       metalness={0.1}
  //     />
  //   </Sphere>
  // );
};

// Three.js Soccer Field Lines - Temporarily disabled
const FieldLines = () => {
  return null;
  // if (!THREE) return null;
  // return (
  //   <group>
  //     {/* Center circle */}
  //     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
  //       <ringGeometry args={[0, 3, 64]} />
  //       <meshBasicMaterial color="#BD9B58" transparent opacity={0.6} />
  //     </mesh>
  //     {/* Center line */}
  //     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
  //       <planeGeometry args={[20, 0.1]} />
  //       <meshBasicMaterial color="#BD9B58" transparent opacity={0.6} />
  //     </mesh>
  //     {/* Penalty box */}
  //     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, 0.01, 0]}>
  //       <planeGeometry args={[4, 6]} />
  //       <meshBasicMaterial color="#BD9B58" transparent opacity={0.4} side={THREE.DoubleSide} />
  //     </mesh>
  //   </group>
  // );
};

// Three.js Animated Background - Using fallback only
const SoccerScene = () => {
  // Always use fallback for now
  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a4d2e]/20 via-[#BD9B58]/10 to-[#1a4d2e]/20 animate-pulse"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 30% 50%, rgba(189, 155, 88, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 70% 50%, rgba(189, 155, 88, 0.1) 0%, transparent 50%)`,
        backgroundSize: '100% 100%',
        animation: 'pulse 4s ease-in-out infinite'
      }}></div>
    </div>
  );
};

const Program = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  // Removed mounted state - not needed without Three.js

  useEffect(() => {
    // GSAP animations on mount
    if (imageRef.current && textRef.current && statsRef.current && cardsRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.fromTo(imageRef.current, 
        { opacity: 0, x: -50, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 1 }
      )
      .fromTo(textRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(statsRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 },
        "-=0.4"
      )
      .fromTo(cardsRef.current.querySelectorAll('.feature-card'),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
        "-=0.3"
      );
    }
  }, []);

  return (
    <div className="w-full bg-white py-24 md:py-32 relative overflow-hidden">
      {/* Subtle gold pattern background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #BD9B58 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent"></div>
      
      {/* Decorative gold elements */}
      <div className="absolute top-20 right-10 w-32 h-32 border-2 border-[#BD9B58]/20 rounded-full"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-[#BD9B58]/20 rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-[#BD9B58]/15 rounded-full"></div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1600px] relative z-10">
        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          {/* Left - Image */}
          <div className="relative" ref={imageRef}>
            {/* Decorative border glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#BD9B58]/50 via-[#d4b068]/30 to-[#BD9B58]/50 rounded-tr-3xl rounded-bl-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            
            <div
              className="relative overflow-hidden rounded-tr-3xl rounded-bl-3xl shadow-2xl group border-2 border-[#BD9B58]/30 w-full h-[300px] sm:h-[400px] md:h-[600px] lg:h-[700px] bg-cover bg-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              style={{
                backgroundImage: `url(${programpic})`,
              }}
              role="img"
              aria-label="Eagles FC Team"
            >
              {/* Enhanced gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#BD9B58]/0 via-transparent to-[#BD9B58]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>

            {/* Stats Section Over Image - Desktop */}
            <motion.div 
              ref={statsRef}
              className="hidden lg:flex absolute -bottom-6 -right-6 bg-gradient-to-br from-[#BD9B58] via-[#d4b068] to-[#BD9B58] text-white py-8 px-12 rounded-tr-3xl rounded-bl-3xl shadow-2xl backdrop-blur-md border-2 border-white/30 relative group"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              style={{ minWidth: '500px' }}
            >
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-tr-3xl rounded-bl-3xl"></div>
              
              <div className="relative z-10 flex items-center gap-8 w-full">
                <motion.div 
                  className="border-r border-white/40 pr-8 flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-5xl font-bebas font-bold mb-2 bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent">10+</div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/90 whitespace-nowrap">Player Pathways</p>
                </motion.div>
                <motion.div 
                  className="border-r border-white/40 pr-8 flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-5xl font-bebas font-bold mb-2 bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent">135+</div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/90 whitespace-nowrap">Active Players</p>
                </motion.div>
                <motion.div 
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-5xl font-bebas font-bold mb-2 bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent flex items-baseline gap-1 flex-wrap justify-center lg:justify-start"><span>2</span><span className="text-3xl">Teams</span></div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/90 whitespace-nowrap">USYS National League</p>
                </motion.div>
            </div>
            </motion.div>
          </div>

          {/* Right - Text Content */}
          <div className="text-center lg:text-left space-y-8" ref={textRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative inline-block"
            >
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
              <p className="text-sm font-bold text-[#BD9B58] uppercase tracking-[0.3em] mb-4 relative inline-block">
                Why Join Eagles FC?
              </p>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-gradient-to-l from-transparent to-[#BD9B58]"></div>
            </motion.div>
            
            <motion.h2
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bebas text-gray-900 leading-[0.9] mb-6 sm:mb-8 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-[#181819] via-[#181819] to-[#BD9B58] bg-clip-text text-transparent">
                Elevate Your Game,
              </span>
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-[#BD9B58] via-[#181819] to-[#181819] bg-clip-text text-transparent">
                Expand Your Horizons
              </span>
              <br className="hidden md:block" />
              <span className="text-gray-900">with Us</span>
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-20 h-[2px] bg-gradient-to-r from-[#BD9B58] to-transparent mb-6 mx-auto lg:mx-0"></div>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
            At Eagles FC, we are more than just a soccer club—we are a platform for players to develop, compete,
            and succeed at the highest levels. Our teams compete in the USYS National League, the premier youth soccer league in the United States. Whether you aspire to play professionally, compete in college,
            or refine your skills in a top-tier training environment, we provide the resources, coaching,
            and support to help you reach your goals.
          </p>
            </motion.div>
          </div>
        </div>

        {/* Stats Section - Mobile */}
        <motion.div
          className="lg:hidden flex justify-center mb-12 sm:mb-20 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-gradient-to-br from-[#BD9B58] via-[#d4b068] to-[#BD9B58] text-white py-6 sm:py-8 px-4 sm:px-10 rounded-tr-3xl rounded-bl-3xl shadow-2xl w-full max-w-md border-2 border-white/30 relative overflow-hidden group">
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <div className="flex items-center justify-center gap-3 sm:gap-6 text-center relative z-10">
              <motion.div className="border-r border-white/40 pr-3 sm:pr-6" whileHover={{ scale: 1.1 }}>
                <div className="text-2xl sm:text-4xl font-bebas font-bold mb-1 sm:mb-2 bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent">10+</div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/90">Pathways</p>
              </motion.div>
              <motion.div className="border-r border-white/40 pr-3 sm:pr-6" whileHover={{ scale: 1.1 }}>
                <div className="text-2xl sm:text-4xl font-bebas font-bold mb-1 sm:mb-2 bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent">135+</div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/90">Players</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <div className="text-2xl sm:text-4xl font-bebas font-bold mb-1 sm:mb-2 bg-gradient-to-b from-white to-white/90 bg-clip-text text-transparent flex items-baseline gap-1 justify-center"><span>2</span><span className="text-lg sm:text-2xl">Teams</span></div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/90">USYS</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 px-2 sm:px-0" ref={cardsRef}>
          {/* Card 1 */}
          <motion.div 
            className="feature-card bg-white border-2 border-gray-200 p-6 sm:p-10 rounded-tr-3xl rounded-bl-3xl shadow-lg hover:shadow-2xl hover:shadow-[#BD9B58]/30 transition-all duration-500 group hover:border-[#BD9B58] relative overflow-hidden"
            whileHover={{ y: -12, scale: 1.03, rotateY: 2 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {/* Animated background gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#BD9B58]/0 via-[#BD9B58]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#BD9B58]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#BD9B58]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div 
                className="bg-gradient-to-br from-[#BD9B58] to-[#d4b068] rounded-full p-6 mb-6 flex-shrink-0 shadow-xl group-hover:shadow-2xl group-hover:shadow-[#BD9B58]/50 relative border-2 border-[#BD9B58]/20"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                <UserCheck className="text-white text-4xl relative z-10" />
              </motion.div>
          <div>
                <h3 className="font-bold text-2xl mb-4 text-gray-900 group-hover:text-[#BD9B58] transition-colors duration-300">
                  Expert Coaching Staff
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
              Our highly experienced and licensed coaches bring professional-level training to every session, ensuring
              players receive the best development possible.
            </p>
          </div>
        </div>
          </motion.div>

        {/* Card 2 */}
          <motion.div 
            className="feature-card bg-white border-2 border-gray-200 p-6 sm:p-10 rounded-tr-3xl rounded-bl-3xl shadow-lg hover:shadow-2xl hover:shadow-[#BD9B58]/30 transition-all duration-500 group hover:border-[#BD9B58] relative overflow-hidden"
            whileHover={{ y: -12, scale: 1.03, rotateY: -2 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#BD9B58]/0 via-[#BD9B58]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#BD9B58]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#BD9B58]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div 
                className="bg-gradient-to-br from-[#BD9B58] to-[#d4b068] rounded-full p-6 mb-6 flex-shrink-0 shadow-xl group-hover:shadow-2xl group-hover:shadow-[#BD9B58]/50 relative border-2 border-[#BD9B58]/20"
                whileHover={{ scale: 1.15, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                <GitCompareArrows className="text-white text-4xl relative z-10" />
              </motion.div>
          <div>
                <h3 className="font-bold text-2xl mb-4 text-gray-900 group-hover:text-[#BD9B58] transition-colors duration-300">
                  State-of-the-Art Equipment
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
              We invest in top-tier training equipment, performance tracking technology, and high-quality facilities to enhance player growth and preparation.
            </p>
          </div>
        </div>
          </motion.div>

        {/* Card 3 */}
          <motion.div 
            className="feature-card bg-white border-2 border-gray-200 p-6 sm:p-10 rounded-tr-3xl rounded-bl-3xl shadow-lg hover:shadow-2xl hover:shadow-[#BD9B58]/30 transition-all duration-500 group hover:border-[#BD9B58] relative overflow-hidden"
            whileHover={{ y: -12, scale: 1.03 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#BD9B58]/0 via-[#BD9B58]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#BD9B58]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#BD9B58]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div 
                className="bg-gradient-to-br from-[#BD9B58] to-[#d4b068] rounded-full p-6 mb-6 flex-shrink-0 shadow-xl group-hover:shadow-2xl group-hover:shadow-[#BD9B58]/50 relative border-2 border-[#BD9B58]/20"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                <TrendingUp className="text-white text-4xl relative z-10" />
              </motion.div>
          <div>
                <h3 className="font-bold text-2xl mb-4 text-gray-900 group-hover:text-[#BD9B58] transition-colors duration-300">
                  Holistic Player Development
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
              Beyond technical skills, we focus on mental resilience, leadership, and personal growth, preparing players for success on and off the field.
            </p>
          </div>
        </div>
          </motion.div>
      </div>

      {/* View Programs Button */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Link href="/programs">
            <motion.button 
              className="group relative px-16 py-5 bg-gradient-to-r from-[#BD9B58] via-[#d4b068] to-[#BD9B58] text-white font-bold text-lg uppercase tracking-widest rounded-tr-3xl rounded-bl-3xl shadow-2xl overflow-hidden border-2 border-white/20"
              whileHover={{ 
                scale: 1.08, 
                boxShadow: "0 20px 60px rgba(189, 155, 88, 0.6)",
                y: -3
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#d4b068] via-[#BD9B58] to-[#d4b068] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: "200% 200%" }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ["-100%", "200%"]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#BD9B58] blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
              
              <span className="relative z-10 flex items-center gap-4 font-bebas text-xl">
          View Programs
                <motion.span
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-2xl"
                >
                  →
                </motion.span>
              </span>
            </motion.button>
        </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Program;