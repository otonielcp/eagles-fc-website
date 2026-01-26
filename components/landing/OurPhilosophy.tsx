"use client";
import { motion } from "framer-motion";

const background = "/ourphilosophybg.png"

const OurPhilosophy = () => {
  const philosophyPoints = [
    {
      icon: <img src="/club/1.png" alt="Character" className="w-14 h-14 object-contain" />,
      title: "CHARACTER",
      description: "Developing technical, tactical, and mental skills."
    },
    {
      icon: <img src="/club/2.png" alt="Passion" className="w-14 h-14 object-contain" />,
      title: "PASSION",
      description: "Instilling discipline, humility, and teamwork."
    },
    {
      icon: <img src="/club/3.png" alt="Preparation" className="w-14 h-14 object-contain" />,
      title: "PREPARATION",
      description: "Cultivating a winning mindset."
    },
    {
      icon: <img src="/club/4.png" alt="Leadership" className="w-14 h-14 object-contain" />,
      title: "LEADERSHIP",
      description: "Fostering excellence and community pride."
    },
    {
      icon: <img src="/club/5.png" alt="Development" className="w-14 h-14 object-contain" />,
      title: "DEVELOPMENT",
      description: "Preparing players for success beyond soccer."
    },
  ];

  return (
    <div className="relative w-full bg-gradient-to-b from-gray-50 via-gray-100 to-white py-24 lg:py-32">
      
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-16">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#C5A464]"></div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A464] uppercase">Our Philosophy</span>
            <div className="w-8 h-[1px] bg-[#C5A464]"></div>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-6">
            Core <span className="text-[#C5A464]">Values</span>
          </h2>
          
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Five pillars that define our commitment to excellence and shape every player's journey
          </p>
        </motion.div>

        {/* Philosophy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {philosophyPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-white border border-gray-200 rounded-lg p-8 h-full flex flex-col items-center text-center transition-all duration-300 hover:border-[#C5A464] hover:shadow-xl hover:-translate-y-1">
                
                {/* Icon */}
                <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C5A464]/10 to-[#C5A464]/5 flex items-center justify-center">
                    {point.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-900 mb-4 uppercase group-hover:text-[#C5A464] transition-colors duration-300">
                  {point.title}
                </h3>

                {/* Description */}
                <p className="text-[14px] leading-[1.7] text-gray-600 font-light">
                  {point.description}
                </p>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#C5A464] group-hover:w-12 transition-all duration-300"></div>
              </div>

              {/* Number badge */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#C5A464] text-white text-sm font-bold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default OurPhilosophy;