"use client";
import React from 'react';
import AboutEagles from '@/components/landing/AboutEagles';
import OurPhilosophy from '@/components/landing/OurPhilosophy';
import OurMission from '@/components/landing/OurMission';
import MiniNavbar from '@/components/landing/MiniNavbar';

const AboutUs = () => {
  return (
    <div className="max-w-full overflow-hidden bg-white">
        <MiniNavbar />
        <div className="space-y-0">
          <AboutEagles />
          <OurPhilosophy />
          <OurMission />
        </div>
    </div>
  );
};

export default AboutUs;
