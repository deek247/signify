import React, { useState } from 'react';
import { GlobeIcon, BellIcon, ShieldIcon, UserIcon } from 'lucide-react';
export function Settings() {
  const [selectedLanguage, setSelectedLanguage] = useState('ASL');
  const [notifications, setNotifications] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const signLanguages = [
  {
    code: 'ASL',
    name: 'American Sign Language',
    region: 'United States'
  },
  {
    code: 'ISL',
    name: 'Indian Sign Language',
    region: 'India'
  },
  {
    code: 'BSL',
    name: 'British Sign Language',
    region: 'United Kingdom'
  },
  {
    code: 'AUSLAN',
    name: 'Australian Sign Language',
    region: 'Australia'
  },
  {
    code: 'ESL',
    name: 'Emirati Sign Language',
    region: 'United Arab Emirates'
  },
  {
    code: 'LSF',
    name: 'French Sign Language',
    region: 'France'
  },
  {
    code: 'DGS',
    name: 'German Sign Language',
    region: 'Germany'
  }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-300 text-lg">
          Customize your Signify experience
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
              <GlobeIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Sign Language Preferences
            </h2>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Primary Sign Language
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {signLanguages.map((lang) =>
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-5 rounded-xl border-2 transition-all duration-300 text-left ${selectedLanguage === lang.code ? 'border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-500/30 scale-105' : 'border-gray-700 bg-gray-900/30 hover:border-gray-600 hover:bg-gray-800/50'}`}>
                
                  <div className="font-semibold text-white">{lang.name}</div>
                  <div className="text-sm text-gray-400">{lang.region}</div>
                  {selectedLanguage === lang.code &&
                <div className="mt-2 text-xs font-medium text-blue-400">
                      ✓ Selected
                    </div>
                }
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <BellIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-700">
              <div>
                <p className="font-medium text-white">Enable Notifications</p>
                <p className="text-sm text-gray-400">
                  Receive alerts for translation updates
                </p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${notifications ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/50' : 'bg-gray-700'}`}>
                
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700 hover:border-green-500/50 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50">
              <ShieldIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Privacy & Security
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-700">
              <div>
                <p className="font-medium text-white">Data Collection</p>
                <p className="text-sm text-gray-400">
                  Allow anonymous usage data collection
                </p>
              </div>
              <button
                onClick={() => setDataCollection(!dataCollection)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${dataCollection ? 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/50' : 'bg-gray-700'}`}>
                
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${dataCollection ? 'translate-x-6' : 'translate-x-1'}`} />
                
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                All audio and video data is processed locally on your device. No
                personal information is stored on external servers without your
                explicit consent.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700 hover:border-orange-500/50 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/50">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Accessibility</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-700">
              <div>
                <p className="font-medium text-white">High Contrast Mode</p>
                <p className="text-sm text-gray-400">
                  Increase visual contrast for better visibility
                </p>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${highContrast ? 'bg-gradient-to-r from-orange-600 to-red-600 shadow-lg shadow-orange-500/50' : 'bg-gray-700'}`}>
                
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
                
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}