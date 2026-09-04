import React, { useState, useEffect } from 'react';
import { Zap, Droplet, Clock, AlertCircle, PlusCircle, Filter } from 'lucide-react';
import { AREAS } from '../constants/areas';
import { getReportsApi } from '../services/api';

/**
 * User Dashboard Page Skeleton
 * Ownership: Member 3 (Frontend UI)
 * 
 * Features to be implemented by Member 3:
 * 1. Filter alerts by logged-in user area by default (with toggle for 'All Areas')
 * 2. Live countdown timer component to estimatedEndTime
 * 3. Outage report submission form (auto-pulling user's address)
 * 4. Visual in-app alert banner when new cuts affect user's area
 */
export default function UserDashboard() {
  const [selectedArea, setSelectedArea] = useState('all');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch reports on mount and when area changes
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await getReportsApi(selectedArea);
        setReports(res.data || []);
      } catch (err) {
        console.warn('Backend reporting endpoint scaffolded:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedArea]);

  return (
    <div>
      {/* Top Controls Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h2>Resident Outage Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Real-time status updates and scheduled interruption alerts for your neighborhood.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-secondary)" />
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.5rem 0.85rem' }}
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="all">All Monitoring Areas</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary" style={{ padding: '0.55rem 1rem' }}>
            <PlusCircle size={16} /> Report Cut
          </button>
        </div>
      </div>

      {/* Live Countdown Showcase Card (Stub for Member 3) */}
      <div
        className="card mb-3"
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(6, 182, 212, 0.08))',
          border: '1px solid rgba(245, 158, 11, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Clock size={20} color="var(--power-amber)" />
          <h4 style={{ color: 'var(--power-amber)' }}>Live Countdown Feature Area</h4>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          This component will render dynamic second-by-second countdown clocks for ongoing interruptions in the selected area.
        </p>
        <div
          style={{
            display: 'inline-flex',
            gap: '1rem',
            padding: '0.75rem 1.25rem',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '1.4rem',
            fontWeight: 700,
            color: 'var(--power-amber)',
          }}
        >
          <span>02h : 45m : 18s</span>
          <span style={{ fontSize: '0.85rem', alignSelf: 'center', color: 'var(--text-muted)' }}>(Demo Preview)</span>
        </div>
      </div>

      {/* Outage Alerts Feed Placeholder */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Active & Upcoming Alerts ({reports.length})</h3>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading neighborhood alerts...</p>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <AlertCircle size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No active outages currently reported for {selectedArea}.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              When official cuts are published or community reports approved, they will appear here.
            </p>
          </div>
        ) : (
          <div>
            {reports.map((r, i) => (
              <div key={i} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                {r.type} - {r.area}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
