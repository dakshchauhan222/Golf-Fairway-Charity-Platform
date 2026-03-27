'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubscribePage() {
  const { user, profile, supabase, fetchProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const plans = {
    monthly: { price: 9.99, label: 'Monthly', period: '/month', days: 30 },
    yearly: { price: 99.99, label: 'Yearly', period: '/year', days: 365, save: '17%' },
  };

  const handleSubscribe = async () => {
    setProcessing(true);
    setError('');

    const plan = plans[selectedPlan];
    const now = new Date();
    const renewal = new Date(now.getTime() + plan.days * 24 * 60 * 60 * 1000);

    const { error: updateError } = await supabase.from('users').update({
      subscription_status: 'active',
      subscription_type: selectedPlan,
      subscription_start: now.toISOString(),
      renewal_date: renewal.toISOString(),
    }).eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      setProcessing(false);
      return;
    }

    await fetchProfile(user.id);
    router.push('/dashboard');
  };

  return (
    <div className="page-container" style={{ maxWidth: '700px' }}>
      <div className="section-header" style={{ textAlign: 'center' }}>
        <h1>Choose Your <span className="gradient-text">Plan</span></h1>
        <p>Subscribe to enter monthly draws and support charity</p>
      </div>

      {profile?.subscription_status === 'active' && (
        <div className="alert alert-success" style={{ textAlign: 'center' }}>
          ✅ You already have an active {profile.subscription_type} subscription! Renews {new Date(profile.renewal_date).toLocaleDateString()}.
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {Object.entries(plans).map(([key, plan]) => (
          <div
            key={key}
            onClick={() => setSelectedPlan(key)}
            className="glass-card"
            style={{
              padding: '32px',
              cursor: 'pointer',
              borderColor: selectedPlan === key ? 'var(--color-primary)' : undefined,
              background: selectedPlan === key ? 'rgba(99, 102, 241, 0.08)' : undefined,
              position: 'relative',
              textAlign: 'center',
            }}
          >
            {plan.save && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '16px',
                background: 'var(--gradient-accent)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700',
              }}>
                Save {plan.save}
              </div>
            )}
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>{plan.label}</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '4px' }}>
              <span className="gradient-text">£{plan.price}</span>
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              {plan.period}
            </div>
            <ul style={{ textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.85rem', listStyle: 'none', padding: 0 }}>
              {[
                'Monthly prize draw entry',
                'Track up to 5 scores',
                'Charity contributions',
                'Winner verification',
                key === 'yearly' ? 'Best value!' : 'Cancel anytime',
              ].map((feature, i) => (
                <li key={i} style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--color-success)' }}>✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button
        className="btn-primary"
        onClick={handleSubscribe}
        disabled={processing || profile?.subscription_status === 'active'}
        style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.05rem' }}
      >
        {processing ? 'Processing...' : `Subscribe — £${plans[selectedPlan].price}${plans[selectedPlan].period}`}
      </button>

      <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
        20% goes to the prize pool · Minimum 10% to your chosen charity
      </p>
    </div>
  );
}
