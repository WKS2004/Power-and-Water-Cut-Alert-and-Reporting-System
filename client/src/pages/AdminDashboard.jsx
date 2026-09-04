import React, { useState, useEffect } from 'react';
import { Shield, FastForward, CheckCircle2, XCircle, Plus, RefreshCw } from 'lucide-react';
import { AREAS } from '../constants/areas';
import { getTimeSkipApi, setTimeSkipApi } from '../services/api';

/**
 * Admin Dashboard Page Skeleton
 * Ownership: Member 3 (Frontend UI)
 * 
 * Administrative capabilities to be implemented by Member 3:
 * 1. Create/issue official utility alerts (auto-approved, live immediately)
 * 2. View user-submitted reports with citizen addresses for verification
 * 3. Approve / Reject user reports
 * 4. Fast-forward simulated reference time for hackathon presentation video
 */
export default function AdminDashboard() {
  const [offsetMinutes, setOffsetMinutes] = useState(0);
  const [effectiveTime, setEffectiveTime] = useState('');

  const fetchTimeSkip = async () => {
    try {
      const res = await getTimeSkipApi();
      setOffsetMinutes(res.data.offsetMinutes);
      setEffectiveTime(new Date(res.data.effectiveTime).toLocaleTimeString());
    } catch {
      // Backend not yet connected or mock fallback
    }
  };

  useEffect(() => {
    fetchTimeSkip();
  }, []);

  const handleSkipTime = async (minutes) => {
    try {
      const res = await setTimeSkipApi({ addMinutes: minutes });
      setOffsetMinutes(res.data.offsetMinutes);
      setEffectiveTime(new Date(res.data.effectiveTime).toLocaleTimeString());
    } catch (err) {
      alert(`Time-skip simulation ready. Backend response: ${err.message}`);
    }
  };

  const handleResetTime = async () => {
    try {
      const res = await setTimeSkipApi({ reset: true });
      setOffsetMinutes(res.data.offsetMinutes);
      setEffectiveTime(new Date(res.data.effectiveTime).toLocaleTimeString());
    } catch (err) {
      alert(`Time reset: ${err.message}`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            padding: '0.5rem',
            borderRadius: '8px',
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#60a5fa',
          }}
        >
          <Shield size={24} />
        </div>
        <div>
          <h2>Authority Management Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Official utility alert publishing, community verification, and presentation time-skip simulator.
          </p>
        </div>
      </div>

      {/* Demo Time-Skip Simulator (Requirement #4 from Instructions) */}
      <div
        className="card mb-3"
        style={{
          borderLeft: '4px solid #60a5fa',
          background: 'rgba(30, 41, 59, 0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <FastForward size={18} color="#60a5fa" />
              <strong style={{ color: '#60a5fa' }}>Demo Time-Skip Simulator (For 2-Min Video)</strong>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Fast-forward internal reference clock to show alerts transitioning from upcoming → ongoing → resolved.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Offset: <strong>+{offsetMinutes} min</strong> {effectiveTime && `(${effectiveTime})`}
            </span>
            <button onClick={() => handleSkipTime(30)} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              +30m
            </button>
            <button onClick={() => handleSkipTime(60)} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              +1 Hour
            </button>
            <button onClick={() => handleSkipTime(180)} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              +3 Hours
            </button>
            <button onClick={handleResetTime} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#ef4444' }}>
              <RefreshCw size={13} /> Reset
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Issue Alert Card */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} color="var(--power-amber)" /> Issue Official Alert
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Directly broadcast verified CEB / NWSB maintenance schedules. Live immediately without moderation.
          </p>
          <div style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Form component ready for Member 3 integration.
            </p>
          </div>
        </div>

        {/* Review User Reports Card */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="#10b981" /> Community Reports Queue
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Review crowd-sourced resident reports with verifiable street addresses and approve them to go live.
          </p>
          <div style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Verification table ready for Member 3 integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
