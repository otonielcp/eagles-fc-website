"use client"

import { Users, ShoppingBag, FileText, Calendar, TrendingUp, Image } from 'lucide-react';
import Link from 'next/link';

// Dashboard stats cards data
const statsCards = [
  {
    title: 'Team Members',
    value: '24',
    change: '+2',
    icon: Users,
    color: 'bg-[#C5A464]',
  },
  {
    title: 'Shop Products',
    value: '84',
    change: '+3',
    icon: ShoppingBag,
    color: 'bg-gray-900',
  },
  {
    title: 'News Articles',
    value: '56',
    change: '+8',
    icon: FileText,
    color: 'bg-[#C5A464]',
  },
  {
    title: 'Upcoming Fixtures',
    value: '12',
    change: '',
    icon: Calendar,
    color: 'bg-gray-900',
  },
];

// Recent activity data
const recentActivity = [
  {
    id: 1,
    action: 'New player registered',
    user: 'John Doe',
    time: '2 minutes ago',
  },
  {
    id: 2,
    action: 'New jersey added to store',
    user: 'Admin',
    time: '1 hour ago',
  },
  {
    id: 3,
    action: 'Match result published',
    user: 'Admin',
    time: '3 hours ago',
  },
  {
    id: 4,
    action: 'Fixture updated',
    user: 'Admin',
    time: 'Yesterday',
  },
  {
    id: 5,
    action: 'Team roster updated',
    user: 'Coach Smith',
    time: 'Yesterday',
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                  {card.change && (
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {card.change} from last month
                    </p>
                  )}
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((item) => (
                <li key={item.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-gray-500">By {item.user}</p>
                    </div>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <Link href="/admin/news/add" className="block">
                <button className="w-full bg-[#C5A464] text-white py-2 px-4 rounded-md hover:bg-[#B39355] transition flex items-center justify-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Add News Article
                </button>
              </Link>
              <Link href="/admin/shop" className="block">
                <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Manage Products
                </button>
              </Link>
              <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition flex items-center justify-center">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Fixture
              </button>
              <Link href="/admin/teams" className="block">
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition flex items-center justify-center">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Teams
                </button>
              </Link>
              <Link href="/admin/sponsors" className="block">
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition flex items-center justify-center">
                  <img className="h-4 w-4 mr-2" />
                  Manage Portfolio
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

