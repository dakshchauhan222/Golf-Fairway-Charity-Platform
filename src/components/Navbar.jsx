'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, profile, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
          }}>
            🏆
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-text-primary)' }}>
            Golf<span style={{ color: 'var(--color-primary-light)' }}>Charity</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }}
        className="desktop-nav"
        >
          <Link href="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }}>
            Home
          </Link>
          <Link href="/charities" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }}>
            Charities
          </Link>
          {!loading && user && (
            <>
              <Link href="/dashboard" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                Dashboard
              </Link>
              {profile?.role === 'admin' && (
                <Link href="/admin" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="desktop-nav">
          {!loading && !user && (
            <>
              <Link href="/login" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Log In
              </Link>
              <Link href="/signup" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Sign Up
              </Link>
            </>
          )}
          {!loading && user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                {profile?.name || user.email}
              </span>
              <button onClick={signOut} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-nav-toggle"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-primary)',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
        className="mobile-menu"
        >
          <Link href="/" onClick={() => setMobileOpen(false)} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Home</Link>
          <Link href="/charities" onClick={() => setMobileOpen(false)} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Charities</Link>
          {user && (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Dashboard</Link>
              {profile?.role === 'admin' && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Admin</Link>
              )}
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="btn-secondary" style={{ width: 'fit-content' }}>Log Out</button>
            </>
          )}
          {!user && (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary" style={{ width: 'fit-content' }}>Log In</Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ width: 'fit-content' }}>Sign Up</Link>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
