import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  Building, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Lock,
  ArrowRight
} from 'lucide-react';
import api from '../api';
import ChatBox from '../components/ChatBox';

export default function TrackReportPage() {
  const location = useLocation();
  const prefill = location.state || {};

  const [reportId, setReportId] = useState(prefill.prefillId || '');
  const [trackingToken, setTrackingToken] = useState(prefill.prefillToken || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  const sampleReports = [
    { id: 'GW-2026-WGJDTL', token: 'TK-DEMO-SAMPLE-HOST', desc: 'Hostel Water Quality Concern' },
    { id: 'GW-2026-WEED6F', token: 'TK-DEMO-SAMPLE-LIFT', desc: 'Engineering Block Elevator Safety' },
  ];

  const handleLookup = async (e) => {
    if (e) e.preventDefault();
    if (!reportId.trim() || !trackingToken.trim()) {
      setError('Please provide both the Report ID and Tracking Token.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/reports/track/${reportId.trim()}?token=${encodeURIComponent(trackingToken.trim())}`);
      if (res.data.success && res.data.data) {
        setReportData(res.data.data);
      } else {
        setError(res.data.message || 'Report not found.');
      }
    } catch (err) {
      if (err.response?.status === 403 || err.response?.data?.error === 'INVALID_TRACKING_TOKEN') {
        setError('Incorrect Tracking Token for this Report ID. Please verify your token.');
      } else if (err.response?.status === 404) {
        setError('No report found matching Report ID ' + reportId);
      } else {
        setError(err.response?.data?.message || 'Unable to retrieve tracking record. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prefill.prefillId && prefill.prefillToken) {
      handleLookup();
    }
  }, []);

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : 'submitted';
    return <span className={`badge badge-${s}`}>{status ? status.replace('_', ' ') : 'SUBMITTED'}</span>;
  };

  const getPriorityBadge = (priority) => {
    const p = priority ? priority.toLowerCase() : 'p3';
    return <span className={`badge badge-${p}`}>{priority || 'P3'}</span>;
  };

  return (
    <div className="container" style={{ maxWidth: '960px', padding: '40px 20px' }}>
      
      {/* Lookup Card */}
      <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Search size={20} color="#3B82F6" />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>
              Track Anonymous Grievance Progress
            </h2>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Enter your secret token key to decrypt status updates and communicate with investigators.
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
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

        <form onSubmit={handleLookup} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Report ID</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. GW-2026-WGJDTL"
              value={reportId}
              onChange={(e) => setReportId(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Tracking Token (Secret Key)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. TK-4921-2819-3829"
              value={trackingToken}
              onChange={(e) => setTrackingToken(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ height: '46px', padding: '0 24px' }}
          >
            {loading ? 'Decrypting...' : <><Search size={16} /> Track Status</>}
          </button>
        </form>

        {/* Demo Fast Fill Helper */}
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>Demo Quick-Fill:</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => { setReportId('GW-2026-WGJDTL'); setTrackingToken('TK-DEMO-SAMPLE-HOST'); }}
            style={{ fontSize: '11px', color: '#60A5FA' }}
          >
            Test Report (Hostel)
          </button>
        </div>
      </div>

      {/* TRACKING REPORT DETAILS */}
      {reportData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Summary Card */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span className="font-mono" style={{ fontSize: '20px', fontWeight: '800', color: '#60A5FA' }}>
                    {reportData.reportId}
                  </span>
                  {getStatusBadge(reportData.status)}
                  {getPriorityBadge(reportData.priority)}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                  {reportData.professionalTitle}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span>Department: <strong style={{ color: '#E2E8F0' }}>{reportData.department || 'General Administration'}</strong></span>
                  <span>Category: <strong style={{ color: '#E2E8F0' }}>{reportData.category}</strong></span>
                  <span>Filed: <strong style={{ color: '#E2E8F0' }}>{new Date(reportData.createdAt).toLocaleDateString()}</strong></span>
                </div>
              </div>

              <a
                href={`http://localhost:8080/api/documents/${reportData.reportId}/download`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} /> Download Formal Dossier
              </a>
            </div>

            {/* Lifecycle Progress Bar */}
            <div style={{ background: '#090D16', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Resolution Stage Tracker
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'ACTION_TAKEN', 'RESOLVED'].map((stage, idx) => {
                  const statusOrder = ['SUBMITTED', 'AI_PROCESSED', 'PENDING_REVIEW', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'ACTION_TAKEN', 'RESOLVED'];
                  const currentIndex = statusOrder.indexOf(reportData.status);
                  const stepIndex = statusOrder.indexOf(stage);
                  const isPassed = currentIndex >= stepIndex;
                  const isCurrent = reportData.status === stage;

                  return (
                    <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isPassed ? '#10B981' : '#1E293B',
                        color: '#fff',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 6px',
                        border: isCurrent ? '2px solid #60A5FA' : 'none'
                      }}>
                        {isPassed ? '✓' : idx + 1}
                      </div>
                      <div style={{ fontSize: '10px', color: isPassed ? '#E2E8F0' : 'var(--text-muted)', fontWeight: isPassed ? '700' : '500' }}>
                        {stage.replace('_', ' ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Authority Official Response Banner */}
            {reportData.authorityResponse && (
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#60A5FA', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={16} /> Official Departmental Response
                </div>
                <div style={{ fontSize: '14px', color: '#F8FAFC', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {reportData.authorityResponse}
                </div>
                {reportData.resolutionNotes && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed rgba(59, 130, 246, 0.2)', fontSize: '12px', color: '#93C5FD' }}>
                    <strong>Resolution Proof / Verification:</strong> {reportData.resolutionNotes}
                  </div>
                )}
              </div>
            )}

            {/* Ghost Written Formal Content Accordion */}
            <div style={{ background: '#0D1322', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                Structured Dossier Representation
              </h4>
              <div style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '14px' }}>
                <strong style={{ color: '#fff' }}>Executive Summary:</strong> {reportData.executiveSummary}
              </div>
              <div style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '14px', whiteSpace: 'pre-line' }}>
                <strong style={{ color: '#fff' }}>Detailed Findings:</strong> {reportData.detailedDescription}
              </div>
              <div style={{ fontSize: '13px', color: '#60A5FA', lineHeight: '1.6' }}>
                <strong style={{ color: '#fff' }}>Requested Action:</strong> {reportData.requestedAction}
              </div>
            </div>

          </div>

          {/* Activity Timeline Card */}
          <div className="card" style={{ padding: '28px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#3B82F6" /> Administrative Activity Log
            </h4>

            <div className="timeline">
              {reportData.timeline?.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className={`timeline-node ${idx === reportData.timeline.length - 1 ? 'active' : ''}`} />
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                    Status Transition: {item.newStatus.replace('_', ' ')}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {item.remarks}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {new Date(item.timestamp).toLocaleString()} • {item.changedByRole}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded Anonymous Two-Way Chat */}
          <ChatBox
            reportId={reportData.reportId}
            trackingToken={trackingToken}
            isAuthority={false}
          />

        </div>
      )}

    </div>
  );
}
