"use client"
import { useEffect, useRef, useState } from "react";

const PartnershipBenefits = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const benefits = [
    {
      title: "Brand Visibility",
      description: "Showcase your brand to thousands of players, families, and soccer enthusiasts across Nebraska.",
      icon: "🎯",
      number: "01"
    },
    {
      title: "Community Engagement",
      description: "Connect with a passionate, family-oriented community that values excellence and teamwork.",
      icon: "👥",
      number: "02"
    },
    {
      title: "Marketing Exposure",
      description: "Logo placement on jerseys, banners, social media platforms with 773K+ combined annual views, and our website reaching 64K+ monthly visitors.",
      icon: "📱",
      number: "03"
    },
    {
      title: "Exclusive Access",
      description: "VIP access to matches, special events, and networking opportunities with local businesses.",
      icon: "⭐",
      number: "04"
    },
    {
      title: "Social Impact",
      description: "Support youth development, leadership, and competitive soccer in the local community.",
      icon: "⚽",
      number: "05"
    },
    {
      title: "Flexible Packages",
      description: "Customizable partnership tiers to fit your business goals and budget.",
      icon: "📊",
      number: "06"
    }
  ];

  return (
    <>
      {/* Benefits Section - Elite Pro Club Style */}
      <div ref={sectionRef} className="w-full py-32 px-6 relative overflow-hidden bg-white">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#BD9B58 1px, transparent 1px), linear-gradient(90deg, #BD9B58 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Premium Header */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
              <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">Why Partner With Us</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas font-black text-black uppercase tracking-wider mb-6">
              PARTNERSHIP <span className="text-[#BD9B58]">BENEFITS</span>
            </h2>
            <p className="text-gray-700 text-xl max-w-2xl leading-relaxed">
              Join an elite network of brands supporting Nebraska's premier soccer club
            </p>
          </div>

          {/* Premium Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className={`group relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card */}
                <div className="relative h-full bg-white border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
                  {/* Top gold accent bar */}
                  <div className={`h-1 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] transition-all duration-500 ${
                    hoveredCard === index ? 'w-full' : 'w-0'
                  }`}></div>
                  
                  {/* Card content */}
                  <div className="p-10 relative">
                    {/* Large number watermark */}
                    <div className="absolute top-4 right-4 text-8xl font-bebas font-black text-[#BD9B58]/10 leading-none">
                      {benefit.number}
                    </div>
                    
                    {/* Icon */}
                    <div className="mb-8 relative z-10">
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#BD9B58]/10 to-[#BD9B58]/5 transition-all duration-500 ${
                        hoveredCard === index ? 'scale-110 bg-[#BD9B58]/20' : ''
                      }`}>
                        <span className="text-5xl">{benefit.icon}</span>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bebas font-bold text-black mb-4 uppercase tracking-wider relative z-10">
                      {benefit.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed relative z-10">
                      {benefit.description}
                    </p>

                    {/* Bottom corner accent */}
                    <div className={`absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#BD9B58] transition-all duration-500 ${
                      hoveredCard === index ? 'opacity-100' : 'opacity-0'
                    }`}></div>
                  </div>

                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-[#BD9B58]/0 via-[#BD9B58]/0 to-[#BD9B58]/5 transition-opacity duration-500 ${
                    hoveredCard === index ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section - World Class Design */}
      <div className="w-full py-32 px-6 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        {/* Dramatic spotlight effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#BD9B58]/10 rounded-full blur-[150px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Stats Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-[#BD9B58]"></div>
              <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">Our Reach</span>
              <div className="w-12 h-[2px] bg-[#BD9B58]"></div>
            </div>
            <h3 className="text-5xl md:text-6xl font-bebas font-black text-white uppercase tracking-tight mb-6">
              IMPACT IN <span className="text-[#BD9B58]">NUMBERS</span>
            </h3>
            <p className="text-gray-400 text-xl">Connecting with thousands across Nebraska and beyond</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "125+", title: "Active Players", subtitle: "Across all age groups" },
              { number: "64K+", title: "Monthly Website Visitors", subtitle: "High engagement rate" },
              { number: "773K+", title: "Social Media Views", subtitle: "Facebook & TikTok combined" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group relative"
                style={{
                  animation: isVisible ? `fadeInUp 0.8s ease-out ${index * 0.2}s both` : 'none'
                }}
              >
                {/* Card */}
                <div className="relative bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] p-12 overflow-hidden">
                  {/* Top border animation */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent"></div>
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#BD9B58]/0 to-[#BD9B58]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 text-center">
                    {/* Number */}
                    <div className="text-7xl md:text-8xl lg:text-9xl font-bebas font-black mb-6 bg-gradient-to-br from-[#BD9B58] via-[#D4AF37] to-[#BD9B58] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(189,155,88,0.3)] group-hover:drop-shadow-[0_0_50px_rgba(189,155,88,0.5)] transition-all duration-500">
                      {stat.number}
                    </div>
                    
                    {/* Title */}
                    <div className="text-2xl font-bebas text-white uppercase tracking-wider mb-3">
                      {stat.title}
                    </div>
                    
                    {/* Subtitle */}
                    <div className="text-sm text-gray-500 uppercase tracking-widest">
                      {stat.subtitle}
                    </div>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#BD9B58]/30"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#BD9B58]/30"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default PartnershipBenefits;
