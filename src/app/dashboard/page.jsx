'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, profile, supabase, loading: authLoading } = useAuth();
  const [scores, setScores] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    async function loadData() {
      if (!user) return;
      const [scoresRes, winnersRes] = await Promise.all([
        supabase.from('scores').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(5),
        supabase.from('winners').select('*, draws(draw_numbers, month)').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      setScores(scoresRes.data || []);
      setWinners(winnersRes.data || []);
      setLoading(false);
    }

    loadData();
  }, [user, authLoading, router, supabase]);

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const totalWinnings = winners.reduce((sum, w) => sum + (parseFloat(w.prize_amount) || 0), 0);

  return (
    <div className="page-container">
      <div className="section-header">
        <h1>Welcome back, <span className="gradient-text">{profile?.name || 'Player'}</span></h1>
        <p>Your golf charity dashboard at a glance</p>
      </div>

      {/* Subscription Alert */}
      {profile?.subscription_status !== 'active' && (
        <div className="alert alert-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span>🔒 Your subscription is <strong>{profile?.subscription_status || 'inactive'}</strong>. Subscribe to access all features!</span>
          <Link href="/dashboard/subscribe" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Subscribe Now
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '36px',
      }}>
        <div className="stat-card">
          <div className="stat-label">Subscription Status</div>
          <div style={{ marginTop: '8px' }}>
            <span className={`badge badge-${profile?.subscription_status || 'inactive'}`}>
              {profile?.subscription_status || 'Inactive'}
            </span>
          </div>
          {profile?.renewal_date && (
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Renews: {new Date(profile.renewal_date).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="stat-label">Selected Charity</div>
          <div className="stat-value" style={{ fontSize: '1.2rem', color: '#10b981' }}>
            {profile?.charities?.name || 'None'}
          </div>
          <div style={{ marginTop: '4px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Contributing {profile?.charity_percentage || 10}%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Scores Recorded</div>
          <div className="stat-value gradient-text">{scores.length}</div>
          <div style={{ marginTop: '4px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            of 5 max stored
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Winnings</div>
          <div className="stat-value" style={{ color: 'var(--color-accent)' }}>
            £{totalWinnings.toFixed(2)}
          </div>
          <div style={{ marginTop: '4px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            {winners.length} win{winners.length !== 1 ? 's' : ''} total
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Recent Scores */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>🎯 Last 5 Scores</h2>
            <Link href="/dashboard/scores" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
              Manage →
            </Link>
          </div>
          {scores.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>No scores yet. Add your first score!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scores.map((s) => (
                <div key={s.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid var(--color-border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'var(--gradient-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '1rem',
                    }}>
                      {s.score}
                    </div>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                      Stableford Points
                    </span>
                  </div>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                    {new Date(s.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Winnings Overview */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>🏆 Winnings</h2>
            <Link href="/dashboard/draws" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
              View Draws →
            </Link>
          </div>
          {winners.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>No winnings yet. Keep playing!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {winners.slice(0, 5).map((w) => (
                <div key={w.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid var(--color-border)',
                }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                      {w.match_type}-Match Winner
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                      {w.draws?.month}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', color: 'var(--color-accent)' }}>
                      £{parseFloat(w.prize_amount).toFixed(2)}
                    </div>
                    <span className={`badge badge-${w.payment_status}`} style={{ fontSize: '0.65rem' }}>
                      {w.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginTop: '32px',
      }}>
        {[
          { href: '/dashboard/scores', icon: '⛳', label: 'Manage Scores', color: '#6366f1' },
          { href: '/dashboard/draws', icon: '🎰', label: 'View Draws', color: '#06b6d4' },
          { href: '/dashboard/profile', icon: '👤', label: 'Edit Profile', color: '#10b981' },
          ...(profile?.subscription_status !== 'active'
            ? [{ href: '/dashboard/subscribe', icon: '💳', label: 'Subscribe', color: '#f59e0b' }]
            : [{ href: '/charities', icon: '💚', label: 'Charities', color: '#f59e0b' }]
          ),
        ].map((action) => (
          <Link key={action.href} href={action.href} style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{action.icon}</div>
              <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                {action.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
