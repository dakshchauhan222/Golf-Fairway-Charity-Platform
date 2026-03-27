'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CharityDetailPage() {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('charities').select('*').eq('id', id).single();
      setCharity(data);
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!charity) {
    return (
      <div className="page-container" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Charity not found</h1>
        <Link href="/charities" className="btn-primary">Back to Charities</Link>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <Link href="/charities" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '32px' }}>
        ← Back to Charities
      </Link>

      <div className="glass-card" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '18px',
            background: 'var(--gradient-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
          }}>
            💚
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{charity.name}</h1>
            {charity.is_featured && (
              <span className="badge badge-active" style={{ marginTop: '8px' }}>⭐ Featured Charity</span>
            )}
          </div>
        </div>

        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: '1rem',
          lineHeight: '1.8',
          marginBottom: '32px',
        }}>
          {charity.description}
        </p>

        <div style={{
          padding: '24px',
          borderRadius: '14px',
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          marginBottom: '28px',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#10b981', marginBottom: '12px' }}>
            How Your Subscription Helps
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.7' }}>
            When you subscribe and select {charity.name} as your charity, a minimum of 10% of your subscription fee 
            is donated directly to them. You can choose to contribute more if you wish. Together, our subscribers 
            have already made a significant impact.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/signup" className="btn-primary">
            Subscribe & Support →
          </Link>
          <Link href="/charities" className="btn-secondary">
            View All Charities
          </Link>
        </div>
      </div>
    </div>
  );
}
