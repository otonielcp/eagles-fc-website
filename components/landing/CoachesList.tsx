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
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Professional Header Section */}
      <div className="relative pt-24 pb-32 mb-20">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-24 h-px bg-[#C5A464]"></div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Badge/Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#C5A464]/10 blur-xl"></div>
              <span className="relative text-[#C5A464] text-xs font-semibold uppercase tracking-[0.3em] px-4 py-2">
                Our Team
              </span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-playfair italic text-gray-900 leading-[0.95] mb-6">
              <span className="block">Coaching</span>
              <span className="block text-[#C5A464]">Staff</span>
            </h1>
          </motion.div>

          {/* Accent Line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "200px", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="h-[2px] bg-gradient-to-r from-transparent via-[#C5A464] to-transparent mx-auto mb-10"
          ></motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-gray-600 text-lg sm:text-xl leading-relaxed font-light">
              Meet our dedicated coaching team committed to developing excellence on and off the pitch
            </p>
          </motion.div>

          {/* Stats or additional info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-gray-200"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{coaches.length}+</div>
              <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Coaches</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#C5A464]">100%</div>
              <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Dedicated</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Professional Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 pb-20">
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
  );
};

export default CoachesList;