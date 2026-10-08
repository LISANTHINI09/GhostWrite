import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, AlertTriangle, CheckCircle, TrendingUp, RefreshCw, ArrowRight } from 'lucide-react';
import api from '../api';
import Sidebar from '../components/Sidebar';

export default function AIInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/insights');
      if (res.data.success) {
        setInsights(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        
        {/* Banner */}
        <div style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.25), rgba(15, 23, 42, 0.8))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A78BFA', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
              <Brain size={18} /> Explainable Cognitive Engine
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>
              AI Institutional Insights & Trend Forecasting
            </h1>
            <p style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '4px', maxWidth: '700px' }}>
              Automated anomaly detection, sentiment shifts, and actionable governance policy recommendations synthesized from cross-department grievance trends.
            </p>
          </div>

          <button onClick={fetchInsights} className="btn btn-secondary btn-sm" disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Re-evaluate Insights
          </button>
        </div>

        {/* Insight Cards Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {insights.map((item) => (
            <div key={item.id} className="card" style={{ padding: '28px', borderLeft: '4px solid #3B82F6' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-submitted">{item.category}</span>
                  <span className={`badge badge-${item.impactLevel.toLowerCase()}`}>
                    {item.impactLevel} IMPACT
                  </span>
                  <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>
                    {item.confidenceScore}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#60A5FA', fontWeight: '700', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                  {item.metricStat}
                </div>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>
                {item.title}
              </h3>

              <p style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '18px' }}>
                {item.description}
              </p>

              {/* Actionable recommendation box */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <CheckCircle size={20} color="#10B981" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#34D399', textTransform: 'uppercase' }}>
                    Recommended Administrative Intervention
                  </div>
                  <div style={{ fontSize: '13px', color: '#F8FAFC', marginTop: '2px', lineHeight: '1.5' }}>
                    {item.recommendation}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
