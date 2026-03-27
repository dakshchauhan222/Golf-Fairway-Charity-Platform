'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function AdminReportsPage() {
  const { supabase, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [
        usersRes,
        activeRes,
        lapsedRes,
        charitiesRes,
        drawsRes,
        poolRes,
        winnersRes,
        scoresRes,
      ] = await Promise.all([
        supabase.from('users').select('id, subscription_type, charity_percentage', { count: 'exact' }),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('subscription_status', 'active'),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('subscription_status', 'lapsed'),
        supabase.from('charities').select('id', { count: 'exact', head: true }),
        supabase.from('draws').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('prize_pool').select('total_pool, jackpot_pool, four_match_pool, three_match_pool'),
        supabase.from('winners').select('prize_amount, payment_status, match_type'),
        supabase.from('scores').select('id', { count: 'exact', head: true }),
      ]);

      const totalPoolValue = (poolRes.data || []).reduce((s, p) => s + parseFloat(p.total_pool || 0), 0);
      const totalJackpot = (poolRes.data || []).reduce((s, p) => s + parseFloat(p.jackpot_pool || 0), 0);
      const totalPaid = (winnersRes.data || []).filter(w => w.payment_status === 'paid').reduce((s, w) => s + parseFloat(w.prize_amount || 0), 0);
      const totalPending = (winnersRes.data || []).filter(w => w.payment_status !== 'paid').reduce((s, w) => s + parseFloat(w.prize_amount || 0), 0);

      // Charity contribution estimate
      const users = usersRes.data || [];
      let charityTotal = 0;
      users.forEach(u => {
        if (u.subscription_type === 'monthly') charityTotal += 9.99 * (u.charity_percentage || 10) / 100;
        else if (u.subscription_type === 'yearly') charityTotal += 99.99 * (u.charity_percentage || 10) / 100;
      });

      setStats({
        totalUsers: usersRes.count || 0,
        activeSubscribers: activeRes.count || 0,
        lapsedUsers: lapsedRes.count || 0,
        totalCharities: charitiesRes.count || 0,
        totalDraws: drawsRes.count || 0,
        totalPoolValue,
        totalJackpot,
        totalPaid,
        totalPending,
        charityTotal,
        totalScores: scoresRes.count || 0,
        totalWinners: (winnersRes.data || []).length,
        fiveMatchWins: (winnersRes.data || []).filter(w => w.match_type === 5).length,
        fourMatchWins: (winnersRes.data || []).filter(w => w.match_type === 4).length,
        threeMatchWins: (winnersRes.data || []).filter(w => w.match_type === 3).length,
      });
      setLoading(false);
    }
    if (!authLoading) loadStats();
  }, [authLoading]);

  if (authLoading || loading || !stats) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const sections = [
    {
      title: '👥 User Statistics',
      items: [
        { label: 'Total Users', value: stats.totalUsers, color: '#6366f1' },
        { label: 'Active Subscribers', value: stats.activeSubscribers, color: '#10b981' },
        { label: 'Lapsed Users', value: stats.lapsedUsers, color: '#ef4444' },
        { label: 'Total Scores Recorded', value: stats.totalScores, color: '#06b6d4' },
      ],
    },
    {
      title: '💰 Prize Pool',
      items: [
        { label: 'Total Pool Value', value: `£${stats.totalPoolValue.toFixed(2)}`, color: '#f59e0b' },
        { label: 'Total Jackpot', value: `£${stats.totalJackpot.toFixed(2)}`, color: '#ef4444' },
        { label: 'Total Paid Out', value: `£${stats.totalPaid.toFixed(2)}`, color: '#10b981' },
        { label: 'Pending Payouts', value: `£${stats.totalPending.toFixed(2)}`, color: '#f59e0b' },
      ],
    },
    {
      title: '🎰 Draw Statistics',
      items: [
        { label: 'Published Draws', value: stats.totalDraws, color: '#6366f1' },
        { label: 'Total Winners', value: stats.totalWinners, color: '#10b981' },
        { label: '5-Match (Jackpot)', value: stats.fiveMatchWins, color: '#f59e0b' },
        { label: '4-Match', value: stats.fourMatchWins, color: '#06b6d4' },
        { label: '3-Match', value: stats.threeMatchWins, color: '#818cf8' },
      ],
    },
    {
      title: '💚 Charity Impact',
      items: [
        { label: 'Charities Registered', value: stats.totalCharities, color: '#10b981' },
        { label: 'Est. Monthly Contributions', value: `£${stats.charityTotal.toFixed(2)}`, color: '#10b981' },
      ],
    },
  ];

  return (
    <div className="page-container">
      <div className="section-header">
        <h1>📊 <span className="gradient-text">Reports & Analytics</span></h1>
        <p>Comprehensive platform statistics and insights</p>
      </div>

      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>{section.title}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {section.items.map((item, i) => (
              <div key={i} className="stat-card">
                <div className="stat-value" style={{ color: item.color }}>{item.value}</div>
                <div className="stat-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
