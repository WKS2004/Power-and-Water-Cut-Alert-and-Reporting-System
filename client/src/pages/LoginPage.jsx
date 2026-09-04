import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, User, Lock, Mail, MapPin, Home, Eye, EyeOff, ArrowRight, CheckCircle2, Unlock, AlertCircle } from 'lucide-react';
import { AREAS } from '../constants/areas';
import { loginApi, registerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * LoginPage — Handles both Sign In and Register Household flows.
 * @param {boolean} defaultRegister — If true, opens the Register tab by default (used by /register route)
 */
export default function LoginPage({ defaultRegister = false }) {
  const [isRegister, setIsRegister] = useState(defaultRegister);
  const [showPassword, setShowPassword] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // After login, go back to the page the user originally tried to visit
  const redirectTo = location.state?.from?.pathname || null;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    area: AREAS[0],
    address: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field-level error when user starts typing
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    }
  };

  /** Client-side validation — returns error map or empty object if valid */
  const validate = () => {
    const errs = {};
    if (!formData.username.trim() || formData.username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters.';
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (isRegister) {
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errs.email = 'Please enter a valid email address.';
      }
      if (!formData.area || !AREAS.includes(formData.area)) {
        errs.area = 'Please select your monitoring area.';
      }
      if (!formData.address.trim() || formData.address.trim().length < 5) {
        errs.address = 'Please enter your full street address (at least 5 characters).';
      }
    }
    return errs;
  };

  const fillQuickCredentials = (user, pass) => {
    setFormData({ ...formData, username: user, password: pass });
    setFeedbackMessage(`Autofilled credentials for: ${user}`);
    setIsSuccess(true);
    setValidationErrors({});
    setTimeout(() => setFeedbackMessage(''), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessage('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      setIsSuccess(false);
      setFeedbackMessage('Please fix the errors below before continuing.');
      return;
    }

    setIsLoading(true);
    setValidationErrors({});

    try {
      if (isRegister) {
        const res = await registerApi({
          username: formData.username.trim(),
          password: formData.password,
          email: formData.email.trim(),
          area: formData.area,
          address: formData.address.trim(),
        });
        // Auto-login after registration
        if (res.token) {
          login(res.token, res.user);
        }
        setIsSuccess(true);
        setFeedbackMessage('Household registered! Redirecting to your dashboard...');
        setTimeout(() => navigate(redirectTo || '/dashboard'), 1200);
      } else {
        const res = await loginApi({ username: formData.username.trim(), password: formData.password });
        if (res.token) {
          login(res.token, res.user);
          setIsSuccess(true);
          setFeedbackMessage('Authentication verified. Access granted.');
          setTimeout(() => {
            navigate(redirectTo || (res.user?.role === 'admin' ? '/admin' : '/dashboard'));
          }, 700);
        }
      }
    } catch (err) {
      setIsSuccess(false);
      setIsLoading(false);
      // Show the server's friendly message if available
      setFeedbackMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const FieldError = ({ field }) =>
    validationErrors[field] ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.3rem', color: '#f87171', fontSize: '11px' }}>
        <AlertCircle size={12} />
        <span>{validationErrors[field]}</span>
      </div>
    ) : null;

  return (
    <div style={{ maxWidth: '460px', margin: '1rem auto 3rem' }}>
      <div className="stitch-card" style={{ padding: '2rem 1.75rem' }}>
        {/* Toggle Mode Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'var(--surface-container-lowest)',
            padding: '0.3rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
          }}
        >
          <button
            type="button"
            onClick={() => { setIsRegister(false); setValidationErrors({}); setFeedbackMessage(''); }}
            style={{
              flex: 1, padding: '0.5rem', border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: !isRegister ? 'var(--surface-container-high)' : 'transparent',
              color: !isRegister ? 'var(--primary)' : 'var(--on-surface-variant)',
              fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 180ms ease',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setValidationErrors({}); setFeedbackMessage(''); }}
            style={{
              flex: 1, padding: '0.5rem', border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: isRegister ? 'var(--surface-container-high)' : 'transparent',
              color: isRegister ? 'var(--primary)' : 'var(--on-surface-variant)',
              fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 180ms ease',
            }}
          >
            Register Household
          </button>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>
            {isRegister ? 'Register Household' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px' }}>
            {isRegister
              ? 'Enroll your premises for targeted civic telemetry alerts'
              : 'Sign in to access your local alert dashboard'}
          </p>
        </div>

        {/* Global Feedback Alert */}
        {feedbackMessage && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: isSuccess ? 'rgba(86, 229, 169, 0.12)' : 'rgba(239, 68, 68, 0.15)',
              border: isSuccess ? '1px solid rgba(86, 229, 169, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              color: isSuccess ? 'var(--tertiary)' : '#f87171',
              fontSize: '12px', fontFamily: 'var(--font-mono)',
              marginBottom: '1.25rem', textAlign: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            }}
          >
            {isSuccess ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {feedbackMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
          {/* Username */}
          <div>
            <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
              Username
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={16} style={{ position: 'absolute', left: 12, color: 'var(--outline)' }} />
              <input
                type="text"
                name="username"
                id="username"
                className={`stitch-input${validationErrors.username ? ' input-error' : ''}`}
                style={{ paddingLeft: '2.5rem' }}
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. kasun_perera"
                required
                autoComplete="username"
              />
            </div>
            <FieldError field="username" />
          </div>

          {/* Email (Registration Only) */}
          {isRegister && (
            <div>
              <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, color: 'var(--outline)' }} />
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`stitch-input${validationErrors.email ? ' input-error' : ''}`}
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="kasun@example.lk"
                  required={isRegister}
                  autoComplete="email"
                />
              </div>
              <FieldError field="email" />
            </div>
          )}

          {/* Area & Address (Registration Only) */}
          {isRegister && (
            <>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
                  Target Monitoring Zone / Area
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: 12, color: 'var(--outline)' }} />
                  <select
                    name="area"
                    id="area"
                    className={`stitch-select${validationErrors.area ? ' input-error' : ''}`}
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.area}
                    onChange={handleChange}
                    required={isRegister}
                  >
                    {AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <FieldError field="area" />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
                  Street Address & Premise No.
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Home size={16} style={{ position: 'absolute', left: 12, color: 'var(--outline)' }} />
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className={`stitch-input${validationErrors.address ? ' input-error' : ''}`}
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. 42/1 Galle Road, Colombo 03"
                    required={isRegister}
                    autoComplete="street-address"
                  />
                </div>
                <FieldError field="address" />
              </div>
            </>
          )}

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Password
              </label>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, color: 'var(--outline)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                className={`stitch-input${validationErrors.password ? ' input-error' : ''}`}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: 'var(--outline)', cursor: 'pointer', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <FieldError field="password" />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', opacity: isLoading ? 0.7 : 1 }}
            disabled={isLoading}
          >
            <span>{isLoading ? 'Please wait...' : isRegister ? 'Complete Household Registration' : 'Sign In'}</span>
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Switch mode link */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '13px', color: 'var(--on-surface-variant)' }}>
          {isRegister ? 'Already registered?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setValidationErrors({}); setFeedbackMessage(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', marginLeft: '0.25rem' }}
          >
            {isRegister ? 'Sign in here' : 'Register here'}
          </button>
        </div>

        {/* Evaluator Quick Credentials Box */}
        <div
          style={{
            marginTop: '1.75rem', padding: '1rem',
            background: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--tertiary)', fontSize: '11px', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
            <Unlock size={12} />
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Evaluator Quick Credentials</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            <button type="button" onClick={() => fillQuickCredentials('admin', 'admin123')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>
              Admin (admin/admin123)
            </button>
            <span style={{ color: 'var(--outline)' }}>•</span>
            <button type="button" onClick={() => fillQuickCredentials('colombo3', 'user123')}
              style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', textDecoration: 'underline' }}>
              Citizen (colombo3/user123)
            </button>
          </div>
        </div>

        {/* Live Grid Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem', color: 'var(--tertiary)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
          <span className="pulse-circle"></span>
          <span>Grid Live Telemetry Active (CEB / NWSDB)</span>
        </div>
      </div>
    </div>
  );
}
