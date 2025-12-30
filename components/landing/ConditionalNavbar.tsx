"use client";
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import InternalNavbar from './InternalNavbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  
  if (isLandingPage) {
    return <Navbar />;
  }
  
  return <InternalNavbar />;
}




