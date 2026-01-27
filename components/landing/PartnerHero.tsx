"use client"
import { useState, useEffect } from "react";
import { getSiteImage } from '@/lib/site-images';

const partnerImage = getSiteImage("/photos/IMG_3654.JPG")

const PartnerHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const formElement = document.getElementById('partnership-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative w-full min-h-[90vh] flex items-center text-white overflow-hidden" style={{ backgroundImage: `url(${partnerImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* Dramatic dark overlay */}
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.85) 50%, rgba(0, 0, 0, 0.9) 100%)' }}></div>
      
      {/* Animated gold gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#BD9B58]/10 via-transparent to-[#BD9B58]/10 z-10 animate-pulse"></div>
      
      {/* Spotlight effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#BD9B58]/5 rounded-full blur-[120px] z-10"></div>
      
      {/* Top gold accent line with glow */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent z-20 shadow-[0_0_20px_rgba(189,155,88,0.5)]"></div>
      
      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="max-w-4xl">
          {/* Eyebrow with line */}
          <div className={`flex items-center gap-4 mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
            <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">Elite Partnership Opportunities</span>
          </div>
          
          {/* Main headline */}
          <h1 className={`text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bebas font-black mb-8 uppercase tracking-wider leading-none transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="block text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]">BECOME A</span>
            <span className="block bg-gradient-to-r from-[#BD9B58] via-[#D4AF37] to-[#BD9B58] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(189,155,88,0.6)]">PARTNER</span>
          </h1>
          
          {/* Description */}
          <p className={`text-gray-300 text-xl md:text-2xl leading-relaxed mb-12 max-w-2xl transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Join forces with <span className="text-white font-bold">Eagles FC</span>, one of the fastest-growing soccer clubs in Nebraska. Connect with our passionate community and elevate your brand.
          </p>
          
          {/* CTA Buttons */}
          <div className={`flex flex-wrap gap-6 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <a 
              href="#partnership-form" 
              onClick={scrollToForm}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#BD9B58] text-black font-bold text-lg px-10 py-5 transition-all duration-500 shadow-[0_0_30px_rgba(189,155,88,0.3)] hover:shadow-[0_0_50px_rgba(189,155,88,0.6)] uppercase tracking-wider overflow-hidden"
            >
              <span className="relative z-10">Get Started Today</span>
              <svg 
                className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </a>

            <a 
              href="#partnership-benefits"
              className="group inline-flex items-center gap-3 bg-transparent border-2 border-[#BD9B58] hover:bg-[#BD9B58]/10 text-white font-bold text-lg px-10 py-5 transition-all duration-300 uppercase tracking-wider"
            >
              Learn More
              <svg 
                className="w-6 h-6 group-hover:translate-y-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Stats bar */}
          <div className={`mt-16 pt-8 border-t border-[#BD9B58]/30 flex flex-wrap gap-12 transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div>
              <div className="text-4xl font-bebas font-black text-[#BD9B58] mb-1">125+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Active Players</div>
            </div>
            <div>
              <div className="text-4xl font-bebas font-black text-[#BD9B58] mb-1">64K+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Monthly Visitors</div>
            </div>
            <div>
              <div className="text-4xl font-bebas font-black text-[#BD9B58] mb-1">773K+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Social Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom corner accent */}
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-[#BD9B58]/50 z-20"></div>
    </div>
  );
};

export default PartnerHero;
