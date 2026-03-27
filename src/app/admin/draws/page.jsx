'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { generateDrawNumbers, findWinners, formatDrawMonth } from '@/lib/drawEngine';
import { distributePool, calculateWinnerPrize } from '@/lib/prizePool';

export default function AdminDrawsPage() {
  const { supabase, loading: authLoading } = useAuth();
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulation, setSimulation] = useState(null);
  const [publishing, setPublishing] = useState(false);

  const loadDraws = async () => {
    const { data } = await supabase.from('draws').select('*, prize_pool(*)').order('created_at', { ascending: false });
    setDraws(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) loadDraws();
  }, [authLoading]);

  const handleSimulate = async () => {
    const drawNumbers = generateDrawNumbers();

    // Get all active users with scores
    const { data: activeUsers } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('subscription_status', 'active');

    const usersWithScores = [];
    for (const user of (activeUsers || [])) {
      const { data: scores } = await supabase
        .from('scores')
        .select('score')
        .eq('user_id', user.id);
      usersWithScores.push({ ...user, scores: scores || [] });
    }

    const winners = findWinners(drawNumbers, usersWithScores);

    // Calculate pool
    const activeCount = activeUsers?.length || 0;
    const monthlyContrib = activeCount * 9.99 * 0.20; // simplified
    
    // Check for jackpot rollover
    const { data: lastPublished } = await supabase
      .from('draws')
      .select('id, prize_pool(*)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1);

    let carryover = 0;
    if (lastPublished && lastPublished.length > 0) {
      const lastPool = lastPublished[0].prize_pool?.[0];
      if (lastPool) {
        // Check if there were no 5-match winners in the last draw
        const { data: lastWinners } = await supabase
          .from('winners')
          .select('match_type')
          .eq('draw_id', lastPublished[0].id)
          .eq('match_type', 5);
        if (!lastWinners || lastWinners.length === 0) {
          carryover = parseFloat(lastPool.jackpot_pool) || 0;
        }
      }
    }

    const pool = distributePool(monthlyContrib, carryover);

    setSimulation({
      drawNumbers,
      winners,
      pool,
      totalPool: monthlyContrib,
      carryover,
      activeUsers: activeCount,
    });
  };

  const handlePublish = async () => {
    if (!simulation) return;
    setPublishing(true);

    const month = formatDrawMonth();

    // Insert draw
    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .insert({
        draw_numbers: simulation.drawNumbers,
        month,
        status: 'published',
        jackpot_carried_over: simulation.carryover > 0,
      })
      .select()
      .single();

    if (drawError) {
      alert('Error publishing draw: ' + drawError.message);
      setPublishing(false);
      return;
    }

    // Insert prize pool
    await supabase.from('prize_pool').insert({
      draw_id: draw.id,
      total_pool: simulation.totalPool,
      jackpot_pool: simulation.pool.jackpotPool,
      four_match_pool: simulation.pool.fourMatchPool,
      three_match_pool: simulation.pool.threeMatchPool,
    });

    // Insert winners
    for (const tier of [5, 4, 3]) {
      const tierWinners = simulation.winners[tier];
      if (tierWinners.length > 0) {
        const poolForTier = tier === 5 ? simulation.pool.jackpotPool :
                           tier === 4 ? simulation.pool.fourMatchPool :
                           simulation.pool.threeMatchPool;
        const prizePerWinner = calculateWinnerPrize(poolForTier, tierWinners.length);

        for (const winner of tierWinners) {
          await supabase.from('winners').insert({
            user_id: winner.userId,
            draw_id: draw.id,
            match_type: tier,
            prize_amount: prizePerWinner,
            payment_status: 'pending',
          });
        }
      }
    }

    setSimulation(null);
    setPublishing(false);
    await loadDraws();
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>🎰 <span className="gradient-text">Draw Management</span></h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Simulate and publish monthly draws</p>
        </div>
        <button className="btn-primary" onClick={handleSimulate}>
          🎲 Simulate Draw
        </button>
      </div>

      {/* Simulation Preview */}
      {simulation && (
        <div className="glass-card" style={{ padding: '32px', marginBottom: '32px', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-accent)' }}>⚡ Simulation Preview</h2>
            <span className="badge badge-pending">Not Published</span>
          </div>

          {/* Draw Numbers */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>Draw Numbers:</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {simulation.drawNumbers.map((num, i) => (
                <div key={i} style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1.1rem',
                }}>
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Pool Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}>
            <div className="stat-card" style={{ padding: '16px' }}>
              <div className="stat-label">Active Users</div>
              <div className="stat-value" style={{ fontSize: '1.2rem' }}>{simulation.activeUsers}</div>
            </div>
            <div className="stat-card" style={{ padding: '16px' }}>
              <div className="stat-label">Pool Total</div>
              <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--color-accent)' }}>£{simulation.totalPool.toFixed(2)}</div>
            </div>
            <div className="stat-card" style={{ padding: '16px' }}>
              <div className="stat-label">Jackpot (40%)</div>
              <div className="stat-value" style={{ fontSize: '1.2rem' }}>£{simulation.pool.jackpotPool.toFixed(2)}</div>
            </div>
            {simulation.carryover > 0 && (
              <div className="stat-card" style={{ padding: '16px' }}>
                <div className="stat-label">Rollover</div>
                <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--color-danger)' }}>+£{simulation.carryover.toFixed(2)}</div>
              </div>
            )}
          </div>

          {/* Winners */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>Winners:</h3>
            {[5, 4, 3].map(tier => (
              <div key={tier} style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: tier === 5 ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>
                  {tier}-Match ({tier === 5 ? 'Jackpot' : tier === 4 ? '35% pool' : '25% pool'}): {simulation.winners[tier].length} winner(s)
                </div>
                {simulation.winners[tier].map((w, i) => (
                  <div key={i} style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    • {w.userName} ({w.email}) — matched: [{w.matchedScores.join(', ')}]
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={handlePublish} disabled={publishing}>
              {publishing ? 'Publishing...' : '✅ Publish Official Draw'}
            </button>
            <button className="btn-secondary" onClick={() => setSimulation(null)}>
              Discard
            </button>
            <button className="btn-secondary" onClick={handleSimulate}>
              🎲 Re-simulate
            </button>
          </div>
        </div>
      )}

      {/* Draw History */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>📋 Draw History</h2>
      {draws.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>No draws yet. Simulate your first draw above!</p>
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
                  <div style={{ fontWeight: '700', marginBottom: '8px' }}>{draw.month}</div>
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
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${draw.status === 'published' ? 'active' : 'pending'}`}>
                    {draw.status}
                  </span>
                  {draw.jackpot_carried_over && (
                    <div style={{ marginTop: '4px' }}>
                      <span className="badge badge-pending" style={{ fontSize: '0.65rem' }}>Rollover</span>
                    </div>
                  )}
                  {draw.prize_pool?.[0] && (
                    <div style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      Pool: £{parseFloat(draw.prize_pool[0].total_pool).toFixed(2)}
                    </div>
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
