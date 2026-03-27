'use client';

import { useState, useEffect } from 'react';

const scores = [
  { score: 34, date: '12 Mar 2026', latest: true },
  { score: 28, date: '05 Mar 2026', latest: false },
  { score: 41, date: '22 Feb 2026', latest: false },
  { score: null, date: null, latest: false },
  { score: null, date: null, latest: false },
];

export default function DashboardPreview() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setDays(Math.max(0, Math.ceil((end - now) / 86400000)));
  }, []);

  const monthName = new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <section style={{ background: '#0C0C0C', padding: '120px 48px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{
          fontSize: 11, color: '#5C5C5C', textTransform: 'uppercase',
          letterSpacing: '0.2em', marginBottom: 32, fontFamily: 'var(--font-sans)',
        }}>
          05 / YOUR DASHBOARD
        </div>

        <h2 className="reveal" style={{
          fontFamily: 'var(--font-serif)', fontSize: 56, fontWeight: 400,
          color: '#F0EDE8', lineHeight: 1.15, marginBottom: 64,
        }}>
          Built for clarity.
        </h2>

        {/* Dashboard panel */}
        <div className="reveal" style={{
          background: '#141414', border: '1px solid #2A2A2A', padding: 48,
        }}>
          {/* Top bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid #2A2A2A', paddingBottom: 20, marginBottom: 32,
          }}>
            <span style={{
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em',
              color: '#5C5C5C', fontFamily: 'var(--font-sans)',
            }}>FAIRWAY DASHBOARD</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: '#F0EDE8', fontFamily: 'var(--font-sans)' }}>James K.</span>
              <div style={{
                width: 32, height: 32, border: '1px solid #2A2A2A',
                background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: '#5C5C5C', fontWeight: 500, fontFamily: 'var(--font-mono)',
              }}>JK</div>
            </div>
          </div>

          {/* Stat row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            marginBottom: 40,
          }}>
            {[
              { label: 'TOTAL WINNINGS', value: '£0.00' },
              { label: 'DRAW STATUS', value: 'ACTIVE' },
              { label: 'SCORES LOGGED', value: '3 / 5' },
              { label: 'CHARITY GIVEN', value: '£1.00/mo' },
            ].map((s, i) => (
              <div key={s.label} style={{
                padding: '16px 20px',
                borderRight: i < 3 ? '1px solid #2A2A2A' : 'none',
              }}>
                <div style={{
                  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
                  color: '#5C5C5C', marginBottom: 8, fontFamily: 'var(--font-sans)',
                }}>{s.label}</div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 18,
                  color: s.label === 'DRAW STATUS' ? '#E8FF00' : '#F0EDE8',
                  fontWeight: 400,
                }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Main area — 2 columns */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
          }}>
            {/* Score log */}
            <div>
              <div style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
                color: '#5C5C5C', marginBottom: 16, fontFamily: 'var(--font-sans)',
              }}>YOUR SCORES · ROLLING 5</div>
              {scores.map((s, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr auto',
                  alignItems: 'center', height: 48,
                  borderTop: '1px solid #2A2A2A',
                  ...(i === scores.length - 1 ? { borderBottom: '1px solid #2A2A2A' } : {}),
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 14,
                    color: s.score ? '#F0EDE8' : '#2A2A2A', textAlign: 'center',
                  }}>{s.score || '\u2014'}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12,
                    color: '#5C5C5C', paddingLeft: 16,
                  }}>{s.date || '\u2014'}</span>
                  <span style={{
                    fontSize: 11, textTransform: 'uppercase',
                    letterSpacing: '0.1em', paddingRight: 8,
                    color: s.latest ? '#E8FF00' : '#5C5C5C', fontFamily: 'var(--font-sans)',
                  }}>{s.latest ? 'LATEST' : s.score ? 'STABLEFORD' : ''}</span>
                </div>
              ))}
            </div>

            {/* Draw entry */}
            <div>
              <div style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
                color: '#5C5C5C', marginBottom: 16, fontFamily: 'var(--font-sans)',
              }}>{monthName} DRAW</div>

              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 32,
                color: '#E8FF00', marginBottom: 32,
              }}>{days} DAYS LEFT</div>

              <div style={{
                display: 'flex', gap: 12, marginBottom: 24,
              }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} style={{
                    width: 48, height: 48, border: '1px solid #2A2A2A',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontFamily: 'var(--font-mono)',
                    fontSize: 16, color: '#5C5C5C', background: '#1A1A1A',
                  }}>?</div>
                ))}
              </div>

              <div style={{
                fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: '#5C5C5C', fontFamily: 'var(--font-sans)',
              }}>
                YOUR ENTRIES:{' '}
                <span style={{ fontFamily: 'var(--font-mono)', color: '#F0EDE8' }}>
                  34, 28, 41, —, —
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section h2 { font-size: 36px !important; }
          section > div > div:last-child {
            padding: 24px !important;
          }
          section > div > div:last-child > div:nth-child(2) {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          section > div > div:last-child > div:nth-child(2) > div:nth-child(2) {
            border-right: none !important;
          }
          section > div > div:last-child > div:last-child {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
