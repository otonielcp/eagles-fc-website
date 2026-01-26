"use client";

import { useState, useEffect } from "react";
import { getActiveCoaches } from "@/actions/staff";
import { motion } from "framer-motion";

const CoachCard = ({
  name,
  position,
  image,
  teamName,
  index
}: {
  name: string,
  position: string,
  image?: string,
  teamName?: string,
  index: number
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#C5A464]/30"
    >
      {/* Image Container */}
      <div className="relative h-[380px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        <img
          src={image ? image : '/default.jpg'}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Top accent line on hover */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5A464] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Text Content */}
      <div className="p-7 bg-white">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#C5A464] transition-colors duration-300 leading-tight">
          {name}
        </h3>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[2px] w-8 bg-[#C5A464] group-hover:w-12 transition-all duration-300"></div>
          <p className="text-gray-600 text-sm uppercase tracking-[0.1em] font-semibold">
            {position}
          </p>
        </div>
        
        {/* Show team name if available */}
        {teamName && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A464]"></div>
            <p className="text-gray-500 text-sm font-light">
              {teamName}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CoachesList = () => {
  // State to store coaches data
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch coaches data on component mount
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const coachesData = await getActiveCoaches();
        setCoaches(coachesData);
      } catch (error) {
        console.error("Failed to fetch coaches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-playfair italic text-gray-800 mb-6">Coaching Staff</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading coaching staff information...</p>
        </motion.div>
      </div>
    );
  }

  // If no coaches found, display a message
  if (coaches.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-playfair italic text-gray-800 mb-6">Coaching Staff</h2>
          <p className="text-gray-600 text-lg">No coaching staff information available at this time.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Ultra-Premium Hero Section */}
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
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A464] uppercase">Excellence in Leadership</span>
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
              <span className="block text-white mb-4">COACHING</span>
              <span className="block bg-gradient-to-r from-[#C5A464] via-[#D4AF37] to-[#C5A464] bg-clip-text text-transparent">
                STAFF
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
              A distinguished collective of world-class coaches dedicated to <br className="hidden sm:block"/>
              <span className="text-[#C5A464] font-normal">shaping champions</span> and cultivating excellence
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
            {/* Coaches Count */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#C5A464]/10 blur-3xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700"></div>
              <div className="relative text-center">
                <div className="text-7xl sm:text-8xl font-black mb-3">
                  <span className="bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                    {coaches.length}
                  </span>
                  <span className="text-[#C5A464]">+</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-[1px] bg-[#C5A464]"></div>
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">Expert Coaches</div>
                </div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[#C5A464]/30 to-transparent"></div>

            {/* Dedication */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#C5A464]/10 blur-3xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700"></div>
              <div className="relative text-center">
                <div className="text-7xl sm:text-8xl font-black mb-3">
                  <span className="bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                    100
                  </span>
                  <span className="text-[#C5A464]">%</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-[1px] bg-[#C5A464]"></div>
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">Commitment</div>
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

      {/* Coaches Grid Section */}
      <div className="relative bg-white py-32">
        {/* Section Header */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-[1px] bg-[#C5A464]"></div>
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A464] uppercase">Meet the Team</span>
              <div className="w-8 h-[1px] bg-[#C5A464]"></div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl font-black text-gray-900 mb-6"
            >
              The Architects of <span className="text-[#C5A464]">Success</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Each member brings decades of experience and an unwavering passion for developing tomorrow's champions
            </motion.p>
          </div>
        </div>

        {/* Premium Grid */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {coaches.map((coach, index) => (
              <CoachCard
                key={coach._id}
                name={coach.displayName}
                position={coach.role}
                image={coach.image}
                teamName={coach.teamId?.name}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CoachesList;