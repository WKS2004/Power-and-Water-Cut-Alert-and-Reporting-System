import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { AREAS } from '../constants/areas';

/**
 * Register Page Skeleton
 * Ownership: Member 3 (Frontend UI)
 */
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    area: AREAS[0],
    address: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Note for Member 3:
    // Invoke registerApi(formData) from ../services/api
    // Handle inline validation messages and redirect to login/dashboard
    setError('Registration workflow scaffolded. Ready for Member 3 implementation.');
  };

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--water-cyan)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <UserPlus size={22} />
          </div>
          <h2>Create Citizen Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Get personalized outage alerts for your residential area
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-username">
              Username *
            </label>
            <input
              id="register-username"
              name="username"
              type="text"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. kasun_perera"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Email Address *
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. kasun@example.lk"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              Password *
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-area">
              Residential Area *
            </label>
            <select
              id="register-area"
              name="area"
              className="form-select"
              value={formData.area}
              onChange={handleChange}
              required
            >
              {AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-address">
              Full Residential Address * (For Outage Verification)
            </label>
            <textarea
              id="register-address"
              name="address"
              rows={2}
              className="form-textarea"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. No. 45/2, Galle Road, Colombo 03"
              required
            />
          </div>

          <button type="submit" className="btn btn-water" style={{ width: '100%', marginTop: '0.5rem' }}>
            Complete Registration
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--water-cyan)', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
