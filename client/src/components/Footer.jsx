import React from 'react';
import { Zap, Droplet } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="stitch-footer">
      <div className="footer-inner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>Sri Lanka Outage Alert System</span>
            <span style={{ fontSize: '11px', color: 'var(--outline)' }}>• CEB & NWSDB Telemetry</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>
            SLIIT SE3090 Software Engineering Frameworks — Mini Hackathon 2026
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)' }}>
            <Zap size={14} />
            <span>Power Grid</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--secondary)' }}>
            <Droplet size={14} />
            <span>Water Supply</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
