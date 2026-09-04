import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap, Droplet, Clock, Plus, Filter, AlertCircle, CheckCircle,
  X, ShieldAlert, MapPin, Send, RefreshCw, User, FastForward, FileText,
} from 'lucide-react';
import { AREAS } from '../constants/areas';
import { getReportsApi, submitReportApi, getMyReportsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

/** Format seconds into HH:mm:ss countdown string */
function formatCountdown(totalSec) {
  if (totalSec <= 0) return '00h : 00m : 00s';
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}h : ${String(m).padStart(2, '0')}m : ${String(s).padStart(2, '0')}s`;
}

/** Compute simulated current timestamp honoring admin time-skip */
function calcEffectiveNow(offsetMinutes = 0) {
  return Date.now() + (offsetMinutes * 60 * 1000);
}

/** Derive progress % from startTime to endTime relative to simulated now */
function calcProgress(startTime, endTime, offsetMinutes = 0) {
  const now = calcEffectiveNow(offsetMinutes);
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  if (now < start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

/** Seconds remaining until a given ISO date string relative to simulated now */
function secondsUntil(isoDate, offsetMinutes = 0) {
  const now = calcEffectiveNow(offsetMinutes);
  const remaining = Math.floor((new Date(isoDate).getTime() - now) / 1000);
  return remaining > 0 ? remaining : 0;
}

/** Returns a friendly status label and color */
function statusMeta(status) {
  if (status === 'ongoing') return { label: 'ACTIVE NOW', color: '#f87171' };
  if (status === 'scheduled') return { label: 'SCHEDULED', color: 'var(--primary)' };
  return { label: 'RESOLVED', color: 'var(--tertiary)' };
}

/** Format a datetime string for display */
function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-LK', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function UserDashboard() {
  const { user } = useAuth();

  // Use logged-in user's area as default filter
  const [selectedArea, setSelectedArea] = useState(user?.area || 'all');
  const [reports, setReports] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'my-reports'
  const [simulatedOffsetMinutes, setSimulatedOffsetMinutes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live countdown state driven by the featured active alert's estimatedEndTime
  const [countdownSeconds, setCountdownSeconds] = useState(0);

  // Report submission form state
  const [formData, setFormData] = useState({
    type: 'power',
    area: user?.area || AREAS[0],
    startTime: '',
    estimatedEndTime: '',
    description: '',
  });
  const [formValidationErrors, setFormValidationErrors] = useState({});

  // ── Fetch reports ──────────────────────────────────────────────────────────
  const fetchReports = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await getReportsApi(selectedArea);
      setReports(res.data || []);
      if (typeof res.simulatedOffsetMinutes === 'number') {
        setSimulatedOffsetMinutes(res.simulatedOffsetMinutes);
      }
    } catch (err) {
      setLoadError(err.message || 'Could not load live data. Please check your connection.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [selectedArea]);

  // ── Fetch user's own submitted reports ──────────────────────────────────────
  const fetchMyReports = useCallback(async () => {
    try {
      const res = await getMyReportsApi();
      setMyReports(res.data || []);
      if (typeof res.simulatedOffsetMinutes === 'number') {
        setSimulatedOffsetMinutes(res.simulatedOffsetMinutes);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchReports();
    fetchMyReports();
  }, [fetchReports, fetchMyReports]);

  // ── Featured alert (top ongoing for user area, else top scheduled) ────────
  const featuredAlert = React.useMemo(() => {
    const active = reports.filter((r) => r.status === 'ongoing');
    const scheduled = reports.filter((r) => r.status === 'scheduled');
    return active[0] || scheduled[0] || null;
  }, [reports]);

  // ── Live countdown ticker driven by featuredAlert's estimatedEndTime ──────
  useEffect(() => {
    if (!featuredAlert) { setCountdownSeconds(0); return; }
    setCountdownSeconds(secondsUntil(featuredAlert.estimatedEndTime, simulatedOffsetMinutes));
    const timer = setInterval(() => {
      setCountdownSeconds(secondsUntil(featuredAlert.estimatedEndTime, simulatedOffsetMinutes));
    }, 1000);
    return () => clearInterval(timer);
  }, [featuredAlert, simulatedOffsetMinutes]);

  // Active and upcoming alerts (exclude resolved)
  const visibleAlerts = reports.filter((r) => r.status !== 'resolved');
  const resolvedAlerts = reports.filter((r) => r.status === 'resolved');

  // ── Report form handlers ─────────────────────────────────────────────────
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formValidationErrors[field]) {
      setFormValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.startTime) errs.startTime = 'Please enter the time the cut started.';
    if (!formData.estimatedEndTime) errs.estimatedEndTime = 'Please enter the expected restoration time.';
    if (formData.startTime && formData.estimatedEndTime) {
      if (new Date(formData.estimatedEndTime) <= new Date(formData.startTime)) {
        errs.estimatedEndTime = 'Restoration time must be after the start time.';
      }
    }
    return errs;
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormValidationErrors(errs);
      return;
    }
    setIsSubmitting(true);
    try {
      await submitReportApi(formData);
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setModalOpen(false);
        setFormData({ type: 'power', area: user?.area || AREAS[0], startTime: '', estimatedEndTime: '', description: '' });
        setFormValidationErrors({});
        fetchReports();
        fetchMyReports();
        setActiveTab('my-reports');
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FieldErr = ({ field }) =>
    formValidationErrors[field] ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem', color: '#f87171', fontSize: '11px' }}>
        <AlertCircle size={11} /> <span>{formValidationErrors[field]}</span>
      </div>
    ) : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── 1. Header & Controls ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Resident Outage Dashboard</h1>
            {user?.area && (
              <span style={{ background: 'rgba(0, 162, 230, 0.12)', color: 'var(--secondary)', fontSize: '11px', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={11} /> {user.area}
              </span>
            )}
          </div>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', margin: 0 }}>
            Real-time status updates and scheduled interruption alerts for your neighborhood.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Area Filter */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Filter size={15} style={{ position: 'absolute', left: 12, color: 'var(--on-surface-variant)', zIndex: 1 }} />
            <select
              className="stitch-select"
              style={{ paddingLeft: '2.25rem', width: 'auto', fontSize: '13px' }}
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="all">All Monitoring Areas (Islandwide)</option>
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Refresh */}
          <button
            onClick={() => { fetchReports(); fetchMyReports(); }}
            disabled={loading}
            style={{ background: 'var(--surface-container)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--on-surface-variant)', borderRadius: 'var(--radius-md)', padding: '0.55rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '13px' }}
          >
            <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>

          {/* Report Cut Button */}
          <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ padding: '0.6rem 1.1rem', fontSize: '13px' }}>
            <Plus size={16} />
            <span>Report Cut</span>
          </button>
        </div>
      </div>

      {/* Demo Time-Skip Sync Indicator Banner */}
      {simulatedOffsetMinutes !== 0 && (
        <div style={{ background: 'rgba(0, 162, 230, 0.12)', border: '1px solid rgba(0, 162, 230, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--secondary)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
          <FastForward size={15} />
          <span>
            <strong>DEMO TIME-SKIP SIMULATOR ACTIVE:</strong> Clock fast-forwarded by +{simulatedOffsetMinutes} minutes. Countdowns and statuses are synchronized with simulated reference time.
          </span>
        </div>
      )}

      {/* Load error banner */}
      {loadError && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#f87171', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} /> {loadError}
        </div>
      )}

      {/* ── 2. Featured Active Incident Banner with Live Countdown ────────────── */}
      {featuredAlert ? (
        <div
          className="stitch-card"
          style={{ marginBottom: '2rem', borderLeft: `4px solid ${featuredAlert.status === 'ongoing' ? '#f87171' : 'var(--primary)'}`, background: 'linear-gradient(135deg, rgba(23, 27, 38, 0.95), rgba(28, 31, 42, 0.95))' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="pulse-circle" style={{ backgroundColor: featuredAlert.status === 'ongoing' ? '#f87171' : 'var(--primary)' }}></span>
              <span className={`stitch-badge ${featuredAlert.type === 'power' ? 'badge-power' : 'badge-water'}`}>
                {featuredAlert.status === 'ongoing' ? 'ACTIVE INCIDENT' : 'UPCOMING SCHEDULED'}
              </span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>{featuredAlert.area}</span>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              {featuredAlert.type === 'power' ? <Zap size={18} color="var(--primary)" /> : <Droplet size={18} color="var(--secondary)" />}
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                {featuredAlert.type === 'power' ? 'CEB Power Cut' : 'NWSDB Water Interruption'}
              </h2>
            </div>
            {featuredAlert.description && (
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', marginTop: '0.35rem' }}>
                {featuredAlert.description}
              </p>
            )}
          </div>

          {/* Live Countdown */}
          <div style={{ background: 'var(--surface-container-lowest)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={24} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {featuredAlert.status === 'ongoing' ? 'Estimated Time Remaining' : 'Starts In'}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: featuredAlert.status === 'ongoing' ? '#f87171' : 'var(--primary)', letterSpacing: '0.04em' }}>
                  {featuredAlert.status === 'ongoing'
                    ? formatCountdown(countdownSeconds)
                    : formatCountdown(secondsUntil(featuredAlert.startTime, simulatedOffsetMinutes))}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`stitch-badge ${featuredAlert.status === 'ongoing' ? 'badge-live' : 'badge-scheduled'}`}>
                {featuredAlert.status === 'ongoing' ? 'FIELD REPAIR IN PROGRESS' : 'SCHEDULED MAINTENANCE'}
              </span>
              <div style={{ fontSize: '12px', color: 'var(--tertiary)', marginTop: '0.25rem' }}>
                Restore: {formatDateTime(featuredAlert.estimatedEndTime)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {featuredAlert.status === 'ongoing' && (
            <div>
              <div style={{ width: '100%', height: '6px', background: 'var(--surface-container-high)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${calcProgress(featuredAlert.startTime, featuredAlert.estimatedEndTime, simulatedOffsetMinutes)}%`, height: '100%', background: 'linear-gradient(90deg, rgba(248,113,113,0.6), #f87171)', borderRadius: 'var(--radius-full)', transition: 'width 1s linear' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--outline)', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                <span>Started {formatDateTime(featuredAlert.startTime)}</span>
                <span>Target {formatDateTime(featuredAlert.estimatedEndTime)}</span>
              </div>
            </div>
          )}
        </div>
      ) : !loading && (
        <div className="stitch-card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '2rem' }}>
          <CheckCircle size={32} color="var(--tertiary)" style={{ margin: '0 auto 0.5rem' }} />
          <h3 style={{ color: 'var(--tertiary)', marginBottom: '0.25rem' }}>All Systems Normal</h3>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px' }}>No active or upcoming outages for your selected area.</p>
        </div>
      )}

      {/* ── View Navigation Tabs (Alerts vs My Submissions) ────────────────── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'alerts' ? '1px solid var(--primary)' : '1px solid transparent',
            background: activeTab === 'alerts' ? 'var(--surface-container-high)' : 'transparent',
            color: activeTab === 'alerts' ? 'var(--on-surface)' : 'var(--on-surface-variant)',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-headline)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <span>Live Outage Alerts</span>
          <span style={{ background: 'var(--surface-container-highest)', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            {visibleAlerts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('my-reports')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'my-reports' ? '1px solid var(--secondary)' : '1px solid transparent',
            background: activeTab === 'my-reports' ? 'var(--surface-container-high)' : 'transparent',
            color: activeTab === 'my-reports' ? 'var(--on-surface)' : 'var(--on-surface-variant)',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: 'var(--font-headline)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <FileText size={14} />
          <span>My Submissions</span>
          {myReports.length > 0 && (
            <span style={{ background: 'rgba(0, 162, 230, 0.15)', color: 'var(--secondary)', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              {myReports.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Tab 1: Active & Upcoming Alerts List ─────────────────────────────────── */}
      {activeTab === 'alerts' && (
        <>
          <div className="stitch-card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Active & Upcoming Alerts</h2>
                <span style={{ background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  {visibleAlerts.length}
                </span>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                Loading live telemetry data...
              </div>
            ) : visibleAlerts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {visibleAlerts.map((alert) => {
                  const meta = statusMeta(alert.status);
                  return (
                    <div
                      key={alert._id}
                      style={{
                        background: 'var(--surface-container)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: alert.type === 'power' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(0, 162, 230, 0.12)', color: alert.type === 'power' ? 'var(--primary)' : 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {alert.type === 'power' ? <Zap size={20} /> : <Droplet size={20} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                            <span className={`stitch-badge ${alert.type === 'power' ? 'badge-power' : 'badge-water'}`}>
                              {alert.type === 'power' ? 'CEB POWER' : 'NWSDB WATER'}
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--on-surface-variant)' }}>{alert.area}</span>
                            <span className={`stitch-badge ${alert.status === 'ongoing' ? 'badge-live' : 'badge-scheduled'}`} style={{ color: meta.color }}>
                              {alert.status === 'ongoing' && <span className="pulse-circle" style={{ width: 5, height: 5, backgroundColor: '#f87171', display: 'inline-block', marginRight: 4 }} />}
                              {meta.label}
                            </span>
                            {alert.source === 'user' && (
                              <span style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--on-surface-variant)', fontSize: '10px', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)' }}>
                                <User size={9} style={{ display: 'inline', marginRight: 3 }} />COMMUNITY
                              </span>
                            )}
                          </div>
                          {alert.description && (
                            <p style={{ color: 'var(--on-surface-variant)', fontSize: '12px', margin: 0, maxWidth: '480px' }}>{alert.description}</p>
                          )}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '11px', color: 'var(--outline)', textTransform: 'uppercase' }}>Expected Restored</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600 }}>
                          {formatDateTime(alert.estimatedEndTime)}
                        </div>
                        {alert.status === 'ongoing' && (
                          <div style={{ fontSize: '12px', color: '#f87171', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                            {formatCountdown(secondsUntil(alert.estimatedEndTime, simulatedOffsetMinutes))} left
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', background: 'rgba(10, 14, 24, 0.4)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface-container)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <CheckCircle size={24} color="var(--tertiary)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No active outages reported{selectedArea !== 'all' ? ` for ${selectedArea}` : ''}.</h3>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', maxWidth: '420px', margin: '0 auto' }}>
                  When official cuts are published by CEB/NWSDB or community reports are verified, they will appear here.
                </p>
              </div>
            )}
          </div>

          {/* ── Resolved Alerts (Collapsible) ─────────────────────────────────── */}
          {resolvedAlerts.length > 0 && (
            <div className="stitch-card" style={{ marginBottom: '1.5rem', opacity: 0.7 }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--on-surface-variant)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="var(--tertiary)" /> Recently Resolved ({resolvedAlerts.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {resolvedAlerts.map((alert) => (
                  <div key={alert._id} style={{ background: 'var(--surface-container)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {alert.type === 'power' ? <Zap size={16} color="var(--outline)" /> : <Droplet size={16} color="var(--outline)" />}
                      <div>
                        <span style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>{alert.type === 'power' ? 'Power Cut' : 'Water Cut'} — {alert.area}</span>
                        <span className="stitch-badge" style={{ marginLeft: '0.5rem', background: 'rgba(86,229,169,0.1)', color: 'var(--tertiary)', fontSize: '10px' }}>RESOLVED</span>
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--outline)' }}>
                      Restored {formatDateTime(alert.estimatedEndTime)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Tab 2: My Submitted Reports ────────────────────────────────────────── */}
      {activeTab === 'my-reports' && (
        <div className="stitch-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', margin: 0 }}>My Submitted Reports</h2>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '12px', margin: '0.2rem 0 0' }}>
                Track the status of interruptions you reported. Verified reports are broadcast islandwide.
              </p>
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ padding: '0.5rem 0.9rem', fontSize: '12px' }}>
              <Plus size={14} />
              <span>New Report</span>
            </button>
          </div>

          {myReports.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', background: 'rgba(10, 14, 24, 0.4)', borderRadius: 'var(--radius-md)' }}>
              <FileText size={32} color="var(--outline)" style={{ margin: '0 auto 0.5rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No reports submitted yet.</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', maxWidth: '420px', margin: '0 auto 1rem' }}>
                Experiencing an unlisted power outage or water cutoff? Report it to alert authorities and your neighborhood.
              </p>
              <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '13px' }}>
                <Plus size={15} /> Submit First Report
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myReports.map((report) => (
                <div
                  key={report._id}
                  style={{
                    background: 'var(--surface-container)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.2rem',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: report.type === 'power' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(0, 162, 230, 0.12)', color: report.type === 'power' ? 'var(--primary)' : 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {report.type === 'power' ? <Zap size={20} /> : <Droplet size={20} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <span className={`stitch-badge ${report.type === 'power' ? 'badge-power' : 'badge-water'}`}>
                          {report.type === 'power' ? 'POWER CUT' : 'WATER CUT'}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--on-surface-variant)' }}>{report.area}</span>
                        {report.approved ? (
                          <span className="stitch-badge" style={{ background: 'rgba(86, 229, 169, 0.15)', color: 'var(--tertiary)' }}>
                            <CheckCircle size={10} style={{ marginRight: 3 }} /> APPROVED & BROADCAST
                          </span>
                        ) : (
                          <span className="stitch-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--primary)' }}>
                            <Clock size={10} style={{ marginRight: 3 }} /> PENDING AUTHORITY REVIEW
                          </span>
                        )}
                      </div>
                      {report.description && (
                        <p style={{ color: 'var(--on-surface-variant)', fontSize: '12px', margin: '0 0 0.35rem' }}>{report.description}</p>
                      )}
                      <div style={{ fontSize: '11px', color: 'var(--outline)', fontFamily: 'var(--font-mono)' }}>
                        Started: {formatDateTime(report.startTime)} → Expected: {formatDateTime(report.estimatedEndTime)}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span className="stitch-badge" style={{ background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)', fontSize: '10px' }}>
                      Status: {report.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 5. Report Cut Modal ──────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="stitch-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="stitch-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                <ShieldAlert size={20} />
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Report Community Interruption</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'var(--surface-container)', border: 'none', color: 'var(--on-surface-variant)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {reportSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={40} color="var(--tertiary)" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ color: 'var(--tertiary)' }}>Report Submitted Successfully</h4>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', marginTop: '0.25rem' }}>
                  Sent to authorities for verification. It will be published upon review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
                {/* Global form error */}
                {formError && (
                  <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.85rem', color: '#f87171', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertCircle size={14} /> {formError}
                  </div>
                )}

                {/* Type Picker */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
                    Interruption Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {['power', 'water'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleFormChange('type', t)}
                        style={{
                          padding: '0.65rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                          background: formData.type === t
                            ? (t === 'power' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 162, 230, 0.15)')
                            : 'var(--surface-container-high)',
                          color: formData.type === t
                            ? (t === 'power' ? 'var(--primary)' : 'var(--secondary)')
                            : 'var(--on-surface-variant)',
                          border: formData.type === t
                            ? `1px solid ${t === 'power' ? 'var(--primary)' : 'var(--secondary)'}`
                            : '1px solid transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                          fontFamily: 'var(--font-headline)', fontWeight: 600, fontSize: '13px',
                        }}
                      >
                        {t === 'power' ? <Zap size={16} /> : <Droplet size={16} />}
                        {t === 'power' ? 'Power (CEB)' : 'Water (NWSDB)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Area */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
                    Affected District / Zone
                  </label>
                  <select
                    className="stitch-select"
                    value={formData.area}
                    onChange={(e) => handleFormChange('area', e.target.value)}
                  >
                    {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                {/* Start & End Times (datetime-local for full date + time) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
                      Cut Started At *
                    </label>
                    <input
                      type="datetime-local"
                      className={`stitch-input${formValidationErrors.startTime ? ' input-error' : ''}`}
                      value={formData.startTime}
                      onChange={(e) => handleFormChange('startTime', e.target.value)}
                    />
                    <FieldErr field="startTime" />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
                      Estimated Restoration *
                    </label>
                    <input
                      type="datetime-local"
                      className={`stitch-input${formValidationErrors.estimatedEndTime ? ' input-error' : ''}`}
                      value={formData.estimatedEndTime}
                      onChange={(e) => handleFormChange('estimatedEndTime', e.target.value)}
                    />
                    <FieldErr field="estimatedEndTime" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
                    Observed Details (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="stitch-textarea"
                    placeholder="e.g., Sparks observed at junction transformer, water pressure completely dropped..."
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}
                  disabled={isSubmitting}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Submitting...' : 'Transmit Outage Report'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
