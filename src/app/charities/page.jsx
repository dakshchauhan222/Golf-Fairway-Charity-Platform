'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export default function CharitiesPage() {
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all / featured
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      let query = supabase.from('charities').select('*').order('name');
      if (filter === 'featured') query = query.eq('is_featured', true);
      const { data } = await query;
      setCharities(data || []);
      setLoading(false);
    }
    load();
  }, [filter]);

  const filtered = charities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container" style={{ maxWidth: '1100px' }}>
      <div className="section-header" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>
          Our <span className="gradient-text">Charities</span>
        </h1>
        <p style={{ maxWidth: '600px', margin: '12px auto 0' }}>
          Every subscription makes a real impact. Explore the causes you can support.
        </p>
      </div>

      {/* Search & Filter */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '40px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search charities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'featured'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
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
              {f === 'all' ? '🌍 All' : '⭐ Featured'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-secondary)' }}>
          No charities found matching your search.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {filtered.map((charity) => (
            <Link key={charity.id} href={`/charities/${charity.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-card" style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'var(--gradient-success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                  }}>
                    💚
                  </div>
                  {charity.is_featured && (
                    <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>⭐ Featured</span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px' }}>{charity.name}</h3>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  flex: 1,
                }}>
                  {charity.description?.substring(0, 150)}...
                </p>
                <div style={{
                  marginTop: '16px',
                  color: 'var(--color-primary-light)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }}>
                  Learn more →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
