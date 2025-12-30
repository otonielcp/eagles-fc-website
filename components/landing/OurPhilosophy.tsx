"use client";
import { motion } from "framer-motion";

const background = "/ourphilosophybg.png"

const OurPhilosophy = () => {
  const philosophyPoints = [
    {
      icon: <img src="/club/1.png" alt="Character" className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110" />,
      title: "CHARACTER",
      description: "Developing technical, tactical, and mental skills."
    },
    {
      icon: <img src="/club/2.png" alt="Passion" className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110" />,
      title: "PASSION",
      description: "Instilling discipline, humility, and teamwork."
    },
    {
      icon: <img src="/club/3.png" alt="Preparation" className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110" />,
      title: "PREPARATION",
      description: "Cultivating a winning mindset."
    },
    {
      icon: <img src="/club/4.png" alt="Leadership" className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110" />,
      title: "LEADERSHIP",
      description: "Fostering excellence and community pride."
    },
    {
      icon: <img src="/club/5.png" alt="Development" className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110" />,
      title: "DEVELOPMENT",
      description: "Preparing players for success beyond soccer."
    },
  ];

  return (
    <div className="relative w-full bg-cover bg-center py-28 px-4 sm:px-8 md:px-16 lg:px-20 overflow-hidden">
      {/* Enhanced background image with gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7)), url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Additional gradient overlay for better text contrast */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/30 to-transparent"></div>

      {/* Content with enhanced styling */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 border-2 border-[#C5A464] w-full max-w-5xl mx-auto bg-white shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-[#C5A464]">
          {philosophyPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center py-12 md:py-16 px-4 sm:px-6 relative group cursor-pointer hover:bg-gradient-to-b from-[#C5A464]/5 to-transparent transition-all duration-300"
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#C5A464]/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Icon container with enhanced styling */}
              <div className="relative mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-[#C5A464]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  {point.icon}
                </div>
              </div>
              
              {/* Title with enhanced typography */}
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 group-hover:text-[#C5A464] transition-colors duration-300 tracking-wide uppercase">
                {point.title}
              </h3>
              
              {/* Description with better spacing */}
              <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed px-2 group-hover:text-gray-700 transition-colors duration-300">
                {point.description}
              </p>
              
              {/* Decorative bottom accent on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C5A464] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OurPhilosophy;