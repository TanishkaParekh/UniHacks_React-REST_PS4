import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DiscoveryPage from './pages/DiscoveryPage';
import AdminDashboard from './pages/AdminDashboard';
import QueueStatusPage from './pages/QueueStatusPage';

import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';

import { ThemeProvider } from './context/ThemeContext';
import { QueueProvider } from './context/QueueContext';

function App() {
  return (
    <ThemeProvider>
      <QueueProvider>
        <Router>
          <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-300">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/discovery" element={<DiscoveryPage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/queue-status" element={<QueueStatusPage />} />
              <Route path="/features" element={<div className="pt-32 text-center h-screen">Features Page Placeholder</div>} />
              <Route path="/about" element={<div className="pt-32 text-center h-screen">About Page Placeholder</div>} />
            </Routes>
          </div>
        </Router>
      </QueueProvider>
    </ThemeProvider>
  );
}

export default App;
