import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Feather, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Edit3, 
  Upload, 
  Lock, 
  HelpCircle,
  Clock,
  MapPin,
  Calendar,
  Building
} from 'lucide-react';
import api from '../api';

export default function AnonymousReportPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    reporterType: 'STUDENT',
    category: 'Hostel',
    subcategory: '',
    severity: 'MEDIUM',
    rawDescription: '',
    incidentDate: '',
    location: '',
    relatedAuthority: '',
    additionalNotes: '',
    voluntaryContactEmail: '',
    voluntaryContactPhone: '',
    // AI generated & accepted fields
    acceptedProfessionalTitle: '',
    acceptedExecutiveSummary: '',
    acceptedDetailedDescription: '',
    acceptedRelevantContext: '',
    acceptedImpact: '',
    acceptedRequestedAction: '',
    acceptedSuggestedPriority: '',
    acceptedSuggestedDepartment: '',
    acceptedProfessionalClosing: '',
  });

  const [aiGenerated, setAiGenerated] = useState(null);
  const [isEditingAi, setIsEditingAi] = useState(false);

  const categories = [
    'Hostel', 'Academic', 'Faculty', 'Examination', 'Administration',
    'Transport', 'Infrastructure', 'Library', 'Laboratory', 'Fees',
    'Harassment', 'Bullying', 'Safety', 'Technology / IT', 'Other'
  ];

  const severities = [
    { value: 'LOW', label: 'Low', desc: 'Minor inconvenience or routine enhancement' },
    { value: 'MEDIUM', label: 'Medium', desc: 'Operational hurdle disrupting daily routine' },
    { value: 'HIGH', label: 'High', desc: 'Repeated breakdown, academic impact or health vulnerability' },
    { value: 'CRITICAL', label: 'Critical', desc: 'Immediate physical danger, harassment, or acute emergency' },
  ];

  const handleNext = () => {
    setError(null);
    if (step === 4 && (!formData.rawDescription || formData.rawDescription.trim().length < 10)) {
      setError('Please provide at least 10 characters describing the grievance.');
      return;
    }
    if (step === 6) {
      // Trigger AI generation if not already done
      if (!aiGenerated) {
        triggerAiGeneration();
      }
    }
    setStep((prev) => Math.min(prev + 1, 7));
  };

  const handlePrev = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const triggerAiGeneration = async () => {
    setGeneratingAi(true);
    setError(null);
    try {
      const res = await api.post('/ghostwriter/generate', {
        rawDescription: formData.rawDescription,
        category: formData.category,
        reporterType: formData.reporterType,
        location: formData.location,
        incidentDate: formData.incidentDate,
        additionalNotes: formData.additionalNotes,
      });

      if (res.data.success && res.data.data) {
        const d = res.data.data;
        setAiGenerated(d);
        setFormData((prev) => ({
          ...prev,
          acceptedProfessionalTitle: d.professionalTitle,
          acceptedExecutiveSummary: d.executiveSummary,
          acceptedDetailedDescription: d.detailedDescription,
          acceptedRelevantContext: d.relevantContext,
          acceptedImpact: d.impact,
          acceptedRequestedAction: d.requestedAction,
          acceptedSuggestedPriority: d.suggestedPriority,
          acceptedSuggestedDepartment: d.suggestedDepartment,
          acceptedProfessionalClosing: d.professionalClosing,
        }));
      }
    } catch (err) {
      setError('AI generation encountered an issue. You can continue with your raw complaint.');
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSubmitFinal = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/reports/anonymous', formData);
      if (res.data.success && res.data.data) {
        // Navigate to success receipt page
        navigate('/report/success', { state: { result: res.data.data } });
      } else {
        setError(res.data.message || 'Submission failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '860px', padding: '40px 20px' }}>
      
      {/* Safe Privacy Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.08))',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '16px',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={24} color="#10B981" />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#FFFFFF' }}>
              Your Identity is 100% Protected
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              We do NOT collect your name, email, register number, or IP address.
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '11px',
          color: '#10B981',
          fontWeight: '700',
          background: 'rgba(16, 185, 129, 0.15)',
          padding: '4px 10px',
          borderRadius: '999px'
        }}>
          ZERO LOGGING
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {['Reporter', 'Category', 'Severity', 'Description', 'Context', 'Upload', 'AI Writer'].map((title, idx) => (
            <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: step > idx + 1 ? '#10B981' : step === idx + 1 ? '#3B82F6' : '#1E293B',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 6px',
                border: step === idx + 1 ? '2px solid #60A5FA' : 'none',
                boxShadow: step === idx + 1 ? '0 0 12px rgba(59, 130, 246, 0.5)' : 'none'
              }}>
                {step > idx + 1 ? '✓' : idx + 1}
              </div>
              <div style={{
                fontSize: '10px',
                color: step === idx + 1 ? '#60A5FA' : 'var(--text-muted)',
                fontWeight: step === idx + 1 ? '700' : '500',
                textTransform: 'uppercase'
              }}>
                {title}
              </div>
            </div>
          ))}
        </div>
        <div style={{ width: '100%', height: '4px', background: '#1E293B', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            width: `${((step - 1) / 6) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #10B981, #3B82F6)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Main Step Card */}
      <div className="card" style={{ padding: '36px', position: 'relative' }}>
        
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
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {/* STEP 1: Reporter Type */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
              Step 1: Select Your Reporter Role
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Helps authorities contextualize administrative jurisdiction. We never ask for personal identifiers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { type: 'STUDENT', label: 'Student', desc: 'Enrolled undergraduate, postgraduate, or research scholar' },
                { type: 'STAFF', label: 'Faculty / Staff', desc: 'Teaching faculty, administrative, or departmental staff' },
                { type: 'OTHER', label: 'Other Stakeholder', desc: 'Campus resident, parent, visitor, or alumni' },
              ].map((opt) => (
                <div
                  key={opt.type}
                  onClick={() => setFormData({ ...formData, reporterType: opt.type })}
                  style={{
                    padding: '24px 20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: formData.reporterType === opt.type ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-input)',
                    border: formData.reporterType === opt.type ? '2px solid #3B82F6' : '1px solid var(--border-strong)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {opt.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Issue Category */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
              Step 2: Choose Issue Category
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Determines automated departmental dispatch and compliance escalation rules.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
              {categories.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setFormData({ ...formData, category: c })}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '10px',
                    background: formData.category === c ? 'rgba(59, 130, 246, 0.18)' : 'var(--bg-input)',
                    border: formData.category === c ? '2px solid #3B82F6' : '1px solid var(--border-strong)',
                    color: formData.category === c ? '#60A5FA' : 'var(--text-primary)',
                    fontWeight: formData.category === c ? '700' : '500',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Issue Severity */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
              Step 3: Select Severity Level
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Dictates administrative response deadlines and automated escalation clocks.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {severities.map((s) => (
                <div
                  key={s.value}
                  onClick={() => setFormData({ ...formData, severity: s.value })}
                  style={{
                    padding: '18px 20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: formData.severity === s.value ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-input)',
                    border: formData.severity === s.value ? '2px solid #3B82F6' : '1px solid var(--border-strong)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span className={`badge badge-${s.value.toLowerCase()}`}>{s.label}</span>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{s.label} Severity</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.desc}</div>
                  </div>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: formData.severity === s.value ? '#3B82F6' : '#64748B',
                    background: formData.severity === s.value ? '#3B82F6' : 'transparent',
                  }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Describe the Issue */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
              Step 4: Describe The Grievance In Your Own Words
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Write freely. Don't worry about sounding formal or making grammar mistakes—our AI Ghost Writer will restructure it in Step 7.
            </p>

            <div className="form-group">
              <textarea
                className="form-textarea"
                rows={8}
                placeholder="E.g., Hostel Block A 3rd floor water has been yellowish and muddy since Tuesday. Multiple students experienced rash. We told the caretaker twice but nothing happened..."
                value={formData.rawDescription}
                onChange={(e) => setFormData({ ...formData, rawDescription: e.target.value })}
                style={{ fontSize: '14px', lineHeight: '1.6' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>Minimum 10 characters required</span>
                <span>{formData.rawDescription.length} characters</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Supporting Context */}
        {step === 5 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
              Step 5: Optional Contextual Particulars
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              All fields are optional. Providing exact location and approximate dates expedites administrative remediation.
            </p>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} /> Specific Location / Facility
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Hostel Block B Room 304, Old Library 2nd Floor"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> Date / Approximate Timeline
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 2026-10-06 or 'Last Wednesday evening'"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Prior Reported Authority / Caretaker Contacted (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Hostel Floor Warden, Lab Assistant, Transport In-Charge"
                value={formData.relatedAuthority}
                onChange={(e) => setFormData({ ...formData, relatedAuthority: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Additional Observations or Notes (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Any additional background, urgency reason, or witnesses"
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              />
            </div>

            {/* Privacy-isolated optional contact */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid var(--border-strong)',
              borderRadius: '10px',
              padding: '16px',
              marginTop: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                <Lock size={13} color="#10B981" /> Confidential Follow-up Outreach (Strictly Optional)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                If you voluntarily want authorities to contact you directly for emergency clarification, enter an email or phone number. This is stored in an isolated encrypted vault and will <strong>never</strong> appear on public complaint records.
              </div>
              <div className="grid grid-2">
                <input
                  type="email"
                  className="form-input"
                  placeholder="Optional confidential email"
                  value={formData.voluntaryContactEmail}
                  onChange={(e) => setFormData({ ...formData, voluntaryContactEmail: e.target.value })}
                  style={{ fontSize: '12px' }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Optional confidential phone"
                  value={formData.voluntaryContactPhone}
                  onChange={(e) => setFormData({ ...formData, voluntaryContactPhone: e.target.value })}
                  style={{ fontSize: '12px' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Optional File Upload */}
        {step === 6 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
              Step 6: Optional Supporting Media
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Photographs, inspection memos, or screenshots of error dialogues corroborate reports.
            </p>

            <div style={{
              border: '2px dashed var(--border-strong)',
              borderRadius: '16px',
              padding: '40px 20px',
              textAlign: 'center',
              background: 'var(--bg-input)',
              cursor: 'pointer'
            }}>
              <Upload size={36} color="#3B82F6" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                Click or Drag Files To Upload
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Supports JPG, PNG, PDF, DOCX (Max 15MB). Metadata scrubbed for anonymity.
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: AI Ghost Writer */}
        {step === 7 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="#60A5FA" /> Step 7: AI Ghost Writer Review
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Our AI restructured your grievance into an authoritative, institutional dossier. You can edit any part before finalizing.
                </p>
              </div>

              <button
                type="button"
                onClick={triggerAiGeneration}
                disabled={generatingAi}
                className="btn btn-secondary btn-sm"
              >
                <RefreshCw size={13} className={generatingAi ? 'animate-spin' : ''} /> {generatingAi ? 'Generating...' : 'Regenerate'}
              </button>
            </div>

            {generatingAi ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <Sparkles size={36} color="#60A5FA" style={{ margin: '0 auto 12px', animation: 'spin 2s linear infinite' }} />
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>Synthesizing Formal Representation...</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Preserving your facts • Formulating administrative remedies • Routing priority
                </div>
              </div>
            ) : (
              <div>
                {/* Side-by-side or comparison card */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingAi(false)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      background: !isEditingAi ? 'var(--primary)' : 'transparent',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    AI Formatted Dossier
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingAi(true)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      background: isEditingAi ? 'var(--primary)' : 'transparent',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Edit3 size={13} /> Edit Generated Fields
                  </button>
                </div>

                {!isEditingAi ? (
                  <div style={{
                    background: '#090D16',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '12px',
                    padding: '24px',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span className="badge badge-p2">
                        Suggested Priority: {formData.acceptedSuggestedPriority || 'P2'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#60A5FA', fontWeight: '600' }}>
                        {formData.acceptedSuggestedDepartment || 'General Administration'}
                      </span>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Formal Subject</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginTop: '2px' }}>
                        {formData.acceptedProfessionalTitle}
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Executive Summary</div>
                      <div style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '2px', lineHeight: '1.5' }}>
                        {formData.acceptedExecutiveSummary}
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Factual Background</div>
                      <div style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '2px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                        {formData.acceptedDetailedDescription}
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Impact Analysis</div>
                      <div style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '2px', lineHeight: '1.5' }}>
                        {formData.acceptedImpact}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Requested Administrative Action</div>
                      <div style={{ fontSize: '13px', color: '#60A5FA', marginTop: '2px', lineHeight: '1.5', fontWeight: '600' }}>
                        {formData.acceptedRequestedAction}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Professional Subject Line</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.acceptedProfessionalTitle}
                        onChange={(e) => setFormData({ ...formData, acceptedProfessionalTitle: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Executive Summary</label>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        value={formData.acceptedExecutiveSummary}
                        onChange={(e) => setFormData({ ...formData, acceptedExecutiveSummary: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Detailed Factual Description</label>
                      <textarea
                        className="form-textarea"
                        rows={5}
                        value={formData.acceptedDetailedDescription}
                        onChange={(e) => setFormData({ ...formData, acceptedDetailedDescription: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Requested Remedial Action</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.acceptedRequestedAction}
                        onChange={(e) => setFormData({ ...formData, acceptedRequestedAction: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '32px',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '20px'
        }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="btn btn-secondary"
              disabled={loading || generatingAi}
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}

          {step < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitFinal}
              disabled={loading || generatingAi}
              className="btn btn-success btn-lg"
              style={{ minWidth: '220px' }}
            >
              {loading ? 'Transmitting Securely...' : <><ShieldCheck size={18} /> Accept & Submit Anonymously</>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
