import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Download, Eye, AlertTriangle } from 'lucide-react';
import api from '../api';
import Sidebar from '../components/Sidebar';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');

  const fetchReports = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pageNumber);
      params.append('size', '15');
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);
      if (department) params.append('department', department);

      const res = await api.get(`/admin/reports?${params.toString()}`);
      if (res.data.success) {
        setReports(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 1);
        setTotalElements(res.data.data.totalElements || 0);
        setPage(pageNumber);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(0);
  }, [category, status, priority, department]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(0);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setStatus('');
    setPriority('');
    setDepartment('');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        
        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>
              All Institutional Grievances
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Showing {reports.length} of {totalElements} registered reports
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => fetchReports(page)}
              className="btn btn-secondary btn-sm"
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Filter Controls Card */}
        <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Search Input Bar */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by Report ID (e.g. GW-2026-X) or grievance keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ height: '42px', paddingLeft: '38px' }}
                />
                <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: '42px', padding: '0 20px' }}>
                Search
              </button>
            </div>

            {/* Filter Dropdowns Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px 12px', fontSize: '12px' }}>
                <option value="">All Categories</option>
                {['Hostel', 'Academic', 'Faculty', 'Examination', 'Administration', 'Transport', 'Infrastructure', 'Harassment', 'Technology / IT', 'Fees'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '8px 12px', fontSize: '12px' }}>
                <option value="">All Statuses</option>
                {['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED', 'ACTION_TAKEN', 'RESOLVED', 'CLOSED'].map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>

              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: '8px 12px', fontSize: '12px' }}>
                <option value="">All Priorities</option>
                {['P1', 'P2', 'P3', 'P4'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)} style={{ padding: '8px 12px', fontSize: '12px' }}>
                <option value="">All Departments</option>
                {[
                  'Hostel Administration & Estate Office',
                  'Academic Affairs & Dean\'s Secretariat',
                  'Civil & Estate Infrastructure Maintenance',
                  'Information Technology & Campus Network Center',
                  'Campus Transportation Division'
                ].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <button type="button" onClick={handleResetFilters} className="btn btn-outline btn-sm" style={{ height: '36px' }}>
                Reset Filters
              </button>
            </div>

          </form>
        </div>

        {/* Data Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Department</th>
                  <th>Grievance Summary</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No reports match the selected filters.
                    </td>
                  </tr>
                ) : (
                  reports.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <Link to={`/admin/reports/${r.reportId}`} style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: '800', fontFamily: 'monospace' }}>
                          {r.reportId}
                        </Link>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: '#fff' }}>{r.category}</div>
                        {r.subcategory && <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{r.subcategory}</div>}
                      </td>
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
                      <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                        {r.department || 'General Administration'}
                      </td>
                      <td style={{ maxWidth: '280px', color: '#CBD5E1', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.professionalTitle || r.previewDescription}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Link to={`/admin/reports/${r.reportId}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={12} /> Inspect
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div style={{
            padding: '16px 20px',
            background: '#0D1322',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>
            <div>Page {page + 1} of {Math.max(totalPages, 1)} ({totalElements} total entries)</div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fetchReports(page - 1)}
                disabled={page <= 0 || loading}
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fetchReports(page + 1)}
                disabled={page >= totalPages - 1 || loading}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
