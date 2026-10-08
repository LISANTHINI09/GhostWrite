import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Feather, Search, Lock, User, LogOut, LayoutDashboard, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ROLE_ADMIN') return '/admin/dashboard';
    if (user.role === 'ROLE_AUTHORITY') return '/authority/dashboard';
    if (user.role === 'ROLE_REVIEWER') return '/reviewer/dashboard';
    return '/admin/dashboard';
  };

  return (
    <nav style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '14px 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
          }}>
            <Feather size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px', color: '#FFFFFF' }}>GhostWrite</span>
              <span style={{
                fontSize: '10px',
                fontWeight: '700',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <ShieldCheck size={11} /> 100% ANONYMOUS
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AI-Powered Grievance Redressal</div>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Home
          </Link>
          <Link to="/track" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            <Search size={15} /> Track Report
          </Link>
          <Link to="/report" className="btn btn-primary btn-sm" style={{ padding: '8px 16px', borderRadius: '8px' }}>
            <Feather size={15} /> Submit Anonymous Report
          </Link>
        </div>

        {/* Right CTA / Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to={getDashboardPath()} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <User size={13} color="#94A3B8" />
                <span style={{ color: '#F8FAFC', fontWeight: '600' }}>{user.fullName.split(' ')[0]}</span>
                <span style={{
                  fontSize: '9px',
                  background: 'var(--primary)',
                  color: '#fff',
                  padding: '1px 5px',
                  borderRadius: '4px'
                }}>
                  {user.role.replace('ROLE_', '')}
                </span>
              </div>
              <button onClick={() => { logout(); navigate('/'); }} className="btn btn-ghost btn-sm" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> Authority Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}
