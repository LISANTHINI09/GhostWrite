import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Shield, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      if (user.role === 'ROLE_ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'ROLE_AUTHORITY') navigate('/authority/dashboard');
      else if (user.role === 'ROLE_REVIEWER') navigate('/reviewer/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid institutional credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (role) => {
    setPassword('GhostWrite@2026');
    if (role === 'admin') setEmail('admin@ghostwrite.com');
    if (role === 'authority') setEmail('authority@ghostwrite.com');
    if (role === 'reviewer') setEmail('reviewer@ghostwrite.com');
  };

  return (
    <div className="container" style={{ maxWidth: '480px', padding: '60px 20px' }}>
      <div className="card" style={{ padding: '36px 32px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px'
          }}>
            <Lock size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>
            Institutional Portal Login
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Authorized access for Administrators, Department Authorities, and Reviewers
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#F87171',
            fontSize: '13px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Official Institutional Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="authority@institution.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : <><UserCheck size={18} /> Sign In To Portal</>}
          </button>
        </form>

        {/* Quick-fill Demo Roles */}
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>
            Demo Account Switcher (One-Click)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillCredentials('admin')}
              style={{ fontSize: '11px', padding: '8px 4px', flexDirection: 'column', gap: '2px' }}
            >
              <strong style={{ color: '#60A5FA' }}>Admin</strong>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Chief Admin</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillCredentials('authority')}
              style={{ fontSize: '11px', padding: '8px 4px', flexDirection: 'column', gap: '2px' }}
            >
              <strong style={{ color: '#34D399' }}>Authority</strong>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Hostel Warden</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillCredentials('reviewer')}
              style={{ fontSize: '11px', padding: '8px 4px', flexDirection: 'column', gap: '2px' }}
            >
              <strong style={{ color: '#FBBF24' }}>Reviewer</strong>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Ethics Desk</span>
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
            Default password: <code>GhostWrite@2026</code>
          </div>
        </div>

      </div>
    </div>
  );
}
