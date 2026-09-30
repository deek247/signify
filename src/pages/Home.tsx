import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquareIcon,
  ShieldIcon,
  GlobeIcon,
  BrainIcon,
  HeartIcon,
  ZapIcon } from
'lucide-react';
export function Home() {
  const features = [
  {
    icon: MessageSquareIcon,
    title: 'Bidirectional Communication',
    description:
    'Seamlessly convert speech to sign language and sign language to speech in real-time',
    link: '/conversation',
    color: 'from-purple-500 to-pink-500',
    glow: 'purple'
  },
  {
    icon: ShieldIcon,
    title: 'Audio Hashing Security',
    description:
    'Enterprise-grade privacy protection with advanced audio hashing technology',
    link: '/security',
    color: 'from-green-500 to-emerald-500',
    glow: 'green'
  },
  {
    icon: GlobeIcon,
    title: 'Multiple Sign Languages',
    description:
    'Support for ASL, ISL, BSL and more international sign language standards',
    link: '/settings',
    color: 'from-orange-500 to-red-500',
    glow: 'orange'
  },
  {
    icon: BrainIcon,
    title: 'AI-Powered Recognition',
    description:
    'Advanced machine learning for accurate gesture and emotion detection',
    link: '/conversation',
    color: 'from-blue-500 to-cyan-500',
    glow: 'blue'
  },
  {
    icon: HeartIcon,
    title: 'Emotion Detection',
    description:
    'Capture and convey emotional nuances in both directions with precision',
    link: '/conversation',
    color: 'from-pink-500 to-rose-500',
    glow: 'pink'
  },
  {
    icon: ZapIcon,
    title: 'Real-Time Processing',
    description:
    'Lightning-fast translation with minimal latency for natural conversations',
    link: '/conversation',
    color: 'from-yellow-500 to-orange-500',
    glow: 'yellow'
  }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
          Signify - Bridging Silence and Sound
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Professional sign language translation platform for hospitals, banks,
          public transport, and personal use. Bridging the gap between hearing
          and deaf communities with AI-powered technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Link
              key={index}
              to={feature.link}
              className="group bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl transition-all duration-300 overflow-hidden border border-gray-700 hover:border-purple-500/50 hover:scale-105 hover:-translate-y-2"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}>
              
              <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
              <div
                className="p-6 group-hover:shadow-2xl transition-shadow duration-300"
                style={{
                  boxShadow: 'none'
                }}
                onMouseEnter={(e) => {
                  const glowColors: Record<string, string> = {
                    purple:
                    '0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(168, 85, 247, 0.2)',
                    green:
                    '0 0 40px rgba(34, 197, 94, 0.4), 0 0 80px rgba(34, 197, 94, 0.2)',
                    orange:
                    '0 0 40px rgba(249, 115, 22, 0.4), 0 0 80px rgba(249, 115, 22, 0.2)',
                    blue: '0 0 40px rgba(59, 130, 246, 0.4), 0 0 80px rgba(59, 130, 246, 0.2)',
                    pink: '0 0 40px rgba(236, 72, 153, 0.4), 0 0 80px rgba(236, 72, 153, 0.2)',
                    yellow:
                    '0 0 40px rgba(234, 179, 8, 0.4), 0 0 80px rgba(234, 179, 8, 0.2)'
                  };
                  e.currentTarget.style.boxShadow =
                  glowColors[feature.glow] || glowColors.purple;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                  style={{
                    boxShadow: `0 10px 40px -10px rgba(168, 85, 247, 0.5)`
                  }}>
                  
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </Link>);

        })}
      </div>

      <div className="relative bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-blue-900/50 rounded-2xl shadow-2xl p-8 text-white text-center overflow-hidden border border-purple-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse" />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Trusted by Leading Organizations
          </h2>
          <p className="text-lg mb-6 text-gray-200">
            Healthcare facilities, financial institutions, and transportation
            services rely on Signify for accessible communication solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-base">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 cursor-default">
              🏥 Hospitals
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 cursor-default">
              🏦 Banks
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 cursor-default">
              🚇 Public Transport
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 cursor-default">
              👤 Personal Use
            </span>
          </div>
        </div>
      </div>
    </div>);

}