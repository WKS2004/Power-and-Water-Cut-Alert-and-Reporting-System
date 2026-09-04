import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, FastForward, Check, X, RefreshCw, Send,
  Zap, Droplet, MapPin, AlertCircle, CheckCircle,
} from 'lucide-react';
import { AREAS } from '../constants/areas';
import {
  getTimeSkipApi, setTimeSkipApi, createOfficialAlertApi,
  getAdminReportsApi, approveReportApi, rejectReportApi,
} from '../services/api';

/** Format a datetime string for display */
function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-LK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/** Time elapsed from a date string */
function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function AdminDashboard() {
  // ── Time-skip state ─────────────────────────────────────────────────────────
  const [offsetMinutes, setOffsetMinutes] = useState(0);
  const [simulatedTime, setSimulatedTime] = useState(new Date().toLocaleTimeString());

  // ── Official Alert Form ──────────────────────────────────────────────────────
  const [alertForm, setAlertForm] = useState({
    type: 'power',
    area: AREAS[0],
    startTime: '',
    estimatedEndTime: '',
    description: '',
  });
  const [alertFormErrors, setAlertFormErrors] = useState({});
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // ── Pending Community Reports ────────────────────────────────────────────────
  const [pendingReports, setPendingReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState('');
  const [actioningId, setActioningId] = useState(null);

  // ── Sync simulated time on mount ─────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await getTimeSkipApi();
        if (res.data) {
          setOffsetMinutes(res.data.offsetMinutes || 0);
          setSimulatedTime(new Date(res.data.effectiveTime).toLocaleTimeString());
        }
      } catch { /* fallback — state stays at defaults */ }
    })();
  }, []);

  // ── Fetch pending community reports ──────────────────────────────────────────
  const fetchPendingReports = useCallback(async () => {
    setReportsLoading(true);
    setReportsError('');
    try {
      const res = await getAdminReportsApi();
      // Show only unapproved reports in the review queue
      const pending = (res.data || []).filter((r) => !r.approved);
      setPendingReports(pending);
    } catch (err) {
      setReportsError(err.message || 'Could not load community reports.');
    } finally {
      setReportsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPendingReports(); }, [fetchPendingReports]);

  // ── Time-skip controls ───────────────────────────────────────────────────────
  const handleTimeAdvance = async (minutes) => {
    try {
      const res = await setTimeSkipApi({ addMinutes: minutes });
      if (res.data) {
        setOffsetMinutes(res.data.offsetMinutes);
        setSimulatedTime(new Date(res.data.effectiveTime).toLocaleTimeString());
      }
    } catch {
      // Local fallback for when backend isn't up
      const next = offsetMinutes + minutes;
      setOffsetMinutes(next);
      setSimulatedTime(new Date(Date.now() + next * 60000).toLocaleTimeString());
    }
  };

  const handleTimeReset = async () => {
    try {
      await setTimeSkipApi({ reset: true });
    } catch { /* ignore */ }
    setOffsetMinutes(0);
    setSimulatedTime(new Date().toLocaleTimeString());
  };

  // ── Alert form validation ────────────────────────────────────────────────────
  const validateAlertForm = () => {
    const errs = {};
    if (!alertForm.startTime) errs.startTime = 'Start date/time is required.';
    if (!alertForm.estimatedEndTime) errs.estimatedEndTime = 'End date/time is required.';
    if (alertForm.startTime && alertForm.estimatedEndTime) {
      if (new Date(alertForm.estimatedEndTime) <= new Date(alertForm.startTime)) {
        errs.estimatedEndTime = 'End time must be after start time.';
      }
    }
    if (!alertForm.description.trim()) errs.description = 'A brief description is required.';
    return errs;
  };

  const handlePublishAlert = async (e) => {
    e.preventDefault();
    setPublishError('');
    const errs = validateAlertForm();
    if (Object.keys(errs).length > 0) {
      setAlertFormErrors(errs);
      return;
    }
    setAlertFormErrors({});
    setIsPublishing(true);
    try {
      await createOfficialAlertApi(alertForm);
      setPublishSuccess(true);
      setAlertForm({ type: 'power', area: AREAS[0], startTime: '', estimatedEndTime: '', description: '' });
      setTimeout(() => setPublishSuccess(false), 4000);
    } catch (err) {
      setPublishError(err.message || 'Failed to publish alert. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const FieldErr = ({ field }) =>
    alertFormErrors[field] ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem', color: '#f87171', fontSize: '11px' }}>
        <AlertCircle size={11} /> {alertFormErrors[field]}
      </div>
    ) : null;

  // ── Approve / Reject actions ─────────────────────────────────────────────────
  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await approveReportApi(id);
      await fetchPendingReports();
    } catch (err) {
      alert(`Failed to approve: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject and permanently delete this report?')) return;
    setActioningId(id);
    try {
      await rejectReportApi(id);
      await fetchPendingReports();
    } catch (err) {
      alert(`Failed to reject: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* ── 1. Header ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Authority Management Portal</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', margin: 0 }}>
            Official utility alert publishing, community verification, and presentation time-skip simulator.
          </p>
        </div>
      </div>

      {/* ── 2. Demo Time-Skip Simulator ──────────────────────────────────────── */}
      <div className="stitch-card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--secondary-container)', background: 'var(--surface-container-low)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
              <FastForward size={17} color="var(--secondary)" />
              <strong style={{ color: 'var(--secondary)', fontSize: '14px' }}>Demo Time-Skip Simulator</strong>
              <span style={{ fontSize: '11px', background: 'rgba(0,162,230,0.12)', color: 'var(--secondary)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)' }}>FOR DEMO VIDEO</span>
            </div>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '12px', margin: 0 }}>
              Fast-forward internal reference clock to show alerts transitioning from upcoming → ongoing → resolved.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'var(--surface-container-lowest)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-md)', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--on-surface-variant)' }}>
              Offset: <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>+{offsetMinutes.toFixed(0)} min</span>{' '}
              <span style={{ color: 'var(--outline)', fontSize: '11px' }}>({simulatedTime})</span>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {[30, 60, 180].map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => handleTimeAdvance(min)}
                  style={{ background: 'var(--surface-container-high)', border: 'none', color: 'var(--on-surface)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                >
                  +{min >= 60 ? `${min / 60}h` : `${min}m`}
                </button>
              ))}
              <button
                type="button"
                onClick={handleTimeReset}
                style={{ background: 'var(--surface-container)', border: 'none', color: '#f87171', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <RefreshCw size={11} /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Two-Column Operations Grid ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '2rem' }}>

        {/* ── Left: Issue Official Alert Form ─────────────────────────────────── */}
        <div className="stitch-card" style={{ borderLeft: '4px solid var(--primary-container)' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
              <Zap size={18} />
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Issue Official Utility Alert</h2>
            </div>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '12px', margin: 0 }}>
              Broadcast verified CEB / NWSDB schedules. Goes live immediately without moderation.
            </p>
          </div>

          <form onSubmit={handlePublishAlert} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
            {/* Utility Type */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>Utility Sector</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {['power', 'water'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAlertForm({ ...alertForm, type: t })}
                    style={{
                      padding: '0.65rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                      background: alertForm.type === t
                        ? (t === 'power' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 162, 230, 0.15)')
                        : 'var(--surface-container-high)',
                      color: alertForm.type === t
                        ? (t === 'power' ? 'var(--primary)' : 'var(--secondary)')
                        : 'var(--on-surface-variant)',
                      border: alertForm.type === t
                        ? `1px solid ${t === 'power' ? 'var(--primary)' : 'var(--secondary)'}`
                        : '1px solid transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                      fontFamily: 'var(--font-headline)', fontWeight: 600, fontSize: '13px',
                    }}
                  >
                    {t === 'power' ? <Zap size={16} /> : <Droplet size={16} />}
                    {t === 'power' ? 'Electricity (CEB)' : 'Water (NWSDB)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Area */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>Target Grid Sector / Zone</label>
              <select className="stitch-select" value={alertForm.area} onChange={(e) => setAlertForm({ ...alertForm, area: e.target.value })}>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Schedule Times — datetime-local for proper DB storage */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>Scheduled Start *</label>
                <input
                  type="datetime-local"
                  className={`stitch-input${alertFormErrors.startTime ? ' input-error' : ''}`}
                  value={alertForm.startTime}
                  onChange={(e) => { setAlertForm({ ...alertForm, startTime: e.target.value }); setAlertFormErrors((p) => ({ ...p, startTime: '' })); }}
                />
                <FieldErr field="startTime" />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>Estimated End *</label>
                <input
                  type="datetime-local"
                  className={`stitch-input${alertFormErrors.estimatedEndTime ? ' input-error' : ''}`}
                  value={alertForm.estimatedEndTime}
                  onChange={(e) => { setAlertForm({ ...alertForm, estimatedEndTime: e.target.value }); setAlertFormErrors((p) => ({ ...p, estimatedEndTime: '' })); }}
                />
                <FieldErr field="estimatedEndTime" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>Incident Synopsis / Reason *</label>
              <textarea
                rows={3}
                className={`stitch-textarea${alertFormErrors.description ? ' input-error' : ''}`}
                value={alertForm.description}
                onChange={(e) => { setAlertForm({ ...alertForm, description: e.target.value }); setAlertFormErrors((p) => ({ ...p, description: '' })); }}
                placeholder="e.g. Scheduled 33kV distribution feeder line maintenance"
              />
              <FieldErr field="description" />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', opacity: isPublishing ? 0.7 : 1 }}
              disabled={isPublishing}
            >
              <Send size={16} />
              <span>{isPublishing ? 'Publishing...' : 'Publish Official Alert'}</span>
            </button>

            {publishSuccess && (
              <div style={{ background: 'rgba(86, 229, 169, 0.12)', border: '1px solid rgba(86, 229, 169, 0.25)', color: 'var(--tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} /> Alert broadcast — live countdown started!
              </div>
            )}
            {publishError && (
              <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <AlertCircle size={14} /> {publishError}
              </div>
            )}
          </form>
        </div>

        {/* ── Right: Community Reports Verification Queue ─────────────────────── */}
        <div className="stitch-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tertiary)', marginBottom: '0.25rem' }}>
                <Shield size={18} />
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Community Reports Queue</h2>
              </div>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '12px', margin: 0 }}>Review resident submissions with verified premise addresses.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ background: 'var(--surface-container-high)', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                {pendingReports.length} PENDING
              </span>
              <button
                onClick={fetchPendingReports}
                disabled={reportsLoading}
                title="Refresh queue"
                style={{ background: 'var(--surface-container)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--on-surface-variant)', borderRadius: 'var(--radius-sm)', padding: '0.3rem 0.45rem', cursor: 'pointer', display: 'flex' }}
              >
                <RefreshCw size={13} style={{ animation: reportsLoading ? 'spin 1s linear infinite' : 'none' }} />
              </button>
            </div>
          </div>

          {reportsError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-md)', padding: '0.6rem 0.9rem', color: '#f87171', fontSize: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={13} /> {reportsError}
            </div>
          )}

          {reportsLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
              Loading community reports...
            </div>
          ) : pendingReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <CheckCircle size={32} color="var(--tertiary)" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px' }}>No unreviewed reports in queue.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '520px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {pendingReports.map((report) => (
                <div
                  key={report._id}
                  style={{ background: 'var(--surface-container)', borderRadius: 'var(--radius-md)', padding: '1.1rem', border: '1px solid rgba(255, 255, 255, 0.04)', opacity: actioningId === report._id ? 0.6 : 1, transition: 'opacity 200ms' }}
                >
                  {/* Report header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className={`stitch-badge ${report.type === 'power' ? 'badge-power' : 'badge-water'}`}>
                        {report.type === 'power' ? 'POWER CUT' : 'WATER CUT'}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--on-surface-variant)' }}>{report.area}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--outline)', fontFamily: 'var(--font-mono)' }}>
                      {timeAgo(report.createdAt)}
                    </span>
                  </div>

                  {/* Description */}
                  {report.description && (
                    <p style={{ fontSize: '13px', color: 'var(--on-surface)', marginBottom: '0.65rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                      "{report.description}"
                    </p>
                  )}

                  {/* Time info */}
                  <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                    {formatDateTime(report.startTime)} → {formatDateTime(report.estimatedEndTime)}
                  </div>

                  {/* Address */}
                  {report.submittedBy?.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--on-surface-variant)', fontSize: '12px', marginBottom: '0.75rem' }}>
                      <MapPin size={13} color="var(--primary)" />
                      <span><strong>Address:</strong> {report.submittedBy.address}</span>
                    </div>
                  )}

                  {/* Footer: username + action buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--outline)' }}>
                      By: <strong style={{ color: 'var(--on-surface)' }}>@{report.submittedBy?.username || 'unknown'}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleReject(report._id)}
                        disabled={!!actioningId}
                        style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', color: '#f87171', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <X size={12} /> Reject
                      </button>
                      <button
                        onClick={() => handleApprove(report._id)}
                        disabled={!!actioningId}
                        style={{ background: 'rgba(86, 229, 169, 0.15)', border: 'none', color: 'var(--tertiary)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <Check size={12} /> Approve & Publish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
