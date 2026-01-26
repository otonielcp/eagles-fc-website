"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Slider, GameSliderData } from "@/types/slider";
import { getActiveSliders } from "@/actions/slider";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

// Countdown Timer Component
interface CountdownProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isValidDate, setIsValidDate] = useState(true);

  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    if (!targetDate) {
      return null;
    }

    const target = new Date(targetDate).getTime();

    // Check if date is valid
    if (isNaN(target)) {
      return null;
    }

    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }, [targetDate]);

  useEffect(() => {
    // Check if date is valid first
    if (!targetDate) {
      setIsValidDate(false);
      return;
    }

    const target = new Date(targetDate).getTime();
    if (isNaN(target)) {
      setIsValidDate(false);
      return;
    }

    setIsValidDate(true);

    // Initial calculation
    const initial = calculateTimeLeft();
    if (initial) {
      setTimeLeft(initial);
      setIsExpired(false);
    } else {
      setIsExpired(true);
    }

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      if (newTimeLeft) {
        setTimeLeft(newTimeLeft);
      } else {
        setIsExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, targetDate]);

  // If date is invalid, don't show anything
  if (!isValidDate) {
    return null;
  }

  if (isExpired) {
    return (
      <motion.div
        className="text-[#BD9B58] text-xl md:text-2xl font-bebas tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        MATCH DAY!
      </motion.div>
    );
  }

  if (!timeLeft) {
    return null;
  }

  const timeUnits = [
    { value: timeLeft.days, label: "DAYS" },
    { value: timeLeft.hours, label: "HRS" },
    { value: timeLeft.minutes, label: "MIN" },
    { value: timeLeft.seconds, label: "SEC" },
  ];

  return (
    <div className="flex items-center gap-2 md:gap-4">
      {timeUnits.map((unit, index) => (
        <React.Fragment key={unit.label}>
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="bg-black/50 backdrop-blur-sm border border-[#BD9B58]/30 rounded-lg px-3 py-2 md:px-4 md:py-3 min-w-[50px] md:min-w-[70px]">
              <motion.span
                key={unit.value}
                className="text-2xl md:text-4xl font-bebas text-white block text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {String(unit.value).padStart(2, "0")}
              </motion.span>
            </div>
            <span className="text-[10px] md:text-xs text-[#BD9B58] mt-1 font-semibold tracking-wider">
              {unit.label}
            </span>
          </motion.div>
          {index < timeUnits.length - 1 && (
            <motion.span
              className="text-[#BD9B58] text-2xl md:text-3xl font-bold mb-4"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              :
            </motion.span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Animated Background Component (removed)
const AnimatedBackground = () => {
  return null;
};

// Extended slide type for internal use
interface SlideData {
  type: "text" | "game";
  title: string;
  content: string;
  image: string;
  link: string;
  buttonText: string;
  _id?: string;
  gameData?: GameSliderData;
}

const HeroSection = () => {
  const [slides, setSlides] = useState<SlideData[]>([]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  // Refs for GSAP animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gameContentRef = useRef<HTMLDivElement>(null);

  // Fetch sliders from database
  useEffect(() => {
    async function fetchSliders() {
      try {
        const slidersData = await getActiveSliders();

        if (slidersData.length > 0) {
          const formattedSlides: SlideData[] = slidersData.map(slider => ({
            type: slider.type || "text",
            title: slider.title?.toUpperCase() || "",
            content: slider.content || "",
            image: slider.image,
            link: slider.link,
            buttonText: slider.buttonText || "READ MORE",
            _id: slider._id,
            gameData: slider.gameData,
          }));
          setSlides(formattedSlides);
        }
      } catch (error) {
        console.error("Error fetching sliders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSliders();
  }, []);

  // Get current slide data (safe access with optional chaining)
  const currentSlideData = slides[currentSlide];
  const isGameSlide = currentSlideData?.type === "game";

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
    // Don't animate if no slides or still loading
    if (slides.length === 0 || loading || !currentSlideData) return;

    if (isGameSlide) {
      // Animate game content
      if (gameContentRef.current) {
        gsap.fromTo(
          gameContentRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );
      }
      return;
    }

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
  }, [currentSlide, isGameSlide]);

  // Auto-play slider with different durations for game vs text slides
  useEffect(() => {
    if (slides.length <= 1 || loading) {
      return;
    }

    // Game slides get more time (15 seconds) to show all the animations and info
    // Text slides get standard time (8 seconds)
    const isCurrentGameSlide = currentSlideData?.type === "game";
    const slideInterval = isCurrentGameSlide ? 15000 : 8000;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, slideInterval);

    return () => {
      clearInterval(interval);
    };
  }, [slides.length, loading, currentSlide, currentSlideData?.type]);

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

  // Render Game Slide Content
  const renderGameSlide = () => {
    const gameData = currentSlideData.gameData;
    if (!gameData) return null;

    return (
      <div ref={gameContentRef} className="z-10 w-full relative flex flex-col items-center">
        {/* League Logo - Center Top */}
        {gameData.leagueLogo && (
          <motion.div
            className="w-full flex justify-center mb-6"
            initial={{ opacity: 0, y: -50, scale: 0.5, rotateX: 90 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "backOut" }}
          >
            <motion.div
              className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 relative"
              animate={{
                filter: ["drop-shadow(0 0 20px rgba(189, 155, 88, 0.3))", "drop-shadow(0 0 40px rgba(189, 155, 88, 0.6))", "drop-shadow(0 0 20px rgba(189, 155, 88, 0.3))"]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={gameData.leagueLogo}
                alt="League"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Countdown Timer */}
        {gameData.matchDate && (
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <Countdown targetDate={gameData.matchDate} />
          </motion.div>
        )}

        {/* Main Match Display */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Home Team - Left */}
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, x: -150, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <motion.div
              className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mb-4 relative"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              {/* Glowing ring around logo */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#BD9B58]/30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <img
                src={gameData.homeTeamLogo}
                alt={gameData.homeTeamName}
                className="w-full h-full object-contain drop-shadow-2xl relative z-10"
              />
            </motion.div>
            <motion.h3
              className="text-white text-xl md:text-2xl lg:text-3xl font-bebas tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {gameData.homeTeamName}
            </motion.h3>
          </motion.div>

          {/* Center - VS & Match Info */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 150 }}
          >
            <div className="relative mb-4">
              {/* Animated VS text with glow */}
              <motion.span
                className="text-4xl md:text-5xl lg:text-6xl font-bebas text-white tracking-wider relative z-10"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(189, 155, 88, 0.5)",
                    "0 0 40px rgba(189, 155, 88, 0.8)",
                    "0 0 20px rgba(189, 155, 88, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                VS
              </motion.span>
              {/* Multiple layered glowing effects */}
              <motion.div
                className="absolute -inset-6 bg-gradient-to-r from-[#BD9B58]/20 via-[#BD9B58]/40 to-[#BD9B58]/20 blur-2xl rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.7, 0.4],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -inset-4 bg-[#BD9B58]/30 blur-xl rounded-full"
                animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            {/* Match Time & Location - Center under VS */}
            <motion.div
              className="text-center mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              {gameData.matchTime && (
                <motion.p
                  className="text-[#BD9B58] text-lg md:text-xl font-semibold"
                  animate={{
                    textShadow: ["0 0 10px rgba(189, 155, 88, 0.3)", "0 0 20px rgba(189, 155, 88, 0.6)", "0 0 10px rgba(189, 155, 88, 0.3)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {gameData.matchTime.replace(/(\d{1,2}:\d{2}\s*(AM|PM)).*/i, '$1').replace(/^0/, '')}
                </motion.p>
              )}
              {gameData.matchLocation && (
                <p className="text-gray-400 text-sm md:text-base">
                  {gameData.matchLocation}
                </p>
              )}
            </motion.div>
          </motion.div>

          {/* Away Team - Right */}
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, x: 150, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <motion.div
              className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mb-4 relative"
              whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.3 }}
            >
              {/* Glowing ring around logo */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#BD9B58]/30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                  rotate: [360, 180, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <img
                src={gameData.awayTeamLogo}
                alt={gameData.awayTeamName}
                className="w-full h-full object-contain drop-shadow-2xl relative z-10"
              />
            </motion.div>
            <motion.h3
              className="text-white text-xl md:text-2xl lg:text-3xl font-bebas tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {gameData.awayTeamName}
            </motion.h3>
          </motion.div>
        </div>

        {/* Additional Content */}
        {currentSlideData.content && (
          <motion.p
            className="text-center text-gray-300 text-base md:text-lg mt-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {currentSlideData.content}
          </motion.p>
        )}

        {/* CTA Button */}
        <motion.div
          className="flex justify-center mt-16 md:mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Link href={currentSlideData.link}>
            <motion.button
              className="group relative px-12 py-6 bg-gradient-to-r from-[#BD9B58] to-[#d4b068] text-black text-base md:text-lg font-black tracking-[0.25em] overflow-hidden shadow-2xl rounded-full"
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
                {currentSlideData.buttonText}
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
        </motion.div>
      </div>
    );
  };

  // Render Text Slide Content
  const renderTextSlide = () => {
    return (
      <>
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
              {currentSlideData.title}
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
              {currentSlideData.content}
            </motion.p>
          </div>

          {/* CTA Button with Enhanced GSAP Animation */}
          <div ref={buttonRef} className="flex items-center gap-6 pt-8">
            <Link href={currentSlideData.link}>
              <motion.button
                className="group relative px-12 py-6 bg-gradient-to-r from-[#BD9B58] to-[#d4b068] text-black text-base md:text-lg font-black tracking-[0.25em] overflow-hidden shadow-2xl rounded-full"
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
                  {currentSlideData.buttonText}
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
      </>
    );
  };

  // Show loading state (after all hooks are called)
  if (loading) {
    return (
      <div className="relative h-screen overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #181819, #000000, #181819)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#BD9B58] mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Show message when no sliders exist (after all hooks are called)
  if (slides.length === 0) {
    return (
      <div className="relative h-screen overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #181819, #000000, #181819)' }}>
        <div className="text-center max-w-2xl px-6">
          <h1 className="text-5xl md:text-7xl font-bebas font-black text-white uppercase tracking-wider mb-6">
            EAGLES FC
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            No hero sliders have been created yet. Please add sliders from the admin panel to display content here.
          </p>
          <Link href="/admin/sliders" className="inline-block bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] text-black font-bold px-8 py-4 rounded uppercase tracking-wider hover:from-[#D4AF37] hover:to-[#BD9B58] transition-all duration-300">
            Go to Admin Panel
          </Link>
        </div>
      </div>
    );
  }

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
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.55) 50%, rgba(0, 0, 0, 0.4) 100%), url(${currentSlideData.image})`,
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

      {/* Player Images for Game Slides - Positioned at hero level */}
      {isGameSlide && currentSlideData.gameData && (
        <>
          {currentSlideData.gameData.leftPlayerImage && (
            <motion.div
              className="hidden lg:block absolute -left-20 xl:-left-32 2xl:-left-40 bottom-0 z-20 pointer-events-none"
              initial={{ opacity: 0, x: -200, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.3,
                type: "spring",
                stiffness: 50,
                damping: 15
              }}
            >
              <motion.img
                src={currentSlideData.gameData.leftPlayerImage}
                alt="Left Player"
                className="h-[550px] xl:h-[700px] 2xl:h-[800px] object-contain"
                style={{
                  filter: "drop-shadow(0 0 30px rgba(0,0,0,0.8)) drop-shadow(0 0 60px rgba(189, 155, 88, 0.3))"
                }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          )}

          {currentSlideData.gameData.rightPlayerImage && (
            <motion.div
              className="hidden lg:block absolute -right-20 xl:-right-32 2xl:-right-40 bottom-0 z-20 pointer-events-none"
              initial={{ opacity: 0, x: 200, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.3,
                type: "spring",
                stiffness: 50,
                damping: 15
              }}
            >
              <motion.img
                src={currentSlideData.gameData.rightPlayerImage}
                alt="Right Player"
                className="h-[550px] xl:h-[700px] 2xl:h-[800px] object-contain"
                style={{
                  filter: "drop-shadow(0 0 30px rgba(0,0,0,0.8)) drop-shadow(0 0 60px rgba(189, 155, 88, 0.3))"
                }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </motion.div>
          )}
        </>
      )}

      {/* Main Content Container */}
      <div className="relative h-full flex items-center pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-[1800px]">
          {isGameSlide ? (
            // Game Slide Layout - Centered
            <div className="flex items-center justify-center">
              {renderGameSlide()}
            </div>
          ) : (
            // Text Slide Layout - Two columns
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {renderTextSlide()}
            </div>
          )}
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
