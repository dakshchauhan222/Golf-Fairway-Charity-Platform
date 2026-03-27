'use client';

import Link from 'next/link';

export default function ClosingCTA() {
  return (
    <section style={{
      background: '#E8FF00', padding: '120px 48px', borderTop: '1px solid #2A2A2A',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{
          fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em',
          color: '#0C0C0C', marginBottom: 32, fontFamily: 'var(--font-sans)',
        }}>
          START NOW
        </div>

        <h2 className="reveal" style={{
          fontFamily: 'var(--font-serif)', fontSize: 72, fontWeight: 400,
          color: '#0C0C0C', lineHeight: 1.1, marginBottom: 32,
        }}>
          847 golfers are<br />already playing.
        </h2>

        <p className="reveal" style={{
          fontSize: 18, fontWeight: 300, color: '#0C0C0C', maxWidth: 480,
          lineHeight: 1.7, marginBottom: 48, opacity: 0.7, fontFamily: 'var(--font-sans)',
        }}>
          Join them. Pick a charity. Enter your scores. And every month,
          you have a shot at the pool.
        </p>

        <div className="reveal" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/signup">
            <button className="cta-dark">Subscribe Now →</button>
          </Link>
          <Link href="/charities">
            <button className="cta-dark-outline">Explore Charities</button>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section h2 { font-size: 42px !important; }
          section { padding: 80px 20px !important; }
        }
      `}</style>
    </section>
  );
}
