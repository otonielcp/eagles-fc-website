"use client";

import { motion } from 'framer-motion';
import ProgramsHero from "@/components/landing/ProgramsHero";
import ProgramCard from "@/components/landing/ProgramCard";
import ProgramsPathway from "@/components/landing/ProgramsPathway";
import ProgramsCrest from "@/components/landing/ProgramsCrest";
import HistoryBar from "@/components/landing/HistoryBar";
import { getSiteImage } from '@/lib/site-images';

const Programs = () => {
  const programs = [
    {
      title: "RECREATIONAL",
      subtitle: "Programs",
      description: "Our Recreational Program is the perfect starting point for players of all skill levels who want to enjoy soccer in a fun, inclusive, and supportive environment. Designed to emphasize learning and enjoyment over competition, this program helps young athletes build confidence, make new friends, and develop a lifelong love for the game.",
      highlights: [
        "Skill Development: Introduction to dribbling, passing, shooting, and ball control.",
        "Teamwork & Sportsmanship: Players learn the value of cooperation, respect, and fair play.",
        "Small-Sided Games: Fun and engaging formats to maximize participation and touches on the ball.",
        "Active & Healthy Lifestyle: Encourages physical activity, coordination, and motor skill development."
      ],
      additionalInfo: "Whether your child is taking their first steps into soccer or simply looking for an enjoyable and structured playing experience, our Recreational Program provides the perfect balance of skill-building and fun. This program allows students to learn the game at their own pace while being part of a positive soccer community.",
      images: {
        main: "/recreational.jpeg"
      },
      imagePosition: "right" as const
    },
    {
      title: "JUNIOR ACADEMY",
      subtitle: "Programs",
      description: "Our Junior Academy is the foundation of Eagles FC's player development pathway, designed to introduce young athletes to structured training in a fun, engaging, and supportive environment. At this critical stage, players develop essential technical skills while gaining a deeper understanding of the game.",
      highlights: [
        "Technical Development: Dribbling, passing, ball control, and shooting fundamentals.",
        "Motor Skills & Coordination: Enhancing agility, balance, and reaction time through age-appropriate drills.",
        "Game Awareness: Learning movement, positioning, and decision-making in small-sided games.",
        "Confidence & Enjoyment: Encouraging creativity, teamwork, and a lifelong love for soccer."
      ],
      additionalInfo: "The Junior Academy is not just about skill building—it's about developing a passion for the game and preparing young players for long-term success. Our expert coaches use age-appropriate training methods to ensure each child learns, grows, and enjoys the game in a positive and nurturing atmosphere. For players looking to advance into competitive soccer, the Junior Academy provides the technical foundation and game awareness needed to transition into higher levels of play.",
      images: {
        main: "/junior-main.jpeg",
        secondary: getSiteImage("/photos/IMG_2897.JPG")
      },
      imagePosition: "left" as const
    },
    {
      title: "SELECT",
      subtitle: "Program",
      description: "The Select Program of Eagles FC's premier youth development pathway, designed for highly skilled and committed players who aspire to compete at the highest levels. This program provides an intensive training environment, ensuring players have the technical, tactical, and physical foundation needed to succeed in collegiate, semi-professional, and professional soccer.",
      highlights: [
        "Elite Level Coaching: Sessions led by experienced, licensed coaches focused on advanced skill development and tactical awareness.",
        "College & Pro Exposure: Opportunities to compete in national tournaments, showcases, and scouting events.",
        "High-Performance Training: Access to strength & conditioning programs, video analysis, and individualized development plans.",
        "USYS National League: Compete in the USYS National League against top-tier teams, preparing for the next level of play."
      ],
      additionalInfo: "The Select Program is the bridge between youth soccer and the next stage of your soccer career. Our teams compete in the USYS National League, the premier youth soccer league in the United States, providing players with high-level competition and exposure to college and professional scouts. Players in this program train and compete at the highest standards, ensuring they are ready to succeed on and off the field.",
      images: {
        main: "/select-main.jpeg",
        secondary: getSiteImage("/photos/IMG_3585.JPG")
      },
      imagePosition: "right" as const
    }
  ];

  return (
    <div className="max-w-full overflow-hidden bg-white">
      <ProgramsHero />
      
      {/* Programs Section with Premium Design */}
      <div className="relative bg-white py-32">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-[1px] bg-[#C5A464]"></div>
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A464] uppercase">Choose Your Path</span>
              <div className="w-8 h-[1px] bg-[#C5A464]"></div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl font-black text-gray-900 mb-6"
            >
              Programs Built for <span className="text-[#C5A464]">Champions</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Every program is carefully designed to maximize player potential at every stage of development
            </motion.p>
          </div>
        </div>

        {/* Program Cards */}
        <div className="space-y-12 md:space-y-16 lg:space-y-20">
          {programs.map((program, index) => (
            <ProgramCard
              key={program.title}
              {...program}
              index={index}
            />
          ))}
        </div>
      </div>

      <HistoryBar />
    </div>
  );
};

export default Programs;
