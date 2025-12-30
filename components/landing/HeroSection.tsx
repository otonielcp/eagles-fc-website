"use client";
import React, { useState, useEffect, useRef } from "react";
import { News } from "@/types/news";
import { getLatestNews } from "@/actions/news";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

// Animated Background Component (removed)
const AnimatedBackground = () => {
  return null;
};

// Default hero content - Youth Focus
const defaultSlide = {
  title: "DEVELOPING TOMORROW'S CHAMPIONS TODAY",
  content: "At Eagles FC Youth, we provide a comprehensive development pathway for players aged U7-U19. Our focus is on building technical skills, tactical awareness, and character through professional coaching and competitive play.",
  image: "/heroimage1.jpeg",
  link: "/programs",
};

const HeroSection = () => {
  // Strip HTML tags from content - defined early
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const [slides, setSlides] = useState<Array<{
    title: string;
    content: string;
    image: string;
    link: string;
    _id?: string;
  }>>([defaultSlide]);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sideNews, setSideNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Refs for GSAP animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Fetch news items
  useEffect(() => {
    async function fetchNews() {
      try {
        const newsData = await getLatestNews(6);

        // Filter news with images for main slider
        const newsWithImages = newsData.filter(news => news.image);

        if (newsWithImages.length > 0) {
          const formattedSlides = newsWithImages.map(news => ({
            title: news.title.toUpperCase(),
            content: stripHtml(news.content).substring(0, 150) + "...",
            image: news.image,
            link: `/news/${news._id}`,
            _id: news._id,
          }));
          setSlides(formattedSlides);
        }
        
        // Set side news (all news)
        setSideNews(newsData.slice(0, 3));
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  // Different animation variants for each slide
  const getAnimationVariant = (slideIndex: number) => {
    const variants = [
      // Variant 0: 3D Rotation from bottom
      {
        title: { from: { opacity: 0, y: 100, rotationX: -90 }, to: { opacity: 1, y: 0, rotationX: 0, duration: 1.2, ease: "power4.out" } },
        content: { from: { opacity: 0, x: -50 }, to: { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" } },
        button: { from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" } }
      },
      // Variant 1: Slide from left
      {
        title: { from: { opacity: 0, x: -200 }, to: { opacity: 1, x: 0, duration: 1, ease: "power3.out" } },
        content: { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" } },
        button: { from: { opacity: 0, x: -100 }, to: { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" } }
      },
      // Variant 2: Zoom in with fade
      {
        title: { from: { opacity: 0, scale: 0.5, y: -50 }, to: { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" } },
        content: { from: { opacity: 0, scale: 1.2 }, to: { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" } },
        button: { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" } }
      },
      // Variant 3: Slide from right
      {
        title: { from: { opacity: 0, x: 200 }, to: { opacity: 1, x: 0, duration: 1, ease: "power4.out" } },
        content: { from: { opacity: 0, x: 100 }, to: { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" } },
        button: { from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" } }
      },
      // Variant 4: Bounce from top
      {
        title: { from: { opacity: 0, y: -150, scale: 0.8 }, to: { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "bounce.out" } },
        content: { from: { opacity: 0, y: -50 }, to: { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" } },
        button: { from: { opacity: 0, scale: 1.5 }, to: { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" } }
      },
      // Variant 5: Fade and slide
      {
        title: { from: { opacity: 0, x: -100 }, to: { opacity: 1, x: 0, duration: 1, ease: "power4.out" } },
        content: { from: { opacity: 0, x: -50 }, to: { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" } },
        button: { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.5)" } }
      }
    ];
    
    return variants[slideIndex % variants.length];
  };

  // GSAP animations on slide change with different variants
  useEffect(() => {
    if (!titleRef.current || !contentRef.current || !buttonRef.current) return;

    // Store refs in local variables to avoid null issues during cleanup
    const titleEl = titleRef.current;
    const contentEl = contentRef.current;
    const buttonEl = buttonRef.current;

    // Clear any existing transforms first
    gsap.set([titleEl, contentEl, buttonEl], { clearProps: "all" });

    const variant = getAnimationVariant(currentSlide);
    const tl = gsap.timeline({
      onComplete: () => {
        // Ensure final state is clean - check refs are still valid
        if (titleEl && contentEl && buttonEl) {
          gsap.set([titleEl, contentEl, buttonEl], { 
            clearProps: "transform,opacity" 
          });
        }
      }
    });
    
    tl.fromTo(
      titleEl,
      variant.title.from,
      { ...variant.title.to, force3D: true }
    )
    .fromTo(
      contentEl,
      variant.content.from,
      { ...variant.content.to, force3D: true },
      "-=0.6"
    )
    .fromTo(
      buttonEl,
      variant.button.from,
      { ...variant.button.to, force3D: true },
      "-=0.4"
    );

    return () => {
      tl.kill();
      // Check refs are still valid before clearing
      if (titleEl && contentEl && buttonEl) {
        gsap.set([titleEl, contentEl, buttonEl], { clearProps: "all" });
      }
    };
  }, [currentSlide]);

  // Auto-play slider
  useEffect(() => {
    if (slides.length <= 1 || loading) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [slides.length, loading]);

  // Format date - using fixed format for SSR consistency
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Navigation functions
  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const goToNextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  };

  const goToPrevSlide = () => {
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(prevIndex);
  };

  return (
    <div ref={heroRef} className="relative h-screen overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #181819, #000000, #181819)' }}>
      {/* Three.js Animated Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <AnimatedBackground />
      </div>

      {/* Background Images with Framer Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={(() => {
            const variants = [
              { opacity: 0, scale: 1.1 }, // Zoom out
              { opacity: 0, x: -100, scale: 1.05 }, // Slide from left
              { opacity: 0, scale: 0.8, rotate: 5 }, // Zoom in with rotation
              { opacity: 0, x: 100, y: -50 }, // Slide from right-top
              { opacity: 0, y: 100, scale: 1.2 }, // Slide from bottom with zoom
              { opacity: 0, rotateY: 90, scale: 0.9 } // 3D flip
            ];
            return variants[currentSlide % variants.length];
          })()}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, rotateY: 0 }}
          exit={(() => {
            const variants = [
              { opacity: 0, scale: 0.9 }, // Zoom in
              { opacity: 0, x: 100, scale: 0.95 }, // Slide to right
              { opacity: 0, scale: 1.2, rotate: -5 }, // Zoom out with rotation
              { opacity: 0, x: -100, y: 50 }, // Slide to left-bottom
              { opacity: 0, y: -100, scale: 0.8 }, // Slide to top with zoom
              { opacity: 0, rotateY: -90, scale: 1.1 } // 3D flip reverse
            ];
            return variants[currentSlide % variants.length];
          })()}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.65) 50%, rgba(0, 0, 0, 0.35) 100%), url(${slides[currentSlide].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        />
      </AnimatePresence>

      {/* Diagonal Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(189, 155, 88, 0.1) 10px,
            rgba(189, 155, 88, 0.1) 20px
          )`
        }}
      />

      {/* Main Content Container */}
      <div className="relative h-full flex items-center pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1800px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side - Main Content with GSAP Animations */}
            <div className="z-10 space-y-8 max-w-3xl">
              {/* Main Title with Enhanced GSAP Animation */}
              <div className="overflow-hidden relative">
                <motion.div
                  className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#BD9B58] to-transparent"
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <h1 
                  ref={titleRef}
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bebas tracking-tight leading-[0.9] relative"
                  style={{ 
                    perspective: "1000px",
                    textShadow: "0 0 40px rgba(189, 155, 88, 0.3)",
                    willChange: "transform, opacity",
                    backfaceVisibility: "hidden",
                    WebkitFontSmoothing: "antialiased"
                  }}
                >
                  {slides[currentSlide].title}
                </h1>
        </div>

              {/* Description with Enhanced GSAP Animation */}
              <div className="overflow-hidden relative">
                <motion.div
                  className="absolute left-0 top-0 w-20 h-px bg-[#BD9B58]"
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                />
                <motion.p 
                  ref={contentRef}
                  className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl font-light pt-6"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  style={{
                    willChange: "transform, opacity",
                    backfaceVisibility: "hidden"
                  }}
                >
                  {slides[currentSlide].content}
                </motion.p>
            </div>

              {/* CTA Button with Enhanced GSAP Animation */}
              <div ref={buttonRef} className="flex items-center gap-6 pt-8">
                <Link href={slides[currentSlide].link}>
                  <motion.button 
                    className="group relative px-12 py-6 bg-gradient-to-r from-[#BD9B58] to-[#d4b068] text-black text-base md:text-lg font-black tracking-[0.25em] overflow-hidden shadow-2xl"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 96% 100%, 0% 100%)"
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.4, type: "spring" }}
                    whileHover={{ 
                      scale: 1.08,
                      boxShadow: "0 0 60px rgba(189, 155, 88, 1), 0 10px 40px rgba(0, 0, 0, 0.5)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Animated gradient overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
                      animate={{
                        x: ["-100%", "200%"]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    {/* Pulsing glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-[#BD9B58] blur-xl opacity-50"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    <span className="relative z-10 flex items-center gap-4 drop-shadow-lg">
                      READ MORE
                      <motion.span
                        className="text-xl"
                        animate={{ x: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </span>
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Right Side - 3D Visual Element */}
            <motion.div 
              className="hidden lg:block relative h-[600px]"
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
            >
              {/* Three.js Enhanced Background */}
              <div className="absolute inset-0 opacity-40">
                <AnimatedBackground />
              </div>

              {/* Particle Effect with Different Animations per Slide */}
              {[...Array(15)].map((_, i) => {
                // Different particle animation patterns based on slide
                const particleVariants = [
                  { y: [0, -50, 0], x: [0, 0, 0], rotate: [0, 0, 0] }, // Vertical bounce
                  { y: [0, -30, 0], x: [-20, 20, -20], rotate: [0, 180, 360] }, // Diagonal with rotation
                  { y: [0, 30, 0], x: [0, 0, 0], scale: [0, 2, 0] }, // Vertical expand
                  { y: [0, 0, 0], x: [-40, 40, -40], rotate: [0, -180, -360] }, // Horizontal swing
                  { y: [-20, 20, -20], x: [-20, 20, -20], scale: [1, 1.5, 1] }, // Circular motion
                  { y: [0, -60, 0], x: [10, -10, 10], rotate: [0, 360, 720] } // Spiral up
                ];
                const variant = particleVariants[currentSlide % particleVariants.length];
                
                return (
                  <motion.div
                    key={`${currentSlide}-particle-${i}`}
                    className="absolute w-2 h-2 bg-[#BD9B58] rounded-full"
                    style={{
                      left: `${(i * 37) % 100}%`,
                      top: `${(i * 53) % 100}%`,
                    }}
                    animate={{
                      ...variant,
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + (i % 3),
                      repeat: Infinity,
                      delay: (i % 5) * 0.4,
                      ease: "easeInOut"
                    }}
                  />
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows with Framer Motion */}
      {slides.length > 1 && (
        <>
          <motion.button
            onClick={goToPrevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-white p-3 rounded-full backdrop-blur-sm"
            aria-label="Previous slide"
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "rgba(189, 155, 88, 0.9)",
              boxShadow: "0 0 20px rgba(189, 155, 88, 0.5)"
            }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            onClick={goToNextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-white p-3 rounded-full backdrop-blur-sm"
            aria-label="Next slide"
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "rgba(189, 155, 88, 0.9)",
              boxShadow: "0 0 20px rgba(189, 155, 88, 0.5)"
            }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </>
      )}

      {/* Enhanced Slider Dots Navigation */}
      {slides.length > 1 && (
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 backdrop-blur-md px-4 py-3 rounded-full border border-white/10"
          style={{ backgroundColor: 'rgba(24, 24, 25, 0.4)' }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative rounded-full overflow-hidden ${
                index === currentSlide 
                  ? 'bg-gradient-to-r from-[#BD9B58] to-[#d4b068] shadow-lg shadow-[#BD9B58]/50' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              animate={{
                width: index === currentSlide ? 40 : 10,
                height: 10,
              }}
              whileHover={{ 
                scale: 1.1,
                height: 12
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25 
              }}
              aria-label={`Go to slide ${index + 1}`}
            >
              {/* Shimmer effect on active dot */}
              {index === currentSlide && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ["-100%", "200%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      )}

    </div>
  );
};

export default HeroSection;
