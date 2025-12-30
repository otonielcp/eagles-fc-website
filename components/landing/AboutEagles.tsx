"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const eaglesImage = "/club-hero.png" // Ensure the correct image path

const AboutEagles = () => {
  const textDivRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState("auto");

  // Update image height when component mounts and on window resize
  useEffect(() => {
    const updateImageHeight = () => {
      if (textDivRef.current) {
        // Make the image slightly shorter than the text div
        const textHeight = textDivRef.current.offsetHeight;
        setImageHeight(`${textHeight * 0.95}px`);
      }
    };

    // Initial height calculation
    updateImageHeight();

    // Update on window resize
    window.addEventListener('resize', updateImageHeight);

    return () => {
      window.removeEventListener('resize', updateImageHeight);
    };
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative flex justify-center">
        {/* Main Content Container */}
        <div className="relative w-full max-w-6xl overflow-visible flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Text Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-2/3 relative z-10"
          >
            {/* Enhanced background with subtle shadow */}
            <div 
              style={{
                clipPath: "polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)",
              }}
              className="absolute inset-0 bg-white shadow-2xl rounded-lg"
            ></div>

            {/* Colored vertical accent bars */}
            <div className="absolute left-6 top-0 h-[45%] w-1.5 bg-gradient-to-b from-[#C5A464] to-[#BD9B58] transform rotate-2 shadow-lg"></div>
            <div className="absolute left-4 top-[60%] h-[40%] w-1.5 bg-gradient-to-b from-[#181819] to-[#0a0a0a] transform rotate-2 shadow-lg"></div>

            {/* Text content */}
            <div
              ref={textDivRef}
              className="relative p-10 lg:p-12"
            >
              <div className="ml-6 mr-8 lg:mr-32">
                {/* Club Name with enhanced styling */}
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-playfair italic text-gray-800 mb-8 leading-tight"
                >
                  EAGLES FOOTBALL CLUB
                </motion.h2>

                {/* Decorative line under title */}
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "120px" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="h-0.5 bg-gradient-to-r from-[#C5A464] to-transparent mb-8"
                />

                {/* Introduction paragraphs with better spacing */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-5 mb-10"
                >
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-light">
                    Eagles Football Club is a competitive and ambitious soccer organization founded on <span className="font-semibold text-gray-800">October 12, 2022</span>, with a clear mission: to elevate the level of play in Nebraska and provide a professional pathway for aspiring players.
                  </p>

                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-light">
                    In just two years, Eagles FC has emerged as one of Nebraska's most driven and fast-rising soccer clubs, embodying the club's commitment to excellence, discipline, and the pursuit of high-level football.
                  </p>
                </motion.div>

                {/* Our Journey Section with enhanced styling */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-3xl sm:text-4xl font-playfair italic text-gray-800 mb-6">Our Journey</h3>
                  
                  <ul className="space-y-5 mb-8">
                    <motion.li 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="flex items-start group"
                    >
                      <span className="text-[#C5A464] mr-4 text-xl font-bold mt-1 group-hover:scale-110 transition-transform">•</span>
                      <span className="text-base sm:text-lg text-gray-700 leading-relaxed font-light">
                        Eagles FC continues to raise the competitive bar in Nebraska through our youth development programs and competitive teams.
                      </span>
                    </motion.li>
                    <motion.li 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="flex items-start group"
                    >
                      <span className="text-[#C5A464] mr-4 text-xl font-bold mt-1 group-hover:scale-110 transition-transform">•</span>
                      <span className="text-base sm:text-lg text-gray-700 leading-relaxed font-light">
                        Our competitive teams have achieved significant success, setting the standard for aspiring players throughout the state.
                      </span>
                    </motion.li>
                    <motion.li 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className="flex items-start group"
                    >
                      <span className="text-[#C5A464] mr-4 text-xl font-bold mt-1 group-hover:scale-110 transition-transform">•</span>
                      <span className="text-base sm:text-lg text-gray-700 leading-relaxed font-light">
                        Our growing youth development programs ensure a steady pipeline of local talent, developing players from grassroots to competitive levels.
                      </span>
                    </motion.li>
                  </ul>

                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="text-base sm:text-lg text-gray-700 leading-relaxed font-light italic border-l-4 border-[#C5A464] pl-6 py-2"
                  >
                    Eagles FC is more than a club—it's a vision for the future of soccer in Nebraska, dedicated to developing players and fostering a love for the beautiful game at all levels.
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Image Section with enhanced styling */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block w-1/3 relative"
          >
            <div className="relative h-full flex items-center">
              {/* Decorative frame effect */}
              <div className="absolute inset-0 border-4 border-[#C5A464] rounded-lg transform rotate-1 shadow-2xl"></div>
              <div className="absolute inset-0 border-4 border-white rounded-lg transform -rotate-1 shadow-2xl"></div>
              
              <div className="relative overflow-hidden rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src={eaglesImage}
                  alt="Eagles Football Club"
                  className="object-cover w-full h-full"
                  style={{
                    height: imageHeight,
                    width: '100%'
                  }}
                />
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutEagles;