"use client";

import { motion } from 'framer-motion';

const ProgramsHero = () => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(197, 164, 100, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 164, 100, 0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-[#C5A464]/5 via-transparent to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        {/* Luxury Label with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-4 mb-12"
        >
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C5A464] to-[#C5A464]"></div>
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A464] uppercase">Pathways to Greatness</span>
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent via-[#C5A464] to-[#C5A464]"></div>
        </motion.div>

        {/* Massive Luxury Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mb-16"
        >
          <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85]">
            <span className="block text-white mb-4">OUR</span>
            <span className="block bg-gradient-to-r from-[#C5A464] via-[#D4AF37] to-[#C5A464] bg-clip-text text-transparent">
              PROGRAMS
            </span>
          </h1>
          {/* Underline Accent */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "200px" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-[2px] bg-gradient-to-r from-transparent via-[#C5A464] to-transparent mx-auto mt-8"
          ></motion.div>
        </motion.div>

        {/* Elegant Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <p className="text-xl sm:text-2xl text-gray-400 leading-relaxed font-light max-w-4xl mx-auto tracking-wide">
            From recreational play to elite competition,<br className="hidden sm:block"/>
            <span className="text-[#C5A464] font-normal">discover the perfect pathway</span> for every player's journey
          </p>
        </motion.div>

        {/* Luxury Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-20 sm:gap-32"
        >
          {/* Program Count */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#C5A464]/10 blur-3xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700"></div>
            <div className="relative text-center">
              <div className="text-7xl sm:text-8xl font-black mb-3">
                <span className="bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                  3
                </span>
                <span className="text-[#C5A464]">+</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-[1px] bg-[#C5A464]"></div>
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">Elite Programs</div>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[#C5A464]/30 to-transparent"></div>

          {/* Age Range */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#C5A464]/10 blur-3xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700"></div>
            <div className="relative text-center">
              <div className="text-7xl sm:text-8xl font-black mb-3">
                <span className="bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                  All
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-[1px] bg-[#C5A464]"></div>
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">Ages Welcome</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs uppercase tracking-[0.2em] text-gray-600 font-semibold mb-2">Scroll</div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1px] h-16 bg-gradient-to-b from-[#C5A464] to-transparent"
            ></motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgramsHero;
