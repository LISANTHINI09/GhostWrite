import React, { useState, useEffect, useRef } from 'react';
import { Send, Shield, MessageSquare, Lock } from 'lucide-react';
import api from '../api';

export default function ChatBox({ reportId, trackingToken, isAuthority = false }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reports/${reportId}/messages`);
      if (res.data.success) {
        setMessages(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load conversation messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchMessages();
    }
  }, [reportId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      setError(null);
      const payload = {
        messageText: newMessage.trim(),
        trackingToken: trackingToken || undefined,
      };

      const res = await api.post(`/reports/${reportId}/messages`, payload);
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.data]);
        setNewMessage('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deliver message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-strong)' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: '#0D1322',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare size={18} color="#3B82F6" />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
              Anonymous Two-Way Communication
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Direct encrypted dialogue with zero identity disclosure
            </div>
          </div>
        </div>

        <div style={{
          fontSize: '11px',
          color: '#10B981',
          background: 'rgba(16, 185, 129, 0.1)',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Lock size={11} /> End-to-End Decoupled
        </div>
      </div>

      {/* Messages Feed */}
      <div style={{
        height: '350px',
        overflowY: 'auto',
        padding: '20px',
        background: '#090D16',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            textAlign: 'center',
            fontSize: '13px'
          }}>
            <Shield size={32} style={{ marginBottom: '8px', opacity: 0.4 }} />
            <div>No messages in this inquiry thread yet.</div>
            <div style={{ fontSize: '11px', marginTop: '4px' }}>
              Both sides can request or furnish clarifications anonymously.
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isReporterMsg = m.senderType === 'REPORTER';
            return (
              <div
                key={m.id || Math.random()}
                style={{
                  alignSelf: isReporterMsg ? 'flex-start' : 'flex-end',
                  maxWidth: '80%',
                }}
              >
                <div style={{
                  fontSize: '11px',
                  color: isReporterMsg ? '#94A3B8' : '#93C5FD',
                  marginBottom: '4px',
                  textAlign: isReporterMsg ? 'left' : 'right',
                  fontWeight: '600'
                }}>
                  {m.senderLabel || (isReporterMsg ? 'Anonymous Reporter' : 'Institutional Authority')}
                </div>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  background: isReporterMsg ? '#1E293B' : 'linear-gradient(135deg, #1E40AF, #2563EB)',
                  color: '#FFFFFF',
                  border: isReporterMsg ? '1px solid #334155' : 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {m.messageText}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                  textAlign: isReporterMsg ? 'left' : 'right'
                }}>
                  {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {error && (
        <div style={{ padding: '8px 20px', background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', fontSize: '12px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSendMessage} style={{
        padding: '12px 16px',
        background: '#0D1322',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          className="form-input"
          placeholder={isAuthority ? "Type administrative response / inquiry..." : "Send anonymous follow-up note to authority..."}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
          style={{ height: '42px', padding: '8px 14px', fontSize: '13px' }}
        />
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={sending || !newMessage.trim()}
          style={{ minWidth: '90px', height: '42px' }}
        >
          {sending ? 'Sending...' : <><Send size={15} /> Send</>}
        </button>
      </form>
    </div>
  );
}
