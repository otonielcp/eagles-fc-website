"use client";
import React from 'react';
import AboutEagles from '@/components/landing/AboutEagles';
import OurPhilosophy from '@/components/landing/OurPhilosophy';
import OurMission from '@/components/landing/OurMission';

const AboutUs = () => {
  return (
    <div className="max-w-full bg-white">
        <div className="space-y-0">
          <AboutEagles />
          <OurPhilosophy />
          <OurMission />
        </div>
    </div>
  );
};

export default AboutUs;
