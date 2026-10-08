import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart2, 
  Brain, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  Users, 
  Layers, 
  CheckCircle,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const isAdmin = user.role === 'ROLE_ADMIN';
  const isAuthority = user.role === 'ROLE_AUTHORITY';
  const isReviewer = user.role === 'ROLE_REVIEWER';

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
    background: isActive ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.15))' : 'transparent',
    border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: isActive ? '600' : '500',
    transition: 'all 0.2s ease',
  });

  return (
    <aside className="dashboard-sidebar">
      {/* Header */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '16px', color: '#fff' }}>GhostWrite</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {isAdmin ? 'Central Admin' : isAuthority ? 'Department Portal' : 'Reviewer Desk'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
        
        {isAdmin && (
          <>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Governance
            </div>
            <NavLink to="/admin/dashboard" style={linkStyle}>
              <LayoutDashboard size={17} /> Overview Dashboard
            </NavLink>
            <NavLink to="/admin/reports" style={linkStyle}>
              <FileText size={17} /> All Grievances
            </NavLink>
            <NavLink to="/admin/analytics" style={linkStyle}>
              <BarChart2 size={17} /> Institutional Analytics
            </NavLink>
            <NavLink to="/admin/insights" style={linkStyle}>
              <Brain size={17} /> AI Insights & Trends
            </NavLink>
          </>
        )}

        {isAuthority && (
          <>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Department Ops
            </div>
            <NavLink to="/authority/dashboard" style={linkStyle}>
              <LayoutDashboard size={17} /> Assigned Queue
            </NavLink>
            <NavLink to="/admin/analytics" style={linkStyle}>
              <BarChart2 size={17} /> Department Metrics
            </NavLink>
          </>
        )}

        {isReviewer && (
          <>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Moderation
            </div>
            <NavLink to="/reviewer/dashboard" style={linkStyle}>
              <CheckCircle size={17} /> Verification Queue
            </NavLink>
            <NavLink to="/admin/reports" style={linkStyle}>
              <FileText size={17} /> All Reports
            </NavLink>
          </>
        )}

        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', padding: '16px 12px 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Quick Links
        </div>
        <NavLink to="/" style={linkStyle}>
          <Home size={17} /> Public Portal
        </NavLink>
        <NavLink to="/track" style={linkStyle}>
          <FileText size={17} /> Grievance Tracker
        </NavLink>
      </div>

      {/* User profile & Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user.fullName}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user.department || user.email}
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/'); }} 
            className="btn btn-ghost btn-sm" 
            title="Log Out"
            style={{ color: '#EF4444', padding: '6px' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
