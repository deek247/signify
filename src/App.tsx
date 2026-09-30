import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Conversation } from './pages/Conversation';
import { Security } from './pages/Security';
import { Settings } from './pages/Settings';
export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/conversation" element={<Conversation />} />
          <Route path="/security" element={<Security />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>);

}