export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #2A2A2A', background: '#0C0C0C', padding: '32px 48px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16, maxWidth: 1440, margin: '0 auto',
      }}>
        <span style={{
          fontSize: 11, fontWeight: 500, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#5C5C5C', fontFamily: 'var(--font-sans)',
        }}>
          FAIRWAY © 2026
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {['Privacy', 'Terms', 'Responsible Play', 'help@fairway.co'].map((t) => (
            <span key={t} className="text-link-muted" style={{ fontSize: 11, letterSpacing: '0.1em', fontFamily: 'var(--font-sans)' }}>{t}</span>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          footer { padding: 32px 24px !important; }
          footer > div { flex-direction: column; align-items: flex-start !important; }
        }
      `}</style>
    </footer>
  );
}
