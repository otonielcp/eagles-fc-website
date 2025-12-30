'use client';

import Image from 'next/image';

interface FooterLogoProps {
  logo: string;
}

const FooterLogo = ({ logo }: FooterLogoProps) => {
  return (
    <div className="md:col-span-3 flex justify-center md:justify-start">
      <div className="flex flex-col items-center md:items-start space-y-6 pt-8 md:pt-12">
        <div className="relative group">
          <Image 
            src={logo} 
            alt="Eagles FC Logo" 
            width={280}
            height={140}
            className="h-32 md:h-40 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105" 
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
              objectFit: 'contain'
            }}
            unoptimized
          />
        </div>
        <div className="text-center md:text-left mt-4">
          <p className="text-sm text-white/70 font-semibold uppercase tracking-wider mb-3">Eagles Football Club</p>
          <div className="w-20 h-[2px] bg-gradient-to-r from-[#BD9B58] to-transparent mx-auto md:mx-0"></div>
        </div>
      </div>
    </div>
  );
};

export default FooterLogo;

