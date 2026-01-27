"use client";
import React from "react";
import { motion } from "framer-motion";
import { getSiteImage } from '@/lib/site-images';

const eaglesImage = getSiteImage("/photos/IMG_3461.JPG")

const AboutEagles = () => {
  return (
    <div className="relative w-full bg-white">
      
      <div className="max-w-[1600px] mx-auto">
        
        <div className="grid lg:grid-cols-[55%,45%]">
          
          {/* Content Section */}
          <div className="px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 lg:py-32 flex flex-col justify-center">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Small label */}
              <div className="inline-flex items-center gap-2 mb-8">
                <div className="w-8 h-[1px] bg-[#C5A464]"></div>
                <span className="text-xs font-semibold tracking-[0.2em] text-[#C5A464] uppercase">Est. 2022</span>
              </div>

              {/* Main heading */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 sm:mb-10 leading-[0.9]">
                <span className="text-gray-900">EAGLES</span><br/>
                <span className="text-gray-900">FOOTBALL</span><br/>
                <span className="text-[#C5A464]">CLUB</span>
              </h1>

              {/* Description */}
              <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12 max-w-2xl">
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-[1.7]">
                  A competitive and ambitious soccer organization founded on <strong className="font-semibold text-gray-900">October 12, 2022</strong>, with a clear mission: to elevate the level of play in Nebraska and provide a professional pathway for aspiring players.
                </p>

                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-[1.7]">
                  In just two years, Eagles FC has emerged as one of Nebraska's most driven and fast-rising soccer clubs, embodying excellence, discipline, and the pursuit of high-level football.
                </p>
              </div>

              {/* Stats or highlights */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12 max-w-2xl">
                <div className="border-l-2 border-[#C5A464] pl-2 sm:pl-4">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">100+</div>
                  <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Players</div>
                </div>
                <div className="border-l-2 border-[#C5A464] pl-2 sm:pl-4">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">12+</div>
                  <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Teams</div>
                </div>
                <div className="border-l-2 border-[#C5A464] pl-2 sm:pl-4">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">2</div>
                  <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Years</div>
                </div>
              </div>

              {/* Our Journey */}
              <div className="max-w-2xl">
                <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-900 mb-6">Our Journey</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-5 h-5 rounded-full bg-[#C5A464]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#C5A464]"></div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Raising the competitive bar in Nebraska through youth development programs and competitive teams
                    </p>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-5 h-5 rounded-full bg-[#C5A464]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#C5A464]"></div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Achieving significant success with competitive teams that set the standard for aspiring players statewide
                    </p>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-5 h-5 rounded-full bg-[#C5A464]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#C5A464]"></div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Developing a steady pipeline of local talent from grassroots to competitive levels
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>

          </div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[350px] sm:h-[450px] md:h-[600px] lg:h-auto"
          >
            <div className="absolute inset-0 lg:sticky lg:top-0 lg:h-screen">
              <img
                src={eaglesImage}
                alt="Eagles Football Club Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              
              {/* Quote overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12">
                <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-lg shadow-2xl border border-white/20">
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 italic leading-relaxed font-medium">
                    "More than a club—it's a vision for the future of soccer in Nebraska, dedicated to developing players and fostering a love for the beautiful game."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AboutEagles;