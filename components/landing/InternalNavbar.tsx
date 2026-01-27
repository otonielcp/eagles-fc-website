"use client";
import React, { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
const logo = "/mainlogo.png"

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

const InternalNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to close menu when a link is clicked
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav data-navbar="internal" style={{ backgroundColor: '#181819' }} className="fixed top-0 w-full z-50 shadow-2xl border-b-2 border-[#BD9B58] overflow-visible transition-all duration-700 ease-in-out">
      {/* Gradient Divider - matching Navbar scrolled state */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#BD9B58] to-transparent opacity-100"></div>

      {/* Navigation Bar - matching Navbar scrolled state */}
      <div className="h-20 flex items-center justify-center px-4 md:px-16 relative overflow-visible shadow-lg">
        {/* Logo on Left */}
        <div className="absolute left-24 md:left-32 lg:left-44 xl:left-52 hidden md:flex top-3 z-[60]">
          <Link href="/" className="relative group">
            <div className="relative">
              <Image
                src={logo}
                alt="Eagles FC Logo"
                width={140}
                height={140}
                className="h-28 w-auto transition-all duration-300 group-hover:scale-105"
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

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="absolute left-6 text-white hover:text-[#BD9B58] transition-all duration-300 transform hover:scale-110 hidden md:block"
          aria-label="Menu"
        >
          <CustomMenuIcon />
        </button>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden absolute left-4 text-white hover:text-[#BD9B58] transition-all duration-300 transform hover:scale-110"
          aria-label="Menu"
        >
          <CustomMenuIcon />
        </button>

        {/* Small Screens: Logo - matching Navbar scrolled state */}
        <Link href="/" className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-50">
          <div className="relative">
            <Image
              src={logo}
              alt="Eagles FC Logo"
              width={80}
              height={80}
              className="h-16 w-auto transition-all duration-300 relative z-10"
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
        <ul className="hidden md:flex md:ml-32 md:space-x-6 lg:ml-28 lg:space-x-8 xl:space-x-12 text-white font-medium text-base">
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

        {/* Enhanced Mobile/Desktop Menu - Sidebar */}
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
                <Link href="/" onClick={closeMenu}>
                  <Image 
                    src={logo} 
                    alt="Eagles FC Logo" 
                    width={48}
                    height={48}
                    className="h-12 w-auto"
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </Link>
              </div>

              {/* Navigation Links */}
              <nav className="p-6">
                <ul className="space-y-4">
                  {[
                    { href: '/club', label: 'Club' },
                    { href: '/teams', label: 'Teams' },
                    { href: '/programs', label: 'Programs' },
                    { href: '/fixtures', label: 'Fixtures' },
                    { href: '/news', label: 'News' },
                    { href: '/shop', label: 'Shop' },
                    { href: '/partners', label: 'Partners' },
                    { href: '/ticketing', label: 'Contact' }
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="text-2xl font-black uppercase tracking-wider text-white hover:text-[#BD9B58] transition-colors duration-300 block py-2 border-l-4 border-transparent hover:border-[#BD9B58] pl-4"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default InternalNavbar;
