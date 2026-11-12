"use client";

import {
  Users,
  ShoppingBag,
  FileText,
  Calendar,
  ChevronRight,
  Handshake,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";

// The stat cards and "Recent activity" feed that used to sit here were
// hard-coded sample data (fixed counts, "John Doe", "Coach Smith"), so they
// were removed rather than shown as if they were real club figures.

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
  {
    title: "Hiring",
    subtitle: "Review job applicants",
    href: "/admin/hiring/applications",
    icon: ClipboardList,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Welcome back. Jump straight to the most common admin tasks below.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Quick actions</h2>
          <p className="text-xs text-gray-500 mt-0.5">Shortcuts to common tasks</p>
        </div>
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1">
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
  );
}
