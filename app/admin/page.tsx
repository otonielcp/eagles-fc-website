"use client";

import {
  Users,
  ShoppingBag,
  FileText,
  Calendar,
  ArrowUpRight,
  ChevronRight,
  UserPlus,
  Shirt,
  Trophy,
  Pencil,
  Handshake,
} from "lucide-react";
import Link from "next/link";

const statsCards = [
  {
    title: "Team Members",
    value: "24",
    change: "+2",
    icon: Users,
    accent: "from-[#C5A464] to-[#B39355]",
  },
  {
    title: "Shop Products",
    value: "84",
    change: "+3",
    icon: ShoppingBag,
    accent: "from-gray-800 to-gray-900",
  },
  {
    title: "News Articles",
    value: "56",
    change: "+8",
    icon: FileText,
    accent: "from-[#C5A464] to-[#B39355]",
  },
  {
    title: "Upcoming Fixtures",
    value: "12",
    change: "",
    icon: Calendar,
    accent: "from-gray-800 to-gray-900",
  },
];

const recentActivity = [
  { id: 1, action: "New player registered", user: "John Doe", time: "2 minutes ago", icon: UserPlus },
  { id: 2, action: "New jersey added to store", user: "Admin", time: "1 hour ago", icon: Shirt },
  { id: 3, action: "Match result published", user: "Admin", time: "3 hours ago", icon: Trophy },
  { id: 4, action: "Fixture updated", user: "Admin", time: "Yesterday", icon: Pencil },
  { id: 5, action: "Team roster updated", user: "Coach Smith", time: "Yesterday", icon: Users },
];

const quickActions = [
  {
    title: "Add News Article",
    subtitle: "Publish a new story",
    href: "/admin/news/add",
    icon: FileText,
  },
  {
    title: "Manage Products",
    subtitle: "Edit shop inventory",
    href: "/admin/shop",
    icon: ShoppingBag,
  },
  {
    title: "Schedule Fixture",
    subtitle: "Add an upcoming match",
    href: "/admin/fixtures/add",
    icon: Calendar,
  },
  {
    title: "Manage Teams",
    subtitle: "Rosters and staff",
    href: "/admin/teams",
    icon: Users,
  },
  {
    title: "Partnerships",
    subtitle: "Review inquiries",
    href: "/admin/partnerships",
    icon: Handshake,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Welcome back — here's what's happening at Eagles FC today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="uppercase tracking-wider font-medium">Live</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statsCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="group relative bg-white border border-gray-100 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center shadow-sm`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {card.change && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    {card.change}
                  </span>
                )}
              </div>
              <div className="mt-5">
                <div className="text-3xl font-bold text-gray-900 tracking-tight leading-none">
                  {card.value}
                </div>
                <div className="text-sm text-gray-500 mt-2">{card.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Recent activity</h2>
              <p className="text-xs text-gray-500 mt-0.5">Latest updates across the club</p>
            </div>
            <button className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
              View all
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentActivity.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.id}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[#C5A464]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#C5A464]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{item.action}</div>
                    <div className="text-xs text-gray-500 mt-0.5">By {item.user}</div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {item.time}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Quick actions</h2>
            <p className="text-xs text-gray-500 mt-0.5">Shortcuts to common tasks</p>
          </div>
          <div className="p-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C5A464] to-[#B39355] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className="w-[18px] h-[18px] text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {action.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{action.subtitle}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
