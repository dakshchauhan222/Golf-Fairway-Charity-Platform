'use client';

import Link from 'next/link';

const charities = [
  { name: 'Cancer Research UK', tag: 'HEALTH', pct: 80, amount: '3,200' },
  { name: 'Mind UK', tag: 'MENTAL HEALTH', pct: 60, amount: '2,800' },
  { name: "St. Jude's", tag: 'CHILDREN', pct: 48, amount: '1,900' },
  { name: 'WaterAid', tag: 'GLOBAL AID', pct: 35, amount: '1,400' },
];

export default function CharitySection() {
  return (
    <section style={{ background: '#0C0C0C', padding: '160px 48px', borderBottom: '1px solid #2A2A2A', minHeight: '115vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '100%', maxWidth: 1600, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 100,
      }}>
        {/* Left — scrollable */}
        <div>
          <div className="reveal" style={{
            fontSize: 11, color: '#5C5C5C', textTransform: 'uppercase',
            letterSpacing: '0.2em', marginBottom: 32, fontFamily: 'var(--font-sans)',
          }}>
            03 / CHARITY IMPACT
          </div>

          <h2 className="reveal" style={{
            fontFamily: 'var(--font-serif)', fontSize: 84, fontWeight: 400,
            fontStyle: 'italic', color: '#F0EDE8', lineHeight: 1.1,
            maxWidth: 700, marginBottom: 64,
          }}>
            You choose who benefits.
          </h2>

          <div>
            {charities.map((c, i) => (
              <div key={c.name} className="reveal" style={{
                borderTop: '1px solid #2A2A2A',
                padding: '32px 0',
                ...(i === charities.length - 1 ? { borderBottom: '1px solid #2A2A2A' } : {}),
              }}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16,
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-serif)', fontSize: 28,
                    fontWeight: 400, color: '#F0EDE8',
                  }}>{c.name}</span>
                  <span style={{
                    fontSize: 11, textTransform: 'uppercase', color: '#5C5C5C',
                    border: '1px solid #2A2A2A', padding: '4px 8px',
                    letterSpacing: '0.1em', fontFamily: 'var(--font-sans)',
                  }}>{c.tag}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flex: 1, height: 2, background: '#2A2A2A', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, height: '100%',
                      width: `${c.pct}%`, background: '#E8FF00',
                    }} />
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 13,
                    color: '#E8FF00', whiteSpace: 'nowrap',
                  }}>£{c.amount}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ marginTop: 32 }}>
            <Link href="/charities" className="text-link-muted">
              View all 12 charities →
            </Link>
          </div>
        </div>

        {/* Right — sticky stat block */}
        <div style={{ position: 'sticky', top: 120, alignSelf: 'start' }}>
          <div className="reveal">
            <div style={{
              fontFamily: 'var(--font-serif)', fontSize: 96, fontWeight: 400,
              color: '#E8FF00', lineHeight: 1,
            }}>£12,400</div>
            <div style={{
              fontSize: 13, textTransform: 'uppercase', color: '#5C5C5C',
              letterSpacing: '0.15em', marginTop: 8, marginBottom: 48,
              fontFamily: 'var(--font-sans)',
            }}>donated in 2025</div>
          </div>

          <div style={{ borderTop: '1px solid #2A2A2A' }}>
            {[
              { val: '12', label: 'charities supported' },
              { val: '100%', label: 'reaches charity directly' },
              { val: '£0', label: 'platform fee on donations' },
            ].map((s) => (
              <div key={s.label} className="reveal" style={{
                borderBottom: '1px solid #2A2A2A', padding: '24px 0',
              }}>
                <div style={{
                  fontFamily: 'var(--font-serif)', fontSize: 40,
                  fontWeight: 400, color: '#F0EDE8', lineHeight: 1.2,
                }}>{s.val}</div>
                <div style={{
                  fontSize: 12, color: '#5C5C5C', marginTop: 4,
                  fontFamily: 'var(--font-sans)',
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          section > div > div:last-child {
            position: relative !important;
            top: auto !important;
          }
          section h2 { font-size: 42px !important; }
          section > div > div:last-child > div:first-child > div:first-child {
            font-size: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
