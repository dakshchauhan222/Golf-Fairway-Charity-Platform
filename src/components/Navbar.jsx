'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, profile, signOut, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(12,12,12,0.98)' : 'transparent',
      borderBottom: scrolled ? '1px solid #2A2A2A' : 'none',
      transition: 'background 300ms, border-color 300ms',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '64px',
      }}>
        <Link href="/" style={{
          fontSize: '13px', fontWeight: 500, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: '#F0EDE8', fontFamily: 'var(--font-sans)',
        }}>
          FAIRWAY
        </Link>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {!loading && !user && (
            <>
              <Link href="/signup" className="nav-link">Subscribe</Link>
              <span style={{ width: 1, height: 16, background: '#2A2A2A', margin: '0 16px' }} />
              <Link href="/login" className="nav-link">Sign In</Link>
            </>
          )}
          {!loading && user && (
            <>
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
              {profile?.role === 'admin' && (
                <>
                  <span style={{ width: 1, height: 16, background: '#2A2A2A', margin: '0 16px' }} />
                  <Link href="/admin" className="nav-link" style={{ color: '#E8FF00' }}>Admin</Link>
                </>
              )}
              <span style={{ width: 1, height: 16, background: '#2A2A2A', margin: '0 16px' }} />
              <span style={{ fontSize: 13, color: '#5C5C5C', padding: '0 16px', fontFamily: 'var(--font-sans)' }}>
                {profile?.name || user.email}
              </span>
              <button onClick={signOut} className="nav-link">Sign Out</button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          nav > div { padding: 0 24px !important; height: 56px !important; }
        }
      `}</style>
    </nav>
  );
}
