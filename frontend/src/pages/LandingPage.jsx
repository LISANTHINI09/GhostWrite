import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Feather, 
  Lock, 
  Search, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Building, 
  Users, 
  FileCheck, 
  EyeOff, 
  ChevronDown, 
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { title: 'Hostel & Residential', desc: 'Sanitation, drinking water, mess food quality, curfews, warden issues' },
    { title: 'Academic & Faculty', desc: 'Curriculum delivery, unfair grading, attendance discrepancies, make-up classes' },
    { title: 'Examinations', desc: 'Exam scheduling conflicts, hall ticket errors, seating allotments, revaluation' },
    { title: 'Campus Infrastructure', desc: 'Elevator malfunctions, lab equipment breakdowns, AC & electrical hazards' },
    { title: 'Harassment & Equity', desc: 'Statutory ICC triggers, verbal intimidation, discrimination, gender equity' },
    { title: 'Anti-Ragging & Bullying', desc: 'Hostel intimidation, senior coercion, physical threats, mental distress' },
    { title: 'Technology & Wi-Fi', desc: 'Campus network outages, portal crashes, laboratory workstations' },
    { title: 'Transport Logistics', desc: 'Bus route delays, overcrowding, reckless driver behavior, timing lapses' },
  ];

  const faqs = [
    {
      q: 'Will anyone at the college know who submitted the report?',
      a: 'Absolutely not. GhostWrite uses zero-knowledge architecture. Your name, email, register number, and device IP are never recorded with your grievance. Only your randomized Report ID and Tracking Token link to the case.'
    },
    {
      q: 'What is the AI Ghost Writer, and why does it rewrite my complaint?',
      a: 'Many students struggle to express frustration in institutional administrative language, or worry their writing style might reveal their identity. The AI Ghost Writer polishes grammar, removes identifying colloquialisms, and formats the issue into a structured, executive dossier with requested actions—while strictly preserving all your factual details.'
    },
    {
      q: 'Can the AI make up false facts or accusations?',
      a: 'No. GhostWrite AI operates under strict fact-preservation rules. It never hallucinates names, dates, or events. You also review and have the power to edit or reject the AI-generated draft before final submission.'
    },
    {
      q: 'How can I follow up or receive answers if I am anonymous?',
      a: 'When you submit, you receive a secret Tracking Token. Use this token on the Track Report page to read authority responses, view action proofs, and participate in a two-way encrypted chat without ever revealing yourself.'
    },
    {
      q: 'What happens if a department ignores a critical grievance?',
      a: 'GhostWrite features an automated background Escalation Engine. Critical reports not acknowledged within 12 hours and high-priority issues past 24 hours automatically escalate directly to top executive management.'
    }
  ];

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '80px 0 60px',
        background: 'radial-gradient(ellipse at 50% -20%, rgba(59, 130, 246, 0.25), transparent 70%)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#60A5FA',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '28px'
          }}>
            <Sparkles size={15} /> AI-Powered Institutional Redressal Platform
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            letterSpacing: '-1.5px',
            lineHeight: '1.15',
            marginBottom: '24px',
            color: '#FFFFFF'
          }}>
            Report Without Fear.<br />
            <span style={{
              background: 'linear-gradient(135deg, #60A5FA, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Be Heard Without Exposure.
            </span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            marginBottom: '36px',
            maxWidth: '720px',
            margin: '0 auto 36px'
          }}>
            Speak up about academic, hostel, infrastructure, or harassment issues with 100% cryptographic confidentiality. 
            Our intelligent <strong>Ghost Writer</strong> transforms raw concerns into formal, actionable representations that authorities take seriously.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '50px' }}>
            <Link to="/report" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Feather size={20} /> Submit Anonymous Report
            </Link>
            <Link to="/track" className="btn btn-secondary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={20} /> Track Existing Report
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            textAlign: 'left'
          }}>
            {[
              { icon: EyeOff, label: 'Zero Identity Logging', text: 'No login, name, or student ID required' },
              { icon: Sparkles, label: 'AI Ghost Writer', text: 'Formal restructuring with zero fact distortion' },
              { icon: Lock, label: 'Tracking Token Key', text: 'Private key-based progress tracking' },
              { icon: Clock, label: 'Auto Escalation SLA', text: 'Automatic triggers for unaddressed issues' }
            ].map((item, idx) => (
              <div key={idx} className="card" style={{ padding: '16px 20px', background: 'rgba(17, 24, 39, 0.6)' }}>
                <item.icon size={20} color="#3B82F6" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.text}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Side-by-Side Ghost Writer Demo */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
              See The Ghost Writer In Action
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '650px', margin: 'auto' }}>
              Turning fragmented student vents into structured, authoritative institutional documents that command attention.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            maxWidth: '1000px',
            margin: 'auto'
          }}>
            
            {/* Raw Student Input */}
            <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: '#0F1523' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#F87171', textTransform: 'uppercase' }}>
                  Raw Anonymous Complaint
                </span>
                <span className="badge badge-low">Raw Input</span>
              </div>
              <div style={{
                background: '#090D16',
                padding: '20px',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#CBD5E1',
                fontStyle: 'italic',
                lineHeight: '1.6',
                border: '1px solid #1E293B'
              }}>
                "Hostel water in block A 3rd floor is very bad and brownish for 4 days. Students got skin rashes. Caretaker did nothing when we told him twice. Please do something quick."
              </div>
              <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                ⚠️ <em>Emotional phrasing, lacks formal department routing and explicit remedial SLA.</em>
              </div>
            </div>

            {/* AI Transformed Output */}
            <div className="card" style={{ borderColor: 'rgba(59, 130, 246, 0.4)', background: '#0F172A', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#60A5FA', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Sparkles size={14} /> AI Ghost-Written Representation
                </span>
                <span className="badge badge-p2">Priority P2</span>
              </div>
              <div style={{
                background: '#090D16',
                padding: '20px',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#F8FAFC',
                lineHeight: '1.6',
                border: '1px solid #1E293B'
              }}>
                <div style={{ fontWeight: '700', color: '#60A5FA', marginBottom: '6px' }}>
                  Subject: Immediate Intervention Required for Residential Water Quality in Hostel Block A
                </div>
                <div style={{ color: '#94A3B8', marginBottom: '8px' }}>
                  <strong>Summary:</strong> Persistent contamination observed on 3rd floor fixtures posing sanitary risk.
                </div>
                <div style={{ color: '#E2E8F0', fontSize: '12px' }}>
                  <strong>Requested Action:</strong> Immediate dispatch of Estate Maintenance plumbing inspection, water purification audit, and interim potable dispenser provision within 24 hours.
                </div>
              </div>
              <div style={{ marginTop: '16px', fontSize: '12px', color: '#34D399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} /> Facts strictly preserved • Zero hallucinations • Professional tone
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Workflow */}
      <section style={{ padding: '60px 0', background: 'rgba(17, 24, 39, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
              How GhostWrite Operates
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              A secure, accountable lifecycle ensuring no grievance falls through bureaucratic cracks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              {
                step: '01',
                title: 'Submit Anonymously',
                desc: 'Describe your issue in plain language. No names, phone numbers, or identity checks required.'
              },
              {
                step: '02',
                title: 'AI Ghost Writer',
                desc: 'Instant formalization: professional title, impact analysis, suggested department and requested action.'
              },
              {
                step: '03',
                title: 'Reviewer Moderation',
                desc: 'Ethics reviewers verify the AI draft and route it directly to the designated department head.'
              },
              {
                step: '04',
                title: 'Track & Chat in Secret',
                desc: 'Monitor real-time progress, read authority replies, and converse without revealing who you are.'
              }
            ].map((step, idx) => (
              <div key={idx} className="card" style={{ position: 'relative' }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '900',
                  color: 'rgba(59, 130, 246, 0.2)',
                  marginBottom: '12px'
                }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Issue Categories */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
              Covering All Institutional Concerns
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Intelligent categorization automatically routes reports to the appropriate administrative cell.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {categories.map((cat, idx) => (
              <div key={idx} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Building size={16} color="#3B82F6" />
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{cat.title}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {cat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '60px 0', background: 'rgba(17, 24, 39, 0.3)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Clear answers regarding privacy, legal protections, and AI safeguards.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((f, idx) => (
              <div 
                key={idx} 
                className="card" 
                style={{ cursor: 'pointer', padding: '18px 24px' }}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>{f.q}</span>
                  <ChevronDown size={18} color="#94A3B8" style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </div>
                {openFaq === idx && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.6' }}>
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{
            padding: '50px 30px',
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.5), rgba(76, 29, 149, 0.5))',
            borderColor: 'rgba(99, 102, 241, 0.4)'
          }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>
              Ready To Make Your Voice Heard?
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: '15px', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
              It only takes 2 minutes. Protect your peace of mind and help create a better campus environment.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/report" className="btn btn-primary btn-lg">
                <Feather size={18} /> File Confidential Grievance
              </Link>
              <Link to="/track" className="btn btn-secondary btn-lg">
                <Search size={18} /> Enter Tracking Code
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
