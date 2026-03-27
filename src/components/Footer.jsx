import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      background: 'rgba(15, 23, 42, 0.9)',
      padding: '48px 24px 24px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}>
                🏆
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                Golf<span style={{ color: 'var(--color-primary-light)' }}>Charity</span>
              </span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
              Play golf, win prizes, and make a real difference for charities that matter.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Home</Link>
              <Link href="/charities" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Charities</Link>
              <Link href="/signup" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Subscribe</Link>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Platform
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/dashboard" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Dashboard</Link>
              <Link href="/dashboard/scores" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>My Scores</Link>
              <Link href="/dashboard/draws" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Draws</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>help@golfcharity.com</span>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Terms of Service</span>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Privacy Policy</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '24px',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.8rem',
        }}>
          © 2026 GolfCharity Platform. All rights reserved. Built with ❤️ for charity.
        </div>
      </div>
    </footer>
  );
}
