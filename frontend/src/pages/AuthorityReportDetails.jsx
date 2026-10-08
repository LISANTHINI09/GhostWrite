import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building, Send, Clock, CheckCircle, AlertTriangle, ShieldCheck, Download } from 'lucide-react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';

export default function AuthorityReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [resolutionProof, setResolutionProof] = useState('');
  const [newStatus, setNewStatus] = useState('ACTION_TAKEN');
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/authority/reports/${id}`);
      if (res.data.success) {
        setReport(res.data.data);
        if (res.data.data.authorityResponse) {
          setResponseText(res.data.data.authorityResponse);
        }
        if (res.data.data.resolutionNotes) {
          setResolutionProof(res.data.data.resolutionNotes);
        }
        setNewStatus(res.data.data.status);
      }
    } catch (err) {
      console.error('Failed to load authority report detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    try {
      setSubmitting(true);
      await api.post(`/authority/reports/${id}/response`, {
        responseText: responseText.trim(),
        resolutionNotes: resolutionProof.trim() || undefined,
        statusUpdate: newStatus,
        remarks: 'Official departmental response and action recorded'
      });
      setActionSuccess('Official response successfully published to the tracking record');
      fetchDetail();
    } catch (err) {
      alert('Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !report) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Loading department dossier...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Navigation & Action Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link to="/authority/dashboard" className="btn btn-secondary btn-sm">
              <ArrowLeft size={14} /> Back to Queue
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="font-mono" style={{ fontSize: '22px', fontWeight: '800', color: '#60A5FA' }}>
                  {report.reportId}
                </span>
                <span className={`badge badge-${report.status.toLowerCase()}`}>
                  {report.status.replace('_', ' ')}
                </span>
                <span className={`badge badge-${report.priority.toLowerCase()}`}>
                  {report.priority}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Assigned to: <strong>{report.department}</strong> • Anonymity Guaranteed
              </div>
            </div>
          </div>

          <a
            href={`http://localhost:8080/api/documents/${report.reportId}/download`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Download Formal Dossier
          </a>
        </div>

        {actionSuccess && (
          <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#34D399', fontSize: '13px', marginBottom: '20px' }}>
            ✓ {actionSuccess}
          </div>
        )}

        {/* Structured Formal Dossier */}
        <div className="card" style={{ padding: '24px', marginBottom: '28px', background: '#0F172A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#60A5FA', textTransform: 'uppercase' }}>
              AI Synthesized Representation
            </span>
            <span style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} /> Facts Strictly Preserved
            </span>
          </div>

          <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
            {report.professionalTitle}
          </div>

          <div style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '14px' }}>
            <strong style={{ color: '#fff' }}>Executive Summary:</strong> {report.executiveSummary}
          </div>

          <div style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '14px', whiteSpace: 'pre-line' }}>
            <strong style={{ color: '#fff' }}>Substantive Factual Record:</strong> {report.detailedDescription}
          </div>

          <div style={{ fontSize: '13px', color: '#93C5FD', lineHeight: '1.6' }}>
            <strong style={{ color: '#fff' }}>Requested Action:</strong> {report.requestedAction}
          </div>
        </div>

        {/* Action Form & Chat Grid */}
        <div className="grid grid-2" style={{ marginBottom: '28px' }}>
          
          {/* Department Official Statement Form */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={16} color="#3B82F6" /> Official Departmental Action / Finding
            </h3>

            <form onSubmit={handleSubmitResponse}>
              <div className="form-group">
                <label className="form-label">Investigation Statement (Visible to Anonymous Reporter)</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Detail inspection results, corrective measures enacted, or service updates..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Resolution Proof / Work Order Reference (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Work Order MW-849 executed on 08-Oct"
                  value={resolutionProof}
                  onChange={(e) => setResolutionProof(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Update Case Status</label>
                <select
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ marginBottom: '14px' }}
                >
                  <option value="IN_PROGRESS">IN PROGRESS (Inspection Ongoing)</option>
                  <option value="ACTION_TAKEN">ACTION TAKEN (Remedial Action Complete)</option>
                  <option value="RESOLVED">RESOLVED (Grievance Fully Redressed)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting || !responseText.trim()}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                {submitting ? 'Recording Action...' : <><Send size={15} /> Publish Official Finding</>}
              </button>
            </form>
          </div>

          {/* Anonymous Two-Way Chat */}
          <div>
            <ChatBox
              reportId={report.reportId}
              isAuthority={true}
            />
          </div>

        </div>

      </main>
    </div>
  );
}
