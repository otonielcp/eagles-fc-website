"use client";
import React, { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
const logo = "/logo.png"

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
    <nav className="fixed top-0 w-full z-50 shadow-2xl border-b-2 border-[#BD9B58]" style={{ backgroundColor: '#181819' }}>
      {/* Navigation Bar */}
      <div className="h-20 flex items-center justify-center px-4 md:px-16 relative" style={{ backgroundColor: '#181819' }}>
        {/* Logo on Left */}
        <div className="absolute left-24 md:left-32 lg:left-44 xl:left-52 flex items-center hidden md:flex">
          <Link href="/" className="relative group">
            <Image
              src={logo}
              alt="Eagles FC Logo"
              width={64}
              height={64}
              className="w-auto h-16 transition-all duration-500 transform group-hover:scale-105"
              style={{ objectFit: 'contain' }}
              priority
              unoptimized
            />
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

        {/* Small Screens: Logo */}
        <Link href="/" className="md:hidden absolute right-2">
          <Image 
            src={logo} 
            alt="Eagles FC Logo" 
            width={56}
            height={56}
            className="w-auto h-14"
            style={{ objectFit: 'contain' }}
            priority
            unoptimized
          />
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex md:ml-32 md:space-x-6 lg:ml-28 lg:space-x-8 xl:space-x-12 text-white font-medium text-base">
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
                    { href: '/tickets', label: 'Tickets' },
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
