import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Droplet, Clock, ShieldCheck, AlertTriangle, ArrowRight, MapPin, Activity } from 'lucide-react';
import { AREAS } from '../constants/areas';

export default function LandingPage() {
  return (
    <div style={{ position: 'relative' }}>
      {/* Subtle Radial Glows from Stitch Design */}
      <div
        style={{
          position: 'absolute',
          top: '-3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '320px',
          background: 'rgba(245, 158, 11, 0.08)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      ></div>

      {/* 1. Centered Hero Section */}
      <section style={{ textAlign: 'center', padding: '2rem 1rem 3.5rem', position: 'relative', zIndex: 1 }}>
        {/* Live Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--surface-container-high)',
            color: 'var(--primary)',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            marginBottom: '1.75rem',
          }}
        >
          <Zap size={14} />
          <span>Live Sri Lanka Outage Intelligence</span>
        </div>

        {/* Hero Heading */}
        <h1
          style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.6rem)',
            maxWidth: '900px',
            margin: '0 auto 1.25rem',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
          }}
        >
          Know When Power & Water Cuts Happen.{' '}
          <span style={{ color: 'var(--primary-container)' }}>Before</span> They Disrupt You.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--on-surface-variant)',
            maxWidth: '680px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.6,
          }}
        >
          A community-powered and authority-verified alert network providing real-time schedules, live restoration countdowns, and crowdsourced outage reporting across Sri Lanka.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <Link to="/dashboard" className="btn-primary" style={{ padding: '0.75rem 1.6rem', fontSize: '15px' }}>
            <span>View Live Outages</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/register" className="btn-secondary" style={{ padding: '0.75rem 1.6rem', fontSize: '15px' }}>
            Create Free Account
          </Link>
        </div>

        {/* Quick Metrics Counter Strip from Stitch Design */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            maxWidth: '520px',
            margin: '0 auto',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--on-surface)' }}>
              14.2k
            </span>
            <span style={{ fontSize: '11px', color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Citizens Alerted
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>
              8 mins
            </span>
            <span style={{ fontSize: '11px', color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Avg Lead Time
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--tertiary)' }}>
              98.4%
            </span>
            <span style={{ fontSize: '11px', color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Grid Accuracy
            </span>
          </div>
        </div>
      </section>

      {/* 2. Sri Lankan Problem Framing Card (Requirement #2) */}
      <section style={{ maxWidth: '1040px', margin: '0 auto 3rem' }}>
        <div
          className="stitch-card"
          style={{
            position: 'relative',
            borderLeft: '4px solid var(--primary-container)',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-container-highest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-container)',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={24} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.25rem' }}>The Sri Lankan Outage Reality</h2>
                <span className="stitch-badge badge-power">MUNICIPAL CONTEXT</span>
              </div>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                Scheduled grid maintenance and unscheduled disruptions by the{' '}
                <strong style={{ color: 'var(--on-surface)' }}>Ceylon Electricity Board (CEB)</strong> and{' '}
                <strong style={{ color: 'var(--on-surface)' }}>National Water Supply & Drainage Board (NWSB)</strong> frequently impact households, small enterprises, schools, and hospitals across the island.
              </p>
              <p style={{ color: 'var(--on-surface-variant)', opacity: 0.85, lineHeight: 1.6 }}>
                Residents often lack clear restoration windows or have to rely on fragmented social media notices. This platform provides single-click visibility for your exact neighbourhood, live countdowns to service restoration, and a direct line to report local pipe bursts and grid failures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4 Clean Feature Cards in 2x2 Grid */}
      <section style={{ maxWidth: '1040px', margin: '0 auto 3.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1: Electricity */}
          <div className="stitch-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-container-highest)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Electricity Cuts (CEB)</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', lineHeight: 1.6 }}>
                Instant updates on transformer breakdowns, feeder maintenance, and scheduled load shedding in your registered area.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <span className="pulse-circle" style={{ width: 6, height: 6, backgroundColor: 'var(--primary)' }}></span>
              <span>CEB GRID SYNCHRONIZED</span>
            </div>
          </div>

          {/* Card 2: Water */}
          <div className="stitch-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-container-highest)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Droplet size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Water Interruptions (NWSB)</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', lineHeight: 1.6 }}>
                Stay informed on pump repairs, pipeline developments, and low-pressure advisories to store water ahead of time.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--secondary)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <span className="pulse-circle" style={{ width: 6, height: 6, backgroundColor: 'var(--secondary)' }}></span>
              <span>NWSDB PRESSURE MONITORED</span>
            </div>
          </div>

          {/* Card 3: Countdown Timers */}
          <div className="stitch-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-container-highest)',
                  color: 'var(--tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Clock size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Live Countdown Clocks</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', lineHeight: 1.6 }}>
                Dynamic countdowns displaying exact hours and minutes remaining until expected supply restoration for every active cut.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--tertiary)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <span className="pulse-circle" style={{ width: 6, height: 6, backgroundColor: 'var(--tertiary)' }}></span>
              <span>DYNAMIC RESTORATION ENGINE</span>
            </div>
          </div>

          {/* Card 4: Verified Reports */}
          <div className="stitch-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-container-highest)',
                  color: 'var(--primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Verified Community Reports</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', lineHeight: 1.6 }}>
                Crowdsourced reports submitted by verified residents are reviewed by authorities before broadcasting system-wide.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-container)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <span className="pulse-circle" style={{ width: 6, height: 6, backgroundColor: 'var(--primary-container)' }}></span>
              <span>COMMUNITY ACCURACY ASSURED</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Covered Regions Grid */}
      <section style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <div className="stitch-card" style={{ textAlign: 'center', padding: '2.25rem 1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>Active Telemetry Monitoring Zones</h3>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', marginBottom: '1.5rem' }}>
            High-density residential and commercial districts covered by the pilot network:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center' }}>
            {AREAS.map((area) => (
              <span
                key={area}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '13px',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--surface-container-high)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  color: 'var(--on-surface)',
                }}
              >
                <MapPin size={13} color="var(--primary)" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
