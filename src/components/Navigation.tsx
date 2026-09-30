import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MessageSquareIcon,
  ShieldIcon,
  SettingsIcon,
  HomeIcon } from
'lucide-react';
export function Navigation() {
  const location = useLocation();
  const navItems = [
  {
    path: '/',
    label: 'Home',
    icon: HomeIcon
  },
  {
    path: '/conversation',
    label: 'Start a Conversation',
    icon: MessageSquareIcon
  },
  {
    path: '/security',
    label: 'Security',
    icon: ShieldIcon
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: SettingsIcon
  }];

  return (
    <nav className="bg-gray-900/80 backdrop-blur-lg shadow-2xl border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/80 transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Signify
            </span>
          </div>
          <div className="flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105'}`}>
                  
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">
                    {item.label}
                  </span>
                </Link>);

            })}
          </div>
        </div>
      </div>
    </nav>);

}