import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Shield, User, Menu, X, LogOut, LayoutDashboard, Bell, AlertTriangle } from 'lucide-react';
import { checkHealth, getReportsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [apiOnline, setApiOnline] = useState(false);
  const [areaAlertsCount, setAreaAlertsCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const verifyApi = async () => {
      try {
        const res = await checkHealth();
        if (isMounted && res.status === 'ok') setApiOnline(true);
      } catch {
        if (isMounted) setApiOnline(false);
      }
    };

    const checkAreaAlerts = async () => {
      if (user?.area && !isAdmin) {
        try {
          const res = await getReportsApi(user.area);
          if (isMounted && res.data) {
            const active = res.data.filter((r) => r.status === 'ongoing' || r.status === 'scheduled');
            setAreaAlertsCount(active.length);
          }
        } catch {
          // ignore background check failure
        }
      }
    };

    verifyApi();
    checkAreaAlerts();
    const interval = setInterval(() => {
      verifyApi();
      checkAreaAlerts();
    }, 15000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [user?.area, isAdmin]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const dashboardPath = isAdmin ? '/admin' : '/dashboard';
  const dashboardLabel = isAdmin ? 'Admin Portal' : 'My Dashboard';

  const NavLinks = ({ onClick }) => (
    <>
      <Link
        to="/"
        onClick={onClick}
        className={`nav-pill ${location.pathname === '/' ? 'active' : ''}`}
      >
        Home
      </Link>
      {isAuthenticated && (
        <Link
          to={dashboardPath}
          onClick={onClick}
          className={`nav-pill ${location.pathname === dashboardPath ? 'active' : ''}`}
        >
          {isAdmin ? <Shield size={14} style={{ marginRight: '0.3rem' }} /> : <LayoutDashboard size={14} style={{ marginRight: '0.3rem' }} />}
          {dashboardLabel}
        </Link>
      )}
    </>
  );

  return (
    <header className="stitch-header">
      <div className="header-inner">
        {/* Left: Brand & Telemetry Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" className="brand-link">
            <div className="brand-logo-icon">
              <Zap size={18} />
            </div>
            <span>SL OutageAlert</span>
          </Link>

          <div
            className="api-telemetry-badge"
            title={apiOnline ? 'Live Grid Telemetry Synchronized' : 'Connecting to API Gateway...'}
          >
            <span
              className="pulse-circle"
              style={{ backgroundColor: apiOnline ? 'var(--tertiary)' : 'var(--primary-container)' }}
            ></span>
            <span>{apiOnline ? 'API ONLINE' : 'CONNECTING'}</span>
          </div>

          {/* In-App Resident Active Alert Indicator (Requirement #3) */}
          {!isAdmin && user?.area && areaAlertsCount > 0 && (
            <Link
              to="/dashboard"
              className="api-telemetry-badge"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                textDecoration: 'none',
              }}
              title={`Active/Upcoming Outage Alert for ${user.area}`}
            >
              <span className="pulse-circle" style={{ backgroundColor: '#f87171', boxShadow: '0 0 8px #f87171' }}></span>
              <span>{areaAlertsCount} ACTIVE ALERT{areaAlertsCount > 1 ? 'S' : ''} IN YOUR AREA</span>
            </Link>
          )}
        </div>

        {/* Center: Desktop Navigation Pills */}
        <nav className="nav-pill-group">
          <NavLinks />
        </nav>

        {/* Right: Auth Actions & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            /* Logged-in user pill + logout button */
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {/* Resident Notification Bell with Count */}
              {!isAdmin && (
                <Link
                  to="/dashboard"
                  title={areaAlertsCount > 0 ? `${areaAlertsCount} active cut(s) in your area` : 'No active cuts in your area'}
                  style={{
                    position: 'relative',
                    background: 'var(--surface-container)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.35rem 0.55rem',
                    color: areaAlertsCount > 0 ? '#f87171' : 'var(--on-surface-variant)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bell size={15} />
                  {areaAlertsCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#ef4444',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 6px #ef4444',
                      }}
                    >
                      {areaAlertsCount}
                    </span>
                  )}
                </Link>
              )}
              {/* User/Admin badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'var(--surface-container)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.35rem 0.75rem',
                  fontSize: '12px',
                  color: isAdmin ? 'var(--primary)' : 'var(--secondary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {isAdmin ? <Shield size={13} /> : <User size={13} />}
                <span>{user?.username}</span>
                {isAdmin && (
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: 'var(--primary)',
                      fontSize: '10px',
                      padding: '0.1rem 0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Admin
                  </span>
                )}
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                title="Sign Out"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'var(--surface-container)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.35rem 0.7rem',
                  color: 'var(--on-surface-variant)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'color 180ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--on-surface-variant)')}
              >
                <LogOut size={14} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Not logged in — show Sign In button */
            <Link
              to="/login"
              className="btn-primary"
              style={{ padding: '0.45rem 1rem', fontSize: '13px', borderRadius: 'var(--radius-md)' }}
            >
              <span>Sign In / Register</span>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={13} />
              </div>
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--on-surface)',
              cursor: 'pointer',
              display: 'flex',
              padding: '0.25rem',
            }}
            className="mobile-nav-toggle"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Slideout Nav */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--surface-container-low)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <NavLinks onClick={() => setMobileMenuOpen(false)} />
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: '#f87171',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '14px',
                padding: '0.35rem 0',
                fontFamily: 'var(--font-headline)',
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
