'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function ProfilePage() {
  const { user, profile, fetchProfile, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({ name: '', charityId: '', charityPercentage: 10 });
  const [charities, setCharities] = useState([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        charityId: profile.charity_id || '',
        charityPercentage: profile.charity_percentage || 10,
      });
    }
  }, [profile]);

  useEffect(() => {
    async function loadCharities() {
      const { data } = await supabase.from('charities').select('id, name').order('name');
      setCharities(data || []);
    }
    loadCharities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.charityPercentage < 10) {
      setError('Minimum charity contribution is 10%');
      return;
    }

    setSaving(true);
    const { error: updateErr } = await supabase.from('users').update({
      name: formData.name,
      charity_id: formData.charityId || null,
      charity_percentage: Math.max(10, parseInt(formData.charityPercentage)),
    }).eq('id', user.id);

    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSuccess('Profile updated successfully!');
      await fetchProfile(user.id);
    }
    setSaving(false);
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '600px' }}>
      <div className="section-header">
        <h1>👤 <span className="gradient-text">My Profile</span></h1>
        <p>Update your details and charity preferences</p>
      </div>

      <div className="glass-card" style={{ padding: '32px' }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Email (cannot be changed)</label>
            <input type="email" className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" htmlFor="profile-name">Full Name</label>
            <input
              id="profile-name"
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Subscription</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span className={`badge badge-${profile?.subscription_status || 'inactive'}`}>
                {profile?.subscription_status || 'Inactive'}
              </span>
              {profile?.subscription_type && (
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                  {profile.subscription_type} plan
                </span>
              )}
              {profile?.renewal_date && (
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                  · Renews {new Date(profile.renewal_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            marginBottom: '24px',
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#10b981', marginBottom: '16px' }}>
              💚 Charity Preferences
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="profile-charity">Selected Charity</label>
              <select
                id="profile-charity"
                className="form-input"
                value={formData.charityId}
                onChange={(e) => setFormData(prev => ({ ...prev, charityId: e.target.value }))}
                style={{ cursor: 'pointer' }}
              >
                <option value="">— No charity selected —</option>
                {charities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Contribution Percentage (min 10%)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={formData.charityPercentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, charityPercentage: e.target.value }))}
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

          <button type="submit" className="btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
