import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Droplet, Activity, Shield, User } from 'lucide-react';
import { checkHealth } from '../services/api';

export default function Navbar() {
  const [apiOnline, setApiOnline] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const verifyApi = async () => {
      try {
        const res = await checkHealth();
        if (isMounted && res.status === 'ok') {
          setApiOnline(true);
        }
      } catch {
        if (isMounted) setApiOnline(false);
      }
    };

    verifyApi();
    const interval = setInterval(verifyApi, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">
          <div className="brand-icon-wrapper">
            <Zap size={20} />
          </div>
          <span>SL OutageAlert</span>
        </Link>

        <div className="nav-links">
          <div
            className="health-badge"
            title={apiOnline ? 'Backend API connected' : 'Connecting to Backend API...'}
          >
            <span className="pulse-dot" style={{ backgroundColor: apiOnline ? '#10b981' : '#f59e0b' }}></span>
            <span>{apiOnline ? 'API Online' : 'Connecting'}</span>
          </div>

          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <User size={15} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
            Dashboard
          </Link>
          <Link
            to="/admin"
            className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            <Shield size={15} style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }} />
            Admin
          </Link>
          <Link
            to="/login"
            className={`btn btn-outline ${location.pathname === '/login' ? 'active' : ''}`}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
