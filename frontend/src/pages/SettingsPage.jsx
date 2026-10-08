import React, { useState, useEffect } from 'react';
import { Settings, Shield, Cpu, Database, Clock, RefreshCw } from 'lucide-react';
import api from '../api';
import Sidebar from '../components/Sidebar';

export default function SettingsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/audit-logs');
        if (res.data.success) {
          setLogs(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>
            System Architecture & SLA Policies
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Escalation thresholds, AI model abstraction configuration, and immutable security audit logs
          </p>
        </div>

        <div className="grid grid-3" style={{ marginBottom: '28px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60A5FA', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
              <Clock size={16} /> Automated SLA Policies
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>• Critical (P1): <strong>12-Hour Escalation</strong></div>
              <div>• High (P2): <strong>24-Hour Escalation</strong></div>
              <div>• Medium (P3): <strong>72-Hour Escalation</strong></div>
              <div>• Low (P4): <strong>7-Day Resolution Window</strong></div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
              <Cpu size={16} /> AI Provider Layer
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>• Active Engine: <strong>Local Heuristic NLP</strong></div>
              <div>• LLM Plug: <strong>Gemini / OpenAI Ready</strong></div>
              <div>• Fallback SLA: <strong>100% Zero-Latency Local</strong></div>
              <div>• Fact Distortion Filter: <strong>Enforced</strong></div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
              <Database size={16} /> Storage & Isolation
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>• Database: <strong>MySQL 8.0 (ghostwrite_db)</strong></div>
              <div>• Identity Decoupling: <strong>Active</strong></div>
              <div>• Voluntary Contacts: <strong>Isolated Vault</strong></div>
              <div>• Passwords & Tokens: <strong>BCrypt Hash</strong></div>
            </div>
          </div>
        </div>

        {/* Security Audit Logs */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="#3B82F6" /> Immutable Administrative Audit Log
          </h3>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Docket Target</th>
                  <th>Initiator Role</th>
                  <th>User / System</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 15).map((log) => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <span className="badge badge-submitted">{log.action}</span>
                    </td>
                    <td style={{ fontFamily: 'monospace', color: '#60A5FA' }}>
                      {log.targetReportId || 'GLOBAL'}
                    </td>
                    <td style={{ fontSize: '11px' }}>{log.performedByRole}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{log.performedByUser}</td>
                    <td style={{ color: '#CBD5E1', fontSize: '12px' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
