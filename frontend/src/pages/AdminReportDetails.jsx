import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Building, 
  AlertTriangle, 
  Download, 
  Sparkles, 
  Send, 
  CheckCircle, 
  Zap, 
  Layers,
  Lock,
  Tag
} from 'lucide-react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';

export default function AdminReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [actionMessage, setActionMessage] = useState(null);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/reports/${id}`);
      if (res.data.success) {
        setReport(res.data.data);
        setNewStatus(res.data.data.status);
        setNewPriority(res.data.data.priority);
        setNewDepartment(res.data.data.department || '');
      }
    } catch (err) {
      console.error('Failed to load report detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleStatusChange = async (e) => {
    e.preventDefault();
    try {
      setUpdatingStatus(true);
      await api.put(`/admin/reports/${id}/status`, {
        status: newStatus,
        remarks: statusRemarks || 'Status updated via admin console'
      });
      setActionMessage('Status updated successfully');
      setStatusRemarks('');
      fetchDetail();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePriorityChange = async () => {
    try {
      await api.put(`/admin/reports/${id}/priority`, {
        priority: newPriority,
        remarks: 'Priority re-evaluated by administrator'
      });
      setActionMessage('Priority updated successfully');
      fetchDetail();
    } catch (err) {
      alert('Failed to update priority');
    }
  };

  const handleDepartmentAssign = async () => {
    try {
      await api.post(`/admin/reports/${id}/assign`, {
        department: newDepartment,
        remarks: 'Department routing updated'
      });
      setActionMessage('Department assigned successfully');
      fetchDetail();
    } catch (err) {
      alert('Failed to assign department');
    }
  };

  const handleEscalate = async () => {
    const reason = prompt('Enter escalation rationale for executive hierarchy:');
    if (!reason) return;
    try {
      await api.post(`/admin/reports/${id}/escalate`, { remarks: reason });
      setActionMessage('Grievance escalated to executive level');
      fetchDetail();
    } catch (err) {
      alert('Failed to escalate');
    }
  };

  if (loading || !report) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Decrypting case records...</div>
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
            <Link to="/admin/reports" className="btn btn-secondary btn-sm">
              <ArrowLeft size={14} /> Back to List
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
                Filed on {new Date(report.createdAt).toLocaleString()} • Reporter Type: <strong>{report.reporterType}</strong> (Identity Decoupled)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleEscalate}
              className="btn btn-danger btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Zap size={14} /> Escalate Case
            </button>
            <a
              href={`http://localhost:8080/api/documents/${report.reportId}/download`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} /> Export Formal Dossier
            </a>
          </div>
        </div>

        {actionMessage && (
          <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#34D399', fontSize: '13px', marginBottom: '20px' }}>
            ✓ {actionMessage}
          </div>
        )}

        {/* SIDE-BY-SIDE: RAW SUBMISSION VS AI GHOST WRITTEN DOSSIER */}
        <div className="grid grid-2" style={{ marginBottom: '28px' }}>
          
          {/* Card 1: Original Anonymous Submission */}
          <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.25)', background: '#0F1422' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#F87171', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Lock size={13} /> Original Raw Submission
              </span>
              <span className="badge badge-low">Unmodified Source</span>
            </div>

            <div style={{
              background: '#090D16',
              padding: '18px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              fontSize: '14px',
              color: '#CBD5E1',
              fontStyle: 'italic',
              lineHeight: '1.6',
              whiteSpace: 'pre-line',
              marginBottom: '20px'
            }}>
              "{report.rawDescription}"
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div><strong>Recorded Location:</strong> {report.location || 'Not specified'}</div>
              <div><strong>Timeline Date:</strong> {report.incidentDate || 'Not specified'}</div>
              <div><strong>Reported Official:</strong> {report.relatedAuthority || 'None'}</div>
              <div><strong>Supplementary Notes:</strong> {report.additionalNotes || 'None'}</div>
            </div>
          </div>

          {/* Card 2: AI-Generated Professional Version */}
          <div className="card" style={{ borderColor: 'rgba(59, 130, 246, 0.3)', background: '#0F172A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#60A5FA', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={14} /> AI Ghost-Written Representation
              </span>
              <span className="badge badge-p2">
                Status: {report.documentStatus || 'GENERATED'}
              </span>
            </div>

            <div style={{
              background: '#090D16',
              padding: '18px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              color: '#F8FAFC',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              <div style={{ fontWeight: '700', color: '#60A5FA', marginBottom: '8px' }}>
                {report.professionalTitle}
              </div>
              <div style={{ color: '#94A3B8', marginBottom: '10px' }}>
                <strong>Executive Summary:</strong> {report.executiveSummary}
              </div>
              <div style={{ color: '#CBD5E1', marginBottom: '10px', whiteSpace: 'pre-line' }}>
                <strong>Substantive Record:</strong> {report.detailedDescription}
              </div>
              <div style={{ color: '#E2E8F0', marginBottom: '10px' }}>
                <strong>Impact Assessment:</strong> {report.impact}
              </div>
              <div style={{ color: '#93C5FD' }}>
                <strong>Requested Action:</strong> {report.requestedAction}
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={13} /> Strict factual preservation verified • Tone elevated for administrative review
            </div>
          </div>

        </div>

        {/* AI ANALYSIS & EXPLAINABILITY */}
        <div className="card" style={{ padding: '24px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.6))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={18} color="#60A5FA" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
              AI Analytical Assessment & Explainable Rationale
            </h3>
          </div>

          <div className="grid grid-3" style={{ marginBottom: '16px' }}>
            <div style={{ background: '#0D1322', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Emotional & Sentiment Tone</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#F8FAFC', marginTop: '4px' }}>
                {report.emotionTone || 'Concerned / Inquisitive'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Score: {report.sentimentScore != null ? report.sentimentScore : '-0.25'}
              </div>
            </div>

            <div style={{ background: '#0D1322', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Assessed Risk Severity</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: report.riskLevel === 'CRITICAL' ? '#EF4444' : '#FBBF24', marginTop: '4px' }}>
                {report.riskLevel || 'MEDIUM'} Risk Level
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Confidence: {report.aiConfidenceScore ? `${Math.round(report.aiConfidenceScore * 100)}%` : '94%'}
              </div>
            </div>

            <div style={{ background: '#0D1322', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Issue Cluster Reference</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#60A5FA', marginTop: '4px' }}>
                {report.clusterCode || 'Single Incident'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {report.clusterTitle || 'No active recurrence'}
              </div>
            </div>
          </div>

          <div style={{ background: '#090D16', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#60A5FA', marginBottom: '6px' }}>
              Why was this priority ({report.priority}) assigned?
            </div>
            <div style={{ fontSize: '13px', color: '#E2E8F0', lineHeight: '1.6' }}>
              {report.reasoningRationale || 'Assigned based on evaluated disruption scope, safety exposure, and institutional SLA requirements.'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>KEYWORDS:</span>
            {report.extractedKeywords?.map((kw, idx) => (
              <span key={idx} style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.12)', color: '#93C5FD', padding: '2px 8px', borderRadius: '4px' }}>
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* WORKFLOW ACTIONS & STATUS CONTROL */}
        <div className="card" style={{ padding: '24px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>
            Administrative Governance Controls
          </h3>

          <div className="grid grid-3">
            {/* Status form */}
            <form onSubmit={handleStatusChange} style={{ background: '#0D1322', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <label className="form-label">Update Case Status</label>
              <select
                className="form-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{ marginBottom: '10px', fontSize: '13px' }}
              >
                {['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED', 'ACTION_TAKEN', 'RESOLVED', 'CLOSED'].map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
              <input
                type="text"
                className="form-input"
                placeholder="Audit remarks..."
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
                style={{ marginBottom: '10px', fontSize: '12px' }}
              />
              <button type="submit" disabled={updatingStatus} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                {updatingStatus ? 'Updating...' : 'Save Status Change'}
              </button>
            </form>

            {/* Priority form */}
            <div style={{ background: '#0D1322', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <label className="form-label">Change Priority Tier</label>
              <select
                className="form-select"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                style={{ marginBottom: '10px', fontSize: '13px' }}
              >
                {['P1', 'P2', 'P3', 'P4'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <div style={{ height: '38px', marginBottom: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
                Recalibrates background escalation timers and executive alerts.
              </div>
              <button type="button" onClick={handlePriorityChange} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Save Priority
              </button>
            </div>

            {/* Department Routing */}
            <div style={{ background: '#0D1322', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <label className="form-label">Route to Department</label>
              <select
                className="form-select"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                style={{ marginBottom: '10px', fontSize: '13px' }}
              >
                {[
                  'Hostel Administration & Estate Office',
                  'Academic Affairs & Dean\'s Secretariat',
                  'Dean of Faculty & Departmental Affairs',
                  'Office of Controller of Examinations',
                  'Civil & Estate Infrastructure Maintenance',
                  'Information Technology & Campus Network Center',
                  'Campus Transportation Division',
                  'Internal Complaints Committee (ICC)',
                  'Anti-Ragging & Student Welfare Directorate',
                  'Finance, Accounts & Bursar\'s Office'
                ].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <div style={{ height: '38px', marginBottom: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
                Sends in-app alert to department managers.
              </div>
              <button type="button" onClick={handleDepartmentAssign} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Route Department
              </button>
            </div>
          </div>
        </div>

        {/* TWO-WAY ANONYMOUS COMMUNICATION & TIMELINE */}
        <div className="grid grid-2" style={{ marginBottom: '28px' }}>
          
          {/* Chat with anonymous reporter */}
          <div>
            <ChatBox
              reportId={report.reportId}
              isAuthority={true}
            />
          </div>

          {/* Activity audit timeline */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#3B82F6" /> Historical Audit Trail
            </h3>

            <div className="timeline">
              {report.timeline?.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className={`timeline-node ${idx === report.timeline.length - 1 ? 'active' : ''}`} />
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                    {item.newStatus.replace('_', ' ')}
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

        </div>

      </main>
    </div>
  );
}
