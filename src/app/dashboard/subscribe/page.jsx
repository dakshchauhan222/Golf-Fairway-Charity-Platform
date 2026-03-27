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
    <div className="page-container" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '28px',
        marginBottom: '32px',
        alignItems: 'start',
      }}>
        {Object.entries(plans).map(([key, plan]) => (
          <div
            key={key}
            onClick={() => setSelectedPlan(key)}
            className="glass-card"
            style={{
              padding: '34px 30px',
              cursor: 'pointer',
              borderColor: selectedPlan === key ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)',
              background: selectedPlan === key ? 'rgba(99, 102, 241, 0.1)' : 'rgba(15, 15, 15, 0.74)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '24px',
              boxShadow: selectedPlan === key ? '0 25px 60px rgba(232,255,0,0.28)' : '0 18px 40px rgba(0,0,0,0.4)',
              position: 'relative',
              textAlign: 'center',
              minHeight: '640px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
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
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '10px', letterSpacing: '0.04em' }}>{plan.label}</h3>
            <div style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '6px', lineHeight: 1 }}>
              <span className="gradient-text">£{plan.price}</span>
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '18px' }}>
              {plan.period} • {plan.days} days access
            </div>
            <div style={{ color: 'rgba(232, 255, 0, 0.95)', fontSize: '0.90rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
              {plan.save ? `SAVE ${plan.save}` : 'Flex billing'}
            </div>
            <ul style={{ textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.95rem', listStyle: 'none', padding: 0, flexGrow: 1 }}>
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
        style={{ width: '100%', justifyContent: 'center', padding: '18px', fontSize: '1.15rem', borderRadius: '14px' }}
      >
        {processing ? 'Processing...' : `Subscribe — £${plans[selectedPlan].price}${plans[selectedPlan].period}`}
      </button>

      <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
        20% goes to the prize pool · Minimum 10% to your chosen charity
      </p>
    </div>
  );
}
