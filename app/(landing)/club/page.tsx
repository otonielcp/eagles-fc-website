"use client";
import React from 'react';
import AboutEagles from '@/components/landing/AboutEagles';
import OurPhilosophy from '@/components/landing/OurPhilosophy';
import OurMission from '@/components/landing/OurMission';
import MiniNavbar from '@/components/landing/MiniNavbar';

const AboutUs = () => {
  return (
    <div className="max-w-full bg-white">
        <MiniNavbar />
        {/* mt-12 = space below fixed mini navbar (main navbar 80px + mini navbar ~48px = 128px, minus the pt-20 from wrapper = need mt-12) */}
        <div className="space-y-0 mt-12">
          <AboutEagles />
          <OurPhilosophy />
          <OurMission />
        </div>
    </div>
  );
};

export default AboutUs;
