import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Heart, FileText, HelpCircle, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#080C14',
      borderTop: '1px solid var(--border-subtle)',
      padding: '48px 0 24px',
      marginTop: '60px'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={18} color="#fff" />
              </div>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>GhostWrite</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
              Next-generation confidential grievance reporting and AI ghost-writing infrastructure designed to protect student and staff integrity within educational institutions.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontSize: '12px',
              color: '#34D399'
            }}>
              <Lock size={13} /> Zero-Knowledge Identity Isolation
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', color: '#fff' }}>
              Platform Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home & Overview</Link>
              <Link to="/report" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Submit Anonymous Grievance</Link>
              <Link to="/track" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Track Existing Report</Link>
              <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Institutional Authority Portal</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', color: '#fff' }}>
              Core Guarantees
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div>🛡️ No Identity or IP Trace Logging</div>
              <div>🤖 AI Fact-Preserving Tone Transformation</div>
              <div>⚡ Multi-Tier Escalation SLA Engine</div>
              <div>💬 Cryptographically Decoupled 2-Way Chat</div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', color: '#fff' }}>
              Statutory Support
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              If you face immediate physical danger or critical harassment, access emergency campus helplines:
            </p>
            <div style={{ fontSize: '12px', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>📞 Campus Emergency: <strong>1800-CAMPUS-SAFE</strong></div>
              <div>✉️ Internal Complaints: <strong>icc.redressal@inst.edu</strong></div>
            </div>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <div>© {new Date().getFullYear()} GhostWrite Institutional Platform. Designed for Institutional Governance & Placement Showcase.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>Security Framework</span>
            <span>Terms of Redressal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
