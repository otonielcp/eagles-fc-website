"use client";
import { motion } from "framer-motion";

const ourmission1 = "/about-us/Image.png"
const ourmission2 = "/ourmission2.jpeg"

const OurMission = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Top Left - Team Image */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:block relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#C5A464]/20 to-transparent z-10 pointer-events-none"></div>
          <img 
            src={ourmission1} 
            alt="Team lineup" 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-[#C5A464] z-20"></div>
        </motion.div>

        {/* Top Right - Mission */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="p-8 sm:p-10 md:p-12 lg:p-16 text-right bg-white flex flex-col justify-center"
        >
          <div className="relative mb-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl font-playfair italic text-gray-800 mb-6 inline-block"
            >
              Our Mission
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "120px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute bottom-0 right-0 h-1 bg-gradient-to-l from-[#C5A464] to-transparent"
            ></motion.div>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base sm:text-lg text-gray-700 leading-relaxed font-light"
          >
            Our mission is to provide a premier soccer experience that emphasizes long-term development, teamwork, and personal growth. We aim to create a positive environment where everyone can thrive and reach their full potential.
          </motion.p>
        </motion.div>

        {/* Bottom Left - Vision */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="p-8 sm:p-10 md:p-12 lg:p-16 bg-white flex flex-col justify-center order-3 md:order-3"
        >
          <div className="relative mb-6">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#C5A464] to-transparent"
            ></motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl sm:text-4xl font-playfair italic text-gray-800 mb-6 pt-3"
            >
              Our Vision
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-base sm:text-lg text-gray-700 leading-relaxed font-light mb-6"
          >
            At Eagles FC, our vision is to set the standard for soccer excellence in Nebraska and beyond. We are dedicated to fostering a culture of ambition, integrity, and growth, ensuring that every player, coach, and community member is empowered through the game.
          </motion.p>
          <motion.ul 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4 text-sm sm:text-base text-gray-700 mb-6"
          >
            {[
              "Raising the Standard of Soccer - Leading the development of elite soccer in Nebraska by inspiring and elevating the level of play across all ages.",
              "Developing High-Performance Athletes - Providing a professional training environment that prepares players for success at the highest levels while emphasizing character and leadership.",
              "Expanding Opportunities - Creating pathways for players to compete at collegiate, professional, and international levels through elite coaching and competition."
            ].map((item, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className="flex items-start group"
              >
                <span className="text-[#C5A464] mr-3 text-xl font-bold mt-1 group-hover:scale-110 transition-transform">•</span>
                <span className="leading-relaxed font-light">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-base sm:text-lg text-gray-700 leading-relaxed font-light italic border-l-4 border-[#C5A464] pl-6 py-3 bg-gray-50/50"
          >
            Eagles FC is more than just a club—we are a movement dedicated to shaping the future of soccer while enriching the lives of those who share our passion for the game.
          </motion.p>
        </motion.div>

        {/* Bottom Right - Player Image */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="hidden md:block relative overflow-hidden group order-4 md:order-4"
        >
          <div className="absolute inset-0 bg-gradient-to-tl from-[#C5A464]/20 to-transparent z-10 pointer-events-none"></div>
          <img 
            src={ourmission2} 
            alt="Player in action" 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
          />
          {/* Decorative corner accent */}
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-[#C5A464] z-20"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default OurMission;
