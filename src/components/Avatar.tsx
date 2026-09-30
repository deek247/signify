import React, { useEffect, useState } from 'react';
interface AvatarProps {
  emotion: 'neutral' | 'happy' | 'sad' | 'angry';
  isActive: boolean;
  language: string;
}
export function Avatar({ emotion, isActive, language }: AvatarProps) {
  const [animationFrame, setAnimationFrame] = useState(0);
  const [leftHandAngle, setLeftHandAngle] = useState(0);
  const [rightHandAngle, setRightHandAngle] = useState(0);
  const [leftHandY, setLeftHandY] = useState(0);
  const [rightHandY, setRightHandY] = useState(0);
  useEffect(() => {
    if (!isActive) {
      setLeftHandAngle(0);
      setRightHandAngle(0);
      setLeftHandY(0);
      setRightHandY(0);
      return;
    }
    const interval = setInterval(() => {
      setAnimationFrame((prev) => (prev + 1) % 8);
      // Create realistic signing motions
      const frame = animationFrame;
      // Left hand movements
      setLeftHandAngle(Math.sin(frame * 0.5) * 45);
      setLeftHandY(Math.sin(frame * 0.7) * 20);
      // Right hand movements (slightly offset for natural motion)
      setRightHandAngle(Math.sin((frame + 2) * 0.5) * -45);
      setRightHandY(Math.sin((frame + 2) * 0.7) * 20);
    }, 400);
    return () => clearInterval(interval);
  }, [isActive, animationFrame]);
  const getEmotionGradient = () => {
    switch (emotion) {
      case 'happy':
        return 'from-green-400 via-emerald-500 to-green-600';
      case 'sad':
        return 'from-blue-400 via-blue-500 to-blue-600';
      case 'angry':
        return 'from-red-400 via-red-500 to-red-600';
      default:
        return 'from-purple-400 via-pink-500 to-purple-600';
    }
  };
  const getFacialExpression = () => {
    switch (emotion) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😢';
      case 'angry':
        return '😠';
      default:
        return '😐';
    }
  };
  const getGlowColor = () => {
    switch (emotion) {
      case 'happy':
        return 'shadow-green-500/50';
      case 'sad':
        return 'shadow-blue-500/50';
      case 'angry':
        return 'shadow-red-500/50';
      default:
        return 'shadow-purple-500/50';
    }
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      <div className="relative">
        {/* Main avatar body */}
        <div
          className={`w-72 h-72 rounded-full bg-gradient-to-br ${getEmotionGradient()} flex items-center justify-center transition-all duration-500 shadow-2xl ${getGlowColor()} ${isActive ? 'animate-pulse scale-105' : ''}`}>
          
          <div className="text-9xl animate-bounce-slow">
            {getFacialExpression()}
          </div>
        </div>

        {/* Left hand */}
        {isActive &&
        <div
          className="absolute -left-12 top-1/2 w-20 h-28 bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 rounded-2xl shadow-xl transition-all duration-400 border-2 border-blue-200"
          style={{
            transform: `translateY(${leftHandY - 50}%) rotate(${leftHandAngle}deg)`,
            transformOrigin: 'right center'
          }}>
          
            {/* Fingers */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {[...Array(5)].map((_, i) =>
            <div
              key={i}
              className="w-2 h-6 bg-gradient-to-t from-blue-400 to-blue-300 rounded-full"
              style={{
                height: `${20 + Math.random() * 10}px`,
                transform: `rotate(${(i - 2) * 8}deg)`
              }} />

            )}
            </div>
          </div>
        }

        {/* Right hand */}
        {isActive &&
        <div
          className="absolute -right-12 top-1/2 w-20 h-28 bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 rounded-2xl shadow-xl transition-all duration-400 border-2 border-blue-200"
          style={{
            transform: `translateY(${rightHandY - 50}%) rotate(${rightHandAngle}deg)`,
            transformOrigin: 'left center'
          }}>
          
            {/* Fingers */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {[...Array(5)].map((_, i) =>
            <div
              key={i}
              className="w-2 h-6 bg-gradient-to-t from-blue-400 to-blue-300 rounded-full"
              style={{
                height: `${20 + Math.random() * 10}px`,
                transform: `rotate(${(i - 2) * 8}deg)`
              }} />

            )}
            </div>
          </div>
        }

        {/* Glow effect */}
        {isActive &&
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${getEmotionGradient()} opacity-30 blur-2xl animate-pulse`} />

        }
      </div>

      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' : 'bg-gray-600'} transition-all duration-300`} />
          
          <span className="text-lg font-semibold text-white">
            {isActive ? 'Signing...' : 'Waiting for input'}
          </span>
        </div>

        {isActive &&
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl px-6 py-3 backdrop-blur-sm border border-purple-500/30 shadow-lg">
            <p className="text-sm text-gray-300">
              Displaying in{' '}
              <span className="font-bold text-purple-400">{language}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              With{' '}
              <span className="font-semibold text-pink-400">{emotion}</span>{' '}
              expression
            </p>
          </div>
        }
      </div>
    </div>);

}