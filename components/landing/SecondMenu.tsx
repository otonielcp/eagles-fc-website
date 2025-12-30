"use client";
import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';

const logo = "/logo.png";

const SecondMenu = () => {
  const pathname = usePathname();
  
  // Don't show on landing page
  if (pathname === '/') {
    return null;
  }

  // Track scroll for logo animation
  const { scrollYProgress } = useScroll();
  const logoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 1.5]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.9, 1, 1]);

  const menuItems = [
    { href: '/club', label: 'Club' },
    { href: '/teams', label: 'Teams' },
    { href: '/tickets', label: 'Tickets' },
    { href: '/fixtures', label: 'Fixtures' },
    { href: '/news', label: 'News' },
    { href: '/shop', label: 'Shop' },
    { href: '/partners', label: 'Partners' },
    { href: '/ticketing', label: 'Contact' }
  ];

  return (
    <div className="fixed top-[133px] w-full bg-gradient-to-b from-gray-50 via-white to-white border-b border-gray-200/50 shadow-lg z-40 backdrop-blur-sm">
      {/* Enhanced top gold accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent shadow-[0_2px_8px_rgba(189,155,88,0.3)]"></div>
      
      <div className="container mx-auto px-4 md:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Logo on the left - Enhanced */}
          <Link href="/" className="flex items-center group">
            <motion.div
              className="relative"
              style={{ 
                scale: logoScale,
                opacity: logoOpacity,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-[#BD9B58]/20 to-[#d4b068]/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Image
                src={logo}
                alt="Eagles FC Logo"
                width={100}
                height={100}
                className="h-12 w-auto transition-all duration-300 relative z-10 group-hover:scale-110"
                style={{
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))',
                  objectFit: 'contain'
                }}
                priority
                unoptimized
              />
            </motion.div>
          </Link>

          {/* Navigation Links - Enhanced */}
          <ul className="flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href} className="relative group">
                  <Link 
                    href={item.href} 
                    className={`font-bold text-xs lg:text-sm transition-all duration-300 relative uppercase tracking-wider px-2 py-1 rounded ${
                      isActive 
                        ? 'text-[#BD9B58]' 
                        : 'text-gray-700 hover:text-[#BD9B58]'
                    }`}
                  >
                    {item.label}
                    {/* Enhanced underline */}
                    <span className={`absolute -bottom-0.5 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}></span>
                    {/* Active indicator dot */}
                    {isActive && (
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#BD9B58] rounded-full"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SecondMenu;

