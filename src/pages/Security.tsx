import React, { useState } from 'react';
import {
  ShieldIcon,
  LockIcon,
  UnlockIcon,
  AlertTriangleIcon } from
'lucide-react';
export function Security() {
  const [isHashed, setIsHashed] = useState(false);
  const [originalAudio, setOriginalAudio] = useState(
    'Hello, this is sensitive information'
  );
  const [hashedAudio, setHashedAudio] = useState('');
  const generateHash = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  };
  const applyAudioHashing = () => {
    setIsHashed(true);
    const hash = generateHash(originalAudio);
    setHashedAudio(hash);
    setTimeout(() => {
      playNoise();
    }, 500);
  };
  const playNoise = () => {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      const duration = 2;
      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(
        1,
        duration * sampleRate,
        sampleRate
      );
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.1;
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      source.start();
    }
  };
  const resetDemo = () => {
    setIsHashed(false);
    setHashedAudio('');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
          Audio Hashing Security
        </h1>
        <p className="text-gray-300 text-lg">
          Enterprise-grade privacy protection for sensitive communications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:scale-105 hover:shadow-green-500/20">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/50">
            <ShieldIcon className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            End-to-End Encryption
          </h3>
          <p className="text-gray-400">
            All audio data is encrypted during transmission and storage
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
            <LockIcon className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Audio Hashing</h3>
          <p className="text-gray-400">
            Convert sensitive audio to noise when unauthorized access is
            detected
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
            <AlertTriangleIcon className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Access Control</h3>
          <p className="text-gray-400">
            Multi-layer authentication and authorization protocols
          </p>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Audio Hashing Demonstration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50">
                <UnlockIcon className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Original Audio Data
              </h3>
            </div>

            <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm shadow-lg shadow-green-500/10">
              <p className="text-sm font-medium text-gray-400 mb-3">
                Authorized Access:
              </p>
              <p className="text-white text-lg">{originalAudio}</p>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-400">
                When accessed by authorized users, the audio data remains clear
                and understandable.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/50">
                <LockIcon className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Hashed Audio Data
              </h3>
            </div>

            <div
              className={`${isHashed ? 'bg-red-900/30 border-red-500/30 shadow-red-500/20' : 'bg-gray-900/30 border-gray-700'} border rounded-xl p-6 backdrop-blur-sm shadow-lg transition-all duration-300`}>
              
              <p className="text-sm font-medium text-gray-400 mb-3">
                Unauthorized Access:
              </p>
              {isHashed ?
              <div className="space-y-3">
                  <p className="text-white font-mono text-xs break-all bg-gray-950/50 p-3 rounded-lg border border-red-500/30">
                    {hashedAudio}
                  </p>
                  <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/30">
                    <AlertTriangleIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Audio converted to noise
                    </span>
                  </div>
                </div> :

              <p className="text-gray-500 italic">
                  Click the button below to simulate unauthorized access
                </p>
              }
            </div>

            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-400">
                When unauthorized access is detected, the audio is immediately
                converted to random noise, making it impossible to extract the
                original information.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={applyAudioHashing}
            disabled={isHashed}
            className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 ${isHashed ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/70 hover:scale-105'}`}>
            
            Simulate Unauthorized Access
          </button>

          {isHashed &&
          <button
            onClick={resetDemo}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 hover:scale-105">
            
              Reset Demo
            </button>
          }
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h4 className="font-bold text-blue-300 mb-3 text-lg">
            How Audio Hashing Works:
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>Audio data is continuously monitored for access patterns</li>
            <li>Unauthorized access attempts trigger the hashing algorithm</li>
            <li>Original audio is instantly converted to cryptographic hash</li>
            <li>Hash is then transformed into random noise frequencies</li>
            <li>
              Original data becomes permanently unrecoverable by third parties
            </li>
          </ol>
        </div>
      </div>
    </div>);

}