import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Home, 
  Store, 
  Laptop, 
  Activity, 
  GraduationCap, 
  Zap, 
  Droplet, 
  CheckCircle2, 
  Info, 
  ShieldAlert,
  Clock,
  Users
} from 'lucide-react';

/**
 * Problem Explanation Component
 * Ownership: Member 1 (Problem & Solution Design + Backend Data Layer)
 * 
 * Directly addresses Hackathon Marking Criteria:
 * - Relevance of the Sri Lankan problem (10 Marks): Real, current local problem with affected users named.
 * - Requirement #2: In-app explanation of the selected Sri Lankan problem.
 * - Requirement #10: Clear demonstration of value to Sri Lankan citizens.
 */
export default function ProblemExplanation() {
  const [activeTab, setActiveTab] = useState('impact');

  const affectedGroups = [
    {
      icon: <Home size={22} color="var(--power-amber)" />,
      title: 'Urban & Suburban Households',
      painPoint: 'Spoiled groceries in switched-off refrigerators, stalled dinner preparations, and inoperative overhead water sumps during water pressure drops.',
      resolution: 'Enables families to fill backup storage tanks and charge battery inverters hours prior to cutoffs.',
    },
    {
      icon: <Store size={22} color="#10b981" />,
      title: 'Small & Medium Enterprises (SMEs)',
      painPoint: 'Bakeries, printing presses, salons, and repair workshops cannot afford heavy industrial diesel generators and face direct daily revenue loss.',
      resolution: 'Provides predictable restoration countdowns to schedule order production without wasting diesel.',
    },
    {
      icon: <Laptop size={22} color="var(--water-cyan)" />,
      title: 'Tech Freelancers & Remote Workers',
      painPoint: 'Sri Lanka’s fast-growing IT export workforce suffers unexpected broadband and laptop battery blackouts during live client deliverables.',
      resolution: 'Allows tech professionals to switch work locations or coordinate meetings around exact restoration times.',
    },
    {
      icon: <Activity size={22} color="#ef4444" />,
      title: 'Local Healthcare Clinics & Pharmacies',
      painPoint: 'Temperature-sensitive medicines (such as insulin, pediatric vaccines, and biologics) risk spoilage if cold-chain cooling fails unexpectedly.',
      resolution: 'Instant alerts ensure backup cooling measures or ice-pack transfers are initiated without delay.',
    },
    {
      icon: <GraduationCap size={22} color="#a855f7" />,
      title: 'School & University Students',
      painPoint: 'Disrupted online lectures, lost university assignment uploads, and evening study sessions under inadequate candlelight.',
      resolution: 'Transparent schedules let students complete high-bandwidth study tasks prior to power cuts.',
    },
  ];

  const copingTips = [
    {
      category: 'CEB Power Outage Safety',
      icon: <Zap size={18} color="var(--power-amber)" />,
      tips: [
        'Unplug sensitive electronics (TVs, PCs, fridges) before restoration to protect against sudden voltage spikes.',
        'Keep refrigerator and freezer doors closed — a sealed freezer preserves food temperature for up to 24 hours.',
        'Ensure critical battery devices (phones, flashlights, power banks) are charged as soon as scheduled notice is given.',
      ],
    },
    {
      category: 'NWSB Water Interruption Preparedness',
      icon: <Droplet size={18} color="var(--water-cyan)" />,
      tips: [
        'Turn off overhead booster pumps before the cut to avoid pump motor burnout when running dry.',
        'Store a minimum of 20 liters of clean water per household member in sanitized, covered buckets.',
        'Allow tap lines to run clear for 60 seconds once supply resumes to flush out dislodged sedimentation.',
      ],
    },
  ];

  return (
    <section className="card mb-3" style={{ border: '1px solid var(--border-active)', overflow: 'hidden' }}>
      {/* Header Banner */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)', 
          margin: '-1.5rem -1.5rem 1.5rem',
          padding: '1.75rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              padding: '0.25rem 0.65rem', 
              borderRadius: '9999px', 
              background: 'rgba(239, 68, 68, 0.15)', 
              color: '#ef4444', 
              fontSize: '0.75rem', 
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <ShieldAlert size={13} /> Civic Problem Briefing
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            SLIIT SE3090 Mini Hackathon · Problem & Solution Design
          </span>
        </div>

        <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', marginBottom: '0.75rem' }}>
          The Sri Lankan Outage Crisis: Why Transparency Matters
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 900, lineHeight: 1.6 }}>
          In Sri Lanka, power cuts governed by the <strong>Ceylon Electricity Board (CEB)</strong> and water cuts directed by the <strong>National Water Supply & Drainage Board (NWSB)</strong> are not minor inconveniences — they represent daily economic, educational, and public health disruptions.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('impact')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-sm)',
            border: activeTab === 'impact' ? '1px solid var(--power-amber)' : '1px solid transparent',
            background: activeTab === 'impact' ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
            color: activeTab === 'impact' ? 'var(--power-amber)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <Users size={16} /> Affected Communities
        </button>

        <button
          onClick={() => setActiveTab('solution')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-sm)',
            border: activeTab === 'solution' ? '1px solid var(--water-cyan)' : '1px solid transparent',
            background: activeTab === 'solution' ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
            color: activeTab === 'solution' ? 'var(--water-cyan)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <CheckCircle2 size={16} /> Solution & Civic Value
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-sm)',
            border: activeTab === 'tips' ? '1px solid #10b981' : '1px solid transparent',
            background: activeTab === 'tips' ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
            color: activeTab === 'tips' ? '#10b981' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <Info size={16} /> Preparedness & Coping Guide
        </button>
      </div>

      {/* Tab Content 1: Affected Groups */}
      {activeTab === 'impact' && (
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Broad notices released on social media frequently leave residents in the dark about exact timings for their street. The lack of granular, countdown-based visibility directly impacts distinct segments of Sri Lankan society:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {affectedGroups.map((group, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '1.1rem' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                  {group.icon}
                  <h4 style={{ fontSize: '0.95rem' }}>{group.title}</h4>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                  <strong style={{ color: '#ef4444' }}>Pain Point: </strong>{group.painPoint}
                </p>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.825rem', lineHeight: 1.4 }}>
                  <strong style={{ color: '#10b981' }}>How This App Helps: </strong>{group.resolution}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Proposed Solution Architecture */}
      {activeTab === 'solution' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--power-amber)', marginBottom: '0.65rem' }}>
              <Clock size={20} />
              <h4 style={{ fontSize: '1rem' }}>1. Live Restoration Countdowns</h4>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Instead of cryptic technical schedules, users see a real-time countdown timer showing precisely how many hours and minutes remain until power or water resumes.
            </p>
          </div>

          <div style={{ background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--water-cyan)', marginBottom: '0.65rem' }}>
              <Users size={20} />
              <h4 style={{ fontSize: '1rem' }}>2. Crowdsourced Community Reporting</h4>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              When a localized transformer trips or an underground pipe bursts, residents can submit instant reports. The address is pulled automatically from their profile.
            </p>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '0.65rem' }}>
              <CheckCircle2 size={20} />
              <h4 style={{ fontSize: '1rem' }}>3. Administrative Verification</h4>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              To prevent misinformation, utility administrators review crowdsourced reports and approve verified issues, immediately escalating them into official alerts for neighbors.
            </p>
          </div>
        </div>
      )}

      {/* Tab Content 3: Coping Tips */}
      {activeTab === 'tips' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {copingTips.map((tipBox, i) => (
            <div 
              key={i} 
              style={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 'var(--radius-sm)', 
                padding: '1.25rem' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {tipBox.icon}
                <h4 style={{ fontSize: '0.95rem' }}>{tipBox.category}</h4>
              </div>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                {tipBox.tips.map((tip, tIdx) => (
                  <li key={tIdx} style={{ marginBottom: '0.4rem' }}>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
