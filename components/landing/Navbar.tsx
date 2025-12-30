"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Search } from "lucide-react";
const logo = "/logo.png"
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

  // Function to close menu when a link is clicked
  const closeMenu = () => setMenuOpen(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ease-in-out overflow-visible ${
      isScrolled 
        ? 'shadow-2xl border-b-2 border-[#BD9B58]' 
        : 'bg-transparent'
    }`} style={isScrolled ? { backgroundColor: '#181819' } : {}}>
      {/* Animated top accent line */}
      <div className={`h-1 bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent transition-all duration-700 ${
        isScrolled ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className="h-full bg-gradient-to-r from-transparent via-[#d4b068] to-transparent animate-pulse"></div>
      </div>
      {/* Upper Strip - Completely Hidden */}
      <div className="h-0 opacity-0 overflow-hidden">
        {/* Left Black Area with Menu Button */}
        <div className={`absolute left-0 top-0 h-full w-24 flex items-center z-50 pl-3 transition-all duration-700 ${
          isScrolled ? 'opacity-0' : 'opacity-100'
        }`} style={{ backgroundColor: '#181819' }}></div>
        <div
          className={`absolute left-0 top-0 h-full w-32 flex items-center z-50 pb-2 pl-2 transition-all duration-700 ${
            isScrolled ? 'opacity-0' : 'opacity-100'
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
        isScrolled 
          ? 'bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent opacity-100' 
          : 'bg-transparent'
      }`}></div>

      {/* Lower Strip - Clean Design */}
      <div className={`flex items-center justify-center px-4 md:px-16 relative transition-all duration-700 overflow-visible ${
        isScrolled 
          ? 'h-20 shadow-lg' 
          : 'h-20 bg-transparent'
      }`}>
        {/* Large Screens: Logo on Left - Enhanced Design */}
        <div className={`absolute left-24 md:left-32 lg:left-44 xl:left-52 flex items-center hidden md:flex transition-all duration-500 z-50 ${
          isScrolled ? 'top-0' : 'top-0'
        }`}>
          <Link href="/" className="relative group">
            <div className="relative">
              <Image
                src={logo}
                alt="Eagles FC Logo"
                width={120}
                height={120}
                className={`transition-all duration-300 relative z-10 ${
                  isScrolled ? 'h-20 w-auto' : 'h-24 w-auto'
                } group-hover:scale-105`}
                style={{
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
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
            !isScrolled && 'drop-shadow-lg'
          }`}
          aria-label="Menu"
        >
          <CustomMenuIcon />
        </button>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden absolute left-4 text-white hover:text-[#BD9B58] transition-all duration-300 transform hover:scale-110 ${
            !isScrolled && 'drop-shadow-lg'
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
                isScrolled ? 'h-16 w-auto' : 'h-20 w-auto'
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
          isScrolled ? 'text-base' : 'text-sm drop-shadow-lg'
        }`}>
          {[
            { href: '/club', label: 'Club' },
            { href: '/teams', label: 'Teams' },
            { href: '/tickets', label: 'Tickets' },
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
                  href="/tickets" 
                  className="block px-6 py-4 text-2xl font-black uppercase tracking-wide hover:bg-white/5 hover:text-[#BD9B58] transition-all duration-300 border-l-4 border-transparent hover:border-[#BD9B58]" 
                  onClick={closeMenu}
                >
                  Tickets
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
