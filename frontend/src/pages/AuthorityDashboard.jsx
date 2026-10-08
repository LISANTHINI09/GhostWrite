import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Clock, CheckCircle, AlertTriangle, Eye, Send, Search } from 'lucide-react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function AuthorityDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [responseModal, setResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [resolutionProof, setResolutionProof] = useState('');
  const [newStatus, setNewStatus] = useState('ACTION_TAKEN');
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchDepartmentReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/authority/reports');
      if (res.data.success) {
        setReports(res.data.data.content || []);
      }
    } catch (err) {
      console.error('Failed to load authority queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentReports();
  }, []);

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    try {
      await api.post(`/authority/reports/${selectedReport.reportId}/response`, {
        responseText: responseText.trim(),
        resolutionNotes: resolutionProof.trim() || undefined,
        statusUpdate: newStatus,
        remarks: 'Departmental official response submitted'
      });
      setResponseModal(false);
      setResponseText('');
      setResolutionProof('');
      setActionSuccess('Official response published to tracking register');
      fetchDepartmentReports();
    } catch (err) {
      alert('Failed to submit authority response');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        
        {/* Department Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.3), rgba(15, 23, 42, 0.7))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60A5FA', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
              <Building size={16} /> Departmental Resolution Center
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>
              {user?.department || 'Department Administration Desk'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Official investigator: <strong>{user?.fullName}</strong>. Reporter identities remain strictly decoupled.
            </p>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34D399',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            ✓ Anonymity Protocol Active
          </div>
        </div>

        {actionSuccess && (
          <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#34D399', fontSize: '13px', marginBottom: '20px' }}>
            ✓ {actionSuccess}
          </div>
        )}

        {/* Assigned Reports Table */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff' }}>
                Departmental Grievance Docket ({reports.length})
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Complaints assigned to your division for inspection and remediation
              </div>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Grievance Summary</th>
                  <th>Filed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No active grievances assigned to your department.
                    </td>
                  </tr>
                ) : (
                  reports.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <Link to={`/authority/reports/${r.reportId}`} style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: '700', fontFamily: 'monospace' }}>
                          {r.reportId}
                        </Link>
                      </td>
                      <td>{r.category}</td>
                      <td>
                        <span className={`badge badge-${r.priority ? r.priority.toLowerCase() : 'p3'}`}>
                          {r.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${r.status ? r.status.toLowerCase() : 'submitted'}`}>
                          {r.status ? r.status.replace('_', ' ') : 'SUBMITTED'}
                        </span>
                      </td>
                      <td style={{ maxWidth: '280px', color: '#CBD5E1', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.professionalTitle || r.previewDescription}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <Link to={`/authority/reports/${r.reportId}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }}>
                            <Eye size={12} /> Inspect
                          </Link>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() => { setSelectedReport(r); setResponseModal(true); }}
                          >
                            <Send size={12} /> Respond
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

      {/* DEPARTMENT OFFICIAL RESPONSE MODAL */}
      {responseModal && selectedReport && (
        <div className="modal-overlay" onClick={() => setResponseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
              Issue Official Departmental Response: {selectedReport.reportId}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              This response will appear directly on the student's anonymous tracking page.
            </p>

            <form onSubmit={handleSubmitResponse}>
              <div className="form-group">
                <label className="form-label">Official Departmental Statement</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Detail the investigation findings and actions taken by your department..."
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
                  placeholder="e.g. Maintenance Work Order #MW-842 completed on 08-Oct"
                  value={resolutionProof}
                  onChange={(e) => setResolutionProof(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Transition Status To</label>
                <select
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="IN_PROGRESS">IN PROGRESS (Under Active Investigation)</option>
                  <option value="ACTION_TAKEN">ACTION TAKEN (Remedial Measures Enacted)</option>
                  <option value="RESOLVED">RESOLVED (Grievance Fully Redressed)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setResponseModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Response</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
