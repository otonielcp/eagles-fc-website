"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

interface ProgramCardProps {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  additionalInfo?: string;
  images: {
    main: string;
    secondary?: string;
  };
  imagePosition?: 'left' | 'right';
  index: number;
}

const ProgramCard = ({
  title,
  subtitle,
  description,
  highlights,
  additionalInfo,
  images,
  imagePosition = 'right',
  index,
}: ProgramCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            if (cardRef.current) {
              gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 60 },
                { 
                  opacity: 1, 
                  y: 0, 
                  duration: 1.2, 
                  ease: "power4.out",
                  delay: index * 0.15
                }
              );
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisible, index]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x - 0.5);
    mouseY.set(y - 0.5);
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div 
      ref={cardRef}
      className="w-full py-8 md:py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="relative group"
          style={{
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            transformStyle: "preserve-3d",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute -inset-4 bg-gradient-to-r from-[#C5A464]/20 via-[#C5A464]/10 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
          />

          <div className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100/50 backdrop-blur-sm ${
            imagePosition === 'right' ? '' : ''
          }`}>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${imagePosition === 'right' ? '' : 'lg:flex-row-reverse'}`}>
              
              {/* Image Section - Premium */}
              <div 
                ref={imageRef}
                className={`relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden ${
                  imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <img
                    src={images.main}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Multi-layer overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#C5A464]/0 via-transparent to-[#C5A464]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Animated shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: isHovered ? ['-100%', '200%'] : '-100%',
                  }}
                  transition={{
                    duration: 2,
                    repeat: isHovered ? Infinity : 0,
                    repeatDelay: 3,
                    ease: "linear"
                  }}
                />

                {/* Title Overlay - Premium Typography */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="mb-3">
                      <span className="text-xs font-bold text-[#C5A464] uppercase tracking-[0.3em]">
                        {subtitle}
                      </span>
                    </div>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-4 tracking-tight">
                      <span className="block bg-gradient-to-r from-white via-white to-[#C5A464] bg-clip-text text-transparent">
                        {title}
                      </span>
                    </h2>
                  </motion.div>
                </div>

                {/* Secondary Image - Floating Badge */}
                {images.secondary && (
                  <motion.div
                    className={`absolute ${imagePosition === 'right' ? 'top-8 right-8' : 'top-8 left-8'} w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90 backdrop-blur-sm`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ 
                      opacity: isVisible ? 1 : 0, 
                      scale: isVisible ? 1 : 0.8,
                      rotate: isVisible ? 0 : -10
                    }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6, type: "spring" }}
                  >
                    <img
                      src={images.secondary}
                      alt={`${title} secondary`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </motion.div>
                )}

                {/* Decorative corner elements */}
                <div className={`absolute ${imagePosition === 'right' ? 'top-6 left-6' : 'top-6 right-6'} w-16 h-16 border-2 border-white/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-12`}></div>
              </div>

              {/* Content Section - Premium */}
              <div className={`p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white via-gray-50/50 to-white ${
                imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'
              }`}>
                {/* Description */}
                <motion.p
                  className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                >
                  {description}
                </motion.p>

                {/* Highlights - Premium Grid */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-gradient-to-b from-[#C5A464] to-[#A8824B] rounded-full"></div>
                    <h3 className="font-bold text-gray-900 text-xl tracking-tight">Program Highlights</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {highlights.map((highlight, idx) => {
                      const [label, ...textParts] = highlight.split(':');
                      const text = textParts.join(':');
                      return (
                        <motion.div
                          key={idx}
                          className="flex items-start gap-4 group/item p-4 rounded-xl hover:bg-gradient-to-r hover:from-[#C5A464]/5 hover:to-transparent transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
                          transition={{ delay: 0.6 + index * 0.1 + idx * 0.1, duration: 0.5 }}
                          whileHover={{ x: 4 }}
                        >
                          <motion.div
                            className="flex-shrink-0 mt-1"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C5A464] via-[#C5A464] to-[#A8824B] flex items-center justify-center shadow-lg group-hover/item:shadow-xl group-hover/item:scale-110 transition-all duration-300">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </motion.div>
                          <div className="flex-1">
                            <span className="text-gray-900 font-semibold text-base block mb-1">{label}:</span>
                            {text && <span className="text-gray-600 text-sm leading-relaxed">{text}</span>}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Additional Info - Elegant */}
                {additionalInfo && (
                  <motion.div
                    className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#C5A464]/10 via-[#C5A464]/5 to-transparent border border-[#C5A464]/20 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  >
                    <h4 className="font-bold text-gray-900 text-lg mb-3 tracking-tight">
                      {title === 'SELECT' ? 'Pathway to the Next Level' : 
                       title === 'JUNIOR ACADEMY' ? 'Building the Future of Soccer' :
                       'A Program for Everyone'}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed font-light">
                      {additionalInfo}
                    </p>
                  </motion.div>
                )}

                {/* CTA Button - Premium */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                >
                  <motion.button
                    className="group relative w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[#C5A464] via-[#C5A464] to-[#A8824B] text-white font-bold text-base rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <span>SIGN UP</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "linear"
                      }}
                    />
                    {/* Hover gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#A8824B] via-[#C5A464] to-[#A8824B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </motion.button>
                </motion.div>
              </div>
            </div>

            {/* Decorative border glow */}
            <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-[#C5A464]/0 via-[#C5A464]/20 to-[#C5A464]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProgramCard;
