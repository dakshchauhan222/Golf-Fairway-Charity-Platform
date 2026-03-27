'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { supabase, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    totalCharities: 0,
    totalDraws: 0,
    totalPrizePool: 0,
    totalCharityContributions: 0,
    pendingPayouts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [usersRes, activeRes, charitiesRes, drawsRes, poolRes, winnersRes] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('subscription_status', 'active'),
        supabase.from('charities').select('id', { count: 'exact', head: true }),
        supabase.from('draws').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('prize_pool').select('total_pool'),
        supabase.from('winners').select('prize_amount, payment_status'),
      ]);

      const totalPool = (poolRes.data || []).reduce((s, p) => s + parseFloat(p.total_pool || 0), 0);
      const pending = (winnersRes.data || []).filter(w => w.payment_status === 'pending').length;

      setStats({
        totalUsers: usersRes.count || 0,
        activeSubscribers: activeRes.count || 0,
        totalCharities: charitiesRes.count || 0,
        totalDraws: drawsRes.count || 0,
        totalPrizePool: totalPool,
        pendingPayouts: pending,
      });
      setLoading(false);
    }
    if (!authLoading) loadStats();
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#6366f1' },
    { label: 'Active Subscribers', value: stats.activeSubscribers, icon: '✅', color: '#10b981' },
    { label: 'Total Prize Pool', value: `£${stats.totalPrizePool.toFixed(2)}`, icon: '💰', color: '#f59e0b' },
    { label: 'Published Draws', value: stats.totalDraws, icon: '🎰', color: '#06b6d4' },
    { label: 'Charities', value: stats.totalCharities, icon: '💚', color: '#10b981' },
    { label: 'Pending Payouts', value: stats.pendingPayouts, icon: '⏳', color: '#ef4444' },
  ];

  const navItems = [
    { href: '/admin/users', icon: '👥', label: 'User Management', desc: 'View and manage all users' },
    { href: '/admin/scores', icon: '⛳', label: 'Score Management', desc: 'View and edit user scores' },
    { href: '/admin/charities', icon: '💚', label: 'Charity Management', desc: 'Add, edit, delete charities' },
    { href: '/admin/draws', icon: '🎰', label: 'Draw Management', desc: 'Simulate and publish draws' },
    { href: '/admin/winners', icon: '🏆', label: 'Winners', desc: 'Approve proofs and payouts' },
    { href: '/admin/reports', icon: '📊', label: 'Reports', desc: 'Analytics and statistics' },
  ];

  return (
    <div className="page-container">
      <div className="section-header">
        <h1>🔧 <span className="gradient-text">Admin Dashboard</span></h1>
        <p>Platform overview and management</p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '40px',
      }}>
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
            </div>
            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Quick Access</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
      }}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card" style={{ padding: '24px', cursor: 'pointer' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '6px' }}>{item.label}</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
