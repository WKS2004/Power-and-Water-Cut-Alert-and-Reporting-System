import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Droplet, Clock, ShieldCheck, ArrowRight, MapPin } from 'lucide-react';
import { AREAS } from '../constants/areas';
import ProblemExplanation from '../components/ProblemExplanation';

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '3rem 1rem 4rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            color: 'var(--power-amber)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}
        >
          <Zap size={14} />
          <span>Live Sri Lanka Outage Intelligence</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', maxWidth: 850, margin: '0 auto 1.25rem' }}>
          Know When Power & Water Cuts Happen. <span className="text-power">Before</span> They Disrupt You.
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 650, margin: '0 auto 2.5rem' }}>
          A community-powered and authority-verified alert network providing real-time schedules, live restoration countdowns, and crowdsourced outage reporting across Sri Lanka.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-primary">
            View Live Outages <ArrowRight size={18} />
          </Link>
          <Link to="/register" className="btn btn-outline">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Sri Lankan Problem Statement (Requirement #2 & #10 - Owned by Member 1) */}
      <ProblemExplanation />


      {/* Features Overview */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card">
          <div style={{ color: 'var(--power-amber)', marginBottom: '1rem' }}>
            <Zap size={28} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Electricity Cuts (CEB)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Instant updates on transformer breakdowns, feeder maintenance, and scheduled load shedding in your registered area.
          </p>
        </div>

        <div className="card">
          <div style={{ color: 'var(--water-cyan)', marginBottom: '1rem' }}>
            <Droplet size={28} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Water Interruptions (NWSB)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Stay informed on pump repairs, pipeline developments, and low-pressure advisories to store water ahead of time.
          </p>
        </div>

        <div className="card">
          <div style={{ color: '#10b981', marginBottom: '1rem' }}>
            <Clock size={28} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Live Countdown Timers</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Dynamic countdowns displaying exact hours and minutes remaining until expected supply restoration.
          </p>
        </div>

        <div className="card">
          <div style={{ color: '#8b5cf6', marginBottom: '1rem' }}>
            <ShieldCheck size={28} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Admin Verified Reports</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Crowdsourced outage reports submitted by local residents are verified by administrators before becoming official alerts.
          </p>
        </div>
      </section>

      {/* Covered Regions */}
      <section className="card text-center">
        <h3 style={{ marginBottom: '0.5rem' }}>Current Coverage Areas</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Actively monitoring utilities across high-density residential and commercial hubs:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          {AREAS.map((area) => (
            <span
              key={area}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.85rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <MapPin size={13} color="var(--power-amber)" />
              {area}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
