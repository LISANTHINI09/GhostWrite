import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Clock, AlertTriangle, CheckCircle, Layers, Building, ShieldCheck } from 'lucide-react';
import api from '../api';
import Sidebar from '../components/Sidebar';

export default function AdminAnalytics() {
  const [kpis, setKpis] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [kpiRes, clusterRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/clusters')
        ]);
        if (kpiRes.data.success) setKpis(kpiRes.data.data);
        if (clusterRes.data.success) setClusters(clusterRes.data.data || []);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !kpis) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Calculating institutional metrics...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        
        {/* Title Bar */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>
            Institutional Analytics & Accountability Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Comprehensive performance metrics, recurring hotspots, and department SLA tracking
          </p>
        </div>

        {/* Top 4 Performance Banners */}
        <div className="grid grid-4" style={{ marginBottom: '28px' }}>
          <div className="card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL REGISTERED GRIEVANCES</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginTop: '6px' }}>{kpis.totalReports}</div>
            <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>100% Zero-Identity Decoupled</div>
          </div>

          <div className="card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>AVG RESOLUTION TURNAROUND</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#60A5FA', marginTop: '6px' }}>{kpis.averageResolutionHours}h</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Benchmark SLA: 48.0 hours</div>
          </div>

          <div className="card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>ESCALATION RATE</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#F59E0B', marginTop: '6px' }}>
              {kpis.totalReports ? `${Math.round((kpis.escalatedReports / kpis.totalReports) * 100)}%` : '0%'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{kpis.escalatedReports} auto-escalated cases</div>
          </div>

          <div className="card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>SUCCESSFUL RESOLUTION</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#10B981', marginTop: '6px' }}>
              {kpis.totalReports ? `${Math.round((kpis.resolvedReports / kpis.totalReports) * 100)}%` : '0%'}
            </div>
            <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>{kpis.resolvedReports} verified redressed</div>
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-2" style={{ marginBottom: '32px' }}>
          
          {/* Department Performance */}
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={16} color="#3B82F6" /> Departmental Caseload Volume
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(kpis.reportsByDepartment || {}).map(([dept, count]) => {
                const pct = Math.round((count / (kpis.totalReports || 1)) * 100);
                return (
                  <div key={dept}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: '#E2E8F0', fontWeight: '500' }}>{dept}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: '700' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #3B82F6, #06B6D4)', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#3B82F6" /> Grievance Pipeline Velocity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(kpis.reportsByStatus || {}).map(([st, count]) => {
                const pct = Math.round((count / (kpis.totalReports || 1)) * 100);
                return (
                  <div key={st}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: '#E2E8F0', fontWeight: '500' }}>{st.replace('_', ' ')}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: '700' }}>{count}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #3B82F6)', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Recurring Issue Clusters Table */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff' }}>
                Top Recurring Issue Clusters (Pattern Detection)
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Intelligent semantic clustering identifying problems affecting multiple individuals
              </div>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cluster Code</th>
                  <th>Cluster Identification</th>
                  <th>Category</th>
                  <th>Affected Area</th>
                  <th>Report Count</th>
                  <th>Severity Tier</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {clusters.slice(0, 10).map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'monospace', color: '#60A5FA', fontWeight: '700' }}>
                      {c.clusterCode}
                    </td>
                    <td style={{ fontWeight: '600', color: '#fff' }}>
                      {c.title}
                    </td>
                    <td>{c.category}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.affectedArea || 'Campus Wide'}</td>
                    <td>
                      <span style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60A5FA',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: '700',
                        fontSize: '12px'
                      }}>
                        {c.reportCount} reports
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${c.severity ? c.severity.toLowerCase() : 'high'}`}>
                        {c.severity}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-submitted">{c.status}</span>
                    </td>
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
