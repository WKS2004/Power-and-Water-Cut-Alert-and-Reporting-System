import React, { useState } from 'react';
import { 
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
      icon: <Home size={22} color="var(--primary)" />,
      title: 'Urban & Suburban Households',
      painPoint: 'Spoiled groceries in switched-off refrigerators, stalled dinner preparations, and inoperative overhead water sumps during water pressure drops.',
      resolution: 'Enables families to fill backup storage tanks and charge battery inverters hours prior to cutoffs.',
    },
    {
      icon: <Store size={22} color="var(--tertiary)" />,
      title: 'Small & Medium Enterprises (SMEs)',
      painPoint: 'Bakeries, printing presses, salons, and repair workshops cannot afford heavy industrial diesel generators and face direct daily revenue loss.',
      resolution: 'Provides predictable restoration countdowns to schedule order production without wasting diesel.',
    },
    {
      icon: <Laptop size={22} color="var(--secondary)" />,
      title: 'Tech Freelancers & Remote Workers',
      painPoint: 'Sri Lanka’s fast-growing IT export workforce suffers unexpected broadband and laptop battery blackouts during live client deliverables.',
      resolution: 'Allows tech professionals to switch work locations or coordinate meetings around exact restoration times.',
    },
    {
      icon: <Activity size={22} color="#f87171" />,
      title: 'Local Healthcare Clinics & Pharmacies',
      painPoint: 'Temperature-sensitive medicines (such as insulin, pediatric vaccines, and biologics) risk spoilage if cold-chain cooling fails unexpectedly.',
      resolution: 'Instant alerts ensure backup cooling measures or ice-pack transfers are initiated without delay.',
    },
    {
      icon: <GraduationCap size={22} color="#c084fc" />,
      title: 'School & University Students',
      painPoint: 'Disrupted online lectures, lost university assignment uploads, and evening study sessions under inadequate candlelight.',
      resolution: 'Transparent schedules let students complete high-bandwidth study tasks prior to power cuts.',
    },
  ];

  const copingTips = [
    {
      category: 'CEB Power Outage Safety & Prep',
      icon: <Zap size={18} color="var(--primary)" />,
      tips: [
        'Unplug sensitive electronics (TVs, PCs, fridges) before restoration to protect against sudden voltage spikes.',
        'Keep refrigerator and freezer doors closed — a sealed freezer preserves food temperature for up to 24 hours.',
        'Ensure critical battery devices (phones, flashlights, power banks) are charged as soon as scheduled notice is given.',
      ],
    },
    {
      category: 'NWSB Water Interruption Preparedness',
      icon: <Droplet size={18} color="var(--secondary)" />,
      tips: [
        'Turn off overhead booster pumps before the cut to avoid pump motor burnout when running dry.',
        'Store a minimum of 20 liters of clean water per household member in sanitized, covered buckets.',
        'Allow tap lines to run clear for 60 seconds once supply resumes to flush out dislodged sedimentation.',
      ],
    },
  ];

  return (
    <section className="stitch-card" style={{ marginBottom: '2.5rem', overflow: 'hidden', borderLeft: '4px solid var(--primary-container)' }}>
      {/* Header Banner */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(0, 162, 230, 0.06) 100%)', 
          margin: '-1.5rem -1.5rem 1.5rem',
          padding: '1.75rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
          <span 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              padding: '0.25rem 0.65rem', 
              borderRadius: 'var(--radius-full)', 
              background: 'rgba(239, 68, 68, 0.15)', 
              color: '#f87171', 
              fontSize: '11px', 
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <ShieldAlert size={13} /> Civic Problem Briefing
          </span>
          <span style={{ fontSize: '12px', color: 'var(--outline)', fontFamily: 'var(--font-mono)' }}>
            SLIIT SE3090 Mini Hackathon · Problem & Solution Design
          </span>
        </div>

        <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)', marginBottom: '0.65rem' }}>
          The Sri Lankan Outage Reality: Why Real-Time Visibility Matters
        </h2>

        <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', maxWidth: 900, lineHeight: 1.6 }}>
          In Sri Lanka, power cuts administered by the <strong style={{ color: 'var(--on-surface)' }}>Ceylon Electricity Board (CEB)</strong> and water cuts directed by the <strong style={{ color: 'var(--on-surface)' }}>National Water Supply & Drainage Board (NWSB)</strong> are not minor inconveniences — they represent daily economic, educational, and public health disruptions for millions of citizens.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveTab('impact')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.95rem',
            borderRadius: 'var(--radius-sm)',
            border: activeTab === 'impact' ? '1px solid var(--primary)' : '1px solid transparent',
            background: activeTab === 'impact' ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface-container-high)',
            color: activeTab === 'impact' ? 'var(--primary)' : 'var(--on-surface-variant)',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-headline)',
            cursor: 'pointer',
            transition: 'all 180ms ease',
          }}
        >
          <Users size={16} /> Affected Communities
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('solution')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.95rem',
            borderRadius: 'var(--radius-sm)',
            border: activeTab === 'solution' ? '1px solid var(--secondary)' : '1px solid transparent',
            background: activeTab === 'solution' ? 'rgba(0, 162, 230, 0.15)' : 'var(--surface-container-high)',
            color: activeTab === 'solution' ? 'var(--secondary)' : 'var(--on-surface-variant)',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-headline)',
            cursor: 'pointer',
            transition: 'all 180ms ease',
          }}
        >
          <CheckCircle2 size={16} /> Solution & Civic Value
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tips')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.95rem',
            borderRadius: 'var(--radius-sm)',
            border: activeTab === 'tips' ? '1px solid var(--tertiary)' : '1px solid transparent',
            background: activeTab === 'tips' ? 'rgba(86, 229, 169, 0.15)' : 'var(--surface-container-high)',
            color: activeTab === 'tips' ? 'var(--tertiary)' : 'var(--on-surface-variant)',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-headline)',
            cursor: 'pointer',
            transition: 'all 180ms ease',
          }}
        >
          <Info size={16} /> Preparedness & Coping Guide
        </button>
      </div>

      {/* Tab Content 1: Affected Groups */}
      {activeTab === 'impact' && (
        <div>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Broad announcements on social media frequently leave citizens in the dark about exact timings for their neighborhood. The lack of granular, countdown-based visibility directly impacts distinct segments of Sri Lankan society:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {affectedGroups.map((group, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'var(--surface-container)', 
                  border: '1px solid rgba(255, 255, 255, 0.04)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '1.2rem' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                  {group.icon}
                  <h4 style={{ fontSize: '14px', margin: 0 }}>{group.title}</h4>
                </div>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '12px', marginBottom: '0.65rem', lineHeight: 1.5 }}>
                  <strong style={{ color: '#f87171' }}>Pain Point: </strong>{group.painPoint}
                </p>
                <p style={{ color: 'var(--on-surface)', fontSize: '12px', lineHeight: 1.4, margin: 0 }}>
                  <strong style={{ color: 'var(--tertiary)' }}>How This App Helps: </strong>{group.resolution}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Proposed Solution Architecture */}
      {activeTab === 'solution' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--surface-container)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.65rem' }}>
              <Clock size={20} />
              <h4 style={{ fontSize: '15px', margin: 0 }}>1. Live Restoration Countdowns</h4>
            </div>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
              Instead of static PDFs, users see a real-time countdown clock showing precisely how many hours and minutes remain until power or water resumes in their registered area.
            </p>
          </div>

          <div style={{ background: 'var(--surface-container)', border: '1px solid rgba(0, 162, 230, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', marginBottom: '0.65rem' }}>
              <Users size={20} />
              <h4 style={{ fontSize: '15px', margin: 0 }}>2. Crowdsourced Outage Reporting</h4>
            </div>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
              When a local transformer trips or an underground pipe bursts, residents can submit instant reports. The address is attached automatically from their registered profile.
            </p>
          </div>

          <div style={{ background: 'var(--surface-container)', border: '1px solid rgba(86, 229, 169, 0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tertiary)', marginBottom: '0.65rem' }}>
              <CheckCircle2 size={20} />
              <h4 style={{ fontSize: '15px', margin: 0 }}>3. Administrative Verification</h4>
            </div>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
              To prevent rumors and misinformation, utility authorities review crowdsourced reports and approve verified issues, immediately escalating them into live alerts for neighbors.
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
                background: 'var(--surface-container)', 
                border: '1px solid rgba(255, 255, 255, 0.04)', 
                borderRadius: 'var(--radius-md)', 
                padding: '1.25rem' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {tipBox.icon}
                <h4 style={{ fontSize: '14px', margin: 0 }}>{tipBox.category}</h4>
              </div>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--on-surface-variant)', fontSize: '12px', lineHeight: 1.6 }}>
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
