import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Edit3, XCircle, AlertTriangle, Layers, Eye, RefreshCw, Zap, Sparkles } from 'lucide-react';
import api from '../api';
import Sidebar from '../components/Sidebar';

export default function ReviewerDashboard() {
  const [pendingReports, setPendingReports] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewModal, setReviewModal] = useState(null); // 'approve', 'edit', 'reject', 'duplicate', 'escalate'
  const [editForm, setEditForm] = useState({});
  const [remarks, setRemarks] = useState('');
  const [selectedClusterId, setSelectedClusterId] = useState('');
  const [actionSuccess, setActionSuccess] = useState(null);
  const [inspectDetail, setInspectDetail] = useState(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  const handleInspect = async (report) => {
    try {
      setInspectLoading(true);
      const res = await api.get(`/reviewer/reports/${report.reportId}`);
      if (res.data.success) {
        setInspectDetail(res.data.data);
      } else {
        setInspectDetail(report);
      }
    } catch (err) {
      console.error('Failed to load report detail:', err);
      setInspectDetail(report);
    } finally {
      setInspectLoading(false);
    }
  };

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const [queueRes, clusterRes] = await Promise.all([
        api.get('/reviewer/pending?size=20'),
        api.get('/clusters')
      ]);
      if (queueRes.data.success) setPendingReports(queueRes.data.data.content || []);
      if (clusterRes.data.success) setClusters(clusterRes.data.data || []);
    } catch (err) {
      console.error('Failed to load reviewer queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleExecuteAction = async (action) => {
    try {
      await api.post(`/reviewer/${selectedReport.reportId}/action`, {
        action,
        editedTitle: editForm.title,
        editedSummary: editForm.summary,
        editedDescription: editForm.description,
        editedAction: editForm.action,
        clusterId: selectedClusterId ? Number(selectedClusterId) : undefined,
        remarks: remarks || `Executed action ${action}`
      });

      setReviewModal(null);
      setRemarks('');
      setActionSuccess(`Successfully processed action: ${action}`);
      fetchQueue();
    } catch (err) {
      alert('Failed to execute reviewer action');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
              <Sparkles size={16} /> Ethics & AI Verification Desk
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>
              Pending Moderation Queue ({pendingReports.length})
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Verify AI-synthesized representations, adjust sensitive terminology, or cluster duplicate grievances
            </p>
          </div>

          <button onClick={fetchQueue} className="btn btn-secondary btn-sm" disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Queue
          </button>
        </div>

        {actionSuccess && (
          <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#34D399', fontSize: '13px', marginBottom: '20px' }}>
            ✓ {actionSuccess}
          </div>
        )}

        {/* Verification Queue Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Category</th>
                  <th>Severity</th>
                  <th>Priority</th>
                  <th>AI Synthesized Subject</th>
                  <th>Filed Date</th>
                  <th>Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingReports.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No reports currently awaiting review.
                    </td>
                  </tr>
                ) : (
                  pendingReports.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleInspect(r)}
                          style={{ background: 'none', border: 'none', padding: 0, color: '#60A5FA', textDecoration: 'none', fontWeight: '700', fontFamily: 'monospace', cursor: 'pointer', textAlign: 'left' }}
                        >
                          {r.reportId}
                        </button>
                      </td>
                      <td>{r.category}</td>
                      <td>
                        <span className={`badge badge-${r.severity ? r.severity.toLowerCase() : 'medium'}`}>
                          {r.severity}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${r.priority ? r.priority.toLowerCase() : 'p3'}`}>
                          {r.priority}
                        </span>
                      </td>
                      <td style={{ maxWidth: '300px', color: '#CBD5E1', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.professionalTitle || r.previewDescription}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() => handleInspect(r)}
                          >
                            <Eye size={12} /> Inspect
                          </button>
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() => { setSelectedReport(r); setReviewModal('approve'); }}
                          >
                            <CheckCircle size={12} /> Approve
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() => { 
                              setSelectedReport(r); 
                              setEditForm({ title: r.professionalTitle, summary: '', description: r.previewDescription, action: '' });
                              setReviewModal('edit'); 
                            }}
                          >
                            <Edit3 size={12} /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() => { setSelectedReport(r); setReviewModal('duplicate'); }}
                          >
                            <Layers size={12} /> Cluster
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* MODERATION ACTION MODALS */}
      {reviewModal && selectedReport && (
        <div className="modal-overlay" onClick={() => setReviewModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
              Moderation Action: {reviewModal.toUpperCase()} ({selectedReport.reportId})
            </h3>

            {reviewModal === 'approve' && (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Verify that the AI-generated professional version accurately reflects the student's factual concerns without alterations. Upon approval, it advances to departmental investigation.
                </p>
                <div className="form-group">
                  <label className="form-label">Reviewer Endorsement Remarks (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Tone verified and facts consistent with campus guidelines"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setReviewModal(null)}>Cancel</button>
                  <button type="button" className="btn btn-success" onClick={() => handleExecuteAction('APPROVE')}>
                    Confirm & Approve Dossier
                  </button>
                </div>
              </div>
            )}

            {reviewModal === 'edit' && (
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  Refine the professional subject or requested action before official routing.
                </p>
                <div className="form-group">
                  <label className="form-label">Professional Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Requested Remedial Action</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Corrective actions requested..."
                    value={editForm.action || ''}
                    onChange={(e) => setEditForm({ ...editForm, action: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setReviewModal(null)}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={() => handleExecuteAction('EDIT')}>
                    Save Edits & Advance
                  </button>
                </div>
              </div>
            )}

            {reviewModal === 'duplicate' && (
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  Link this grievance to an existing recurrent issue cluster.
                </p>
                <div className="form-group">
                  <label className="form-label">Select Issue Cluster</label>
                  <select
                    className="form-select"
                    value={selectedClusterId}
                    onChange={(e) => setSelectedClusterId(e.target.value)}
                  >
                    <option value="">Choose cluster...</option>
                    {clusters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.clusterCode} - {c.title} ({c.reportCount} reports)
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setReviewModal(null)}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={() => handleExecuteAction('MARK_DUPLICATE')}>
                    Link to Cluster
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* DETAILED INSPECTION MODAL */}
      {inspectDetail && (
        <div className="modal-overlay" onClick={() => setInspectDetail(null)}>
          <div className="modal-content" style={{ maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <span className="badge badge-primary" style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                  {inspectDetail.reportId}
                </span>
                <span style={{ marginLeft: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Category: <strong style={{ color: '#fff' }}>{inspectDetail.category}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className={`badge badge-${inspectDetail.severity ? inspectDetail.severity.toLowerCase() : 'medium'}`}>
                  {inspectDetail.severity}
                </span>
                <span className={`badge badge-${inspectDetail.priority ? inspectDetail.priority.toLowerCase() : 'p3'}`}>
                  {inspectDetail.priority}
                </span>
              </div>
            </div>

            {/* AI GHOSTWRITTEN FORMAL VERSION */}
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Sparkles size={16} color="var(--primary-color)" />
                <h4 style={{ margin: 0, fontSize: '14px', color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  AI GhostWritten Formal Representation
                </h4>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                {inspectDetail.professionalTitle || inspectDetail.previewDescription || 'Untitled Grievance'}
              </h3>
              {inspectDetail.executiveSummary && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Executive Summary:</span>
                  <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.5', marginTop: '4px' }}>
                    {inspectDetail.executiveSummary}
                  </p>
                </div>
              )}
              {inspectDetail.detailedDescription && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Formal Description:</span>
                  <p style={{ fontSize: '13px', color: '#E2E8F0', lineHeight: '1.6', marginTop: '4px', whiteSpace: 'pre-wrap' }}>
                    {inspectDetail.detailedDescription}
                  </p>
                </div>
              )}
              {inspectDetail.impact && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Institutional Impact:</span>
                  <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.5', marginTop: '4px' }}>
                    {inspectDetail.impact}
                  </p>
                </div>
              )}
              {inspectDetail.requestedAction && (
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #3B82F6' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#93C5FD', fontWeight: '700' }}>Requested Remedial Action:</span>
                  <p style={{ fontSize: '13px', color: '#F1F5F9', marginTop: '4px', margin: 0 }}>
                    {inspectDetail.requestedAction}
                  </p>
                </div>
              )}
            </div>

            {/* RAW ANONYMOUS INPUT */}
            {inspectDetail.rawDescription && (
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Raw Anonymous Submission (Student Input):</span>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {inspectDetail.rawDescription}
                </p>
              </div>
            )}

            {/* AI METRICS & FLAGS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sentiment Tone</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: '600', color: '#CBD5E1' }}>
                  {inspectDetail.emotionTone || 'Objective / Urgent'}
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Department</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: '600', color: '#CBD5E1' }}>
                  {inspectDetail.department || inspectDetail.suggestedDepartment || 'General Administration'}
                </p>
              </div>
              {inspectDetail.riskFlags && inspectDetail.riskFlags.length > 0 && (
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <span style={{ fontSize: '10px', color: '#FCA5A5', textTransform: 'uppercase' }}>Risk Flags</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {inspectDetail.riskFlags.map((flag, idx) => (
                      <span key={idx} className="badge badge-high" style={{ fontSize: '10px', padding: '2px 6px' }}>{flag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setInspectDetail(null)}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedReport(inspectDetail);
                  setEditForm({
                    title: inspectDetail.professionalTitle,
                    summary: inspectDetail.executiveSummary,
                    description: inspectDetail.detailedDescription,
                    action: inspectDetail.requestedAction
                  });
                  setInspectDetail(null);
                  setReviewModal('edit');
                }}
              >
                <Edit3 size={13} /> Edit & Refine
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  setSelectedReport(inspectDetail);
                  setInspectDetail(null);
                  setReviewModal('approve');
                }}
              >
                <CheckCircle size={13} /> Approve Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
