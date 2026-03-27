'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function DrawsPage() {
  const { user, supabase, loading: authLoading } = useAuth();
  const [draws, setDraws] = useState([]);
  const [myWins, setMyWins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const [drawsRes, winsRes] = await Promise.all([
        supabase.from('draws').select('*').eq('status', 'published').order('created_at', { ascending: false }),
        supabase.from('winners').select('*, draws(draw_numbers, month)').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      setDraws(drawsRes.data || []);
      setMyWins(winsRes.data || []);
      setLoading(false);
    }
    if (!authLoading) load();
  }, [user, authLoading]);

  const handleProofUpload = async (winnerId, file) => {
    if (!file) return;
    const ext = file.name.split('.').pop();
    const filePath = `proofs/${winnerId}.${ext}`;
    
    const { error: uploadError } = await supabase.storage
      .from('proofs')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('proofs').getPublicUrl(filePath);

    await supabase.from('winners')
      .update({ proof_url: publicUrl })
      .eq('id', winnerId);

    setShowUpload(null);
    alert('Proof uploaded successfully!');
    // Refresh
    const { data } = await supabase.from('winners')
      .select('*, draws(draw_numbers, month)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setMyWins(data || []);
  };

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <div className="section-header">
        <h1>🎰 <span className="gradient-text">Draws & Results</span></h1>
        <p>View monthly draw results and your winnings</p>
      </div>

      {/* My Wins Section */}
      {myWins.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>🏆 My Wins</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myWins.map((win) => (
              <div key={win.id} className="glass-card" style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: win.match_type === 5 ? 'var(--color-accent)' : 'var(--color-primary-light)',
                      }}>
                        {win.match_type}-Match
                      </span>
                      {win.match_type === 5 && <span>💎 JACKPOT</span>}
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                      Draw: {win.draws?.month} | Numbers: {win.draws?.draw_numbers?.join(', ')}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-accent)' }}>
                      £{parseFloat(win.prize_amount).toFixed(2)}
                    </div>
                    <span className={`badge badge-${win.payment_status}`}>
                      {win.payment_status}
                    </span>
                  </div>
                </div>

                {/* Proof Upload */}
                {win.payment_status === 'pending' && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                    {!win.proof_url ? (
                      <>
                        {showUpload === win.id ? (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleProofUpload(win.id, e.target.files[0])}
                              className="form-input"
                              style={{ maxWidth: '300px' }}
                            />
                            <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => setShowUpload(null)}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }} onClick={() => setShowUpload(win.id)}>
                            📤 Upload Score Proof
                          </button>
                        )}
                      </>
                    ) : (
                      <div style={{ color: 'var(--color-success)', fontSize: '0.85rem' }}>
                        ✅ Proof uploaded — awaiting admin review
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Draw History */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>📋 Draw History</h2>
      {draws.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎰</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>No Draws Yet</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>Draws happen monthly. Stay tuned!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {draws.map((draw) => (
            <div key={draw.id} className="glass-card" style={{ padding: '20px 24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '6px' }}>{draw.month}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {draw.draw_numbers?.map((num, i) => (
                      <div key={i} style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                      }}>
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {draw.jackpot_carried_over && (
                    <span className="badge badge-pending">Jackpot Rollover</span>
                  )}
                  <span className="badge badge-active">Published</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
