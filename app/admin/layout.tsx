"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ListOrdered,
  LogOut,
  Image as ImageIcon,
  ShoppingBag,
  Calendar,
  FileText,
  Ticket,
  Video,
  Trophy,
  UserCircle,
  SlidersHorizontal,
  Archive,
  Handshake,
  Inbox,
  Menu,
  X,
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

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return children;
  }

  const sections = [
    {
      label: "Overview",
      items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
    },
    {
      label: "Communications",
      items: [
        { name: "Inbox", href: "/admin/inbox", icon: Inbox },
        { name: "News", href: "/admin/news", icon: FileText },
        { name: "Hero Sliders", href: "/admin/sliders", icon: SlidersHorizontal },
        { name: "Videos", href: "/admin/videos", icon: Video },
      ],
    },
    {
      label: "Club",
      items: [
        { name: "Teams", href: "/admin/teams", icon: Users },
        { name: "Members", href: "/admin/members", icon: UserCircle },
        { name: "Fixtures", href: "/admin/fixtures", icon: Calendar },
        { name: "Seasons", href: "/admin/seasons", icon: Archive },
        { name: "Standings", href: "/admin/standings", icon: ListOrdered },
        { name: "Trophies", href: "/admin/league-count", icon: Trophy },
      ],
    },
    {
      label: "Commerce",
      items: [
        { name: "Shop", href: "/admin/shop", icon: ShoppingBag },
        { name: "Tickets", href: "/admin/tickets", icon: Ticket },
        { name: "Sponsors", href: "/admin/sponsors", icon: ImageIcon },
        { name: "Partnerships", href: "/admin/partnerships", icon: Handshake },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const isItemActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-[#0F1011] shadow-2xl transform transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          border-r border-white/5`}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#C5A464] blur-xl opacity-20 rounded-full" />
                <img
                  src="/LOGO (2).png"
                  alt="Eagles FC"
                  className="relative h-11 w-auto object-contain"
                />
              </div>
              <div>
                <div className="text-white font-semibold leading-tight text-base">Eagles FC</div>
                <div className="text-[10px] text-[#C5A464] uppercase tracking-[0.2em] mt-0.5 font-medium">
                  Admin Portal
                </div>
              </div>
            </div>
            <button
              className="p-1.5 text-white/60 hover:text-white transition-colors md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {sections.map((section) => (
              <div key={section.label} className="mb-6 last:mb-0">
                <div className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-2">
                  {section.label}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isItemActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                          ${
                            active
                              ? "bg-gradient-to-r from-[#C5A464]/20 to-transparent text-white"
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-[#C5A464]" />
                        )}
                        <item.icon
                          className={`w-[18px] h-[18px] transition-colors ${
                            active ? "text-[#C5A464]" : "text-white/50 group-hover:text-white/80"
                          }`}
                        />
                        <span className={active ? "font-medium" : ""}>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="group flex items-center gap-3 px-3 py-2.5 w-full text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-[18px] h-[18px] text-white/50 group-hover:text-white/80" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#0F1011] border-b border-white/5 md:hidden">
        <button
          className="p-2 text-white/70 hover:text-white transition-colors"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <img src="/LOGO (2).png" alt="Eagles FC" className="h-8 w-auto object-contain" />
          <span className="text-sm font-semibold text-white tracking-wide">Eagles FC Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-white/70 hover:text-[#C5A464] transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Main */}
      <main className="md:ml-72 min-h-screen">
        <div className="p-5 md:p-8 lg:p-10 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
