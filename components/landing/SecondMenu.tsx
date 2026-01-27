"use client";
import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SecondMenu = () => {
  // Disabled - all pages should show only the main navbar
  return null;

  const pathname = usePathname();

  // Define sub-menu items based on current page
  const getSubMenuItems = () => {
    if (pathname.startsWith('/club')) {
      return [
        { href: '/club', label: 'Club' },
        { href: '/club/coaches', label: 'Coaches' },
        { href: '/club/programs', label: 'Programs' },
      ];
    }
    if (pathname.startsWith('/teams')) {
      return [
        { href: '/teams', label: 'Teams' },
        { href: '/teams-overview', label: 'Overview' },
      ];
    }
    if (pathname.startsWith('/news')) {
      return [
        { href: '/news', label: 'News' },
        { href: '/media', label: 'Media' },
      ];
    }
    // Default - show page-specific items or nothing
    return [];
  };

  const subMenuItems = getSubMenuItems();

  // Don't render if no sub-menu items
  if (subMenuItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-[85px] w-full z-40" style={{ backgroundColor: '#181819' }}>
      {/* Gold accent line at bottom - matching main navbar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8B7340] via-[#BD9B58] to-[#8B7340]"></div>

      <nav className="flex items-center justify-center h-10 px-4 md:px-8">
        {/* Sub Navigation Links - white text like main navbar */}
        <ul className="flex items-center space-x-8 lg:space-x-10 xl:space-x-12">
          {subMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-300 relative ${
                    isActive
                      ? 'text-white'
                      : 'text-white/70 hover:text-[#BD9B58]'
                  }`}
                >
                  {item.label}
                  {/* Active underline - gold like main navbar */}
                  <span className={`absolute -bottom-1 left-0 right-0 h-[2px] bg-[#BD9B58] transition-all duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SecondMenu;

