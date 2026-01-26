"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  ListOrdered ,
  LogOut,
  Image,
  MessageSquare,
  ShoppingBag,
  Calendar,
  FileText,
  Settings,
  Ticket,
  Video,
  Trophy,
  UserCircle,
  SlidersHorizontal,
  Archive
} from "lucide-react";
import { useState, useEffect } from "react";
import { logout } from "@/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return children;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Hero Sliders", href: "/admin/sliders", icon: SlidersHorizontal },
    { name: "News", href: "/admin/news", icon: FileText },
    { name: "Videos", href: "/admin/videos", icon: Video },
    { name: "Teams", href: "/admin/teams", icon: Users },
    { name: "Members", href: "/admin/members", icon: UserCircle },
    { name: "Fixtures", href: "/admin/fixtures", icon: Calendar },
    { name: "Seasons", href: "/admin/seasons", icon: Archive },
    { name: "Tickets", href: "/admin/tickets", icon: Ticket },
    { name: "Shop", href: "/admin/shop", icon: ShoppingBag },
    { name: "Sponsors", href: "/admin/sponsors", icon: Image },
    { name: "Standings", href: "/admin/standings", icon: ListOrdered },
    { name: "Trophies", href: "/admin/league-count", icon: Trophy },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-50 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Eagles FC Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            {/* Close button for mobile */}
            <button
              className="p-1 -mr-1 text-gray-500 hover:text-gray-700 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                    ? "bg-[#C5A464] text-white"
                    : "text-gray-600 hover:bg-[#C5A464]/10 hover:text-[#C5A464]"
                    }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 w-full text-gray-600 hover:text-[#C5A464] transition-colors rounded-lg hover:bg-[#C5A464]/10"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-2 bg-white border-b md:hidden">
        <button
          className="p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setIsSidebarOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Eagles FC Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="text-xl font-bold text-gray-900">Eagles FC Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-600 hover:text-[#C5A464]"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <main className="pt-[57px] md:pt-0 md:ml-64 min-h-screen">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
} 