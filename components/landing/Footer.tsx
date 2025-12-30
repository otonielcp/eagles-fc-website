import Link from 'next/link';
import Image from 'next/image';
import FooterLogo from './FooterLogo';
const logo = "/footerlogo1.png"
const footerimage = "/footerimage.jpeg"
import { FaInstagram, FaTwitter, FaYoutube, FaFacebook } from 'react-icons/fa6';
import { getPortfolioLogosByCategory } from '@/actions/sponsorsLogo';
import { PortfolioLogo } from '@/types/sponsorsLogo';

const Footer = async () => {
  const footerLogos: PortfolioLogo[] = await getPortfolioLogosByCategory('Footer');
  const memberLogos: string[] = [
    "/clublogos/image1.png",
    "/clublogos/image2.png",
    "/clublogos/image3.png",
    "/clublogos/image4.png"
  ]
  const matchLinks = [
    { name: 'Fixtures', href: '/fixtures' },
    { name: 'Results', href: '/results' },
    { name: 'Standings', href: '/tables' },
  ];

  const teamLinks = [
    { name: 'U - 15 Boys', href: '/u15' },
    { name: 'U - 14 Girls', href: '/u14girls' },
    { name: 'U - 13 Boys', href: '/u13boys' },
    { name: 'U - 11 Boys', href: '/u11boys' },
  ];

  const quickLinks = [
    { name: 'About', to: '/club' },
    { name: 'News', to: '/news' },
    { name: 'Coaches', to: '/coaches' },
    { name: 'Teams', to: '/teams' },
    { name: 'Contact us', to: '/ticketing' },
  ];

  return (
    <footer 
      className="relative bg-cover bg-center text-white overflow-hidden"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.95), rgba(24, 24, 25, 0.92), rgba(0, 0, 0, 0.95)), url(${footerimage})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#BD9B58]/5 to-[#BD9B58]/10 opacity-50"></div>
      
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent"></div>
      {/* Top Sponsors/Partners Section */}
      {footerLogos.length > 0 && (
        <div className="py-16 md:py-20 border-b border-white/20 relative">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #BD9B58 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link href="/partners" className="block group">
              <div className="text-center mb-8">
                <p className="text-xs font-bold text-[#BD9B58] uppercase tracking-[0.3em] mb-2">Our Partners</p>
                <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent mx-auto"></div>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {footerLogos.map((logo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center h-16 md:h-20 px-6 py-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:border-[#BD9B58]/50 transition-all duration-500 group-hover:scale-110 hover:bg-white/10 hover:shadow-lg hover:shadow-[#BD9B58]/20"
                  >
                    <Image
                      src={logo.image}
                      alt={`Partner ${index + 1}`}
                      width={140}
                      height={80}
                      className="h-full w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="py-16 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            
            {/* Logo Section - Enhanced with Scroll Animation */}
            <FooterLogo logo={logo} />

            {/* Navigation Links Grid - Enhanced */}
            <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
              
              {/* Matches Section */}
              <div className="relative group">
                <div className="absolute -left-2 top-0 w-[2px] h-full bg-gradient-to-b from-[#BD9B58] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-6 font-bebas text-lg relative">
                  <span className="relative z-10">MATCHES</span>
                  <div className="absolute bottom-0 left-0 w-12 h-[2px] bg-gradient-to-r from-[#BD9B58] to-transparent"></div>
                </h3>
                <ul className="space-y-4">
                  {matchLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-sm text-white/70 hover:text-[#BD9B58] transition-all duration-300 flex items-center group/link"
                      >
                        <span className="w-0 group-hover/link:w-2 h-[2px] bg-[#BD9B58] mr-0 group-hover/link:mr-2 transition-all duration-300"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Teams Section */}
              <div className="relative group">
                <div className="absolute -left-2 top-0 w-[2px] h-full bg-gradient-to-b from-[#BD9B58] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-6 font-bebas text-lg relative">
                  <span className="relative z-10">TEAMS</span>
                  <div className="absolute bottom-0 left-0 w-12 h-[2px] bg-gradient-to-r from-[#BD9B58] to-transparent"></div>
                </h3>
                <ul className="space-y-4">
                  {teamLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-sm text-white/70 hover:text-[#BD9B58] transition-all duration-300 flex items-center group/link"
                      >
                        <span className="w-0 group-hover/link:w-2 h-[2px] bg-[#BD9B58] mr-0 group-hover/link:mr-2 transition-all duration-300"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Menu Section */}
              <div className="relative group">
                <div className="absolute -left-2 top-0 w-[2px] h-full bg-gradient-to-b from-[#BD9B58] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-6 font-bebas text-lg relative">
                  <span className="relative z-10">QUICK MENU</span>
                  <div className="absolute bottom-0 left-0 w-12 h-[2px] bg-gradient-to-r from-[#BD9B58] to-transparent"></div>
                </h3>
                <ul className="space-y-4">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.to} 
                        className="text-sm text-white/70 hover:text-[#BD9B58] transition-all duration-300 flex items-center group/link"
                      >
                        <span className="w-0 group-hover/link:w-2 h-[2px] bg-[#BD9B58] mr-0 group-hover/link:mr-2 transition-all duration-300"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Member Of & Socials Section - Enhanced */}
              <div className="relative group">
                <div className="absolute -left-2 top-0 w-[2px] h-full bg-gradient-to-b from-[#BD9B58] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-6 font-bebas text-lg relative">
                  <span className="relative z-10">MEMBER OF</span>
                  <div className="absolute bottom-0 left-0 w-12 h-[2px] bg-gradient-to-r from-[#BD9B58] to-transparent"></div>
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {memberLogos.map((logo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center h-14 bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-3 border border-white/10 hover:border-[#BD9B58]/50 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#BD9B58]/20 backdrop-blur-sm"
                    >
                      <Image
                        src={logo}
                        alt={`Member ${index + 1}`}
                        width={90}
                        height={56}
                        className="h-full w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
                
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-6 font-bebas text-lg relative mt-8">
                  <span className="relative z-10">FOLLOW US</span>
                  <div className="absolute bottom-0 left-0 w-12 h-[2px] bg-gradient-to-r from-[#BD9B58] to-transparent"></div>
                </h3>
                <div className="flex items-center gap-4">
                  <a 
                    href="https://www.facebook.com/eaglesnefc" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-[#1877F2] text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#1877F2]/50 border border-white/20 hover:border-[#1877F2] backdrop-blur-sm group"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                  <a 
                    href="https://www.instagram.com/eaglesnebraskafc/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50 border border-white/20 hover:border-transparent backdrop-blur-sm group"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                  <a 
                    href="https://www.youtube.com/@Eaglesnebraskafc" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-[#FF0000] text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#FF0000]/50 border border-white/20 hover:border-[#FF0000] backdrop-blur-sm group"
                    aria-label="YouTube"
                  >
                    <FaYoutube className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Enhanced */}
      <div className="border-t border-white/20 bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-sm relative">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(90deg, #BD9B58 1px, transparent 1px)`,
          backgroundSize: '20px 100%'
        }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright - Enhanced */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] bg-gradient-to-r from-[#BD9B58] to-transparent"></div>
              <p className="text-sm text-white/80 text-center md:text-left font-semibold">
                2025 © Copyright <span className="text-[#BD9B58] font-bold">EAGLES FC</span>
              </p>
              <div className="w-8 h-[2px] bg-gradient-to-l from-[#BD9B58] to-transparent"></div>
            </div>

            {/* Legal Links - Enhanced */}
            <div className="flex items-center gap-2 md:gap-4 text-xs">
              <Link 
                href="/terms" 
                className="px-4 py-2 text-white/70 hover:text-[#BD9B58] transition-all duration-300 font-bebas uppercase tracking-wider hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10"
              >
                Legal Terms
              </Link>
              <span className="text-white/20">•</span>
              <Link 
                href="/privacy-policy" 
                className="px-4 py-2 text-white/70 hover:text-[#BD9B58] transition-all duration-300 font-bebas uppercase tracking-wider hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10"
              >
                Privacy Policy
              </Link>
              <span className="text-white/20">•</span>
              <Link 
                href="/cookies" 
                className="px-4 py-2 text-white/70 hover:text-[#BD9B58] transition-all duration-300 font-bebas uppercase tracking-wider hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;