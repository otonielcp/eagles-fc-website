"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search } from "lucide-react";
const logo = "/mainlogo.png"
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaFacebook,
  FaTiktok,
} from "react-icons/fa6";

// Custom Menu Icon Component
const CustomMenuIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="8" x2="24" y2="8" />
      <line x1="3" y1="14" x2="24" y2="14" />
      <line x1="3" y1="20" x2="16" y2="20" />
    </svg>
  );
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Check if we're on the home page
  const isHomePage = pathname === '/';

  // Function to close menu when a link is clicked
  const closeMenu = () => setMenuOpen(false);

  // Scroll detection - only matters on home page
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // For non-home pages, always show the scrolled (dark) state
  const showScrolledStyle = !isHomePage || isScrolled;

  // Pages that have NavbarFix sub-navigation (don't show gold border on main navbar)
  const hasSubNavbar = pathname === '/fixtures' || pathname === '/results' || pathname === '/tables';


  return (
    <nav data-navbar="landing" className={`fixed top-0 w-full z-50 transition-all duration-700 ease-in-out overflow-visible ${
      showScrolledStyle
        ? hasSubNavbar ? 'shadow-2xl' : 'shadow-2xl border-b-2 border-[#BD9B58]'
        : 'bg-transparent'
    }`} style={showScrolledStyle ? { backgroundColor: '#181819' } : {}}>
      {/* Animated top accent line */}
      <div className={`h-1 bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent transition-all duration-700 ${
        showScrolledStyle ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className="h-full bg-gradient-to-r from-transparent via-[#d4b068] to-transparent animate-pulse"></div>
      </div>
      {/* Upper Strip - Completely Hidden */}
      <div className="h-0 opacity-0 overflow-hidden">
        {/* Left Black Area with Menu Button */}
        <div className={`absolute left-0 top-0 h-full w-24 flex items-center z-50 pl-3 transition-all duration-700 ${
          showScrolledStyle ? 'opacity-0' : 'opacity-100'
        }`} style={{ backgroundColor: '#181819' }}></div>
        <div
          className={`absolute left-0 top-0 h-full w-32 flex items-center z-50 pb-2 pl-2 transition-all duration-700 ${
            showScrolledStyle ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ clipPath: "polygon(0% 0%, 69% 0%, 110% 100%, 0% 100%)", backgroundColor: '#181819' }}
        >
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white hover:text-[#BD9B58] transition-all duration-300 transform hover:scale-110"
            aria-label="Menu"
          >
            <CustomMenuIcon />
          </button>
        </div>

        {/* Large Screens: Social Links & Sponsored By */}
        <div className="hidden md:flex items-center space-x-4 text-white ml-auto">
          <div className="w-0.5 h-12 bg-white"></div>

          {/*  Search Button Now Transparent with White Icon */}
          <button
            className="p-2 bg-transparent rounded-full flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="w-6 h-6 text-white" />
          </button>

          <div className="w-0.5 h-12 bg-white"></div>

          {/* Social Media Icons */}
          <FaFacebook className="cursor-pointer" />
          <FaInstagram className="cursor-pointer" />
          <FaTwitter className="cursor-pointer" />
          <FaYoutube className="cursor-pointer" />
          <FaTiktok className="cursor-pointer" />
          <FaLinkedin className="cursor-pointer" />
        </div>
      </div>

      {/* Simple Divider */}
      <div className={`h-px transition-all duration-700 ${
        showScrolledStyle
          ? 'bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent opacity-100'
          : 'bg-transparent'
      }`}></div>

      {/* Lower Strip - Clean Design */}
      <div className={`flex items-center justify-center px-4 md:px-16 relative transition-all duration-700 overflow-visible ${
        showScrolledStyle
          ? 'h-20 shadow-lg'
          : 'h-20 bg-transparent'
      }`}>
        {/* Large Screens: Logo on Left - Enhanced Design */}
        <div className={`absolute left-24 md:left-32 lg:left-44 xl:left-52 hidden md:flex transition-all duration-500 ${
          hasSubNavbar ? 'top-2 z-[100]' : showScrolledStyle ? 'top-3 z-[60]' : 'top-6 z-[60]'
        }`}>
          <Link href="/" className="relative group">
            <div className="relative">
              <Image
                src={logo}
                alt="Eagles FC Logo"
                width={140}
                height={140}
                className={`transition-all duration-300 ${
                  hasSubNavbar ? 'h-24 w-auto' : showScrolledStyle ? 'h-28 w-auto' : 'h-24 w-auto'
                } group-hover:scale-105`}
                style={{
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
                  objectFit: 'contain'
                }}
                priority
                unoptimized
              />
            </div>
          </Link>
        </div>

        {/* Hamburger Menu Button - Always visible on desktop */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`absolute left-6 text-white hover:text-[#BD9B58] transition-all duration-300 transform hover:scale-110 hidden md:block ${
            !showScrolledStyle && 'drop-shadow-lg'
          }`}
          aria-label="Menu"
        >
          <CustomMenuIcon />
        </button>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden absolute left-4 text-white hover:text-[#BD9B58] transition-all duration-300 transform hover:scale-110 ${
            !showScrolledStyle && 'drop-shadow-lg'
          }`}
          aria-label="Menu"
        >
          <CustomMenuIcon />
        </button>

        {/* Small Screens: Logo - Clean Design */}
        <Link href="/" className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-50">
          <div className="relative">
            <Image
              src={logo}
              alt="Eagles FC Logo"
              width={80}
              height={80}
              className={`transition-all duration-300 relative z-10 ${
                showScrolledStyle ? 'h-16 w-auto' : 'h-20 w-auto'
              }`}
              style={{
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                objectFit: 'contain'
              }}
              priority
              unoptimized
            />
          </div>
        </Link>

        {/* Navigation Links */}
        <ul className={`hidden md:flex md:ml-32 md:space-x-6 lg:ml-28 lg:space-x-8 xl:space-x-12 text-white font-medium transition-all duration-700 ${
          showScrolledStyle ? 'text-base' : 'text-sm drop-shadow-lg'
        }`}>
          {/* Club with Dropdown */}
          <li className="relative group">
            <span className="hover:text-[#BD9B58] cursor-pointer transition-all duration-300 relative flex items-center gap-1.5">
              Club
              <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#BD9B58] group-hover:w-full transition-all duration-300"></span>
            </span>
            {/* Premium Dropdown Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
              {/* Arrow */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#1f1f20] border-l border-t border-[#BD9B58]/30"></div>
              <div className="relative min-w-[200px] py-3 rounded-lg shadow-2xl overflow-hidden" style={{ backgroundColor: '#1f1f20' }}>
                {/* Gold accent line at top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent"></div>

                <Link href="/club" className="group/item flex items-center gap-3 px-5 py-3 text-sm text-white/90 hover:text-white transition-all duration-200 hover:bg-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BD9B58] opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"></span>
                  <span className="font-medium tracking-wide">The Club</span>
                </Link>
                <Link href="/coaches" className="group/item flex items-center gap-3 px-5 py-3 text-sm text-white/90 hover:text-white transition-all duration-200 hover:bg-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BD9B58] opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"></span>
                  <span className="font-medium tracking-wide">Coaches</span>
                </Link>
                <Link href="/programs" className="group/item flex items-center gap-3 px-5 py-3 text-sm text-white/90 hover:text-white transition-all duration-200 hover:bg-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BD9B58] opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"></span>
                  <span className="font-medium tracking-wide">Programs</span>
                </Link>

                {/* Subtle bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </li>
          {[
            { href: '/teams', label: 'Teams' },
            { href: '/fixtures', label: 'Fixtures' },
            { href: '/news', label: 'News' },
            { href: '/shop', label: 'Shop' },
            { href: '/partners', label: 'Partners' },
            { href: '/ticketing', label: 'Contact' }
          ].map((item) => (
            <li key={item.href} className="relative group">
              <Link href={item.href} className="hover:text-[#BD9B58] cursor-pointer transition-all duration-300 relative">
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#BD9B58] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
          ))}
        </ul>


        {/* Enhanced Mobile/Desktop Menu - Chivas Style with Sidebar */}
        {menuOpen && (
          <>
            {/* Backdrop Overlay */}
            <div 
              className="fixed inset-0 z-40 animate-fadeIn"
              onClick={() => setMenuOpen(false)}
              style={{ backgroundColor: 'rgba(24, 24, 25, 0.5)' }}
            ></div>
            
            {/* Sidebar Menu */}
            <div className="fixed left-0 top-0 bottom-0 w-80 text-white z-50 overflow-y-auto shadow-2xl animate-slideInLeft scrollbar-hide" style={{ backgroundColor: '#181819' }}>
              {/* Header with Close Button and Logo */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                  aria-label="Close menu"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="4" x2="16" y2="16" />
                    <line x1="16" y1="4" x2="4" y2="16" />
                  </svg>
                </button>
                
                <img 
                  src={logo} 
                  alt="Eagles FC" 
                  className="h-12 w-auto"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    objectFit: 'contain'
                  }}
                />
                
                <div className="w-10"></div>
              </div>

              {/* Navigation Links - Uppercase and Bold */}
              <nav className="py-6">
                <Link 
                  href="/news" 
                  className="block px-6 py-4 text-2xl font-black uppercase tracking-wide hover:bg-white/5 hover:text-[#BD9B58] transition-all duration-300 border-l-4 border-transparent hover:border-[#BD9B58]" 
                  onClick={closeMenu}
                >
                  News
                </Link>
                <Link 
                  href="/media" 
                  className="block px-6 py-4 text-2xl font-black uppercase tracking-wide hover:bg-white/5 hover:text-[#BD9B58] transition-all duration-300 border-l-4 border-transparent hover:border-[#BD9B58]" 
                  onClick={closeMenu}
                >
                  Media
                </Link>
                <Link 
                  href="/fixtures" 
                  className="block px-6 py-4 text-2xl font-black uppercase tracking-wide hover:bg-white/5 hover:text-[#BD9B58] transition-all duration-300 border-l-4 border-transparent hover:border-[#BD9B58]" 
                  onClick={closeMenu}
                >
                  Schedule
                </Link>
                <Link 
                  href="/teams" 
                  className="block px-6 py-4 text-2xl font-black uppercase tracking-wide hover:bg-white/5 hover:text-[#BD9B58] transition-all duration-300 border-l-4 border-transparent hover:border-[#BD9B58]" 
                  onClick={closeMenu}
                >
                  Team
                </Link>
                <Link 
                  href="/club" 
                  className="block px-6 py-4 text-2xl font-black uppercase tracking-wide hover:bg-white/5 hover:text-[#BD9B58] transition-all duration-300 border-l-4 border-transparent hover:border-[#BD9B58]" 
                  onClick={closeMenu}
                >
                  Youth Academy
                </Link>
                <Link 
                  href="/club" 
                  className="block px-6 py-4 text-2xl font-black uppercase tracking-wide hover:bg-white/5 hover:text-[#BD9B58] transition-all duration-300 border-l-4 border-transparent hover:border-[#BD9B58]" 
                  onClick={closeMenu}
                >
                  The Club
                </Link>
                <Link 
                  href="/programs" 
                  className="block px-6 py-4 text-2xl font-black uppercase tracking-wide hover:bg-white/5 hover:text-[#BD9B58] transition-all duration-300 border-l-4 border-transparent hover:border-[#BD9B58]" 
                  onClick={closeMenu}
                >
                  Programs
                </Link>
                <Link 
                  href="/shop" 
                  className="block px-6 py-4 text-2xl font-black uppercase tracking-wide hover:bg-white/5 hover:text-[#BD9B58] transition-all duration-300 border-l-4 border-transparent hover:border-[#BD9B58]" 
                  onClick={closeMenu}
                >
                  Online Store
                </Link>
                <Link 
                  href="/partners" 
                  className="block px-6 py-4 text-2xl font-black uppercase tracking-wide hover:bg-white/5 hover:text-[#BD9B58] transition-all duration-300 border-l-4 border-transparent hover:border-[#BD9B58]" 
                  onClick={closeMenu}
                >
                  Partners
                </Link>
                <Link 
                  href="/ticketing" 
                  className="block px-6 py-4 text-2xl font-black uppercase tracking-wide hover:bg-white/5 hover:text-[#BD9B58] transition-all duration-300 border-l-4 border-transparent hover:border-[#BD9B58]" 
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </nav>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
