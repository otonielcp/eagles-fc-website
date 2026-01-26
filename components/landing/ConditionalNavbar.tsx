"use client";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import InternalNavbar from './InternalNavbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR or before hydration, always show InternalNavbar (dark)
  // This prevents flash of wrong navbar
  if (!isClient) {
    return <InternalNavbar />;
  }

  // After hydration, show correct navbar based on pathname
  // Home page: transparent navbar with scroll effect
  if (pathname === '/') {
    return <Navbar />;
  }

  // All other pages: dark solid navbar
  return <InternalNavbar />;
}




