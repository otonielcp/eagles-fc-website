"use client";
import { motion } from "framer-motion";

const ourmission1 = "/about-us/Image.png"
const ourmission2 = "/ourmission2.jpeg"

const OurMission = () => {
  return (
    <div className="relative w-full bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 min-h-[85vh]">
          
          {/* Image Left */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[60vh] lg:h-auto order-1"
          >
            <div className="absolute inset-0">
              <img
                src={ourmission1}
                alt="Eagles FC Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            </div>
          </motion.div>

          {/* Content Right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-24 py-16 lg:py-20 order-2 bg-white"
          >
            <div className="max-w-xl">
              {/* Label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-[1px] bg-[#C5A464]"></div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A464] uppercase">Mission</span>
              </div>

              {/* Title */}
              <h2 className="text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-10 leading-[1.05]">
                Our<br/>
                <span className="text-[#C5A464]">Mission</span>
              </h2>

              {/* Description */}
              <p className="text-lg leading-[1.8] text-gray-700 font-light mb-8">
                Our mission is to provide a premier soccer experience that emphasizes <strong className="font-semibold text-gray-900">long-term development, teamwork, and personal growth</strong>. We aim to create a positive environment where everyone can thrive and reach their full potential.
              </p>

              {/* Accent line */}
              <div className="w-20 h-[2px] bg-[#C5A464]"></div>
            </div>
          </motion.div>

        </div>

        {/* Vision Section */}
        <div className="grid lg:grid-cols-2 min-h-[85vh]">
          
          {/* Content Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-24 py-16 lg:py-20 order-2 lg:order-1 bg-white"
          >
            <div className="max-w-xl lg:ml-auto">
              {/* Label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-[1px] bg-[#C5A464]"></div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A464] uppercase">Vision</span>
              </div>

              {/* Title */}
              <h2 className="text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-10 leading-[1.05]">
                Our<br/>
                <span className="text-[#C5A464]">Vision</span>
              </h2>

              {/* Description */}
              <p className="text-lg leading-[1.8] text-gray-700 font-light mb-10">
                At Eagles FC, our vision is to set the standard for soccer excellence in Nebraska and beyond. We are dedicated to fostering a culture of <strong className="font-semibold text-gray-900">ambition, integrity, and growth</strong>, ensuring that every player, coach, and community member is empowered through the game.
              </p>

              {/* Vision Points */}
              <div className="space-y-5 mb-10">
                {[
                  {
                    title: "Raising the Standard of Soccer",
                    desc: "Leading the development of elite soccer in Nebraska by inspiring and elevating the level of play across all ages."
                  },
                  {
                    title: "Developing High-Performance Athletes",
                    desc: "Providing a professional training environment that prepares players for success at the highest levels while emphasizing character and leadership."
                  },
                  {
                    title: "Expanding Opportunities",
                    desc: "Creating pathways for players to compete at collegiate, professional, and international levels through elite coaching and competition."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C5A464] mt-2.5 group-hover:scale-150 transition-transform duration-300"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1.5">{item.title}</h4>
                        <p className="text-[15px] leading-[1.7] text-gray-600 font-light">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <div className="relative pl-6 border-l-2 border-[#C5A464] py-2">
                <p className="text-[15px] leading-[1.7] text-gray-800 italic font-light">
                  Eagles FC is more than just a club—we are a movement dedicated to shaping the future of soccer while enriching the lives of those who share our passion for the game.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Image Right */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[60vh] lg:h-auto order-1 lg:order-2"
          >
            <div className="absolute inset-0">
              <img
                src={ourmission2}
                alt="Eagles FC Player"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-transparent"></div>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default OurMission;
