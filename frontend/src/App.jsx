import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import AnonymousReportPage from './pages/AnonymousReportPage';
import ReportSuccessPage from './pages/ReportSuccessPage';
import TrackReportPage from './pages/TrackReportPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminReports from './pages/AdminReports';
import AdminReportDetails from './pages/AdminReportDetails';
import AdminAnalytics from './pages/AdminAnalytics';
import AIInsights from './pages/AIInsights';
import AuthorityDashboard from './pages/AuthorityDashboard';
import ReviewerDashboard from './pages/ReviewerDashboard';
import AuthorityReportDetails from './pages/AuthorityReportDetails';
import SettingsPage from './pages/SettingsPage';

function AppLayout({ children }) {
  const location = useLocation();
  const isDashboard = 
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/authority') ||
    location.pathname.startsWith('/reviewer') ||
    location.pathname.startsWith('/settings');

  return (
    <div className="app-container">
      {!isDashboard && <Navbar />}
      <div className="main-content">
        {children}
      </div>
      {!isDashboard && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Public Anonymous Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/report" element={<AnonymousReportPage />} />
            <Route path="/report/success" element={<ReportSuccessPage />} />
            <Route path="/track" element={<TrackReportPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Central Admin Governance Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/reports/:id" element={<AdminReportDetails />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/insights" element={<AIInsights />} />
            <Route path="/admin/audit-logs" element={<SettingsPage />} />

            {/* Authority / Management Portal */}
            <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
            <Route path="/authority/reports/:id" element={<AuthorityReportDetails />} />

            {/* Reviewer / Moderation Portal */}
            <Route path="/reviewer/dashboard" element={<ReviewerDashboard />} />

            {/* Settings & Policies */}
            <Route path="/settings" element={<SettingsPage />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}
