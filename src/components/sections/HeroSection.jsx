'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = Math.max(0, end - now);
      setCd({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <>
      <section style={{
        position: 'relative', height: '100vh', minHeight: 600,
        background: '#0C0C0C', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        paddingBottom: 0,
        borderBottom: '1px solid #2A2A2A',
      }}>
        {/* Vertical ticker — top right */}
        <div style={{
          position: 'absolute', right: 48, top: 80,
          writingMode: 'vertical-rl', transform: 'rotate(180deg)',
          fontSize: 10, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: '#5C5C5C', fontFamily: 'var(--font-mono)',
          whiteSpace: 'nowrap',
        }}>
          DRAW CLOSES IN — {pad(cd.d)}D {pad(cd.h)}H {pad(cd.m)}M —
        </div>

        {/* Bottom left content */}
        <div style={{
          padding: '80px 48px 64px 48px',
          maxWidth: 760,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 500, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#5C5C5C', marginBottom: 32,
            fontFamily: 'var(--font-sans)',
          }}>
            EST. 2024 · MONTHLY DRAW PLATFORM
          </div>

          <h1 style={{ margin: 0, padding: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }} className="hero-grid">
              <div style={{ textAlign: 'left', animation: 'fadeInLeft 1s ease-out forwards' }}>
                <span style={{
                  fontSize: '7rem', fontWeight: 700,
                  fontFamily: 'var(--font-inter)', color: '#F0EDE8', lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>Score.</span>
              </div>
              <div style={{ textAlign: 'center', animation: 'fadeInUp 1s ease-out 0.2s forwards', opacity: 0 }}>
                <span style={{
                  fontSize: '7rem', fontWeight: 700,
                  fontFamily: 'var(--font-inter)', color: '#F0EDE8', lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>Draw.</span>
              </div>
              <div style={{ textAlign: 'right', animation: 'fadeInRight 1s ease-out 0.4s forwards', opacity: 0 }}>
                <span style={{
                  fontSize: '7rem', fontWeight: 700,
                  background: 'linear-gradient(135deg, #E8FF00, #DFFF00)', WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  fontFamily: 'var(--font-inter)', lineHeight: 1,
                  letterSpacing: '-0.02em',
                  cursor: 'pointer', transition: 'transform 0.3s, filter 0.3s',
                }} onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.filter = 'drop-shadow(0 0 20px rgba(232,255,0,0.5))'; }}
                   onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'none'; }}>
                  Give.
                </span>
              </div>
            </div>
          </h1>

          <p style={{
            fontSize: '1.5rem', fontWeight: 400, color: '#B8B5B0',
            fontFamily: 'var(--font-sans)', lineHeight: 1.4,
            maxWidth: '600px', margin: '0 auto 3rem auto',
            animation: 'fadeInUp 1s ease-out 0.6s forwards', opacity: 0,
          }}>
            Turn your golf performance into winning opportunities — while making a real-world impact.
          </p>

          {/* Mobile CTA (hidden on desktop) */}
          <div style={{ marginTop: 32, display: 'none' }}>
            <Link href="/signup">
              <button className="cta-begin">Begin →</button>
            </Link>
          </div>
        </div>

        {/* Bottom right CTA (desktop only) */}
        <div style={{ position: 'absolute', bottom: 64, right: 48, display: 'block' }}>
          <Link href="/signup">
            <button className="cta-begin">Begin →</button>
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section:first-of-type {
            justify-content: flex-end !important;
            padding-bottom: 64px !important;
          }
          section:first-of-type > div:nth-child(2) {
            padding: 80px 24px 0 24px !important;
          }
          section:first-of-type h1 span {
            font-size: 52px !important;
          }
          section:first-of-type > div:nth-child(2) h1 {
            margin-bottom: 32px;
          }
          section:first-of-type > div:nth-child(2) > div:last-child {
            display: flex !important;
            margin-top: 32px;
          }
          section:first-of-type > div:nth-child(3) {
            display: none !important;
          }
          section:first-of-type > div:first-child {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
