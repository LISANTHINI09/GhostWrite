import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Copy, Check, Search, AlertTriangle, ArrowRight, Home, Printer } from 'lucide-react';

export default function ReportSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  const [copiedId, setCopiedId] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  if (!result) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '16px' }}>No Active Submission Record</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Please file a grievance from the submission portal.
        </p>
        <Link to="/report" className="btn btn-primary">File a Report</Link>
      </div>
    );
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '680px', padding: '60px 20px' }}>
      <div className="card" style={{ padding: '40px 32px', textAlign: 'center', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
        
        {/* Animated Badge */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '2px solid #10B981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 0 24px rgba(16, 185, 129, 0.3)'
        }}>
          <ShieldCheck size={36} color="#10B981" />
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px' }}>
          Grievance Securely Registered
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Your report has been cryptographically decoupled from your device and identity.
        </p>

        {/* Credentials Box */}
        <div style={{
          background: '#090D16',
          border: '1px solid var(--border-strong)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'left',
          marginBottom: '24px'
        }}>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>
              Official Report ID
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="font-mono" style={{ fontSize: '20px', fontWeight: '800', color: '#60A5FA', letterSpacing: '1px' }}>
                {result.reportId}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(result.reportId, 'id')}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 12px' }}
              >
                {copiedId ? <><Check size={14} color="#10B981" /> Copied</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <div style={{ fontSize: '11px', color: '#FBBF24', textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>
              Confidential Tracking Token (Secret Key)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="font-mono" style={{ fontSize: '18px', fontWeight: '700', color: '#FBBF24', letterSpacing: '1px' }}>
                {result.trackingToken}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(result.trackingToken, 'token')}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 12px' }}
              >
                {copiedToken ? <><Check size={14} color="#10B981" /> Copied</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          </div>

        </div>

        {/* Warning Banner */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'left',
          display: 'flex',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <AlertTriangle size={24} color="#FBBF24" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: '1.5' }}>
            <strong>CRITICAL: Save this Tracking Token immediately.</strong> Because GhostWrite does not retain your email or phone number, this token is your <strong>only</strong> key to track progress, read administrative findings, and message investigators.
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/track', { state: { prefillId: result.reportId, prefillToken: result.trackingToken } })}
            className="btn btn-primary"
            style={{ padding: '12px 24px' }}
          >
            <Search size={16} /> Track Report Now
          </button>

          <button
            onClick={() => window.print()}
            className="btn btn-secondary"
            style={{ padding: '12px 20px' }}
          >
            <Printer size={16} /> Print Receipt
          </button>

          <Link to="/" className="btn btn-outline" style={{ padding: '12px 20px' }}>
            <Home size={16} /> Return to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
