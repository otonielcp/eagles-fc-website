"use client";
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import InternalNavbar from './InternalNavbar';

export default function ConditionalNavbar() {
  // usePathname() is available during SSR, so the server already renders the
  // right navbar — no dark-bar flash on the homepage before hydration.
  const pathname = usePathname();

  // Home page: transparent navbar with scroll effect
  if (pathname === '/') {
    return <Navbar />;
  }

  // All other pages: dark solid navbar
  return <InternalNavbar />;
}
