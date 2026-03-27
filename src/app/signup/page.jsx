'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    charityId: '',
    charityPercentage: 10,
  });
const [charities, setCharities] = useState([]);
  const [charitiesLoading, setCharitiesLoading] = useState(true);
  const [charitiesError, setCharitiesError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function loadCharities() {
      setCharitiesLoading(true);
      setCharitiesError('');

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const noCreds = 'Supabase environment variables are missing (NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY).';
        console.error(noCreds);
        setCharitiesError(noCreds);
        setCharitiesLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/charities');
        if (!response.ok) {
          const errorPayload = await response.json().catch(() => ({}));
          const msg = errorPayload.error || `${response.status} ${response.statusText}`;
          console.error('Error loading charities from API:', msg, errorPayload);
          setCharitiesError(msg);
          return;
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setCharities(data);
        } else {
          console.warn('Unexpected charities payload:', data);
          setCharities([]);
          setCharitiesError('Failed to load charities (invalid response shape)');
        }
      } catch (err) {
        console.error('Unexpected error loading charities:', err);
        setCharitiesError(err?.message || 'Unexpected error loading charities');
      } finally {
        setCharitiesLoading(false);
      }
    }

    loadCharities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!formData.charityId) {
      setError('Please select a charity to support');
      return;
    }
    if (formData.charityPercentage < 10) {
      setError('Minimum charity contribution is 10%');
      return;
    }

    setLoading(true);
    try {
      await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.charityId,
        parseInt(formData.charityPercentage)
      );
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
            Join <span className="gradient-text">GolfCharity</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Start your journey of giving and winning</p>
        </div>

        <div className="glass-card" style={{ padding: '36px' }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="John Smith"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="form-label" htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
                <input
                  id="signup-confirm"
                  name="confirmPassword"
                  type="password"
                  className="form-input"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Charity Selection */}
            <div style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#10b981', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                💚 Choose Your Charity
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="form-label" htmlFor="signup-charity">Select a Charity *</label>
                {charitiesError ? (
                  <div style={{
                    padding: '12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#dc2626',
                    fontSize: '0.85rem',
                    textAlign: 'center'
                  }}>
                    ⚠️ {charitiesError} <button 
                      type="button" 
                      className="text-primary hover:underline ml-1" 
                      onClick={() => window.location.reload()}
                      style={{ fontSize: '0.8rem' }}
                    >
                      Retry
                    </button>
                  </div>
                ) : charitiesLoading ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    background: 'rgba(156, 163, 175, 0.1)',
                    border: '1px solid rgba(156, 163, 175, 0.3)',
                    borderRadius: '8px',
                    color: 'var(--color-text-secondary)',
                    height: '48px'
                  }}>
                    <div className="spinner-sm" style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                    Loading charities...
                  </div>
                ) : (
                  <select
                    id="signup-charity"
                    name="charityId"
                    className="form-input"
                    value={formData.charityId}
                    onChange={handleChange}
                    required
                    disabled={charitiesLoading}
                    style={{ cursor: charitiesLoading ? 'not-allowed' : 'pointer' }}
                  >
                    <option value="">— Choose a charity —</option>
                    {charities.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="signup-percentage">
                  Contribution Percentage (min 10%)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    id="signup-percentage"
                    name="charityPercentage"
                    type="range"
                    min="10"
                    max="50"
                    value={formData.charityPercentage}
                    onChange={handleChange}
                    style={{ flex: 1, accentColor: '#10b981' }}
                  />
                  <span style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    minWidth: '48px',
                    textAlign: 'center',
                  }}>
                    {formData.charityPercentage}%
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
            >
              {loading ? 'Creating account...' : 'Create Account & Subscribe'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontWeight: '600' }}>
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
