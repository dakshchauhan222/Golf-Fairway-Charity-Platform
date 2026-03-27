'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function AdminWinnersPage() {
  const { supabase, loading: authLoading } = useAuth();
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const loadWinners = async () => {
    let query = supabase
      .from('winners')
      .select('*, users(name, email), draws(month, draw_numbers)')
      .order('created_at', { ascending: false });

    if (filter !== 'all') query = query.eq('payment_status', filter);

    const { data } = await query;
    setWinners(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) loadWinners();
  }, [authLoading, filter]);

  const handleStatusUpdate = async (winnerId, newStatus) => {
    await supabase.from('winners').update({ payment_status: newStatus }).eq('id', winnerId);
    await loadWinners();
  };

  const handleReject = async (winnerId) => {
    if (!confirm('Are you sure you want to reject this winner? This will remove their win record.')) return;
    await supabase.from('winners').delete().eq('id', winnerId);
    await loadWinners();
  };

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-header">
        <h1>🏆 <span className="gradient-text">Winners Management</span></h1>
        <p>Review proofs, approve winners, and manage payouts</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'paid'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: filter === f ? 'var(--color-primary)' : 'var(--color-border)',
              background: filter === f ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: filter === f ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {winners.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>No winners found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {winners.map((winner) => (
            <div key={winner.id} className="glass-card" style={{ padding: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto',
                gap: '20px',
                alignItems: 'center',
              }}>
                {/* Winner Info */}
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>{winner.users?.name}</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{winner.users?.email}</div>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      fontWeight: '800',
                      color: winner.match_type === 5 ? 'var(--color-accent)' : 'var(--color-primary-light)',
                    }}>
                      {winner.match_type}-Match
                    </span>
                    {winner.match_type === 5 && <span>💎</span>}
                  </div>
                </div>

                {/* Draw & Prize Info */}
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    Draw: {winner.draws?.month}
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-accent)', marginTop: '4px' }}>
                    £{parseFloat(winner.prize_amount).toFixed(2)}
                  </div>
                  <span className={`badge badge-${winner.payment_status}`} style={{ marginTop: '4px' }}>
                    {winner.payment_status}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {winner.proof_url && (
                    <a
                      href={winner.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none' }}
                    >
                      📄 View Proof
                    </a>
                  )}
                  {winner.payment_status === 'pending' && (
                    <>
                      <button className="btn-success" onClick={() => handleStatusUpdate(winner.id, 'approved')}>
                        ✅ Approve
                      </button>
                      <button className="btn-danger" onClick={() => handleReject(winner.id)}>
                        ❌ Reject
                      </button>
                    </>
                  )}
                  {winner.payment_status === 'approved' && (
                    <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleStatusUpdate(winner.id, 'paid')}>
                      💰 Mark Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
